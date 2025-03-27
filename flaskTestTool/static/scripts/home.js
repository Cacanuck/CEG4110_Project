document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    const userData = JSON.parse(sessionStorage.getItem('userData'));
    if (!userData) {
        // If not logged in, redirect to login page
        window.location.href = '/index';
        return;
    }
}); 