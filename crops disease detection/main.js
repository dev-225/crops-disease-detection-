const CROP_CLASSES = [
    "Healthy", 
    "Early_Blight", 
    "Late_Blight", 
    "Leaf_Spot", 
    "Rust", 
    "Powdery_Mildew",
    "Spider_Mites"
];

function checkLogin(currentPage) {
    // This is the correct key
    const user = localStorage.getItem('currentUser');
    
    // If on a public page (login, register, index), check if we SHOULD redirect
    if (currentPage === 'login.html' || currentPage === 'register.html' || currentPage === 'index.html') {
        if (user && currentPage !== 'index.html') {
            // User is logged in and on login/register, send to dashboard
            window.location.href = 'dashboard.html';
        }
        return true; // Public page, access granted
    }

    // If on a private page (dashboard, etc.)
    if (!user) {
        console.warn(`Access denied to ${currentPage}. Redirecting to login.`);
        window.location.href = 'login.html';
        return false; // Access denied
    }
    
    // User is logged in and on a private page
    console.log(`User authenticated: ${JSON.parse(user).email}`);
    return true; // Access granted
}

function logout() {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('lastPrediction');
    alert('Logged out successfully.');
    window.location.href = 'index.html';
}

document.addEventListener('DOMContentLoaded', () => {
    const pathSegments = window.location.pathname.split('/');
    const currentPage = pathSegments[pathSegments.length - 1] || 'index.html';
    
    // Run the login check for all pages
    checkLogin(currentPage);
    
    // Find all buttons with data-action="logout" and add the click event
    document.querySelectorAll('[data-action="logout"]').forEach(button => {
        button.addEventListener('click', logout);
    });
});

function getCurrentUser() {
    try {
        const user = localStorage.getItem('currentUser');
        return user ? JSON.parse(user) : null;
    } catch (e) {
        console.error("Error parsing user data from localStorage:", e);
        return null;
    }
}