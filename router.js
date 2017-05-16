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
		let adduser = new User(name, phoneNumber, email);
		// User.addUser(user);
		User.queryUser(adduser).then(function (user) {
			return new Promise(function (resolve) {
				if(user){
					console.log('用户已经存在');
					res.redirect('/select');
					reject();
				}
				else{
					console.log('我要添加'+adduser);
					resolve(adduser);
				}
			});
		}).then(function (user) {
			return User.addUser(user);
		}).then(function () {
			console.log('添加成功');
			res.redirect('/select');
		}).catch(function (err) {
			if(err){
				console.log(err);
			}
		});
	});
	app.get('/select', function (req, res) {

		//默认发送今天的日期
		res.send('ok');
	})
}