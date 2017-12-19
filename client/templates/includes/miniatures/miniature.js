import User from '/imports/classes/User'
import Project from '/imports/classes/Project'

Template.miniature.helpers({
    //add you helpers here
    //helper permettant de renvoyer la couleur du helpeur a afficher
    color: function () {
        let type = Template.currentData().type
        if (type === "project") {
            return "orange"
        } else if (type === "user") {
            return "green"
        }
    },
    //helpeur permettant de renvoyer l'url de l'image a afficher
    imgUrl: function () {
        //on ne l'execute que si les données sont chargées dans les réactivevar
        if (Template.instance().project.get() || Template.instance().user.get()) {
            let type = Template.currentData().type
            if (type === "project") {
                let url = Template.instance().project.get().publicInfo.imgUrl;
                //si c'est pas l'image par défault, on fais une requete de miniature vers l'api d'imgur
                if (url !== "/images/icon/project_icon.png") {
                    return Imgur.toThumbnail(url, Imgur.SMALL_THUMBNAIL)
                } else {
                    return url
                }
            } else if (type === "user") {

                let url = Template.instance().user.get().profile.imgUrl
                //si c'est pas l'image par défault, on fais une requete de miniature vers l'api d'imgur
                if (url !== "/images/icon/user_icon.png") {
                    return Imgur.toThumbnail(url, Imgur.SMALL_THUMBNAIL)
                } else {
                    return url
                }
            }
            //sinon = en attendant le chargement, on renvoie le logo du site
        } else {
            return "/images/icon/loading.png"
        }
    },
    //helpeur contenant le nom affiché
    name: function () {
        //si le chargement est terminé, on renvoie le nom en fonction du type
        if (Template.instance().project.get() || Template.instance().user.get()) {
            let type = Template.currentData().type
            if (type === "project") {
                return Template.instance().project.get().name
            } else if (type === "user") {
                return Template.instance().user.get().username
            }
        } else {
            return '.....'
        }
    },
    //lien vers la main page du projet ou de l'user en fonction du type
    path: function () {
        if (Template.instance().project.get() || Template.instance().user.get()) {
            let type = Template.currentData().type
            if (type === "project") {
                return Router.path('projectMainPage', {_id: Template.currentData()._id})
            } else if (type === "user") {
                return Router.path('userMainPage', {_id: Template.currentData()._id})
            }
        }
    },
    categories: function () {
        if (Template.instance().project.get() || Template.instance().user.get()) {
            let type = Template.currentData().type
            if (type === "project") {
                return Template.instance().project.get().publicInfo.categories
            } else if (type === "user") {
                return Template.instance().user.get().profile.categories
            }
        }
    },
    showCategories: function () {
        return Template.instance().showCategories.get()
    }
});


Template.miniature.events({

    'mouseenter [showCategories]': function (event, instance) {

        Meteor.setTimeout(() => {
            if ($(event.currentTarget).is(':hover')) {
                instance.showCategories.set(true)
                $(event.currentTarget).css('z-index', '1000')
            }
        }, 500)
    },
    'mouseleave [showCategories]': function (event, instance) {
        instance.showCategories.set(false)
        $(event.currentTarget).css('z-index', '100')
    },
});

//à la création du template,
//on doit récupérer les info complémentaire pour afficher correctement notre vignette
Template.miniature.onCreated(function () {
    this.showCategories = new ReactiveVar(false)
    Tracker.autorun(() => {



        //on crée deux réactive var pour acceuilir le contenu
        this.project = new ReactiveVar("");
        this.user = new ReactiveVar("");
        if (this.data._id && this.data.type) {
            //on récupere les valeurs passées en argument lors de l'appel du template
            let type = this.data.type
            let id = this.data._id
            //si toutes les infos sont rentrées pas besoin de faire une requete
            if (this.data.imgUrl && this.data.categories && this.data.name) {
                //on rempli juste les champs nécessaires pour simuler qu'on a l'objet
                if (type === "project") {
                    Template.instance().project.set({
                        _id: id,
                        name: this.data.name,
                        publicInfo : {
                            imgUrl : this.data.imgUrl,
                            categories : this.data.categories
                        }
                    })
                } else if (type === "user") {
                    Template.instance().user.set({
                        _id: id,
                        username: this.data.name,
                        profile : {
                            imgUrl : this.data.imgUrl,
                            categories : this.data.categories
                        }
                    })
                }
            } else { //si on a pas toutes les infos nécessaires pour afficher la miniature directement
                //on lance un autorun pour attendre le retour d'info complémentaires qu'on cherche a obtenir par la suscription
                this.autorun(function () {
                    let handle = Meteor.subscribe('miniature', id, type)
                    //quant c'est pret, on rempli la réactive var
                    if (handle.ready()) {
                        if (type === "project") {
                            Template.instance().project.set(Project.findOne({_id: id}))
                        } else if (type === "user") {
                            Template.instance().user.set(User.findOne({_id: id}))
                        }
                    }
                })
            }

        }


    })
});

Template.miniature.onRendered(function () {
    //add your statement here
});

Template.miniature.onDestroyed(function () {
    //add your statement here
});

