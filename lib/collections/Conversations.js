const Conversations = new Mongo.Collection('conversations');
Conversations.deny({
    insert() { return true; },
    update() { return true; },
    remove() { return true; },
});
export default Conversations
