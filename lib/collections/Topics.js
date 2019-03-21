const Topics = new Mongo.Collection('topics');
Topics.deny({
    insert() { return true; },
    update() { return true; },
    remove() { return true; },
});
export default Topics
