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

  firebase.auth().createUserWithEmailAndPassword(email, password)
    .then(userCredential => {
      const user = userCredential.user;

      if (role === "admin") {
        // Save to admin collection
        return db.collection("admin").doc(user.uid).set({
          name: name,
          email: email,
          role: "admin"
        });
      } else {
        // Save to student collection
        return db.collection("student").doc(user.uid).set({
          name: name,
          email: email,
          role: "student"
        });
      }
    })
    .then(() => {
      alert("Registration successful! Please login.");
      document.getElementById("registerName").value = "";
      document.getElementById("registerEmail").value = "";
      document.getElementById("registerPassword").value = "";
    })
    .catch(error => {
      console.error(error.message);
      alert("Registration failed: " + error.message);
    });
}



// Login user
function login() {
  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;

  firebase.auth().signInWithEmailAndPassword(email, password)
    .then(userCredential => {
      const user = userCredential.user;

      // First check in admin collection
      db.collection("admin").doc(user.uid).get()
        .then(doc => {
          if (doc.exists && doc.data().role === "admin") {
            // Redirect Admin
            window.location.href = "admin.html";
          } else {
            // Otherwise check student collection
            db.collection("student").doc(user.uid).get()
              .then(doc2 => {
                if (doc2.exists && doc2.data().role === "student") {
                  // Redirect Student
                  window.location.href = "student.html";
                } else {
                  alert("No role assigned. Contact Admin.");
                }
              })
              .catch(err => {
                console.error("Error fetching student role:", err);
                alert("Error fetching student role: " + err.message);
              });
          }
        })
        .catch(err => {
          console.error("Error fetching admin role:", err);
          alert("Error fetching admin role: " + err.message);
        });
    })
    .catch(error => {
      console.error(error.message);
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
