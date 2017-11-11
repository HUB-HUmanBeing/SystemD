import Posts from '/lib/collections/Posts'

Template.postList.helpers({
    //add you helpers here
    posts: function() {
        return Posts.find({},  {
            sort: {
                createdAt: 1
            }
        });
    }
});

Template.postList.events({
    //add your events here
});

Template.postList.onCreated(function () {
    console.log(Template.currentData())
    //on récupere les valeurs passées en argument lors de l'appel du template
    let isProject = Template.currentData().isProject
    let author_id = Template.currentData().author_id
let query = {                            // The query to use as the selector in our collection.find() query
    isProject : isProject,
    author_id : author_id
}

    //on crée une réactive var pour acceuilir la liste des post
    this.posts = new ReactiveVar("");
    this.infiniteScroll({
        perPage: 10,                        // How many results to load "per page"
        query: {
            author_id : author_id, // The query to use as the selector in our collection.find() query
            isProject : isProject
        },
        collection: 'posts',             // The name of the collection to use for counting results
        publication: 'PostsInfinite',     // (optional) The name of the publication to subscribe.
        // Defaults to {collection}Infinite

        loadingTemplateName:'loading'       // (optional) Name of loading graphic (spinner) template. Default will show "Loading..."
    });
});

Template.postList.onRendered(function () {


});

Template.postList.onDestroyed(function () {
    //add your statement here
});

