let mongodb = require('mongodb');
let server = new mongodb.Server('localhost', 27017, {auto_reconnect: true});
let restaurantdb = new mongodb.Db('restaurant', server, {safe: true});

module.exports = Table;

function (number, date, startTime, endTime, user) {
	this.number = number;
	this.date = date;
	this.startTime = startTime;
	this.endTime = endTime;
	this.user = user._id;	
}

//打开数据库
function openDB() {
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
function getC(db) {
	return new Promise(function (resolve, reject) {
		db.collection('tables', function (err, collection) {
			if(err){
				restaurantdb.close();
				reject(err);
			}
			console.log('get is ok');
			resolve(collection);
		});
	});
} 
//根据桌号选择桌子
function query(collection) {
	return new Promise(function (resolve, reject) {
		collection.findOne({
			number: number
		}, function (err) {
			restaurantdb.close();
			if(err){
				reject(err);
			}
			console.log('query is ok');
			resolve(table);
		});
	});
}
//插入日期
function insertDate(table) {
	return new Promise(function (resolve, reject) {
		table.Date = 
	});
}
//插入时间
function insertTime(table) {
	return new Promise(function (resolve, reject) {

	});
}
//插入用户信息
function insertUser(table) {
	return new Promise(function (resolve, reject) {

	});
}