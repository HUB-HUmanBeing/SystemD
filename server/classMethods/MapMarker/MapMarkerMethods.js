import {check} from "meteor/check";
import Project from "../../../imports/classes/Project";
import Topic from "../../../imports/classes/Topic";
import MapMarker from "../../../imports/classes/MapMarker";
import NotifPush from "../../../imports/NotifPush";
import Comment from "../../../imports/classes/Comment";
import MapMarkers from "../../../lib/collections/MapMarkers";


MapMarker.extend({
    meteorMethods: {

        newIconMarker(authInfo, MapMarkerParmas, notifObjects) {
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
                    check(notifObjects, [{
                        userId: String,
                        memberId: String,
                        hashControl: String
                    }])
                    newMapMarker.notify(notifObjects, authInfo.memberId)
                } else {
                    console.log(err)
                }
            })
        },
        newMarkerText(authInfo, MapMarkerParmas, notifObjects) {
            check(MapMarkerParmas, {
                markerType: String,
                projectId: String,
                markerText: Object
            })
            check(authInfo, {memberId: String, userSignature: String})
            let currentProject = Project.findOne(MapMarkerParmas.projectId)
            check(currentProject.isMember(authInfo), true)

            let computedParams = {
                createdBy: authInfo.memberId
            }

            MapMarkerParmas = {...MapMarkerParmas, ...computedParams}
            let newMapMarker = new MapMarker(MapMarkerParmas)
            return newMapMarker.save((err) => {
                if (!err) {
                    check(notifObjects, [{
                        userId: String,
                        memberId: String,
                        hashControl: String
                    }])
                    newMapMarker.notify(notifObjects, authInfo.memberId)
                } else {
                    console.log(err)
                }
            })
        },
        newPolyline(authInfo, MapMarkerParmas, notifObjects) {
            check(MapMarkerParmas, {
                markerType: String,
                projectId: String,
                polyline: Object
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
                    check(notifObjects, [{
                        userId: String,
                        memberId: String,
                        hashControl: String
                    }])
                    newMapMarker.notify(notifObjects, authInfo.memberId)
                } else {
                    console.log(err)
                }
            })
        },
        newArrow(authInfo, MapMarkerParmas, notifObjects) {
            check(MapMarkerParmas, {
                markerType: String,
                projectId: String,
                arrow: Object
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
                    check(notifObjects, [{
                        userId: String,
                        memberId: String,
                        hashControl: String
                    }])
                    newMapMarker.notify(notifObjects, authInfo.memberId)
                } else {
                    console.log(err)
                }
            })
        },
        newShape(authInfo, MapMarkerParmas, notifObjects) {
            check(MapMarkerParmas, {
                markerType: String,
                projectId: String,
                shape: Object
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
                    check(notifObjects, [{
                        userId: String,
                        memberId: String,
                        hashControl: String
                    }])
                    newMapMarker.notify(notifObjects, authInfo.memberId)
                } else {
                    console.log(err)
                }
            })
        },
        editMarkerTexts(authInfo, params) {
            check(authInfo, {memberId: String, userSignature: String})
            check(params, {
                symEnc_name: String,
                symEnc_detail: String
            })
            let mapMarker = MapMarker.findOne(this._id)

            let currentProject = Project.findOne(mapMarker.projectId)
            check(currentProject.isMember(authInfo), true)
            mapMarker[mapMarker.markerType].symEnc_name = params.symEnc_name
            mapMarker[mapMarker.markerType].symEnc_detail = params.symEnc_detail
            mapMarker.lastEditAt = new Date()
            return mapMarker.save()
        },
        changeIcon(authInfo, symEnc_icon) {
            check(authInfo, {memberId: String, userSignature: String})
            check(symEnc_icon, String)
            let mapMarker = MapMarker.findOne(this._id)

            let currentProject = Project.findOne(mapMarker.projectId)
            check(currentProject.isMember(authInfo), true)
            mapMarker[mapMarker.markerType].symEnc_icon = symEnc_icon
            mapMarker.lastEditAt = new Date()
            return mapMarker.save()
        },
        changeColor(authInfo, symEnc_color) {
            check(authInfo, {memberId: String, userSignature: String})
            check(symEnc_color, String)
            let mapMarker = MapMarker.findOne(this._id)

            let currentProject = Project.findOne(mapMarker.projectId)
            check(currentProject.isMember(authInfo), true)
            mapMarker[mapMarker.markerType].symEnc_color = symEnc_color
            mapMarker.lastEditAt = new Date()
            return mapMarker.save()
        },
        moveMarker(authInfo, symEnc_coordinates) {
            check(authInfo, {memberId: String, userSignature: String})
            check(symEnc_coordinates, String)
            let mapMarker = MapMarker.findOne(this._id)

            let currentProject = Project.findOne(mapMarker.projectId)
            check(currentProject.isMember(authInfo), true)
            mapMarker[mapMarker.markerType].symEnc_coordinates = symEnc_coordinates
            mapMarker.lastEditAt = new Date()
            return mapMarker.save()
        },
        delete(authInfo) {
            check(authInfo, {memberId: String, userSignature: String})
            let currentProject = Project.findOne(this.projectId)
            check(currentProject.isMember(authInfo), true)
            return this.remove()
        },
        updateMemberPosition(authInfo, projectId, symEnc_coordinates) {
            check(projectId, String)
            check(symEnc_coordinates, String)
            check(authInfo, {memberId: String, userSignature: String})
            let currentProject = Project.findOne(projectId)
            check(currentProject.isMember(authInfo), true)
            let previousMapMarker = MapMarker.findOne({
                projectId: projectId,
                "memberPosition.memberId": authInfo.memberId
            })
            if (previousMapMarker) {
                previousMapMarker.memberPosition.coordinates = symEnc_coordinates
                previousMapMarker.lastEditAt = new Date()
                return previousMapMarker.save()
            } else {
                let params = {
                    createdBy: authInfo.memberId,
                    projectId: projectId,
                    markerType: "memberPosition",
                    memberPosition: {
                        memberId: authInfo.memberId,
                        symEnc_coordinates: symEnc_coordinates
                    }

                }

                let newMapMarker = new MapMarker(params)
                return newMapMarker.save()
            }

        },
        deleteOldsMarkers(authInfo, projectId,date){
            check(projectId, String)
            check(date, Date)
            check(authInfo, {memberId: String, userSignature: String})
            let currentProject = Project.findOne(projectId)
            check(currentProject.isAdmin(authInfo), true)
            let markers = MapMarker.find({projectId:projectId, createdAt : { $lte : date}}).fetch()
            markers.forEach(marker=>{
                marker.remove()
            })
            return true
        }
    }
})
