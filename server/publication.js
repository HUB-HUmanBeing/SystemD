Meteor.publish('UserPrivateInfo',function (id) {
    check(id, String);
    if(id === Meteor.userId())
    return Meteor.users.find(id);
});
