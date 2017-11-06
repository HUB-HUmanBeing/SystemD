import Project from '/imports/classes/Project'
import User from '/imports/classes/User';

Template.projectManagmentButton.helpers({
    //add you helpers here
    isQuitable : function () {
        return Template.instance().isQuitable.get()
    },
    isQuitableMethodDone : function () {
        return Template.instance().isQuitableMethodDone.get()
    }
});

Template.projectManagmentButton.events({
    //la requete vers le serveur pour verifier si un utilisateur peut ou non
    // quitter le projet ne se fait qu'au click sur le bouton
    'click [showQuitProjectModal]' : function (event, instance) {
        //on crée un nouveau projet pour pouvoir appeller la methode
        let project = new Project
        //on appele la methode de verification qui renvoie un booléen
        project.callMethod('canCurrentUserQuit',instance.data.project.project_id , (err, result) =>{
                //si il y a une erreur coté serveur, on averti l'utilisateur
                if (err) {
                    Materialize.toast("une erreur s'est produite", 4000, 'red')
                    $('.modal').modal('close');
                } else {
                    //si tout s'est bien passé
                    //on indique qu'on peut afficher le resultat
                    instance.isQuitableMethodDone.set(true)
                    //et on renseigne si le projet est quitable en l'etat
                    instance.isQuitable.set(result)
                }
        })
    },
    //lorsque l'utilisateur clique sur quitter le projet
    'click [QuitProject]': function (event, instance) {
        //on récupere le projet courant
        let currentUser = User.findOne({_id: Meteor.userId()})
        //on appele la methode de suppression
        currentUser.callMethod(
            'quitProject',
            instance.data.project.project_id,
            (error) => {
                //si ca marche pas, on renvoie l'erreur par toast
                if (error) {
                    Materialize.toast("une erreur s'est produite", 4000, 'red')
                } else {
                    //sinon, on toast le succes,
                    Materialize.toast('vous avez quitté le projet "' + instance.data.project.name + '"', 6000, 'green')
                    //on ferme la modal
                    $('.modal').modal('close');
                    Router.go("userSelfProjects")
                }
            })
    }
});

Template.projectManagmentButton.onCreated(function () {
    this.isQuitableMethodDone = new ReactiveVar(false)
    this.isQuitable = new ReactiveVar(false)
});

Template.projectManagmentButton.onRendered(function () {
    //add your statement here
    //add your statement here
    $('.modal').modal();
    $('.collapsible').collapsible();
});

Template.projectManagmentButton.onDestroyed(function () {
    //add your statement here
});

