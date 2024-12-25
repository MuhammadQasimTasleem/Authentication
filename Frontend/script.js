const API_URL = 'http://localhost:8000/users';

// Handle User Form Submission (Create or Update)
document.getElementById('user-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const userId = document.getElementById('user-id').value;

    const url = userId ? `${API_URL}/${userId}` : API_URL;
    const method = userId ? 'PUT' : 'POST';

    try {
        const response = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password }),
        });

        const data = await response.json();
        showMessage(data.message);
        fetchUsers();
        resetForm();
    } catch (error) {
        console.error('Error saving user:', error);
    }
});

// Fetch and Display Users
async function fetchUsers() {
    try {
        const response = await fetch(API_URL);
        const users = await response.json();
        displayUsers(users);
    } catch (error) {
        console.error('Error fetching users:', error);
    }
}

// Display Users
function displayUsers(users) {
    const userList = document.getElementById('user-list');
    userList.innerHTML = '';

    users.forEach((user) => {
        const userEl = document.createElement('div');
        userEl.className = 'user';
        userEl.innerHTML = `
            <span>${user.name} - ${user.email}</span>
            <div>
                <button class="update-btn" onclick="populateForm('${user._id}', '${user.name}', '${user.email}', '${user.password}')">Edit</button>
                <button onclick="deleteUser('${user._id}')">Delete</button>
            </div>
        `;
        userList.appendChild(userEl);
    });
}

// Delete User
async function deleteUser(userId) {
    try {
        await fetch(`${API_URL}/${userId}`, { method: 'DELETE' });
        showMessage('User deleted successfully');
        fetchUsers();
    } catch (error) {
        console.error('Error deleting user:', error);
    }
}

// Populate Form for Editing
function populateForm(id, name, email, password) {
    document.getElementById('user-id').value = id;
    document.getElementById('name').value = name;
    document.getElementById('email').value = email;
    document.getElementById('password').value = password;
}

// Search User by Email
document.getElementById('search-user-btn').addEventListener('click', async () => {
    const email = document.getElementById('search-email').value;
    try {
        const response = await fetch(`${API_URL}?email=${email}`);
        const user = await response.json();

        if (user) {
            const userList = document.getElementById('user-list');
            userList.innerHTML = ''; // Clear previous results
            displayUsers([user]); // Display the searched user only
            showMessage('User found');
        } else {
            showMessage('User not found');
        }
    } catch (error) {
        console.error('Error searching user:', error);
    }
});

// Reset Form
function resetForm() {
    document.getElementById('user-id').value = '';
    document.getElementById('name').value = '';
    document.getElementById('email').value = '';
    document.getElementById('password').value = '';
}

// Show Message
function showMessage(message) {
    const messageDiv = document.getElementById('message');
    messageDiv.textContent = message;
    setTimeout(() => {
        messageDiv.textContent = '';
    }, 3000);
}

// Initial fetch of users
fetchUsers();
