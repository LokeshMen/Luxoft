const router = require('express').Router();
const User = require('../models/user');


//get userDetails by id
router.get('/login',  async(req, res, next) => {
      const userDetails = await User.find({email : req.body.email,password : req.body.password}).lean();
	  if(userDetails && userDetails.length){
	       res.send(userDetails)
	  }
	  else{
        res.send("User not found for provided emailId ");
	  }

});

//get userDetails by id
router.get('/getUser',  async(req, res, next) => {
    if(req.query.userId){
      const userDetails = await User.find({userId : req.query.userId}).lean();
	  if(userDetails && userDetails.length){
		res.send(userDetails)
	  }
	  else{
		res.send("User not found for provided userId ")
	  }
	}
	else{
      const users = await User.find({}).sort({name : 1}).lean();
	  res.send(users);
	}
});

// Landing page
router.get('/', function (req, res, next) {
	res.render('index');
});

//Login with email and passowrd
router.post('/',  async(req, res, next) => {
	const email = req.body.email;
	const password = req.body.password;
	const foundUser = await User.findOne({ email: email, password: password }).lean();
			if (!foundUser) {
				req.flash('success', 'UserDetails not found..!');
				res.render('index', { message: req.flash('success') });
			}
			else {
				if (foundUser.role == "Admin") {
					const users = await User.find({}).sort({name :1}).lean();
					res.render('userDetails', { users: users });
				}
				else {
					res.render('userProfile', { name : foundUser.name,email : foundUser.email, role : foundUser.role });
				}
			}
});



// Add user page
router.get('/addUser', (req, res, next) => {
	res.render('addUser');
});

//adding user in db
router.post('/addUser', async(req, res, next) => {
	const foundUser = await User.find({email : req.body.userEmail}).lean();
	if(foundUser && foundUser.length){
		req.flash('fail', 'User has been already used.Please try with another email address');
		res.render('addUser', { message: req.flash('fail') });
	}
	else{
		const userCount = await User.countDocuments();
		const user = new User();
		user.userId = userCount +1;
		user.name = req.body.userName;
		user.email = req.body.userEmail;
		user.password = req.body.password;
		user.role = req.body.role;
		user.save(function (err) {
			if (err) throw err;
			req.flash('success', 'User added successfully');
			res.render('addUser', { message: req.flash('success') });
		});
	}
});


module.exports = router;
