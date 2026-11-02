# ─────────────────────────────────────────────────────────────────────────────
#  NearestForest - local PowerShell deploy trigger
#
#  There is no build step: app/ is plain HTML/CSS/JS served as static files,
#  and the vhost docroot is a symlink to the checkout's app/. So the deploy is
#  "push, then pull on the server". This wrapper runs the tests first, refuses
#  to ship an app change with a stale service-worker cache key, pushes, then
#  runs scripts/deploy.sh over SSH.
#
#  SshHost is a ~/.ssh/config alias on purpose: the account username, host and
#  port live in that file and not in this public repo.
#
#  Usage:
#    pwsh ./scripts/deploy.ps1                # test, push, deploy
#    pwsh ./scripts/deploy.ps1 -DryRun        # show what would run, change nothing
#    pwsh ./scripts/deploy.ps1 -SkipTest      # skip the node self-tests
#    pwsh ./scripts/deploy.ps1 -Force         # deploy despite a stale CACHE key
# ─────────────────────────────────────────────────────────────────────────────
[CmdletBinding()]
param(
    [string]$SshHost   = 'hostinger',
    [string]$Site      = 'forestlocator.enhanceify.co.uk',
    [string]$RemoteDir = 'domains/forestlocator.enhanceify.co.uk/repo',
    [string]$Branch    = 'main',

    [switch]$SkipTest,
    [switch]$Force,
    [switch]$DryRun
)

$ErrorActionPreference = 'Stop'
$repoRoot = Split-Path -Parent $PSScriptRoot
Set-Location $repoRoot

function Write-Step {
    param([string]$Label, [string]$Text)
    Write-Host ""
    Write-Host "$Label " -ForegroundColor Cyan -NoNewline
    Write-Host $Text
}

Write-Host ""
Write-Host "==================================================" -ForegroundColor Cyan
Write-Host " $Site - Deploy pipeline" -ForegroundColor Cyan
Write-Host "==================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "  Target : $SshHost (see ~/.ssh/config)"
Write-Host "  Remote : ~/$RemoteDir"
Write-Host "  Branch : $Branch"
Write-Host "  Tests  : $(if ($SkipTest) { 'SKIPPED' } else { 'yes' })"
Write-Host "  DryRun : $(if ($DryRun)   { 'yes'     } else { 'no'  })"

$currentBranch = (git rev-parse --abbrev-ref HEAD).Trim()
if ($currentBranch -ne $Branch) {
    throw "On branch '$currentBranch' but deploying '$Branch'. Switch branch or pass -Branch $currentBranch."
}

# ── 1. Self-tests ────────────────────────────────────────────────────
if (-not $SkipTest) {
    Write-Step "[1/5]" "Running self-tests..."
    if ($DryRun) {
        Write-Host "       (dry run - would run: node scripts/selftest.js)"
    } else {
        node scripts/selftest.js
        if ($LASTEXITCODE -ne 0) { throw "Self-tests failed. Fix before deploying." }
    }
} else {
    Write-Step "[1/5]" "Skipping self-tests (-SkipTest)"
}

# ── 2. Service-worker cache guard ────────────────────────────────────
# sw.js precaches everything. Shipping changed files under a cache key that is
# already installed leaves every installed copy on the old dataset forever, and
# it fails silently, which is exactly the kind of bug worth a hard stop.
Write-Step "[2/5]" "Checking the service-worker cache key..."
# The server pulls from GitHub, so GitHub's branch is what is live (see deploy.py).
$Live = "github"
git fetch --quiet $Live
git rev-parse --verify --quiet "$Live/$Branch" *> $null
if ($LASTEXITCODE -ne 0) {
    Write-Host "       $Live/$Branch does not exist yet - first deploy, nothing to compare."
} else {
    # .well-known/ is read by Android and other servers, never by the service worker.
    $changedApp = @(git diff --name-only "$Live/$Branch..HEAD" -- app/ ':(exclude)app/.well-known' | Where-Object { $_ })
    if ($changedApp.Count -eq 0) {
        Write-Host "       No changes under app/ - nothing to invalidate."
    } else {
        $swDiff = @(git diff "$Live/$Branch..HEAD" -- app/sw.js | Select-String -Pattern '^\+var CACHE' )
        if ($swDiff.Count -eq 0) {
            Write-Host "       $($changedApp.Count) file(s) changed under app/ but CACHE in app/sw.js was not bumped:" -ForegroundColor Yellow
            $changedApp | ForEach-Object { Write-Host "         $_" }
            if (-not $Force) {
                throw "Stale service-worker cache key. Bump CACHE in app/sw.js, or pass -Force if you are certain."
            }
            Write-Host "       -Force given, continuing with a stale cache key." -ForegroundColor Yellow
        } else {
            Write-Host "       OK CACHE was bumped alongside $($changedApp.Count) app change(s)."
        }
    }
}

# ── 3. Refuse to ship an unclean tree silently ───────────────────────
Write-Step "[3/5]" "Checking the working tree..."
$dirty = git status --porcelain 2>$null
if ($dirty) {
    Write-Host "       Uncommitted changes (these will NOT ship):" -ForegroundColor Yellow
    Write-Host $dirty
    if (-not $Force -and -not $DryRun) {
        throw "Commit your work and rerun, or pass -Force to deploy HEAD as-is."
    }
} else {
    Write-Host "       Clean."
}

# ── 4. Push ──────────────────────────────────────────────────────────
Write-Step "[4/5]" "Pushing $Branch to origin and $Live..."
foreach ($r in @('origin', $Live)) {
    if (-not (git config --get "remote.$r.url" 2>$null)) { throw "No git remote '$r'. origin is Forgejo; $Live is what the server pulls from." }
    if ($DryRun) {
        Write-Host "       (dry run - would run: git push $r $Branch)"
    } else {
        git push $r $Branch
        if ($LASTEXITCODE -ne 0) { throw "git push $r failed." }
    }
}

# ── 5. Trigger the server-side deploy ────────────────────────────────
Write-Step "[5/5]" "Running deploy.sh on $SshHost..."
$remoteCmd = "REPO_DIR=`"`$HOME/$RemoteDir`" BRANCH='$Branch' SITE='$Site' bash `"`$HOME/$RemoteDir/scripts/deploy.sh`""
if ($DryRun) {
    Write-Host "       (dry run - would run: ssh $SshHost `"$remoteCmd`")"
    Write-Host ""
    Write-Host "Dry run complete. No changes made." -ForegroundColor Yellow
    exit 0
}

ssh $SshHost $remoteCmd
$exit = $LASTEXITCODE
# The server pulls from its own remote, which need not be the one pushed to above.
# Same check as deploy.py; see the comment there.
if ($exit -eq 0) {
    $local = (git rev-parse HEAD).Trim()
    $serverHead = "$(ssh $SshHost "git -C `"`$HOME/$RemoteDir`" rev-parse HEAD")".Trim()
    if ($serverHead -ne $local) {
        Write-Host "FAIL: server is at $serverHead, local HEAD is $local. Nothing shipped." -ForegroundColor Red
        Write-Host "      The server pulls from a remote that was not pushed to. Check: ssh $SshHost git -C $RemoteDir remote -v" -ForegroundColor Red
        $exit = 1
    }
}

Write-Host ""
Write-Host "==================================================" -ForegroundColor Cyan
if ($exit -eq 0) {
    Write-Host " Deploy finished cleanly." -ForegroundColor Green
    Write-Host " https://$Site/" -ForegroundColor Green
} else {
    Write-Host " Deploy exited with code $exit" -ForegroundColor Red
}
Write-Host "==================================================" -ForegroundColor Cyan
Write-Host ""
exit $exit
