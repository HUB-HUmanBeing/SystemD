import User from '/imports/classes/User'
import Project from '/imports/classes/Project'
import MediumEditor from 'medium-editor'
import MediumEditorOptions from '/imports/MediumEditor/MediumEditorOptions'

Template.editDescription.helpers({
    //add you helpers here
    //reactive-var comprenant un tableau de toutes les propriétés editable et leur état dans l'interface true =>en edition; false =>pas en edition
    isEditingFlags: function () {
        return Template.instance().isEditingFlags.get()
    },
    owner: function () {
        return Template.instance().owner.get()
    },
    description: function () {
        let formatedText = "";
        if (Template.instance().owner.get() === "user") {
            formatedText = Meteor.user().profile.description;
        } else if (Template.instance().owner.get() === "project") {
          let currentProject = Project.findOne(Template.currentData().projectId)
            return currentProject.publicInfo.description
        }
    return formatedText
    }
});

Template.editDescription.events({
    //quant on clique sur le champ description
    'click [editDescriptionBtn], focus [descriptionText]': function (event, instance) {
        //on vire les petites infobulles
        $('.tooltipped').tooltip('remove');
        //on recupere le le tableau des propriétés éditées
        let flags = instance.isEditingFlags.get();
        //on passe celle qui nous interesse a true
        flags.description = true;
        //et on renvoie le tout dans la réactive var
        instance.isEditingFlags.set(flags);
        //dans le cas ou l'evenement est un click sur le bouton on met le focus dans le champ correspondant
        if (event.type === 'click') {
            $('#description').focus();
        }
        //puis on réactive les tooltips avec un petit décalage
        Meteor.setTimeout(function () {
            $('.tooltipped').tooltip({delay: 50})
        }, 1000)

    },
    //à la soumission du formulaire
    'click [saveDescriptionBtn]': function (event, instance) {
        //on récupere la valeur du champ
        let value = $('#description').html();
        value = Textarea.formatBeforeSave(value)
        //on verifie que la valeur as bien changé par rapport a la valeur existante
        if (value !== instance.initialText) {
            //on instancie et hydrate l'objet User
            if (instance.owner.get() === "user") {
              const currentUser = User.findOne(Meteor.userId())
                currentUser.callMethod(
                    'updateProfileItem',
                    "description",
                    value,
                    (error, result) => {
                        //si ca marche pas, on renvoie l'erreur par toast
                        if (error) {
                            Materialize.toast("une erreur s'est produite", 4000, 'red')
                        } else {
                            //on nettoie la div de son contenu
                            $('#description').html("");
                            instance.initialText = value
                            //on attends que tout soit chargé
                            Meteor.setTimeout(function () {
                                //on utilise la fonction pour déformatter le texte
                                // stoké en base et remplacer les blises "gentilles" par du vrai html
                                Textarea.unformatBySelector('.formattedText')
                                //et on reset le medium editor
                                editor = new MediumEditor('.editable', MediumEditorOptions)
                            }, 50)

                            Materialize.toast("la description à été mise à jour", 6000, 'green')
                        }
                    })
            } else if (instance.owner.get() === "project") {
                let currentProject = Project.findOne(instance.data.projectId);
                //puis on lui applique la methode

                currentProject.callMethod(
                    'updateInfoItem',
                    "description",
                    value,
                    (error, result) => {
                        //si ca marche pas, on renvoie l'erreur par toast
                        if (error) {
                            Materialize.toast("une erreur s'est produite", 4000, 'red')
                        } else {
                            $('#description').html("");
                            instance.initialText = value
                            //on attend un peu que le dom soit chargé
                            Meteor.setTimeout(function () {
                                //on utilise la fonction pour déformatter le texte stoké en base et remplacer les blises "gentilles" par du vrai html
                                Textarea.unformatBySelector('.formattedText')
                                editor = new MediumEditor('.editable', MediumEditorOptions)
                            }, 30)

                            Materialize.toast("la description à été mise à jour", 6000, 'green')
                        }
                    })
            }
        }
    },
    //quant on sort du champs
    'focusout [descriptionText]': function (event, instance) {
        //on laisse un petit temps
        Meteor.setTimeout(function () {
            //on enleve les infobulles
            $('.tooltipped').tooltip('remove');
            //on recupere puis modifie puis repush le tableau des editingflags
            let flags = instance.isEditingFlags.get();
            flags.description = false;
            instance.isEditingFlags.set(flags);
            //puis on reactive les infobulles apres un delai
            Meteor.setTimeout(function () {
                $('.tooltipped').tooltip({delay: 50})
            }, 500)
        }, 200)
    }
});


Template.editDescription.onCreated(function () {
    //add your statement here
  if (Template.currentData().owner === 'user') {
        let currentUser = Meteor.user()
        this.initialText = currentUser.profile.description
  } else if (Template.currentData().owner === 'project') {
    let currentProject = Project.findOne(Template.currentData().projectId)
        this.initialText = currentProject.publicInfo.description
    }

    //on initialise le tableau des flags
    this.isEditingFlags = new ReactiveVar({
        description: false
    });
  this.owner = new ReactiveVar(Template.currentData().owner)
});

Template.editDescription.onRendered(function () {
    //add your statement here
    //au rendu on active les infobulles
    $('.tooltipped').tooltip({delay: 50});
    //on utilise la fonction pour déformatter le texte stoké en base et remplacer les blises "gentilles" par du vrai html
    Textarea.unformatBySelector('.formattedText')
    this.editor = new MediumEditor('.editable', MediumEditorOptions)
});

Template.editDescription.onDestroyed(function () {
    this.editor.remove()
});

