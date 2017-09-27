

Meteor.methods({
    createNewUser: function (userAttributes) {
        check(userAttributes, CreateUserAttributeSchema);
        let newUser = _.extend(userAttributes, {
            profile:{
                public:{
                    description : ""
                },
                private:{
                    signInDate : new Date()
                }

            } });
        userId = Accounts.createUser(newUser);

        return userId;
    },
    updateSelfProfile: function (fieldName, value) {
        check( fieldName, String);
        UserSelfProfileSchema.validate(value, { keys: [fieldName] });
        Meteor.users.update( {_id : Meteor.userId()},{
            $set : {"profile.public.description" : value[fieldName]}
        });
    }
});