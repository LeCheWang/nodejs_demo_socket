const express= require('express');
const app= express();
const path = require('path');
require('dotenv').config();
const server= require('http').createServer(app);
const io= require('socket.io')(server);

const loginMiddleware = require('./middleware/login');

app.use(express.json());

app.use(express.static('public'));

app.set('view engine', 'ejs');
app.set('views', './views');

app.get('/', (req, res) => {
  res.render('login.ejs');
})

app.get('/login', loginMiddleware, (req, res) => {
  res.render('index.ejs', {user: req.query});
})

io.on('connection', function (client) {
  console.log("client connected...");
  var room;
  client.on('join', function (data) {
    room= data;
    client.join(room);
  })
  client.on('messages', function (data) {
    io.to(room).emit('thread', data);
  })
})



server.listen(process.env.PORT || 8080, ()=>{
  console.log("server runed");
})