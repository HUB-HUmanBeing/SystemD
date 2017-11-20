import MediumEditor from 'medium-editor'
import MediumEditorOptionsComment from '/imports/MediumEditor/MediumEditorOptionsComment'
import PostComment from '/imports/classes/PostComment'
//todo message d'erreur si le commentaire n'est pas valide (trop long)
Template.newBlogComment.helpers({
    //add you helpers here
});

Template.newBlogComment.events({
    //add your events here
    'click [sendComment]' : function (event, instance) {
        let author_id = instance.data.post.author_id;//on va s'en servir pour envoyer une notif à l'auteur
        let isProject = instance.data.post.isProject;
        let post_id = instance.data.post._id;
        let content = Textarea.formatBeforeSave($('#comment-content').html());

        let newPostComment = new PostComment();
        newPostComment.callMethod('newComment', post_id, content, author_id,isProject, function (error) {
            if (error) {
                Materialize.toast("une erreur s'est produite", 4000, 'red')
            } else {
                Materialize.toast("le commentaire a été publié", 6000, 'green')
                //on détruit les editeur wisywig
                $('#comment-content').html("")
            }
        })
    }
});

Template.newBlogComment.onCreated(function () {

});

Template.newBlogComment.onRendered(function () {
        this.commentEditor = new MediumEditor('.commentEditor', MediumEditorOptionsComment)
});

Template.newBlogComment.onDestroyed(function () {
    this.commentEditor.destroy()
});

