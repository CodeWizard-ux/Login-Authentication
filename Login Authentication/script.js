document.addEventListener('DOMContentLoaded', () => {
    
    // --- UI Elements ---
    const loginView = document.getElementById('login-view');
    const registerView = document.getElementById('register-view');
    const dashboardView = document.getElementById('dashboard-view');
    
    const goToRegisterBtn = document.getElementById('go-to-register');
    const goToLoginBtn = document.getElementById('go-to-login');
    const logoutBtn = document.getElementById('logout-btn');

    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    
    const loginError = document.getElementById('login-error');
    const registerError = document.getElementById('register-error');
    const welcomeMessage = document.getElementById('welcome-message');

    // --- Navigation Functions ---
    function switchView(viewToShow) {
        // Hide all views
        loginView.classList.remove('active-view');
        registerView.classList.remove('active-view');
        dashboardView.classList.remove('active-view');
        
        // Clear forms and errors
        loginForm.reset();
        registerForm.reset();
        loginError.style.display = 'none';
        registerError.style.display = 'none';

        // Show requested view
        viewToShow.classList.add('active-view');
    }

    goToRegisterBtn.addEventListener('click', (e) => {
        e.preventDefault();
        switchView(registerView);
    });

    goToLoginBtn.addEventListener('click', (e) => {
        e.preventDefault();
        switchView(loginView);
    });

    // --- Helper Function: Show Error ---
    function showError(element, message) {
        element.textContent = message;
        element.style.display = 'block';
    }

    // --- Authentication Logic ---

    // 1. Initialize Users Database (localStorage)
    // If no users exist, create an empty array
    if (!localStorage.getItem('usersDB')) {
        localStorage.setItem('usersDB', JSON.stringify([]));
    }

    // 2. Check Active Session on Load
    const activeSession = JSON.parse(localStorage.getItem('activeUser'));
    if (activeSession) {
        // User is already logged in
        showDashboard(activeSession.name);
    }

    // 3. Handle Registration
    registerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const name = document.getElementById('reg-name').value.trim();
        const email = document.getElementById('reg-email').value.trim();
        const password = document.getElementById('reg-password').value;

        let users = JSON.parse(localStorage.getItem('usersDB'));

        // Check if email already exists
        const userExists = users.find(u => u.email === email);
        if (userExists) {
            showError(registerError, "An account with this email already exists.");
            return;
        }

        // Save new user (In a real app, NEVER save raw passwords!)
        const newUser = { name, email, password };
        users.push(newUser);
        localStorage.setItem('usersDB', JSON.stringify(users));

        // Auto-login after registration
        loginUser(newUser);
    });

    // 4. Handle Login
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const email = document.getElementById('login-email').value.trim();
        const password = document.getElementById('login-password').value;

        let users = JSON.parse(localStorage.getItem('usersDB'));

        // Find user by email
        const user = users.find(u => u.email === email);

        if (!user) {
            showError(loginError, "No account found with that email.");
            return;
        }

        if (user.password !== password) {
            showError(loginError, "Incorrect password.");
            return;
        }

        // Login successful
        loginUser(user);
    });

    // 5. Login / Session Management
    function loginUser(user) {
        // Save session
        localStorage.setItem('activeUser', JSON.stringify({ name: user.name, email: user.email }));
        showDashboard(user.name);
    }

    function showDashboard(name) {
        // Update UI with user's name (e.g., OM)
        welcomeMessage.textContent = `Welcome, ${name}!`;
        // Update Avatar initial
        document.querySelector('.avatar').textContent = name.substring(0, 2).toUpperCase();
        switchView(dashboardView);
    }

    // 6. Handle Logout
    logoutBtn.addEventListener('click', () => {
        // Destroy session
        localStorage.removeItem('activeUser');
        switchView(loginView);
    });
});