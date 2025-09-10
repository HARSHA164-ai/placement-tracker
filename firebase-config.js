// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDOGTQgh0hgTgZZvetkZukm7e6fxBANR0I",
  authDomain: "placement-tracker-3d21e.firebaseapp.com",
  projectId: "placement-tracker-3d21e",
  storageBucket: "placement-tracker-3d21e.firebasestorage.app",
  messagingSenderId: "968697103697",
  appId: "1:968697103697:web:5771eacbcfd7adecd3ff70",
  measurementId: "G-P42W7Y2NGC"
};

// Init Firebase
const app = firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();
