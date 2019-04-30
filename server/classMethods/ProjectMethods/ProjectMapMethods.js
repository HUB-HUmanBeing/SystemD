import {check} from "meteor/check";
import minioTools from "../../../imports/minioTools";
import Project from "../../../imports/classes/Project";
import User from "../../../imports/classes/User";


Project.extend({
    meteorMethods: {
        editMapProvider: function (authInfo,symEnc_mapProvider ) {
          check(symEnc_mapProvider, String)
            check(authInfo, {memberId: String, userSignature: String})
            let currentProject = Project.findOne(this._id)
            check(currentProject.isMember(authInfo), true)
            currentProject.private.map.symEnc_mapProvider = symEnc_mapProvider
            return currentProject.save()
        },
        editDefaultCenter: function (authInfo,centeringParams ) {
            check(centeringParams, {
                symEnc_center: String,
                zoomLevel: Number
            })
            check(authInfo, {memberId: String, userSignature: String})
            let currentProject = Project.findOne(this._id)
            check(currentProject.isMember(authInfo), true)
            currentProject.private.map.symEnc_center = centeringParams.symEnc_center
            currentProject.private.map.zoomLevel = centeringParams.zoomLevel
            return currentProject.save()
        },
        editMapLegend: function (authInfo, legends) {
            check(legends, [String])
            check(authInfo, {memberId: String, userSignature: String})
            let currentProject = Project.findOne(this._id)
            check(currentProject.isMember(authInfo), true)
            currentProject.private.map.symEncArr_colorLegend = legends
            return currentProject.save()
        },
    }
})
