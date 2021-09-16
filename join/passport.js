var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mysql=require('mysql');
var connection=require('./connection');

passport.use(new LocalStrategy({
	  usernameField:'id',
	  passwordField:'password',
	  passReqToCallback:true
	},function(req,user_id,password,done){
	  connection.query("SELECT * FROM user where user_id=?",req.body.id,function(err, rows){
		  console.log(rows);
			if(rows[0] == null)
			{
				return done(null,false);
			}

	    if(req.body.password===rows[0].password){
	      var user={
	        id:rows[0].user_id,
	        password:rows[0].password,
	        name:rows[0].name
	      };

	      return done(null,user);

	    }else{

	      return done(null,false);
	    }
	  });
	}));

	passport.serializeUser(function(user,done){
	  console.log('serialize');
	  done(null,user);
	});

	passport.deserializeUser(function(user,done){
	  console.log('deserialize');
	  done(null,user);
	});

module.exports = passport;
