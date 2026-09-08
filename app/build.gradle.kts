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
        versionCode = 2
        versionName = "0.2.0-alpha02"
    }

    buildFeatures {
        buildConfig = true
    }

    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }

    buildTypes {
        debug {
            applicationIdSuffix = ".debug"
            versionNameSuffix = "-debug"
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
