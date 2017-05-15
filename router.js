let User = require('./User.js');

module.exports = function (app) {
	app.get('/', function (req, res) {
		res.sendfile('index.html');
	});
	app.post('/', function (req, res) {
		console.log(req.body);
		let name = req.body.name;
		let phoneNumber = req.body.phoneNumber;
		let email = req.body.email;
		let user = new User(name, phoneNumber, email);
		User.queryUser(user).then(function (user) {
			return new Promise(function (resolve) {
				if(user){
					console.log('用户已经存在');
					res.redirect('/');
				}
				resolve(user);
			});
		}).then(User.addUser(user)).then(function () {
			console.log('添加成功');
			res.redirect('/');
		}).catch(function (err) {
			console.log(err);
		});

	});
	app.get('/select', function (req, res) {
		res.send('ok');
	})
}