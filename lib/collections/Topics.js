const Topics = new Mongo.Collection('Topics');
Topics.deny({
    insert() { return true; },
    update() { return true; },
    remove() { return true; },
});
export default Topics
