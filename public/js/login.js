/* Majd Saad 315685586, Razan Abo alhija 322509118 */
/* Server profile.js */
//to handle the login button
function login() {
    let username = document.getElementById('username').value;
    let password = document.getElementById('password').value;

    fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            window.location.href = '/main.html';
        } else {
            document.getElementById('message').innerText = 'Login failed';
        }
    });
}
// to handle the register button
function register() {
    let username = document.getElementById('username').value;
    let password = document.getElementById('password').value;

    fetch('/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            document.getElementById('message').innerText = 'Registration successful. Please login.';
        } else {
            document.getElementById('message').innerText = data.message;
        }
    });
}
