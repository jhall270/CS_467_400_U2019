const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const sqlite3 = require('sqlite3').verbose();

const router = express.Router();
router.use(bodyParser.json());

router.get('/', (req, res, next) => {
    res.render('adminLanding');
});


const multer = require('multer');

// SET STORAGE
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, '../public/images')
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now())
  }
})
 

var upload = multer({ storage: storage })




//display form to create new user
router.get('/create-user', function(req, res){
    var context = {};
    res.render('adminCreateUser', context);
});

//create new user form posts to here
router.post('/create-user',function(req, res){
    var context = {};
    console.log(req.body);
	
	//Connecting to database
	var db = new sqlite3.Database('./db/empRec.db');

    //TODO: New user validation
    //if email already in system return to form and display error
    if(1 == 0){
        context.status = "Error creating user, email already in use";
        res.render('adminCreateUser', context);
        return;
    }

    if (req.body.user == 'admin'){
      var adminflag = 1;
    }
    else{
      var adminflag = 0;
    }

    //add new row to user table
	db.run("INSERT into User(UserName, FirstName, LastName, SoftDelete, IsAdmin) Values (?, ?, ?,0,?)" , [req.email, req.firstName, req.lastName, adminflag]);

	
	db.close();

    //after adding new user record, if user is admin go to signature upload page
    if(req.body.user != 'admin'){
      context.UserName = req.email;
      res.render('adminUploadSignature',context);
      return;
    }
    else{
      res.send("Admin user created");
      return;
    }
    
});


router.post('/upload-signature', upload.single('signatureImage'), (req, res, next) => {
  const file = req.file;

  console.log(file);

  if (!file) {
    const error = new Error('Please upload a file')
    error.httpStatusCode = 400
    return next(error)
  }
    res.send(file)
  
});

module.exports = router; 