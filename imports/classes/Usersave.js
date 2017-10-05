//
// import { Class } from 'meteor/jagi:astronomy';
//
//
// const User = Class.create({
//     name: 'User',
//     collection: Meteor.users,
//     fields: {
//         emails: {
//            type: [String],
//             optional : true
//         } ,
//         services: Object,
//         createdAt: Date,
//         profile : {
//             type: Profile
//         }
//     }
// });
//
// const Profile = Class.create({
//     name : 'Profile',
//     fields : {
//         description: {
//             type: String,
//             optional : true,
//             validator : [
//                 {type : 'maxLength',
//                     param : 1000}
//             ],
//         },
//         // location : {
//         //     type: Location,
//        // },
//         meteorMethods: {
//             updateDescription(value) {
//                 this.profile.description = value;
//                 return this.save()
//
//             }
//         }
//     },
//
// });

// const Location = Class.create({
//     name : "Location",
//     fields : {
//         lat : {
//             type: Number,
//             optional : true,
//         },
//         lng : {
//             type: Number,
//             optional : true,
//         },
//         city: {
//             type : String,
//             optional : true,
//             validator : [
//                 {type : 'maxLength',
//                     param : 100}
//             ],
//         },
//         country: {
//             type : String,
//             optional : true,
//             validator : [
//                 {type : 'maxLength',
//                     param : 100}
//             ],
//         }
//     }
// })

// export default User;