// Set up app.
var express = require('express');
var bodyParser = require('body-parser');
var mail = require('emailjs');
var config = require('./config.js')
var app = express();

// Basic express setup.
app.use(express.static('client/'));

// Mail server.
var mailServer  = mail.server.connect({
	user: config.user, 
	password: config.password, 
	host: config.smtp, 
	ssl: true
});

// Mail service.
app.use(bodyParser.json());
app.post('/mail', function(req, res){
	mailServer.send({
		text: req.body.message + '\n\n' + (req.body.company? req.body.company: '') + '\n' + req.body.name + '\n' + req.body.mail, 
		from: 'IMOX Web <mephysto66@gmail.com>', 
		to: "Support <santiagocastillo79@gmail.com>",
		subject: "Nuevo contacto:  " + (req.body.message.length > 50? req.body.message.substr(0, 50) + '...': req.body.message)
	}, function(error, message) {
		if(error){
			res.status(500).end();
		} else{
			res.status(200).end();
		}
	});
});

// Startup server.
app.listen(8080);
console.log("App listening on port 8080");