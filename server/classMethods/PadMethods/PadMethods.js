import {check} from "meteor/check";
import Project from "../../../imports/classes/Project";
import Pad from "../../../imports/classes/Pad";


Pad.extend({
    meteorMethods: {
        /******************
         *
         * @param authInfo
         * @param PadParmas
         * @returns {void | null | undefined | *}
         */
        newPad(authInfo, padParmas) {
            check(padParmas, {
                projectId: String,
                symEnc_name: String,
                categoryId: String,
            })
            check(authInfo, {memberId: String, userSignature: String})
            let currentProject = Project.findOne(padParmas.projectId)
            check(currentProject.isMember(authInfo), true)
            let newPad = new Pad(padParmas)


            newPad.createdBy = authInfo.memberId
            newPad.currentEditor = {
                memberId: authInfo.memberId,
                lastActivityAt: new Date()
            }
            return newPad.save((err) => {
                if (!err) {
                   if(newPad.categoryId){
                       currentProject.private.forumCategories[newPad.categoryId].topicCount++
                   }else{
                       currentProject.private.padCount++
                   }
                    currentProject.save()
                }
            })
        },
        editName(authInfo, symEnc_name) {
            check(symEnc_name, String)
            check(authInfo, {memberId: String, userSignature: String})
            let pad = Pad.findOne(this._id)
            let currentProject = Project.findOne(pad.projectId)
            check(currentProject.isAdmin(authInfo) || (currentProject.isMember(authInfo) && pad.createdBy === authInfo.memberId), true)
            pad.symEnc_name = symEnc_name
            pad.lastActivity = new Date()
            return pad.save()
        },
        changeCategory(authInfo, categoryId) {
            check(categoryId, String)
            check(authInfo, {memberId: String, userSignature: String})
            let currentProject = Project.findOne(this.projectId)
            check(currentProject.isAdmin(authInfo) || (currentProject.isMember(authInfo) && this.memberId === authInfo.createdBy), true)
            this.categoryId = categoryId
            this.lastActivity = new Date()
            return this.save()
        },
        delete(authInfo) {
            check(authInfo, {memberId: String, userSignature: String})
            let pad = Pad.findOne(this._id)
            let categoryId = pad.categoryId
            let currentProject = Project.findOne(pad.projectId)
            check(currentProject.isAdmin(authInfo) || (currentProject.isMember(authInfo) && pad.createdBy === authInfo.memberId), true)
            return pad.remove((err) => {
                if (!err) {
                    if(categoryId){
                        currentProject.private.forumCategories[categoryId].topicCount--
                    }else{
                        currentProject.private.padCount--
                    }
                    currentProject.save()
                }
            })
        },
        getContent(authInfo) {
            check(authInfo, {memberId: String, userSignature: String})
            let pad = Pad.findOne(this._id)
            let currentProject = Project.findOne(pad.projectId)
            check((currentProject.isMember(authInfo)), true)
            return pad.symEnc_content
        },
        saveCursor(authInfo, range) {
            check(authInfo, {memberId: String, userSignature: String})
            check(range, String)

            let pad = Pad.findOne(this._id)
            let currentProject = Project.findOne(pad.projectId)
            check(currentProject.isMember(authInfo), true)
            let newCursor = {
                range: range,
                updatedAt: new Date(),
                memberId: authInfo.memberId
            }
            let cursorFound = false
            pad.cursors.forEach((cursor, i) => {
                if (cursor.memberId == newCursor.memberId) {
                    pad.cursors[i] = newCursor
                    cursorFound = true
                }
            })
            if (!cursorFound) {
                pad.cursors.push(newCursor)
            }
            return pad.save()
        },
        quitEdition(authInfo) {
            check(authInfo, {memberId: String, userSignature: String})
            let pad = Pad.findOne(this._id)
            let currentProject = Project.findOne(pad.projectId)
            check(currentProject.isMember(authInfo), true)
            let newCursors = pad.cursors
            pad.cursors.forEach((cursor, i) => {
                if (cursor.memberId == authInfo.memberId) {
                    newCursors = pad.cursors.splice(i, 1)
                }
            })
            pad.cursors = newCursors
            return pad.save()
        },
        saveChanges(authInfo,  symEnc_change, range) {
            check(symEnc_change, String)
            check(range, String)
            check(authInfo, {memberId: String, userSignature: String})
            let pad = Pad.findOne(this._id)
            let currentProject = Project.findOne(pad.projectId)
            check(currentProject.isMember(authInfo), true)
            pad.lastActivity = new Date()
            let change = {
                symEnc_change: symEnc_change,
                createdAt: new Date(),
                createdBy: authInfo.memberId
            }
            let newCursor = {
                range: range,
                updatedAt: new Date(),
                memberId: authInfo.memberId
            }
            let cursorFound = false
            pad.cursors.forEach((cursor, i) => {
                if (cursor.memberId == newCursor.memberId) {
                    pad.cursors[i] = newCursor
                    cursorFound = true
                }
            })
            if (!cursorFound) {
                pad.cursors.push(newCursor)
            }
            pad.changes.push(change)
            if (pad.changes.length > 10) {
                pad.changes.splice(0, 1)
            }
            return pad.save()
        },
        saveDatas(authInfo, symEnc_content) {
            check(symEnc_content, String)
            check(authInfo, {memberId: String, userSignature: String})
            let pad = Pad.findOne(this._id)
            let currentProject = Project.findOne(pad.projectId)
            check(currentProject.isMember(authInfo), true)
            pad.lastActivity = new Date()
            pad.symEnc_content = symEnc_content
            return pad.save()
        },
        async getPdfBlob(html) {
            check(html, String)
            const html_to_pdf = require('html-pdf-node');

            let options = {
                format: 'A4', margin: {
                    top: 70,
                    right: 50,
                    bottom: 70,
                    left: 50,
                }
            };
            let file = {content: html};
            let pdf = await html_to_pdf.generatePdf(file, options)
            return pdf
        },
        async getDocxBlob(html) {
            check(html, String)
            const HTMLtoDOCX = require('html-to-docx');
            let docx = await HTMLtoDOCX(`<!DOCTYPE html>
<html lang="fr">
    <head>
        <meta charset="UTF-8" />
        <title>Document</title>
    </head>
    <body>` + html + `</body>
</html>`, null, {})
            return docx
        }
    }
})
