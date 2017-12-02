import CollaboratorAdvert from '/imports/classes/CollaboratorAdvert'


Template.publishSearchModal.helpers({
    //add you helpers here
    //liste des catégories telle qu'elle est définie dans le tableau catégoryList
    categories: function () {
        return CategoryList
    },
});

Template.publishSearchModal.events({
    //add your events here
    'click [publishBtn], submit [publishSearchModalForm]' : function (event, instance) {
        event.preventDefault()
        let title = $('#advertTitle').val()
        let content = $('#advertContent').val()
        let advert = new CollaboratorAdvert()
        publishModalData = instance.data.publishModalData
        advert.title = title
        advert.content = content
        advert.location = publishModalData.location
        advert.project_id = publishModalData.project_id
        advert.competencesCriteria = publishModalData.competences
        advert.competencesLabels = publishModalData.competencesLabels
        advert.categories = publishModalData.categories
        advert.range = publishModalData.range
        console.log(advert)

        advert.callMethod('createAdvert',
            (error, result) => {
                //si ca marche pas, on renvoie l'erreur par toast
                if (error) {
                    console.log(error)
                    Materialize.toast("une erreur s'est produite", 4000, 'red')
                } else {
                    console.log(result)
                    $('#publishSearchModal').modal('close')
                    Materialize.toast("L'annonce a été publié", 6000, 'green')
                }
            })
    }
});

Template.publishSearchModal.onCreated(function () {
    //add your statement here
});

Template.publishSearchModal.onRendered(function () {
    //add your statement here
    $('#publishSearchModal').modal()
    Meteor.setTimeout(()=>{
        Materialize.updateTextFields();
        $('#publishSearchModal').modal('open')
        Meteor.setTimeout(()=>{
            Materialize.updateTextFields();
        },50)
    },50)
    resetTooltips()
});

Template.publishSearchModal.onDestroyed(function () {

});

