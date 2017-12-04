import CollaboratorAdverts from '/lib/collections/CollaboratorAdverts'

Template.homeAdvertList.helpers({
    //distance a partir de laquelle on retourne les annonces
    range: function () {
        return Template.instance().range.get()
    },
    //spécifique a l'affichage, si c'est false, ca
    shownRange: function () {
        return Template.instance().range.get() === 150 ?
            "visuliser toutes les annonces" :
            'à moins de '+Template.instance().range.get()+'km'
    },
    //limite à partir de laquelle on doit afficher la div trigger
    //limite à partir de laquelle on doit afficher la div trigger
    // de l'increaseLimit pour l'infiniteScroll
    indexWhenIncreaseLimit : function () {
        let collectedAdvertsLength = Template.instance().collectedAdvertsLength.get()
        return collectedAdvertsLength- 3
    },
    //ensemble des posts a afficher
    collaboratorAdverts: function () {
        return Template.instance().collaboratorAdverts.get()
    },
    loadingAdverts: function () {
        return Template.instance().loadingAdverts.get()
    }
});

Template.homeAdvertList.events({
    //lorsque l'utilisateur modifie la distance
    'change [range]': function (event, instance) {
        //on passe la nouvelle valeur dans la réactive var
        instance.range.set(parseInt($('.range-field #advert-range').val()))
    }
});

Template.homeAdvertList.onCreated(function () {
    this.loadingAdverts = new ReactiveVar(true)
    //on commence par déclarer les réactives vars dont on va avoir besoin
    this.collaboratorAdverts = new ReactiveVar()
    this.range = new ReactiveVar(30);
    //this.lastVisit = new ReactiveVar() //pour avoir la date de dernière visite de l'utilisateur
    this.limit = new ReactiveVar(10);
    //on initialise le nombre de post collectés par la souscription
    this.collectedAdvertsLength = new ReactiveVar(0)
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
                    this.range.set(150);
                });
            }
        } else {
            //sinon on passe par la fonction faisant appel a une api de localisation par ip
            getLonLat((result) => {
                this.lonLat.set(result);
                this.range.set(150);
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
                    let HomepageAdvertInfiniteSubs = Meteor.subscribe(
                        'HomepageAdvertsInfiniteSubs',
                        this.limit.get(),
                        this.lonLat.get(),
                        this.range.get()
                    );
                    //quant elle est prete, on remplit les données dans la réactive var
                    if (HomepageAdvertInfiniteSubs.ready()) {
                        this.collaboratorAdverts.set(CollaboratorAdverts.find({}).fetch())
                        this.collectedAdvertsLength.set(CollaboratorAdverts.find({}).count())
                        this.loadingAdverts.set(false)
                    }
                }
            })
        }, 100)

    })
});

Template.homeAdvertList.onRendered(function () {
    resetTooltips()
    //gestion de la souscription a de nouvelles annonces
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
        //et si la dernière increase limit à récupéré des annonces et donc qu'il y a au moins autant d'annonces que la limite)
        if (elementScrolled('#increaseAdvertLimit') &&
            !alreadyTrigger &&
            this.collectedAdvertsLength.get() >= this.limit.get()) {

            this.limit.set(this.limit.get() + 10)
            this.loadingAdverts.set(true)
            //si on l'a pas déja fait
            alreadyTrigger = true;
            //
            Meteor.setTimeout(function () {
                alreadyTrigger = false
            }, 1000)
        }
    });
});

Template.homeAdvertList.onDestroyed(function () {
    resetTooltips()
    //add your statement here
    $(window).off("scroll")
});

