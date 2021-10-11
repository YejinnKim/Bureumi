var express = require('express')
var app = express()
var server = require('http').createServer(app);
var socketio = require('socket.io')(server); //socket.io 모듈 불러오기
var bodyParser = require('body-parser')
var router = require('./routes/route')
var passport = require('passport')
var LocalStrategy = require('passport-local').Strategy;
var session = require('express-session')
var flash = require('connect-flash')
var path = require('path');
var pug = require('pug')
var cors = require('cors'); //cors 사용 (클라이언트에서 ajax 요청시 cors 지원)
//test

var port = 3000;
server.listen(port, function() {
    console.log("start, express server on port " + port);
});

//socket.io 서버 시작
var io = socketio.listen(server);
console.log('socket.io is ready for request');

//클라이언트가 연결했을 때의 이벤트 처리
io.on('connection', function(socket) {

	console.log('client connected, socket id: ', socket.id);
	socket.broadcast.emit('sendMessage', 'user connection..');

	socket.on('sendMessage', function(msg) {
		//클라이언트가 message 이벤트 요청할 경우 호출
		// console.log('server received data: '+msg);
		// io.emit('chat message', msg);
		socket.broadcast.emit('sendToAll', msg)
	});

	socket.on('disconnect', function(){
    	// 클라이언트 연결이 끊어졌을 때 호출
		console.log('server disconnected, socket id: ', socket.id);
		socket.broadcast.emit('sendMessage', 'user disconnection..');
	});

	socket.on('subscribe', function(data) { 
		socket.join(data.room);
	});

	socket.on('unsubscribe', function(data) { 
		socket.leave(data.room);
	});
});

app.use(express.json());
app.use(express.static('public'))
app.use(bodyParser.json()); //클라이언트에게 오는 형식이 json형태일때
app.use(bodyParser.urlencoded({extended:true}));
app.use(cors()); //cors 미들웨어 등록

//ejs 템플릿 엔진 설정(html 변환)
app.engine('html', require('ejs').renderFile);
app.set('view engine','html');
//app.set('view engine','pug')
app.set('views', path.join(__dirname,'www/views'));

app.use(express.static(path.join(__dirname, 'www')));

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true
}));

//라우터 처리
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(router);

const send = async(option) =>
{
    nodemailer.createTransport(nodemailer.cr)
}