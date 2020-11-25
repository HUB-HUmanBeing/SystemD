
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
            permission = await cordova.plugins.firebase.messaging.requestPermission().then(()=> {
                                     this.getToken(user);
                               });

        }else{
            permission = await Notification.requestPermission();
              if (permission === 'granted') {
                        this.getToken(user);
                    }
        }

    },
    async getToken(user){
        let token = null
        if( Meteor.isCordova){
            cordova.plugins.firebase.messaging.getToken().then((token)=> {
                       this.saveToken(token,user)
                                                                      });

        }else{
            token = await firebase.messaging().getToken( {vapidKey: Meteor.settings.public.publicVapidKey});
                 if (token) {
                            this.saveToken(token,user)
                        }
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
