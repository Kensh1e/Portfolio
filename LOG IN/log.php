<?php
// PHP logic can be added here if needed in the future
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sign In</title>
    <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css" rel="stylesheet"/>
    <link rel="stylesheet" href="log.css"> 
</head>
<body>

<div class="decorative-shape shape1"></div>
<div class="decorative-shape shape2"></div>
<div class="decorative-shape shape3"></div>

<div class="form-container">
    <h2>Login / Signup</h2>
    <form id="loginForm">
        <input type="email" id="email" placeholder="Email" required>
        <input type="password" id="password" placeholder="Password" required>
        <button type="submit">Login</button>
    </form>

    <div class="google-btn" onclick="loginWithGoogle()">
        <i class="fab fa-google"></i> Sign in with Google
    </div>
</div>

<script>
    const GOOGLE_CLIENT_ID = 'your-google-client-id'; // Replace with your Google Client ID

    function loginWithGoogle() {
        const authUrl = `https://accounts.google.com/o/oauth2/auth?client_id=${GOOGLE_CLIENT_ID}&redirect_uri=${encodeURIComponent(window.location.origin + '/auth/callback')}&response_type=token&scope=email profile`;

        const loginWindow = window.open(authUrl, '_blank', 'width=500,height=600');

        const pollTimer = window.setInterval(() => {
            if (loginWindow.closed) {
                window.clearInterval(pollTimer);
                checkLoginStatus();
            }
        }, 1000);
    }

    function checkLoginStatus() {   
        fetch('/auth/check', { credentials: 'include' })
            .then(response => response.json())
            .then(data => {
                if (data.loggedIn) {
                    window.location.href = '/dashboard';
                }
            })
            .catch(error => console.error('Login check error:', error));
    }
</script>

</body>
</html>
