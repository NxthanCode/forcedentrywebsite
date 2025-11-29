let currentUser = null;
let tempEmail = '';
let verificationTimer = null;
const API_BASE_URL = 'https://backend-2qx.onrender.com';
document.addEventListener('DOMContentLoaded', function() {
    setupAuthListeners();
    checkExistingSession();
    console.log('✅ FastAPI Auth System Loaded');
});
function setupAuthListeners() {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const verifyEmailForm = document.getElementById('verifyEmailForm');
    const forgotPasswordForm = document.getElementById('forgotPasswordForm');
    const resetPasswordForm = document.getElementById('resetPasswordForm');
    if (loginForm) loginForm.addEventListener('submit', handleLogin);
    if (registerForm) registerForm.addEventListener('submit', handleRegister);
    if (verifyEmailForm) verifyEmailForm.addEventListener('submit', handleEmailVerification);
    if (forgotPasswordForm) forgotPasswordForm.addEventListener('submit', handleForgotPassword);
    if (resetPasswordForm) resetPasswordForm.addEventListener('submit', handleResetPassword);
    const verifyCodeInput = document.getElementById('verifyCode');
    const resetCodeInput = document.getElementById('resetCode');
    if (verifyCodeInput) verifyCodeInput.addEventListener('input', formatCodeInput);
    if (resetCodeInput) resetCodeInput.addEventListener('input', formatCodeInput);
    window.addEventListener('click', function(event) {
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            if (event.target === modal) {
                closeModal(modal.id);
            }
        });
    });
}
function formatCodeInput(e) {
    const input = e.target;
    input.value = input.value.toUpperCase().replace(/[^A-Z0-9]/g, '').substring(0, 6);
}
async function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    const button = e.target.querySelector('button[type="submit"]');
    button.disabled = true;
    button.textContent = 'Logging in...';
    try {
        const response = await fetch(`${API_BASE_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.detail || 'Login failed');
        }
        currentUser = data.user;
        localStorage.setItem('forcedEntry_token', data.access_token);
        localStorage.setItem('forcedEntry_user', JSON.stringify(data.user));
        updateUI();
        closeModal('loginModal');
        showAlert('Login successful!', 'success');
    } catch (error) {
        showAlert(error.message, 'error');
    } finally {
        button.disabled = false;
        button.textContent = 'Login';
    }
}
async function handleRegister(e) {
    e.preventDefault();
    const username = document.getElementById('registerUsername').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const button = e.target.querySelector('button[type="submit"]');
    button.disabled = true;
    button.textContent = 'Registering...';
    try {
        const response = await fetch(`${API_BASE_URL}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email, password })
        });
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.detail || 'Registration failed');
        }
        tempEmail = email;
        showModal('verifyEmailModal');
        startVerificationTimer();
        showAlert('Registration successful! Check your email for verification code.', 'success');
    } catch (error) {
        showAlert(error.message, 'error');
    } finally {
        button.disabled = false;
        button.textContent = 'Register';
    }
}
async function handleEmailVerification(e) {
    e.preventDefault();
    const code = document.getElementById('verifyCode').value;
    const button = e.target.querySelector('button[type="submit"]');
    if (code.length !== 6) {
        showAlert('Please enter a 6-digit code', 'error');
        return;
    }
    button.disabled = true;
    button.textContent = 'Verifying...';
    try {
        const response = await fetch(`${API_BASE_URL}/verify-email`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: tempEmail, code })
        });
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.detail || 'Verification failed');
        }
        currentUser = data.user;
        localStorage.setItem('forcedEntry_token', data.access_token);
        localStorage.setItem('forcedEntry_user', JSON.stringify(data.user));
        stopVerificationTimer();
        updateUI();
        closeModal('verifyEmailModal');
        showModal('loginModal');
        showAlert('Email verified successfully! You can now login.', 'success');
        tempEmail = '';
    } catch (error) {
        showAlert(error.message, 'error');
    } finally {
        button.disabled = false;
        button.textContent = 'Verify';
    }
}
async function handleForgotPassword(e) {
    e.preventDefault();
    const email = document.getElementById('forgotPasswordEmail').value;
    const button = e.target.querySelector('button[type="submit"]');
    button.disabled = true;
    button.textContent = 'Sending...';
    try {
        const response = await fetch(`${API_BASE_URL}/forgot-password`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email })
        });
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.detail || 'Request failed');
        }
        tempEmail = email;
        showModal('resetPasswordModal');
        startVerificationTimer();
        showAlert('If an account exists, a reset code has been sent to your email.', 'info');
    } catch (error) {
        showAlert(error.message, 'error');
    } finally {
        button.disabled = false;
        button.textContent = 'Send Reset Code';
    }
}
async function handleResetPassword(e) {
    e.preventDefault();
    const code = document.getElementById('resetCode').value;
    const newPassword = document.getElementById('newPassword').value;
    const button = e.target.querySelector('button[type="submit"]');
    if (code.length !== 6) {
        showAlert('Please enter a 6-digit code', 'error');
        return;
    }
    button.disabled = true;
    button.textContent = 'Resetting...';
    try {
        const response = await fetch(`${API_BASE_URL}/reset-password`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: tempEmail, new_password: newPassword, code })
        });
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.detail || 'Password reset failed');
        }
        stopVerificationTimer();
        closeModal('resetPasswordModal');
        showModal('loginModal');
        showAlert('Password reset successfully! You can now login.', 'success');
        tempEmail = '';
    } catch (error) {
        showAlert(error.message, 'error');
    } finally {
        button.disabled = false;
        button.textContent = 'Reset Password';
    }
}
function checkExistingSession() {
    const token = localStorage.getItem('forcedEntry_token');
    const userData = localStorage.getItem('forcedEntry_user');
    if (token && userData) {
        currentUser = JSON.parse(userData);
        updateUI();
    }
}
function updateUI() {
    const userNavItem = document.getElementById('userNavItem');
    const authNavItem = document.getElementById('authNavItem');
    const navUsername = document.getElementById('navUsername');
    if (userNavItem && authNavItem && navUsername) {
        if (currentUser) {
            userNavItem.style.display = 'block';
            authNavItem.style.display = 'none';
            navUsername.textContent = currentUser.username;
        } else {
            userNavItem.style.display = 'none';
            authNavItem.style.display = 'block';
        }
    }
}
async function logout() {
    currentUser = null;
    localStorage.removeItem('forcedEntry_token');
    localStorage.removeItem('forcedEntry_user');
    updateUI();
    closeModal('profileModal');
    showAlert('Logged out successfully!', 'success');
}
async function showProfile() {
    if (!currentUser) {
        showModal('loginModal');
        return;
    }
    const profileContent = document.getElementById('profileContent');
    if (profileContent) {
        profileContent.innerHTML = `
            <div class="profile-info">
                <p><strong>Username:</strong> ${currentUser.username}</p>
                <p><strong>Email:</strong> ${currentUser.email}</p>
                <p><strong>Status:</strong> ${currentUser.email_verified ? '✅ Verified' : '❌ Not Verified'}</p>
                <p><strong>Member since:</strong> ${new Date(currentUser.created_at).toLocaleDateString()}</p>
            </div>
            <div class="profile-actions">
                <button class="profile-action-btn logout-btn" onclick="logout()">
                    <i class="fas fa-sign-out-alt"></i> Logout
                </button>
            </div>
        `;
        showModal('profileModal');
    }
}
function startVerificationTimer() {
    let timeLeft = 30 * 60;
    if (verificationTimer) clearInterval(verificationTimer);
    verificationTimer = setInterval(() => {
        timeLeft--;
        if (timeLeft <= 0) {
            stopVerificationTimer();
            showAlert('Verification code has expired. Please request a new one.', 'error');
        }
    }, 1000);
}
function stopVerificationTimer() {
    if (verificationTimer) {
        clearInterval(verificationTimer);
        verificationTimer = null;
    }
}
function showModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.style.display = 'block';
}
function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
        const form = modal.querySelector('form');
        if (form) form.reset();
    }
}
function showAlert(message, type = 'info') {
    const existingAlerts = document.querySelectorAll('.alert');
    existingAlerts.forEach(alert => alert.remove());
    const alert = document.createElement('div');
    alert.className = `alert alert-${type}`;
    alert.textContent = message;
    alert.style.cssText = `
        position: fixed;
        top: 80px;
        left: 50%;
        transform: translateX(-50%);
        z-index: 10000;
        min-width: 300px;
        text-align: center;
        padding: 1rem 2rem;
        border-radius: 5px;
        color: white;
        font-weight: 600;
    `;
    if (type === 'success') alert.style.background = 'linear-gradient(45deg, #4CAF50, #45a049)';
    else if (type === 'error') alert.style.background = 'linear-gradient(45deg, #f44336, #d32f2f)';
    else alert.style.background = 'linear-gradient(45deg, #2196F3, #1976D2)';
    document.body.appendChild(alert);
    setTimeout(() => { if (alert.parentNode) alert.remove(); }, 5000);
}
window.showModal = showModal;
window.closeModal = closeModal;
window.showProfile = showProfile;
window.logout = logout;
