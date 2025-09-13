import { auth, db } from './firebase-config.js';
import { signOut } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js";
import { collection, addDoc, onSnapshot, doc, updateDoc, deleteDoc } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js";

const logoutBtn = document.getElementById('logoutBtn');
if (logoutBtn) logoutBtn.addEventListener('click', () => signOut(auth));

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

// Show Companies
const companiesTable = document.getElementById('companiesTable');
onSnapshot(collection(db,'companies'), (snapshot) => {
  companiesTable.innerHTML = '';
  snapshot.forEach(docSnap => {
    const data = docSnap.data();
    const div = document.createElement('div');
    div.innerHTML = `${data.name} - ${data.role} - ${data.ctc}`;
    companiesTable.appendChild(div);
  });
});