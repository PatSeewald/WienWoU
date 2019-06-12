// show error on mobile
window.onerror = (error) => {
  console.log(error);
  return true;
}
console.log = (s) => {
  $('#debug').html(s).css({ padding: 10 });
}

let loadWLEchtZeitDaten = function (steige, cb) {
  $.ajax({
    url: 'http://www.wienerlinien.at/ogd_realtime/monitor',
    data: { rbl: steige[0], sender: 'LndqkyecPrAmUu5Q' },
    success: function (res) {

      console.info(res);

      html = 'Abfahrten nach <b>' + res.data.monitors[0].lines[0].towards + '</b> in:<br><div style="font-size:2em;">';
      for (c in res.data.monitors[0].lines[0].departures.departure) {
        html += res.data.monitors[0].lines[0].departures.departure[c].departureTime.countdown + 'min '
      }
      html += '</div>'
      $.ajax({
        url: 'http://www.wienerlinien.at/ogd_realtime/monitor',
        data: { rbl: steige[1], sender: 'LndqkyecPrAmUu5Q' },
        success: function (res) {

          html += '<hr>Abfahrten nach <b>' + res.data.monitors[0].lines[0].towards + '</b> in:<br><div style="font-size:2em;">';
          for (c in res.data.monitors[0].lines[0].departures.departure) {
            html += res.data.monitors[0].lines[0].departures.departure[c].departureTime.countdown + 'min '
          }
          html += '</div>';
          cb(html);
        }
      });

    }
  })
}

document.addEventListener('deviceready', () => {
  $(document).ready(() => {
    console.log('DOM ready, alles ready...');
    $('#debug')
      .on('click', () => {
        $('#debug').empty()
          .css({
            padding: 0
          });
      });
    let karte = L.map('map');
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap'
    }).addTo(karte);
    karte.setView([48.21, 16.38], 12);
    let allIcons = ['U1', 'U2', 'U3', 'U4', 'U6',]
    let marker = {};
    for (const icon in allIcons) {
      marker[allIcons[icon]] = L.icon({
        iconUrl: `./assets/Wien_${allIcons[icon]}.svg.png`,
        iconSize: [20, 20],
        popupAnchor: [-5, -5]
      });
    }

    $.ajax({
      url: 'http://localhost:8287/getstations',
      data: {},
      method: 'post',
      success: (data) => {
        console.info(data.lines);
        for (const line in data.lines) {
          let latlngs = [];
          for (const station in data.lines[line].stations) {
            latlngs.push([
              data.lines[line].stations[station].lat,
              data.lines[line].stations[station].lng
            ]);
            let m = L.marker(latlngs[latlngs.length - 1], { icon: marker[data.lines[line].name] })
              .addTo(karte);
              m.bindPopup(data.lines[line].stations[station].name);
              m.steige = data.lines[line].stations[station].steige;
            m.on('click', (e) => {
              let popUp = e.target.getPopup();
              loadWLEchtZeitDaten( this.steige, function( html ) {
                popUp.setContent(html);
                popUp.update();
              });

            });
          }

          L.polyline(latlngs, { weight: 5, color: data.lines[line].color }).addTo(karte);
        }
      }
    });
    $.ajax({
      url: 'http://www.wienerlinien.at/ogd_realtime/monitor',
      data: { rbl: 4252, sender: 'LndqkyecPrAmUu5Q' },
      success: function (res) {
        console.log(res);
      }
    });
  });
});
