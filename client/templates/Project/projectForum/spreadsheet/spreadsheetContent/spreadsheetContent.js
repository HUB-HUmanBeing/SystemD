import spreadsheetController from "../../../../../lib/controllers/spreadsheetController";
import projectController from "../../../../../lib/controllers/projectController";
import Spreadsheet from "../../../../../../imports/classes/Spreadsheet";

Template.spreadsheetContent.helpers({
    //add you helpers here
    editorMemberId: function () {
        let editorMemberId = Template.instance().currentEditor.get().memberId
        if ((editorMemberId) != Template.instance().memberId) {
            return editorMemberId
        }
    }
});

Template.spreadsheetContent.events({
    //add your events here
});

Template.spreadsheetContent.onCreated(function () {
    //add your statement here
    this.currentEditor = new ReactiveVar({})
    this.spreadsheetController = spreadsheetController
    this.memberId = projectController.getCurrentMemberId(FlowRouter.current().params.projectId)
    this.timeout1
    this.timeout2
this.initializeTable = ()=>{
    this.spreadsheetController.initialize(
        FlowRouter.current().queryParams.spreadsheetId,
        document.getElementById('spreadsheetContent'),
        this,
        this.currentEditor.get.memberId === this.memberId
    )
}
    this.currentSpreadsheet = Spreadsheet.findOne({_id: this.data.currentSpreadsheet._id})
    if (this.currentSpreadsheet) {
        this.currentEditor.set(this.currentSpreadsheet.currentEditor)
        let setCurrentUserAsEditor = () => {
            this.currentSpreadsheet.callMethod("setEditor", projectController.getAuthInfo(this.currentSpreadsheet.projectId), (err, res) => {
                if (err) {
                    Materialize.toast(__('general.error'), 6000, 'toastError')
                    console.log(err)
                } else {
                    console.log("dedans")
                }
            })
        }

        let rebootEditor = () => {
            Meteor.clearTimeout(this.timeout1)
            Meteor.clearTimeout(this.timeout2)
            if (!this.currentSpreadsheet.currentEditor ||this.currentSpreadsheet.currentEditor == {} || !this.currentSpreadsheet.currentEditor.lastActivityAt) {
                console.log("in1",this.currentSpreadsheet.currentEditor)
                setCurrentUserAsEditor()
                this.timeout1 = Meteor.setTimeout(() => {
                    rebootEditor()
                }, 5000)
            } else {
                console.log("member<Id", this.currentSpreadsheet.currentEditor.memberId)
                if (this.currentSpreadsheet.currentEditor.memberId == this.memberId) {
                    console.log("in2")
                    this.timeout1 = Meteor.setTimeout(() => {
                        setCurrentUserAsEditor()
                    }, 5000)
                } else {
                    console.log(this.currentSpreadsheet.currentEditor)
                    console.log("in2")
                    let delay = Date.now()+6000 - this.currentSpreadsheet.currentEditor.lastActivityAt.getTime()
                    console.log(delay)
                    delay = delay < 0 ? 0 : delay
                    console.log(delay)
                    this.timeout2 = Meteor.setTimeout(() => {
                        setCurrentUserAsEditor()
                        rebootEditor()
                    }, 6000 - delay)

                }
            }
        }
        rebootEditor()
    }
});

Template.spreadsheetContent.onRendered(function () {
    //add your statement here
this.initializeTable()
});

Template.spreadsheetContent.onDestroyed(function () {
    //add your statement here
    this.spreadsheetController.destroy(document.getElementById('spreadsheetContent'))
    Meteor.clearTimeout(this.timeout1)
    Meteor.clearTimeout(this.timeout2)
});

