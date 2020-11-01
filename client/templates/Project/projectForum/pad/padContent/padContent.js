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

Template.padContent.events({
    //add your events here
});

Template.padContent.onCreated(function () {
    //add your statement here
    this.currentEditor = new ReactiveVar({})
    this.padController = padController
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
                this.padController.reset(document.getElementById('padContent'))
                this.padController.initialize(
                    FlowRouter.current().queryParams.padId,
                    document.getElementById('padContent'),
                    this,
                    !currentSpreadsheet.currentEditor.memberId ||currentSpreadsheet.currentEditor.memberId === this.memberId
                )
                this.table = this.padController.table
            }
        }

    }
});

Template.padContent.onRendered(function () {
    //add your statement here
    this.rebootEditor()
});

Template.padContent.onDestroyed(function () {
    //add your statement here
    Meteor.clearTimeout(this.timeout1)
    Meteor.clearTimeout(this.timeout2)
    this.padController.destroy(document.getElementById('padContent'), true)
    let currentSpreadsheet = Spreadsheet.findOne({_id: this.data.currentSpreadsheet._id})
    if(currentSpreadsheet.currentEditor.memberId == this.memberId){
        currentSpreadsheet.callMethod("quitEdition", projectController.getAuthInfo(this.currentSpreadsheet.projectId), (err, res) => {
            if(err){
                console.log(err)
            }
        })
    }


});

