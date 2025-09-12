// Check if user logged in
/*
auth.onAuthStateChanged(user => {
  if (!user) {
    window.location.href = "index.html";
  } else {
    loadCompanies(user.uid);
  }
});

// Load company list from Firestore
function loadCompanies(studentId) {
  const companyList = document.getElementById("companyList");
  db.collection("companies").get().then(snapshot => {
    companyList.innerHTML = "";
    snapshot.forEach(doc => {
      const company = doc.data();
      companyList.innerHTML += `
        <div class="col-md-4 mb-3">
          <div class="card shadow-sm h-100">
            <div class="card-body">
              <h5 class="card-title">${company.name}</h5>
              <p class="card-text">
                <strong>Role:</strong> ${company.role}<br>
                <strong>Package:</strong> ${company.package}
              </p>
              <button class="btn btn-primary w-100" onclick="applyJob('${doc.id}', '${studentId}')">
                Apply Now
              </button>
            </div>
          </div>
        </div>
      `;
    });
  });
}

// Apply for job
function applyJob(companyId, studentId) {
  db.collection("applications").add({
    companyId,
    studentId,
    status: "Applied",
    appliedAt: new Date()
  }).then(() => {
    alert("✅ Application submitted successfully!");
  }).catch(err => alert(err.message));
}

// Apply to Company Function
async function applyToCompany(companyId, rollNo) {
  try {
    const companyRef = db.collection("companies").doc(companyId);

    await companyRef.update({
      appliedStudents: firebase.firestore.FieldValue.arrayUnion(rollNo)
    });

    alert("✅ Successfully Applied!");
  } catch (error) {
    console.error("Error applying: ", error);
    alert("❌ Failed to apply. Try again.");
  }
}

// Logout
function logout() {
  auth.signOut().then(() => {
    window.location.href = "index.html";
  });
}
*/