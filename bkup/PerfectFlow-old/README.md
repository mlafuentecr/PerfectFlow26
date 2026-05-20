# Guía de instalación y uso para iOS y Android

Esta guía explica paso a paso cómo preparar el entorno y ejecutar PerfectFlow tanto en iOS como en Android. Incluye los requisitos para macOS y Windows (PC), así como comandos clave para correr la app.

## 1. Requisitos previos

### Herramientas comunes
- **Node.js 18+** y **npm** o **Yarn** (Yarn está configurado en el proyecto).
- **Git** para clonar el repositorio.
- **Watchman** (opcional pero recomendado en macOS para mejor recarga en caliente).

### Específicos para Android (macOS o Windows)
- **Android Studio** (última versión estable) con:
  - SDK de Android 14 (o el que use la app).
  - Herramientas de plataforma y build-tools.
  - Un **AVD** (emulador) configurado o un dispositivo físico con depuración USB.
- **Java Development Kit (JDK)** 17 (instalable con Android Studio o Adoptium).
- Variable de entorno `ANDROID_HOME` apuntando al directorio del SDK y `PATH` con `platform-tools` y `emulator`.

### Específicos para iOS (solo macOS)
- **Xcode** y sus command line tools.
- **CocoaPods** (`sudo gem install cocoapods`).
- Un simulador de iOS configurado o un dispositivo con perfil de desarrollo.

## 2. Clonar el proyecto
```bash
git clone https://github.com/tu-org/PerfectFlow.git
cd PerfectFlow
```

## 3. Instalar dependencias JavaScript
```bash
yarn install
# o
npm install
```

## 4. Configurar plataformas

### Android (macOS o Windows)
1. Abre **Android Studio** y asegúrate de que el SDK y las build-tools estén instalados.
2. Crea o verifica un emulador en `Device Manager`.
3. (Opcional) Ajusta `local.properties` si el SDK no está en la ruta por defecto, por ejemplo:
   ```
   sdk.dir=/Users/tu-usuario/Library/Android/sdk
   ```
   o en Windows:
   ```
   sdk.dir=C:\\Users\\tu-usuario\\AppData\\Local\\Android\\Sdk
   ```

### iOS (macOS)
1. Instala pods desde la carpeta `ios`:
   ```bash
   cd ios
   pod install
   cd ..
   ```
2. Verifica que Xcode tenga seleccionado el **Command Line Tools** correcto en *Preferences > Locations*.

## 5. Ejecutar la app

En todas las plataformas, primero inicia Metro (en una terminal):
```bash
yarn start
# o
npm start
```

### Lanzar en Android
En otra terminal:
```bash
yarn android
# o
npm run android
```
Esto compila y despliega la app en el emulador o dispositivo conectado.

### Lanzar en iOS (macOS)
En otra terminal:
```bash
yarn ios
# o
npm run ios
```
Esto abre el simulador de iOS y ejecuta la app. También puedes abrir `ios/PerfectFlow.xcworkspace` en Xcode y ejecutar desde allí.

## 6. Uso básico
- Mantén Metro abierto para recargar cambios.
- En Android, presiona <kbd>R</kbd> dos veces o `Cmd/Ctrl + M` para abrir el menú del desarrollador.
- En iOS, usa `Cmd + R` para recargar y `Cmd + D` para abrir el menú del desarrollador.

## 7. Problemas comunes
- **Metro no arranca:** elimina caché con `yarn start --reset-cache`.
- **Fallos de pods (iOS):** ejecuta `pod repo update` y `pod install` de nuevo.
- **Dispositivo no detectado (Android):** ejecuta `adb devices` y habilita la depuración USB.

Con estos pasos deberías poder preparar el entorno y ejecutar PerfectFlow en iOS y Android desde macOS o Windows.



Cómo ver tu app (iOS)

Mantén Metro corriendo (esa terminal con “Welcome to Metro v0.83” está bien).

Abre otra terminal en el proyecto:

cd /Applications/XAMPP/xamppfiles/htdocs/PerfectFlow
npx react-native run-ios


Eso debe:

Compilar el proyecto iOS.

Abrir el simulador y cargar tu app (la pantalla App.tsx / index.js).

Si te sale el error de “iOS devices or simulators not detected”, es porque todavía no tienes simulador instalado en Xcode:

Abre Xcode → Settings… → pestaña Platforms / Components.

Instala al menos un iOS Simulator.

Luego vuelve a correr npx react-native run-ios.
