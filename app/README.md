# PerfectFlow

## Carpeta correcta

El proyecto Expo esta dentro de:

```bash
cd /Users/mariolafuente/Documents/work/Mario/app-PerfectFlow/app
```

Todos los comandos de `npm`, `expo` y `eas` se corren desde esa carpeta.

Si corres comandos desde `/Users/mariolafuente/Documents/work/Mario/app-PerfectFlow`, npm no va a encontrar `package.json`.

## Instalar dependencias

```bash
cd /Users/mariolafuente/Documents/work/Mario/app-PerfectFlow/app
npm install
```

## Correr la app en desarrollo

Para levantar Metro:

```bash
npm run start
```

Para instalar y abrir la app nativa en Android:

```bash
npm run android
```

Ese comando ejecuta:

```bash
expo run:android
```

En esta maquina, Android debe compilarse con JDK 17. Si Gradle falla con Java 25, corre:

```bash
export JAVA_HOME=/opt/homebrew/Cellar/openjdk@17/17.0.19/libexec/openjdk.jdk/Contents/Home
export PATH="$JAVA_HOME/bin:$PATH"
npm run android
```

Para limpiar cache cuando algo no se actualiza:

```bash
npx expo start -c
```

Si estas usando Development Build, usa:

```bash
npx expo start -c --dev-client
```

Importante: Google Sign-In no funciona bien en Expo Go porque esta app usa `@react-native-google-signin/google-signin`. Para probar login con Google, abre la app instalada **PerfectFlow**, no Expo Go.

## Probar en emuladores de varios tamanos

Si quieres revisar la UI en pantallas mas grandes o mas chicas, crea varios Android Virtual Devices en Android Studio.

Ruta:

```text
Android Studio > Device Manager > Create Device
```

Tamanos recomendados:

```text
Telefono chico: Pixel 4 o similar
Telefono grande: Pixel 9 Pro XL o similar
Tablet compacta: Pixel Tablet
```

Flujo recomendado:

1. Abre el emulador que quieres usar desde Android Studio.
2. Entra al proyecto:

```bash
cd /Users/mariolafuente/Documents/work/Mario/app-PerfectFlow/app
```

3. Instala y abre la app en el emulador activo:

```bash
npm run android
```

4. Si ya tienes un Development Build instalado en ese emulador, levanta Metro con:

```bash
npx expo start -c --dev-client
```

Notas:

```text
npm run android / expo run:android = recompila la app nativa en el emulador activo
npx expo start --dev-client = reutiliza el Development Build ya instalado
```

Si Gradle falla en esta maquina por Java 25, usa JDK 17 antes de correr `npm run android`.

## Build Android para Google Play

Antes del build, confirma que estas logueado en Expo:

```bash
npx eas-cli@latest whoami
```

Confirma las credenciales Android:

```bash
npx eas-cli@latest credentials -p android
```

Debe usar:

```text
Project: perfectflow
Application Identifier: com.perfecten.perfectflow
Build credentials: Play Store keystore (Default)
Upload key SHA1: 62:39:6F:0F:E1:ED:EB:0D:92:57:BA:94:02:EE:70:20:98:80:A9:7B
```

## Build Android

### Opcion 1: `.aab` para Google Play

Usa este flujo cuando vas a subir la app a Google Play Console, por ejemplo en Open Testing, Closed Testing o Production.

Build remoto:

```bash
cd /Users/mariolafuente/Documents/work/Mario/app-PerfectFlow/app
npm run build:android
```

Ese script ejecuta:

```bash
npx eas-cli@latest build --platform android --profile production
```

Build local:

```bash
npm run build:android:local
```

Ese script fuerza JDK 17 automaticamente antes de correr EAS local, para evitar fallos de Gradle con Java 25.

Resultado esperado:

```text
.aab
```

Ese archivo `.aab` es el que se sube a Google Play Console.

El perfil `production` usa `autoIncrement`, asi que EAS sube el `versionCode` automaticamente en cada build.

### Opcion 2: `.apk` para instalar directo en el telefono

Usa este flujo cuando solo quieres probar la app instalada manualmente en Android, sin depender de Metro o del dev launcher.

```bash
cd /Users/mariolafuente/Documents/work/Mario/app-PerfectFlow/app
npm run build:android:previewlocal
```

Resultado esperado:

```text
.apk
```

Ese archivo `.apk` no se sube a Google Play Console. Ese archivo se instala directo en el telefono.

### Opcion 3: Development Build para iterar rapido

Usa este flujo cuando quieres un cliente de desarrollo para abrir la app con Metro y probar cambios frecuentemente.

```bash
npm run build:android:devlocal
```

Ese comando tambien fuerza JDK 17 y genera el cliente de desarrollo localmente.

## Subir a Google Play desde EAS

Si ya tienes configurado el Google Service Account para submissions:

```bash
npm run submit:android
```

Ese script ejecuta:

```bash
npx eas-cli@latest submit --platform android --profile production
```

Si no tienes el service account configurado, sube el `.aab` manualmente en Google Play Console.

## Firebase y Google Sign-In

La app Android en Firebase debe ser:

```text
Package name: com.perfecten.perfectflow
```

En Firebase agrega el SHA-1 de la upload key:

```text
SHA1: 62:39:6F:0F:E1:ED:EB:0D:92:57:BA:94:02:EE:70:20:98:80:A9:7B
```

Despues de cambiar fingerprints en Firebase:

1. Descarga `google-services.json`.
2. Ponlo en esta carpeta:

```text
/Users/mariolafuente/Documents/work/Mario/app-PerfectFlow/app/google-services.json
```

3. Genera un build nuevo con:

```bash
npm run build:android
```

## Errores comunes

### `npm error enoent Could not read package.json`

Estas en la carpeta equivocada. Entra primero a:

```bash
cd /Users/mariolafuente/Documents/work/Mario/app-PerfectFlow/app
```

### `google-services.json is missing`

Confirma que existe:

```bash
ls google-services.json
```

Tambien confirma que `.easignore` no lo este excluyendo.

### `Version code has already been used`

Genera otro build. El perfil `production` tiene `autoIncrement`, asi que el siguiente build debe usar un `versionCode` nuevo.

```bash
npm run build:android
```

### `This account has used its Android builds from the Free plan this month`

Agotaste la cuota mensual de builds remotos de Android en Expo. Tienes tres opciones:

1. Esperar al reinicio de cuota y volver a correr `npm run build:android`.
2. Cambiar de plan en Expo.
3. Compilar localmente:

```bash
npm run build:android:local
```

### `signed with the wrong key`

Revisa las credenciales:

```bash
npx eas-cli@latest credentials -p android
```

Debe aparecer como default:

```text
Play Store keystore (Default)
SHA1: 62:39:6F:0F:E1:ED:EB:0D:92:57:BA:94:02:EE:70:20:98:80:A9:7B
```

### `Google sign-in failed (10): DEVELOPER_ERROR`

Normalmente significa que Firebase no tiene el SHA correcto o el `google-services.json` no corresponde al package:

```text
com.perfecten.perfectflow
```

Revisa Firebase, descarga de nuevo `google-services.json` y genera otro build.

### `Google sign-in failed (7): NETWORK_ERROR`

Normalmente es internet, proxy o Google Play Services en el emulador.

Prueba:

```bash
adb shell settings put global http_proxy :0
adb shell settings put global https_proxy :0
adb emu kill
```

Luego abre el emulador con Cold Boot, reinstala la app y levanta Metro:

```bash
npm run android
npx expo start -c --dev-client
```
