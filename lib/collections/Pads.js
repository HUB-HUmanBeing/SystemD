const Pads = new Mongo.Collection('pads');
Pads.deny({
    insert() { return true; },
    update() { return true; },
    remove() { return true; },
});
export default Pads
