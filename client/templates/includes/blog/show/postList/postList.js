import Posts from '/lib/collections/Posts'

Template.postList.helpers({
    //ensemble des posts a afficher
    posts: function () {
        let query = Template.instance().query;
        let selector = {isProject : query.isProject, author_id :query.author_id};
        //on récupère l'eventuel focus
        let focus = Template.instance().focusPost.get();
        //si on focus sur un post particulier, on l'enlève du selecteur
        if (Template.instance().focusPost.get()) {
             selector = {isProject : query.isProject, author_id :query.author_id,_id: {$ne: focus._id}}
        }
        //puis on retourne la liste des post
        return Posts.find(selector, {
            sort: {
                pinned:-1,
                createdAt: -1
            }
        });
    },
    //post sur lequel l'utilisateur a demandé le focus
    focusPost: function () {
        return Template.instance().focusPost.get();
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
    Session.set("EditedPostId", false)
    //on initialise la limite de post à appeler
    this.limit = new ReactiveVar(10);
    //on récupere les valeurs passées en argument lors de l'appel du template
    let isProject = Template.currentData().isProject;
    let author_id = Template.currentData().author_id;
    //on prepare l'objet parametre de la requete de souscription
    this.query = {
        isProject: isProject,
        author_id: author_id
    }
    //on initialise le nombre de post collectés par la souscription
    this.collectedPostLength = new ReactiveVar(0)
    //dans l'autorun
        Tracker.autorun(()=>{
        //on lance la subscription
            let postInfiniteSubs =Meteor.subscribe('PostsInfinite', this.limit.get(), this.query);
            //quant elle est prete, on instancie une réactive var
            if(postInfiniteSubs.ready()){
                this.collectedPostLength.set(Posts.find({}).count())
            }
        })
    this.focusPost = new ReactiveVar(false)

    //gestion d'un eventuel focus sur un article particulier
    Tracker.autorun(() => {
        //on récupere les parametres de query de l'url
        let pathQuery = Iron.Location.get().queryObject
        //si on a un "focus"
        if (pathQuery.focus) {
            //on fait notre subscription avec
            let handle = Meteor.subscribe('singlePost', pathQuery.focus)

            if (handle.ready()) {
                //quant elle est prete, on passe l'article dans une réactive var
                this.focusPost.set(Posts.findOne({_id: pathQuery.focus}))
                //puis on scoll jusqu'a lui ( en attendat qu'il soit bien dans le dom)
                Meteor.setTimeout(function () {
                        $('html, body').animate({
                            scrollTop: $("#post-"+pathQuery.focus).offset().top
                        }, 600);
                        $('#post-'+pathQuery.focus+' #open-post').click()
                },20)
            }
        }
    })
});

Template.postList.onRendered(function () {
    //gestion de la souscription a de nouveaux posts
    let alreadyTrigger=false
    //on attache un écouteur d'evenement au scroll
    $(window).scroll( ()=> {
        // This is then function used to detect if the element is scrolled into view
        function elementScrolled(elem) {
            let docViewTop = $(window).scrollTop();
            let docViewBottom = docViewTop + $(window).height();
            let elemTop = $(elem).offset().top;
            return ((elemTop <= docViewBottom) && (elemTop >= docViewTop));
        }

        // si on est a la limite d'affichage décidée,
        //et si on a pas déja réalisé l'evenement
        //et si la dernière increase limit à récupéré des posts(et donc qu'il y a au moins autant de post que la limite)
        if (elementScrolled('#increaseLimit') &&
            !alreadyTrigger &&
            this.collectedPostLength.get()>= this.limit.get()) {

            this.limit.set(this.limit.get()+10)
            //si on l'a pas déja fait
            alreadyTrigger=true;
            //
            Meteor.setTimeout(function () {
                alreadyTrigger = false
            }, 1000)
        }
    });
})

Template.postList.onDestroyed(function () {
    //add your statement here
    Session.set("EditedPostId", false)
    $(window).off("scroll")
});

