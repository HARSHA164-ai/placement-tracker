// Add Company
function addCompany() {
  const name = document.getElementById("companyName").value;
  const skills = document.getElementById("skillsRequired").value;
  const cgpa = document.getElementById("minCGPA").value;

  db.collection("companies").add({ name, skills, cgpa })
    .then(() => alert("Company Added Successfully!"))
    .catch(err => alert(err.message));
}

// Load companies in admin dashboard
db.collection("companies").onSnapshot(snapshot => {
  const list = document.getElementById("adminCompanyList");
  list.innerHTML = "";
  snapshot.forEach(doc => {
    const data = doc.data();
    list.innerHTML += `
      <div class="card">
        <h3>${data.name}</h3>
        <p>Skills: ${data.skills}</p>
        <p>Min CGPA: ${data.cgpa}</p>
        <button onclick="deleteCompany('${doc.id}')">Delete</button>
      </div>
    `;
  });
});

// Delete Company
function deleteCompany(id) {
  db.collection("companies").doc(id).delete();
}
