import Posts from '/lib/collections/Posts'

Template.homePostList.helpers({
    //add you helpers here
    range: function () {
        return Template.instance().range.get() === 1000 ? false : Template.instance().range.get()
    },
    //limite à partir de laquelle on doit afficher la div trigger
    // de l'increaseLimit pour l'infiniteScroll
    indexWhenIncreaseLimit : function () {
        let collectedPostLength = Template.instance().collectedPostLength.get()
        return collectedPostLength- 3
    },
    //ensemble des posts a afficher
    posts: function () {
     return Template.instance().posts.get()
    },
});

Template.homePostList.events({
    //add your events here
    'change [range]': function (event, instance) {

            instance.range.set(parseInt($('.range-field input').val()))

    }
});

Template.homePostList.onCreated(function () {
    //add your statement here

    this.posts = new ReactiveVar()
    this.range = new ReactiveVar(200);
    this.lastVisit = new ReactiveVar()
    this.limit = new ReactiveVar(10);
    //on initialise le nombre de post collectés par la souscription
    this.collectedPostLength = new ReactiveVar(0)
    Tracker.autorun(() => {
        let currentUser = Meteor.user()
        this.lonLat = new ReactiveVar(false)
        if (currentUser) {
            this.lastVisit.set(currentUser)
            if (currentUser.profile.location.lonLat) {
                this.lonLat.set(currentUser.profile.location.lonLat)
            }else{
                getLonLat((result) => {
                    this.lonLat.set(result);
                });
            }

        } else {
            getLonLat((result) => {
                this.lonLat.set(result);
            });
        }

        //on laisse un peu de temps pour laisser à l'utilisateur le temps de se connecter
Meteor.setTimeout(()=>{
    Tracker.autorun(() => {
        if (this.lonLat.get()) {

            //on lance la subscription
            let HomepagePostInfiniteSubs = Meteor.subscribe(
                'HomepagePostInfiniteSubs',
                this.limit.get(),
                this.lonLat.get(),
                this.range.get()
            );
            //quant elle est prete, on instancie une réactive var
            if (HomepagePostInfiniteSubs.ready()) {
                this.posts.set(Posts.find({}).fetch())
                this.collectedPostLength.set(Posts.find({}).count())
            }
        }
    })
    }, 100)

    })
});

Template.homePostList.onRendered(function () {
    resetTooltips()
    //gestion de la souscription a de nouveaux posts
    let alreadyTrigger = false
    //on attache un écouteur d'evenement au scroll
    $(window).scroll(() => {
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
            this.collectedPostLength.get() >= this.limit.get()) {

            this.limit.set(this.limit.get() + 10)
            //si on l'a pas déja fait
            alreadyTrigger = true;
            //
            Meteor.setTimeout(function () {
                alreadyTrigger = false
            }, 1000)
        }
    });
});

Template.homePostList.onDestroyed(function () {
    //add your statement here
    $(window).off("scroll")
});

