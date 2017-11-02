import User from '/imports/classes/User'
import Project from '/imports/classes/Project'

if (Meteor.users.find().count() === 0) {


    let lorem = "Lorem ipsum dolor sit amet, consectetur adipisicing elit. " +
        "Illo natus nulla placeat sunt tempore! Accusamus architecto aspernatur " +
        "blanditiis eligendi exercitationem harum nesciunt odio odit pariatur " +
        "perferendis quasi, quo sunt voluptate!"

    let users = [
        {
            username: "robin",
            img: "https://i.imgur.com/v7pjMbk.jpg",

        },
        {
            username: "noemie",
            img: "https://i.imgur.com/TvenST3.jpg",

        }, {
            username: "audric",
            img: "https://i.imgur.com/YgLPzXz.jpg",

        },
        {
            username: "jeremy",
            img: "",

        },
        {
            username: "batman",
            img: "https://i.imgur.com/jzSS8tz.jpg",
        },

    ];


    users.forEach(function (user) {
        userId = Meteor.call('createNewUser', {
            username: user.username,
            password: "123456"
        },function () {
            let createdUser = User.findOne({_id: userId});
            createdUser.profile.imgUrl = user.img;
            createdUser.profile.description = lorem;
            createdUser.save(function () {
                
            })
        });

       
        

    })
}