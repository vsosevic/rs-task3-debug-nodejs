const express = require('express');
const app = express();
const db = require('./db');
const user = require('./controllers/user.controller');
const game = require('./controllers/game.controller');
const bodyParser = require('body-parser');


db.sync();
app.use(bodyParser.json());
app.use('/api/auth', user);
app.use(require('./middleware/validate-session'));
app.use('/api/game', game);
app.listen(4000,function() {
    console.log("App is listening on 4000");
});