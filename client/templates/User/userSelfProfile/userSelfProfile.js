Template.userSelfProfile.helpers({
    //add you helpers here
    description : function () {
        return Template.instance().description.get()
    },
    isEditingFlags : function () {
        return Template.instance().isEditingFlags.get()
    }
});

Template.userSelfProfile.events({
    //add your events here
    'click [editDescriptionBtn], focus [descriptionText]' : function (event,instance) {
        $('.tooltipped').tooltip('remove');
       let flags = instance.isEditingFlags.get();
       flags.description = true;
       instance.isEditingFlags.set(flags);
        if(event.type === 'click'){
            $('#description').focus();
        }
        Meteor.setTimeout(function(){$('.tooltipped').tooltip({delay: 50})}, 1000)

    },
    'submit [updateDescription], click [saveDescriptionBtn]' : function (event, instance) {

        let value = $('#description').val();
        Meteor.call('updateSelfProfile',
            "description",
            {description : value},
            function (error) {
            if(error){
                Materialize.toast(error.message, 6000, 'red')
            }
        })
    },
    'focusout [descriptionText]' : function (event, instance) {
        Meteor.setTimeout(function () {
            $('.tooltipped').tooltip('remove');
            let flags = instance.isEditingFlags.get();
            flags.description = false;
            instance.isEditingFlags.set(flags);
            $('.tooltipped').tooltip({delay: 50});
            Meteor.setTimeout(function(){$('.tooltipped').tooltip({delay: 50})}, 1000)
        }, 200)
    }
});

Template.userSelfProfile.onCreated(function () {
    //add your statement here
    let description = Meteor.user().profile.public.description;
this.description = new ReactiveVar("");
    this.description.set(description);
    this.isEditingFlags = new ReactiveVar({
        description : false
    })
});

Template.userSelfProfile.onRendered(function () {
    //add your statement here
    $('.tooltipped').tooltip({delay: 50});
});

Template.userSelfProfile.onDestroyed(function () {
    //add your statement here
});

