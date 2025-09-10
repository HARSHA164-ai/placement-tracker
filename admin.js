// Check if admin logged in
auth.onAuthStateChanged(user => {
    if (!user) {
        window.location.href = "index.html";
    } else {
        db.collection("users").doc(user.uid).get().then(doc => {
            if (!doc.exists || doc.data().role !== "admin") {
                alert("❌ Access Denied! Only Admins allowed.");
                window.location.href = "index.html";
            } else {
                loadApplications();
            }
        });
    }
});

// Add New Company
function addCompany() {
    const name = document.getElementById("companyName").value;
    const role = document.getElementById("companyRole").value;
    const packageValue = document.getElementById("companyPackage").value;

    if (!name || !role || !packageValue) {
        alert("⚠️ Please fill all fields");
        return;
    }

    db.collection("companies").add({
        name,
        role,
        package: packageValue,
        createdAt: new Date()
    }).then(() => {
        alert("✅ Company Added Successfully!");
        document.getElementById("companyName").value = "";
        document.getElementById("companyRole").value = "";
        document.getElementById("companyPackage").value = "";
    }).catch(err => alert(err.message));
}

// Load Applications
function loadApplications() {
    const list = document.getElementById("applicationsList");
    db.collection("applications").get().then(snapshot => {
        list.innerHTML = "";
        snapshot.forEach(doc => {
            const app = doc.data();
            Promise.all([
                db.collection("users").doc(app.studentId).get(),
                db.collection("companies").doc(app.companyId).get()
            ]).then(([studentDoc, companyDoc]) => {
                if (studentDoc.exists && companyDoc.exists) {
                    list.innerHTML += `
            <tr>
              <td>${studentDoc.data().name}</td>
              <td>${companyDoc.data().name}</td>
              <td>${app.status}</td>
              <td>
                <select onchange="updateStatus('${doc.id}', this.value)" class="form-select form-select-sm">
                  <option ${app.status === "Applied" ? "selected" : ""}>Applied</option>
                  <option ${app.status === "Shortlisted" ? "selected" : ""}>Shortlisted</option>
                  <option ${app.status === "Interview" ? "selected" : ""}>Interview</option>
                  <option ${app.status === "Selected" ? "selected" : ""}>Selected</option>
                  <option ${app.status === "Rejected" ? "selected" : ""}>Rejected</option>
                </select>
              </td>
            </tr>
          `;
                }
            });
        });
    });
}

// Update Application Status
function updateStatus(appId, newStatus) {
    db.collection("applications").doc(appId).update({ status: newStatus })
        .then(() => alert("✅ Status Updated!"))
        .catch(err => alert(err.message));
}

// Logout
function logout() {
    auth.signOut().then(() => {
        window.location.href = "index.html";
    });
}
function addCompany() {
    const name = document.getElementById("companyName").value;
    const role = document.getElementById("companyRole").value;
    const packageValue = document.getElementById("companyPackage").value;

    if (!name || !role || !packageValue) {
        alert("⚠️ Please fill all fields");
        return;
    }

    // 1. Save to Firebase
    db.collection("companies").add({
        name,
        role,
        package: packageValue,
        createdAt: new Date()
    }).then(() => {
        alert("✅ Company Added Successfully!");

        // 2. Send data to Google Sheets (Apps Script)
        fetch("https://script.google.com/macros/s/AKfycbx9cbrhY4QSGh_pRjBMjOGWd6Zh5U8YNiVc09rvNRQ7srJCoVMblfKKPZqH3V3gWHLhrg/exec", {
            method: "POST",
            body: JSON.stringify({ name, role, package: packageValue }),
            headers: { "Content-Type": "application/json" }
        })
            .then(res => res.text())
            .then(res => console.log("Sheets Sync:", res))
            .catch(err => console.error("Sheets Error:", err));

    }).catch(err => alert(err.message));
}
