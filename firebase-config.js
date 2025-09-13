// firebase-config.js

const firebaseConfig = {
  apiKey: "AIzaSyDgekQbFWteKgJqEJMVNbesd06LFRfv00U",
  authDomain: "my-one-dbc60.firebaseapp.com",
  projectId: "my-one-dbc60",
  storageBucket: "my-one-dbc60.firebasestorage.app",
  messagingSenderId: "878020879440",
  appId: "1:878020879440:web:9e726d0aa0f7dd93231d55"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

