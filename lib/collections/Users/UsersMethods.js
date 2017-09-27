/*********************************
 * METHODES DE LA COLLECTION USERS
 **************************/

Meteor.methods({

    //méthode de creation d'un nouvel utilisateur
    createNewUser: function (userAttributes) {
        //on commence par checker que les attributs passés par le client sont valides par rapport au schéma
        check(userAttributes, CreateUserAttributeSchema);
        //on formate le json qu'on va passer a la methode
        let newUser = _.extend(userAttributes, {
            profile:{
                public:{
                    description : ""
                },
                private:{
                    signInDate : new Date()
                }

            } });
        //on lance la methode de création
        userId = Accounts.createUser(newUser);
        return userId;
    },

    //methode de l'update du profil utilisateur
    updateSelfProfile: function (fieldName, value) {
       // on check que le field name est bien une chaine
        check( fieldName, String);
        //on check dinamiquement que l'objet value correspond bien au format du champs demandé
        UserSelfProfileSchema.validate(value, { keys: [fieldName] });
        //puis on lance l'upsert'
        Meteor.users.upsert( {_id : Meteor.userId()},{
            $set : {"profile.public.description" : value[fieldName]}
        });
    }
});