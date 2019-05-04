import {check} from "meteor/check";
import Project from "../../../imports/classes/Project";
import Topic from "../../../imports/classes/Topic";
import Activity from "../../../imports/classes/Activity";
import NotifPush from "../../../imports/NotifPush";
import Comment from "../../../imports/classes/Comment";
import MapMarker from "../../../imports/classes/MapMarker";


Activity.extend({
    meteorMethods: {

        newCalendarActivity(authInfo, projectId, ActivityParmas, notifObjects) {
            check(ActivityParmas, {
                start: Date,
                end: Date,
                allDay: Boolean
            })
            check(authInfo, {memberId: String, userSignature: String})
            check(projectId, String)
            let currentProject = Project.findOne(projectId)
            check(currentProject.isMember(authInfo), true)
            let computedParams = {
                projectId: currentProject._id,
                createdBy: authInfo.memberId,
                participants: [authInfo.memberId]
            }
            ActivityParmas = {...ActivityParmas, ...computedParams}
            let newActivity = new Activity(ActivityParmas)

            return newActivity.save((err) => {
                if (!err) {
                    // check(notifObjects, [{
                    //     userId: String,
                    //     memberId: String,
                    //     hashControl: String
                    // }])
                    //
                    // topic.save()
                    // topic.notifySubscribers(notifObjects, authInfo.memberId)
                   // console.warn('todo : ENvoyer les notifs')
                } else {
                    console.log(err)
                }
            })
        },
        editCalendarActivityTime(authInfo, params) {
            check(authInfo, {memberId: String, userSignature: String})
            check(params, {
                start: Date,
                end: Date,
                allDay: Boolean
            })
            let activity = Activity.findOne(this._id)
            let currentProject = Project.findOne(activity.projectId)
            check(currentProject.isMember(authInfo), true)
            activity.start = params.start
            activity.end = params.end
            activity.allDay = params.allDay
            activity.lastEditAt = new Date()
            return activity.save()
        },
        changeColor(authInfo, color) {
            check(authInfo, {memberId: String, userSignature: String})
            check(color, Number)
            let activity = Activity.findOne(this._id)

            let currentProject = Project.findOne(activity.projectId)
            check(currentProject.isMember(authInfo), true)
            activity.color = color
            activity.lastEditAt = new Date()
            return activity.save()
        },
        editActivityTexts(authInfo, params) {
            check(authInfo, {memberId: String, userSignature: String})
            check(params, {
                symEnc_title: String,
                symEnc_detail: String
            })
            let activity = Activity.findOne(this._id)

            let currentProject = Project.findOne(activity.projectId)
            check(currentProject.isMember(authInfo), true)
            activity.symEnc_title = params.symEnc_title
            activity.symEnc_detail = params.symEnc_detail
            activity.lastEditAt = new Date()
            return activity.save()
        },
        changeRecursivity(authInfo, daysOfWeek) {
            check(authInfo, {memberId: String, userSignature: String})
            check(daysOfWeek, [Number])
            let activity = Activity.findOne(this._id)

            let currentProject = Project.findOne(activity.projectId)
            check(currentProject.isMember(authInfo), true)
            activity.daysOfWeek = daysOfWeek
            activity.lastEditAt = new Date()
            return activity.save()
        },
        togglePresence(authInfo) {
            check(authInfo, {memberId: String, userSignature: String})
            let activity = Activity.findOne(this._id)
            let currentProject = Project.findOne(activity.projectId)
            check(currentProject.isMember(authInfo), true)
            let index = activity.participants.indexOf(authInfo.memberId)
            if (index !== -1) {
                activity.participants.splice(index, 1)
            } else {
                activity.participants.push(authInfo.memberId)
                let indexInvited = activity.invitedMembers.indexOf(authInfo.memberId)
                if (indexInvited !== -1) {
                    activity.invitedMembers.splice(indexInvited, 1)
                }
            }
            return activity.save()
        },
        declineInvitation(authInfo) {
            check(authInfo, {memberId: String, userSignature: String})
            let activity = Activity.findOne(this._id)
            let currentProject = Project.findOne(activity.projectId)
            check(currentProject.isMember(authInfo), true)
            activity.invitedMembers.splice(activity.invitedMembers.indexOf(authInfo.memberId), 1)
            return activity.save()
        },
        editInvited(authInfo, membersToAdd, membersToRemove, notifObjects) {
            check(authInfo, {memberId: String, userSignature: String})
            let activity = Activity.findOne(this._id)
            let currentProject = Project.findOne(activity.projectId)
            check(currentProject.isMember(authInfo), true)
            membersToRemove.forEach(member => {
                activity.invitedMembers.splice(activity.invitedMembers.indexOf(member), 1)
            })
            activity.invitedMembers = [...activity.invitedMembers, ...membersToAdd]
            return activity.save(err => {
                if (!err) {
                    if (!err) {
                        check(notifObjects, [{
                            userId: String,
                            memberId: String,
                            hashControl: String
                        }])
                        activity.notify(notifObjects, authInfo.memberId)
                    } else {
                        console.log(err)
                    }
                }
            })
        },
        newCheckItem(authInfo) {
            check(authInfo, {memberId: String, userSignature: String})
            let activity = Activity.findOne(this._id)
            let currentProject = Project.findOne(activity.projectId)
            check(currentProject.isMember(authInfo), true)
            activity.checkList.push({label: "", checked: false})
            return activity.save()
        },
        removeCheckItem(authInfo, index) {
            check(authInfo, {memberId: String, userSignature: String})
            let activity = Activity.findOne(this._id)
            check(index, Number)
            let currentProject = Project.findOne(activity.projectId)
            check(currentProject.isMember(authInfo), true)
            activity.checkList.splice(index,1)
            return activity.save()
        },
        checkCheckItem(authInfo, index) {
            check(authInfo, {memberId: String, userSignature: String})
            let activity = Activity.findOne(this._id)
            check(index, Number)
            let currentProject = Project.findOne(activity.projectId)
            check(currentProject.isMember(authInfo), true)
            activity.checkList[index].checked = !activity.checkList[index].checked
            return activity.save()
        },
        editCheckItem(authInfo, index, value) {
            check(authInfo, {memberId: String, userSignature: String})
            let activity = Activity.findOne(this._id)
            check(index, Number)
            check(value, String)
            let currentProject = Project.findOne(activity.projectId)
            check(currentProject.isMember(authInfo), true)
            activity.checkList[index].symEnc_label =value
            return activity.save()
        },
        delete(authInfo) {
            check(authInfo, {memberId: String, userSignature: String})

            let activity = Activity.findOne(this._id)
            let currentProject = Project.findOne(activity.projectId)
            check(currentProject.isMember(authInfo), true)
            return activity.remove((err) => {
            })
        }
    }
})
