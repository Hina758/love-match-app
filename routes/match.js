
const express = require('express');
const fs = require('fs');

module.exports = (usersFile, resultsFile, getPublicStatus) => {
  const router = express.Router();

  router.get('/result', (req, res) => {
    const username = req.query.user;
    const users = JSON.parse(fs.readFileSync(usersFile, 'utf8') || '[]');
    const me = users.find(u => u.username === username);

    if (!me) return res.send('사용자를 찾을 수 없습니다.');

    const crush = users.find(u => u.username === me.crush);
    const matched = crush && crush.crush === username;
    const result = matched ? "❤️ 서로 좋아해요!" : "💔 짝사랑이네요.";

    const results = JSON.parse(fs.readFileSync(resultsFile, 'utf8') || '[]');
    results.push({ username, result });
    fs.writeFileSync(resultsFile, JSON.stringify(results, null, 2));

    if (getPublicStatus()) {
      res.render('result.html', { result });
    } else {
      res.send("성공적으로 저장되었습니다. 결과는 나중에 공개됩니다.");
    }
  });

  return router;
};
