import {check} from "meteor/check";
import Project from "../../../imports/classes/Project";
import User from "../../../imports/classes/User";


Project.extend({
    meteorMethods: {

        /************
         * renvoie le lien pré-signé vers un avatar projet
         * @returns {Promise<*>}
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
            userToRemove.private.projects.forEach((userProject, i) => {
                console.log(userProject.hashedAdminSignature, hashedAdminSignature)
                if (userProject.hashedAdminSignature === hashedAdminSignature) {
                    userToRemove.private.projects.splice(i, 1)
                    userProjectFound = true
                }
            })
            check(userProjectFound, true)
            currentProject.save((err) => {
                if (err) {
                    console.log(err)
                }
                userToRemove.save()
            })

        },
        promoteMember(authInfo, memberId, userId, hashedAdminSignature, asymEncParams) {
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
            let userToRemove = User.findOne(userId)
            let userProjectFound = false
            userToRemove.private.projects.forEach((userProject, i) => {
                console.log(userProject.hashedAdminSignature, hashedAdminSignature)
                if (userProject.hashedAdminSignature === hashedAdminSignature) {
                    userToRemove.private.projects[i].asymEnc_adminPassword = asymEncParams.asymEnc_adminPassword
                    userToRemove.private.projects[i].asymEnc_role = asymEncParams.asymEnc_role
                    userProjectFound = true
                }
            })
            check(userProjectFound, true)
            currentProject.save((err) => {
                if (err) {
                    console.log(err)
                }
                userToRemove.save()
            })

        },
    }
})
