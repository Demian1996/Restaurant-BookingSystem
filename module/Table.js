let mongodb = require('mongodb');
let server = new mongodb.Server('localhost', 27017, {auto_reconnect: true});
let restaurantdb = new mongodb.Db('restaurant', server, {safe: true});

module.exports = Table;

function Table(tableId, date, message) {
	this.tableId = tableId;
	this.date = date;
	this.message = message;
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
		db.collection('tables', function (err, collection) {
			if(err){
				reject(err);
			}
			console.log('get is ok');
			resolve(collection);
		});
	});
}
//查询table
function queryT(date, tableId, collection) {
	return new Promise(function (resolve, reject) {
		collection.findOne({
			'date': date,
			'tableId': tableId
		}, function (err, table) {
			if(err){			
				reject(err);
			}
			console.log('query is ok');
			resolve([table, collection]);
		});
	});
}

//按照key查询,并且排序后以数组输出
function querySort(key, val, collection) {
	// console.log(key, val);
	let query = {};
	query[key] = val;
	return new Promise(function (resolve, reject) {
		collection
			.find(query)
			.sort({"tableId": 1})
			.toArray(function (err, tables) {
				if(err){
					reject(err);
				}
				console.log('querSort is ok');
				resolve(tables);
			});
	});
}
//添加桌子
Table.add = function (collection, table) {
	return new Promise(function (resolve, reject) { 
		collection.insert(table, {
			safe: true
		}, function (err) {
			if(err){
				reject(err);
			}
			console.log('addT is ok');
			resolve();
		});
	});
}


Table.getOneTable = function (date, tableId) {
	return openDB()
		.then(function (db) {
			return getC(db);
		})
		.then(function (collection) {
			return queryT(date, tableId, collection);
		})
}
//根据日期查找所有table
Table.getTables = function (date) {
	return openDB()
		.then(function (db) {
			return getC(db);
		})
		.then(function (collection) {
			return querySort('date', date, collection);
		});
}
//关闭数据库
Table.close = function () {
	return Promise.resolve().then(function () {
		restaurantdb.close();
	});
}
//添加预约
Table.prototype.makeReservation = function (reservation, collection) {
	let self = this,
		exist = false;
	return new Promise(function (resolve) {
		self.message.forEach(function (ele, index) {
			console.log(ele);
			if(ele.startTime === reservation.startTime && ele.endTime === reservation.endTime){
				self.message[index] = reservation;
				console.log(ele);
				exist = true;
			}
		});
		if(!exist){
			self.message.push(reservation);
			console.log('makereservation is ok');
		}
		
		resolve();
	}).then(function () {
		return new Promise(function (resolve, reject) {
			collection.update({
				date: self.date,
				tableId: self.tableId,
			}, {
				$set: {
					message: self.message
				}
			}, function (err) {
				if(err){
					reject();
				}
				console.log('update is ok');
				resolve();
			});
		});
	});
}
//取消预约
Table.prototype.cancelReservation = function (cancel, collection) {
	let self = this;
	return new Promise(function (resolve, reject) {
		self.message.forEach(function (ele, index) {
			if(ele.startTime === cancel.startTime && ele.endTime === cancel.endTime){
				self.messsage = self.message.splice(index, 1);
			}
		});
		collection.update({
			date: self.date,
			tableId: self.tableId
		}, {
			$set: {
				message: self.message
			}
		}, function (err) {
			if(err){
				reject();
			}
			console.log('cancel is ok');
			resolve();
		});
	})
}
