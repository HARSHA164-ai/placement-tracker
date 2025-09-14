/*import { auth, db } from './firebase-config.js';
import { signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js";
import { collection, addDoc, onSnapshot, query, where, doc, getDoc } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js";

// Logout
const logoutBtn = document.getElementById('logoutBtn');
if (logoutBtn) logoutBtn.addEventListener('click', () => signOut(auth));

// Show Companies with Apply button
const companiesList = document.getElementById('companiesList');
function renderCompanies(userId){
  onSnapshot(collection(db,'companies'), (snapshot) => {
    companiesList.innerHTML = '';
    snapshot.forEach(docSnap => {
      const data = docSnap.data();
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${data.name}</td>
        <td>${data.role}</td>
        <td>${data.ctc}</td>
        <td><button data-id="${docSnap.id}" class="applyBtn">Apply</button></td>
      `;
      companiesList.appendChild(row);
    });
    attachApplyActions(userId);
  });
}

function attachApplyActions(userId){
  document.querySelectorAll('.applyBtn').forEach(btn => {
    btn.addEventListener('click', async ()=>{
      await addDoc(collection(db,'applications'), {
        user: userId,
        company: btn.dataset.id,
        status: 'applied'
      });
      alert('Application submitted!');
    });
  });
}

// Helper to style status with color badge
function getStatusBadge(status){
  let color = 'gray';
  if(status === 'applied') color = 'blue';
  else if(status === 'shortlisted') color = 'orange';
  else if(status === 'interview') color = 'purple';
  else if(status === 'selected') color = 'green';
  else if(status === 'rejected') color = 'red';

  return `<span style="padding:4px 10px; border-radius:12px; color:white; background:${color}; font-size:12px;">${status}</span>`;
}

// Show My Applications in table format
const applicationsList = document.getElementById('applicationsList');
function renderApplications(userId){
  const q = query(collection(db,'applications'), where('user','==', userId));
  onSnapshot(q, async (snapshot) => {
    applicationsList.innerHTML = '<table class="app-table"><thead><tr><th>Company</th><th>Role</th><th>CTC</th><th>Status</th></tr></thead><tbody></tbody></table>';
    const tbody = applicationsList.querySelector('tbody');

    for (const docSnap of snapshot.docs) {
      const data = docSnap.data();
      let cData = { name: data.company, role: '', ctc: '' };
      try {
        const companyRef = doc(db, 'companies', data.company);
        const companyDoc = await getDoc(companyRef);
        if(companyDoc.exists()){
          cData = companyDoc.data();
        }
      } catch (e) {
        console.error('Error fetching company details', e);
      }
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${cData.name}</td>
        <td>${cData.role}</td>
        <td>${cData.ctc}</td>
        <td>${getStatusBadge(data.status)}</td>
      `;
      tbody.appendChild(row);
    }
  });
}

// Auth state listener
onAuthStateChanged(auth, (user) => {
  if(user){
    renderCompanies(user.uid);
    renderApplications(user.uid);
  }
});
*/