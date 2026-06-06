# PerfectFlow

## Run the app

```bash
npm install
npx expo run:android
```

## Build Android para Google Play con Expo/EAS

Desde la raiz del proyecto:

```bash
cd /Users/mariolafuente/Documents/work/Mario/app-PerfectFlow
npm run build:android
```

Ese script ejecuta:

```bash
npx eas-cli@latest build --platform android --profile production
```

Cuando termine, Expo/EAS muestra un link a un archivo `.aab`. Ese es el archivo que se sube a Google Play Console.

Antes de generar el build, puedes verificar la sesion de Expo:

```bash
npx eas-cli@latest whoami
```

Tambien puedes confirmar las credenciales Android:

```bash
npx eas-cli@latest credentials -p android
```

Debe usar estos datos:

```text
Application Identifier: com.perfecten.perfectflow
Keystore: Play Store keystore (Default)
SHA1: 62:39:6F:0F:E1:ED:EB:0D:92:57:BA:94:02:EE:70:20:98:80:A9:7B
```

Para subir despues de tener un `.aab` valido:

```bash
npm run submit:android
```

## Start Metro (clean cache)

Use this when changes are not reflecting, audio is not playing, or after native/config updates:

```bash
npx expo start -c
```

## Si sale Google Sign-In Error (Expo Go vs Dev Build)

Ese error significa que abriste Expo Go, no tu Development Build (la que sí tiene `react-native-google-signin`).

Haz esto exacto:

1. Cierra la app del emulador.
2. En terminal, dentro del proyecto:

```bash
npx expo run:android
```

3. Cuando termine de instalar, arranca Metro:

```bash
npx expo start -c --dev-client
```

4. Abre la app instalada que se llama PerfectFlow (no Expo Go).
5. Si sale selector de app, elige `com.perfecten.perfectflow`.

## Si aparece: "No development build is installed"

Ejecuta esto en orden:

```bash
cd /Users/mariolafuente/Documents/work/Mario/app-PerfectFlow
export JAVA_HOME=$(/usr/libexec/java_home -v 17)
export PATH="$JAVA_HOME/bin:$PATH"

# Instala de nuevo la app nativa en el emulador
npx expo run:android

# Luego levanta metro para dev client
npx expo start -c --dev-client
```

Después abre la app **PerfectFlow** (no Expo Go).

## Si sale `Google sign-in failed (7): NETWORK_ERROR`

Ese error normalmente es conectividad/proxy/Google Play Services dentro del emulador (no Firebase config).

Haz esto exacto:

1. Verifica internet dentro del emulador:
   - Abre Chrome en el emulador y entra a `https://accounts.google.com`

2. Quita proxy global del emulador:

```bash
adb shell settings put global http_proxy :0
adb shell settings put global https_proxy :0
```

3. Reinicia limpio el emulador:

```bash
adb emu kill
```

Luego vuelve a abrir el emulador con **Cold Boot** desde Android Studio Device Manager.

4. Reinstala app + corre Metro en dev client:

```bash
cd /Users/mariolafuente/Documents/work/Mario/app-PerfectFlow
npx expo run:android
npx expo start -c --dev-client
```

5. Si sigue fallando:
   - Borra datos de **Google Play Services** y **Google app** dentro del emulador.
   - Vuelve a iniciar sesión con tu cuenta Google en el emulador.
