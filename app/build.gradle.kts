import java.io.File
import java.net.URI
import java.nio.charset.StandardCharsets
import java.security.MessageDigest

plugins {
    id("com.android.application")
}
val legacyCommit = "78a31c7752e171c0eafb63c0d0859f4072a193d6"
val generatedLegacyAssetsDir = layout.buildDirectory.dir("generated/legacyAssets").get().asFile
val generatedLegacyResDir = layout.buildDirectory.dir("generated/legacyRes").get().asFile
val legacyArchive = layout.buildDirectory.file("legacy-cache/bearagnostic-$legacyCommit.zip").get().asFile
val legacyExtractDir = layout.buildDirectory.dir("legacy-cache/extracted-$legacyCommit").get().asFile
val androidAdapter = layout.projectDirectory.file("src/main/legacy-adapter/android-native.js").asFile
val androidReview = layout.projectDirectory.file("src/main/legacy-adapter/android-review.js").asFile
val androidSettingsDetail = layout.projectDirectory.file("src/main/legacy-adapter/android-settings-detail.js").asFile
val androidSupport = layout.projectDirectory.file("src/main/legacy-adapter/android-support.js").asFile
val androidScanTrust = layout.projectDirectory.file("src/main/legacy-adapter/android-scan-trust.js").asFile
val androidLiveScan = layout.projectDirectory.file("src/main/legacy-adapter/android-live-scan.js").asFile
val androidScanMotionPolish = layout.projectDirectory.file("src/main/legacy-adapter/android-scan-motion-polish.js").asFile
val androidReviewMedia = layout.projectDirectory.file("src/main/legacy-adapter/android-review-media.js").asFile
val androidShareCard = layout.projectDirectory.file("src/main/legacy-adapter/android-share-card.js").asFile
val androidPremiumColor = layout.projectDirectory.file("src/main/legacy-adapter/android-premium-color.js").asFile
val androidEntitlement = layout.projectDirectory.file("src/main/legacy-adapter/android-entitlement.js").asFile
val androidHiddenItems = layout.projectDirectory.file("src/main/legacy-adapter/android-hidden-items.js").asFile
val androidCleanup = layout.projectDirectory.file("src/main/legacy-adapter/android-cleanup.js").asFile
val androidDuplicates = layout.projectDirectory.file("src/main/legacy-adapter/android-duplicates.js").asFile
val androidLargeFiles = layout.projectDirectory.file("src/main/legacy-adapter/android-large-files.js").asFile
val androidOlderFiles = layout.projectDirectory.file("src/main/legacy-adapter/android-older-files.js").asFile
val androidDownloads = layout.projectDirectory.file("src/main/legacy-adapter/android-downloads.js").asFile
val androidInstallers = layout.projectDirectory.file("src/main/legacy-adapter/android-installers.js").asFile
val androidArchives = layout.projectDirectory.file("src/main/legacy-adapter/android-archives.js").asFile
val androidZero = layout.projectDirectory.file("src/main/legacy-adapter/android-zero.js").asFile
val androidEmptyFolders = layout.projectDirectory.file("src/main/legacy-adapter/android-empty-folders.js").asFile
val androidAdvancedMedia = layout.projectDirectory.file("src/main/legacy-adapter/android-advanced-media.js").asFile
val androidProUi = layout.projectDirectory.file("src/main/legacy-adapter/android-pro-ui.js").asFile
val androidBilling = layout.projectDirectory.file("src/main/legacy-adapter/android-billing.js").asFile
val androidPlanStatus = layout.projectDirectory.file("src/main/legacy-adapter/android-plan-status.js").asFile
val androidReadability = layout.projectDirectory.file("src/main/legacy-adapter/android-readability.js").asFile
val androidCustomScan = layout.projectDirectory.file("src/main/legacy-adapter/android-custom-scan.js").asFile
val androidInsights = layout.projectDirectory.file("src/main/legacy-adapter/android-insights.js").asFile
val androidShellUx = layout.projectDirectory.file("src/main/legacy-adapter/android-shell-ux.js").asFile
val androidStabilization = layout.projectDirectory.file("src/main/legacy-adapter/android-stabilization.js").asFile
val androidLocalePolish = layout.projectDirectory.file("src/main/legacy-adapter/android-locale-polish.js").asFile
val androidBuildTruth = layout.projectDirectory.file("src/main/legacy-adapter/android-build-truth.js").asFile
val androidHomePolish = layout.projectDirectory.file("src/main/legacy-adapter/android-home-polish.js").asFile
val androidFinalPolish = layout.projectDirectory.file("src/main/legacy-adapter/android-final-polish.js").asFile
val androidReleaseTrust = layout.projectDirectory.file("src/main/legacy-adapter/android-release-trust.js").asFile
val nativeAssetsDir = layout.projectDirectory.dir("src/main/native-assets").asFile
fun gitBlobSha1(file: File): String {
    val bytes = file.readBytes()
    val digest = MessageDigest.getInstance("SHA-1")
    digest.update("blob ${bytes.size}\u0000".toByteArray(StandardCharsets.UTF_8))
    digest.update(bytes)
    return digest.digest().joinToString("") { "%02x".format(it) }
}
val legacyCriticalBlobs = mapOf(
    "index.html" to "b750e29c2ce2903ee6fc067d8ba37aceffcaca26",
    "css/app.css" to "c49dad3dbba48526a4df694965cd308e2def7ffb",
    "css/experience.css" to "7ea0fb9da7c9080725a5393390c7566f3d42a38d",
    "css/checkup.css" to "83fa118ac5f6cd0779ee540a6df4413c502f4ef4",
    "js/config/app-config.js" to "c96900f86b7090c026689d5138240baace223e1c",
    "js/config/i18n.js" to "6fc0a74d31e2663c355ea05b0bd238087cdfc3e0",
    "js/core/app.js" to "ae26324f8ad2fa82782147ffd3de9632c1132063",
    "js/core/checkup.js" to "9ab606bdd3ad5387b02bc6692f9d873fd57254b9",
    "assets/icons/app-icon-192.png" to "f9cff58fc54e6b0525c7f74922b0588aca6a9a9d",
    "assets/ui/glass-icons/checkup.webp" to "0c721aa279e9fca79b889fb6310f3c5180c6432c",
    "assets/ui/glass-icons/cleanup.webp" to "28ef6be3e4500ee5151e67b2f3223d25c408ff0f",
    "assets/ui/glass-icons/duplicates.webp" to "c0fc1982c5691c8e4db8cb50979468bed5198dbe",
    "assets/ui/glass-icons/large-files.webp" to "b2f72490163abe3ca5c08d73fdf9eb5ae74113d8",
    "assets/ui/glass-icons/older-files.webp" to "9a9f0a087403290963bc20cc48d3b9f973316b92",
    "assets/ui/glass-icons/home.webp" to "333f8da03b7a1098d6302740442e83b8bab693b5",
    "assets/ui/glass-icons/tools.webp" to "1fdb5ea129952953909979902ca43da3198aa6ec",
    "assets/ui/glass-icons/insights.webp" to "fc90bbecb406013b8b0fff63d6b4a9ee05940600",
    "assets/ui/glass-icons/more.webp" to "814c6ade69f58d46b79b0950066cee9810c58b53",
    "assets/ui/plain-icons/header-gear-silver.png" to "5290916581d7444c023dab1292d83e86600de3fe",
    "assets/mascot/dr-bear-approved.png" to "79a82e05ac85d6fe4dff07f495b65a916efeb4e7",
    "assets/brand/home-editorial-still-life.webp" to "bb8ea99512ff9bc7c1e140ae7b39b1ae734549aa",
    "assets/brand/scanning-clinical-scene.webp" to "85461dd8d74e353a09b4a848c8adfddbcbf5c061",
)
val prepareLegacyFrontend by tasks.registering {
    group = "bearagnostic"
    description = "Imports the approved Bearagnostic PWA byte-for-byte, then overlays Android integration modules."
    inputs.files(androidAdapter, androidReview, androidSettingsDetail, androidSupport, androidScanTrust, androidLiveScan, androidScanMotionPolish, androidReviewMedia, androidShareCard, androidPremiumColor, androidEntitlement, androidHiddenItems, androidCleanup, androidDuplicates, androidLargeFiles, androidOlderFiles, androidDownloads, androidInstallers, androidArchives, androidZero, androidEmptyFolders, androidAdvancedMedia, androidProUi, androidBilling, androidPlanStatus, androidReadability, androidCustomScan, androidInsights, androidShellUx, androidStabilization, androidLocalePolish, androidBuildTruth, androidHomePolish, androidFinalPolish, androidReleaseTrust)
    inputs.dir(nativeAssetsDir)
    inputs.property("legacyCommit", legacyCommit)
    // Explicit Android bundle revision prevents stale generated WebView assets from being
    // reused across corrective builds even when the pinned legacy PWA itself is unchanged.
    inputs.property("androidBundleRevision", 92)
    outputs.dir(generatedLegacyAssetsDir)
    outputs.dir(generatedLegacyResDir)
    doLast {
        if (!legacyArchive.exists()) {
            legacyArchive.parentFile.mkdirs()
            val archiveUrl = URI("https://github.com/grolygori789-crypto/bearagnostic/archive/$legacyCommit.zip").toURL()
            archiveUrl.openConnection().apply {
                connectTimeout = 20_000
                readTimeout = 60_000
                setRequestProperty("User-Agent", "Bearagnostic-Android-Build")
            }.getInputStream().use { input ->
                legacyArchive.outputStream().use { output -> input.copyTo(output) }
            }
        }
        delete(legacyExtractDir, generatedLegacyAssetsDir, generatedLegacyResDir)
        legacyExtractDir.mkdirs()
        copy {
            from(zipTree(legacyArchive))
            into(legacyExtractDir)
        }

        val sourceRoot = legacyExtractDir.listFiles()
            ?.firstOrNull { it.isDirectory && File(it, "index.html").isFile }
            ?: error("Pinned legacy Bearagnostic archive did not contain index.html")
        legacyCriticalBlobs.forEach { (relativePath, expectedSha) ->
            val sourceFile = File(sourceRoot, relativePath)
            check(sourceFile.isFile) { "Missing approved legacy asset: $relativePath" }
            val actualSha = gitBlobSha1(sourceFile)
            check(actualSha == expectedSha) {
                "Legacy source drift detected for $relativePath. Expected $expectedSha, got $actualSha"
            }
        }
        val uiRoot = File(generatedLegacyAssetsDir, "ui")
        uiRoot.mkdirs()
        copy {
            from(sourceRoot)
            into(uiRoot)
            exclude(".git/**", "docs/**", "README.md")
        }
        val generatedIndex = File(uiRoot, "index.html")
        var originalHtml = generatedIndex.readText(StandardCharsets.UTF_8)
            .replace("  <script src=\"./js/support/voluntary-support.js?v=11\"></script>\n", "")
            .replace(Regex("""<small id=\"supportProjectSub\">.*?</small>"""), "<small id=\"supportProjectSub\">Free plan · Explore the Pro toolkit</small>")

        // Android owns the complete launch sequence natively. The pinned PWA still carries
        // its historical Benedict/PRESENTS launch DOM and runOpening() routine; hiding that
        // DOM after WebView commit is too late and can leak a one-frame flash on real devices.
        // Remove the legacy opening from the generated Android bundle before packaging so it
        // cannot render at all: approved native Benedict -> Dr.Bear -> Home, with no web ident.
        val legacyLaunchStart = originalHtml.indexOf("<section id=\"launch\"")
        val appRootStart = originalHtml.indexOf("<div id=\"appRoot\"", legacyLaunchStart.coerceAtLeast(0))
        check(legacyLaunchStart >= 0 && appRootStart > legacyLaunchStart) {
            "Pinned legacy launch boundary changed; refusing to package an unverified startup path"
        }
        originalHtml = originalHtml.removeRange(legacyLaunchStart, appRootStart)
            .replace("<div id=\"appRoot\" class=\"app-shell\" hidden>", "<div id=\"appRoot\" class=\"app-shell\">")
        check(!originalHtml.contains("id=\"launch\"")) { "Android bundle still contains the legacy web launch" }
        check(!originalHtml.contains("studio-ident__wordmark")) { "Legacy Benedict web ident still present in Android bundle" }

        val generatedCoreApp = File(uiRoot, "js/core/app.js")
        val coreAppSource = generatedCoreApp.readText(StandardCharsets.UTF_8)
        val openingCall = "syncFullscreenToggle(); syncOrientationGuard(); bindEvents(); registerServiceWorker(); requestPortraitLock(); runOpening();"
        val androidBoot = "syncFullscreenToggle(); syncOrientationGuard(); bindEvents(); registerServiceWorker(); requestPortraitLock(); if (launch) launch.remove(); if (appRoot) appRoot.hidden=false; document.body.classList.add('app-ready');"
        check(coreAppSource.contains(openingCall)) {
            "Pinned legacy app boot changed; refusing to ship without re-auditing startup"
        }
        val androidCoreApp = coreAppSource.replace(openingCall, androidBoot)
        check(!androidCoreApp.contains("requestPortraitLock(); runOpening();")) {
            "Legacy runOpening remains reachable in the Android bundle"
        }
        generatedCoreApp.writeText(androidCoreApp, StandardCharsets.UTF_8)
        val androidTags = buildString {
            append("  <script src=\"./js/android-entitlement.js?v=92\"></script>\n")
            append("  <script src=\"./js/android-hidden-items.js?v=92\"></script>\n")
            append("  <script src=\"./js/android-cleanup.js?v=92\"></script>\n")
            append("  <script src=\"./js/android-duplicates.js?v=92\"></script>\n")
            append("  <script src=\"./js/android-large-files.js?v=92\"></script>\n")
            append("  <script src=\"./js/android-older-files.js?v=92\"></script>\n")
            append("  <script src=\"./js/android-downloads.js?v=92\"></script>\n")
            append("  <script src=\"./js/android-installers.js?v=92\"></script>\n")
            append("  <script src=\"./js/android-archives.js?v=92\"></script>\n")
            append("  <script src=\"./js/android-zero.js?v=92\"></script>\n")
            append("  <script src=\"./js/android-empty-folders.js?v=92\"></script>\n")
            append("  <script src=\"./js/android-advanced-media.js?v=92\"></script>\n")
            append("  <script src=\"./js/android-native.js?v=92\"></script>\n")
            append("  <script src=\"./js/android-review.js?v=92\"></script>\n")
            append("  <script src=\"./js/android-settings-detail.js?v=92\"></script>\n")
            append("  <script src=\"./js/android-support.js?v=92\"></script>\n")
            append("  <script src=\"./js/android-scan-trust.js?v=92\"></script>\n")
            append("  <script src=\"./js/android-live-scan.js?v=92\"></script>\n")
            append("  <script src=\"./js/android-scan-motion-polish.js?v=92\"></script>\n")
            append("  <script src=\"./js/android-review-media.js?v=92\"></script>\n")
            append("  <script src=\"./js/android-share-card.js?v=92\"></script>\n")
            append("  <script src=\"./js/android-premium-color.js?v=92\"></script>\n")
            append("  <script src=\"./js/android-pro-ui.js?v=92\"></script>\n")
            append("  <script src=\"./js/android-billing.js?v=92\"></script>\n")
            append("  <script src=\"./js/android-plan-status.js?v=92\"></script>\n")
            append("  <script src=\"./js/android-readability.js?v=92\"></script>\n")
            append("  <script src=\"./js/android-custom-scan.js?v=92\"></script>\n")
            append("  <script src=\"./js/android-insights.js?v=92\"></script>\n")
            append("  <script src=\"./js/android-shell-ux.js?v=92\"></script>\n")
            append("  <script src=\"./js/android-stabilization.js?v=92\"></script>\n")
            append("  <script src=\"./js/android-locale-polish.js?v=92\"></script>\n")
            append("  <script src=\"./js/android-build-truth.js?v=92\"></script>\n")
            append("  <script src=\"./js/android-final-polish.js?v=92\"></script>\n")
            append("  <script src=\"./js/android-home-polish.js?v=92\"></script>\n")
            append("  <script src=\"./js/android-release-trust.js?v=92\"></script>\n")
        }
        check(originalHtml.contains("</body>")) { "Legacy index.html is missing </body>" }
        generatedIndex.writeText(originalHtml.replace("</body>", androidTags + "</body>"), StandardCharsets.UTF_8)
        File(uiRoot, "js/support/voluntary-support.js").delete()
        val jsRoot = File(uiRoot, "js")
        jsRoot.mkdirs()
        androidAdapter.copyTo(File(jsRoot, "android-native.js"), overwrite = true)
        androidReview.copyTo(File(jsRoot, "android-review.js"), overwrite = true)
        androidSettingsDetail.copyTo(File(jsRoot, "android-settings-detail.js"), overwrite = true)
        androidSupport.copyTo(File(jsRoot, "android-support.js"), overwrite = true)
        androidScanTrust.copyTo(File(jsRoot, "android-scan-trust.js"), overwrite = true)
        androidLiveScan.copyTo(File(jsRoot, "android-live-scan.js"), overwrite = true)
        androidScanMotionPolish.copyTo(File(jsRoot, "android-scan-motion-polish.js"), overwrite = true)
        androidReviewMedia.copyTo(File(jsRoot, "android-review-media.js"), overwrite = true)
        androidShareCard.copyTo(File(jsRoot, "android-share-card.js"), overwrite = true)
        androidPremiumColor.copyTo(File(jsRoot, "android-premium-color.js"), overwrite = true)
        androidEntitlement.copyTo(File(jsRoot, "android-entitlement.js"), overwrite = true)
        androidHiddenItems.copyTo(File(jsRoot, "android-hidden-items.js"), overwrite = true)
        androidCleanup.copyTo(File(jsRoot, "android-cleanup.js"), overwrite = true)
        androidDuplicates.copyTo(File(jsRoot, "android-duplicates.js"), overwrite = true)
        androidLargeFiles.copyTo(File(jsRoot, "android-large-files.js"), overwrite = true)
        androidOlderFiles.copyTo(File(jsRoot, "android-older-files.js"), overwrite = true)
        androidDownloads.copyTo(File(jsRoot, "android-downloads.js"), overwrite = true)
        androidInstallers.copyTo(File(jsRoot, "android-installers.js"), overwrite = true)
        androidArchives.copyTo(File(jsRoot, "android-archives.js"), overwrite = true)
        androidZero.copyTo(File(jsRoot, "android-zero.js"), overwrite = true)
        androidEmptyFolders.copyTo(File(jsRoot, "android-empty-folders.js"), overwrite = true)
        androidAdvancedMedia.copyTo(File(jsRoot, "android-advanced-media.js"), overwrite = true)
        androidProUi.copyTo(File(jsRoot, "android-pro-ui.js"), overwrite = true)
        androidBilling.copyTo(File(jsRoot, "android-billing.js"), overwrite = true)
        androidPlanStatus.copyTo(File(jsRoot, "android-plan-status.js"), overwrite = true)
        androidReadability.copyTo(File(jsRoot, "android-readability.js"), overwrite = true)
        androidCustomScan.copyTo(File(jsRoot, "android-custom-scan.js"), overwrite = true)
        androidInsights.copyTo(File(jsRoot, "android-insights.js"), overwrite = true)
        androidShellUx.copyTo(File(jsRoot, "android-shell-ux.js"), overwrite = true)
        androidStabilization.copyTo(File(jsRoot, "android-stabilization.js"), overwrite = true)
        androidLocalePolish.copyTo(File(jsRoot, "android-locale-polish.js"), overwrite = true)
        androidHomePolish.copyTo(File(jsRoot, "android-home-polish.js"), overwrite = true)
        val finalStabilizationSource = File(jsRoot, "android-home-polish.js").readText(StandardCharsets.UTF_8)
        check(finalStabilizationSource.contains("const BUILD = 88;")) { "B88 final stabilization source was not packaged" }
        check(finalStabilizationSource.contains("#baEmptySurface[hidden]{display:none!important}")) { "B88 Empty Folders hidden-state guard is missing" }
        check(finalStabilizationSource.contains("data-tool=\"large\"") || finalStabilizationSource.contains("data-tool=\"large\"]")) { "B88 Large Files optical normalization is missing" }
        check(finalStabilizationSource.contains("installToolResultGuard")) { "B88 Tool scan-result navigation guard is missing" }
        androidBuildTruth.copyTo(File(jsRoot, "android-build-truth.js"), overwrite = true)
        androidFinalPolish.copyTo(File(jsRoot, "android-final-polish.js"), overwrite = true)
        androidReleaseTrust.copyTo(File(jsRoot, "android-release-trust.js"), overwrite = true)

        // Customer-facing production copy must never expose the retired Google Play
        // launch plan even for a single frame. Sanitize the generated Android Pro
        // source before packaging; internal Play Billing engineering code remains
        // available for Debug/reference and is not presented as the sales channel.
        val generatedProUi = File(jsRoot, "android-pro-ui.js")
        var proUiSource = generatedProUi.readText(StandardCharsets.UTF_8)
        proUiSource = proUiSource
            .replace("Google Play purchase setup is intentionally not active in this development build yet.", "Lifetime Pro · 249 THB")
            .replace("The next Billing batch will supply the local Play price, purchase, restore and ownership lifecycle to this entitlement layer.", "Buy or restore Bearagnostic Pro through the verified Ko-fi purchase flow. One-time purchase. No subscription.")
            .replace("ระบบซื้อผ่าน Google Play ยังไม่เปิดใน development build นี้โดยตั้งใจ", "Lifetime Pro · 249 บาท")
            .replace("Batch Billing ถัดไปจะเชื่อมราคาตามประเทศ การซื้อ การกู้คืนสิทธิ์ และวงจรสถานะเจ้าของเข้ากับ entitlement layer นี้", "ซื้อหรือกู้คืน Bearagnostic Pro ผ่านขั้นตอนการซื้อ Ko-fi ที่ตรวจสอบสิทธิ์แล้ว ซื้อครั้งเดียว ไม่มีค่าสมาชิกรายเดือน")
            .replace("この開発ビルドでは Google Play の購入処理を意図的にまだ有効化していません。", "Lifetime Pro · 249 THB")
            .replace("次の Billing バッチで、地域別価格・購入・復元・所有権ライフサイクルをこの entitlement layer に接続します。", "検証済みの Ko-fi 購入フローから Bearagnostic Pro を購入・復元できます。買い切り・サブスクリプションなし。")
        check(!proUiSource.contains("Google Play purchase setup is intentionally not active")) {
            "Customer Pro surface still contains retired Google Play launch copy"
        }
        generatedProUi.writeText(proUiSource, StandardCharsets.UTF_8)

        // Keep the customer-visible Legal / Privacy surface aligned with the
        // website + Ko-fi launch model. Play Billing may remain an internal
        // engineering/reference dependency, but it is not the public sales path.
        val generatedStabilization = File(jsRoot, "android-stabilization.js")
        var stabilizationSource = generatedStabilization.readText(StandardCharsets.UTF_8)
        stabilizationSource = stabilizationSource
            .replace("Bearagnostic is local-first. File analysis, previews and aggregate Insights history are designed to remain on your device. The current app does not upload selected file contents or maintain a remote filename inventory. Google Play Billing may process purchase metadata required for ownership and transaction handling under Google Play terms. User-requested support links may use the network.", "Bearagnostic is local-first. File analysis, previews, and aggregate Insights history stay on your device, and selected file contents are not uploaded. Purchase and restore contact the Benedict entitlement service only when you start those actions; Ko-fi handles checkout. Support links use the network only when you choose to open them.")
            .replace("Android, Google Play, Google Play Billing and other third-party components, services, fonts, libraries, marks and materials remain subject to their own licences and terms. Bearagnostic does not claim ownership of third-party or public-domain material. A valid third-party licence controls for its component where applicable.", "Android and other third-party components, services, fonts, libraries, marks, and materials remain subject to their own licences and terms. Bearagnostic does not claim ownership of third-party or public-domain material. A valid third-party licence controls for its component where applicable.")
            .replace("Bearagnostic ออกแบบแบบ local-first การวิเคราะห์ไฟล์ preview และประวัติ Insights แบบสรุปถูกออกแบบให้เก็บบนอุปกรณ์ เวอร์ชันปัจจุบันไม่อัปโหลดเนื้อหาไฟล์ที่เลือกและไม่สร้างคลังชื่อไฟล์ระยะไกล Google Play Billing อาจประมวลผลข้อมูลการซื้อที่จำเป็นต่อการยืนยันสิทธิ์และธุรกรรมตามเงื่อนไขของ Google Play ส่วนลิงก์ช่วยเหลือจะใช้อินเทอร์เน็ตเมื่อผู้ใช้เป็นฝ่ายเลือกเปิดเอง", "Bearagnostic ออกแบบแบบ local-first การวิเคราะห์ไฟล์ พรีวิว และประวัติ Insights แบบสรุปอยู่บนอุปกรณ์ และไม่มีการอัปโหลดเนื้อหาไฟล์ที่เลือก การซื้อและกู้คืนจะติดต่อบริการสิทธิ์ของ Benedict เฉพาะเมื่อคุณเริ่มขั้นตอนนั้น โดย Ko-fi เป็นผู้ดูแลการชำระเงิน ส่วนลิงก์ช่วยเหลือจะใช้อินเทอร์เน็ตเมื่อคุณเลือกเปิดเท่านั้น")
            .replace("Android, Google Play, Google Play Billing รวมถึง component บริการ ฟอนต์ ไลบรารี เครื่องหมาย และวัสดุของบุคคลที่สาม อยู่ภายใต้ licence และเงื่อนไขของเจ้าของแต่ละราย Bearagnostic ไม่อ้างกรรมสิทธิ์เหนือวัสดุของบุคคลที่สามหรือสาธารณสมบัติ และ licence ของบุคคลที่สามที่มีผลใช้บังคับย่อมมีผลกับ component นั้น", "Android และ component บริการ ฟอนต์ ไลบรารี เครื่องหมาย และวัสดุของบุคคลที่สาม อยู่ภายใต้ licence และเงื่อนไขของเจ้าของแต่ละราย Bearagnostic ไม่อ้างกรรมสิทธิ์เหนือวัสดุของบุคคลที่สามหรือสาธารณสมบัติ และ licence ที่มีผลใช้บังคับย่อมมีผลกับ component นั้น")
            .replace("Bearagnostic はローカル優先で設計されています。ファイル解析、プレビュー、集計された Insights 履歴は端末内で扱うことを基本とします。現在のアプリは、選択したファイル内容をアップロードせず、ファイル名のリモート一覧も保持しません。Google Play Billing は、Google Play の条件に基づき、所有権や取引処理に必要な購入情報を扱う場合があります。サポート用リンクは、利用者が明示的に開いた場合にのみネットワークを利用します。", "Bearagnostic はローカル優先で設計されています。ファイル解析、プレビュー、集計された Insights 履歴は端末内で扱い、選択したファイル内容をアップロードしません。購入・復元は、利用者がその操作を開始した場合にのみ Benedict の権限サービスへ接続し、決済は Ko-fi が処理します。サポート用リンクも、利用者が選んで開いた場合にのみネットワークを使用します。")
            .replace("Android、Google Play、Google Play Billing、および第三者のコンポーネント、サービス、フォント、ライブラリ、商標、素材には、それぞれのライセンスと利用条件が適用されます。Bearagnostic は第三者素材やパブリックドメイン素材の所有権を主張しません。該当コンポーネントについて有効な第三者ライセンスがある場合は、その条件が優先されます。", "Android、および第三者のコンポーネント、サービス、フォント、ライブラリ、商標、素材には、それぞれのライセンスと利用条件が適用されます。Bearagnostic は第三者素材やパブリックドメイン素材の所有権を主張しません。該当コンポーネントに有効な第三者ライセンスがある場合は、その条件が優先されます。")
        check(!stabilizationSource.contains("Google Play Billing may process purchase metadata")) { "English production privacy copy still describes Google Play as the launch commerce path" }
        check(!stabilizationSource.contains("Google Play Billing อาจประมวลผลข้อมูลการซื้อ")) { "Thai production privacy copy still describes Google Play as the launch commerce path" }
        check(!stabilizationSource.contains("Google Play Billing は、Google Play の条件")) { "Japanese production privacy copy still describes Google Play as the launch commerce path" }
        generatedStabilization.writeText(stabilizationSource, StandardCharsets.UTF_8)

        // B91 owns one customer-facing Pro surface. The older Settings-detail
        // adapter used to intercept source="more" before the real Pro overlay,
        // creating a second UI and a second commerce presentation. Remove only
        // that interception from the generated Android runtime; Deep/Custom and
        // More now reach the same Pro overlay and the same billing renderer.
        val generatedSettingsDetail = File(jsRoot, "android-settings-detail.js")
        var settingsDetailSource = generatedSettingsDetail.readText(StandardCharsets.UTF_8)
        val proInterceptStartMarker = "  // Registered before android-pro-ui.js. This converts every normal Pro request into"
        val proInterceptEndMarker = "\n\n  window.addEventListener('bearagnostic:languagechange'"
        val proInterceptStart = settingsDetailSource.indexOf(proInterceptStartMarker)
        val proInterceptEnd = if (proInterceptStart >= 0) settingsDetailSource.indexOf(proInterceptEndMarker, proInterceptStart) else -1
        check(proInterceptStart >= 0 && proInterceptEnd > proInterceptStart) { "B91 could not locate the legacy More -> Settings-detail Pro interception" }
        settingsDetailSource = settingsDetailSource.substring(0, proInterceptStart) +
            "  // B91: More, Deep and Custom all use the canonical Pro overlay.\n" +
            settingsDetailSource.substring(proInterceptEnd)
        check(!settingsDetailSource.contains("if (source !== 'more') return;\n    event.stopImmediatePropagation();\n    renderPro(source);")) {
            "B91 legacy More Pro interception is still active"
        }
        generatedSettingsDetail.writeText(settingsDetailSource, StandardCharsets.UTF_8)

        // Once the B91 canonical grid exists, older Insights/Stabilization writers
        // must stop injecting or restyling feature cards. They may run once before
        // B91 initializes; the canonical renderer replaces that transient content.
        val generatedInsights = File(jsRoot, "android-insights.js")
        var insightsSource = generatedInsights.readText(StandardCharsets.UTF_8)
        val insightsPatchMarker = "  function patchProSheet() {\n    const copy = c();"
        check(insightsSource.contains(insightsPatchMarker)) { "B91 could not locate legacy Insights Pro writer" }
        insightsSource = insightsSource.replace(
            insightsPatchMarker,
            "  function patchProSheet() {\n    if (document.querySelector('.ba-pro-feature-grid[data-r91-canonical=\\\"1\\\"]')) return;\n    const copy = c();"
        )
        generatedInsights.writeText(insightsSource, StandardCharsets.UTF_8)

        stabilizationSource = generatedStabilization.readText(StandardCharsets.UTF_8)
        val stabilizationPatchMarker = "  function patchProTruth() {\n    const grid = document.querySelector('.ba-pro-feature-grid');"
        check(stabilizationSource.contains(stabilizationPatchMarker)) { "B91 could not locate legacy Stabilization Pro writer" }
        stabilizationSource = stabilizationSource.replace(
            stabilizationPatchMarker,
            "  function patchProTruth() {\n    if (document.querySelector('.ba-pro-feature-grid[data-r91-canonical=\\\"1\\\"]')) return;\n    const grid = document.querySelector('.ba-pro-feature-grid');"
        )
        generatedStabilization.writeText(stabilizationSource, StandardCharsets.UTF_8)

        // APK Installer truth contract: the Tools summary and the opened review
        // must describe the same privacy-visible candidate set. Previously the
        // Tools row used the unfiltered review summary while the detail surface
        // applied Include-hidden-items privacy filtering, producing e.g. 3 vs 1.
        val generatedInstallers = File(jsRoot, "android-installers.js")
        var installersSource = generatedInstallers.readText(StandardCharsets.UTF_8)
        val installerEntryStartMarker = """  function updateEntryCopy(entry = document.querySelector('#toolsScreen [data-tool="installers"]')) {"""
        val installerEntryEndMarker = "\n\n  function ensureSurface()"
        val installerEntryStart = installersSource.indexOf(installerEntryStartMarker)
        val installerEntryEnd = if (installerEntryStart >= 0) installersSource.indexOf(installerEntryEndMarker, installerEntryStart) else -1
        check(installerEntryStart >= 0 && installerEntryEnd > installerEntryStart) { "B91 could not locate APK Installer Tools summary renderer" }
        val installerEntryReplacement = """  function visibleEntrySnapshot() {
    const summary = parse(NATIVE.getReviewSummary?.(), {});
    if (!summary?.available) return { available:false, count:0, bytes:0, excluded:0 };
    const hiddenEnabled = HIDDEN?.isEnabled?.() === true;
    const cacheKey = `${'$'}{n(summary.generatedAtMs)}|${'$'}{hiddenEnabled ? '1' : '0'}|${'$'}{n(summary.installersCount)}|${'$'}{n(summary.installersBytes)}`;
    if (visibleEntrySnapshot.cacheKey === cacheKey && visibleEntrySnapshot.cacheValue) return visibleEntrySnapshot.cacheValue;
    if (hiddenEnabled || !HIDDEN?.filter) {
      const value = { available:true, count:n(summary.installersCount), bytes:n(summary.installersBytes), excluded:0 };
      visibleEntrySnapshot.cacheKey = cacheKey;
      visibleEntrySnapshot.cacheValue = value;
      return value;
    }
    const items = [];
    let offset = 0;
    let total = 0;
    for (let pageIndex = 0; pageIndex < 48; pageIndex++) {
      const page = parse(NATIVE.getReviewCandidates?.(CATEGORY, offset, REVIEW_PAGE_SIZE), {});
      if (!page?.available) break;
      const next = Array.isArray(page.items) ? page.items : [];
      items.push(...next);
      total = n(page.totalCount);
      if (!page.hasMore || next.length === 0 || items.length >= total) break;
      offset += next.length;
    }
    const visible = HIDDEN.filter(items);
    const value = {
      available:true,
      count:visible.length,
      bytes:visible.reduce((sum, item) => sum + n(item.sizeBytes), 0),
      excluded:Math.max(0, items.length - visible.length)
    };
    visibleEntrySnapshot.cacheKey = cacheKey;
    visibleEntrySnapshot.cacheValue = value;
    return value;
  }

  function updateEntryCopy(entry = document.querySelector('#toolsScreen [data-tool=\"installers\"]')) {
    if (!entry) return;
    const copy = c();
    const visible = visibleEntrySnapshot();
    const countLabel = language() === 'en' && visible.count === 1 ? 'Installer' : copy.installers;
    const status = visible.available
      ? `${'$'}{visible.count} ${'$'}{countLabel} · ${'$'}{formatBytes(visible.bytes)}`
      : copy.toolSub;
    const signature = `${'$'}{language()}|${'$'}{copy.toolTitle}|${'$'}{status}`;
    if (entry.dataset.installersSignature !== signature) {
      entry.dataset.installersSignature = signature;
      entry.innerHTML = `<span class=\"mini-icon ba-installers-tool-icon\">${'$'}{installerBadge('tool')}</span><span><strong>${'$'}{esc(copy.toolTitle)}</strong><small>${'$'}{esc(status)}</small></span><b>›</b>`;
      entry.setAttribute('aria-label', `${'$'}{copy.toolTitle}. ${'$'}{status}`);
    }
  }"""
        installersSource = installersSource.substring(0, installerEntryStart) + installerEntryReplacement + installersSource.substring(installerEntryEnd)
        installersSource = installersSource.replace("HIDDEN?.enabled === false", "HIDDEN?.isEnabled?.() === false && state.items.length > base.length")
        installersSource = installersSource.replace(
            "<div class=\"ba-installers-stat\"><b>${'$'}{base.length}</b><span>${'$'}{esc(copy.installers)}</span></div>",
            "<div class=\"ba-installers-stat\"><b>${'$'}{base.length}</b><span>${'$'}{esc(language() === 'en' && base.length === 1 ? 'Installer' : copy.installers)}</span></div>"
        )
        val hiddenListenerOld = """  window.addEventListener('bearagnostic:hiddenitemschange', () => {
    syncSelectionPrivacy();
    if (state.open) render();
  });"""
        val hiddenListenerNew = """  window.addEventListener('bearagnostic:hiddenitemschange', () => {
    syncSelectionPrivacy();
    updateEntryCopy();
    if (state.open) render();
  });"""
        check(installersSource.contains(hiddenListenerOld)) { "B91 could not locate APK Installer hidden-items listener" }
        installersSource = installersSource.replace(hiddenListenerOld, hiddenListenerNew)
        check(installersSource.contains("function visibleEntrySnapshot()")) { "B91 privacy-visible APK Installer summary is missing" }
        check(!installersSource.contains("HIDDEN?.enabled === false")) { "B91 APK Installer still checks a non-existent hidden-items property" }
        generatedInstallers.writeText(installersSource, StandardCharsets.UTF_8)

        val releaseTrustSource = File(jsRoot, "android-release-trust.js").readText(StandardCharsets.UTF_8)
        check(releaseTrustSource.contains("const BUILD = 91;")) { "B91 release-trust source was not packaged" }
        check(releaseTrustSource.contains("ba-r91-pro-owner")) { "B91 premium Pro ownership card is missing" }
        check(releaseTrustSource.contains("ba-r91-permission-trust")) { "B91 file-access trust card is missing" }
        check(releaseTrustSource.contains("benedictinteractive.com")) { "B91 official website trust copy is missing" }
        check(releaseTrustSource.contains("Uptodown")) { "B91 authorized distribution trust copy is missing" }
        check(releaseTrustSource.contains("ba-r91-feature-grid")) { "B91 canonical Pro feature grid is missing" }
        check(releaseTrustSource.contains("ba-r91-overlay-grid")) { "B91 scrolling Pro grid normalization is missing" }
        check(releaseTrustSource.contains("data-r91-canonical")) { "B91 canonical Pro ownership marker is missing" }
        check(!releaseTrustSource.contains("data-b42-insights=\"1\"")) { "B91 canonical Pro cards still expose the legacy Insights layout marker" }
        check(!releaseTrustSource.contains("data-b45-feature=\"")) { "B91 canonical Pro cards still expose legacy stabilization layout markers" }
        check(releaseTrustSource.contains("ba-r91-lifetime-value")) { "B91 Lifetime ownership hierarchy is missing" }
        check(releaseTrustSource.contains("ba-r91-auth-warning")) { "B91 official-source warning hierarchy is missing" }

        val finalPolishSource = File(jsRoot, "android-final-polish.js").readText(StandardCharsets.UTF_8)
        check(finalPolishSource.contains("B92 settings viewport contract")) { "B92 settings viewport contract is missing" }
        check(finalPolishSource.contains("#preferencesScreen.is-active:not([hidden])")) { "B92 Preferences viewport guard is missing" }
        check(finalPolishSource.contains("#baUnifiedSettingsDetail.is-active:not([hidden])")) { "B92 Unified Detail viewport guard is missing" }
        check(finalPolishSource.contains("grid-template-rows:auto minmax(0,1fr)!important")) { "B92 settings grid sizing contract is missing" }
        check(finalPolishSource.contains("height:auto!important")) { "B92 settings scroller no longer neutralizes legacy fixed height" }
        if (nativeAssetsDir.isDirectory) {
            copy {
                from(nativeAssetsDir)
                into(File(uiRoot, "assets/native"))
            }
        }

        val launcherDir = File(generatedLegacyResDir, "drawable-nodpi")
        launcherDir.mkdirs()
        File(sourceRoot, "assets/icons/app-icon-192.png")
            .copyTo(File(launcherDir, "bearagnostic_pwa_app_icon.png"), overwrite = true)
        File(sourceRoot, "assets/mascot/dr-bear-approved.png")
            .copyTo(File(launcherDir, "bearagnostic_launch_bear.png"), overwrite = true)
    }
}
android {
    namespace = "com.benedictinteractive.bearagnostic"
    compileSdk = 36

    defaultConfig {
        applicationId = "com.benedictinteractive.bearagnostic"
        minSdk = 26
        targetSdk = 36
        versionCode = 92
        versionName = "0.35.44-alpha92"
    }
    sourceSets {
        getByName("main") {
            assets.setSrcDirs(listOf(generatedLegacyAssetsDir))
            res.srcDir(generatedLegacyResDir)
        }
    }

    buildFeatures {
        buildConfig = true
    }
    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }

    signingConfigs {
        getByName("debug") {
            storeFile = rootProject.file("signing/bearagnostic-debug.jks")
            storePassword = "android"
            keyAlias = "bearagnosticdebug"
            keyPassword = "android"
        }
    }
    buildTypes {
        debug {
            applicationIdSuffix = ".debug"
            versionNameSuffix = "-debug"
            signingConfig = signingConfigs.getByName("debug")
        }
        release {
            isMinifyEnabled = false
        }
    }
    packaging {
        resources {
            excludes += setOf("META-INF/AL2.0", "META-INF/LGPL2.1")
        }
    }
}

dependencies {
    implementation("com.android.billingclient:billing:9.1.0")
}

tasks.named("preBuild").configure {
    dependsOn(prepareLegacyFrontend)
}
