Template.userSelfLocation.helpers({
    //add you helpers here
    useSearchForm : function () {
        return Template.instance().useSearchForm.get();
    },
    city : function () {
        return Meteor.user().profile.public.location.city
    },
    country: function () {
        return Meteor.user().profile.public.location.country
    }
});

Template.userSelfLocation.events({
    //add your events here
    'click [useSearchForm]' : function (event,instance) {

        instance.useSearchForm.set(!instance.useSearchForm.get());
        Meteor.setTimeout(function () {
            $('.tooltipped').tooltip({delay: 50});
        }, 200)
    },
    'click [useUserPosition] ' : function (event, instance) {
        instance.useSearchForm.set(false);
        let latLng = Geolocation.latLng();

        HTTP.call("GET",
            "http://nominatim.openstreetmap.org/reverse?format=json&lat=" + latLng.lat + "&lon=" + latLng.lng + "&zoom=18&addressdetails=1",
            function (error, result) {
                if(error){
                    if (instance.geolocErrorCounter.get() > 1){
                        Materialize.Toast("La géolocalisation a échouée", 6000, "red")
                    }else {(
                        instance.geolocErrorCounter.set(1)
                    )}
                }else if(result){

                    let address = result.data.address;
                    let profileAddress = {
                        lat: parseFloat(latLng.lat),
                        lng: parseFloat(latLng.lng),
                        city : address.town,
                        country : address.country
                    };
                    Meteor.call('updateSelfLocation',
                         profileAddress,
                        function (error) {
                            if(error){
                                Materialize.Toast(error.message, 6000, "red")
                            }else{
                                Materialize.Toast("Votre position a été mise à jour", 6000, "green")
                            }

                    })

                }
            }
        )
    }
});

Template.userSelfLocation.onCreated(function () {
    //add your statement here
    this.useSearchForm = new ReactiveVar(false);
    this.geolocErrorCounter = new ReactiveVar(0);
});

Template.userSelfLocation.onRendered(function () {
    //add your statement here
    $('.tooltipped').tooltip({delay: 50});
});

Template.userSelfLocation.onDestroyed(function () {
    //add your statement here
});
