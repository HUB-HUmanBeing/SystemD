
import NotifPush from "../../imports/NotifPush";
import Project from "../../imports/classes/Project";
import Activity from "../../imports/classes/Activity";


Activity.extend({
    helpers: {
        notify(notifObjects, memberToExclude) {
            let membersToNotify = []
            let members = Project.findOne(this.projectId).private.members
            members.forEach((member, i) => {
                if (member.memberId !== memberToExclude) {
                    membersToNotify.push(member.memberId)
                }
            })


            NotifPush.notifyGlobally(membersToNotify, notifObjects, "newInvitation", this.projectId, "calendar", "side=activityDetail&activityId=" + this._id)
        },

    }
})
