import {check} from "meteor/check";
import minioTools from "../../../imports/minioTools";
import Project from "../../../imports/classes/Project";
import User from "../../../imports/classes/User";
import Spreadsheet from "../../../imports/classes/Spreadsheet";


Spreadsheet.extend({
    meteorMethods: {
        /******************
         *
         * @param authInfo
         * @param SpreadsheetParmas
         * @returns {void | null | undefined | *}
         */
        newSpreadsheet(authInfo, spreadsheetParmas) {
            check(spreadsheetParmas, {
                projectId: String,
                symEnc_name: String,
            })
            check(authInfo, {memberId: String, userSignature: String})
            let currentProject = Project.findOne(spreadsheetParmas.projectId)
            check(currentProject.isMember(authInfo), true)
            let newSpreadsheet = new Spreadsheet(spreadsheetParmas)


            newSpreadsheet.createdBy = authInfo.memberId
            console.log( newSpreadsheet.save())
            return newSpreadsheet.save((err) => {
                if (!err) {
                    currentProject.private.spreadsheetCount++
                    currentProject.save()
                }
            })
        },
        editName(authInfo, symEnc_name) {
            check(symEnc_name, String)
            check(authInfo, {memberId: String, userSignature: String})
            let spreadsheet = Spreadsheet.findOne(this._id)
            let currentProject = Project.findOne(spreadsheet.projectId)
            check(currentProject.isAdmin(authInfo) || (currentProject.isMember(authInfo) && spreadsheet.createdBy === authInfo.memberId), true)
            spreadsheet.symEnc_name = symEnc_name
            return spreadsheet.save()
        },
        delete(authInfo) {
            check(authInfo, {memberId: String, userSignature: String})
            let spreadsheet = Spreadsheet.findOne(this._id)
            let currentProject = Project.findOne(spreadsheet.projectId)
            check(currentProject.isAdmin(authInfo) || (currentProject.isMember(authInfo) && spreadsheet.createdBy === authInfo.memberId), true)
            return spreadsheet.remove()
        },
    }
})
