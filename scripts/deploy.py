#!/usr/bin/env python3
"""NearestForest - local deploy trigger, for a machine with no PowerShell.

The same five steps, flags and refusals as scripts/deploy.ps1 (card 0087): run the
self-tests, refuse an app/ change whose service-worker CACHE was not bumped, refuse a
dirty tree, push, then run scripts/deploy.sh on the host over SSH. Keep the two in step
until deploy.ps1 is retired.

SSH_HOST is a ~/.ssh/config alias on purpose: the account username, host and port live
in that file and not in this public repo. Standard library only.

Usage:
  python3 scripts/deploy.py              # test, push, deploy
  python3 scripts/deploy.py --dry-run    # show what would run, change nothing
  python3 scripts/deploy.py --skip-test  # skip the node self-tests
  python3 scripts/deploy.py --force      # deploy despite a stale CACHE key
"""
import argparse
import os
import subprocess
import sys

ap = argparse.ArgumentParser(description='Test, guard the cache key, push, pull on the server.')
ap.add_argument('--ssh-host', default='hostinger')
ap.add_argument('--site', default='forestlocator.enhanceify.co.uk')
ap.add_argument('--remote-dir', default='domains/forestlocator.enhanceify.co.uk/repo')
ap.add_argument('--branch', default='main')
ap.add_argument('--skip-test', action='store_true')
ap.add_argument('--force', action='store_true')
ap.add_argument('--dry-run', action='store_true')
a = ap.parse_args()

os.chdir(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))


def die(msg):
    sys.stdout.flush()
    print(f'\nERROR: {msg}', file=sys.stderr)
    sys.exit(1)


def git(*args):
    r = subprocess.run(['git', *args], capture_output=True, text=True)
    return r.returncode, r.stdout


def step(label, text):
    print(f'\n{label} {text}')


print('\n==================================================')
print(f' {a.site} - Deploy pipeline')
print('==================================================\n')
print(f'  Target : {a.ssh_host} (see ~/.ssh/config)')
print(f'  Remote : ~/{a.remote_dir}')
print(f'  Branch : {a.branch}')
print(f"  Tests  : {'SKIPPED' if a.skip_test else 'yes'}")
print(f"  DryRun : {'yes' if a.dry_run else 'no'}")

current = git('rev-parse', '--abbrev-ref', 'HEAD')[1].strip()
if current != a.branch:
    die(f"On branch '{current}' but deploying '{a.branch}'. Switch branch or pass --branch {current}.")

# 1. Self-tests
if not a.skip_test:
    step('[1/5]', 'Running self-tests...')
    if a.dry_run:
        print('       (dry run - would run: node scripts/selftest.js)')
    elif subprocess.run(['node', 'scripts/selftest.js']).returncode != 0:
        die('Self-tests failed. Fix before deploying.')
else:
    step('[1/5]', 'Skipping self-tests (--skip-test)')

# 2. Service-worker cache guard. sw.js precaches everything. Shipping changed files under a
# cache key that is already installed leaves every installed copy on the old dataset forever,
# and it fails silently, which is exactly the kind of bug worth a hard stop.
step('[2/5]', 'Checking the service-worker cache key...')
if git('rev-parse', '--verify', '--quiet', f'origin/{a.branch}')[0] != 0:
    print(f'       origin/{a.branch} does not exist yet - first deploy, nothing to compare.')
else:
    rng = f'origin/{a.branch}..HEAD'
    # .well-known/ is read by Android and other servers, never by the service worker.
    changed = [f for f in git('diff', '--name-only', rng, '--', 'app/', ':(exclude)app/.well-known')[1].splitlines() if f]
    if not changed:
        print('       No changes under app/ - nothing to invalidate.')
    elif not any(l.startswith('+var CACHE') for l in git('diff', rng, '--', 'app/sw.js')[1].splitlines()):
        print(f'       {len(changed)} file(s) changed under app/ but CACHE in app/sw.js was not bumped:')
        for f in changed:
            print(f'         {f}')
        if not a.force:
            die('Stale service-worker cache key. Bump CACHE in app/sw.js, or pass --force if you are certain.')
        print('       --force given, continuing with a stale cache key.')
    else:
        print(f'       OK CACHE was bumped alongside {len(changed)} app change(s).')

# 3. Refuse to ship an unclean tree silently
step('[3/5]', 'Checking the working tree...')
dirty = git('status', '--porcelain')[1].rstrip()
if dirty:
    print('       Uncommitted changes (these will NOT ship):')
    print(dirty)
    if not a.force and not a.dry_run:
        die('Commit your work and rerun, or pass --force to deploy HEAD as-is.')
else:
    print('       Clean.')

# 4. Push
step('[4/5]', f'Pushing to origin/{a.branch}...')
if not git('config', '--get', 'remote.origin.url')[1].strip():
    die("No git remote 'origin'. The server deploys by pulling, so a remote is required.")
if a.dry_run:
    print(f'       (dry run - would run: git push origin {a.branch})')
elif subprocess.run(['git', 'push', 'origin', a.branch]).returncode != 0:
    die('git push failed.')

# 5. Trigger the server-side deploy
step('[5/5]', f'Running deploy.sh on {a.ssh_host}...')
remote = (f'REPO_DIR="$HOME/{a.remote_dir}" BRANCH=\'{a.branch}\' SITE=\'{a.site}\' '
          f'bash "$HOME/{a.remote_dir}/scripts/deploy.sh"')
if a.dry_run:
    print(f'       (dry run - would run: ssh {a.ssh_host} "{remote}")')
    print('\nDry run complete. No changes made.')
    sys.exit(0)

code = subprocess.run(['ssh', a.ssh_host, remote]).returncode
# The server pulls from its own remote, which need not be the one pushed to above
# (it pulled from GitHub while origin moved to Forgejo, and every deploy "finished
# cleanly" with nothing shipped). Checked here, not in deploy.sh, because the copy
# of deploy.sh that runs first is the server's old one.
if code == 0:
    local = git('rev-parse', 'HEAD')[1].strip()
    live = subprocess.run(['ssh', a.ssh_host, f'git -C "$HOME/{a.remote_dir}" rev-parse HEAD'],
                          capture_output=True, text=True).stdout.strip()
    if live != local:
        print(f'\nFAIL: server is at {live or "<unknown>"}, local HEAD is {local}. Nothing shipped.')
        print('      The server pulls from a remote that was not pushed to. Check: '
              f'ssh {a.ssh_host} git -C {a.remote_dir} remote -v')
        code = 1
print('\n==================================================')
if code == 0:
    print(' Deploy finished cleanly.')
    print(f' https://{a.site}/')
else:
    print(f' Deploy exited with code {code}')
print('==================================================\n')
sys.exit(code)
