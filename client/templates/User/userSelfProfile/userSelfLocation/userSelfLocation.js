Template.userSelfLocation.helpers({
    //add you helpers here
    useSearchForm: function () {
        return Template.instance().useSearchForm.get();
    },
    city: function () {
        return Meteor.user().profile.public.location.city
    },
    country: function () {
        return Meteor.user().profile.public.location.country
    },
    searchResults : function () {
        return Template.instance().searchResults.get();
    }
});

Template.userSelfLocation.events({
    //add your events here
    'click [useSearchForm]': function (event, instance) {

        instance.useSearchForm.set(!instance.useSearchForm.get());
        Meteor.setTimeout(function () {
            $('.location-search-field').focus();
            $('.tooltipped').tooltip({delay: 50});
        }, 200)
    },
    'click [useUserPosition] ': function (event, instance) {
        instance.useSearchForm.set(false);
        let latLng = Geolocation.latLng();
        HTTP.call("GET",
            "http://nominatim.openstreetmap.org/reverse?format=json&lat=" + latLng.lat + "&lon=" + latLng.lng + "&zoom=18&addressdetails=1",
            function (error, result) {
                if (error) {
                    if (instance.geolocErrorCounter.get() > 1) {
                        Materialize.Toast("La géolocalisation a échouée", 6000, "red")
                    } else {
                        instance.geolocErrorCounter.set(1)
                    }
                } else if (result) {
                    let address = result.data.address;
                    let profileAddress = {
                        lat: parseFloat(latLng.lat),
                        lng: parseFloat(latLng.lng),
                        city: address.town,
                        country: address.country
                    };
                    Meteor.call('updateSelfLocation',
                        profileAddress,
                        function (error) {
                            console.log(error)
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
    'keyup .location-search-field' : function (event, instance) {
        let addressContent = $('.location-search-field').val();
        if(addressContent.length > 4){
            instance.lastKeyUpTime.set(event.timeStamp);
            Meteor.setTimeout(function () {
                if(instance.lastKeyUpTime.get() === event.timeStamp){
                    let query = addressContent.replace(new RegExp(' ', 'g'),"&");
                    HTTP.call("GET",
                        "http://nominatim.openstreetmap.org/search/" + query + "?format=json&limit=5&addressdetails=1",
                        function (error, result) {
                            if (error){
                                Materialize.toast("Ce service est momentanément indisponible", 6000, "red")
                            }
                            instance.searchResults.set(result.data)
                        })
                }
            }, 750)
        }
    },
    'click [chooseAddress]' : function (event, instance) {

        let choosenAddressId = event.currentTarget.id.substr(-1, 1);
        let choosenAddress = instance.searchResults.get()[choosenAddressId];
        console.log(choosenAddress);
        let profileAddress = {
            lat: parseFloat(choosenAddress.lat),
            lng: parseFloat(choosenAddress.lon),
            city: choosenAddress.address.city,
            country: choosenAddress.address.country
        };
        Meteor.call('updateSelfLocation',
            profileAddress,
            function (error) {
                console.log(error)
                if (error) {
                    Materialize.toast(error.message, 6000, "red")
                } else {
                    Materialize.toast("Votre position a été mise à jour", 6000, "green")
                    instance.useSearchForm.set(false)
                }
            })
    }
});

Template.userSelfLocation.onCreated(function () {
    //add your statement here
    this.useSearchForm = new ReactiveVar(false);
    this.geolocErrorCounter = new ReactiveVar(0);
    this.searchResults = new ReactiveVar();
    this.lastKeyUpTime = new ReactiveVar()
});

Template.userSelfLocation.onRendered(function () {
    //add your statement here
    $('.tooltipped').tooltip({delay: 50});
});

Template.userSelfLocation.onDestroyed(function () {
    //add your statement here
});
