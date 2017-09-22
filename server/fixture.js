if(Meteor.users.find().count() === 0) {
    Accounts.createUser({
        username: "robin",
        email: "caramaschi@hotmail.com",
        password:"123456",
        profile: {
            firstName: "robin",
            lastName: "caramaschi",
        }
    });
}