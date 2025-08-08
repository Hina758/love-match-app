
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');
const fse = require('fs-extra');

const app = express();
const PORT = process.env.PORT || 3000;

const usersFile = path.join(__dirname, 'data', 'users.json');
const resultsFile = path.join(__dirname, 'data', 'results.json');

fse.ensureFileSync(usersFile);
fse.ensureFileSync(resultsFile);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');
app.engine('html', require('ejs').renderFile);

let publicStatus = false;

const authRoutes = require('./routes/auth')(usersFile);
const matchRoutes = require('./routes/match')(usersFile, resultsFile, () => publicStatus);
app.use('/', authRoutes);
app.use('/', matchRoutes);

app.get('/admin', (req, res) => {
  const users = JSON.parse(fs.readFileSync(usersFile, 'utf8') || '[]');
  const results = JSON.parse(fs.readFileSync(resultsFile, 'utf8') || '[]');
  res.render('admin.html', { users, results, publicStatus });
});

app.post('/admin/toggle', (req, res) => {
  publicStatus = !publicStatus;
  res.redirect('/admin');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
