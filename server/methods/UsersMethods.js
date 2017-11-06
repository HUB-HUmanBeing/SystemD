import User from '/imports/classes/User'

Meteor.users.deny({
    update() { return true; }
});

/*********************************
 * METHODES DE LA COLLECTION USERS
 * les autres méthodes sont directement stockées dans la classe
 **************************/

Meteor.methods({
    /*****************************
     *   méthode de creation d'un nouvel utilisateur
     *****************************/
    createNewUser: function (userAttributes) {
        //on définit notre fonction de validation
        const validAttribute = Match.Where((attribute) => {
            //en type
            check(attribute.username, String);
            check(attribute.password, String);
            //et ensuite en longueur
            return attribute.password.length >= 6 && attribute.username.length <= 35 && attribute.username.length >= 5;
        });
        //on commence par checker que les attributs passés par le client oient valides
        check(userAttributes, validAttribute);

        //on lance la methode de création
        userId = Accounts.createUser(userAttributes);
        //si elle est réussie et donc qu'elle renvoie un userID
        if(userId){
           // on recupere les données de cet user pour hydrater une instance de la classe User
            newUser = User.findOne(userId);
            //on rajoute une notif de bienvenue
            newUser.profile.notifications.push({
                content: "Bienvenue sur HUmanBeing",
                type: "user"
            })
            //puis on la sauvegarde, mettant ainsi en base l'utilisateur créé avec tous les champs nécessaires stoqués
            newUser.save();
        }
        //on renvoie l'userId qui servira pour la redirection
        return userId;
    }
});