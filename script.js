```javascript
// ============================================================
//  script.js — Frontend JavaScript for Skill Swap Hub
// ============================================================

// ✅ LOCAL BACKEND URL (CHANGED HERE)
const BASE_URL = "http://localhost:8080";

function saveUser(event) {
  event.preventDefault();

  const name  = document.getElementById("name").value;
  const teach = document.getElementById("teach").value;
  const learn = document.getElementById("learn").value;

  fetch(BASE_URL + "/addUser", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ name, teach, learn })
  })
  .then(res => res.json())
  .then(data => {
    alert("✅ Registered successfully! Welcome, " + name);
    event.target.reset();
  })
  .catch(err => {
    alert("❌ Error saving user. Is the backend server running?");
    console.error(err);
  });
}

function displayUsers() {
  fetch(BASE_URL + "/getUsers")
  .then(res => res.json())
  .then(users => {
    let output = "";

    if (users.length === 0) {
      output = "<p>No users registered yet. Be the first!</p>";
    } else {
      users.forEach(user => {
        output += `
          <div class="card">
            <h3>👤 ${user.name}</h3>
            <p><strong>🎓 Teaches:</strong> ${user.teach}</p>
            <p><strong>📘 Learning:</strong> ${user.learn}</p>
            <button onclick="deleteUser('${user.name}')">🗑️ Delete</button>
          </div>
        `;
      });
    }

    document.getElementById("skillList").innerHTML = output;
  })
  .catch(err => {
    document.getElementById("skillList").innerHTML =
      "<p style='color:red'>❌ Could not load users.</p>";
    console.error(err);
  });
}

function deleteUser(name) {
  if (!confirm(`Delete user "${name}"?`)) return;

  fetch(BASE_URL + "/deleteUser/" + encodeURIComponent(name), {
    method: "DELETE"
  })
  .then(res => res.json())
  .then(data => {
    alert(data.message);
    displayUsers();
  })
  .catch(err => {
    alert("❌ Error deleting user.");
    console.error(err);
  });
}

function loadMatches() {
  fetch(BASE_URL + "/matchUsers")
  .then(res => res.json())
  .then(matches => {
    let output = "";

    if (matches.length === 0) {
      output = "<p>No matches yet.</p>";
    } else {
      matches.forEach(match => {
        output += `
          <div style="margin:10px; padding:10px; border:1px solid #ccc; border-radius:8px;">
            <b>🤝 ${match}</b>
            <br>
            <button onclick="fillPartner('${match}')">Select as Partner</button>
          </div>
        `;
      });
    }

    document.getElementById("matches").innerHTML = output;
  })
  .catch(err => {
    document.getElementById("matches").innerHTML =
      "<p style='color:red'>❌ Could not load matches.</p>";
    console.error(err);
  });
}

function fillPartner(match) {
  let names = match.split("↔");
  let partner = names[1].trim().split(" ")[0];
  document.getElementById("partnerName").value = partner;
}

function sendRequest(event) {
  event.preventDefault();
  const yourName    = document.getElementById("yourName").value;
  const partnerName = document.getElementById("partnerName").value;

  document.getElementById("msg").innerText =
    `✅ Request sent from ${yourName} to ${partnerName}!`;
  event.target.reset();
}

function openLogin() {
  document.getElementById("loginModal").style.display = "flex";
}

function closeLogin() {
  document.getElementById("loginModal").style.display = "none";
}

function logout() {
  localStorage.removeItem("username");
  window.location.href = "login.html";
}

window.onload = function () {
  const storedName = localStorage.getItem("username");

  const nameField = document.getElementById("name");
  if (nameField && storedName) {
    nameField.value = storedName;
  }

  const yourNameField = document.getElementById("yourName");
  if (yourNameField && storedName) {
    yourNameField.value = storedName;
  }

  if (document.getElementById("skillList")) {
    displayUsers();
  }

  if (document.getElementById("matches")) {
    loadMatches();
  }
};
```
