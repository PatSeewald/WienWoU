// show error on mobile
window.onerror = (error) => {
  console.log(error);
  return true;
}
console.log = (s) => {
  $('#debug').html(s).css({ padding: 10 });
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

    $.ajax({
      url: 'http://localhost:8287/getstations',
      data: {},
      method: 'post',
      success: (data) => {
        console.info(data);
        for (const i in data.lines) {
          let latlngs = [];
          for (const j in data.lines[i].stations) {
            latlngs.push([
              data.lines[j].stations[i].lat,
              data.lines[j].stations[i].lng,
            ]);
          }
          let polyline = L.polyline(latlngs, { color: data.lines[k].color }).addTo(karte);
        }
      }
    });
  });
});
