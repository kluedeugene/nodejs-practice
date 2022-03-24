var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring');

var template = {
	html: function (title, list, body, control) {
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
	   ${control}
	   ${body}
	  </body>
	  </html>
	  `;
	},
	list: function (filelist) {
		var list = '<ul>';

		var i = 0;
		while (i < filelist.length) {
			list = list + `<li><a href="/?id=${filelist[i]}">${filelist[i]}</a></li>`;
			i = i + 1;
		}
		list = list + '</ul>';
		return list;
	}
};

function templateHTML(title, list, body, control) {
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
   ${control}
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

				// var list = templateList(filelist);
				// var template = templateHTML(title, list, `<h2>${title}</h2>${description}`, `<a href="/create">create</a>`);
				// response.writeHead(200);
				// response.end(template);

				var list = template.list(filelist);
				var html = template.html(title, list, `<h2>${title}</h2>${description}`, `<a href="/create">create</a>`);
				response.writeHead(200);
				response.end(html);
			});
		} else {
			fs.readdir('./data/', function (err, filelist) {
				console.log(filelist);

				fs.readFile(`data/${queryData.id}`, 'utf8', function (err, description) {
					var title = queryData.id;
					var list = templateList(filelist);
					var template = templateHTML(
						title,
						list,

						`<h2>${title}</h2>${description}`,
						`<a href="/create">create</a> 
						<a href="/update?id=${title}">update</a>
						<form action="delete_process" method="post">  
						<input type="hidden" name="id" value="${title}">
						<input type="submit" value="delete">
						</form>
						
						`
						//delete를 get 방식으로하면 링크가생성되기때문에 링크공유등의 문제가 발생할수있다.
					);
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
				<form action= "/create_process" method="post">
			<p><input type="text" name="title" placeholder="title"></p>
            <p>
              <textarea name="description" placeholder="description"></textarea>
            </p>
            <p>
              <input type="submit">
            </p>
          </form>
			`,
				''
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
			fs.writeFile(`data/${title}`, description, 'utf-8', function (err) {
				response.writeHead(302, { Location: `/?id=${title}` });
				response.end();
			});
		});
	} else if (pathname === '/update') {
		fs.readdir('./data/', function (err, filelist) {
			fs.readFile(`data/${queryData.id}`, 'utf8', function (err, description) {
				var title = queryData.id;
				var list = templateList(filelist);
				var template = templateHTML(
					title,
					list,
					`
					<form action= "/update_process" method="post">
					<input type="hidden" name= "id" value="${title}">
					<p><input type="text" name="title" placeholder="title" value=${title}></p>
        		   <p>
          		    <textarea name="description" placeholder="description">${description}</textarea>
        		    </p>
       	 		    <p>
        	      <input type="submit">
        		    </p>
       			   </form>
					`,

					`<a href="/create">create</a> <a href="/update?id=${title}">update</a>`
				);
				response.writeHead(200);
				response.end(template);
			});
		});
	} else if (pathname === '/update_process') {
		var body = '';
		request.on('data', function (data) {
			// callback.
			body = body + data;
		});
		request.on('end', function () {
			var post = qs.parse(body);
			var title = post.title;
			var description = post.description;
			var id = post.id;

			fs.rename(`data/${id}`, `data/${title}`, function (error) {
				fs.writeFile(`data/${title}`, description, 'utf-8', function (err) {
					response.writeHead(302, { Location: `/?id=${title}` });
					response.end();
				});
			});

			console.log(post);
		});
	} else if (pathname === '/delete_process') {
		var body = '';
		request.on('data', function (data) {
			// callback.
			body = body + data;
		});
		request.on('end', function () {
			var post = qs.parse(body);
			var id = post.id;
			console.log(`${id} is deleted`);
			fs.unlink(`data/${id}`, function (error) {
				response.writeHead(302, { Location: `/` }); //리다이렉션 홈으로
				response.end();
			});
		});
	} else {
		response.writeHead(404);
		response.end('Not found');
	}
});
app.listen(3000);
