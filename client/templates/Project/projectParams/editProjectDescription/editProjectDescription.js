import hubCrypto from "../../../../lib/hubCrypto";
import projectController from "../../../../lib/controllers/projectController";

Template.editProjectDescription.helpers({
    //add you helpers here
    status : function () {
        return Template.instance().status.get()
    }
});

Template.editProjectDescription.events({
    //add your events here
    "keyup #projectDescriptionInput " : function (event, instance) {
        instance.status.set('mode_edit')
        Meteor.clearTimeout(instance.timeout)
        instance.timeout = Meteor.setTimeout(()=>{
            instance.status.set('save')
            let text= $('#projectDescriptionInput').val()
            let project = instance.data.currentProject
            project.callMethod("editDescription", projectController.getAuthInfo(project._id), text, (err, res)=>{
                if(err){
                    console.log(err)
                }else{
                    Meteor.setTimeout(()=>{
                        instance.status.set('check')
                    },1000)
                }

            })
        }, 600)

    }
});

Template.editProjectDescription.onCreated(function () {
    //add your statement here
    this.status= new ReactiveVar("mode_edit")
});

Template.editProjectDescription.onRendered(function () {
    //add your statement here

    $('#projectDescriptionInput').val(Template.currentData().currentProject.public.description)
    $('#projectDescriptionInput').trigger('autoresize');
    $('#projectDescriptionInput').characterCounter();
    Materialize.updateTextFields();
});

Template.editProjectDescription.onDestroyed(function () {
    //add your statement here
});

