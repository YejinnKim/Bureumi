const mysql = require('mysql');
require('dotenv').config(); 

const HOST = process.env.HOST
, DATABASE = process.env.DATABASE
, PASSWORD = process.env.PASSWORD
, PORT = process.env.PORT

 var connection = mysql.createConnection({ 
	host:HOST,
	user: "admin", //dotenv를 적용하면 오류발생
	database:DATABASE,
	password:PASSWORD,
	port: PORT

}); 



module.exports = connection;