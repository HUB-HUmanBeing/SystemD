CreateUserAttributeSchema = new SimpleSchema({
    username : {
        type: String,
        label: "Username",
        max: 35
    },
    password: {
        type:String,
        label: "Password",
    }
});

Meteor.methods({
   createNewUser: function (userAttributes) {
       check(userAttributes, CreateUserAttributeSchema);
       let newUser = _.extend(userAttributes, {
           profile:{
               signInDate : new Date()
           } });
       userId = Accounts.createUser(newUser);

        return userId;
   }
});