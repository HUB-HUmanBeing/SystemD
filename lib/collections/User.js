Meteor.users.deny({
    insert() { return true; },
    update() { return true; },
    remove() { return true; },
});
