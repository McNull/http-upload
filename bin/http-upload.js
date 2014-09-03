#!/usr/bin/env node
/**
 * Created by null on 03/09/14.
 */
var formidable = require('formidable'),
  http = require('http'),
  util = require('util'),
  fs = require('fs');

var port = 8989;

http.createServer(function(req, res) {
  if (req.url == '/upload' && req.method.toLowerCase() == 'post') {
    // parse a file upload
    var form = new formidable.IncomingForm({
      uploadDir: './', multiples: true
    });

    form.parse(req, function(err, fields, files) {

      if(!err) {

        if(!Array.isArray(files.upload)) {
          files.upload = [files.upload];
        }

        files.upload.forEach(function(file) {
          fs.renameSync(file.path, './' + file.name);
          console.log(file.name);
        });

        res.writeHead(200, {'content-type': 'text/html'});
        res.end('<h1>Files uploaded</h1><script>setTimeout(function(){ location.href = \'/\'; }, 2000);</script>')


//        res.write('Received upload:\n\n');
//        res.end(util.inspect(files));
      }

    });

    return;
  }

  // show a file upload form
  res.writeHead(200, {'content-type': 'text/html'});
  res.end(
      '<form action="/upload" enctype="multipart/form-data" method="post">'+
      '<input type="file" name="upload" multiple="multiple"><br>'+
      '<input type="submit" value="Upload">'+
      '</form>'
  );
}).listen(port);

console.log('Listening on port:' + port);