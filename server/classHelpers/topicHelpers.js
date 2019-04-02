import {check} from "meteor/check";
import Topic from "/imports/classes/Topic";
import NotifPush from "../../imports/NotifPush";


Topic.extend({
    helpers: {
        /****************
         * add the member to the list of the members to notify
         * @param memberId
         */
        seenByAdd(memberId) {
            if (this.seenBy.indexOf(memberId) === -1) {
                this.seenBy.push(memberId)
            }
        },
        notifySubscribers(notifObjects,memberToExclude){
            let membersToNotify = this.membersToNotify
            membersToNotify.forEach((memberId,i)=> {
                if(memberId=memberToExclude){
                    membersToNotify.splice(i,1)
                }
            })


            NotifPush.notifyGlobally(membersToNotify, notifObjects, "newPublication",this.projectId,"forum", "categoryId="+this.categoryId+"&topicId="+this._id)
        }
    }
})
