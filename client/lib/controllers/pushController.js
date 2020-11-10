
import firebase from "firebase/app";
import "firebase/messaging";

const pushController = {
    /*********************************
     * initialise l'api de notification pour un utilisateur donné
     * @param user
     */
    async initialize(user) {
        let permission = null
if( Meteor.isCordova){
    permission = await cordova.plugins.firebase.messaging.requestPermission({forceShow: true});

}else{
    permission = await Notification.requestPermission();
}

        if (permission === 'granted') {
            this.getToken(user);
        } else {
            console.log("out")
        }
    },
    async getToken(user){
        let token = null
        if( Meteor.isCordova){
            token = await cordova.plugins.firebase.messaging.getToken("apns-string")

        }else{
            token = await firebase.messaging().getToken( {vapidKey: Meteor.settings.public.publicVapidKey});

        }
           if (token) {
                this.saveToken(token,user)
            }

    },
    saveToken(token, user) {
        if (user.private.tokens.indexOf( token) === -1) {
            Meteor.call('registerToken', token , (err, res) => {
                if (err) {
                    console.log(err)
                } else {
                    console.log(res)
                }
            })
        }
    }
}
export default pushController
