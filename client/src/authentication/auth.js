// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  setPersistence,
  browserSessionPersistence,
  signOut,
  updateProfile,
} from "firebase/auth";
import { useContext } from "react";
import { UserContext } from "../index.jsx";
import { addUserToDatabase } from "../services/api.js";


const firebaseConfig = {
  apiKey: process.env.REACT_APP_GOOGLE_API_KEY,
  authDomain: "nice-bank-7b37a.firebaseapp.com",
  databaseURL: "https://nice-bank-7b37a-default-rtdb.firebaseio.com",
  projectId: "nice-bank-7b37a",
  storageBucket: "nice-bank-7b37a.appspot.com",
  messagingSenderId: "649712646476",
  appId: "1:649712646476:web:9c6e952bfedbd859e5f7e9",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth();


/**
 * Generates a random 16-digit account number.
 * 
 * @returns {string} A randomly generated 16-digit account number.
 */
function generateAccountNumber() {
  return (Math.random() * 10 ** 16).toFixed(0);
}


/**
 * Custom hook for handling user authentication.
 * Provides methods for logging in, signing up, logging out, and getting user-friendly error messages.
 */
export default function useAuthentication() {
  const ctx = useContext(UserContext);

  return {
    
    /**
     * Returns a user-friendly error message based on the provided error code.
     * @param {string} errorCode - The error code returned by the authentication service.
     * @returns {string} - A user-friendly error message.
     */
    getUserFriendlyErrorMessage: function (errorCode) {
      console.log("Error code from getUserFriendlyErrorMessage: ", errorCode);
      const errorMessages = {
        undefined: "",
        "auth/invalid-email": "Please check your credentials and try again.",
        "auth/user-disabled":
          "This account has been disabled. Please contact support for assistance.",
        "auth/user-not-found":
          "Login failed. Please check your credentials and try again.",
        "auth/wrong-password":
          "Login failed. Please check your credentials and try again.",
        "auth/email-already-in-use":
          "This email is already associated with another account.",
        "auth/operation-not-allowed":
          "This sign-in method is not allowed. Please contact support.",
        "auth/weak-password":
          "The password is too weak. Please choose a stronger password.",
        "auth/requires-recent-login":
          "For security reasons, please log in again to continue.",
        "auth/credential-already-in-use":
          "This credential is already associated with another account.",
        "auth/invalid-credential":
          "The credentials provided are invalid or have expired. Please try again.",
        "auth/network-request-failed":
          "A network error has occurred. Please check your connection and try again.",
        "auth/too-many-requests": "Too many attempts. Please try again later.",
        "auth/timeout": "The operation has timed out. Please try again.",
      };

      return (
        errorMessages[errorCode] ||
        "An unknown error occurred. Please try again."
      );
    },

    /**
     * Logs out the currently authenticated user.
     * Updates the context to reflect the logged-out state.
     */
    handleLogOut: function () {
      signOut(auth)
        .then(() => {
          // Sign-out successful.
          ctx.setLoggedUser("");
        })
        .catch((error) => {
          // An error happened.
        });
    },

    /**
     * Logs in a user with the provided email and password.
     * Sets the user in the context if login is successful.
     * @param {string} email - The email of the user.
     * @param {string} password - The password of the user.
     * @returns {Promise<string|undefined>} - A promise that resolves to a user-friendly error message if login fails.
     */
    login: async function (email, password) {
      return setPersistence(auth, browserSessionPersistence)
        .then(async () => {
          try {
            const userCredential = await signInWithEmailAndPassword(
              auth,
              email,
              password
            );
            ctx.setLoggedUser(userCredential.user);
            console.log(
              "signInWithEmailAndPassword >> ctx.loggedUser has updated to ",
              ctx.loggedUser
            );
          } catch (error) {
            console.log(
              "signInWithEmailAndPassword errors catcher:",
              error.code
            );
            const valToReturn = this.getUserFriendlyErrorMessage(error.code);
            console.log(
              "signInWithEmailAndPassword errors catcher >> valToReturn:",
              valToReturn
            );
            return valToReturn;
          }
        })
        .catch((error) => {
          // setPersistence error catcher
          console.log("🚀 ~ useAuthentication ~ error:", error);
        });
    },

    /**
     * Signs up a new user with the provided name, email, and password.
     * Sets the user in the context if sign-up is successful.
     * @param {string} name - The name of the user.
     * @param {string} email - The email of the user.
     * @param {string} password - The password of the user.
     * @returns {Promise<string|undefined>} - A promise that resolves to a user-friendly error message if sign-up fails.
     */
    signUp: async function (name, email, password) {
      return await createUserWithEmailAndPassword(auth, email, password)
        .then(async (userCredential) => {
          try {
            // Create new user via Firebase Auth
            await updateProfile(auth.currentUser, { displayName: name });
            console.log("AUTH > updateProfile: Profile updated!");
            ctx.setLoggedUser(userCredential.user);

            // Send data about new user to the "users" collection in db
            console.log("userCredential.uid", userCredential.user.uid);
            addUserToDatabase(name, email, password, generateAccountNumber());
          } catch (error) {
            // An error occurred
            console.error(
              "AUTH > updateProfile: Profile failed to update:",
              error
            );
          }
        })
        .catch((error) => {
          console.error(
            "createUserWithEmailAndPassword catch block:",
            error.code,
            ": ",
            error.message
          );

          return this.getUserFriendlyErrorMessage(error.code);
        });
    },
  };
}

