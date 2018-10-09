calculateDistance = function(point1, point2){  // generally used geo measurement function
    let loc1 = {lon: point1[0],lat :point1[1]};
    let loc2 ={lon: point2[0],lat :point2[1]};
    let R = 6378.137; // Radius of earth in KM
    let dLat = (loc2.lat - loc1.lat) * Math.PI / 180;
    let dLon = (loc2.lng - loc1.lng) * Math.PI / 180;
    let a = Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(loc1.lat * Math.PI / 180) * Math.cos(loc2.lat * Math.PI / 180) *
        Math.sin(dLon/2) * Math.sin(dLon/2);
    let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    let d = R * c;
    return {
        meters : Math.round(d * 1000),
        kilometers : d
    }
};
