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
            check(ActivityParmas, Object)
            check(authInfo, {memberId: String, userSignature: String})
            check(projectId, String)
            let currentProject = Project.findOne(projectId)
            check(currentProject.isMember(authInfo), true)
            let computedParams = {
                projectId: currentProject._id,
                createdBy: authInfo.memberId,
                participants: [authInfo.memberId],
                done:false
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
        newTaskActivity(authInfo, projectId) {
            check(authInfo, {memberId: String, userSignature: String})
            check(projectId, String)
            let currentProject = Project.findOne(projectId)
            check(currentProject.isMember(authInfo), true)
            let computedParams = {
                projectId: currentProject._id,
                createdBy: authInfo.memberId,
                participants: [authInfo.memberId],
                done: false
            }
            let ActivityParmas = { ...computedParams}
            let newActivity = new Activity(ActivityParmas)
            return newActivity.save()
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
        editActivityPosition(authInfo, symEnc_coordinates){
            check(authInfo, {memberId: String, userSignature: String})
            let activity = Activity.findOne(this._id)
            let currentProject = Project.findOne(activity.projectId)
            check(currentProject.isMember(authInfo), true)
            check(symEnc_coordinates, String)
            if(symEnc_coordinates){
                activity.symEnc_coordinates = symEnc_coordinates
            }else{
                delete      activity.symEnc_coordinates
            }

            activity.lastEditAt = new Date()
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
        editCheckItems(authInfo, values) {
            check(authInfo, {memberId: String, userSignature: String})
            let activity = Activity.findOne(this._id)
            check(values, [String])
            let currentProject = Project.findOne(activity.projectId)
            check(currentProject.isMember(authInfo), true)
            values.forEach((val, i)=>{
                activity.checkList[i].symEnc_label =val
            })
            return activity.save()
        },
        changeList(authInfo, type) {
            check(authInfo, {memberId: String, userSignature: String})
            let activity = Activity.findOne(this._id)
            check(type, String)
            let currentProject = Project.findOne(activity.projectId)
            check(currentProject.isMember(authInfo), true)
            if(type=="todo"){
                delete activity.start
                delete activity.end
                activity.daysOfWeek= []
                activity.allDay=false
                activity.done= false
            }else if(type=="done"){
                delete activity.start
                delete activity.end
                activity.daysOfWeek= []
                activity.allDay=false
                activity.done= true
            }
            activity.lastEditAt= new Date()
            return activity.save()
        },
        delete(authInfo) {
            check(authInfo, {memberId: String, userSignature: String})

            let activity = Activity.findOne(this._id)
            let currentProject = Project.findOne(activity.projectId)
            check(currentProject.isMember(authInfo), true)
            return activity.remove((err) => {
            })
        },
        deleteDone(authInfo, projectId){
            check(projectId, String)
            check(authInfo, {memberId: String, userSignature: String})
            let currentProject = Project.findOne(projectId)
            check(currentProject.isAdmin(authInfo), true)
            let activities = Activity.find({projectId:projectId, done : true}).fetch()
            activities.forEach(activity=>{
                activity.remove()
            })
            return true
        },
        deleteOldsActivities(authInfo, projectId,date){
            check(projectId, String)
            check(date, Date)
            check(authInfo, {memberId: String, userSignature: String})
            let currentProject = Project.findOne(projectId)
            check(currentProject.isAdmin(authInfo), true)
            let activities = Activity.find({projectId:projectId, start : { $lte : date}}).fetch()
            activities.forEach(activity=>{
                activity.remove()
            })
            return true
        }
    }
})
