import {check} from "meteor/check";
import minioTools from "../../../imports/minioTools";
import Project from "../../../imports/classes/Project";
import User from "../../../imports/classes/User";


Project.extend({
    meteorMethods: {
        editCalendarLegend: function (authInfo, legends) {
            check(legends, [String])
            check(authInfo, {memberId: String, userSignature: String})
            let currentProject = Project.findOne(this._id)
            check(currentProject.isMember(authInfo), true)
            currentProject.private.calendar.symEncArr_colorLegend = legends
            return currentProject.save()
        },
        editCalendarDefaultView: function (authInfo, view) {
            check(view, String)
            check(authInfo, {memberId: String, userSignature: String})
            let currentProject = Project.findOne(this._id)
            check(currentProject.isAdmin(authInfo), true)
            currentProject.private.calendar.defaultView = view
            return currentProject.save()
        },
    }
})
