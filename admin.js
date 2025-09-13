import { auth, db } from './firebase-config.js';
import { signOut } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js";
import { collection, addDoc, onSnapshot, doc, updateDoc, deleteDoc, getDocs } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js";

const logoutBtn = document.getElementById('logoutBtn');
if (logoutBtn) logoutBtn.addEventListener('click', () => window.location.href = 'index.html');

// Add Company
const companyForm = document.getElementById('companyForm');
companyForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const name = document.getElementById('companyName').value;
  const role = document.getElementById('companyRole').value;
  const ctc = document.getElementById('companyCTC').value;
  await addDoc(collection(db,'companies'), { name, role, ctc });
  companyForm.reset();
});

// Show Companies with Edit/Delete
const companiesTable = document.getElementById('companiesTable');
function renderCompanies(){
  onSnapshot(collection(db,'companies'), (snapshot) => {
    companiesTable.innerHTML = '';
    snapshot.forEach(docSnap => {
      const data = docSnap.data();
      const div = document.createElement('div');
      div.innerHTML = `
        <strong>${data.name}</strong> - ${data.role} - ${data.ctc}
        <button data-id="${docSnap.id}" class="editCompany">Edit</button>
        <button data-id="${docSnap.id}" class="deleteCompany">Delete</button>
      `;
      companiesTable.appendChild(div);
    });
    attachCompanyActions();
  });
}

function attachCompanyActions(){
  document.querySelectorAll('.deleteCompany').forEach(btn => {
    btn.addEventListener('click', async ()=>{
      if(confirm('Are you sure you want to delete this company?')){
        await deleteDoc(doc(db,'companies', btn.dataset.id));
      }
    });
  });
  document.querySelectorAll('.editCompany').forEach(btn => {
    btn.addEventListener('click', async ()=>{
      const companyDoc = doc(db,'companies', btn.dataset.id);
      const newName = prompt('Enter new name:');
      const newRole = prompt('Enter new role:');
      const newCTC = prompt('Enter new CTC:');
      if(newName && newRole && newCTC){
        await updateDoc(companyDoc, { name:newName, role:newRole, ctc:newCTC });
      }
    });
  });
}

renderCompanies();

// Manage Users
const usersTable = document.getElementById('usersTable');
async function loadUsers(){
  const usersSnap = await getDocs(collection(db,'users'));
  usersTable.innerHTML = '';
  usersSnap.forEach(userDoc => {
    const user = userDoc.data();
    const div = document.createElement('div');
    div.innerHTML = `
      <strong>${user.name}</strong> (${user.email}) - Role: ${user.role}
      <button data-id="${userDoc.id}" class="makeAdmin">Make Admin</button>
      <button data-id="${userDoc.id}" class="makeStudent">Make Student</button>
      <button data-id="${userDoc.id}" class="deleteUser">Delete</button>
      <div id="apps-${userDoc.id}" class="apps"></div>
    `;
    usersTable.appendChild(div);
    loadApplications(userDoc.id);
  });
  attachUserActions();
}

async function attachUserActions(){
  document.querySelectorAll('.makeAdmin').forEach(btn=>{
    btn.addEventListener('click', async ()=>{
      await updateDoc(doc(db,'users',btn.dataset.id), { role:'admin' });
      loadUsers();
    });
  });
  document.querySelectorAll('.makeStudent').forEach(btn=>{
    btn.addEventListener('click', async ()=>{
      await updateDoc(doc(db,'users',btn.dataset.id), { role:'student' });
      loadUsers();
    });
  });
  document.querySelectorAll('.deleteUser').forEach(btn=>{
    btn.addEventListener('click', async ()=>{
      if(confirm('Are you sure you want to delete this user?')){
        await deleteDoc(doc(db,'users',btn.dataset.id));
        loadUsers();
      }
    });
  });
}

// Manage Applications per User
async function loadApplications(userId){
  const appsSnap = await getDocs(collection(db,'applications'));
  const container = document.getElementById(`apps-${userId}`);
  container.innerHTML = '<em>Applications:</em><br>';
  appsSnap.forEach(appDoc => {
    const app = appDoc.data();
    if(app.user === userId){
      const div = document.createElement('div');
      div.innerHTML = `Company: ${app.company}, Status: ${app.status}
        <select data-id="${appDoc.id}" class="statusSelect">
          <option value="applied" ${app.status==='applied'?'selected':''}>Applied</option>
          <option value="shortlisted" ${app.status==='shortlisted'?'selected':''}>Shortlisted</option>
          <option value="interview" ${app.status==='interview'?'selected':''}>Interview</option>
          <option value="selected" ${app.status==='selected'?'selected':''}>Selected</option>
          <option value="rejected" ${app.status==='rejected'?'selected':''}>Rejected</option>
        </select>`;
      container.appendChild(div);
    }
  });
  attachStatusActions();
}

function attachStatusActions(){
  document.querySelectorAll('.statusSelect').forEach(sel=>{
    sel.addEventListener('change', async ()=>{
      await updateDoc(doc(db,'applications',sel.dataset.id), { status: sel.value });
      loadUsers();
    });
  });
}

// Initial load
loadUsers();
