import User from '/imports/classes/User'

Template.userEditImage.helpers({
    //lien vers l'url de l'image stockée en base
    imageUrl: function () {
        return Meteor.user().profile.imgUrl
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

Template.userEditImage.events({
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
        //on instancie notre objet useur avec les valeurs du currentUser
        currentUser = User.findOne(Meteor.userId());
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
    }
});

Template.userEditImage.onCreated(function () {
    //add your statement here
    this.editingImg = new ReactiveVar(false)
    this.urlPreview = new ReactiveVar(false)
});

Template.userEditImage.onRendered(function () {
    //add your statement here
});

Template.userEditImage.onDestroyed(function () {
    //add your statement here
});

