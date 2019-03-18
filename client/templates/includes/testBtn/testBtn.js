import notificationController from "../../../lib/controllers/notificationController";

Template.testBtn.helpers({
    //add you helpers here
});

Template.testBtn.events({
    //add your events here
    'click [testBtn]':function(e) {
        e.preventDefault()
        Meteor.call('test',FlowRouter.current().params.projectId, notificationController.getNotifyAdmins(),(err, res)=>{
            if(err){
                console.log(err)
            }else{
                console.log(res)
            }

        })
    }
});

Template.testBtn.onCreated(function () {
    //add your statement here
});

Template.testBtn.onRendered(function () {
    //add your statement here
});

Template.testBtn.onDestroyed(function () {
    //add your statement here
});

