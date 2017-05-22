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
function openDB() {
	return new Promise(function (resolve, reject) {
		restaurantdb.open(function (err, db) {
			if(err){
				reject(err);
			}
			console.log('open is ok');
			resolve(db);
		});
	});
}
//获得集合
function getC(db) {
	return new Promise(function (resolve, reject) {
		db.collection('users', function (err, collection) {
			if(err){
				reject(err);
			}
			console.log('get is ok');
			resolve(collection);
		});
	});
} 
//查询user
function queryU(user, collection) {
	return new Promise(function (resolve, reject) {
		collection.findOne({
			'name': user.name,
			'phoneNumber': user.phoneNumber,
			'email': user.email
		}, function (err, user) {
			if(err){			
				reject(err);
			}
			console.log('query is ok');
			resolve([user, collection]);
		});
	});
}

User.queryUser = function (user) {
	// console.log(user);
	return openDB()
		.then(function (db) {
			return getC(db);
		})
		.then(function (collection) {
			// console.log(collection);
			return queryU(user, collection);
		});
};

User.addUser = function (arr) {
	let user = arr[0];
	let collection = arr[1];
	return new Promise(function (resolve, reject) {
		collection.insert(user, {
			safe: true
		}, function (err) {
			if(err){
				reject(err);
			}
			console.log('add is ok');
			console.log(user);
			resolve();
		})
	});
}


//关闭数据库
User.close = function closeDB() {
	return Promise.resolve().then(function () {
		restaurantdb.close();
	});
}

// function addU(user, collection) {
// 	return new Promise(function (resolve, reject) {
// 		collection.insert(user, {
// 			safe: true
// 		}, function (err) {

// 			if(err){
// 				restaurantdb.close();
// 				reject(err);
// 			}
// 			console.log('add is ok');
// 			console.log(user);
// 			resolve();
// 		})
// 	});
// }
// User.addUser = function (user) {
// 	return openDB()
// 		.then(function (db) {
// 			return getC(db);
// 		})
// 		.then(function (collection) {
// 			console.log(user);
// 			return addU(user, collection);
// 		});
// };