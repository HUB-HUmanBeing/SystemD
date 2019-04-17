const MapMarkers = new Mongo.Collection('mapMarkers');
MapMarkers.deny({
    insert() { return true; },
    update() { return true; },
    remove() { return true; },
});
export default MapMarkers
