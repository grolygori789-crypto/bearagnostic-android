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
val androidSupport = layout.projectDirectory.file("src/main/legacy-adapter/android-support.js").asFile
val androidScanTrust = layout.projectDirectory.file("src/main/legacy-adapter/android-scan-trust.js").asFile
val androidLiveScan = layout.projectDirectory.file("src/main/legacy-adapter/android-live-scan.js").asFile
val androidReviewMedia = layout.projectDirectory.file("src/main/legacy-adapter/android-review-media.js").asFile
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
val androidProUi = layout.projectDirectory.file("src/main/legacy-adapter/android-pro-ui.js").asFile
val androidPlanStatus = layout.projectDirectory.file("src/main/legacy-adapter/android-plan-status.js").asFile
val androidReadability = layout.projectDirectory.file("src/main/legacy-adapter/android-readability.js").asFile
val androidCustomScan = layout.projectDirectory.file("src/main/legacy-adapter/android-custom-scan.js").asFile
val androidBuildTruth = layout.projectDirectory.file("src/main/legacy-adapter/android-build-truth.js").asFile
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
    inputs.files(androidAdapter, androidReview, androidSupport, androidScanTrust, androidLiveScan, androidReviewMedia, androidPremiumColor, androidEntitlement, androidHiddenItems, androidCleanup, androidDuplicates, androidLargeFiles, androidOlderFiles, androidDownloads, androidInstallers, androidArchives, androidProUi, androidPlanStatus, androidReadability, androidCustomScan, androidBuildTruth)
    inputs.dir(nativeAssetsDir)
    inputs.property("legacyCommit", legacyCommit)
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
        val originalHtml = generatedIndex.readText(StandardCharsets.UTF_8)
        val androidTags = buildString {
            // Entitlement loads first so its capture guard can protect Pro-only actions
            // before the Android interaction adapter handles them. Hidden-item privacy loads before dedicated review tools; Quick Clean, Exact Duplicates, Large Files, Older Files, Downloads Review, APK Installers and Archives capture their dedicated entries before generic tool handling; Pro plan status loads after Pro UI; readability loads late; Custom Scan owns its responsive composition; build-truth loads last so visible version labels always resolve from native BuildConfig.
            append("  <script src=\"./js/android-entitlement.js?v=38\"></script>\n")
            append("  <script src=\"./js/android-hidden-items.js?v=38\"></script>\n")
            append("  <script src=\"./js/android-cleanup.js?v=38\"></script>\n")
            append("  <script src=\"./js/android-duplicates.js?v=38\"></script>\n")
            append("  <script src=\"./js/android-large-files.js?v=38\"></script>\n")
            append("  <script src=\"./js/android-older-files.js?v=38\"></script>\n")
            append("  <script src=\"./js/android-downloads.js?v=38\"></script>\n")
            append("  <script src=\"./js/android-installers.js?v=38\"></script>\n")
            append("  <script src=\"./js/android-archives.js?v=38\"></script>\n")
            append("  <script src=\"./js/android-native.js?v=38\"></script>\n")
            append("  <script src=\"./js/android-review.js?v=38\"></script>\n")
            append("  <script src=\"./js/android-support.js?v=38\"></script>\n")
            append("  <script src=\"./js/android-scan-trust.js?v=38\"></script>\n")
            append("  <script src=\"./js/android-live-scan.js?v=38\"></script>\n")
            append("  <script src=\"./js/android-review-media.js?v=38\"></script>\n")
            append("  <script src=\"./js/android-premium-color.js?v=38\"></script>\n")
            append("  <script src=\"./js/android-pro-ui.js?v=38\"></script>\n")
            append("  <script src=\"./js/android-plan-status.js?v=38\"></script>\n")
            append("  <script src=\"./js/android-readability.js?v=38\"></script>\n")
            append("  <script src=\"./js/android-custom-scan.js?v=38\"></script>\n")
            append("  <script src=\"./js/android-build-truth.js?v=38\"></script>\n")
        }
        check(originalHtml.contains("</body>")) { "Legacy index.html is missing </body>" }
        generatedIndex.writeText(originalHtml.replace("</body>", androidTags + "</body>"), StandardCharsets.UTF_8)

        val jsRoot = File(uiRoot, "js")
        jsRoot.mkdirs()
        androidAdapter.copyTo(File(jsRoot, "android-native.js"), overwrite = true)
        androidReview.copyTo(File(jsRoot, "android-review.js"), overwrite = true)
        androidSupport.copyTo(File(jsRoot, "android-support.js"), overwrite = true)
        androidScanTrust.copyTo(File(jsRoot, "android-scan-trust.js"), overwrite = true)
        androidLiveScan.copyTo(File(jsRoot, "android-live-scan.js"), overwrite = true)
        androidReviewMedia.copyTo(File(jsRoot, "android-review-media.js"), overwrite = true)
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
        androidProUi.copyTo(File(jsRoot, "android-pro-ui.js"), overwrite = true)
        androidPlanStatus.copyTo(File(jsRoot, "android-plan-status.js"), overwrite = true)
        androidReadability.copyTo(File(jsRoot, "android-readability.js"), overwrite = true)
        androidCustomScan.copyTo(File(jsRoot, "android-custom-scan.js"), overwrite = true)
        androidBuildTruth.copyTo(File(jsRoot, "android-build-truth.js"), overwrite = true)

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
    }
}

android {
    namespace = "com.benedictinteractive.bearagnostic"
    compileSdk = 36

    defaultConfig {
        applicationId = "com.benedictinteractive.bearagnostic"
        minSdk = 26
        targetSdk = 36
        versionCode = 38
        versionName = "0.28.0-alpha38"
    }

    sourceSets {
        getByName("main") {
            // The WebView frontend is generated exclusively from the pinned, verified
            // legacy PWA. Android-specific behavior is layered on through focused modules.
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

tasks.named("preBuild").configure {
    dependsOn(prepareLegacyFrontend)
}
