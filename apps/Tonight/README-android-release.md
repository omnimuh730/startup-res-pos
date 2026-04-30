# Tonight Android Signed Release APK

This guide builds a **signed release APK** for `apps/Tonight` using Tauri + Android.

## Prerequisites

- Android SDK + NDK installed
- Java (JDK 17+ recommended)
- Rust Android targets installed (handled by Tauri Android setup)
- `pnpm` installed

## Signing Setup

Create or update:

`apps/Tonight/src-tauri/gen/android/keystore.properties`

```properties
password=<keystore_password>
keyAlias=<alias_name>
storeFile=<absolute_path_to_keystore_jks>
# optional (defaults to password if omitted)
keyPassword=<key_password>
```

Example already in this project:

- `password=...`
- `keyAlias=upload`
- `storeFile=C:\\Users\\Administrator\\upload-keystore.jks`

## Build Signed Release APK

From repo root or any terminal:

```powershell
cd D:\Utils\rn\apps\Tonight
pnpm tauri android build --apk
```

## Output APK

Generated file:

`apps/Tonight/src-tauri/gen/android/app/build/outputs/apk/universal/release/app-universal-release.apk`

## Verify APK Signature

```powershell
$apk="D:\Utils\rn\apps\Tonight\src-tauri\gen\android\app\build\outputs\apk\universal\release\app-universal-release.apk"
$apksigner=Get-ChildItem "$env:LOCALAPPDATA\Android\Sdk\build-tools" -Recurse -Filter apksigner.bat | Sort-Object FullName -Descending | Select-Object -First 1 -ExpandProperty FullName
& $apksigner verify --verbose --print-certs "$apk"
```

A valid signed build should show at least:

- `Verified using v2 scheme ... true`
- `Number of signers: 1`

## Notes

- This project is configured so Android release signing reads from `keystore.properties` in `src-tauri/gen/android`.
- Keep `.jks` and `keystore.properties` secure and out of public repos.
