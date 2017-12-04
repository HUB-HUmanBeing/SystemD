import CollaboratorAdvert from '/imports/classes/CollaboratorAdvert'


Template.publishSearchModal.helpers({
    //liste des catégories telle qu'elle est définie dans le tableau catégoryList
    categories: function () {
        return CategoryList
    },
});

Template.publishSearchModal.events({
    //Au click sur publier
    'click [publishBtn], submit [publishSearchModalForm]' : function (event, instance) {
        event.preventDefault()
        //on vient récuperer le titre et le contenu rentré par l'utilisateur
        let title = $('#advertTitle').val()
        let content = $('#advertContent').val()
        //on crée une nouvelle annonce
        let advert = new CollaboratorAdvert()
        //on recupere les données de l'annonces transmise par le template parent
        publishModalData = instance.data.publishModalData
        //on remplit l'annonce avec toutes ces données
        advert.title = title
        advert.content = content
        advert.location = publishModalData.location
        advert.project_id = publishModalData.project_id
        //on reformate un peu l'objet competences avant le le faire rentrer en base
        if(publishModalData.competences){
            publishModalData.competences.forEach((competences)=>{
                advert.competencesCriteria.push({competences : competences})
            })
        }
        advert.competencesLabels = publishModalData.competencesLabels
        advert.categories = publishModalData.categories
        advert.range = publishModalData.range
        //et on appele la methode de création
        advert.callMethod('createAdvert',
            (error, result) => {
                //si ca marche pas, on renvoie l'erreur par toast
                if (error) {
                    console.log(error)
                    Materialize.toast("une erreur s'est produite", 4000, 'red')
                } else {
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
    //opérations d'initialisation de la modale et du formulaire
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

