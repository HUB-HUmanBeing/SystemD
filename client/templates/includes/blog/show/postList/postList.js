import Posts from '/lib/collections/Posts'

Template.postList.helpers({
    //add you helpers here
    posts: function () {
        let selector = {}
        let focus = Template.instance().focusPost.get()
        if (Template.instance().focusPost.get()) {
             selector = {_id: {$ne: focus._id}}
        }
        return Posts.find(selector, {
            sort: {
                createdAt: -1
            }
        });
    },
    focusPost: function () {
        return Template.instance().focusPost.get()
    }
});

Template.postList.events({
    //add your events here
});

Template.postList.onCreated(function () {
    //on récupere les valeurs passées en argument lors de l'appel du template
    let isProject = Template.currentData().isProject
    let author_id = Template.currentData().author_id
    let query = {                            // The query to use as the selector in our collection.find() query
        isProject: isProject,
        author_id: author_id
    }
    Meteor.subscribe('PostsInfinite', 10, query);

    this.focusPost = new ReactiveVar(false)
    Tracker.autorun(() => {
        let pathQuery = Iron.Location.get().queryObject
        if (pathQuery.focus) {
            let handle = Meteor.subscribe('singlePost', pathQuery.focus)

            if (handle.ready()) {
                this.focusPost.set(Posts.findOne({_id: pathQuery.focus}))
                Meteor.setTimeout(function () {

                        $('html, body').animate({
                            scrollTop: $("#post-"+pathQuery.focus).offset().top
                        }, 500);
                        $('#post-'+pathQuery.focus+' #open-post').click()
                },50)
            }
        }
    })

    //on crée une réactive var pour acceuilir la liste des post
    //this.posts = new ReactiveVar("");
    // this.infiniteScroll({
    //     perPage: 10,                        // How many results to load "per page"
    //     query: {
    //         author_id : author_id, // The query to use as the selector in our collection.find() query
    //         isProject : isProject
    //     },
    //     collection: 'posts',             // The name of the collection to use for counting results
    //     publication: 'PostsInfinite',     // (optional) The name of the publication to subscribe.
    //     // Defaults to {collection}Infinite
    //
    //     loadingTemplateName:'loading'       // (optional) Name of loading graphic (spinner) template. Default will show "Loading..."
    // });
});

Template.postList.onRendered(function () {


});

Template.postList.onDestroyed(function () {
    //add your statement here
});

