
//test
var express = require('express')
var app = express()
var serviceID = "VAb20d6c9896796411efad0332bf937d38",
accountSID = "AC58a5860de7f6feb9cdc730b035ed47e9",
authToken = "ea118687f88b069baee1c12c15756b9f" ;
const client = require('twilio')(accountSID,authToken)
var port = 3000;


app.listen(port, function() {
    console.log("start, express server on port 3000");
});

app.get('/login_test',(req,res)=>{
    client
        .verify
        .services(serviceID)
        .verifications
        .create({
            to : `+${req.query.phonenumber}`,
            channel : req.query.channel
        })
        .then((data)=>{
            res.status(200).send(data)
        })
})

app.get('/verify',(req,res) =>{
    client
        .verify
        .services(serviceID)
        .verificationChecks
        .create({
            to : `+${req.query.phonenumber}`,
            code : req.query.code
        }).then((data) =>{
            res.status(200).send(data)
        })

})


/*const Vonage = require('@vonage/server-sdk');
const vonage = new Vonage({
  apiKey: "032af7bc",
  apiSecret: "tLJM2EDlDauKkaF4"
});

vonage.verify.request({
  number: "821027008033",
  brand: "Vonage"
}, (err, result) => {
  if (err) {
    console.error(err);
  } else {
    const verifyRequestId = result.request_id;
    console.log('request_id', verifyRequestId);
  }
});
vonage.verify.check({
  request_id: REQUEST_ID,
  code: CODE
}, (err, result) => {
  if (err) {
    console.error(err);
  } else {
    console.log(result);
  }
});
vonage.verify.control({
  request_id: REQUEST_ID,
  cmd: 'cancel'
}, (err, result) => {
  if (err) {
    console.error(err);
  } else {
    console.log(result);
  }
});*/