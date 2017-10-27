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
            location: {
                lat: 44.1253665,
                lng: 4.0852818,
                city: "Alès",
                country: "France"
            }
        },
        {
            username: "noemie",
            img: "https://i.imgur.com/TvenST3.jpg",
            location: {
                lat: 44.0545668,
                lng: 3.9857081999,
                city: "Anduze",
                country: "France"
            }
        }, {
            username: "audric",
            img: "https://i.imgur.com/YgLPzXz.jpg",
            location: {
                lat: 43.8374249,
                lng: 4.3600687,
                city: "Nîmes",
                country: "France"
            }
        },
        {
            username: "jeremy",
            img: "",
            location: {
                lat: 44.2102417,
                lng: 4.0294228,
                city: "La Grand-Combe",
                country: "France"
            }
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
        });

        let createdUser = User.findOne({_id: userId});
        createdUser.profile.imgUrl = user.img;
        createdUser.profile.description = lorem;

        createdUser.save()

    })
}