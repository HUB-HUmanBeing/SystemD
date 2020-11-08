import Quill from "quill";
import cryptoTools from "../cryptoTools";
import projectController from "./projectController";
import Pad from "../../../imports/classes/Pad";
import Pads from "../../../lib/collections/Pads";
import QuillCursors from 'quill-cursors';
import MagicUrl from 'quill-magic-url';
import 'quill-paste-smart';
import {QuillDeltaToHtmlConverter} from 'quill-delta-to-html';

let Delta = Quill.import('delta');
Quill.register('modules/magicUrl', MagicUrl);
Quill.register('modules/cursors', QuillCursors);
let padController = {
    cursorColors: [
        "#406080",
        "#995ab8",
        "#cf9365",
        "#366e3a",
        "#e9d074",
        "#8f4848",
    ],
    options: {
        debug: 'warn',
        modules: {
            clipboard: {
                allowed: {
                    tags: ['a', 'b', 'strong', 'u', 's', 'i', 'p', 'br', 'ul', 'ol', 'li', 'span'],
                    attributes: ['href', 'rel', 'target', 'class']
                },
                keepSelection: true,
            },
            cursors: {
                transformOnTextChange: true,
            },
            history: {
                delay: 1000,
                maxStack: 500,
                userOnly: true
            },
            magicUrl: true,
            'toolbar': [
                [{'font': []}, {'size': []}],
                ['bold', 'italic', 'underline', 'strike'],
                [{'color': []}, {'background': []}],
                ['blockquote', 'code-block'],
                [{'list': 'ordered'}, {'list': 'bullet'}],
                [{align: ''}, {align: 'center'}, {align: 'right'}, {align: 'justify'}],
            ]
        },
        readonly: true,
        theme: 'snow'
    },
    initialize(padId, instance) {

        this.editor = new Quill('#padContent', this.options);
        this.cursors = this.editor.getModule('cursors');
        this.editor.disable()
        this.lastSaveDuration = 1000
        this.currentPad = Pad.findOne(padId)
        this.uploadVersionDate = this.currentPad.lastActivity
        this.memberId = projectController.getAuthInfo(FlowRouter.current().params.projectId).memberId
        this.getContent(() => {
            this.startAutoSave(padId, instance)
            this.startApiChangeListener(padId, instance)
            this.startCursorChangeListener(padId, instance)
            this.editor.enable()
            this.editor.focus()
        })
    },
    getMember(memberId) {
        let requiredMember
        let allMembers = Session.get("currentProjectMembers")
        allMembers.forEach((member, i) => {
            if (member.memberId === memberId) {
                requiredMember = member
                requiredMember.color = "hsla(" + Math.floor((i / allMembers.length) * 360) + ", 53%, 50%, 1)"
            }
        })
        return requiredMember
    },
    startApiChangeListener(padId, instance) {

        instance.autorun(() => {
            let pad = Pads.findOne(padId)
            pad = Pad.findOne(padId)
            pad.changes.forEach(change => {
                if (change.createdBy != this.memberId && change.createdAt > this.uploadVersionDate) {
                    this.uploadVersionDate = change.createdAt
                    cryptoTools.sim_decrypt_data(change.symEnc_change, Session.get("currentProjectSimKey"), decryptedContent => {
                        let delta = new Delta(JSON.parse(decryptedContent))
                        console.log(delta)
                        this.editor.updateContents(delta, "silent")
                    })
                }
            })

            pad.cursors.forEach(cursor => {
                if (cursor.memberId != this.memberId &&
                    Date.now() - cursor.updatedAt < 2 * 60000) {
                    let found = false
                    this.cursors.cursors().forEach(existingCursor => {
                        if (existingCursor.id == cursor.memberId) {
                            found = true
                        }
                    })
                    if (!found) {
                        let member = this.getMember(cursor.memberId)
                        this.cursors.createCursor(
                            cursor.memberId,
                            member.symEnc_username,
                            member.color)
                    }
                    Meteor.setTimeout(() => {
                        this.cursors.moveCursor(cursor.memberId, JSON.parse(cursor.range))
                        instance.cursors.set(this.cursors.cursors())
                    }, 100)
                }
            })
        })
    },
    getContent(cb) {
        this.currentPad.callMethod("getContent", projectController.getAuthInfo(FlowRouter.current().params.projectId), (err, res) => {
            if (err) {
                console.log(err)
            } else {
                if (res) {
                    cryptoTools.sim_decrypt_data(res, Session.get("currentProjectSimKey"), decryptedContent => {
                        let delta = new Delta(JSON.parse(decryptedContent))
                        this.editor.setContents(delta)
                        cb()
                    })
                } else {
                    cb()
                }
            }

        })
    },
    startAutoSave(padId, instance) {
        // Store accumulated changes
        this.change = new Delta();
        this.editor.on('text-change', (delta, oldContents, source) => {
            this.change = this.change.compose(delta);
            if (this.change.length() > 0) {
                instance.needToSave.set(true)
            }
        });

// Save periodically
        Meteor.setInterval(() => {
            if (this.change.length() > 0) {
                let content = JSON.stringify(this.editor.getContents())
                let allowed = true
                try {
                    let decrypted = cryptoTools.convertArrayBufferViewtoString(cryptoTools.convertStringToArrayBufferView(content))
                    JSON.parse(decrypted)
                } catch (e) {
                    console.log(e)
                    this.editor.history.undo();
                    Materialize.toast(__('pad.errorPaste'), 6000, 'toastError')
                    allowed = false
                    instance.needToSave.set(false)

                }
                if (allowed) {
                    this.saveContent(
                        content,
                        JSON.stringify(this.change),
                        this.editor.getSelection(),
                        padId,
                        instance)
                }
                this.change = new Delta();
            }

        }, 1000 + this.lastSaveDuration);

// Check for unsaved data
        window.onbeforeunload = function () {
            if (this.change.length() > 0) {
                return 'There are unsaved changes. Are you sure you want to leave?';
            }
        }
    },
    startCursorChangeListener(padId, instance) {
        $(".ql-editor").click(() => {
            this.currentPad.callMethod("saveCursor", projectController.getAuthInfo(FlowRouter.current().params.projectId), JSON.stringify(this.editor.getSelection()), (err, res) => {
                if (err) {
                    console.log(err)
                }
            })
        })
    },
    saveContent(content, change, range, padId, instance) {
        let start = Date.now()
        cryptoTools.sim_encrypt_data(change, Session.get("currentProjectSimKey"), (symEnc_change) => {
            this.currentPad.callMethod(
                "saveChanges",
                projectController.getAuthInfo(FlowRouter.current().params.projectId),
                symEnc_change,
                JSON.stringify(range),
                (err, res) => {
                    if (err) {
                        console.log(err)
                    } else {
                        cryptoTools.sim_encrypt_data(content, Session.get("currentProjectSimKey"), (symEnc_content) => {
                            this.currentPad.callMethod("saveDatas", projectController.getAuthInfo(FlowRouter.current().params.projectId), symEnc_content, symEnc_change, JSON.stringify(range), (err, res) => {
                                if (err) {
                                    console.log(err)
                                } else {
                                    instance.needToSave.set(false)
                                    this.lastSaveDuration = Date.now() - start

                                }
                            })
                        })
                    }
                })

        })
    },
    download(format, name, cb) {
        let deltaOps = this.editor.getContents().ops;
        let converter = new QuillDeltaToHtmlConverter(deltaOps, {inlineStyles: true});
        let html = converter.convert();
        this.currentPad.callMethod(format == "pdf" ? "getPdfBlob" : "getDocxBlob", html, (err, res) => {
            if (err) {
                Materialize.toast(__('pad.errorDownload'), 6000, 'toastError')
                console.log(err)
                cb()
            } else {
                let a = document.createElement("a");
                document.body.appendChild(a);
                a.style = "display: none";
                let blob = new Blob([res], {type: format == "pdf" ? "application/pdf" : "application/vnd.openxmlformats-officedocument.wordprocessingml.document"})
                let url = window.URL.createObjectURL(blob);
                a.href = url;
                a.download = name + (format == "pdf" ? ".pdf" : ".docx");
                a.click();
                window.URL.revokeObjectURL(url);
                cb()
            }
        })

    },
    quitEdition() {
        this.currentPad.callMethod("quitEdition", projectController.getAuthInfo(FlowRouter.current().params.projectId), (err, res) => {
            if (err) {
                console.log(err)
            }
        })
    }
}


export default padController
