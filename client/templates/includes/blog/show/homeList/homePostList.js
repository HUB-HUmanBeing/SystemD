import Posts from '/lib/collections/Posts'

Template.homePostList.helpers({
    //distance a partir de laquelle on retourne les posts
    range: function () {
        return Template.instance().range.get()
    },
    //spécifique a l'affichage, si c'est false, ca
    shownRange: function () {
        return Template.instance().range.get() === 600 ?
            "visuliser tout les articles" :
            'à moins de '+Template.instance().range.get()+'km'
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
    loadingPosts: function () {
        return Template.instance().loadingPosts.get()
    }
});

Template.homePostList.events({
    //lorsque l'utilisateur modifie la distance
    'change [range]': function (event, instance) {
        //on passe la nouvelle valeur dans la réactive var
            instance.range.set(parseInt($('.range-field input').val()))
    }
});

Template.homePostList.onCreated(function () {
    this.loadingPosts = new ReactiveVar(true)
    //on commence par déclarer les réactives vars dont on va avoir besoin
    this.posts = new ReactiveVar()
    this.range = new ReactiveVar(100);
    //this.lastVisit = new ReactiveVar() //pour avoir la date de dernière visite de l'utilisateur
    this.limit = new ReactiveVar(10);
    //on initialise le nombre de post collectés par la souscription
    this.collectedPostLength = new ReactiveVar(0)
    this.lonLat = new ReactiveVar(false)
    //dans une boucle d'autorun
    Tracker.autorun(() => {
        //on récupere l'utilisateur courant
        let currentUser = Meteor.user()
        //si on a un utilisateur connecté
        if (currentUser) {
            //this.lastVisit.set(currentUser)
            if (currentUser.profile.location.lonLat) { //si il a renseigné ses coordonnées
                //on affecte à la réactive var les coordonnées
                this.lonLat.set(currentUser.profile.location.lonLat)
            }else{
                //sinon on passe par la fonction faisant appel a une api de localisation par ip
                getLonLat((result) => {
                    this.lonLat.set(result);
                });
            }
        } else {
            //sinon on passe par la fonction faisant appel a une api de localisation par ip
            getLonLat((result) => {
                this.lonLat.set(result);
            });
        }
        //on laisse un peu de temps pour laisser à l'utilisateur
        // le temps de se connecter, afin de pas relancer trop de souscriptions
Meteor.setTimeout(()=>{
            //dans une boucle d'autorun
    Tracker.autorun(() => {
        //lorsqu'on a une localisation (et donc que soit on a récupéré la localisation de l'user,
        // soit qu'on a le retour de l'api)
        if (this.lonLat.get()) {
            //on lance la subscription
            let HomepagePostInfiniteSubs = Meteor.subscribe(
                'HomepagePostInfiniteSubs',
                this.limit.get(),
                this.lonLat.get(),
                this.range.get()
            );
            //quant elle est prete, on remplit les données dans la réactive var
            if (HomepagePostInfiniteSubs.ready()) {
                this.posts.set(Posts.find({}).fetch())
                this.collectedPostLength.set(Posts.find({}).count())
                this.loadingPosts.set(false)
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
            this.loadingPosts.set(true)
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
    resetTooltips()
    //add your statement here
    $(window).off("scroll")
});

