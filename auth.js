// Show/Hide Login & Register Forms
function showRegister() {
  document.getElementById("loginDiv").style.display = "none";
  document.getElementById("registerDiv").style.display = "block";
}
function showLogin() {
  document.getElementById("registerDiv").style.display = "none";
  document.getElementById("loginDiv").style.display = "block";
}

// Register User
function register() {
  const name = document.getElementById("registerName").value;
  const email = document.getElementById("registerEmail").value;
  const password = document.getElementById("registerPassword").value;
  const role = document.getElementById("registerRole").value;

  auth.createUserWithEmailAndPassword(email, password)
    .then(cred => {
      return db.collection("users").doc(cred.user.uid).set({
        name, email, role
      });
    })
    .then(() => {
      alert("✅ Registration Successful!");
      showLogin();
    })
    .catch(err => alert(err.message));
}

// Login User
function login() {
  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;

  auth.signInWithEmailAndPassword(email, password)
    .then(cred => {
      db.collection("users").doc(cred.user.uid).get().then(doc => {
        if (doc.exists) {
          const role = doc.data().role;
          if (role === "student") {
            window.location.href = "student.html";
          } else if (role === "admin") {
            window.location.href = "admin.html";
          }
        }
      });
    })
    .catch(err => alert(err.message));
}
