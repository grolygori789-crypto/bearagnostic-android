[CmdletBinding()]
param(
    [Parameter(Mandatory = $true)]
    [string]$InputApk,

    [string]$Keystore = "$env:USERPROFILE\Documents\BenedictInteractive\Signing\bearagnostic-production.jks",

    [string]$KeyAlias = "bearagnostic-production",

    [string]$BuildToolsVersion = "36.0.0",

    [string]$OutputDirectory = ""
)

$ErrorActionPreference = "Stop"
Set-StrictMode -Version Latest

$ExpectedApplicationId = "com.benedictinteractive.bearagnostic"
$ExpectedCertificateSha256 = "503FB4A77B38E7129E20002EC6A0B1D4225FD189BB16E0C71EBAD88ECA88AE90"

function Fail([string]$Message) {
    throw "CUSTOMER RELEASE FAILED: $Message"
}

function Normalize-Hex([string]$Value) {
    return (($Value -replace '[^0-9A-Fa-f]', '').ToUpperInvariant())
}

$InputApk = (Resolve-Path -LiteralPath $InputApk).Path
if (-not (Test-Path -LiteralPath $Keystore -PathType Leaf)) {
    Fail "Production keystore not found at: $Keystore"
}

$SdkRoot = if ($env:ANDROID_SDK_ROOT) { $env:ANDROID_SDK_ROOT } elseif ($env:ANDROID_HOME) { $env:ANDROID_HOME } else { "$env:LOCALAPPDATA\Android\Sdk" }
$BuildTools = Join-Path $SdkRoot "build-tools\$BuildToolsVersion"
$ApkSigner = Join-Path $BuildTools "apksigner.bat"
$ZipAlign = Join-Path $BuildTools "zipalign.exe"
$ApkAnalyzer = Join-Path $SdkRoot "cmdline-tools\latest\bin\apkanalyzer.bat"

foreach ($Tool in @($ApkSigner, $ZipAlign, $ApkAnalyzer)) {
    if (-not (Test-Path -LiteralPath $Tool -PathType Leaf)) {
        Fail "Required Android tool not found: $Tool"
    }
}

$AppId = (& $ApkAnalyzer manifest application-id $InputApk).Trim()
$VersionName = (& $ApkAnalyzer manifest version-name $InputApk).Trim()
$VersionCode = (& $ApkAnalyzer manifest version-code $InputApk).Trim()
$Debuggable = ((& $ApkAnalyzer manifest debuggable $InputApk).Trim()).ToLowerInvariant()

if ($AppId -ne $ExpectedApplicationId) { Fail "Application ID is '$AppId', expected '$ExpectedApplicationId'." }
if ($Debuggable -ne "false") { Fail "APK is debuggable='$Debuggable'. Customer Release must be non-debuggable." }
if ($VersionName -match '-debug') { Fail "Debug version name detected: $VersionName" }

& $ZipAlign -c -p 4 $InputApk
if ($LASTEXITCODE -ne 0) { Fail "Input APK is not zipaligned." }

if ([string]::IsNullOrWhiteSpace($OutputDirectory)) {
    $OutputDirectory = Join-Path (Split-Path -Parent $InputApk) "production-signed"
}
New-Item -ItemType Directory -Path $OutputDirectory -Force | Out-Null
$OutputDirectory = (Resolve-Path -LiteralPath $OutputDirectory).Path

$SafeVersion = ($VersionName -replace '[^0-9A-Za-z._-]', '-')
$SignedApk = Join-Path $OutputDirectory "Bearagnostic-$SafeVersion.apk"
$ChecksumFile = "$SignedApk.sha256"
$ReportFile = Join-Path $OutputDirectory "Bearagnostic-$SafeVersion-release-report.txt"

$StoreSecure = Read-Host "Production keystore password" -AsSecureString
$KeySecure = Read-Host "Production key password (press Enter after typing; may be same as keystore password)" -AsSecureString
$StorePtr = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($StoreSecure)
$KeyPtr = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($KeySecure)
try {
    $env:BEARAGNOSTIC_KS_PASS = [Runtime.InteropServices.Marshal]::PtrToStringBSTR($StorePtr)
    $env:BEARAGNOSTIC_KEY_PASS = [Runtime.InteropServices.Marshal]::PtrToStringBSTR($KeyPtr)

    if (Test-Path -LiteralPath $SignedApk) { Remove-Item -LiteralPath $SignedApk -Force }

    & $ApkSigner sign `
        --ks $Keystore `
        --ks-key-alias $KeyAlias `
        --ks-pass env:BEARAGNOSTIC_KS_PASS `
        --key-pass env:BEARAGNOSTIC_KEY_PASS `
        --out $SignedApk `
        $InputApk
    if ($LASTEXITCODE -ne 0) { Fail "apksigner sign failed." }
}
finally {
    Remove-Item Env:BEARAGNOSTIC_KS_PASS -ErrorAction SilentlyContinue
    Remove-Item Env:BEARAGNOSTIC_KEY_PASS -ErrorAction SilentlyContinue
    if ($StorePtr -ne [IntPtr]::Zero) { [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($StorePtr) }
    if ($KeyPtr -ne [IntPtr]::Zero) { [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($KeyPtr) }
}

$VerifyOutput = (& $ApkSigner verify --verbose --print-certs $SignedApk 2>&1 | Out-String)
if ($LASTEXITCODE -ne 0) { Fail "Signed APK failed apksigner verification.`n$VerifyOutput" }

$CertLine = ($VerifyOutput -split "`r?`n" | Where-Object { $_ -match 'certificate SHA-256 digest:' } | Select-Object -First 1)
if (-not $CertLine) { Fail "Could not read signer certificate SHA-256 from apksigner output." }
$ActualCertificateSha256 = Normalize-Hex (($CertLine -split 'digest:', 2)[1])
if ($ActualCertificateSha256 -ne $ExpectedCertificateSha256) {
    Fail "Production certificate mismatch. Got $ActualCertificateSha256, expected $ExpectedCertificateSha256."
}

& $ZipAlign -c -p 4 $SignedApk
if ($LASTEXITCODE -ne 0) { Fail "Signed APK failed zipalign verification." }

$SignedAppId = (& $ApkAnalyzer manifest application-id $SignedApk).Trim()
$SignedVersionName = (& $ApkAnalyzer manifest version-name $SignedApk).Trim()
$SignedVersionCode = (& $ApkAnalyzer manifest version-code $SignedApk).Trim()
$SignedDebuggable = ((& $ApkAnalyzer manifest debuggable $SignedApk).Trim()).ToLowerInvariant()

if ($SignedAppId -ne $AppId) { Fail "Application ID changed after signing." }
if ($SignedVersionName -ne $VersionName) { Fail "Version name changed after signing." }
if ($SignedVersionCode -ne $VersionCode) { Fail "Version code changed after signing." }
if ($SignedDebuggable -ne "false") { Fail "Signed APK is unexpectedly debuggable." }

$Hash = (Get-FileHash -Algorithm SHA256 -LiteralPath $SignedApk).Hash.ToLowerInvariant()
"$Hash  $(Split-Path -Leaf $SignedApk)" | Set-Content -LiteralPath $ChecksumFile -Encoding ascii

$SourceReport = Join-Path (Split-Path -Parent $InputApk) "customer-release-report.txt"
$SourceCommit = "unknown"
if (Test-Path -LiteralPath $SourceReport) {
    $SourceLine = Get-Content -LiteralPath $SourceReport | Where-Object { $_ -like 'Source commit:*' } | Select-Object -First 1
    if ($SourceLine) { $SourceCommit = ($SourceLine -replace '^Source commit:\s*', '').Trim() }
}

@(
    "Bearagnostic Production Customer Release",
    "Source commit: $SourceCommit",
    "Application ID: $SignedAppId",
    "Version name: $SignedVersionName",
    "Version code: $SignedVersionCode",
    "Debuggable: $SignedDebuggable",
    "Production certificate SHA-256: $ActualCertificateSha256",
    "APK SHA-256: $Hash",
    "APK: $(Split-Path -Leaf $SignedApk)",
    "Status: production-signed; physical QA of this exact APK is still required before public distribution"
) | Set-Content -LiteralPath $ReportFile -Encoding utf8

Write-Host ""
Write-Host "PRODUCTION SIGNING PASS" -ForegroundColor Green
Write-Host "APK: $SignedApk"
Write-Host "SHA-256: $Hash"
Write-Host "Certificate: $ActualCertificateSha256"
Write-Host ""
Write-Host "Do not rebuild after this exact APK passes physical QA. Publish this same APK to Benedict and Uptodown." -ForegroundColor Yellow
