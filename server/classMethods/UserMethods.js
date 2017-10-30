import User from '/imports/classes/User';
import Project from '/imports/classes/Project';


User.extend({
    meteorMethods: {
        /******************************
         * Methode utilisateur uniquement dispo coté serveur,
         * elle renvoie a un utilisateur sa distance relative
         * a un autre ainsi que son nombre d'utilisateur
         */
        computedInfo() {
            //on recupere l'object utilisateur complet (car en théorie l'utilisateur
            // courant n'a que l'objet amputé des info non publiées)
           let user = User.findOne(this._id);
            //et on renvoie les infos sous forme d'objet
            return {
                nbOfProjects: user.nbOfProjects(),
                distance: user.distance()
            }
        },
        //modification de la description utilisateur
        updateProfileItem(key, value) {
            check(key, String);
            if (this._id === Meteor.userId()) {
                this.profile[key] = value;

                return this.save()
            }
        },
        //changement de la position de l'utilisateur
        updateSelfLocation(lat, lng, city, country) {
            //on verifie que c'est bien l'utilisateur courant qui fait la demande pour lui meme
            if (this._id === Meteor.userId()) {
                this.profile.location.lonLat = [lng,lat];
                this.profile.location.city = city;
                this.profile.location.country = country;
                return this.save()
            }
        },
        /**********************************
         * Methode d'acceptation d'une invitation a se joindre a un projet
         * @param projectId
         ********************************/
        acceptInvitation(projectId) {
            check(projectId, String);
            let currentUserId = Meteor.userId();
            let user = User.findOne(currentUserId);
            // on récupere le projet concerné
            let project = Project.findOne({_id: projectId});
            //on parcours le tableau des invitations recues
            user.profile.invitations.forEach((userInvitation, i) => {

                //on trouve celle émise par le projet ET en attente
                if (userInvitation.project_id === projectId && userInvitation.status === "waiting") {
                    //on supprime l'invitation du tableau
                    user.profile.invitations.splice(i);
                    user.profile.projects.push({
                        project_id: projectId,
                        name : project.name
                    });
                    //on sauvegarde
                    user.save(function (err) {
                        if(!err){
                            //dans le callback,
                            //on parcours les invitations émises
                            project.invitations.forEach((projectInvitation) => {
                                //lorsqu'on trouve celle qui concerne l'utilisateur et qui est en attente
                                //(sécurité : si l'utilisateur n'est pas dans le tableau des invités ça ne fonctionne pas)
                                if (projectInvitation.user_id === user._id && projectInvitation.status === "waiting") {
                                    //on passe le status de l'invitation a acceptée
                                    projectInvitation.status = "accepted";
                                    //et on ajoute l'utilisateur a la liste des membres du projet
                                    project.members.push({user_id : user._id})
                                    //enfin on sauvegarde
                                    project.save()
                                }
                            })
                        }
                    })
                }
            })
        },
        /***************************
         * méthode appelée par l'utilisateur pour refuser l'invitation qu'on lui a faite
         * a se joindre a un projet
         * @param projectId
         * @param declineMessage
         *********************************/
        declineInvitation(projectId, declineMessage) {
            //on check les arguments passés par le client
            check(projectId, String);
            check(declineMessage, String);
            //on récupere l'utilisateur courant
            let user = User.findOne(Meteor.userId());
            //on parcours le tableau des invitations recues
            user.profile.invitations.forEach((userInvitation, i) => {

                //on trouve celle émise par le projet ET en attente
                if (userInvitation.project_id === projectId && userInvitation.status === "waiting") {
                    //on passe son status à "décliné"
                    user.profile.invitations[i].status = "declined";
                    //on sauvegarde
                    user.save(function (err) {
                        if(!err){
                            //dans le callback, on récupere le projet concerné
                            let project = Project.findOne({_id: projectId});
                            //on parcours les invitations émises
                            project.invitations.forEach((projectInvitation, j) => {
                                //lorsqu'on trouve celle qui concerne l'utilisateur et qui est en attente
                                if (projectInvitation.user_id === user._id && projectInvitation.status === "waiting") {
                                    //on passe son status à décliné
                                    project.invitations[j].status = "declined";
                                    //on renseigne le champs informant des raisons de ce refus
                                    project.invitations[j].answerMessage = declineMessage;
                                    //enfin on sauvegarde
                                    project.save()
                                }
                            })
                        }

                    })
                }
            })
        },
    }
});