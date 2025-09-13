import { auth, db } from './firebase-config.js';
import { signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js";
import { collection, addDoc, onSnapshot, query, where, doc, getDoc } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js";

// Logout
const logoutBtn = document.getElementById('logoutBtn');
if (logoutBtn) logoutBtn.addEventListener('click', () => window.location.href = 'index.html');

// Show Companies with Apply button
const companiesList = document.getElementById('companiesList');
function renderCompanies(userId) {
  onSnapshot(collection(db, 'companies'), (snapshot) => {
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

function attachApplyActions(userId) {
  document.querySelectorAll('.applyBtn').forEach(btn => {
    btn.addEventListener('click', async () => {
      await addDoc(collection(db, 'applications'), {
        user: userId,
        company: btn.dataset.id,
        status: 'applied'
      });
      alert('Application submitted!');
    });
  });
}

// Helper to style status with color badge
function getStatusBadge(status) {
  let color = 'gray';
  if (status === 'applied') color = 'blue';
  else if (status === 'shortlisted') color = 'orange';
  else if (status === 'interview') color = 'purple';
  else if (status === 'selected') color = 'green';
  else if (status === 'rejected') color = 'red';

  return `<span style="padding:2px 6px; border-radius:4px; color:white; background:${color}; font-size:12px;">${status}</span>`;
}

// Show My Applications with company name instead of ID
const applicationsList = document.getElementById('applicationsList');
function renderApplications(userId) {
  const q = query(collection(db, 'applications'), where('user', '==', userId));
  onSnapshot(q, async (snapshot) => {
    applicationsList.innerHTML = '';
    for (const docSnap of snapshot.docs) {
      const data = docSnap.data();
      let companyName = data.company;
      try {
        const companyRef = doc(db, 'companies', data.company);
        const companyDoc = await getDoc(companyRef);
        if (companyDoc.exists()) {
          const cData = companyDoc.data();
          companyName = `${cData.name} - ${cData.role} - ${cData.ctc}`;
        }
      } catch (e) {
        console.error('Error fetching company details', e);
      }
      const div = document.createElement('div');
      div.textContent = `${companyName} → ${data.status}`;
      applicationsList.appendChild(div);
    }
  });
}

// Auth state listener
onAuthStateChanged(auth, (user) => {
  if (user) {
    renderCompanies(user.uid);
    renderApplications(user.uid);
  }
});