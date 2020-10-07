import Project from "../../../../../imports/classes/Project";
import cryptoTools from "../../../../lib/cryptoTools";
import projectController from "../../../../lib/controllers/projectController";
import moment from 'moment'

Template.newInvitation.helpers({
    //add you helpers here
    currentProject: function () {
        return Project.findOne(FlowRouter.current().params.projectId)
    },
    remaining: function () {
        return Template.instance().remaining.get()
    },
    validityDurationOptions: function () {
        return [
            {
                value: 1,
                label: "1 " + __("newInvitation.hour")
            },
            {
                value: 24,
                label: "1 " + __("newInvitation.day")
            },
            {
                value: 24 * 7,
                label: "1 " + __("newInvitation.week")
            },
            {
                value: 24 * 30,
                label: "1 " + __("newInvitation.month")
            }
        ]
    },
    newInvitationComplete: function () {
        return Template.instance().newInvitationComplete.get()
    }
});

Template.newInvitation.events({
    //add your events here
    "change #remaining": function (event, instance) {
        instance.remaining.set(instance.logScale(event.target.value))
    },
    //on subbmit of a new invitation
    "submit #newInvitationForm": function (event, instance) {
        event.preventDefault()
        //we show the loader
        instance.newInvitationComplete.set([
            __('newInvitation.loader')
        ])
        //on garde en memoire le timestamp de début de l'opération
        let startTs = Date.now()
        //on récupere les infos du formulaire
        let validityDuration = $("#validityDuration").val()
        let remaining = instance.remaining.get()
        //on génère un password d'invitation (celui contenu dans le lien
        let password = cryptoTools.generateRandomPassword()
        //on récupere le projet et l'userProject courant
        let currentProject = Project.findOne(FlowRouter.current().params.projectId)
        let currentUserProject = projectController.getCurrentUserProject(FlowRouter.current().params.projectId)
        //on génere une clefs a partir du password généré
        cryptoTools.generateSimKeyFromPassphrase(password, (simKey) => {
            //on chiffre la clef de notre projet et le message avec cette clef issue du password
            cryptoTools.sim_encrypt_data(currentUserProject.asymEnc_projectSymKey, simKey, (symEnc_projectSymKey) => {
                //on chiffre ensuite ce password avec notre clef symétrique de projet (pour pouvoir le stocker en base et le récuperer
                cryptoTools.sim_encrypt_data(password, Session.get("currentProjectSimKey"), (symEnc_invitationPassword) => {
                    //on pré-crée des membres du projet dans lequel les utilisateurs recevant l'invitation vont piocher pour créer leurs parametre
                    let invitationMembers = []
                    for (let i = 0; i < remaining; i++) {
                        let newId = cryptoTools.generateId()
                        invitationMembers.push({
                                memberId: newId,
                                hashedAdminSignature: cryptoTools.hash(newId + projectController.getCurrentUserProject(FlowRouter.current().params.projectId).asymEnc_adminPassword)
                            }
                        )
                    }
                    //on prépare notre objet invitation a transmettre à la methode
                    let invitation = {
                        projectId: currentProject._id,
                        projectName: currentProject.name,
                        hashedPassword: cryptoTools.hash(password),
                        emittedBy: currentUserProject.asymEnc_memberId,
                        symEnc_projectSymKey: symEnc_projectSymKey,
                        validityDuration: Number(validityDuration),
                        remaining: Number(remaining),
                        invitationMembers: invitationMembers
                    }
                    //et on crée l'invitation
                    currentProject.callMethod(
                        "createInvitation",
                        //on s'authentifie
                        projectController.getAuthInfo(FlowRouter.current().params.projectId),
                        invitation, symEnc_invitationPassword,
                        (err, invitationId) => {
                            if (err) {
                                console.log(err)
                            } else {
                                //si tout se passe bien, on mesure le temps écoulé et on attends le temps nécessaire avant de rediriger l'utilisateur sur l'invitation crée
                                let duration = Date.now() - startTs
                                let finish = () => {
                                    FlowRouter.go("/project/" + FlowRouter.current().params.projectId + "/invitation/" + invitationId)
                                }
                                if (duration < 1000) {
                                    finish()
                                } else {
                                    Meteor.setTimeout(finish(), 1000 - duration)
                                }
                            }
                        })
                })
            })
        })
    }
});

Template.newInvitation.onCreated(function () {
    //add your statement here
    this.remaining = new ReactiveVar(5)
    this.newInvitationComplete = new ReactiveVar(undefined)

    this.logScale = function (i) {
      scale=[1,2,3,5,10,20,30,50,100,200]
      return scale[i]
    }

    ///Materialize changes
    var range_type = 'input[type=range]';
    var range_mousedown = false;
    var left;

    $(range_type).each(function () {
      var thumb = $('<span class="thumb"><span class="value"></span></span>');
      $('#remaining').after(thumb);
    });

    var showRangeBubble = function (thumb) {
      var paddingLeft = parseInt(thumb.parent().css('padding-left'));
      var marginLeft = -7 + paddingLeft + 'px';
      thumb.velocity({ height: "30px", width: "30px", top: "-30px", marginLeft: marginLeft }, { duration: 300, easing: 'easeOutExpo' });
    };

    var calcRangeOffset = function (range) {
      var width = range.width() - 15;
      var max = parseFloat(range.attr('max'));
      var min = parseFloat(range.attr('min'));
      var percent = (parseFloat(range.val()) - min) / (max - min);
      return percent * width;
    };

    var range_wrapper = '.range-field';

    // Listen Change
    $(document).on('change', range_type, (e) => {
      var thumb = $('#remaining').siblings('.thumb');
      thumb.find('.value').html(this.logScale($('#remaining').val()));

      if (!thumb.hasClass('active')) {
        showRangeBubble(thumb);
      }

      var offsetLeft = calcRangeOffset($('#remaining'));
      thumb.addClass('active').css('left', offsetLeft);
    });

    // Listen Mousedown
    $(document).on('mousedown touchstart', range_type, (e) => {
      var thumb = $('#remaining').siblings('.thumb');

      // Set indicator value
      thumb.find('.value').html(this.logScale($('#remaining').val()));

      range_mousedown = true;
      $('#remaining').addClass('active');

      if (!thumb.hasClass('active')) {
        showRangeBubble(thumb);
      }

      if (e.type !== 'input') {
        var offsetLeft = calcRangeOffset($('#remaining'));
        thumb.addClass('active').css('left', offsetLeft);
      }
    });

    // Listen Input
    $(document).on('input mousemove touchmove', range_wrapper, (e) => {
      var thumb = $('#remaining').siblings('.thumb');
      var left;
      var input = $('#remaining').find(range_type);

      if (range_mousedown) {
        if (!thumb.hasClass('active')) {
          showRangeBubble(thumb);
        }

        var offsetLeft = calcRangeOffset(input);
        thumb.addClass('active').css('left', offsetLeft);
        thumb.find('.value').html(this.logScale($('#remaining').val()))
      }
    });

    // Listen MouseUp
    $(document).on('mouseup touchend', range_wrapper, function () {
        range_mousedown = false;
        $(this).removeClass('active');
      });

    // Listen MouseOut
    $(document).on('mouseout touchleave', range_wrapper, function () {
    if (!range_mousedown) {

        var thumb = $(this).children('.thumb');
        var paddingLeft = parseInt($(this).css('padding-left'));
        var marginLeft = 7 + paddingLeft + 'px';

        if (thumb.hasClass('active')) {
        thumb.velocity({ height: '0', width: '0', top: '10px', marginLeft: marginLeft }, { duration: 100 });
        }
        thumb.removeClass('active');
    }
    });
});

Template.newInvitation.onRendered(function () {
    //add your statement here
    $('select').material_select();
    $('#message').characterCounter();
});

Template.newInvitation.onDestroyed(function () {
    //add your statement here
});

