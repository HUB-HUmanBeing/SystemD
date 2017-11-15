/********************************
 * Fonction permettant de faire appel a l'api de localisation par IP
 * @param callback
 */
getLonLat = function (callback) {

    $.getJSON('//freegeoip.net/json/?callback=?', (data) => {
        callback( [
            data.longitude,
            data.latitude
        ])
    });
}
getPositionNavigator = function (callback) {
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(function(Position){
            callback( {
                lat : Position.coords.latitude,
                lon : Position.coords.longitude
        })
        });
    }
}