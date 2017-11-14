import Post from '/imports/classes/Post'

Template.postItem.helpers({
    //renvoie le type de l'article visioné
    type : function () {
        return Template.currentData().post.isProject? "project" : "user"
    },
    //renvoie le lien vers la page ou s'affiche l'article
    path: function () {
        let post = Template.currentData().post
        let route= post.isProject? "projectMainPage" : "userMainPage"
        return Router.path(route, {_id : post.author_id},{query : "focus="+post._id})
    },
    //true si l'article est ouvert
    isOpen : function () {
        return Template.instance().isOpen.get()
    },
    //true si l'on doit afficher les commentaires
    showComments : function () {
        return Template.instance().showComments.get()
    },
    //true si l'on doit switcher sur le template d'edition
    editionMode : function () {
        return Session.get("EditedPostId") ===Template.currentData().post._id
    }
});

Template.postItem.events({
    //ouvrir/refermer l'article
    'click [toggleWideArticle] , touch [toggleWideArticle]' : function (event, instance) {

        let isOpen =instance.isOpen.get()

        //on réinitialise les tooltips
        resetTooltips()
        //si l'article etait ouvert
        if(isOpen=== true){
           Meteor.setTimeout(()=>{
               instance.isOpen.set(false)
           },300)


            //on remonte au haut de l'article
            $('html, body').animate({
                scrollTop: $("#post-"+instance.data.post._id).offset().top
            }, 300);
        }else{
            instance.isOpen.set(true)
        }
        //on passe isOpen a l'inverse de sa valeur actuelle

    },
    //action pour ouvrir un article au clic dessus
    'click [openWideArticle], touch[openWideArticle]' : function (event, instance) {
        instance.isOpen.set(true)
        resetTooltips()
        return true
    },
    //action pour afficher les commentaires
    'click [showComments]' : function (event, instance) {
        instance.showComments.set(!instance.showComments.get())
    },
    //action de supression d'un article
    'click [deletePost]' : function (event, instance) {
        //on récupère le post
        let post = Post.findOne( {_id : instance.data.post._id})
        //et on applique la méthode
        post.callMethod('deletePost', (error)=>{
            //si ca marche pas, on renvoie l'erreur par toast
            if (error) {
                Materialize.toast("une erreur s'est produite", 4000, 'red')
            } else {
                Materialize.toast("l'article a été supprimé", 6000, 'orange')
                resetTooltips()
            }
        })
    },
    //switch sur le template d'edition
    'click [editPost]' : function (event, instance) {
        Session.set("EditedPostId" , instance.data.post._id)
            resetTooltips()
    }
});

Template.postItem.onCreated(function () {
    //initialisation des réactiveVar nécessaires
    this.isOpen = new ReactiveVar(false)
    this.showComments = new ReactiveVar(false)
    this.editionMode = new ReactiveVar(false)
});

Template.postItem.onRendered(function () {
    //add your statement here
    resetTooltips()
    //déformatage du post
    let selector= '#post-'+Template.currentData().post._id+' #post-content'
    Textarea.unformatBySelector(selector)
});

Template.postItem.onDestroyed(function () {
    resetTooltips()
});

