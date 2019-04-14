import {check} from "meteor/check";
import Project from "../../../imports/classes/Project";
import Topic from "../../../imports/classes/Topic";
import MapMarker from "../../../imports/classes/MapMarker";
import NotifPush from "../../../imports/NotifPush";
import Comment from "../../../imports/classes/Comment";


MapMarker.extend({
    meteorMethods: {

        newIconMarker(authInfo, MapMarkerParmas) {
            check(MapMarkerParmas, {
                markerType: String,
                projectId: String,
                iconMarker: Object
            })
            check(authInfo, {memberId: String, userSignature: String})
            let currentProject = Project.findOne(MapMarkerParmas.projectId)
            check(currentProject.isMember(authInfo), true)

            let computedParams = {
                createdBy: authInfo.memberId,
            }
            MapMarkerParmas = {...MapMarkerParmas, ...computedParams}
            let newMapMarker = new MapMarker(MapMarkerParmas)
            return newMapMarker.save((err) => {
                if (!err) {
                    console.warn("todo : notifier les membres")
                    //topic.notifySubscribers(notifObjects, authInfo.memberId)
                } else {
                    console.log(err)
                }
            })
        },
        delete(authInfo) {
            check(authInfo, {memberId: String, userSignature: String})

            let MapMarker = MapMarker.findOne(this._id)
            let currentProject = Project.findOne(MapMarker.projectId)
            check(currentProject.isMember(authInfo), true)
            check(authInfo.memberId === MapMarker.createdBy, true)
            return MapMarker.removeRecursive((err) => {
                console.warn('todo: remover les comments enfants')
            })
        },
    }
})
