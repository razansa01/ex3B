/* Majd Saad 315685586, Razan Abo alhija 322509118 */
/* Server profile.js */
let express = require('express');
let bodyParser = require('body-parser');
let cookieParser = require('cookie-parser');
let fs = require('fs');
let app = express();

app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static('public'));

let usersData = {};

// Read users from JSON file and add it to usersData.
fs.readFile('users.json', 'utf8', (err, data) => {
    if (!err) {
        Object.assign(usersData, JSON.parse(data));
    }
});

// Save new user data to JSON file
function saveUsersData() {
    fs.writeFile('users.json', JSON.stringify(usersData), err => {
        if (err) {
            console.error('Error saving users data:', err);
        }
    });
}

// Login endpoint
app.post('/login', (req, res) => {
    let { username, password } = req.body;
    if (usersData[username] && usersData[username].password === password) {
        let userToken = `${username}-${Date.now()}`;
        usersData[username].token = userToken;
        // Cookie time to live is 15 minutes
        res.cookie('userToken', userToken, { maxAge: 900000 });
        res.json({ success: true });
    } else {
        res.json({ success: false });
    }
});

// Get tasks and add it to 
app.get('/tasks', (req, res) => {
    let userToken = req.cookies.userToken;
    let username = Object.keys(usersData).find(
        user => usersData[user].token === userToken
    );
    // if user name is not empty
    if (username) {
        res.json({ 
            openTasks: usersData[username].openTasks || [], 
            completedTasks: usersData[username].completedTasks || [] 
        });
    } else {
        res.status(403).json({ error: 'Unauthorized' });
    }
});

// Tasks endpoint to update tasks
app.post('/tasks', (req, res) => {
    let userToken = req.cookies.userToken;
    let username = Object.keys(usersData).find(
        user => usersData[user].token === userToken
    );
    if (username) {
        usersData[username].openTasks = req.body.openTasks;
        usersData[username].completedTasks = req.body.completedTasks;
        saveUsersData();
        res.json({ success: true });
    } else {
        res.status(403).json({ error: 'Unauthorized' });
    }
});

// Register endpoint for new users
app.post('/register', (req, res) => {
    let { username, password } = req.body;
    if (!usersData[username]) {
        usersData[username] = { password, openTasks: [], completedTasks: [] };
        saveUsersData();
        // Return success true in case of we are able to register the user
        res.json({ success: true });
    } else {
        //Retrun success false if user exists 
        res.json({ success: false, message: 'Username already exists' });
    }
});

// Start the server
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
