// Load companies for student
db.collection("companies").onSnapshot(snapshot => {
  const list = document.getElementById("companyList");
  list.innerHTML = "";
  snapshot.forEach(doc => {
    const data = doc.data();
    list.innerHTML += `
      <div class="card">
        <h3>${data.name}</h3>
        <p>Skills: ${data.skills}</p>
        <p>Minimum CGPA: ${data.cgpa}</p>
        <button>Apply</button>
      </div>
    `;
  });
});
