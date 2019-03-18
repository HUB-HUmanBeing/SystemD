import Project from "../../../imports/classes/Project";
import {check} from "meteor/check";
import ProjectNotification from "../../../imports/classes/ProjectNotification";

ProjectNotification.extend({
    meteorMethods: {
        deleteNotif(authInfo) {
            let notification = ProjectNotification.findOne(this._id)
            check(Meteor.userId(), String)
            check(authInfo, {memberId: String, userSignature: String})
            let currentProject = Project.findOne(notification.projectId)
            check(currentProject.isMember(authInfo), true)
            let found = false
            notification.notifiedMembers.forEach((memberId, i) => {
                if (memberId === authInfo.memberId) {
                    notification.notifiedMembers.splice(i, 1)
                    found = true
                }
            })
            check(found, true)
            if (notification.notifiedMembers.length) {
                return notification.save()
            } else {
                return notification.remove()
            }


        }
    }
})
