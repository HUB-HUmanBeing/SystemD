const Publications = new Mongo.Collection('publications');
Publications.deny({
    insert() { return true; },
    update() { return true; },
    remove() { return true; },
});
export default Publications
