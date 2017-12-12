import Project from "/imports/classes/Project";
import hubCrypto from '/client/lib/hubCrypto'

Template.newProjectModal.helpers({
    //flag pour verifier si le formulaire est pret a l'envoi
    disabled: function () {
        return Template.instance().disabled.get()
    },
    //message d'erreur si invalide
    errorMessage: function () {
        return Template.instance().errorMessage.get()
    }
});

Template.newProjectModal.events({
    /************************************
     * verification que le nom de projet est disponible
     ************************************/
    'keyup input, touchend input': function (event, instance) {
        //on recupere la valeur entrée par l'utilisateur
        let projectName = event.target.value;
        //si la longueur est bonne
        if (projectName.length >= 4 && projectName.length <= 30) {
            //on garde en memoir le timestamp du dernier keyup
            instance.lastKeyUpTime.set(event.timeStamp);
            //on attends un peu
            Meteor.setTimeout(function () {
                //si le dernier keyup est celui de l'event
                if (instance.lastKeyUpTime.get() === event.timeStamp) {
                    //on appelle la methode qui renvoie un boolen en fonction de la disponibilité du nom demandé
                    Meteor.call('isProjectExists', projectName, function (error, result) {
                        //si c'est bon en eface les message d'erreur et le disabled
                        if (result) {
                            instance.errorMessage.set("");
                            instance.disabled.set("");
                            //sinon on le remet et on revoie le message d'erreur
                        } else {
                            instance.errorMessage.set('Le projet "' + projectName + '" existe déja');
                            instance.disabled.set("disabled");
                        }
                    })
                }
            }, 350)
        } else {
            instance.errorMessage.set('Le nom du projet doit faire entre 5 et 30 caractères');
            instance.disabled.set("disabled");
        }
    },
    /******************************
     * envoi du formulaire de nouveau projet
     ***********************************/
    'submit [newProjectForm]': function (event, instance) {
        event.preventDefault();
        //on verifie que le front valide bien l'envoi
        if (instance.disabled.get() === "") {
            //on recupere le nom
            let projectName = $('#new-project-name').val();
            //on instancie la classe projet avec un nouvel element
            let newProject = new Project();
            hubCrypto.generateNewProjectBrunchOfKeys(projectName, Meteor.user().profile.asymPublicKey, (brunchOfKeys) => {
                newProject.callMethod('createProject',
                    projectName,
                    brunchOfKeys,
                    function (error, result) {
                        //on renvoie eventuellement l'erreur
                        if (error) {
                            Materialize.toast("Une erreur s'est produite", 6000, "red")
                            //si c'es bon,on toast un feedback a l'utilisateur
                        } else {
                            Materialize.toast('Le Projet " ' + projectName + ' "à bien été créé', 6000, "green");
                            //on ferme la fenetre formulaire
                            $('.new-project-modal').modal('close');
                            //pui on redirige vers la page du projet nouvellement créé
                            Router.go('adminProject', {_id: result})
                        }
                    })

            })
        }
    }

})
;

Template.newProjectModal.onCreated(function () {
    this.disabled = new ReactiveVar("disabled");
    //chek de la derniere touche pressée pour eviter la surcharge de requetes
    this.lastKeyUpTime = new ReactiveVar();
    this.errorMessage = new ReactiveVar("");
});

Template.newProjectModal.onRendered(function () {
    //initialisation des infobulles
    $('.tooltipped').tooltip({delay: 50});

});

Template.newProjectModal.onDestroyed(function () {
    //add your statement here
    $('.modal').modal('close');
});

