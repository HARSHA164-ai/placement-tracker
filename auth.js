// Show/Hide Login & Register Forms
function showRegister() {
  document.getElementById("loginDiv").style.display = "none";
  document.getElementById("registerDiv").style.display = "block";
}
function showLogin() {
  document.getElementById("registerDiv").style.display = "none";
  document.getElementById("loginDiv").style.display = "block";
}

// js/auth.js

// Register new user
function register() {
  const name = document.getElementById("registerName").value;
  const email = document.getElementById("registerEmail").value;
  const password = document.getElementById("registerPassword").value;
  const role = document.getElementById("registerRole").value;

  firebase.auth().createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      return firebase.firestore().collection("users").doc(user.uid).set({
        name: name,
        email: email,
        role: role
      });
    })
    .then(() => {
      alert("✅ Registered successfully!");
    })
    .catch((error) => {
      alert("❌ Error: " + error.message);
    });
}

// Login user
function login() {
  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;

  firebase.auth().signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
      alert("✅ Login success: " + userCredential.user.email);
    })
    .catch((error) => {
      alert("❌ Error: " + error.message);
    });
}

