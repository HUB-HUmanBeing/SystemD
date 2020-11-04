import Quill from "quill";
import cryptoTools from "../cryptoTools";
import projectController from "./projectController";
import Pad from "../../../imports/classes/Pad";
import Pads from "../../../lib/collections/Pads";
import QuillCursors from 'quill-cursors';

let Delta = Quill.import('delta');
let padController = {
    cursorColors: [
        "#406080",
        "#995ab8",
        "#cf9365",
        "#366e3a",
        "#e9d074",
        "#8f4848",
    ],
    toolbarOptions: [
        ['bold', 'italic', 'underline', 'strike'],
        ['blockquote', 'code-block'],

        [{'header': 1}, {'header': 2}],
        [{'list': 'ordered'}, {'list': 'bullet'}],
        [{'script': 'sub'}, {'script': 'super'}],
        [{'indent': '-1'}, {'indent': '+1'}],
        [{'direction': 'rtl'}],

        [{'size': ['small', false, 'large', 'huge']}],
        [{'header': [1, 2, 3, 4, 5, 6, false]}],

        [{'color': []}, {'background': []}],
        [{'font': []}],
        [{'align': []}],

        ['clean']
    ],
    options: {
        debug: 'warn',
        modules: {
            cursors: {
                transformOnTextChange: true,
            },
            'toolbar': [
                [{'font': []}, {'size': []}],
                ['bold', 'italic', 'underline', 'strike'],
                [{'color': []}, {'background': []}],
                ['blockquote', 'code-block', 'link'],
                [{'list': 'ordered'}, {'list': 'bullet'}],
                [{align: ''}, {align: 'center'}, {align: 'right'}, {align: 'justify'}],
            ]
        },
        readonly: true,
        placeholder: 'Compose an epic...',
        theme: 'snow'
    },
    initialize(padId, instance) {
        Quill.register('modules/cursors', QuillCursors);
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
    getMemberName(memberId) {
        let requiredMember
        Session.get("currentProjectMembers").forEach((member) => {
            if (member.memberId === memberId) {
                requiredMember = member
            }
        })
        return requiredMember.symEnc_username;
    },
    startApiChangeListener(padId, instance) {

        instance.autorun(() => {
            let pad = Pads.findOne(padId)
            pad.changes.forEach(change => {
                if (change.createdBy != this.memberId && change.createdAt > this.uploadVersionDate) {
                    this.uploadVersionDate = change.createdAt
                    cryptoTools.sim_decrypt_data(change.symEnc_change, Session.get("currentProjectSimKey"), decryptedContent => {
                        let delta = new Delta(JSON.parse(decryptedContent))
                        this.editor.updateContents(delta, "silent")
                    })
                }
            })
            pad.cursors.forEach(cursor => {
                if (cursor.memberId != this.memberId &&
                    Date.now() - cursor.updatedAt < 10000) {
                    let found = false
                    this.cursors.cursors().forEach(existingCursor => {
                        if (existingCursor.id == cursor.memberId) {
                            found = true
                        }
                    })
                    if (!found) {
                        this.cursors.createCursor(
                            cursor.memberId,
                            this.getMemberName(cursor.memberId),
                            this.cursorColors[this.cursors.cursors().length % 6])
                    }
                    this.cursors.moveCursor(cursor.memberId, JSON.parse(cursor.range))
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
                        this.editor.updateContents(delta)
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
        });

// Save periodically
        Meteor.setInterval(() => {
            if (this.change.length() > 0) {
                const data = JSON.stringify(this.editor.getContents())
                localStorage.setItem('storedText', data);

                let content = this.editor.getContents()
                this.saveContent(
                    JSON.stringify(content),
                    JSON.stringify(this.change),
                    this.editor.getSelection(),
                    padId,
                    instance)
                this.change = new Delta();
            }
        },  1000 + this.lastSaveDuration);

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
            cryptoTools.sim_encrypt_data(content, Session.get("currentProjectSimKey"), (symEnc_content) => {
                this.currentPad.callMethod("saveDatas", projectController.getAuthInfo(FlowRouter.current().params.projectId), symEnc_content, symEnc_change, JSON.stringify(range), (err, res) => {
                    if (err) {
                        console.log(err)
                    }else{
                        this.lastSaveDuration = Date.now() - start
                    }
                })
            })
        })
    }
}


export default padController
