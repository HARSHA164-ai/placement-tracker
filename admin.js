/*import { auth, db } from './firebase-config.js';
import { signOut } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js";
import { collection, addDoc, onSnapshot, doc, updateDoc, deleteDoc, getDocs } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js";

// Logout
const logoutBtn = document.getElementById('logoutBtn');
if (logoutBtn) logoutBtn.addEventListener('click', async () => {
  await signOut(auth);
  window.location.href = 'index.html';
});

// Add Company
const companyForm = document.getElementById('companyForm');
companyForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const name = document.getElementById('companyName').value;
  const role = document.getElementById('companyRole').value;
  const ctc = document.getElementById('companyCTC').value;
  await addDoc(collection(db, 'companies'), { name, role, ctc });
  companyForm.reset();
});

// Render Companies
function renderCompanies() {
  const companiesTable = document.getElementById('companiesTable');
  onSnapshot(collection(db, 'companies'), (snapshot) => {
    let html = `
      <table class="table table-bordered table-sm align-middle">
        <thead class="table-dark"><tr><th>Name</th><th>Role</th><th>CTC</th><th>Actions</th></tr></thead>
        <tbody>
    `;
    snapshot.forEach(docSnap => {
      const data = docSnap.data();
      html += `
        <tr>
          <td>${data.name}</td>
          <td>${data.role}</td>
          <td>${data.ctc}</td>
          <td>
            <button class="btn btn-sm btn-warning editCompany" data-id="${docSnap.id}">Edit</button>
            <button class="btn btn-sm btn-danger deleteCompany" data-id="${docSnap.id}">Delete</button>
          </td>
        </tr>`;
    });
    html += `</tbody></table>`;
    companiesTable.innerHTML = html;

    document.querySelectorAll('.deleteCompany').forEach(btn =>
      btn.addEventListener('click', async () => {
        if (confirm('Delete this company?')) await deleteDoc(doc(db, 'companies', btn.dataset.id));
      })
    );

    document.querySelectorAll('.editCompany').forEach(btn =>
      btn.addEventListener('click', async () => {
        const companyDoc = doc(db, 'companies', btn.dataset.id);
        const newName = prompt('New name:');
        const newRole = prompt('New role:');
        const newCTC = prompt('New CTC:');
        if (newName && newRole && newCTC) {
          await updateDoc(companyDoc, { name: newName, role: newRole, ctc: newCTC });
        }
      })
    );
  });
}
renderCompanies();

// Manage Users
async function loadUsers() {
  const usersTable = document.getElementById('usersTable');
  const usersSnap = await getDocs(collection(db, 'users'));
  let html = `
    <table class="table table-bordered table-sm align-middle">
      <thead class="table-dark"><tr><th>Name</th><th>Email</th><th>Role</th><th>Actions</th></tr></thead>
      <tbody>`;
  usersSnap.forEach(userDoc => {
    const user = userDoc.data();
    html += `
      <tr>
        <td>${user.name}</td>
        <td>${user.email}</td>
        <td>${user.role}</td>
        <td>
          <button class="btn btn-sm btn-primary makeAdmin" data-id="${userDoc.id}">Admin</button>
          <button class="btn btn-sm btn-secondary makeStudent" data-id="${userDoc.id}">Student</button>
          <button class="btn btn-sm btn-danger deleteUser" data-id="${userDoc.id}">Delete</button>
        </td>
      </tr>`;
  });
  html += `</tbody></table>`;
  usersTable.innerHTML = html;

  document.querySelectorAll('.makeAdmin').forEach(btn =>
    btn.addEventListener('click', async () => {
      await updateDoc(doc(db, 'users', btn.dataset.id), { role: 'admin' });
      loadUsers();
    })
  );
  document.querySelectorAll('.makeStudent').forEach(btn =>
    btn.addEventListener('click', async () => {
      await updateDoc(doc(db, 'users', btn.dataset.id), { role: 'student' });
      loadUsers();
    })
  );
  document.querySelectorAll('.deleteUser').forEach(btn =>
    btn.addEventListener('click', async () => {
      if (confirm('Delete user?')) {
        await deleteDoc(doc(db, 'users', btn.dataset.id));
        loadUsers();
      }
    })
  );
}
loadUsers();

// Manage Applications
// Manage Applications (with user + company details)
async function loadApplications() {
  const applicationsTable = document.getElementById('applicationsTable');
  const appsSnap = await getDocs(collection(db, 'applications'));

  let html = `
    <table class="table table-bordered table-sm align-middle">
      <thead class="table-dark">
        <tr>
          <th>User</th>
          <th>Email</th>
          <th>Company</th>
          <th>Role</th>
          <th>CTC</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
  `;

  for (const appDoc of appsSnap.docs) {
    const app = appDoc.data();

    // 🔹 Fetch user details
    let userName = "-", userEmail = "-";
    try {
      const userDoc = await getDoc(doc(db, "users", app.user));
      if (userDoc.exists()) {
        const u = userDoc.data();
        userName = u.name || "-";
        userEmail = u.email || "-";
      }
    } catch (e) { console.error("User fetch error:", e); }

    // 🔹 Fetch company details
    let companyName = "-", role = "-", ctc = "-";
    try {
      const companyDoc = await getDoc(doc(db, "companies", app.company));
      if (companyDoc.exists()) {
        const c = companyDoc.data();
        companyName = c.name || "-";
        role = c.role || "-";
        ctc = c.ctc || "-";
      }
    } catch (e) { console.error("Company fetch error:", e); }

    html += `
      <tr>
        <td>${userName}</td>
        <td>${userEmail}</td>
        <td>${companyName}</td>
        <td>${role}</td>
        <td>${ctc}</td>
        <td>
          <select class="form-select form-select-sm statusSelect" data-id="${appDoc.id}">
            <option value="applied" ${app.status === 'applied' ? 'selected' : ''}>Applied</option>
            <option value="shortlisted" ${app.status === 'shortlisted' ? 'selected' : ''}>Shortlisted</option>
            <option value="interview" ${app.status === 'interview' ? 'selected' : ''}>Interview</option>
            <option value="selected" ${app.status === 'selected' ? 'selected' : ''}>Selected</option>
            <option value="rejected" ${app.status === 'rejected' ? 'selected' : ''}>Rejected</option>
          </select>
        </td>
      </tr>
    `;
  }

  html += `</tbody></table>`;
  applicationsTable.innerHTML = html;

  // 🔹 Status change
  document.querySelectorAll('.statusSelect').forEach(sel =>
    sel.addEventListener('change', async () => {
      await updateDoc(doc(db, 'applications', sel.dataset.id), { status: sel.value });
      loadApplications();
    })
  );
}

loadApplications();
*/