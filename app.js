const express = require('express');
const app = express();
const server = require('http').createServer(app);
const socketio = require('socket.io')(server); //socket.io 모듈 불러오기
const bodyParser = require('body-parser');
const router = require('./routes/route');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');
const flash = require('connect-flash');
const path = require('path');
const cors = require('cors'); //cors 사용 (클라이언트에서 ajax 요청시 cors 지원)
const { setTimeout } = require('timers-promises');
const errorController = require('./controllers/errorControllers');
const morgan = require('morgan');
const MySQLStore = require('express-mysql-session')(session); // mysql에 세션정보 저장
const logger = require('./config/logger');
const helmet = require('helmet');
const hpp = require('hpp');
const connection = require('./routes/connection');

require('dotenv').config();

var port = 3000;
server.listen(port, function() {

	console.log("start, express server on port " + port);
    logger.info("start, express server on port " + port);
});

//socket.io 서버 시작
var io = socketio.listen(server);
logger.info('socket.io is ready for request');

//클라이언트가 연결했을 때의 이벤트 처리
/* io.on('connection', function(socket) {

	console.log('client connected, socket id: ', socket.id);
	socket.broadcast.emit('sendMessage', 'user connection..');

	socket.on('sendMessage', function(msg) {
		//클라이언트가 message 이벤트 요청할 경우 호출
		// console.log('server received data: '+msg);
		// io.emit('chat message', msg);
		console.log(msg)
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
}); */
/* var chat = io.sockets.on('connection', function(socket) {

	console.log('client connected, socket id: ', socket.id);
	socket.broadcast.emit('sendMessage', 'user connection..');

	socket.on('sendMessage', function(msg) {
		console.log(msg)
		//DB 저장
		connection.query("insert into chatting values (?, ?, ?)", 
		[msg.room, msg.user, msg.message], function() {});
		
		// room join
		socket.join(msg.room);
		// room에 메세지 전송
		chat.to(msg.room).emit('rMessage', msg)
		
	});

}); */
io.on('connection', function(socket) {

	console.log('client connected, socket id: ', socket.id);
	//socket.broadcast.emit('sendMessage', 'user connection..');

	socket.on('sendMessage', function(msg) {
		//클라이언트가 message 이벤트 요청할 경우 호출
		connection.query("insert into chatting values (?, ?, ?, default)", 
		[msg.room, msg.user, msg.message], function() {});

		socket.join(msg.room)
		socket.to(msg.room).emit('sendToAll', msg)
	});

	socket.on('disconnect', function(){
    	// 클라이언트 연결이 끊어졌을 때 호출
		console.log('server disconnected, socket id: ', socket.id);
		//socket.broadcast.emit('sendMessage', 'user disconnection..');
	});
	
});

app.use(express.json());
app.use(express.static('public'))
app.use(bodyParser.json()); //클라이언트에게 오는 형식이 json형태일때
app.use(bodyParser.urlencoded({extended:true}));
app.use(cors()); //cors 미들웨어 등록
app.use(morgan('dev'));

//ejs 템플릿 엔진 설정(html 변환)
app.engine('html', require('ejs').renderFile);
app.set('view engine','html');
app.set('views', path.join(__dirname,'www/views'));
app.use(express.static(path.join(__dirname, 'www')));



app.use(helmet({contentSecurityPolicy: false}));
app.use(hpp());



/*  app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true
}));  */
// 세션을 DB에 저장해여 관리 
 var options = {
	host: process.env.HOST,
	port: process.env.PORT,
	user: "admin",
	password: process.env.PASSWORD,
	database: process.env.DATABASE,
  };
  
  var sessionStore = new MySQLStore(options);
  
  app.use(
	session({
	  key: "bureumi",
	  secret: "$^@#$!!secret^#$@",
	  store: sessionStore,
	  resave: false,
	  saveUninitialized: false,
	})
  );
 

//라우터 처리
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(router);
app.use(errorController.pageNotFoundError);
app.use(errorController.respondInternalError);

 process.on('uncaughtException',(err) =>{
	logger.error('예기치 못한 에러',err);
})



const send = async(option) =>
{
    nodemailer.createTransport(nodemailer.cr)
}