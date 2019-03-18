import {check} from "meteor/check";
import axios from 'axios'
import * as github from "octonode/lib/octonode";
import svgCaptcha from 'svg-captcha'
import cryptoServer from "../../imports/cryptoServer";
import User from "../../imports/classes/User";
import NotifPush from "../../imports/NotifPush";
import Project from "../../imports/classes/Project";
import ProjectNotification from "../../imports/classes/ProjectNotification";

Meteor.methods({
    getServerDate() {
        return new Date()
    },
    getCaptcha() {
        let captcha = svgCaptcha.create({
            size: 4, // size of random string
            ignoreChars: '0o1ilIOjJL', // filter out some characters like 0o1i
            noise: 1, // number of noise lines
            color: true, // characters will have distinct colors instead of grey, true if background option is set
            background: '#1E272C',
            width: 120, // width of captcha
            height: 40,
            fontSize: 50
        });
        captcha.text = cryptoServer.fastHash(captcha.text)
        return captcha
    },
    async sendIssue(issueObj, captcha) {
        check(issueObj, {
            title: String,
            body: String
        })

        if (!Meteor.userId()) {
            check(captcha, {
                userInput: String,
                hashControl: String
            })
            check((cryptoServer.fastHash(captcha.userInput) === captcha.hashControl), true)
        }
        let client = github.client(Meteor.settings.githubToken);
        let ghrepo = client.repo('HUB-HUmanBeing/SystemD');
        let callWithPromise = new Promise((resolve, reject) => {
            ghrepo.issue(issueObj, (err, res) => {
                if (err) {
                    console.log(err)
                } else {
                    resolve(res.html_url)
                }
            });
        })

        return await callWithPromise
    },
    registerPushSubscription(subscription, navigatorFingerPrint) {
        check(Meteor.userId(), String)
        let user = User.findOne(Meteor.userId())
        check(subscription, String)
        check(navigatorFingerPrint, String)
        let found = false
        user.private.pushSubscriptions.forEach((pushSubscription, i) => {
            if (pushSubscription.navigatorFingerPrint === navigatorFingerPrint
                || pushSubscription.subscription === subscription) {
                if (!found) {
                    user.private.pushSubscriptions[i] = {
                        navigatorFingerPrint: navigatorFingerPrint,
                        subscription: subscription
                    }
                    found = true
                } else {
                    user.private.pushSubscriptions.splice(i, 1)
                }

            }
        })
        if (!found)
            user.private.pushSubscriptions.push({
                navigatorFingerPrint: navigatorFingerPrint,
                subscription: subscription
            })
        return user.save()
    },
    deleteAllNotifications(authInfo, projectId, section) {
        check(projectId, String)
        check(section, String)
        check(Meteor.userId(), String)
        check(authInfo, {memberId: String, userSignature: String})
        let currentProject = Project.findOne(projectId)
        check(currentProject.isMember(authInfo), true)
        let arrayOfConditions = [
            {projectId: projectId},
            {
                notifiedMembers: {
                    "$elemMatch":
                        {"$eq": authInfo.memberId}
                }
            }
        ]
        if (section !== "all") {
            arrayOfConditions.push({section: section})
        }
        let notifications = ProjectNotification.find({
            "$and": arrayOfConditions
        }).fetch()
        notifications.forEach(notification => {
            notification.notifiedMembers.forEach((memberId, i) => {
                if (memberId === authInfo.memberId) {
                    notification.notifiedMembers.splice(i, 1)
                }
            })
            if (notification.notifiedMembers.length) {
                notification.save()
            } else {
                notification.remove()
            }
        })
    }
})
if(Meteor.isDevelopment){
    Meteor.methods({
        test(projectId, notifObjects) {
            let membersToNotifyIds = []
            //console.log(notifObjects)
            Project.findOne(projectId).private.members.forEach(member=>{
                membersToNotifyIds.push(member.memberId)
            })
            NotifPush.CheckThenNotify(membersToNotifyIds, notifObjects, "acceptedInvitation")
            return
        },
    })
}
