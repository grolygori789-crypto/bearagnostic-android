package com.benedictinteractive.bearagnostic

import android.Manifest
import android.app.Activity
import android.content.Intent
import android.content.pm.PackageManager
import android.net.Uri
import android.os.Build
import android.os.Environment
import android.provider.Settings

object StorageAccessController {
    const val LEGACY_READ_REQUEST_CODE = 8011

    fun hasAccess(activity: Activity): Boolean {
        return if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {
            Environment.isExternalStorageManager()
        } else {
            activity.checkSelfPermission(Manifest.permission.READ_EXTERNAL_STORAGE) ==
                PackageManager.PERMISSION_GRANTED
        }
    }

    fun request(activity: Activity) {
        if (hasAccess(activity)) return

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {
            val packageUri = Uri.parse("package:${activity.packageName}")
            val appSpecific = Intent(Settings.ACTION_MANAGE_APP_ALL_FILES_ACCESS_PERMISSION, packageUri)
            try {
                activity.startActivity(appSpecific)
            } catch (_: Exception) {
                activity.startActivity(Intent(Settings.ACTION_MANAGE_ALL_FILES_ACCESS_PERMISSION))
            }
            return
        }

        activity.requestPermissions(
            arrayOf(Manifest.permission.READ_EXTERNAL_STORAGE),
            LEGACY_READ_REQUEST_CODE,
        )
    }
}
