if(Meteor.users.find().count() === 0) {
    Meteor.call('createNewUser',{
        username: "robin",
        password:"123456"
    });
}