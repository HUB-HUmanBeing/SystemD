import spreadsheetController from "../../../../../lib/controllers/spreadsheetController";
import projectController from "../../../../../lib/controllers/projectController";
import Spreadsheet from "../../../../../../imports/classes/Spreadsheet";

Template.spreadsheetContent.helpers({
    //add you helpers here
    editorMemberId: function () {
        let currentSpreadsheet = Spreadsheet.findOne({_id: Template.currentData().currentSpreadsheet._id})
        if ((currentSpreadsheet.currentEditor.memberId) != Template.instance().memberId) {
            return currentSpreadsheet.currentEditor.memberId
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
    this.previousEditor = null
    this.initializeTable = () => {

            if(this.currentEditor.get().memberId != this.previousEditor || !this.spreadsheetController.table){
                this.previousEditor = this.currentEditor.get().memberId
                this.spreadsheetController.initialize(
                    FlowRouter.current().queryParams.spreadsheetId,
                    document.getElementById('spreadsheetContent'),
                    this,
                    this.currentEditor.get().memberId === this.memberId
                )
            }

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
                    Meteor.clearTimeout(this.timeout1)
                    this.timeout1 = Meteor.setTimeout(() => {
                        setCurrentUserAsEditor()
                    }, 30000)
                }
            })
        }

        let rebootEditor = () => {
            Meteor.clearTimeout(this.timeout1)
            Meteor.clearTimeout(this.timeout2)
            if (!this.currentSpreadsheet.currentEditor ||
                this.currentSpreadsheet.currentEditor == {} ||
                !this.currentSpreadsheet.currentEditor.lastActivityAt ||
                !this.currentSpreadsheet.currentEditor.memberId
            ) {
                console.log("in1", this.currentSpreadsheet.currentEditor)
                this.initializeTable()
                setCurrentUserAsEditor()
            } else {
                console.log("member<Id", this.currentSpreadsheet.currentEditor.memberId)
                if (this.currentSpreadsheet.currentEditor.memberId == this.memberId) {
                    setCurrentUserAsEditor()
                    this.initializeTable()
                } else {
                    console.log("in2")
                    Meteor.call('getServerDate', (err,res)=>{
                        if(!err){
                            this.currentSpreadsheet = Spreadsheet.findOne({_id: this.data.currentSpreadsheet._id})
                            let delay = res - this.currentSpreadsheet.currentEditor.lastActivityAt.getTime()
                            console.log(delay)
                          if(delay<0){
                              this.timeout2 = Meteor.setTimeout(() => {

                                  rebootEditor()
                              }, 20000 )
                          }


                        }
                    })

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
    Meteor.clearTimeout(this.timeout1)
    Meteor.clearTimeout(this.timeout2)
    this.spreadsheetController.destroy(document.getElementById('spreadsheetContent'))
    let currentSpreadsheet = Spreadsheet.findOne({_id: this.data.currentSpreadsheet._id})
    if(currentSpreadsheet.currentEditor.memberId == this.memberId){
        currentSpreadsheet.callMethod("quitEdition", projectController.getAuthInfo(this.currentSpreadsheet.projectId), (err, res) => {
            if(err){
                console.log(err)
            }
        })
    }


});

