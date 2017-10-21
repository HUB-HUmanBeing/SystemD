import User from '/imports/classes/User'
import Project from '/imports/classes/Project'

Template.editImage.helpers({
    //helper pour verifier si c'est une instance de type projet ou de type user
    owner: function () {
        return Template.instance().owner.get()
    },
    //lien vers l'url de l'image stockée en base
    imageUrl: function () {
        if(Template.instance().owner.get() === "user"){
            return Meteor.user().profile.imgUrl
        }else if(Template.instance().owner.get() === "project"){
            let currentProject = Project.findOne(Template.instance().data.projectId);
            return currentProject.publicInfo.imgUrl
        }

    },
    //flag a true lorsqu'on passe en mode édition
    editingImg: function () {
        return Template.instance().editingImg.get()
    },
    //contien l'url de la preview l'image édité
    urlPreview: function () {
        return Template.instance().urlPreview.get()
    }
});

Template.editImage.events({
    //add your events here
    /*****************************
     *Ouverture du formulaire d'édition
     *********************************/
    'click [editImgBtn]': function (event, instance) {
        //on vire les infobulles (pour celle du bouton d'edition)
        $('.tooltipped').tooltip('remove');
        //on passe a true le flag d'ouverture du formulaire d'upload
        instance.editingImg.set(!instance.editingImg.get());
        //on met les infobules pour le menu d'edition qui viens de poper
        Meteor.setTimeout(function () {
            $('.tooltipped').tooltip({delay: 50})
        }, 200)
    },
    /***********************************
     * à l'ajout de fichier, ouverture de la popup de preview,
     * envoi des info a imgur, affichage de la preview
     ************************************/
    'change input[type=file]': function (event, instance) {
        //on recupere le fichier
        let file = event.currentTarget.files[0];
        //on affiche la popup
        Meteor.setTimeout(function () {
            $('.modal').modal();
            $('#imgPreview').modal('open')
        }, 100)
        //on redimentionne l'image
        Resizer.resize(file, {width: 200, height: 200, cropSquare: true}, function (err, file) {
            //recuperation du fichier en base64
            var reader = new window.FileReader();
            reader.readAsDataURL(file);
            //quant c'est bon, on continue
            reader.onloadend = function () {
                base64data = reader.result;
                //on envoie vers imgur
                Imgur.upload({
                        apiKey: "ef8302a3a9f657e",
                        image: base64data,
                        type: "base64"
                    }, function (error, data) {
                        //on passe le resultat dans la reactivevar
                        instance.urlPreview.set(data.link)

                    }
                )
            }

        })
    },
    /***************************************
     * Si l'utilisateur valide la preview
     ************************************/
    'click [validateNewImage]': function (event, instance) {
        //si on est dans l'instance appelée par l'utilisateur
        if (instance.owner.get() === "user") {
            //on instancie notre objet useur avec les valeurs du currentUser
            let currentUser = User.findOne(Meteor.userId());
            //puis on lui applique la methode
            currentUser.callMethod(
                'updateProfileItem',
                "imgUrl", instance.urlPreview.get(),
                (error, result) => {
                    //si ca marche pas, on renvoie l'erreur par toast
                    if (error) {
                        Materialize.toast(error, 6000, 'red')
                    } else {
                        //sinon, on toast un feedback a l'utilisateur
                        Materialize.toast("l'avatar à été mis à jour", 6000, 'green')
                        //on reinitialise la preview
                        instance.urlPreview.set("")
                        //on ferme la fenetre modale
                        $('.modal').modal('close');
                        $('#imgPreview').modal('close')
                        //on ferme le panneau d'edition
                        instance.editingImg.set(false)
                    }
                })
            //si on est dans l'instance de type projet
        }else if(instance.owner.get() === "project"){
            //on instancie le projet
            let currentProject = Project.findOne(Template.instance().data.projectId);
            //puis on lui applique la methode

            currentProject.callMethod(
                'updateInfoItem',
                "imgUrl", instance.urlPreview.get(),
                (error, result) => {
                    //si ca marche pas, on renvoie l'erreur par toast
                    if (error) {
                        Materialize.toast(error, 6000, 'red')
                    } else {
                        //sinon, on toast un feedback a l'utilisateur
                        Materialize.toast("l'avatar à été mis à jour", 6000, 'green')
                        //on reinitialise la preview
                        instance.urlPreview.set("")

                        //on ferme la fenetre modale
                        $('.modal').modal('close');
                        $('#imgPreview').modal('close')
                        //on ferme le panneau d'edition
                        instance.editingImg.set(false)
                    }
                })
        }
    }
});

Template.editImage.onCreated(function () {
    //boolen pour savoir si l'utilisateur a cliqué sur l'edition de l'image
    this.editingImg = new ReactiveVar(false)
    //boolen pour savoir si l'on doit ouvrir la fenetre modale
    this.urlPreview = new ReactiveVar(false)
    this.owner = new ReactiveVar(Template.instance().data.owner)
});

Template.editImage.onRendered(function () {
    //add your statement here
});

Template.editImage.onDestroyed(function () {
    //add your statement here
});

