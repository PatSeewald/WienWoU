let express = require('express'); // Server
let bp = require('body-parser'); // Request-Daten
let fileupload = require('express-fileupload');
let fs = require('fs'); // Dateien
let app = express();
let port = 8286;

let server = app.listen(port, () => {
  console.log(`Server gestartet. Port ${port}`)
});

app.use(express.static('static'));
// app.use(bp.urlencoded({ extended: true }));
app.use(fileupload());

app.post('/upload', (request, response) => {
  // Upgeloadetes File in Order user_uploads
  // console.log(request.files);
  switch (request.files.datei.mimetype) {
    case 'image/png':
    case 'image/jpeg':
    case 'image/gif':
    case 'image/bmp':
    case 'image/tiff':
      request.files.datei.mv(`${__dirname}/user_uploads/images/${request.files.datei.name}`, (error) => {
        if (error) {
          response.end(error);
        }
        else {
          response.end('Datei hochgeladen');
        }
      });
      break;
    case 'application/msword':
    case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
    case 'text/plain':
    case 'text/markdown':
      request.files.datei.mv(`${__dirname}/user_uploads/text/${request.files.datei.name}`, (error) => {
        if (error) {
          response.end(error);
        }
        else {
          response.end('Datei hochgeladen');
        }
      });
      break;
    default:
      response.end('Falsche Datei');
      break;
  }
});

app.get('/', (request, response) => {
  response.sendFile(`${__dirname}/upload.html`);
});