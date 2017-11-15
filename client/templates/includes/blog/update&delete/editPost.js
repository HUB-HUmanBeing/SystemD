import MediumEditor from 'medium-editor'
import MediumEditorOptions from '/imports/MediumEditor/MediumEditorOptions'
import MediumEditorOptionsTitle from '/imports/MediumEditor/MediumEditorOptionsTitle'
import Project from '/imports/classes/Project'
import Post from '/imports/classes/Post'

Template.editPost.helpers({
    //renvoie un boolénen
    isProject: function () {
        return Template.currentData().type === "project"
    },
    //renvoie l'image illustrant l'article
    postImage: function () {
        return Template.instance().postImage.get()
    },
    //true si on est en mode image large
    isImageWide: function () {
        return Template.instance().isImageWide.get()
    },
    //true si l'image est en cours de chargement
    imageLoading: function () {
        return Template.instance().imageLoading.get()
    },
    //date a afficher
    date: function () {
        return Template.instance().date.get()
    },
    // contenu du post
    postContent: function () {
        if (Template.currentData().isEditing) {
            return Template.instance().post.get().content
        } else {
            return ""
        }

    },
    //titre de l'article
    postTitle: function () {
        if (Template.currentData().isEditing) {
            return Template.instance().post.get().title
        }
    },
    post_id: function () {
        if (Template.currentData().isEditing) {
            return Template.instance().post.get()._id
        }
    },
    noChange : function () {
        return Template.instance().noChange.get()
    }
});

Template.editPost.events({
    //choix d'une image
    'click [smallImage]': function () {
        //on simule le click de l'utilisateur sur le formulaire caché
        document.getElementById('small-image-input').click();
    },
    'click [largeImage]': function () {
        document.getElementById('large-image-input').click();
    },
    //changement d'image
    //TODO : virer les metadatas des images
    'change [smallImageInput]': function (event, instance) {
        //on détruit l'editeur de texte wysiwig
        instance.titleEditor.destroy()
        instance.contentEditor.destroy()
        //on charge l'image de chargement
        instance.imageLoading.set(true)
        //on récupere le fichier
        let file = event.currentTarget.files[0];
        //on le redimentionne
        Resizer.resize(file, {width: 350, height: 350, cropSquare: true}, function (err, file) {
            //recuperation du fichier en base64
            let reader = new window.FileReader();
            reader.readAsDataURL(file);
            //quant c'est bon, on continue
            reader.onloadend = function () {
                let base64data = reader.result;
                //on envoie vers imgur
                Imgur.upload({
                        apiKey: "ef8302a3a9f657e",
                        image: base64data,
                        type: "base64"
                    }, function (error, data) {
                        //on passe le resultat dans la reactivevar
                        instance.postImage.set(data.link)
                        instance.imageLoading.set(false)
                        instance.isImageWide.set(false)
                    instance.noChange.set(false)
                        //apres un court temps, on relance l'éditeur wysiwig
                        Meteor.setTimeout(() => {
                            instance.titleEditor = new MediumEditor('.editable-title', MediumEditorOptionsTitle)
                            instance.contentEditor = new MediumEditor('.editable', MediumEditorOptions)
                        }, 50)
                    }
                )
            }

        })
    },
    //idem que pour au dessus
//TODO : virer les metadatas des images
    'change [largeImageInput]': function (event, instance) {
        instance.titleEditor.destroy()
        instance.contentEditor.destroy()
        instance.imageLoading.set(true)
        let file = event.currentTarget.files[0];
        Resizer.resize(file, {width: 700, height: 350, cropSquare: false}, function (err, file) {
            //recuperation du fichier en base64
            let reader = new window.FileReader();
            reader.readAsDataURL(file);
            //quant c'est bon, on continue
            reader.onloadend = function () {
                let base64data = reader.result;
                //on envoie vers imgur
                Imgur.upload({
                        apiKey: "ef8302a3a9f657e",
                        image: base64data,
                        type: "base64"
                    }, function (error, data) {
                        //on passe le resultat dans la reactivevar
                        instance.postImage.set(data.link)
                        instance.isImageWide.set(true)
                        instance.imageLoading.set(false)
                    instance.noChange.set(false)
                        Meteor.setTimeout(() => {
                            instance.titleEditor = new MediumEditor('.editable-title', MediumEditorOptionsTitle)
                            instance.contentEditor = new MediumEditor('.editable', MediumEditorOptions)
                            if (instance.data.isEditing) {
                                Textarea.unformatBySelector('#editPost-'+Template.instance().post.get()._id+' .formattedText')
                            }else{
                                Textarea.unformatBySelector('.editable')
                            }
                        }, 50)

                    }
                )
            }

        })
    },
    'keyup #post-content, keyup #postTitle' :function (event, instance) {
        instance.noChange.set(false)
    },
    //quant on clique sur publier
    'click [publish]': function (event, instance) {
        //on récupere toutes les valeurs de l'article
        let isProject = instance.data.type === "project";
        let author_id = isProject ? instance.data.id : Meteor.userId();
        let title = $('#post-title').html();
        let content = Textarea.formatBeforeSave($('#post-content').html());
        let isImageWide = instance.isImageWide.get();
        let postImageUrl = instance.postImage.get();
        //on passe toutes ces valeurs dans un tableau
        let postArray = [isProject, author_id, title, content, isImageWide, postImageUrl];
        //on créee le post
        let newPost = new Post()
        //et on lance la méthode de création
        newPost.applyMethod('createPost',
            postArray,
            (error, result) => {
                //si ca marche pas, on renvoie l'erreur par toast
                if (error) {
                    Materialize.toast("une erreur s'est produite", 4000, 'red')
                } else {
                    Materialize.toast("l'article a été publié", 6000, 'green')
                    //on détruit les editeur wisywig
                    instance.titleEditor.destroy()
                    instance.contentEditor.destroy()
                    let routeName = instance.data.type + "MainPage";
                    Router.go(routeName, {_id: author_id}, {query: "focus=" + result})
                }
            })
    },
    //quant on clique sur publier
    'click [EditPost]': function (event, instance) {
        //on instancie notre classe avec le post
        let post = Post.findOne(instance.post.get()._id)
        //on récupere toutes les valeurs de l'article et on les modifie sur notre instance de post
         post.title = $('#editPost-' + post._id + ' #post-title').html();
        post.content = Textarea.formatBeforeSave($('#editPost-' + post._id + ' #post-content').html());
        post.isImageWide = instance.isImageWide.get();
        post.ImageUrl = instance.postImage.get();

        //et on lance la méthode d'edition
        post.callMethod('editPost',
            (error, result) => {
                //si ca marche pas, on renvoie l'erreur par toast
                if (error) {
                    Materialize.toast("une erreur s'est produite", 4000, 'red')
                } else {
                    Materialize.toast("l'article a été édité", 6000, 'green')
                    resetTooltips();
                    //on détruit les editeur wisywig
                    instance.titleEditor.destroy()
                    instance.contentEditor.destroy()
                    Session.set("EditedPostId" , false)
                    Meteor.setTimeout(function () {
                        $('html, body').animate({
                            scrollTop: $("#post-"+instance.data.post._id).offset().top
                        }, 600);
                        Textarea.unformatBySelector("#post-"+instance.data.post._id+ " .formattedText")
                    },50)
                }
            })
    }
});

Template.editPost.onCreated(function () {
    this.noChange = new ReactiveVar(true)
    //on initialise les réactive var
    this.isImageWide = new ReactiveVar(false);
    let date = new Date();
    this.imageLoading = new ReactiveVar(false);
    let postImage = "/images/hub_logo.png";
    let type = Template.currentData().type;
    //si on est avec un utilisateur qui edite don blog
    if (type === "user") {
        //si on est en création
        if (!Template.currentData().isEditing) {
            //on part avec l'image de l'utilisateur
            postImage = Meteor.user().profile.imgUrl
        }
        //si on est coté projet
    } else if (type === "project") {
        //si on est en mode édition
        if (!Template.currentData().isEditing) {
            //on récupere le projet
            this.project = Project.findOne(Template.currentData().id);
        }
    }
    if (Template.currentData().isEditing) {
        let post = Template.currentData().post;
        this.post = new ReactiveVar(post);
        date = post.createdAt;
        postImage = post.imageUrl;
        this.isImageWide.set(post.isImageWide);

    }
    //on remplit les réactive var avec les données
    this.postImage = new ReactiveVar(postImage);
    this.date = new ReactiveVar(date)
});

Template.editPost.onRendered(function () {
    //au rendu du template
    //on initialise l'editeur wisiwig du titre et du contenu
    this.contentEditor = new MediumEditor('.editable', MediumEditorOptions)
    this.titleEditor = new MediumEditor('.editable-title', MediumEditorOptionsTitle)
    //on active les tooltip
    $('.tooltipped').tooltip({delay: 50});
    //on déformatte le contenu du post (si on est en mode edition
    if (Template.currentData().isEditing) {
        Textarea.unformatBySelector('#editPost-'+Template.instance().post.get()._id+' .formattedText')
    }
});

Template.editPost.onDestroyed(function () {
    resetTooltips()
    this.titleEditor.destroy();
    this.contentEditor.destroy()
});
