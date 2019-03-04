const Invitations = new Mongo.Collection('invitations');
Invitations.deny({
    insert() { return true; },
    update() { return true; },
    remove() { return true; },
});
export default Invitations
