plugins {
    id("com.android.application")
}

android {
    namespace = "com.benedictinteractive.bearagnostic"
    compileSdk = 36

    defaultConfig {
        applicationId = "com.benedictinteractive.bearagnostic"
        minSdk = 26
        targetSdk = 36
        versionCode = 10
        versionName = "0.10.0-alpha10"
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
            // Development-only signing identity. This key is intentionally stable so
            // CI-built .debug APKs can update one another during active development.
            // Never use this signing configuration for production or Play release builds.
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
