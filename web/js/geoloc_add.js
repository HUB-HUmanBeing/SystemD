/**
 * Created by banquo on 03/07/17.
 */
$(function() {


  function initmap(lat, lon, city) {
      var map = L.map('user_mapid').setView([lat, lon], 13);
      // create the tile layer with correct attribution
      var osmUrl = 'http://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png';
      var osmAttrib = '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, Tiles courtesy of <a href="http://hot.openstreetmap.org/" target="_blank">Humanitarian OpenStreetMap Team</a>';
      var osm = new L.TileLayer(osmUrl, {
          maxZoom: 19,

          attribution: osmAttrib
      });
    // start the map
      L.marker([lat, lon]).addTo(map)
        .bindPopup(city)
        .openPopup();
      map.addLayer(osm);

  }
  var is_map = false;
  $("#search").click(function() {
//todo l'adresse ne se met pas a jour si on change d'avis
      var address = $("#user_adress").val();
      var url = "http://nominatim.openstreetmap.org/search/" + address + "?format=json&addressdetails=1&limit=1";
      $.getJSON(url, function(data) {
          console.log(data);
          var lat = data[0].lat;
          var lon = data[0].lon;
          var city = data[0].address.city;
          var country = data[0].address.country;
          $('#user_lat').val(lat);
          $('#user_lon').val(lon);
          $('#user_city').val(city);
          $('#user_country').val(country);


          initmap(lat, lon, city);

      });

  });

});
