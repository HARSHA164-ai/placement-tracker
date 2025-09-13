import { auth, db } from './firebase-config.js';
import { signOut } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js";
import { collection, addDoc, query, where, getDocs, onSnapshot } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js";

const logoutBtn = document.getElementById('logoutBtn');
if (logoutBtn) logoutBtn.addEventListener('click', () => window.location.href = 'index.html');

// List companies
const companiesList = document.getElementById('companiesList');
onSnapshot(collection(db, 'companies'), (snapshot) => {
  companiesList.innerHTML = '';
  snapshot.forEach(docSnap => {
    const data = docSnap.data();
    const div = document.createElement('div');
    div.innerHTML = `${data.name} - ${data.role} - ${data.ctc} <button data-id="${docSnap.id}" class="applyBtn">Apply</button>`;
    companiesList.appendChild(div);
  });
  document.querySelectorAll('.applyBtn').forEach(btn => {
    btn.addEventListener('click', async () => {
      await addDoc(collection(db, 'applications'), {
        user: auth.currentUser.uid,
        company: btn.dataset.id,
        status: 'applied'
      });
      alert('Applied!');
    });
  });
});

// Show applications
const applicationsList = document.getElementById('applicationsList');
const q = query(collection(db, 'applications'), where('user','==', auth.currentUser.uid));
onSnapshot(q, (snapshot) => {
  applicationsList.innerHTML = '';
  snapshot.forEach(docSnap => {
    const data = docSnap.data();
    const div = document.createElement('div');
    div.textContent = `${data.company} - ${data.status}`;
    applicationsList.appendChild(div);
  });
});