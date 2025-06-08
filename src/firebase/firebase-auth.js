// firebase-auth.js
import { signOut } from "firebase/auth";
import { auth } from "./firebase-config";

// Function to sign out with Google
const signOutWithAccount = async () => {
  try {
    await signOut(auth);
    // Redirect or do something after successful sign-out
  } catch (error) {
    console.error(error.message);
  }
};

export { auth, signOutWithAccount };