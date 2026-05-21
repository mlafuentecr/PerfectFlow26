# PerfectFlow

## Run the app

```bash
npm install
npx expo run:android
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
