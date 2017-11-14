getLonLat = function (callback) {
    $.getJSON('//freegeoip.net/json/?callback=?', (data) => {
        callback( [
            data.longitude,
            data.latitude
        ])
    });
}