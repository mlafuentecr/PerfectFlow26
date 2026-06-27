module.exports = {
  name: 'PerfectFlow',
  slug: 'perfectflow',
  version: '1.0.8',
  orientation: 'portrait',
  icon: './assets/icon.png',
  userInterfaceStyle: 'light',
  newArchEnabled: true,
  scheme: 'perfectflow',
  splash: {
    image: './assets/splash-icon.png',
    resizeMode: 'contain',
    backgroundColor: '#ffffff',
  },
  ios: {
    supportsTablet: true,
    bundleIdentifier: 'com.perfecten.perfectflow',
  },
  android: {
    package: 'com.perfecten.perfectflow',
    googleServicesFile: process.env.GOOGLE_SERVICES_JSON ?? './google-services.json',
    adaptiveIcon: {
      foregroundImage: './assets/adaptive-icon.png',
      backgroundColor: '#ffffff',
    },
    edgeToEdgeEnabled: true,
    predictiveBackGestureEnabled: false,
  },
  web: {
    favicon: './assets/favicon.png',
  },
  plugins: [
    'expo-web-browser',
    '@react-native-google-signin/google-signin',
    'expo-font',
    'expo-notifications',
  ],
  extra: {
    eas: {
      projectId: 'e67167b2-cc46-4144-a60d-0890d3e08190',
    },
  },
  owner: 'mlafuente',
};
