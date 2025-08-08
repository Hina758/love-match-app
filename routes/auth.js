
const express = require('express');
const fs = require('fs');
const bcrypt = require('bcrypt');

module.exports = (usersFile) => {
  const router = express.Router();

  router.post('/login', (req, res) => {
    const { username, password, crush } = req.body;
    let users = [];
    if (fs.existsSync(usersFile)) {
      users = JSON.parse(fs.readFileSync(usersFile, 'utf8') || '[]');
    }
    let user = users.find(u => u.username === username);
    if (!user) {
      const hashed = bcrypt.hashSync(password, 10);
      user = { username, password: hashed, crush };
      users.push(user);
    } else if (!bcrypt.compareSync(password, user.password)) {
      return res.send('비밀번호가 틀렸습니다.');
    } else {
      user.crush = crush;
    }
    fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));
    res.redirect('/result?user=' + username);
  });

  return router;
};
