import cryptoTools from "../cryptoTools";
import User from "../../../imports/classes/User";
import * as Materialize from "meteor/materialize:materialize";

const pushController = {
    /*********************************
     * initialise l'api de notification pour un utilisateur donné
     * @param user
     */
    initialize(user) {
        const publicVapidKey = Meteor.settings.public.publicVapidKey
// Check for service worker
        if ("serviceWorker" in navigator) {
            this.getRegister((register) => {
                this.send(register, publicVapidKey, user).catch(err => console.error(err));
            })
        } else {
            Materialize.toast(__("notification.notSupported"), 6000, "toastError")
        }
    },
    getPermissionState(pushManager, publicVapidKey, callback) {
        pushManager.permissionState({
            userVisibleOnly: true,
            applicationServerKey: this.urlBase64ToUint8Array(publicVapidKey)
        }).then(state => {
            callback(state)
        }).catch(err => {
            console.log("permissionState error", err)
        })
    },
    getRegister(callback) {
        navigator.serviceWorker.register("/worker.js", {
            scope: "/"
        }).then(res => {
            //console.log(res)
            callback(res)
        })
    },
// Register SW, Register Push, Send Push
    async send(register, publicVapidKey, user) {
        // Register Service Worker
        let timeout = Meteor.setTimeout(() => {
            Session.set("showAcceptNotif", true)
        }, 200)
        Meteor.setTimeout(()=>{
            Session.set("showAcceptNotif", false)
        }, 15000)
        register.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: this.urlBase64ToUint8Array(publicVapidKey)
        }).then((res) => {
            //console.log(res)
            Meteor.clearTimeout(timeout)
            Session.set("showAcceptNotif", false)
            this.registerSubscriptionIfNeeded(JSON.stringify(res), user)
        }).catch(err => {
            console.log(err)
            Meteor.clearTimeout(timeout)
            Session.set("showAcceptNotif", false)
        });
    },
    urlBase64ToUint8Array(base64String) {
        const padding = "=".repeat((4 - base64String.length % 4) % 4);
        const base64 = (base64String + padding)
            .replace(/\-/g, "+")
            .replace(/_/g, "/");

        const rawData = window.atob(base64);
        const outputArray = new Uint8Array(rawData.length);

        for (let i = 0; i < rawData.length; ++i) {
            outputArray[i] = rawData.charCodeAt(i);
        }
        return outputArray;
    },
    registerSubscriptionIfNeeded(subscription, user) {
        let found = false
        let navigatorFingerPrint = cryptoTools.getNavigatorFingerPrint()
        user.private.pushSubscriptions.forEach(pushSubscription => {
            if (pushSubscription.navigatorFingerPrint === navigatorFingerPrint
                || pushSubscription.subscription === subscription) {
                found = true
            }
        })
        if (!found) {
            Meteor.call('registerPushSubscription', subscription,navigatorFingerPrint , (err, res) => {
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
