// User Registration
function registerUser(event) {
    event.preventDefault();
    
    let name = document.getElementById("register-name").value;
    let email = document.getElementById("register-email").value;
    let password = document.getElementById("register-password").value;
    let users = JSON.parse(localStorage.getItem("users")) || [];
    
    // Check if email already exists
    if (users.some(user => user.email === email)) {
        alert("Email already registered!");
        return;
    }
    
    let newUser = { name, email, password, joinDate: new Date(), role: "user" };
    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));
    alert("Registration successful! You can now log in.");
    window.location.href = "login.html";
}

// User Login
function loginUser(event) {
    event.preventDefault();
    
    let email = document.getElementById("login-email").value;
    let password = document.getElementById("login-password").value;
    let users = JSON.parse(localStorage.getItem("users")) || [];
    
    let user = users.find(user => user.email === email && user.password === password);
    if (!user) {
        alert("Invalid email or password!");
        return;
    }
    
    localStorage.setItem("currentUser", JSON.stringify(user));
    alert("Login successful!");
    window.location.href = user.role === "admin" ? "admin_dashboard.html" : "user_dashboard.html";
}

// Load User Details
function loadUserDetails() {
    let currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (!currentUser) {
        alert("No user logged in!");
        window.location.href = "login.html";
        return;
    }
    
    document.getElementById("user-name").textContent = currentUser.name;
    document.getElementById("user-email").textContent = currentUser.email;
    document.getElementById("user-join-date").textContent = new Date(currentUser.joinDate).toLocaleDateString();
}

// Admin View Users
function loadUsersForAdmin() {
    let users = JSON.parse(localStorage.getItem("users")) || [];
    let usersTable = document.getElementById("users-body");
    usersTable.innerHTML = "";
    
    users.forEach((user, index) => {
        let row = `<tr>
            <td>${user.name}</td>
            <td>${user.email}</td>
            <td>${new Date(user.joinDate).toLocaleDateString()}</td>
            <td>
                <button onclick="deleteUser(${index})">Delete</button>
            </td>
        </tr>`;
        usersTable.innerHTML += row;
    });
}

// Delete User
function deleteUser(index) {
    if (!confirm("Are you sure you want to delete this user?")) return;
    let users = JSON.parse(localStorage.getItem("users")) || [];
    users.splice(index, 1);
    localStorage.setItem("users", JSON.stringify(users));
    loadUsersForAdmin();
}