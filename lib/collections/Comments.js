const Comments = new Mongo.Collection('comments');
Comments.deny({
    insert() { return true; },
    update() { return true; },
    remove() { return true; },
});
export default Comments
