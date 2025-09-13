// Toggle Register Form
function toggleRegister() {
  document.getElementById("registerForm").style.display =
    document.getElementById("registerForm").style.display === "none" ? "block" : "none";
}

// Register
function register() {
  const name = document.getElementById("registerName").value;
  const email = document.getElementById("registerEmail").value;
  const password = document.getElementById("registerPassword").value;
  const role = document.getElementById("registerRole").value;

  auth.createUserWithEmailAndPassword(email, password)
    .then(userCred => {
      return db.collection("users").doc(userCred.user.uid).set({
        name, email, role
      });
    })
    .then(() => alert("Registered Successfully!"))
    .catch(err => alert(err.message));
}

// Login
function login() {
  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;

  auth.signInWithEmailAndPassword(email, password)
    .then(userCred => {
      return db.collection("users").doc(userCred.user.uid).get();
    })
    .then(doc => {
      if (doc.exists) {
        const role = doc.data().role;
        if (role === "student") {
          window.location.href = "student.html";
        } else {
          window.location.href = "admin.html";
        }
      }
    })
    .catch(err => alert(err.message));
}

// Logout
function logout() {
  auth.signOut().then(() => {
    window.location.href = "index.html";
  });
}
