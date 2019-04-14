import fs from 'fs'
import cryptoServer from "./cryptoServer";
import ProjectNotification from "./classes/ProjectNotification";

/****************************
 * objet permettant de gerer les notification internes et push simultanément
 * @type {{translateAndFormatMessage(*, *, *=): *, getSubscriptions(*=): *, i18nNotifs: {}, CheckThenNotify(*, *, *=): void, initializeWebpush(): *, notifyGlobally(*=, *=, *=, *=, *=): void, sendNotif(*=, *=): void}}
 */
const NotifPush = {
    /*******************************************
     * on stockera ici les listes de traductions récupérés afins de pas avoir a les récuperer plusieurs fois
     */
    i18nNotifs: {},
    /*****************************
     * retourne une instance de webPush prete à l'emploi
     * @returns {{supportedContentEncodings, WebPushError, encrypt, getVapidHeaders, setGCMAPIKey, setVapidDetails, sendNotification, generateRequestDetails, generateVAPIDKeys}|*}
     */
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

            let subscription = JSON.parse(pushSubscription.subscription)

            webPush
                .sendNotification(subscription, payload,{
                    headers:{"Access-Control-Allow-Headers": "x-requested-with, x-requested-by"}
                })
                .then(() => {
                    console.log('push')
                })
                .catch(err => console.error(err))
        })
    },
    /******************************
     * recupere l'objet subscription pour un utilisateur donné
     * @param userIds
     * @returns {Array}
     */
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
    /***********************
     * traduit un message dans la locale de l'utilisateur avant de le formatter pour qu'il soit envoyé en notif push
     * @param language
     * @param message
     * @param title
     * @returns {Buffer}
     */
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
    /***********************************
     * verifie que le tableau de memmbres a notifier est valide avant d'envoyer les notifs
     * @param membersToNotifyIds
     * @param notifObjects
     * @param message
     * @constructor
     */
    CheckThenNotify(membersToNotifyIds, notifObjects, message) {
        let userIds = []
        notifObjects.forEach(notifObject => {
            let index = membersToNotifyIds.indexOf(notifObject.memberId)
            if (index >= 0) {
                if (cryptoServer.fastCompare(membersToNotifyIds[index] + notifObject.userId, notifObject.hashControl)) {

                    userIds.push(notifObject.userId)
                }
            }
        })

        if (userIds.length) {

            this.sendNotif([...new Set(userIds)], message)
        }
    },
    /**********************************
     * notifie a la fois sur le site et via les notifs push
     * @param membersToNotifyIds
     * @param notifObjects
     * @param notifType
     * @param projectId
     * @param section
     */
    notifyGlobally(membersToNotifyIds, notifObjects, notifType, projectId, section, queryParams) {
        let url = "/project/" + projectId + "/" + section
        if (queryParams) {
            url += "?" + queryParams
        }
        let notif = new ProjectNotification({
            projectId: projectId,
            notifiedMembers: membersToNotifyIds,
            section: section,
            notifType: notifType,
            url: url,
        })
        notif.save()
        this.CheckThenNotify(membersToNotifyIds, notifObjects, notifType)
    }
}
export default NotifPush
