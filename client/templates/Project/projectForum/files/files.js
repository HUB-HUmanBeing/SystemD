import projectController from "../../../../lib/controllers/projectController";
import ProjectFile from "../../../../../imports/classes/ProjectFile";

Template.files.helpers({
    //add you helpers here
    percentage: function () {
        let currentProject =  Template.currentData().currentProject
        return Math.round((currentProject.private.totalFilesSize /Meteor.settings.public.maxFilesSize)*100)
    },
    files: function () {
        return ProjectFile.find({projectId:Template.currentData().currentProject._id}).fetch()
    },
    file: function () {
        let refreshScrollbar =     Template.currentData().refreshScrollbar
        Meteor.setTimeout(()=>{

            refreshScrollbar()
        }, 500)
        return Session.get('fullSizeFile')
    },
});

Template.files.events({
    //add your events here
});

Template.files.onCreated(function () {
    //add your statement here

    let projectId= Template.currentData().currentProject._id
    this.limit = new ReactiveVar(30)

    this.autorun(()=>{
        Meteor.subscribe("projectFiles", projectController.getAuthInfo(projectId), projectId, this.limit.get() , (err)=>{
            if(err){
                console.log(err)
            }else{

            }
        })

    })
 });

Template.files.onRendered(function () {
    //add your statement here
});

Template.files.onDestroyed(function () {
    //add your statement here
});

