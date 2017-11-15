/********************************
 * Fonction permettant de faire appel a l'api de localisation par IP
 * @param callback
 */
getLonLat = function (callback) {
    function maPosition(position) {
        return [
            position.coords.latitude,
            position.coords.longitude
        ]



    }

    if(navigator.geolocation){
       console.log( navigator.geolocation.getCurrentPosition(maPosition));
    }

    $.getJSON('//freegeoip.net/json/?callback=?', (data) => {
        callback( [
            data.longitude,
            data.latitude
        ])
    });
}