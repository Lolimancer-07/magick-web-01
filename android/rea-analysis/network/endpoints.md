# Network Endpoints & API Configuration

**Source:** Image Toolbox.apk (v4.2.0) - String resources & manifest analysis

## Firebase Configuration
- **Project ID:** `imagetoolbox-13e3c`
- **Google App ID:** `1:698299287298:android:11af7edf43198644b6e41b`
- **Storage Bucket:** `imagetoolbox-13e3c.appspot.com`
- **Google API Key:** `AIzaSyBH5QgaBw6XAfuxhPVJzq-r9s8ZMFalXzU`

## Network Libraries
- **Ktor HTTP Client** with **OkHttp engine** (`io.ktor.client.engine.okhttp.OkHttpEngineContainer`)
- **Firebase** services: Analytics, Crashlytics, Installations, Sessions
- **ML Kit:** Barcode scanning, document scanning, subject segmentation
- **ONNX Runtime:** `ai.onnxruntime.OnnxRuntime` - ML model inference

## Domains Found in Resources
- `imagetoolbox-13e3c.app` - Firebase app domain
- `imagetoolbox-13e3c.appspot.com` - Firebase storage
- `github.com` - Model downloads (generative inpaint ~200 MB from GitHub)
- `play.google.com/store` - APK source (distribution APK)

## Security-Relevant Manifest Flags
- `usesCleartextTraffic="true"` - ⚠️ Allows unencrypted HTTP traffic
- `extractNativeLibs="true"` - Native libraries extracted to app directory
- `largeHeap="true"` - Large memory heap allocation
- `allowBackup="true"` - App data can be backed up via adb

## Exported Components (12 total)
- `AppActivity` - Main launcher, handles image/file/camera intents
- `MediaPickerActivity` - Image picker
- 7 Quick Settings tiles
- `ProfileInstallReceiver`

## Permissions (17 total)
CAMERA, INTERNET, ACCESS_NETWORK_STATE, READ_EXTERNAL_STORAGE, WRITE_EXTERNAL_STORAGE, READ_MEDIA_IMAGES, ACCESS_MEDIA_LOCATION, FOREGROUND_SERVICE, FOREGROUND_SERVICE_MEDIA_PROJECTION, PROJECT_MEDIA, READ_CONTACTS, FOREGROUND_SERVICE_DATA_SYNC, POST_NOTIFICATIONS, WAKE_LOCK, BIND_GET_INSTALL_REFERRER_SERVICE, ACCESS_ADSERVICES_ATTRIBUTION, custom signature permission
