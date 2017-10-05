import User from '/imports/classes/User'

Template.userSelfProfile.helpers({
    //areactivevar comprenant le message de description
    description : function () {
        return Template.instance().description.get()
    },
    //reactive-var comprenant un tableau de toutes les propriétés editable et leur état dans l'interface true =>en edition; false =>pas en edition
    isEditingFlags : function () {
        return Template.instance().isEditingFlags.get()
    }
});

Template.userSelfProfile.events({
    //quant on clique sur le champ description
    'click [editDescriptionBtn], focus [descriptionText]' : function (event,instance) {
        //on vire les petites infobulles
        $('.tooltipped').tooltip('remove');
        //on recupere le le tableau des propriétés éditées
       let flags = instance.isEditingFlags.get();
       //on passe celle qui nous interesse a true
       flags.description = true;
       //et on renvoie le tout dans la réactive var
       instance.isEditingFlags.set(flags);
       //dans le cas ou l'evenement est un click sur le bouton on met le focus dans le champ correspondant
        if(event.type === 'click'){
            $('#description').focus();
        }
        //puis on réactive les tooltips avec un petit décalage
        Meteor.setTimeout(function(){$('.tooltipped').tooltip({delay: 50})}, 1000)

    },
    //à la soumission du formulaire
    'submit [updateDescription], click [saveDescriptionBtn]' : function (event, instance) {
        //on récupere la valeur du champ
        let value = $('#description').val();
        //on instancie et hydrate l'objet User
        let currentUser = User.findOne(Meteor.userId());
        currentUser.callMethod(
            'updateDescription',
            value,
            (error, result) =>{
            //si ca marche pas, on renvoie l'erreur par toast
            if(error){
                Materialize.toast(error, 6000, 'red')
            }else {
                Materialize.toast("la description à été mise à jour", 6000, 'green')
            }
        })
    },
    //quant on sort du champs
    'focusout [descriptionText]' : function (event, instance) {
        //on laisse un petit temps
        Meteor.setTimeout(function () {
            //on enleve les infobulles
            $('.tooltipped').tooltip('remove');
            //on recupere puis modifie puis repush le tableau des editingflags
            let flags = instance.isEditingFlags.get();
            flags.description = false;
            instance.isEditingFlags.set(flags);
           //puis on reactive les infobulles apres un delai
            Meteor.setTimeout(function(){$('.tooltipped').tooltip({delay: 50})}, 500)
        }, 200)
    }
});

Template.userSelfProfile.onCreated(function () {
    //on recupere les valeurs des champs qu'on passe dans les reactivevar
    let description = Meteor.user().profile.description;
this.description = new ReactiveVar("");
    this.description.set(description);
    //on initialise le tableau des flags
    this.isEditingFlags = new ReactiveVar({
        description : false
    })
});

//
Template.userSelfProfile.onRendered(function () {
    //au rendu on active les infobulles
    $('.tooltipped').tooltip({delay: 50});
    $('#description').trigger('autoresize');
});

Template.userSelfProfile.onDestroyed(function () {
    //add your statement here
});

