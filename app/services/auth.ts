import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithCredential,
  signOut,
  User,
} from 'firebase/auth';
import { auth } from './firebase';

let GoogleSignin: any = null;
try {
  // Lazy native module resolve so app doesn't crash in Expo Go.
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  GoogleSignin = require('@react-native-google-signin/google-signin').GoogleSignin;
} catch {
  GoogleSignin = null;
}

const webClientId =
  '1052635522459-955j142lqeps3vq4d5fssqgahmgb3f95.apps.googleusercontent.com';
const androidClientId =
  '1052635522459-e5ghnvq1sr0euvp03th79bbekqsnaoj1.apps.googleusercontent.com';

if (GoogleSignin) {
  GoogleSignin.configure({
    webClientId,
    offlineAccess: false,
    profileImageSize: 120,
  });
}

export const signInWithGoogleNative = async () => {
  if (!GoogleSignin) {
    throw new Error(
      'Google native module is unavailable in this build. Open the Development Build app (not Expo Go) and try again.'
    );
  }
  try {
    await GoogleSignin.hasPlayServices();
    const userInfo = await GoogleSignin.signIn();
    const idToken = userInfo.data?.idToken;

    if (!idToken) {
      throw new Error('Google sign-in did not return an idToken.');
    }

    const credential = GoogleAuthProvider.credential(idToken);
    await signInWithCredential(auth, credential);
  } catch (error: any) {
    const code = error?.code ?? 'UNKNOWN_CODE';
    const message = error?.message ?? 'Unknown Google sign-in error';
    const details = error?.details ? ` | details: ${error.details}` : '';
    throw new Error(`Google sign-in failed (${code}): ${message}${details}`);
  }
};

export const subscribeAuth = (cb: (user: User | null) => void) =>
  onAuthStateChanged(auth, cb);

export const logout = async () => {
  try {
    if (GoogleSignin) await GoogleSignin.signOut();
  } catch {
    // Ignore sign-out issues from Google session and still sign out Firebase.
  }
  await signOut(auth);
};

export const ids = { webClientId, androidClientId };
