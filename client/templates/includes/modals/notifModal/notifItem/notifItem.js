import User from '/imports/classes/User'

Template.notifItem.helpers({
    //onrécupere la couleur des notifications a partir d'une deuxieme variable de session
    color: function () {
        return Session.get("formatedNotifsColor")
    }
});

Template.notifItem.events({
    //au click sur le lien
    "click [redirect]": function (event, instance) {
        //si la route pointe sur la page qu'on visite, on ferme la modale
        if (instance.data.formatedNotif.path === Iron.Location.get().path) {
            $('.modal').modal('close')
        }
        //on execute la redirection
        return true
    },
    //add your events here
    "click [deleteNotif]": function (event, instance) {
        //on récupere la nofi concernée
        let notif = instance.data.formatedNotif
        //on récupere l'utilisateur courant
        let user = User.findOne({_id: Meteor.userId()})
        //on appele la methote de suppression de la notification
        user.callMethod('deleteNotif', notif.type, notif.path, notif.content, (err) => {
            //s'il y a une erreur, on toast l'erreur
            if (err) {
                Materialize.toast("une erreur s'est produite", 4000, 'red');
            } else {
                //sinon, on attends un peu,
                Meteor.setTimeout(() => {
                    //si ya pluus de notifs on ferme la modale
                    console.log()
                    if (Session.get("formatedNotifsLength") === 0) {
                        $('.modal').modal('close')
                    }
                }, 100)

            }
        })
    }
});

Template.notifItem.onCreated(function () {

});

Template.notifItem.onRendered(function () {
    /********************************
     * Gros hack pour récuperer l'effet swipable (suprimer en glissant vers le coté)
     */
    //on initialise le dernier element swippé avec un peu d'humour
    let lastSwipped = "ta soeur";
    //yo! comment tu parles a ma soeur!

    //on reprends son sérieux avec la définition de fonction qu'on va appeler au moment ou ca swipe
    function deleteSwiped(event) {
        //on récupere les énotifications formatées dans la sessionet on boucle dessus
        Session.get("formatedNotifs").forEach((notif) => {
            //si on retrouve celle correspondant a notre id
            if (notif.id === event.currentTarget.id) {
                //on récupère l'utilisateur courant
                let user = User.findOne({_id: Meteor.userId()})
                //on appele la methote de suppression de la notification
                user.callMethod('deleteNotif', notif.type, notif.path, notif.content, (err) => {
                    //s'il y a une erreur, on toast l'erreur
                    if (err) {
                        Materialize.toast("une erreur s'est produite", 4000, 'red');
                    } else {
                        //sinon, on attends un peu,
                        Meteor.setTimeout(() => {
                            //si ya pluus de notifs on ferme la modale
                            console.log()
                            if (Session.get("formatedNotifsLength") === 0) {
                                $('.modal').modal('close')
                            }
                        }, 100)
                    }
                })
            }
        })
    }

    //grosse fonction en jquery récupéré sur un forum,
    //elle gere le comportement dissmisable
    jQuery('.dismissable').each(function() {
        jQuery(this).hammer({
            prevent_default: false
        }).bind('pan', function(e) {
            if (e.gesture.pointerType === "touch") {
                let $this = jQuery(this);

                let direction = e.gesture.direction;
                let x = e.gesture.deltaX;
                let velocityX = e.gesture.velocityX;
                $this.velocity({ translateX: x
                }, {duration: 50, queue: false, easing: 'easeOutQuad'});

                // Swipe Left
                if (direction === 4 && (x > ($this.innerWidth() / 2) || velocityX < -0.75)) {
                    var swipeLeft = true;
                    if(lastSwipped !== e.currentTarget.id){
                        deleteSwiped(e)
                        lastSwipped = e.currentTarget.id
                    }

                }

                // Swipe Right
                if (direction === 2 && (x < (-1 * $this.innerWidth() / 2) || velocityX > 0.75)) {
                    var swipeRight = true;
                    if(lastSwipped !== e.currentTarget.id){
                        deleteSwiped(e)
                        lastSwipped = e.currentTarget.id
                    }
                }
            }
        }).bind('panend', function(e) {
            // Reset if collection is moved back into original position
            if (Math.abs(e.gesture.deltaX) < (jQuery(this).innerWidth() / 2)) {
                var swipeRight = false;
                var swipeLeft = false;
            }

            if (e.gesture.pointerType === "touch") {
                let $this = jQuery(this);
                if (swipeLeft || swipeRight) {
                    let fullWidth;
                    if (swipeLeft) { fullWidth = $this.innerWidth(); }
                    else { fullWidth = -1 * $this.innerWidth(); }

                    $this.velocity({ translateX: fullWidth,
                    }, {duration: 100, queue: false, easing: 'easeOutQuad', complete:
                        function() {
                            $this.css('border', 'none');
                            $this.velocity({ height: 0, padding: 0,
                            }, {duration: 200, queue: false, easing: 'easeOutQuad', complete:
                                function() { $this.remove(); }
                            });
                        }
                    });
                }
                else {
                    $this.velocity({ translateX: 0,
                    }, {duration: 100, queue: false, easing: 'easeOutQuad'});//de ce que je comprends de leur code, c'est ici qu'on va pouvoir effectuer nos actions
                }

                swipeLeft = false;
                swipeRight = false;
            }
        });
    });
});

Template.notifItem.onDestroyed(function () {
    //add your statement here
});

