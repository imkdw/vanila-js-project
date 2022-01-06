import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";

const firebaseConfig = {
  apiKey: "AIzaSyAjq0sTLX9ZCDKaJvOqR1Ur7Z8J2Yi6E4s",
  authDomain: "used-thing-trading.firebaseapp.com",
  projectId: "used-thing-trading",
  storageBucket: "used-thing-trading.appspot.com",
  messagingSenderId: "774791857005",
  appId: "1:774791857005:web:88794642c551e26ac45064",
  measurementId: "G-BETL380GEG"
};


const app = initializeApp(firebaseConfig);

export {
  app,
};