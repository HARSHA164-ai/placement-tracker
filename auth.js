// Show/Hide Login & Register Forms
function showRegister() {
  document.getElementById("loginDiv").style.display = "none";
  document.getElementById("registerDiv").style.display = "block";
}
function showLogin() {
  document.getElementById("registerDiv").style.display = "none";
  document.getElementById("loginDiv").style.display = "block";
}
function showLoader() {
  document.getElementById("loader").style.display = "flex";
}
function hideLoader() {
  document.getElementById("loader").style.display = "none";
}

// js/auth.js

// Register new user
// Register new user
function register() {
  const name = document.getElementById("registerName").value;
  const email = document.getElementById("registerEmail").value;
  const password = document.getElementById("registerPassword").value;
  const role = document.getElementById("registerRole").value;

  if (!email || !password) {
    alert("Email and password required!");
    return;
  }

  showLoader(); // ⏳ show loader

  firebase.auth().createUserWithEmailAndPassword(email, password)
    .then(userCredential => {
      const user = userCredential.user;
      return db.collection("users").doc(user.uid).set({
        name: name,
        email: email,
        role: role,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      });
    })
    .then(() => {
      hideLoader(); // ✅ hide loader
      alert("Registration successful! Please login.");
      document.getElementById("registerName").value = "";
      document.getElementById("registerEmail").value = "";
      document.getElementById("registerPassword").value = "";
    })
    .catch(error => {
      hideLoader(); // ❌ hide loader
      alert("Registration failed: " + error.message);
    });
}



// Login user
function login() {
  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;

  showLoader(); // ⏳ show loader

  firebase.auth().signInWithEmailAndPassword(email, password)
    .then(async (userCredential) => {
      const user = userCredential.user;
      const doc = await db.collection("users").doc(user.uid).get();

      hideLoader(); // ✅ hide loader

      if (!doc.exists) {
        alert("⚠ No role assigned. Contact Admin.");
        return;
      }

      const role = doc.data().role;
      if (role === "admin") {
        window.location.href = "admin.html";
      } else if (role === "student") {
        window.location.href = "student.html";
      } else {
        alert("⚠ Invalid role detected!");
      }
    })
    .catch(error => {
      hideLoader(); // ❌ hide loader
      alert("Login failed: " + error.message);
    });
}


// Logout function
function logout() {
  firebase.auth().signOut()
    .then(() => {
      // Redirect back to login page (index.html)
      window.location.href = "index.html";
    })
    .catch(error => {
      console.error("Logout error:", error);
      alert("Logout failed: " + error.message);
    });
}
