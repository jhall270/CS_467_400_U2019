const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const sqlite3 = require('sqlite3').verbose();
var auth0 = require('../lib/auth0.js');
var secured = require('../lib/secured');

const multer = require('multer');

// SET STORAGE
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/images')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname.split(".")[0] + '-' + Date.now() + "." + file.originalname.split(".")[1]);
  }
})

var upload = multer({ storage: storage })


const router = express.Router();
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());





router.get('/', secured.Admin(), (req, res, next) => {
    res.render('adminLanding');
});


//display form to create new user
router.get('/create-user', secured.Admin(), function(req, res){
    var context = {};
    res.render('adminCreateUser', context);
});


//create new user form posts to here
router.post('/create-user', secured.Admin(), function(req, res){
    var context = {};
	console.log("CREATE USER Post route");
	console.log(req.body);

	// Send user info to auth0 to create authentication

	var newUser = {
		email: req.body.email,
		password: req.body.password,
		firstName: req.body.firstName,
		lastName: req.body.lastName,
		role: ""
	};

	if (req.body.user == 'admin'){
		var adminflag = 1;
		newUser.role = "Admin";
	}
	else{
		var adminflag = 0;
		newUser.role = "User";
	}

	console.log(newUser);

	auth0.addLogin(newUser)
	.catch((error) => {
		console.log(error);
		res.send(error);
		return;
	})
	.then( function(userId){		
		console.log("New User " + userId);
	
		//Connecting to database
		var db = new sqlite3.Database('./db/empRec.db');


		//add new row to user table
		var query = "INSERT into User (UserName,	Email,	FirstName, LastName, SoftDelete, IsAdmin) Values (?, ?, ?, ?,0,?)" ;
		db.run(query, [userId, req.body.email, req.body.firstName, req.body.lastName, adminflag], function(err){
			if(err){
				console.log(err);
				res.send("Error creating user: " + err);
			}
			else{
				//after adding new user record, if user is admin go to signature upload page
				if(req.body.user != 'admin'){
					context.id = this.lastID;
					res.render('adminUploadSignature',context);
				}
				else{
					res.send("Admin user created");
				}					
			}
										
			db.close();
		});

	});
});


//signature file upload form posts to this route
router.post('/upload-signature', secured.Admin(), upload.single('signatureImage'), (req, res, next) => {
  const file = req.file;

  console.log(file);

  if (!file) {
    const error = new Error('Please upload a file')
    error.httpStatusCode = 400
    return next(error)
  }
  
  console.log("file uploaded for: " + req.body.id);

	//Connecting to database
	var db = new sqlite3.Database('./db/empRec.db');

	var query = "update user set signature = ? where Id = ?";
	db.run(query,[file.filename, req.body.id],	function(err){
		if(err){
			console.log(err);
		}
		else{
			res.send("Successfully Created User");
		}
		db.close();
	});

});


// Edit/Update/Delete User routes

router.get('/editUsers', function(req,res){
	context = {};
	var db = new sqlite3.Database('./db/empRec.db');
	var query = "select Id, UserName, Email, FirstName, LastName, Signature, IsAdmin from User where SoftDelete = 0;"
	db.all(query, function(err, rows){
		if(err){
			console.log(err);
		}
		else{
			context.rows = rows;

			res.render('adminEditUserList', context);
		}
		db.close();
	})
});


router.get('/updateUser', function(req,res){
	context = {};
	var db = new sqlite3.Database('./db/empRec.db');
	var query = "select Id, UserName, Email, FirstName, LastName, Signature, IsAdmin from User where Id = ?"

	if(!req.query.id){
		res.send("Error: Need an id");
	}

	db.get(query, [req.query.id], function(err,row){
		if(err){
			console.log(err);
		}
		else{
			context.row = row;
			res.render('adminUpdateUser', context);
		}		
		db.close();
	});

});

router.post('/updateSignature', function(req,res){
	context = {};
	context.id = req.body.id;
	res.render('adminUploadSignature',context);
});


router.get('deleteUser', function(req,res){

});



//BI Reports
router.get('/BIReport1', secured.Admin(), function(req, res){
	context = {};
	
	res.render('adminBIReport1', {layout: 'alt'});
});




//AJAX data route,
router.get('/data/awardTypeCount', secured.Admin(), function(req, res){
	context = {};
	
	//Connecting to database
	var db = new sqlite3.Database('./db/empRec.db');	
	var query = "select count(id) AS numType, typeofaward from award group by typeofaward"
	
	db.all(query, [], function(err, rows){
		if(err){
			console.log(err);
		}
		else{
			console.log(rows);
			res.json(rows);
		}	
		
		db.close();
	});
	
});




module.exports = router; 