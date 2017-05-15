//加载模块
let express = require('express');
let router = require('./router.js');
let cookieParser = require('cookie-parser');
let session = require('express-session');
let path = require('path');
let bodyParser = require('body-parser'); 

let app = express();//生成实例

//加载session
app.use(cookieParser());
app.use(session({
	secret: '12345',
	cookie: {maxAge: 86400000},
	resave: false,
	saveUninitialized: true
}));
//设置静态文件目录
app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

router(app);//加载路由
let server = app.listen(10512, function () {
	let host = server.address().address;
	let port = server.address().port;

	console.log('this is listening at http://%s:%s', host, port);
});