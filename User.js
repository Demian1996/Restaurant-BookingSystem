let mongodb = require('mongodb');
let server = new mongodb.Server('localhost', 27017, {auto_reconnect: true});
let restaurantdb = new mongodb.Db('restaurant', server, {safe: true});

module.exports = User;

//定义user
function User(name, phoneNumber, email) {
	this.name = name;
	this.phoneNumber = phoneNumber;
	this.email = email;
}
//打开数据库
let openDB = function () {
	return new Promise(function (resolve, reject) {
		restaurantdb.open(function (err, db) {
			if(err){
				restaurantdb.close();
				reject(err);
			}
			console.log('open is ok');
			resolve(db);
		});
	});
}
//获得集合
let getC = function (db) {
	return new Promise(function (resolve, reject) {
		db.collection('users', function (err, collection) {
			if(err){
				restaurantdb.close();
				reject(err);
			}
			console.log('get is ok');
			resolve(collection);
		});
	});
} 
//查询user
let queryU = function (user, collection) {
	return new Promise(function (resolve, reject) {
		collection.findOne({
			'name': user.name,
			'phoneNumber': user.phoneNumber,
			'email': user.email
		}, function (err, user) {
			restaurantdb.close();
			if(err){
				reject(err);
			}
			// console.log(user);
			console.log('query is ok');
			resolve(user);
		});
	});
}
//插入user
let addU = function (user, collection) {
	return new Promise(function (resolve, reject) {
		collection.insert(user, {
			safe: true
		}, function (err) {
			restaurantdb.close();
			if(err){
				reject(err);
			}
			console.log('add is ok');
			console.log(user);
			resolve();
		})
	});
}

User.queryUser = function (user) {
	// console.log(user);
	return openDB().then(function (db) {
		return getC(db);
	}).then(function (collection) {
		// console.log(collection);
		return queryU(user, collection);
	});
};
User.addUser = function (user) {
	return openDB().then(function (db) {
		return getC(db);
	}).then(function (collection) {
		return addU(user, collection);
	});
};