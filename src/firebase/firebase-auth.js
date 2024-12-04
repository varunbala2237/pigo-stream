import { signInWithPopup, GoogleAuthProvider, signOut } from "firebase/auth";
import { auth } from "./firebase-config";

// Create Google sign-in provider
const googleProvider = new GoogleAuthProvider();

const signInWithGoogle = async () => {
  try {
    const userCredential = await signInWithPopup(auth, googleProvider);
    const { user } = userCredential;

    const isNewUser = user.metadata.creationTime === user.metadata.lastSignInTime;
    const welcomeMessage = isNewUser ? "Welcome to PigoStream!" : "Welcome back to PigoStream!";
    
    // Store the welcome message in sessionStorage
    sessionStorage.setItem('welcomeMessage', welcomeMessage);
  } catch (error) {
    console.error("Error signing in with Google:", error.message);
  }
};

// Function to sign out with Google
const signOutWithAccount = async () => {
  try {
    await signOut(auth);
    // Redirect or do something after successful sign-out
  } catch (error) {
    console.error(error.message);
  }
};

export { auth, signInWithGoogle, signOutWithAccount };