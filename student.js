import { auth, db } from './firebase-config.js';
import { signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js";
import { collection, addDoc, onSnapshot, query, where } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js";

// Logout
const logoutBtn = document.getElementById('logoutBtn');
if (logoutBtn) logoutBtn.addEventListener('click', () => window.location.href = 'index.html');

// Show Companies with Apply button
const companiesList = document.getElementById('companiesList');
function renderCompanies(userId){
  onSnapshot(collection(db,'companies'), (snapshot) => {
    companiesList.innerHTML = '';
    snapshot.forEach(docSnap => {
      const data = docSnap.data();
      const div = document.createElement('div');
      div.innerHTML = `
        <strong>${data.name}</strong> - ${data.role} - ${data.ctc}
        <button data-id="${docSnap.id}" class="applyBtn">Apply</button>
      `;
      companiesList.appendChild(div);
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

// Show My Applications
const applicationsList = document.getElementById('applicationsList');
function renderApplications(userId){
  const q = query(collection(db,'applications'), where('user','==', userId));
  onSnapshot(q, (snapshot) => {
    applicationsList.innerHTML = '';
    snapshot.forEach(docSnap => {
      const data = docSnap.data();
      const div = document.createElement('div');
      div.textContent = `${data.company} - ${data.status}`;
      applicationsList.appendChild(div);
    });
  });
}

// Auth state listener
onAuthStateChanged(auth, (user) => {
  if(user){
    renderCompanies(user.uid);
    renderApplications(user.uid);
  }
});
