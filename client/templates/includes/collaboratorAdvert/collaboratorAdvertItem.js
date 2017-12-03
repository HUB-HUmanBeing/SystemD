import CollaboratorAdvert from "/imports/classes/CollaboratorAdvert"

Template.collaboratorAdvertItem.helpers({
    //add you helpers here
});

Template.collaboratorAdvertItem.events({
    'click [deleteAdvert]' : function (event,instance) {

        let advert = CollaboratorAdvert.findOne({_id : instance.data.advert._id})
        advert.callMethod('removeAdvert',
            (error) => {
            //si ca marche pas, on renvoie l'erreur par toast
            if (error) {
                console.log(error)
                Materialize.toast("une erreur s'est produite", 4000, 'red')
            } else {
                Materialize.toast("L'annonce a été retirée",3000, 'orange')
                resetTooltips()
            }


        })
    }
});

Template.collaboratorAdvertItem.onCreated(function () {

});

Template.collaboratorAdvertItem.onRendered(function () {
    //add your statement here
    resetTooltips()
});

Template.collaboratorAdvertItem.onDestroyed(function () {
    //add your statement here
});

