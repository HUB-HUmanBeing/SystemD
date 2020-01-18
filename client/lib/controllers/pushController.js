
import firebase from "firebase/app";
import "firebase/messaging";

const pushController = {
    /*********************************
     * initialise l'api de notification pour un utilisateur donné
     * @param user
     */
    async initialize(user) {

        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
            this.getToken(user);
        } else {
            console.log("out")
        }
    },
    async getToken(user){

            const token = await firebase.messaging().getToken();
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
