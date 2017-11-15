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