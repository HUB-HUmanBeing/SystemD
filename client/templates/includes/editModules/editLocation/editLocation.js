import User from '/imports/classes/User'
import Project from '/imports/classes/Project'

/************************************
 * Helpers du template
 ********************************/

Template.editLocation.helpers({
    owner: function () {
        return Template.instance().owner.get()
    },
    //booléen pour afficher ou non le formulaie
    useSearchForm: function () {
        return Template.instance().useSearchForm.get();
    },
    //deux petits helpers qui evitent qu'il y ait trop de code dans le template
    city: function () {
        if (Template.instance().owner.get() === "user") {
            return Meteor.user().profile.location.city
        } else if (Template.instance().owner.get() === "project") {
            let currentProject = Project.findOne(Template.instance().data.projectId);
            return currentProject.publicInfo.location.city
        }

    },
    country: function () {
        if (Template.instance().owner.get() === "user") {
            return Meteor.user().profile.location.country
        } else if (Template.instance().owner.get() === "project") {
            let currentProject = Project.findOne(Template.instance().data.projectId);
            return currentProject.publicInfo.location.country
        }
    },
    //contient les data qui ressortent de la recherche via nominatim
    searchResults: function () {
        return Template.instance().searchResults.get();
    },
    editingLocation: function () {
        return Template.instance().editingLocation.get();
    }
});

/************************************
 * Evenements du template
 ********************************/

Template.editLocation.events({
    'click [editLocation]': function (event, instance) {
        instance.editingLocation.set(!instance.editingLocation.get());
        //on vire les petites infobulles
        $('.tooltipped').tooltip('remove');
        Meteor.setTimeout(function () {
            //on afficle les bulles d'infos insérées dans le dom
            $('.tooltipped').tooltip({delay: 50});
        }, 200)
    },
    /**************************
     * affichage du formulaire au click
     **************************/
    'click [useSearchForm]': function (event, instance) {
        //on affiche le searchform
        instance.useSearchForm.set(!instance.useSearchForm.get());
        //on laisse le temps a l'affichagede se faire
        Meteor.setTimeout(function () {
            //on en profite pour mettre le curseur dans le champs
            $('.location-search-field').focus();
            //on afficle les bulles d'infos insérées dans le dom
            $('.tooltipped').tooltip({delay: 50});
        }, 200)
    },
    /**********************************************
     * utilisation des donées de localisation
     *********************************************/
    'click [useUserPosition] ': function (event, instance) {
        //on referme le formulaire de rcherche
        instance.useSearchForm.set(false);
        //on recupere les données de l'utilisateur
        instance.autorun(function () {
            let latLng = Geolocation.latLng();
            if (latLng) {
                //requette http vers l'api de nominatim pour recuperer le nom de la ville a partir des coordonnées
                HTTP.call("GET",
                    "http://nominatim.openstreetmap.org/reverse?format=json&lat=" + latLng.lat + "&lon=" + latLng.lng + "&zoom=18&addressdetails=1",
                    function (error, result) {
                        //si ya erreur on verifie que c'est pas la premier fois ( pour pas renvoyer une erreur au premier essai
                        if (error) {
                            if (instance.geolocErrorCounter.get() > 1) {
                                Materialize.Toast("La géolocalisation a échouée", 6000, "red")
                            } else {
                                instance.geolocErrorCounter.set(1)
                                console.log("test")
                                Materialize.Toast("Veillez réessayer de vous localiser", 6000, "orange")
                            }
                            //si c'est bon
                        } else if (result) {
                            let address = result.data.address;
                            //on formate le tableau a renvoyer a la methode
                            let attribute = [
                                //on arrondi a deux décimales pour ne pas stocker en base des info dont la précision ne sont pas nécessaire
                                Math.round(parseFloat(latLng.lat) * 100) / 100,
                                Math.round(parseFloat(latLng.lng) * 100) / 100,
                                address.town,
                                address.country
                            ];
                            //on instancie la classe user avec notre utilisateur courant
                            if (instance.owner.get() === "user") {
                                let currentUser = User.findOne(Meteor.userId())
                                //et on utilise la méthode
                                currentUser.applyMethod('updateSelfLocation',
                                    attribute,
                                    function (error, result) {
                                        //on renvoie le resutat de l'opération a l'utilisateur
                                        if (error) {
                                            Materialize.toast(error.message, 6000, "red")
                                        } else {
                                            instance.editingLocation.set(false)
                                            //on enleve les infobulles
                                            $('.tooltipped').tooltip('remove');
                                            //et on les remets apres un court délai (pour eviter que ne reste affichée
                                            // celle qui etait en hover au moment du click)
                                            Meteor.setTimeout(function () {
                                                $('.tooltipped').tooltip({delay: 50});
                                            }, 100)
                                            Materialize.toast("Votre position a été mise à jour", 6000, "green")
                                        }
                                    })
                            } else if (instance.owner.get() === "project") {
                                let currentProject = Project.findOne(instance.data.projectId);
                                //puis on lui applique la methode

                                currentProject.applyMethod('updateProjectLocation',
                                    attribute,
                                    function (error, result) {
                                        //on renvoie le resutat de l'opération a l'utilisateur
                                        if (error) {
                                            Materialize.toast(error.message, 6000, "red")
                                        } else {
                                            instance.editingLocation.set(false)
                                            //on enleve les infobulles
                                            $('.tooltipped').tooltip('remove');
                                            //et on les remets apres un court délai (pour eviter que ne reste affichée
                                            // celle qui etait en hover au moment du click)
                                            Meteor.setTimeout(function () {
                                                $('.tooltipped').tooltip({delay: 50});
                                            }, 100)
                                            Materialize.toast("La localisation du projet à été mise à jour", 6000, "green")
                                        }
                                    })

                            }
                        }
                    }
                )
            }
        })
    },
    /*****************************************
     *  "autocomplétion" de la saisie de l'adresse utilisateur
     ******************************************/
    'keyup .location-search-field, submit form': function (event, instance) {
        event.preventDefault();
        //on recupere la ville rentrée par l'utilisateur
        let addressContent = $('.location-search-field').val();
        //on commence à faire tourner qu'apres 3 caractères rentrés
        if (addressContent.length >= 4) {
            //on memorise le timestamp de l'event
            instance.lastKeyUpTime.set(event.timeStamp);
            //le bloc qui suit est dans un retardateur afin de ne pas surcharger inutilement l'api nominatim
            Meteor.setTimeout(function () {
                //on check que c'est bien levent de la derniere lettre rentrée par l'utilisateur, afin que la suite ne se fasse que pour le dernier vent listé
                if (instance.lastKeyUpTime.get() === event.timeStamp) {
                    //on remplace les espaces par des "&"
                    let query = addressContent.replace(new RegExp(' ', 'g'), "&");
                    //puis on fait la requete a nominatim
                    HTTP.call("GET",
                        "http://nominatim.openstreetmap.org/search/" + query + "?format=json&limit=5&addressdetails=1",
                        function (error, result) {
                            //en cas d'erreur on renvoie une info à l'utilisateur
                            if (error) {
                                Materialize.toast("Ce service est momentanément indisponible", 6000, "red")
                            }
                            //sinon, on renvoie les differents choix possibles via la réactive var
                            else {
                                instance.searchResults.set(result.data)
                                //et on active les bulles d'infos pour ce bloc qui s'est ajouté au dom
                                Meteor.setTimeout(function () {
                                    $('.tooltipped').tooltip({delay: 50});
                                }, 100)
                            }
                        })
                }
            }, 650)
        }
    },
    /*************************************
     * lorqu'on selectionne une des villes proposées
     *****************************************/
    'click [chooseAddress]': function (event, instance) {
        //on récupere l'id du bouton cliqué (ajouté par le template
        let choosenAddressId = event.currentTarget.id.substr(-1, 1);
        //on en déduit l'adresse selectionné telle que récupérée dans les données de l'api nominatim
        let choosenAddress = instance.searchResults.get()[choosenAddressId];
        //on formate le tableau a envoyer a la methode
        let attribute = [
            parseFloat(choosenAddress.lat),
            parseFloat(choosenAddress.lon),
            choosenAddress.address.city,
            choosenAddress.address.country
        ];
        //on instancie la classe User avec l'utilisateur courant
        let currentUser = User.findOne(Meteor.userId());
        //puis on lance la methode
        if (instance.owner.get() === "user") {
            currentUser.applyMethod('updateSelfLocation',
                attribute,
                function (error, result) {
                    //on renvoie le resutat de l'opération a l'utilisateur
                    if (error) {
                        Materialize.toast(error.message, 6000, "red")
                    } else {
                        Materialize.toast("Votre position a été mise à jour", 6000, "green")
                        instance.editingLocation.set(false)
                        //on clos le formulaire de recherche
                        instance.useSearchForm.set(false)
                        //on réinitialise le tableau des réponses de nominatim
                        instance.searchResults.set([])
                        //on enleve les infobulles
                        $('.tooltipped').tooltip('remove');
                        //et on les remets apres un court délai (pour eviter que ne reste affichée
                        // celle qui etait en hover au moment du click)
                        Meteor.setTimeout(function () {
                            $('.tooltipped').tooltip({delay: 50});
                        }, 100)
                    }
                })
        } else if (instance.owner.get() === "project") {
            let currentProject = Project.findOne(instance.data.projectId);
            //puis on lui applique la methode

            currentProject.applyMethod('updateProjectLocation',
                attribute,
                function (error, result) {
                    //on renvoie le resutat de l'opération a l'utilisateur
                    if (error) {
                        Materialize.toast(error.message, 6000, "red")
                    } else {
                        instance.editingLocation.set(false)
                        //on clos le formulaire de recherche
                        instance.useSearchForm.set(false)
                        //on réinitialise le tableau des réponses de nominatim
                        instance.searchResults.set([])
                        //on enleve les infobulles
                        $('.tooltipped').tooltip('remove');
                        //et on les remets apres un court délai (pour eviter que ne reste affichée
                        // celle qui etait en hover au moment du click)
                        Meteor.setTimeout(function () {
                            $('.tooltipped').tooltip({delay: 50});
                        }, 100)
                        Materialize.toast("La localisation du projet à été mise à jour", 6000, "green")
                    }
                })

        }
    }
});

Template.editLocation.onCreated(function () {
    //booléen pour l'affichage du formulaire
    this.useSearchForm = new ReactiveVar(false);
    //compteur d'erreur
    this.geolocErrorCounter = new ReactiveVar(0);
    //resultats de l'api nominatim
    this.searchResults = new ReactiveVar();
    //chek de la derniere touche pressée pour eviter la surcharge de nominatim
    this.lastKeyUpTime = new ReactiveVar()
    this.editingLocation = new ReactiveVar(false)
    this.owner = new ReactiveVar(Template.instance().data.owner)
});

Template.editLocation.onRendered(function () {
    //initialisation des bulles d'info
    $('.tooltipped').tooltip({delay: 50});
});

Template.editLocation.onDestroyed(function () {
    //add your statement here
});