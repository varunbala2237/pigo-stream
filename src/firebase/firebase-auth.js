// firebase-auth.js
import { signOut } from "firebase/auth";
import { auth } from "./firebase-config";

import { clearStorageState } from '../utils/localStorageStates';
import { clearSessionState } from '../utils/sessionStorageStates';

// Signs out the current user and clears all persisted storage states.
const signOutWithAccount = async () => {
  try {
    await signOut(auth);
    clearStorageState();   // Remove all localStorage app state
    clearSessionState();   // Remove all sessionStorage app state
  } catch (error) {
    console.error('Sign-out failed:', error.message);
  }
};

export { auth, signOutWithAccount };