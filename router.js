let User = require('./module/User.js');
let Table = require('./module/Table.js');

module.exports = function (app) {
	app.get('/', function (req, res) {
		res.sendfile('booking.html');
	});
	app.post('/date', function (req, res) {
		let date = JSON.parse(req.body.date);
		if(date.month < 10){
			date.month = '0' + date.month;
		}
		if(date.day < 10){
			date.day = '0' + date.day;
		}
		let queryDate = date.year + '-' + date.month + '-' + date.day;
		console.log(queryDate);
		req.session.date = queryDate;//使用session保存查询日期
		// console.log(queryDate); 
		Table.getTables(queryDate)
			.then(function (tables) {
				Table.close();
				res.send(tables);
				console.log(tables);
				console.log('查询成功');
			})
			.catch(function (err) {
				Table.close();
				console.log(err);
			});
	});
	app.post('/reservation', function (req, res) {
		//验证用户信息
		function queryUser(userAdded) {
			let isExist = false;
			return User.queryUser(userAdded)
					.then(function (arr) {
						// console.log(arr);
						let user = arr[0];
						let collection = arr[1];
						return new Promise(function (resolve, reject) {
							if(user){
								console.log('用户已经存在');
								res.send('exist');
								isExist = true;
								// req.session.user = userAdded;
								reject();
							}
							else{
								console.log('我要添加' + userAdded);
								resolve([userAdded, collection]);
							}
						});
					})
					.then(User.addUser)
					.then(User.close)
					.then(function () {
						console.log('添加成功');
						return isExist;
						// req.session.user = userAdded;
					})
					.catch(function (err) {
						User.close();
						if(err){
							console.log(err);
						}
						return isExist;
					});
		}

		let reservation = JSON.parse(req.body.reservation);
		let name = reservation.user.name;
		let phoneNumber = reservation.user.phoneNumber;
		let email = reservation.user.email;
		let userAdded = new User(name, phoneNumber, email);

		queryUser(userAdded)
			.then(function (isExist) {
				if(isExist){
					return new Promise(function (resolve, reject) {
						reject();
					});
				}
				return Table.getOneTable(req.session.date, reservation.tableId);
			})
			.then(function (arr) {
				let qtable = arr[0];
				let collection = arr[1];
				let	tableId = qtable ? qtable.tableId : reservation.tableId,
					date = qtable ? qtable.date : req.session.date,
					message = qtable ? qtable.message : [reservation],
					table = new Table(tableId, date, message);
				// console.log(table, qtable);
				if(qtable){
					return table.makeReservation(reservation, collection);//添加预约
				}else{
					return Table.add(collection, table);//向数据库中添加table
				}
			})
			.then(function () {
				Table.close();
				res.send('ok');
			})
			.catch(function (err) {
				Table.close();
				console.log("don't insert reservation into table");
				if(err){
					console.log(err);
				}
			});

	});
	app.post('/cancel', function (req, res) {
		let cancel = JSON.parse(req.body.cancel);

		Table.getOneTable(req.session.date, cancel.tableId)
			.then(function (arr) {
				let qtable = arr[0];
				let collection = arr[1];
				let table = new Table(qtable.tableId, qtable.date, qtable.message);
				table.cancelReservation(cancel, collection);
			})
			.then(function () {
				res.send('cancel is ok');
				Table.close();
			})
			.catch(function (err) {
				Table.close();
				if(err){
					console.log(err);
				}
			})
	});
}