# PerfectFlow

React Native + Expo application for guided breathing exercises.

---

# Table of Contents

- Project Structure
- Requirements
- Installation
- Development
- Android Development
- iOS Development
- Android Builds
- iOS Builds
- Google Play Submission
- Firebase & Google Sign-In
- Testing
- Troubleshooting

---

# Useful Scripts

npx expo start

npm run build:android *aab
npm run build:android:local *apk
npm run build:android:previewlocal *apk
npm run submit:android

npm run build:ios:local
eas submit --platform ios
npx eas-cli@latest submit --platform ios  *este
---
---


# Testing 
adb shell wm size
adb shell wm density
Physical size: 1080x2400
Physical density: 420
Override density: 480

reset density
adb shell wm density 420
adb reboot

adb shell settings put system font_scale 1.0
adb shell wm density reset
adb shell wm size reset
adb reboot

adb wait-for-device
adb shell settings get system font_scale
adb shell wm density
adb shell wm size
---

# Project Structure

The Expo project lives inside:

```text
/Users/mariolafuente/Documents/work/Mario/PerfectFlow/app-PerfectFlow/app
```

Always run `npm`, `expo`, `npx` and `eas` commands from this folder.

If commands are executed from:

```text
/Users/mariolafuente/Documents/work/Mario/PerfectFlow/app-PerfectFlow
```

npm will not find `package.json`.

---

# Requirements

- Node.js
- npm
- Android Studio
- Xcode (macOS)
- Expo CLI
- EAS CLI
- Java 17 (Android builds)

---

# Installation

```bash
cd /Users/mariolafuente/Documents/work/Mario/PerfectFlow/app-PerfectFlow/app
npm install
```

---

# Development

## Start Metro

```bash
npm start
```

or

```bash
npx expo start
```

## Clear Metro cache

```bash
npx expo start -c
```

---

# Android Development

## Configure Java 17

This project **must** be compiled using JDK 17.

```bash
export JAVA_HOME=/opt/homebrew/Cellar/openjdk@17/17.0.19/libexec/openjdk.jdk/Contents/Home
export PATH="$JAVA_HOME/bin:$PATH"
```

## Run Android

```bash
npm run android
```

Internally this executes:

```bash
expo run:android
```

If Gradle starts using Java 25, export Java 17 again before running.

---

## Development Build

Build the native development client:

```bash
npm run build:android:devlocal
```

Start Metro:

```bash
npx expo start -c --dev-client
```

> Google Sign-In does **not** work correctly in Expo Go because this project uses `@react-native-google-signin/google-signin`.

Always test using the installed **PerfectFlow Development Build**.

---

# iOS Development

Generate a local development build:

```bash
npm run build:ios:local
```

---

# Android Builds

## Production (.aab)

Use this build for Google Play.

Remote build:

```bash
npm run build:android
```

Internally:

```bash
npx eas-cli@latest build --platform android --profile production
```

---

## Local Production Build

Before building locally, update the version inside:

```text
app.config.js
```

Then run:

```bash
npm run build:android:local
```

Output:

```text
.aab
```

Internally this runs:

```bash
npx eas-cli@latest build --platform android --profile production --local
```

This local build uses Java 17 and creates an Android App Bundle for Google Play.

If Google Play rejects the upload with a message like:

```text
Your Android App Bundle is signed with the wrong key
```

the `.aab` was signed with a different keystore than the upload key registered in Google Play Console. In that case:

- check the Android credentials configured in EAS
- verify the SHA1 of the keystore used for the local build
- use the same upload key that Google Play already expects for this app

The production profile automatically increments the `versionCode`.

---


# iOS Builds

## Production IPA

Remote build:

```bash
eas build --platform ios
```

Submit:

```bash
eas submit --platform ios
npx eas-cli@latest submit --platform ios
```

Local build:

```bash
npm run build:ios:local
```

Internally this runs:

```bash
npx eas-cli@latest build --platform ios --profile production --local
```

To find the generated `.ipa`:

```bash
find . -name "*.ipa"
```

## Upload Local IPA To Apple

If you already have a local `.ipa`, submit it with:

```bash
npx eas-cli@latest submit --platform ios
```

When EAS asks:

```text
What would you like to submit?
```

choose:

```text
Provide a path to a local app binary file
```

Then paste the full path to the `.ipa`, for example:

```text
/Users/mariolafuente/Documents/work/Mario/PerfectFlow/app-PerfectFlow/app/build-1782704975865.ipa
```

Alternative manual upload on macOS:

- open Apple Transporter
- sign in with the App Store Connect account
- drag the `.ipa`
- click `Deliver`

## Attach The New Build In App Store Connect

After Apple finishes processing the upload:

- open App Store Connect
- go to the iOS version page
- in `Build`, select the new processed build
- click `Save`
- submit to review again if needed

If the version is already in `Waiting for Review`, Apple will not let you replace the build directly. First:

- click `remove this version from review`
- wait for the version to leave review
- upload the new `.ipa`
- attach the new build
- resubmit the version

Submit with a direct path if you already know the file location:

```bash
npx eas-cli@latest submit --platform ios --path /absolute/path/to/file.ipa
```

Output:

```text
.ipa
```

---

# Google Play Submission

Verify Expo account:

```bash
npx eas-cli@latest whoami
```

Verify Android credentials:

```bash
npx eas-cli@latest credentials -p android
```

Expected:

```
Project:
perfectflow

Application ID:
com.perfecten.perfectflow

Play Store Keystore:
Default

SHA1:
62:39:6F:0F:E1:ED:EB:0D:92:57:BA:94:02:EE:70:20:98:80:A9:7B
```

Automatic submission:

```bash
npm run submit:android
```

If submissions are not configured, upload the generated `.aab` manually through Google Play Console.

---

# Firebase & Google Sign-In

Android package:

```text
com.perfecten.perfectflow
```

Required SHA1:

```text
62:39:6F:0F:E1:ED:EB:0D:92:57:BA:94:02:EE:70:20:98:80:A9:7B
```

After updating Firebase:

1. Download `google-services.json`
2. Place it here:

```text
app/google-services.json
```

3. Generate a new production build:

```bash
npm run build:android
```

---

# Testing

## Recommended Android Emulators

Create multiple Android Virtual Devices:

```
Android Studio
→ Device Manager
→ Create Device
```

Recommended:

- Pixel 4
- Pixel 9 Pro XL
- Pixel Tablet

Workflow:

1. Start emulator.
2. Install app.

```bash
npm run android
```

3. Launch Metro.

```bash
npx expo start -c --dev-client
```

---

# Troubleshooting

## npm ERR! enoent

Wrong directory.

Go to:

```bash
cd /Users/mariolafuente/Documents/work/Mario/app-PerfectFlow/app
```

---

## google-services.json is missing

Verify:

```bash
ls google-services.json
```

Also check `.easignore`.

---

## Version code has already been used

Generate another production build.

```bash
npm run build:android
```

---

## Free plan build limit reached

Options:

- Wait for Expo quota reset
- Upgrade Expo plan
- Build locally

```bash
npm run build:android:local
```

---

## Wrong signing key

Verify credentials:

```bash
npx eas-cli@latest credentials -p android
```

Expected SHA1:

```
62:39:6F:0F:E1:ED:EB:0D:92:57:BA:94:02:EE:70:20:98:80:A9:7B
```

---

## Google Sign-In (10): DEVELOPER_ERROR

Usually caused by:

- Wrong SHA1
- Incorrect `google-services.json`
- Wrong package name

Expected package:

```text
com.perfecten.perfectflow
```

Download a new `google-services.json` and rebuild.

---

## Google Sign-In (7): NETWORK_ERROR

Usually emulator networking.

Run:

```bash
adb shell settings put global http_proxy :0
adb shell settings put global https_proxy :0
adb emu kill
```

Cold Boot the emulator.

Then:

```bash
npm run android
npx expo start -c --dev-client
```

---

# Notes

- Always use Java 17 for Android builds.
- Google Sign-In should be tested using a Development Build or Production Build, **never Expo Go**.
- Production builds automatically increment `versionCode`.
- Keep `google-services.json` synchronized with Firebase after changing SHA fingerprints.
