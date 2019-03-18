import fs from 'fs'
import cryptoServer from "./cryptoServer";
import ProjectNotification from "./classes/ProjectNotification";

const NotifPush = {
    i18nNotifs: {},
    initializeWebpush() {
        const webPush = require("web-push")
        webPush.setVapidDetails(
            "mailto:" + Meteor.settings.webpushMail,
            Meteor.settings.public.publicVapidKey,
            Meteor.settings.privateVapidKey
        );
        // if(Meteor.settings.GcmApiKey && Meteor.isProduction){
            webPush.setGCMAPIKey(Meteor.settings.GcmApiKey);
        //}


        return webPush
    },
    sendNotif(userIds, message) {
        const webPush = this.initializeWebpush()

        this.getSubscriptions(userIds).forEach((pushSubscription) => {
            let payload = this.translateAndFormatMessage(pushSubscription.language, message)

            webPush
                .sendNotification(JSON.parse(pushSubscription.subscription), payload)
                .then(()=>{
                    console.log('push')
                })
                .catch(err => console.error(err))
        })
    },
    getSubscriptions(userIds) {
        let pushSubscriptions = []
        let usersToNotify = Meteor.users.find({_id: {"$in": userIds}}, {
            fields: {
                "public.language": 1,
                "private.pushSubscriptions": 1
            }
        })
        usersToNotify.fetch().forEach(user => {
            user.private.pushSubscriptions.forEach(sub => {
                pushSubscriptions.push({subscription: sub.subscription, language: user.public.language})
            })

        })
        return pushSubscriptions
    },
    translateAndFormatMessage(language, message, title) {
        if (!(language in this.i18nNotifs)) {
            this.i18nNotifs[language] = JSON.parse(fs.readFileSync(Meteor.absolutePath + '/i18n/' + language.split('-')[0] + '.i18n.json')).notifItem;
        }
        let translatedMessage = this.i18nNotifs[language][message]
        let translatedTitle
        if (title) {
            translatedTitle = this.i18nNotifs[language][title]
        } else {
            translatedTitle = this.i18nNotifs[language]["genericTitle"]
        }
        let translatedAction = this.i18nNotifs[language]["genericAction"]
        return new Buffer(JSON.stringify({
            title: translatedTitle,
            body: translatedMessage,
            action: translatedAction
        }))
    },
    CheckThenNotify(membersToNotifyIds, notifObjects, message){
        let userIds = []
        notifObjects.forEach(notifObject=>{
            let index=membersToNotifyIds.indexOf(notifObject.memberId)
            if(index>=0){
                if(cryptoServer.fastCompare(membersToNotifyIds[index]+notifObject.userId, notifObject.hashControl)){
                    userIds.push(notifObject.userId)
                }
            }
        })

        if(userIds.length){
            this.sendNotif([...new Set(userIds)], message)
        }

    },
    notifyGlobally(membersToNotifyIds, notifObjects, notifType,projectId,section){
        let notif = new ProjectNotification({
            projectId: projectId,
            notifiedMembers: membersToNotifyIds,
            section: section,
            notifType: notifType,
            url: "/project/" + projectId + "/"+ section,
        })
        notif.save()
        this.CheckThenNotify(membersToNotifyIds, notifObjects, notifType)
    }
}
export default NotifPush
