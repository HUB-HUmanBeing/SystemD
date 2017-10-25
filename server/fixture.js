if (Meteor.users.find().count() === 0) {
    let lorem = "Lorem ipsum dolor sit amet, consectetur adipisicing elit. " +
        "Illo natus nulla placeat sunt tempore! Accusamus architecto aspernatur " +
        "blanditiis eligendi exercitationem harum nesciunt odio odit pariatur " +
        "perferendis quasi, quo sunt voluptate!"
    let users = [
        {
            username: "robin",
            img: "",

        },
        {

            username: "noemie",
            img: "",


        }, {
            username: "audric",
            img: "",
        },

]
;
users.forEach(function (user) {
    Meteor.call('createNewUser', {
        username: user.username,
        password: "123456"
    })
})
}
;