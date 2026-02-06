const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const app = express();

const messages = []; // In-memory message store

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Routes

// Login - Redirect to chat with username
app.post('/login', (req, res) => {
  const username = req.body.username;
  if (username) {
    res.redirect(`/chat.html?user=${encodeURIComponent(username)}`);
  } else {
    res.redirect('/login.html');
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

