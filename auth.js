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

  if (!email || !password) {
    alert("Email and password are required!");
    return;
  }
  if (password.length < 6) {
    alert("Password must be at least 6 characters");
    return;
  }

  firebase.auth().createUserWithEmailAndPassword(email, password)
    .then(userCredential => {
      const user = userCredential.user;
      return db.collection("users").doc(user.uid).set({
        name,
        email,
        role
      });
    })
    .then(() => {
      alert("Registration successful!");
      window.location.href = "dashboard.html"; // 👈 next page redirect
    })
    .catch(error => {
      console.error(error.message);
      alert("Error: " + error.message);
    });
}


// Login user
function login() {
  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;

  firebase.auth().signInWithEmailAndPassword(email, password)
    .then(userCredential => {
      const user = userCredential.user;

      // Firestore nundi user role fetch cheyyali
      db.collection("users").doc(user.uid).get()
        .then(doc => {
          if (doc.exists) {
            const role = doc.data().role;

            if (role === "admin") {
              window.location.href = "admin.html";   // 👈 Admin page
            } else {
              window.location.href = "student.html"; // 👈 Student page
            }
          } else {
            alert("No role found for this user!");
          }
        })
        .catch(error => {
          console.error("Error fetching role:", error);
          alert("Error fetching role: " + error.message);
        });
    })
    .catch(error => {
      console.error(error.message);
      alert("Login failed: " + error.message);
    });
}



