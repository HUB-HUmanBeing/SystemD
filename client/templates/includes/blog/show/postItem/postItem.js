import Post from '/imports/classes/Post'

Template.postItem.helpers({
    //add you helpers here
    type : function () {
        return Template.currentData().post.isProject? "project" : "user"
    },
    path: function () {
        let post = Template.currentData().post
        let route= post.isProject? "projectMainPage" : "userMainPage"
        return Router.path(route, {_id : post.author_id},{query : "focus="+post._id})
    },
    isOpen : function () {
        return Template.instance().isOpen.get()
    },
    showComments : function () {
        return Template.instance().showComments.get()
    },
});

Template.postItem.events({
    //add your events here
    'click [toggleWideArticle] , touch [toggleWideArticle]' : function (event, instance) {
        instance.isOpen.set(!instance.isOpen.get())
    },
    'click [openWideArticle], touch[openWideArticle]' : function (event, instance) {
        instance.isOpen.set(true)
        return true
    },
    'click [showComments]' : function (event, instance) {
        instance.showComments.set(!instance.showComments.get())
    },
    'click [deletePost]' : function (event, instance) {
        let post = Post.findOne( {_id : instance.data.post._id})
        post.callMethod('deletePost', (error)=>{
            //si ca marche pas, on renvoie l'erreur par toast
            if (error) {
                Materialize.toast("une erreur s'est produite", 4000, 'red')
            } else {
                Materialize.toast("l'article a été supprimé", 6000, 'orange')
            }
        })
    }
});

Template.postItem.onCreated(function () {
    //add your statement here
    this.isOpen = new ReactiveVar(false)
    this.showComments = new ReactiveVar(false)
});

Template.postItem.onRendered(function () {
    //add your statement here
    $('.tooltipped').tooltip({delay: 50});
    let selector= '#post-'+Template.currentData().post._id+' #post-content'
    
    Textarea.unformatBySelector(selector)
});

Template.postItem.onDestroyed(function () {
    //add your statement here
    $('.tooltipped').tooltip({delay: 50});
});

