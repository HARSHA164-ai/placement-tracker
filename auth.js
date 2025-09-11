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
  const email = document.getElementById("registerEmail").value;
  const password = document.getElementById("registerPassword").value;
  const name = document.getElementById("registerName").value;
  const branch = document.getElementById("registerBranch").value;
  const rollNo = document.getElementById("registerRollNo").value;

  firebase.auth().createUserWithEmailAndPassword(email, password)
    .then(userCredential => {
      const user = userCredential.user;

      // Firestore lo save cheyyali
      return db.collection("student").doc(user.uid).set({
        name: name,
        email: email,
        branch: branch,
        rollNo: rollNo,
        role: "student"   // 👈 Default role student
      });
    })
    .then(() => {
      alert("Registration successful! Please login.");
      // Login modal open cheyyachu or redirect
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
            alert("Welcome Admin!");
            window.location.href = "admin.html";  // 👈 Redirect to Admin page
          } else {
            // If not admin, check student collection
            db.collection("student").doc(user.uid).get()
              .then(doc2 => {
                if (doc2.exists && doc2.data().role === "student") {
                  alert("Welcome Student!");
                  window.location.href = "student.html"; // 👈 Redirect to Student page
                } else {
                  alert("Error: No role assigned. Contact Admin.");
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



