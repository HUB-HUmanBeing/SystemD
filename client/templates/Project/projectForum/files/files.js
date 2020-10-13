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

        return Session.get('fullSizeFile')
    },
});

Template.files.events({
    //add your events here
    "click [seeMore]" : function (event, instance) {
        event.preventDefault()
        instance.limit.set(instance.limit.get()+5)
    },
    "click [newFolder]" : function (event, instance) {
        event.preventDefault()

    },
});

Template.files.onCreated(function () {
    //add your statement here

    let projectId= Template.currentData().currentProject._id
    this.limit = new ReactiveVar(20)

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

