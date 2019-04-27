import {check} from "meteor/check";
import NotifPush from "../../imports/NotifPush";
import MapMarker from "../../imports/classes/MapMarker";
import Project from "../../imports/classes/Project";


MapMarker.extend({
    helpers: {
        notify(notifObjects, memberToExclude) {
            let membersToNotify = []
            let members = Project.findOne(this.projectId).private.members
            members.forEach((member, i) => {
                if (member.memberId !== memberToExclude) {
                    membersToNotify.push(member.memberId)
                }
            })


            NotifPush.notifyGlobally(membersToNotify, notifObjects, "newMapMarker", this.projectId, "maps", "side=markerDetail&markerId=" + this._id)
        },

    }
})
