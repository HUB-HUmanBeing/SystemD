import Posts from '/lib/collections/Posts'

Template.postList.helpers({
    //ensemble des posts a afficher
    posts: function () {
        let selector = {}
        //on récupère l'eventuel focus
        let focus = Template.instance().focusPost.get()
        //si on focus sur un post particulier, on l'enlève du selecteur
        if (Template.instance().focusPost.get()) {
             selector = {_id: {$ne: focus._id}}
        }
        //puis on retourne la liste des post
        return Posts.find(selector, {
            sort: {
                createdAt: -1
            }
        });
    },
    //post sur lequel l'utilisateur a demandé le focus
    focusPost: function () {
        return Template.instance().focusPost.get()
    },
    //limite à partir de laquelle on doit afficher la div trigger
    // de l'increaseLimit pour l'infiniteScroll
    indexWhenIncreaseLimit : function () {
        let collectedPostLength = Template.instance().collectedPostLength.get()
        return collectedPostLength>=4? collectedPostLength- 3 : collectedPostLength-1;
    }
});

Template.postList.events({
    //add your events here
});

Template.postList.onCreated(function () {
    //on initialise la limite de post à appeler
    this.limit = new ReactiveVar(10);
    //on récupere les valeurs passées en argument lors de l'appel du template
    let isProject = Template.currentData().isProject;
    let author_id = Template.currentData().author_id;
    //on prepare l'objet parametre de la requete de souscription
    let query = {
        isProject: isProject,
        author_id: author_id
    }
    //on initialise le nombre de post collectés par la souscription
    this.collectedPostLength = new ReactiveVar(0)
    //dans l'autorun'
    Tracker.autorun(()=>{
        //
        if(this.collectedPostLength.get() <= this.limit.get())
        Tracker.autorun(()=>{
            let postInfiniteSubs =Meteor.subscribe('PostsInfinite', this.limit.get(), query);
            if(postInfiniteSubs.ready()){
                this.collectedPostLength.set(Posts.find({}).count())
            }
        })

    })
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
                        }, 300);
                        $('#post-'+pathQuery.focus+' #open-post').click()
                },50)
            }
        }
    })
});

Template.postList.onRendered(function () {
    let alreadyTrigger=false
    $(window).scroll( ()=> {
        // This is then function used to detect if the element is scrolled into view
        function elementScrolled(elem) {
            let docViewTop = $(window).scrollTop();
            let docViewBottom = docViewTop + $(window).height();
            let elemTop = $(elem).offset().top;
            return ((elemTop <= docViewBottom) && (elemTop >= docViewTop));
        }

        // This is where we use the function to detect if ".box2" is scrolled into view, and when it is add the class ".animated" to the <p> child element
        if (elementScrolled('#increaseLimit') && !alreadyTrigger) {

            this.limit.set(this.limit.get()+10)
            // Your function here
            alreadyTrigger=true
            Meteor.setTimeout(function () {
                alreadyTrigger = false
            }, 1000)
        }
    });
})

Template.postList.onDestroyed(function () {
    //add your statement here
});

