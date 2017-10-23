if (Meteor.users.find().count() === 0) {
    let usernames = ["robin", "coralie", "eve la plus belle", "noemie", "audric",];
    usernames.forEach(function (username) {
        Meteor.call('createNewUser', {
            username: username,
            password: "123456"
        })
    })
};