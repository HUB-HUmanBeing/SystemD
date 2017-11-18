//import PostComment from "/imports/classes/PostComment"
import PostComments from "/lib/collections/PostComments"

Template.showBlogComments.helpers({
    //add you helpers here
    postComments: function () {
        return Template.instance().postComments.get()
    },
    leftComments: function () {
        return Template.currentData().post.nbOfComments - Template.instance().collectedCommentsLength.get()
    }
});

Template.showBlogComments.events({
    //add your events here
    'click [moreComments]': function (event, instance) {
        instance.limit.set(instance.limit.get() + 5)
    }
});

Template.showBlogComments.onCreated(function () {
    //on initialise la limite de commentaires à appeler
    this.limit = new ReactiveVar(5);
    this.postComments = new ReactiveVar([])
//on récupere les valeurs passées en argument lors de l'appel du template
    let post = Template.currentData().post;
    //on initialise le nombre de commentaires collectés par la souscription
    this.collectedCommentsLength = new ReactiveVar(0)
    //dans l'autorun
    Tracker.autorun(() => {
        if (post.nbOfComments > this.collectedCommentsLength.get()) {
            //on lance la subscription
            let commentsInfiniteSubs = Meteor.subscribe('CommentsInfinite', this.limit.get(), post._id);
            //quant elle est prete,
            if (commentsInfiniteSubs.ready()) {
                //on récupere les commentaires et on les rentre dans la réactive var
                let postComments = PostComments.find({post_id: post._id}, {
                    sort: {
                        createdAt: -1
                    }
                }).fetch()
                this.postComments.set(postComments)
                //on garde aussi en mémoire le nombre de commentaires ainsi collectés
                this.collectedCommentsLength.set(postComments.length)
            }
        }
    })

});

Template.showBlogComments.onRendered(function () {
    //add your statement here

});

Template.showBlogComments.onDestroyed(function () {
    //add your statement here
});

