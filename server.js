
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

let users = {};
let messages = [];

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/register', (req, res) => {
  const { username, password } = req.body;
  if (!users[username]) {
    users[username] = password;
    res.redirect('/login.html');
  } else {
    res.send('Username already exists');
  }
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (users[username] === password) {
    res.redirect(`/chat.html?user=${username}`);
  } else {
    res.send('Login failed. Invalid credentials.');
  }
});

app.get('/messages', (req, res) => {
  res.json(messages);
});

app.post('/message', (req, res) => {
  const { user, text } = req.body;
  messages.push({ user, text });
  res.sendStatus(200);
});

app.post('/logout', (req, res) => {
  messages = [];
  res.redirect('/');
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
