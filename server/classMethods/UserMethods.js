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
            user= User.findOne(this._id)
            //et on renvoie les infos sous forme d'objet
            return {
                nbOfProjects: user.nbOfProjects(),
                distance: user.distance()
            }
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
            user.profile.invitations.forEach((userInvitation, i)=>{

                //on trouve celle émise par le projet ET en attente
                if(userInvitation.project_id === projectId && userInvitation.status === "waiting"){
                    //on passe son status à "décliné"
                    user.profile.invitations[i].status = "declined"
                    //on sauvegarde
                    user.save(function () {
                        //dans le callback, on récupere le projet concerné
                        let project = Project.findOne({_id : projectId})
                        //on parcours les invitations émises
                        project.invitations.forEach((projectInvitation, j)=>{
                            //lorsqu'on trouve celle qui concerne l'utilisateur et qui est en attente
                            if(projectInvitation.user_id === user._id && projectInvitation.status === "waiting"){
                                //on passe son status à décliné
                                console.log(j)
                                console.log(declineMessage)
                                project.invitations[j].status = "declined"
                                console.log(project.invitations[j].status)
                                //on renseigne le champs informant des raisons de ce refus
                                project.invitations[j].answerMessage = declineMessage
                                console.log(project.invitations[j].answerMessage)
                                //enfin on sauvegarde
                                project.save(function (err, id) {
                                    console.log(err)
                                    console.log(id)
                                })
                                console.log('la deuxieme marche')
                            }
                        })
                    })
                }
            })
        },
    }
});