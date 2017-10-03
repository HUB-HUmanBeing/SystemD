Template.userSelfLocation.helpers({
    //add you helpers here
    //booléen pour afficher ou non le formulaie
    useSearchForm: function () {
        return Template.instance().useSearchForm.get();
    },
    //deux petits helpers qui evitent qu'il y ait trop de code dans le template
    city: function () {
        return Meteor.user().profile.public.location.city
    },
    country: function () {
        return Meteor.user().profile.public.location.country
    },
    //contient les data qui ressortent de la recherche via nominatim
    searchResults : function () {
        return Template.instance().searchResults.get();
    }
});

Template.userSelfLocation.events({
    //affichage du formulaire au click
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
    //utilisation des donées de localisation
    'click [useUserPosition] ': function (event, instance) {
        //on referme le formulaire de rcherche
        instance.useSearchForm.set(false);
        //on recupere les données de l'utilisateur
        let latLng = Geolocation.latLng();
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
                        Materialize.Toast("Veillez réessayer de vous localiser", 6000, "blue")
                    }
                    //si c'est bon
                } else if (result) {
                    let address = result.data.address;
                    //on formate un json a renvoyer a la methode
                    let profileAddress = {
                        lat: parseFloat(latLng.lat),
                        lng: parseFloat(latLng.lng),
                        city: address.town,
                        country: address.country
                    };
                    //et on utilise la méthode
                    Meteor.call('updateSelfLocation',
                        profileAddress,
                        function (error) {
                        //on renvoie le resutat de l'opération a l'utilisateur
                            if (error) {
                                Materialize.toast(error.message, 6000, "red")
                            } else {
                                Materialize.toast("Votre position a été mise à jour", 6000, "green")
                            }
                        })
                }
            }
        )
    },
    //"autocomplétion de la saisie de l'adresse utilisateur
    'keyup .location-search-field, submit form' : function (event, instance) {
        event.preventDefault();
        //on recupere la ville rentrée par l'utilisateur
        let addressContent = $('.location-search-field').val();
        //on commence à faire tourner qu'apres 3 caractères rentrés
        if(addressContent.length >= 4){
            //on memorise le timestamp de l'event
            instance.lastKeyUpTime.set(event.timeStamp);
            //le bloc qui suit est dans un retardateur afin de ne pas surcharger inutilement l'api nominatim
            Meteor.setTimeout(function () {
                //on check que c'est bien levent de la derniere lettre rentrée par l'utilisateur, afin que la suite ne se fasse que pour le dernier vent listé
                if(instance.lastKeyUpTime.get() === event.timeStamp){
                    //on remplace les espaces par des "&"
                    let query = addressContent.replace(new RegExp(' ', 'g'),"&");
                    //puis on fait la requete a nominatim
                    HTTP.call("GET",
                        "http://nominatim.openstreetmap.org/search/" + query + "?format=json&limit=5&addressdetails=1",
                        function (error, result) {
                        //en cas d'erreur on renvoie une info à l'utilisateur
                            if (error){
                                Materialize.toast("Ce service est momentanément indisponible", 6000, "red")
                            }
                            //sinon, on renvoie les differents choix possibles via la réactive var
                            else{
                                instance.searchResults.set(result.data)
                                //et on active les bulles d'infos pour ce bloc qui s'est ajouté au dom
                                Meteor.setTimeout(function () {
                                    $('.tooltipped').tooltip({delay: 50});
                                }, 100)
                            }
                        })
                }
            }, 750)
        }
    },
    //lorqu'on selectionne une des villes proposées
    'click [chooseAddress]' : function (event, instance) {
        //on récupere l'id du bouton cliqué (ajouté par le template
        let choosenAddressId = event.currentTarget.id.substr(-1, 1);
        //on en déduit l'adresse selectionné telle que récupérée dans les données de l'api nominatim
        let choosenAddress = instance.searchResults.get()[choosenAddressId];
        //on formate le json a envoyer a la methode
        let profileAddress = {
            lat: parseFloat(choosenAddress.lat),
            lng: parseFloat(choosenAddress.lon),
            city: choosenAddress.address.city,
            country: choosenAddress.address.country
        };
        //puis on lance la methode
        Meteor.call('updateSelfLocation',
            profileAddress,
            function (error) {
                console.log(error)
                if (error) {
                    Materialize.toast(error.message, 6000, "red")
                } else {
                    //si c'est bon on renvoie un message de succes
                    Materialize.toast("Votre position a été mise à jour", 6000, "green")
                    //et on clos le formulaire
                    instance.useSearchForm.set(false)
                    //on enleve les infobulles
                    $('.tooltipped').tooltip('remove');
                    //et on les remets apres
                    Meteor.setTimeout(function () {
                        $('.tooltipped').tooltip({delay: 50});
                    }, 100)
                }
            })
    }
});

Template.userSelfLocation.onCreated(function () {
    //booléen pour l'affichage du formulaire
    this.useSearchForm = new ReactiveVar(false);
    //compteur d'erreur
    this.geolocErrorCounter = new ReactiveVar(0);
    //resultats de l'api nominatim
    this.searchResults = new ReactiveVar();
    //chek de la derniere touche pressée pour eviter la surcharge de nominatim
    this.lastKeyUpTime = new ReactiveVar()
});

Template.userSelfLocation.onRendered(function () {
    //initialisation des bulles d'info
    $('.tooltipped').tooltip({delay: 50});
});

Template.userSelfLocation.onDestroyed(function () {
    //add your statement here
});
