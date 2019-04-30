const Activities = new Mongo.Collection('activities');
Activities.deny({
    insert() { return true; },
    update() { return true; },
    remove() { return true; },
});
export default Activities
