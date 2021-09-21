var express = require('express')
var app = express()
var bodyParser = require('body-parser')
var router = require('./routes/route')
var passport = require('passport')
var LocalStrategy = require('passport-local').Strategy;
var session = require('express-session')
var flash = require('connect-flash')
var path = require('path');
var pug = require('pug')
//test

var port = 3000;
app.listen(port, function() {
    console.log("start, express server on port 3000");
});

app.use(express.json());
app.use(express.static('public'))
app.use(bodyParser.json()); //클라이언트에게 오는 형식이 json형태일때
app.use(bodyParser.urlencoded({extended:true}));

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




















//test sens
/*
var exphbs = require('express-handlebars');
app.engine('handlebars',exphbs({defaultLayout:'test'}));
app.set('view engine', 'handlebars');
//create signature2
var crypto = require('crypto');
var CryptoJS = require('crypto-js');
var SHA256 = require('crypto-js/sha256');
var Base64 = require('crypto-js/enc-base64');

app.get('/test',function(rea,res){
    res.render('test');
})
app.post('/step1',function (req, res) {

	var user_phone_number = '01027008033';
	var user_auth_number = req.body.number;
	var resultCode = 404;

	const date = Date.now().toString();
	const uri = 'ncp:sms:kr:267727211619:bureumi_authentication';
	const secretKey = 'JPl7HnOKCgSeVKSLs8DEUU77xBis404HxOf4i8Yd';
	const accessKey = 'nnk4Fk1CaUBnOnbAPtIV';
	const method = 'POST';
	const space = " ";
	const newLine = "\n";
	const url = `https://sens.apigw.ntruss.com/sms/v2/services/${uri}/messages`;
	const url2 = `/sms/v2/services/${uri}/messages`;

	const  hmac = CryptoJS.algo.HMAC.create(CryptoJS.algo.SHA256, secretKey);

	hmac.update(method);
	hmac.update(space);
	hmac.update(url2);
	hmac.update(newLine);
	hmac.update(date);
	hmac.update(newLine);
	hmac.update(accessKey);

	const hash = hmac.finalize();
	const signature = hash.toString(CryptoJS.enc.Base64);},

    request({
		method : method,
		json : true,
		uri : url,
		headers : {
			'Contenc-type': 'application/json; charset=utf-8',
			'x-ncp-iam-access-key': accessKey,
			'x-ncp-apigw-timestamp': date,
			'x-ncp-apigw-signature-v2': signature
		},
		body : {
			'type' : 'SMS',
			'countryCode' : '82',
			'from' : '01027008033',
			'content' : `WEIVER 인증번호 ${user_auth_number} 입니다.`,
			'messages' : [
				{
					'to' : `${user_phone_number}`
				}
			]
		}
	}, function(err, res, html) {
		if(err) console.log(err);
		else {
			resultCode = 200;
			console.log(html);
		}
	}));
    

	res.json({

		'code' : resultCode
	});*/

// test
/*var messagebird = require('messagebird')('IMMoycCAKjrjxLJsLzTF0qkaM');
var exphbs = require('express-handlebars');
app.engine('handlebars',exphbs({defaultLayout:'test'}));
app.set('view engine', 'handlebars');

app.get('/test',function(req,res){
    res.render('test');
})

app.post('/step2', function(req, res) {
    var number = req.body.number;
    messagebird.verify.create(number, {
        originator : 'Code',
        template : 'Your verification code is %token.'
    }, function (err, response) {
        if (err) {
            console.log(err);
            res.render('test', {
                error : err.errors[0].description
            });
        } else {
            console.log(response);
            res.render('step2', {
                id : response.id
            });
        }
    })
 });
app.post('/step3', function(req, res) {
    var id = req.body.id;
    var token = req.body.token;
    messagebird.verify.verify(id, token, function(err, response) {
      if (err) {
        console.log(err);
        res.render('step2', {
          error: err.errors[0].description,
          id: id,
        });
      } else {
        console.log(response);
        res.render('step3');
      }
    });
  });*/