let express = require('express'); // Server
let bp = require('body-parser'); // Request-Daten
let fs = require('fs'); // Dateien
let request = require('request'); // Server-Request
let csv = require('csv'); // CSV-Dateien einlesen

let app = express();
let server = app.listen(8287, () => {
  console.log('Server läuft Port 8287');
});

let urlLinienCSV = 'https://data.wien.gv.at/csv/wienerlinien-ogd-linien.csv';
let urlSteigeCSV = 'https://data.wien.gv.at/csv/wienerlinien-ogd-steige.csv';
let urlHaltestellenCSV = 'https://data.wien.gv.at/csv/wienerlinien-ogd-haltestellen.csv';
let linien, steige, haltestellen;

function loadCSV(url) {
  return new Promise((resolve, reject) => {
    console.log(`Start load CSV: ${url} \n`)
    request.get(url, (error, response, body) => {
      if (!error && response.statusCode == 200) {
        resolve(body);
      }
      else {
        reject(`load ${url}`);
      }
    });
  });
}
function parseCSV(data) {
  return new Promise((resolve, reject) => {
    csv.parse(data, { delimiter: ';' }, (error, data) => {
      if (!error) {
        resolve(data);
      }
      else {
        reject(`csv parse ${error}`)
      }
    });
  });
}

function saveJSON() {
  let color = {
    U1: '#e20613',
    U2: '#a762a3',
    U3: '#ee7d00',
    U4: '#009540',
    U6: '#9d6930'
  };
  let data = {
    lines: []
  };

  for (let i in linien) {
    if (linien[i][4] == 'ptMetro') {
      data.lines.push({
        name: linien[i][1],
        color: color[linien[i][1]],
        stations: []
      });
    }
  }
  
  console.log(data);
}

app.get('/createjson', (request, response) => {
  // 1. Lade CSV-Datei (Linien)
  loadCSV(urlLinienCSV)
    .then(parseCSV)
    .then((data) => {
      linien = data;
      return loadCSV(urlSteigeCSV);
    })
    .then(parseCSV)
    .then((data) => {
      steige = data;
      return loadCSV(urlHaltestellenCSV);
    })
    .then(parseCSV)
    .then((data) => {
      haltestellen = data;
      saveJSON();

      console.log('Alles Fertig');

    })
    .catch((error) => {
      console.log(`CSV Einlesefehler ${error}`)
    })
  // 2. Parse CSV
  // 3. Lade CSV-Datei (Steige)
  // 4. Parse CSV
  // 5. Lade CSV-Datei (Haltestellen)
  // 6. Parse CSV
  // 7. Speichere JSON


  response.end('linien.json created');
});

app.post('getstations', (request, response) => {
  response.sendFile(`${__dirname} + /linien.json`);
});

