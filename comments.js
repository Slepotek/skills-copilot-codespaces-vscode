// Create web server
// Run: node comments.js
var http = require('http');
var url = require('url');
var querystring = require('querystring');
var comments = [];
var server = http.createServer(function(req, res) {
    var parsedUrl = url.parse(req.url);
    var resource = parsedUrl.pathname;
    if (resource == '/comment') {
        if (req.method == 'POST') {
            addComment(req, res);
        } else if (req.method == 'GET') {
            showComment(res);
        } else {
            res.statusCode = 404;
            res.end('Not supported');
        }
    } else {
        res.statusCode = 404;
        res.end('Not found');
    }
});
server.listen(3000);
function addComment(req, res) {
    var body = '';
    req.on('data', function(chunk) {
        body += chunk;
    });
    req.on('end', function() {
        var data = querystring.parse(body);
        var msg = data.msg;
        comments.push(msg);
        // redirect
        res.statusCode = 302;
        res.setHeader('Location', '/comment');
        res.end('Success');
    });
}
function showComment(res) {
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.write('<html>');
    res.write('<body>');
    res.write('<h1>Comment</h1>');
    res.write('<hr/>');
    // show comment form
    res.write('<form method="POST" action="/comment">');
    res.write('<textarea name="msg"></textarea><br>');
    res.write('<input type="submit" value="Submit">');
    res.write('</form>');
    // show comment list
    res.write('<p>Comments: ' + comments.length + '</p>');
    res.write('<ul>');
    for (var i = 0; i < comments.length; i++) {
        res.write('<li>' + comments[i] + '</li>');
    }
    res.write('</ul>');
    res.write('</body>');
    res.write('</html>');
    res.end();
}