// firebase-config.js

const firebaseConfig = {
  apiKey: "AIzaSyDOGTQgh0hgTgZZvetkZukm7e6fxBANR0I",
  authDomain: "placement-tracker-3d21e.firebaseapp.com",
  projectId: "placement-tracker-3d21e",
  storageBucket: "placement-tracker-3d21e.appspot.com",  // ✅ fixed
  messagingSenderId: "968697103697",
  appId: "1:968697103697:web:5771eacbcfd7adecd3ff70",
  measurementId: "G-P42W7Y2NGC"
};

// Init Firebase
firebase.initializeApp(firebaseConfig);

// Global references
const auth = firebase.auth();
const db = firebase.firestore();
