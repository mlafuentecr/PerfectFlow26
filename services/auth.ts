import { GoogleSignin } from '@react-native-google-signin/google-signin';
import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithCredential,
  signOut,
  User,
} from 'firebase/auth';
import { auth } from './firebase';

const webClientId =
  '1052635522459-955j142lqeps3vq4d5fssqgahmgb3f95.apps.googleusercontent.com';
const androidClientId =
  '1052635522459-nmmi6dn0khls00la8nrok8glnqhpmhd0.apps.googleusercontent.com';

GoogleSignin.configure({
  webClientId,
  offlineAccess: false,
  profileImageSize: 120,
});

export type GoogleDebugSnapshot = {
  webClientId: string;
  androidClientId: string;
  playServices: 'ok' | 'error';
  playServicesError?: string;
  hasCurrentUser: boolean;
};

export const signInWithGoogleNative = async () => {
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

export const getGoogleDebugSnapshot = async (): Promise<GoogleDebugSnapshot> => {
  try {
    await GoogleSignin.hasPlayServices({
      showPlayServicesUpdateDialog: false,
    });

    return {
      webClientId,
      androidClientId,
      playServices: 'ok',
      hasCurrentUser: Boolean(GoogleSignin.getCurrentUser()),
    };
  } catch (error: any) {
    return {
      webClientId,
      androidClientId,
      playServices: 'error',
      playServicesError: error?.message ?? 'Unknown Play Services error',
      hasCurrentUser: Boolean(GoogleSignin.getCurrentUser()),
    };
  }
};

export const subscribeAuth = (cb: (user: User | null) => void) =>
  onAuthStateChanged(auth, cb);

export const logout = async () => {
  try {
    await GoogleSignin.signOut();
  } catch {
    // Ignore sign-out issues from Google session and still sign out Firebase.
  }
  await signOut(auth);
};

export const ids = { webClientId, androidClientId };
