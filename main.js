var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring');

function templateHTML(title, list, body) {
	return `
  <!doctype html>
  <html>
  <head>
    <title>WEB - ${title}</title>
    <meta charset="utf-8">
  </head>
  <body>
    <h1><a href="/">WEB</a></h1>
   ${list}
   <a href="/create">create</a>
    ${body}
  </body>
  </html>
  `;
}

function templateList(filelist) {
	var list = '<ul>';

	var i = 0;
	while (i < filelist.length) {
		list = list + `<li><a href="/?id=${filelist[i]}">${filelist[i]}</a></li>`;
		i = i + 1;
	}
	list = list + '</ul>';
	return list;
}

var app = http.createServer(function (request, response) {
	//request 요청할때 웹브라우저가 보낸 정보, response 응답할때 우리가 웹브라우저에게 전송할 정보
	var _url = request.url;
	var queryData = url.parse(_url, true).query;
	var pathname = url.parse(_url, true).pathname;
	console.log(pathname);
	if (pathname === '/') {
		if (queryData.id === undefined) {
			fs.readdir('./data/', function (err, filelist) {
				console.log(filelist);
				var title = 'Welcome';
				var description = '';
				var list = templateList(filelist);
				var template = templateHTML(title, list, `<h2>${title}</h2>${description}`);
				response.writeHead(200);
				response.end(template);
			});
		} else {
			fs.readdir('./data/', function (err, filelist) {
				console.log(filelist);

				fs.readFile(`data/${queryData.id}`, 'utf8', function (err, description) {
					var title = queryData.id;
					var list = templateList(filelist);
					var template = templateHTML(title, list, `<h2>${title}</h2>${description}`);
					response.writeHead(200);
					response.end(template);
				});
			});
		}
	} else if (pathname === '/create') {
		fs.readdir('./data/', function (err, filelist) {
			console.log(filelist);
			var title = 'WEB- Create';
			var list = templateList(filelist);
			var template = templateHTML(
				title,
				list,
				`
				<form action= "http://localhost:3000/create_process" method="post">
			<p><input type="text" name="title" placeholder="title"></p>
            <p>
              <textarea name="description" placeholder="description"></textarea>
            </p>
            <p>
              <input type="submit">
            </p>
          </form>
			`
			);
			response.writeHead(200);
			response.end(template);
		});
	} else if (pathname === '/create_process') {
		var body = '';
		request.on('data', function (data) {
			// callback.
			body = body + data;
		});
		request.on('end', function () {
			var post = qs.parse(body);
			var title = post.title;
			var description = post.description;

			console.log(post.title);
			console.log(post.description);
		});
		response.writeHead(200);
		response.end('success');
	} else {
		console.log('process not found');
		response.writeHead(404);
		response.end('Not found');
	}
});
app.listen(3000);