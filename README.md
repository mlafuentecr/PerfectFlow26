# PerfectFlow

La app Expo esta dentro de la carpeta `app/`.

Entra ahi antes de correr cualquier comando:

```bash
cd /Users/mariolafuente/Documents/work/Mario/app-PerfectFlow/app
```

## Run

Instala dependencias:

```bash
npm install
```

Levanta Metro:

```bash
npm run start
```

Instala y abre la app nativa en Android:

```bash
npm run android
```

Si el build local falla con Gradle o Java, usa JDK 17:

```bash
export JAVA_HOME=/opt/homebrew/Cellar/openjdk@17/17.0.19/libexec/openjdk.jdk/Contents/Home
export PATH="$JAVA_HOME/bin:$PATH"
npm run android
```

Si estas usando Development Build:

```bash
npx expo start -c --dev-client
```

## Emuladores de varios tamanos

Para probar la UI en pantallas distintas, crea varios emuladores en:

```text
Android Studio > Device Manager > Create Device
```

Recomendados:

```text
Telefono chico: Pixel 4
Telefono grande: Pixel 9 Pro XL
Tablet: Pixel Tablet
```

Uso:

```bash
cd /Users/mariolafuente/Documents/work/Mario/app-PerfectFlow/app
npm run android
```

Si ya tienes un Development Build instalado en ese emulador:

```bash
npx expo start -c --dev-client
```

## Build Android

Confirma Expo:

```bash
npx eas-cli@latest whoami
```

Confirma credenciales:

```bash
npx eas-cli@latest credentials -p android
```

El build de Google Play debe usar:

```text
Application Identifier: com.perfecten.perfectflow
Build credentials: Play Store keystore (Default)
Upload key SHA1: 62:39:6F:0F:E1:ED:EB:0D:92:57:BA:94:02:EE:70:20:98:80:A9:7B
```

Para subir a Google Play Console, genera un `.aab`:

```bash
npm run build:android
```

Si quieres ese mismo `.aab` pero compilado localmente:

```bash
npm run build:android:local
```

Para instalar la app directamente en tu telefono, genera un `.apk`:

```bash
npm run build:android:previewlocal
```

Para generar un Development Build local y seguir trabajando con Metro:

```bash
npm run build:android:devlocal
```

Para generar el build local de iPhone que se sube a Apple, usa:

```bash
npm run build:ios:local
```

Ese flujo genera un `.ipa`.

## Submit

Si EAS Submit ya tiene Google Service Account configurado:

```bash
npm run submit:android
```

Si no, sube el `.aab` manualmente en Google Play Console.

## Mas detalles

El paso a paso completo esta en:

```text
app/README.md
```
