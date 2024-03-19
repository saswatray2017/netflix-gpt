// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAtTwozbLZlXFdyid3xy6NOKvNXbamGeT4",
  authDomain: "netflixgpt-eba94.firebaseapp.com",
  projectId: "netflixgpt-eba94",
  storageBucket: "netflixgpt-eba94.appspot.com",
  messagingSenderId: "681882732246",
  appId: "1:681882732246:web:0befce78424dba7475eb77"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth();