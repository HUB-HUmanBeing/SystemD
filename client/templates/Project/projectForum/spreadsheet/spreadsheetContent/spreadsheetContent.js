import spreadsheetController from "../../../../../lib/controllers/spreadsheetController";
import projectController from "../../../../../lib/controllers/projectController";
import Spreadsheet from "../../../../../../imports/classes/Spreadsheet";
import Spreadsheets from "../../../../../../lib/collections/Spreadsheets";

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
    this.currentSpreadsheet = Spreadsheet.findOne({_id: this.data.currentSpreadsheet._id})
    if (this.currentSpreadsheet) {
        this.currentEditor.set(this.currentSpreadsheet.currentEditor)
        let setCurrentUserAsEditor = (cb) => {
            this.currentSpreadsheet.callMethod("setEditor", projectController.getAuthInfo(this.currentSpreadsheet.projectId), (err, res) => {
                if (err) {
                    Materialize.toast(__('general.error'), 6000, 'toastError')
                    console.log(err)
                } else {
                    this.currentEditor.set(Spreadsheet.findOne({_id: this.data.currentSpreadsheet._id}).currentEditor)
                    Meteor.clearTimeout(this.timeout1)
                    if(cb){
                        Meteor.setTimeout(() => {cb()
                        }, 500)
                    }
                    this.timeout1 = Meteor.setTimeout(() => {
                        setCurrentUserAsEditor()
                    }, 15000)
                }
            })
        }
        this.rebootEditor = () => {
            Meteor.clearTimeout(this.timeout1)
            Meteor.clearTimeout(this.timeout2)
            if (!this.currentSpreadsheet.currentEditor ||
                this.currentSpreadsheet.currentEditor == {} ||
                !this.currentSpreadsheet.currentEditor.lastActivityAt ||
                !this.currentSpreadsheet.currentEditor.memberId
            ) {
                this.initializeTable()
                setCurrentUserAsEditor()
            } else {
                if (this.currentSpreadsheet.currentEditor.memberId == this.memberId) {
                    setCurrentUserAsEditor()

                    this.initializeTable()
                } else {
                    Meteor.call('getServerDate', (err,res)=>{
                        if(!err){
                            this.currentSpreadsheet = Spreadsheet.findOne({_id: this.data.currentSpreadsheet._id})
                            if(this.currentSpreadsheet){
                                if(!this.currentSpreadsheet.currentEditor.lastActivityAt || res.getTime() - this.currentSpreadsheet.currentEditor.lastActivityAt.getTime()>20000){
                                    setCurrentUserAsEditor(()=>{

                                        this.initializeTable()
                                    })
                                }else{  this.initializeTable()
                                    this.timeout2 = Meteor.setTimeout(() => {

                                        this.rebootEditor()
                                    }, 20000 )
                                }
                            }

                        }else{
                            console.log(err)
                        }
                    })
                }
            }
        }

        this.initializeTable = () => {
            let currentSpreadsheet = Spreadsheet.findOne({_id: this.data.currentSpreadsheet._id})
            if(currentSpreadsheet.currentEditor.memberId ||currentSpreadsheet.currentEditor.memberId != this.previousEditor || !this.table){
                this.previousEditor = currentSpreadsheet.currentEditor.memberId
                this.spreadsheetController.reset(document.getElementById('spreadsheetContent'))
                this.spreadsheetController.initialize(
                    FlowRouter.current().queryParams.spreadsheetId,
                    document.getElementById('spreadsheetContent'),
                    this,
                    !currentSpreadsheet.currentEditor.memberId ||currentSpreadsheet.currentEditor.memberId === this.memberId
                )
                this.table = this.spreadsheetController.table
            }
        }

    }
});

Template.spreadsheetContent.onRendered(function () {
    //add your statement here
    this.rebootEditor()
});

Template.spreadsheetContent.onDestroyed(function () {
    //add your statement here
    Meteor.clearTimeout(this.timeout1)
    Meteor.clearTimeout(this.timeout2)
    this.spreadsheetController.destroy(document.getElementById('spreadsheetContent'), true)
    let currentSpreadsheet = Spreadsheet.findOne({_id: this.data.currentSpreadsheet._id})
    if(currentSpreadsheet.currentEditor.memberId == this.memberId){
        currentSpreadsheet.callMethod("quitEdition", projectController.getAuthInfo(this.currentSpreadsheet.projectId), (err, res) => {
            if(err){
                console.log(err)
            }
        })
    }


});

