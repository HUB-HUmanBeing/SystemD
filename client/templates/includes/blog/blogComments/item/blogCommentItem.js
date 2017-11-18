Template.blogCommentItem.helpers({
    //add you helpers here
});

Template.blogCommentItem.events({
    //add your events here
});

Template.blogCommentItem.onCreated(function () {
    //add your statement here
});

Template.blogCommentItem.onRendered(function () {
    //add your statement here
    //déformatage du post
    let selector= '#comment-'+Template.currentData().postComment._id+' #comment-content'
    Textarea.unformatBySelector(selector)
});

Template.blogCommentItem.onDestroyed(function () {
    //add your statement here
});

