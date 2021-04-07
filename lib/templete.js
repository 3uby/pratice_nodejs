var templete = {
  HTML : function(title, list, body, control) {
  return ` <!doctype html>
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
          </html> `
  },
  List :function (filelist) {
  var list = '<ul>';
  for (var i of filelist) {
    list = list + `<li><a href="/?id=${i}">${i}</a></li>`;
  }
  list = list + '</ul>';
  return list; 
  }
}

module.exports = templete;