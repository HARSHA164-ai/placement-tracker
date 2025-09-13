import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDgekQbFWteKgJqEJMVNbesd06LFRfv00U",
  authDomain: "my-one-dbc60.firebaseapp.com",
  projectId: "my-one-dbc60",
  storageBucket: "my-one-dbc60.firebasestorage.app",
  messagingSenderId: "878020879440",
  appId: "1:878020879440:web:9e726d0aa0f7dd93231d55"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);