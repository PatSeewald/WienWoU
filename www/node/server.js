import express from 'express'; // Server
import bp from 'body-parser'; // Request-Daten
import { writeFile } from 'fs'; // Dateien
import { get } from 'request'; // Server-Request
import { parse } from 'csv'; // CSV-Dateien einlesen

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
    console.log(`Start load CSV: ${url} \n`);
    get(url, (error, response, body) => {
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
    parse(data, { delimiter: ';' }, (error, data) => {
      if (!error) {
        resolve(data);
      }
      else {
        reject(`csv parse ${error}`)
      }
    });
  });
}

let saveJSON = function () {

  return new Promise(function (res, rej) {

    let data = { lines: [] };
    let c = {
      U1: '#794646',
      U2: '#7d5190',
      U3: '#ed6720',
      U4: '#28a847',
      U6: '#9d6930'
    };

    let linienId = [];

    //console.log( linien );
    for (const index in linien) {
      if (linien[index][4] == 'ptMetro') {
        linienId[linien[index][0] * 1] = data.lines.length;
        data.lines.push({
          name: linien[iindex][1],
          color: c[linien[index][1]],
          stations: []
        });
      }
    }
    //console.log( linienId );
    //console.log( steige );
    for (const index in steige) {
      let zweiterIndex = linienId[steige[index][1]];
      //console.log( 's'+steige[1] );
      if (typeof j == 'number') {
        if (data.lines[zweiterIndex].stations.indexOf(steige[index][2]) == -1) {
          data.lines[zweiterIndex].stations.push(steige[index][2]);
        }
      }
    }
    let hs = [];
    for (const index in haltestellen) {

      if (isFinite(haltestellen[index][0] * 1)) {
        hs[haltestellen[index][0] * 1] = [
          haltestellen[index][3], haltestellen[index][6], haltestellen[index][7]
        ];
      }
    }

    for (const index in data.lines) {
      for (const zweiterIndex in data.lines[index].stations) {
        let dritterIndex = data.lines[index].stations[zweiterIndex];
        data.lines[index].stations[zweiterIndex] = {
          name: hs[dritterIndex][0],
          lat: hs[dritterIndex][1],
          lng: hs[dritterIndex][2]
        }
      }
    }

    writeFile('linien.json', JSON.stringify(data), (error) => {
      if (!error) {
        resolve();
      } else {
        reject();
      }
    });
  });

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

app.post('/getstations', (request, response) => {
  response.sendFile(`${__dirname}/linien.json`);
});

