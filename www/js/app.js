// show error on mobile
window.onerror = function( err ) {
    console.log( err );
    return true;
  }
  console.log = function(s) {
      $( '#debug').html(s).css({padding:10});
  }
  
  var loadWLEchtZeitDaten = function( steige, cb ) {
    $.ajax({
    url:'http://www.wienerlinien.at/ogd_realtime/monitor',
    data:{rbl:steige[0],sender:'LndqkyecPrAmUu5Q'},
    success:function(res) {
  
      console.info( res );
  
        html = 'Abfahrten nach <b>'+res.data.monitors[0].lines[0].towards+'</b> in:<br><div style="font-size:2em;">';
        for ( c in res.data.monitors[0].lines[0].departures.departure ) {
          html+= res.data.monitors[0].lines[0].departures.departure[c].departureTime.countdown +'min '
        }
        html+='</div>'
        $.ajax({
        url:'http://www.wienerlinien.at/ogd_realtime/monitor',
        data:{rbl:steige[1],sender:'LndqkyecPrAmUu5Q'},
        success:function(res) {
  
          html += '<hr>Abfahrten nach <b>'+res.data.monitors[0].lines[0].towards+'</b> in:<br><div style="font-size:2em;">';
          for ( c in res.data.monitors[0].lines[0].departures.departure ) {
            html+= res.data.monitors[0].lines[0].departures.departure[c].departureTime.countdown +'min '
          }
          html += '</div>';
            cb(html);
        }});
  
    }
  })
  }
  
  document.addEventListener( 'deviceready', function() {
    $( document ).ready( function() {
      console.log( 'DOM ready, alles ready...' );
      $('#debug').on('click', function() { $(this).empty().css({padding:0}); });
      var karte = L.map( 'map' );
      L.tileLayer( 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap'
      } ).addTo( karte );
      karte.setView( [ 48.21, 16.38 ], 12 );
  
      var allicons=['U1','U2','U3','U4','U6'];
      var marker = {};
      for ( l in allicons ) {
        marker[ allicons[l] ] = L.icon({
          iconUrl:'assets/Wien_'+allicons[l]+'.svg.png',
          iconSize:[20,20]
        })
      }
      $.ajax({
        url:'http://localhost:8287/getstations',
        method:'post',
        data:{},
        success:function(data) {
          console.info( data );
          for ( k in data.lines ) {
            var latlngs = [];
            for ( i in data.lines[k].stations ) {
              latlngs.push([
                data.lines[k].stations[i].lat,
                data.lines[k].stations[i].lng
              ]);
              var m = L.marker(latlngs[latlngs.length-1],{icon:marker[data.lines[k].name]}).addTo(karte);
              m.bindPopup( data.lines[k].stations[i].name )
              m.steige = data.lines[k].stations[i].steige;
              m.on('click', function(e) {
                   var popup = e.target.getPopup();
                  loadWLEchtZeitDaten( this.steige, function( html ) {
                    popup.setContent(html);
                    popup.update();
                  });
              })
  
            }
            var polyline = L.polyline(latlngs, {weight:5, color: data.lines[k].color }).addTo(karte);
          }
  
        }
      })
  
  
        $.ajax({
          url:'http://www.wienerlinien.at/ogd_realtime/monitor',
          data:{rbl:4252,sender:'LndqkyecPrAmUu5Q'},
          success:function(res) {
            console.log( res );
          }
        });
  
  
    });
  });