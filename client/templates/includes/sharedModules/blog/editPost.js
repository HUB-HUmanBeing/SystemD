import MediumEditor from 'medium-editor'
import MediumEditorOptions from '/imports/MediumEditor/MediumEditorOptions'
import MediumEditorOptionsTitle from '/imports/MediumEditor/MediumEditorOptionsTitle'
import User from '/imports/classes/User'
import Project from '/imports/classes/Project'
import Post from '/imports/classes/Post'

Template.editPost.helpers({
    //add you helpers here
    isProject : function(){
        return Template.currentData().type === "project"
    },
    postImage: function () {
        return Template.instance().postImage.get()
    },
    isImageWide: function () {
        return Template.instance().isImageWide.get()
    },
    imageLoading: function () {
        return Template.instance().imageLoading.get()
    },
    date: function () {
        return Template.instance().date.get()
    },
    postContent: function () {
        if (Template.instance().postContent) {
            return Template.instance().postContent
        } else {
            return ""
        }

    },
    postTitle: function () {
        console.log(Template.currentData())
        if (Template.instance().isEditing) {
            return Template.instance().post.title
        }
    }
});

Template.editPost.events({
    //add your events here
    'click [smallImage]': function () {
        document.getElementById('small-image-input').click();
    },
    'click [largeImage]': function () {
        document.getElementById('large-image-input').click();
    },
    //TODO : virer les metadatas des images
    'change [smallImageInput]': function (event, instance) {
        instance.imageLoading.set(true)
        let file = event.currentTarget.files[0];
        Resizer.resize(file, {width: 200, height: 200, cropSquare: true}, function (err, file) {
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
                    }
                )
            }

        })
    },
//TODO : virer les metadatas des images
    'change [largeImageInput]': function (event, instance) {
        instance.imageLoading.set(true)
        let file = event.currentTarget.files[0];
        Resizer.resize(file, {width: 700, height: 200, cropSquare: false}, function (err, file) {
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
                    }
                )
            }

        })
    },
    'click [publish]': function (event, instance) {



        let isProject = Template.currentData().type === "projet";
        let author_id = isProject ? Template.currentData().id : Meteor.userId();
        let title = $('#post-title').html();
        let content = Textarea.formatBeforeSave($('#post-content').html());
        let isImageWide = instance.isImageWide.get();
        let postImageUrl = instance.postImage.get();
console.log(title)
        console.log(content)
let postArray = [isProject,author_id,title,content,isImageWide,postImageUrl]
        let newPost = new Post()
        newPost.applyMethod('createPost',
            postArray,
            (error, result) => {
                //si ca marche pas, on renvoie l'erreur par toast
                if (error) {
                    Materialize.toast("une erreur s'est produite", 4000, 'red')
                } else {
                    Materialize.toast("l'article a été publié", 6000, 'green')
                }
            })
    }
});

Template.editPost.onCreated(function () {
    //add your statement here
    console.log(Template.currentData())
    this.isImageWide = new ReactiveVar(false)
    let date = new Date()
    this.imageLoading = new ReactiveVar(false)
    let postImage = "/images/hub"
    let type = Template.currentData().type;
    if (type === "user") {
        if (!Template.currentData().isEditing) {
            postImage = Meteor.user().profile.imgUrl
        } else {

        }
    } else if (type === "project") {
        let project = Project.findOne(Template.currentData().id);
        this.project = project;
        if (!Template.currentData().isEditing) {
            postImage = project.publicInfo.imgUrl
        } else {

        }
    }
    this.postImage = new ReactiveVar(postImage)
    this.date = new ReactiveVar(date)
});

Template.editPost.onRendered(function () {
    //add your statement here
    //Textarea.unformatBySelector(".edit-post")

    const editor = new MediumEditor('.editable', MediumEditorOptions)
    const editorTitle = new MediumEditor('.editable-title', MediumEditorOptionsTitle)
    $('.tooltipped').tooltip({delay: 50});
    Textarea.unformatBySelector('.formattedText')
});

Template.editPost.onDestroyed(function () {
    //add your statement here
});

