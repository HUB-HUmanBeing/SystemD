import User from '/imports/classes/User'
import {check} from "meteor/check";
import cryptoServer from "../../imports/cryptoServer";
import Hashes from "jshashes";
import * as randomPassword from "secure-random-password";

/*********************************
 * METHODES DE LA COLLECTION USERS
 * les autres méthodes sont directement stockées dans la classe
 **************************/

Meteor.methods({
    /**
     * Methode permetant de vérifier si un nom d'utilisateur est déja pris
     * @param username
     * @returns {boolean}
     */
    alreadyExists(username) {
        check(username, String)
        return !!Accounts.findUserByUsername(username);
    },
    /****************************
     * méthode de creation d'un nouvel utilisateur
     * @param userAttributes
     * @param key
     */
    createNewUser: function (userAttributes, key, language, captcha,salt) {
        check(captcha, {
            userInput: String,
            hashControl: String
        })
        check((cryptoServer.fastHash(captcha.userInput) === captcha.hashControl), true)
        check(language, String)
        //on définit notre fonction de validation
        const validAttribute = Match.Where((attribute) => {
            //en type
            check(attribute.username, String);
            check(attribute.password, String);


            //et ensuite en longueur
            return attribute.password.length >= 8 && attribute.username.length <= 40 && attribute.username.length >= 4;
        });
        //on commence par checker que les attributs passés par le client oient valides
        check(userAttributes, validAttribute);
        check(key, Object)
        check(key.asymPublicKey, String)
        check(key.encryptedAsymPrivateKey, String)
        check(salt,String)
        //on lance la methode de création

        userId = Accounts.createUser(userAttributes);

        //si elle est réussie et donc qu'elle renvoie un userID
        if (userId) {

            // on recupere les données de cet user pour hydrater une instance de la classe User
            let newUser = User.findOne(userId);
            newUser.public.asymPublicKey = key.asymPublicKey
            newUser.private.encryptedAsymPrivateKey = key.encryptedAsymPrivateKey
            newUser.public.language = language
            if(salt){
                newUser.public.securized = true
                newUser.salt=salt
            }else{
                newUser.public.securized = false
            }

            //puis on la sauvegarde, mettant ainsi en base l'utilisateur créé avec tous les champs nécessaires stoqués
            newUser.save();

            //on renvoie l'userId qui servira pour la redirection
            return userId;
        }

    },
    /******************************
     * Methode de suppression d'un compte Utilisateur
     */
    deleteUserAccount: function (passwordConfirmation) {
        check(passwordConfirmation, String)
        check(!!Accounts._checkPassword(Meteor.user(), passwordConfirmation).error, false)
        //on check que l'utilisateur est bien l'e propriétaire
        let user = User.findOne(Meteor.userId())

        user.remove()

    },
    createHash: function (password, pinCode) {
        check(password, String)
        check(pinCode,String)
        let salt = randomPassword.randomPassword({
            length: 30,
            characters: [randomPassword.lower, randomPassword.upper, randomPassword.digits]
        })
        console.log("inWithPincode")
        return {
            hash: new Hashes.SHA512().b64(password + pinCode + salt+Meteor.settings.serverSalt),
            salt: salt
        }
    }
});
