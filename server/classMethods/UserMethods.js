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
            user = User.findOne(this._id)
            //et on renvoie les infos sous forme d'objet
            return {
                nbOfProjects: user.nbOfProjects(),
                distance: user.distance()
            }
        },
        /**********************************
         * Methode d'acceptation d'une invitation a se joindre a un projet
         * @param projectId
         ********************************/
        acceptInvitation(projectId) {
            check(projectId, String)
            user = User.findOne(Meteor.userId());
            // on récupere le projet concerné
            let project = Project.findOne({_id: projectId})
            //on parcours le tableau des invitations recues
            user.profile.invitations.forEach((userInvitation, i) => {

                //on trouve celle émise par le projet ET en attente
                if (userInvitation.project_id === projectId && userInvitation.status === "waiting") {
                    //on supprime l'invitation du tableau
                    user.profile.invitations.splice(i)
                    user.profile.projects.push({
                        project_id: projectId,
                        name : project.name
                    })
                    //on sauvegarde
                    user.save(function () {
                        //dans le callback,
                        //on parcours les invitations émises
                        project.invitations.forEach((projectInvitation, j) => {
                            //lorsqu'on trouve celle qui concerne l'utilisateur et qui est en attente
                            //(sécurité : si l'utilidateur n'est pas dans le tableau des invités ca ne sonctionne pas)
                            if (projectInvitation.user_id === user._id && projectInvitation.status === "waiting") {
                                //on supprime l'invitation du tableau
                                project.invitations.splice(j)
                                project.members.push({
                                    user_id: Meteor.userId()
                                });
                                //enfin on sauvegarde
                                project.save()
                            }
                        })
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
            check(projectId, String)
            check(declineMessage, String)
            //on récupere l'utilisateur courant
            user = User.findOne(Meteor.userId());
            //on parcours le tableau des invitations recues
            user.profile.invitations.forEach((userInvitation, i) => {

                //on trouve celle émise par le projet ET en attente
                if (userInvitation.project_id === projectId && userInvitation.status === "waiting") {
                    //on passe son status à "décliné"
                    user.profile.invitations[i].status = "declined"
                    //on sauvegarde
                    user.save(function () {
                        //dans le callback, on récupere le projet concerné
                        let project = Project.findOne({_id: projectId})
                        //on parcours les invitations émises
                        project.invitations.forEach((projectInvitation, j) => {
                            //lorsqu'on trouve celle qui concerne l'utilisateur et qui est en attente
                            if (projectInvitation.user_id === user._id && projectInvitation.status === "waiting") {
                                //on passe son status à décliné
                                project.invitations[j].status = "declined"
                                //on renseigne le champs informant des raisons de ce refus
                                project.invitations[j].answerMessage = declineMessage
                                //enfin on sauvegarde
                                project.save()
                            }
                        })
                    })
                }
            })
        },
    }
});