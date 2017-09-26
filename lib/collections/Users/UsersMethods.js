

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
    updateSelfProfile: function (attribute) {
        console.log("coté serveur")
        check(attribute.value , UserSelfProfileSchema.schema(attribute.fieldName));
        Meteor.User.update( Meteor.userId(),{
            $set : {"profile.public.description" : attribute.value}
        });
    }
});