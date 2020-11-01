import {check} from "meteor/check";
import minioTools from "../../../imports/minioTools";
import Project from "../../../imports/classes/Project";
import User from "../../../imports/classes/User";
import Pad from "../../../imports/classes/Pad";


Pad.extend({
    meteorMethods: {
        /******************
         *
         * @param authInfo
         * @param PadParmas
         * @returns {void | null | undefined | *}
         */
        newPad(authInfo, spreadsheetParmas) {
            check(spreadsheetParmas, {
                projectId: String,
                symEnc_name: String,
            })
            check(authInfo, {memberId: String, userSignature: String})
            let currentProject = Project.findOne(spreadsheetParmas.projectId)
            check(currentProject.isMember(authInfo), true)
            let newPad = new Pad(spreadsheetParmas)


            newPad.createdBy = authInfo.memberId
            newPad.currentEditor ={
                memberId: authInfo.memberId,
                lastActivityAt: new Date()
            }
            return newPad.save((err) => {
                if (!err) {
                    currentProject.private.padCount++
                    currentProject.save()
                }
            })
        },
        editName(authInfo, symEnc_name) {
            check(symEnc_name, String)
            check(authInfo, {memberId: String, userSignature: String})
            let spreadsheet = Pad.findOne(this._id)
            let currentProject = Project.findOne(spreadsheet.projectId)
            check(currentProject.isAdmin(authInfo) || (currentProject.isMember(authInfo) && spreadsheet.createdBy === authInfo.memberId), true)
            spreadsheet.symEnc_name = symEnc_name
            spreadsheet.lastActivity = new Date()
            return spreadsheet.save()
        },
        delete(authInfo) {
            check(authInfo, {memberId: String, userSignature: String})
            let spreadsheet = Pad.findOne(this._id)
            let currentProject = Project.findOne(spreadsheet.projectId)
            check(currentProject.isAdmin(authInfo) || (currentProject.isMember(authInfo) && spreadsheet.createdBy === authInfo.memberId), true)
            return spreadsheet.remove()
        },
        setEditor(authInfo){
            check(authInfo, {memberId: String, userSignature: String})
            let spreadsheet = Pad.findOne(this._id)
            let currentProject = Project.findOne(spreadsheet.projectId)
            check(currentProject.isMember(authInfo) , true)
            spreadsheet.currentEditor ={
                memberId: authInfo.memberId,
                lastActivityAt: new Date()
            }
            return spreadsheet.save()
        },
        quitEdition(authInfo){
            check(authInfo, {memberId: String, userSignature: String})
            let spreadsheet = Pad.findOne(this._id)
            let currentProject = Project.findOne(spreadsheet.projectId)
            check(currentProject.isMember(authInfo) , true)
            spreadsheet.currentEditor ={}
            return spreadsheet.save()
        },
        saveDatas(authInfo, symEnc_datas){
            check(symEnc_datas , String)
            check(authInfo, {memberId: String, userSignature: String})
            let spreadsheet = Pad.findOne(this._id)
            let currentProject = Project.findOne(spreadsheet.projectId)
            check(currentProject.isMember(authInfo) , true)
            spreadsheet.lastActivity = new Date()
            spreadsheet.content.symEnc_datas = symEnc_datas
            return spreadsheet.save()
        },
        saveColumns(authInfo, symEnc_datas, columns, style){
            check(columns , String)
            check(style , String)
            check(symEnc_datas , String)
            check(authInfo, {memberId: String, userSignature: String})
            let spreadsheet = Pad.findOne(this._id)
            let currentProject = Project.findOne(spreadsheet.projectId)
            check(currentProject.isMember(authInfo) , true)
            spreadsheet.lastActivity = new Date()
            spreadsheet.content.symEnc_datas = symEnc_datas
            spreadsheet.content.style = style
            spreadsheet.content.columns = columns
            return spreadsheet.save()
        },
        saveStyles(authInfo, style){
            check(style , String)
            check(authInfo, {memberId: String, userSignature: String})
            let spreadsheet = Pad.findOne(this._id)
            let currentProject = Project.findOne(spreadsheet.projectId)
            check(currentProject.isMember(authInfo) , true)
            spreadsheet.lastActivity = new Date()
            spreadsheet.content.style = style
            return spreadsheet.save()
        }
    }
})
