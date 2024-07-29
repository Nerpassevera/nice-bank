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

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth();
function generateAccountNumber() {
  return (Math.random() * 10 ** 16).toFixed(0);
}


export default function useAuthentication() {
  const ctx = useContext(UserContext);
  
  return {

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
