const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const app = express();

const messages = []; // In-memory message store
const users = []; // In-memory user store

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Routes

// Register
app.post('/register', (req, res) => {
  const { username, password } = req.body;
  if (username && password) {
    if (users.find(u => u.username === username)) {
      res.send('User already exists. <a href="/login.html">Login</a>');
    } else {
      users.push({ username, password });
      res.redirect('/login.html');
    }
  } else {
    res.status(400).send('Invalid data');
  }
});

// Login - Redirect to chat with username
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username && u.password === password);
  if (user) {
    res.redirect(`/chat.html?user=${encodeURIComponent(username)}`);
  } else {
    res.send('Invalid username or password. <a href="/login.html">Try again</a>');
  }
});

// Get all messages
app.get('/messages', (req, res) => {
  res.json(messages);
});

// Post a message
app.post('/message', (req, res) => {
  const { user, text } = req.body;
  if (user && text) {
    messages.push({ user, text, timestamp: new Date() });
    res.status(200).send('Message sent');
  } else {
    res.status(400).send('Invalid data');
  }
});

// Logout - Redirect to login
app.post('/logout', (req, res) => {
  res.redirect('/login.html');
});

// Default route - redirect to login
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// Catch-all for other routes
app.use((req, res) => {
  res.status(404).send("Page Not Found");
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

