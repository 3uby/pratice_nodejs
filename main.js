var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring');

function templateHTML(title, list, body, control) {
  return `
  <!doctype html>
          <html>
          <head>
            <title>WEB1 - ${title}</title>
            <meta charset="utf-8">
          </head>
          <body>
            <h1><a href="/">WEB</a></h1>
            ${list}
            ${control}
            <p> ${body} </p>
          </body>
          </html>
  `
}
function templateList(filelist) {
  var list = '<ul>';
  for (var i of filelist) {
    list = list + `<li><a href="/?id=${i}">${i}</a></li>`;
    console.log(i);
  }
  list = list + '</ul>';
  console.log(filelist);
  console.log(list);
  return list;

}

var app = http.createServer(function (request, response) {
  var _url = request.url;
  var queryData = url.parse(_url, true).query;
  var title = queryData.id;
  var pathName = url.parse(_url, true).pathname;

  if (pathName === '/') {  //404 가 아니면 
    if (queryData.id === undefined) { //home 이면 
      fs.readdir('./data', function (err, filelist) {
        var title = 'Welcome';
        var description = 'Hello node.js';
        var list = templateList(filelist);
        var templete = templateHTML(title, list,
          `<h2>${title}</h2>${description}`,
          `<a href="/create">create</a>`);
        response.writeHead(200);
        response.end(templete);
      });
    } else {
      fs.readdir('./data', function (err, filelist) {
        fs.readFile(`./data/${queryData.id}`, function (err, data) {
          var list = templateList(filelist);
          var description = data;
          var templete = templateHTML(title, list,
            `<h2>${title}</h2>${description}`,
            `<a href="/create">create</a> <a href="/update?id=${title}">update</a>`
          );
          response.writeHead(200);
          response.end(templete);
        });
      });
    }
  } else if (pathName === '/create') {
    fs.readdir('./data', function (err, filelist) {
      var title = 'Welcome';
      var list = templateList(filelist);
      var templete = templateHTML(title, list, `
      <form action="http://localhost:3000/create_process" method="POST">
        <p>
          <input type="text" name ="title" placeholder="title">
        </p>
        <p>
          <textarea name="description" id="" cols="30" rows="10" placeholder="descripton"></textarea>
        </p>
        <p>
          <input type="submit">
        </p>
      </form>
          `, ''); //공백문자의 뜻은 undefined가 나오기 때문에 
      response.writeHead(200);
      response.end(templete);
    });

  } else if (pathName === '/create_process') {

    var body = '';

    request.on('data', function (data) {
      body += data;
    });

    request.on('end', function () {
      var post = qs.parse(body);
      var title = post.title;
      var description = post.description;

      fs.writeFile(`./data/${title}`, description, 'utf8', function (err) {
        if (err) throw err;
        response.writeHead(302, { Location: `/?id=${title}` });
        response.end('secess');
      });
    });
  } else if (pathName === "/update") {
    fs.readdir('./data', function (err, filelist) {
      fs.readFile(`./data/${queryData.id}`, function (err, data) {
        var list = templateList(filelist);
        var description = data;
        var templete = templateHTML(title, list,
          `
        <form action="http://localhost:3000/update_process" method="POST">

        <input type="hidden" name="id" value="${title}">

        <p> 
        <input type="text" name ="title" placeholder="title" value="${title}">
        </p>

        <p>
        <textarea name="description" id="" cols="70" rows="15" placeholder="descripton">${description}</textarea>
        </p>

        <p> <input type="submit" value="수정"> </p>
        </form>
        ` ,
        `<a href="/create">create</a>`
        );
        response.writeHead(200);
        response.end(templete);
      });
    });
  }else if(pathName ==='/update_process'){
    var body = '';

    request.on('data', function (data) {
      body += data;
    });

    request.on('end', function () {
      var post = qs.parse(body);
      var title = post.title;
      var description = post.description;
      var id = post.id;
      console.log(post);
      fs.rename(`./data/${id}`,`./data/${title}`,function(err){//아하 이동할수도있구나 ?~
        fs.writeFile(`./data/${title}`, description, 'utf8', function (err) {
          response.writeHead(302, { Location: `/?id=${title}` });
          response.end('success');
        });
      })
    });
  } else {
    response.writeHead(404);
    response.end('Not found');
  }
  // response.end(fs.readFileSync(__dirname + url));
});
app.listen(3000);