import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-analytics.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyDgHn3E4WiAkWgdSdprn2cFrqDm8wh2T1Q",
  authDomain: "gunbunge-s-project.firebaseapp.com",
  projectId: "gunbunge-s-project",
  storageBucket: "gunbunge-s-project.appspot.com",
  messagingSenderId: "306945442200",
  appId: "1:306945442200:web:2cd5ae90b0839f5aa6ebed",
  measurementId: "G-RBF5SZQMEH"
};

const app = initializeApp(firebaseConfig);

export {
  app,
}