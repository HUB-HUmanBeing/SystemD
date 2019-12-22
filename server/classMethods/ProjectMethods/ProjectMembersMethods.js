import {check} from "meteor/check";
import Project from "../../../imports/classes/Project";
import User from "../../../imports/classes/User";
import ProjectNotification from "../../../imports/classes/ProjectNotification";
import NotifPush from "../../../imports/NotifPush";


Project.extend({
    meteorMethods: {

        /************
         * methode de suppression d'un utilisateur des membres d'un projet
         * @param authInfo
         * @param memberId
         * @param userId
         * @param hashedAdminSignature
         */
        kickMember(authInfo, memberId, userId, hashedAdminSignature) {
            check(Meteor.userId(), String)
            check(authInfo, {memberId: String, userSignature: String})
            let currentProject = Project.findOne(this._id)
            check(currentProject.isAdmin(authInfo), true)
            currentProject.private.members.forEach((member, i) => {
                if (member.memberId === memberId) {
                    check(member.role === "admin", false)
                    currentProject.private.members.splice(i, 1)
                }
            })
            let userToRemove = User.findOne(userId)
            let userProjectFound = false
            if(userToRemove){
                userToRemove.private.projects.forEach((userProject, i) => {
                    console.log(userProject.hashedAdminSignature, hashedAdminSignature)
                    if (userProject.hashedAdminSignature === hashedAdminSignature) {
                        userToRemove.private.projects.splice(i, 1)
                        userProjectFound = true
                    }
                })
            }


            currentProject.save((err) => {
                if (err) {
                    console.log(err)
                }
                if(userToRemove) {
                    userToRemove.save()
                }
            })
        },
        /**************************
         * methode permettant de faire passer un utilisateur en admin du projet
         * @param authInfo
         * @param memberId
         * @param userId
         * @param hashedAdminSignature
         * @param asymEncParams
         * @param notifObjects
         */
        promoteMember(authInfo, memberId, userId, hashedAdminSignature, asymEncParams, notifObjects) {
            check(Meteor.userId(), String)
            check(asymEncParams, {
                asymEnc_adminPassword: String,
                asymEnc_role: String
            })
            check(authInfo, {memberId: String, userSignature: String})
            let currentProject = Project.findOne(this._id)
            check(currentProject.isAdmin(authInfo), true)

            currentProject.private.members.forEach((member, i) => {
                if (member.memberId === memberId) {
                    check(member.role === "admin", false)
                    currentProject.private.members[i].role = "admin"
                }
            })
            let userToPromote = User.findOne(userId)
            let userProjectFound = false
            userToPromote.private.projects.forEach((userProject, i) => {
                if (userProject.hashedAdminSignature === hashedAdminSignature) {
                    userToPromote.private.projects[i].asymEnc_adminPassword = asymEncParams.asymEnc_adminPassword
                    userToPromote.private.projects[i].asymEnc_role = asymEncParams.asymEnc_role
                    userProjectFound = true
                }
            })
            check(userProjectFound, true)
            check(notifObjects, [{
                userId: String,
                memberId: String,
                hashControl: String
            }])
            currentProject.save((err) => {
                if (err) {
                    console.log(err)
                }
                NotifPush.notifyGlobally([memberId], notifObjects, "memberPromoted",currentProject._id,"members")
                userToPromote.save()
            })
        },
        /**********************
         * methode pour quitter un projet
         * @param authInfo
         * @param memberId
         * @param userProjectIndex
         */
        quitProject(authInfo, memberId, hashedAdminSignature,notifObjects) {
            check(Meteor.userId(), String)
            check(authInfo, {memberId: String, userSignature: String})
            check(hashedAdminSignature, String)
            let currentProject = Project.findOne(this._id)
            check(currentProject.isMember(authInfo), true)
            check(currentProject.isThisMember(authInfo, memberId), true)
            currentProject.private.members.forEach((member, i) => {
                if (member.memberId === memberId) {
                    currentProject.private.members.splice(i, 1)
                }
            })
            let currentUser = User.findOne(Meteor.userId())
            check(notifObjects, [{
                userId: String,
                memberId: String,
                hashControl: String
            }])
            let found = false
            currentUser.private.projects.forEach((userProjet,i)=>{
                if(userProjet.hashedAdminSignature === hashedAdminSignature){
                    currentUser.private.projects.splice(i,  1)
                    found = true
                }
            })

            check(found, true)
            currentProject.save((err) => {
                if (err) {
                    console.log(err)
                }
                currentUser.save()

                NotifPush.notifyGlobally(currentProject.getAdminMemberIds(), notifObjects, "memberQuit",currentProject._id,"members")
            })

        },
    }
})
