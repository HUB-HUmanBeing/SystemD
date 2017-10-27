import User from '/imports/classes/User'

Template.userInvitation.helpers({
    //add you helpers here
    date : function () {
        return Template.instance().data.sendAt.toLocaleDateString()
    }
});

Template.userInvitation.events({
    //add your events here
    'submit [declineInvit]' : function (event, instance) {
        event.preventDefault()
        let declineMessage = $('#declineMessage').val()
        let curentUser = User.findOne(Meteor.userId())
        curentUser.callMethod(
            'declineInvitation',
            instance.data.project_id,
            declineMessage,
            (error ,result) =>{

        })
    }
});

Template.userInvitation.onCreated(function () {
    //add your statement here


});

Template.userInvitation.onRendered(function () {
    //add your statement here
    $('.tooltipped').tooltip({delay: 50});
    $('.modal').modal();
});

Template.userInvitation.onDestroyed(function () {
    //add your statement here
});

