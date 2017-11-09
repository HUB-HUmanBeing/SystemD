import Project from '/imports/classes/Project'
import User from '/imports/classes/User';
import {ValidationError} from 'meteor/jagi:astronomy';

Project.extend({
    meteorMethods: {
        giveAdminRights(memberId) {
            //On check que l'utilisateur qui appele la methode est bien un admin du projet
            check(this.isAdmin(Meteor.userId()), true);
            check(memberId, String);
            let currentProjectId = this._id;
            //on récupere les données de l'utilisateur concerné par l'invitation
            let user = User.findOne({_id: memberId});
            //on parcoure les membres du projet
            this.members.forEach((member) => {
                //lorsqu'on trouve le bon
                if (member.user_id === memberId) {
                    //on ajoute le role admin
                    member.roles.push("admin")
                    //puis on sauvegarde
                    this.save((err) => {
                        //si la sauvegarde s'est bien passée
                        if (!err) {
                            //on parcoure ensuite les projets de l'utilisateur
                            user.profile.projects.forEach((project) => {
                                //lorsqu'on trouve le bon
                                if (project.project_id === currentProjectId) {
                                    //on ajoute le role admin
                                    project.roles.push("admin")
                                    //on "envoie" une notification a l'utilisateur pour l'informer de ce changement de role
                                    //en remplissant son tableau de notifications avec ce message
                                    user.profile.notifications.push({
                                        content: 'Vous etes désormais Admin du projet "' + this.name + '"',
                                        type: "project",
                                        path: Router.path("adminProject", {_id : this._id})
                                    });
                                    //puis on sauvegarde
                                    user.save()
                                }
                            })
                        }
                    })
                }
            })
        },
        /***********************************
         * methode de suppression d'un membre du projet
         * @param memberId
         */
        kickMember(memberId) {
            //On check que l'utilisateur qui appele la methode est bien un admin du projet
            check(this.isAdmin(Meteor.userId()), true);
            //on verifie que l'entrée est bien du type string
            check(memberId, String);
            let currentProjectId = this._id;
            //on récupere les données de l'utilisateur concerné par l'invitation
            let user = User.findOne({_id: memberId});
            //on parcoure les membres du projet
            this.members.forEach((member, i) => {
                //lorsqu'on trouve le bon
                if (member.user_id === memberId) {
                    //on retire le membre du tableau des membres
                    this.members.splice(i, 1);
                    //puis on sauvegarde
                    this.save((err) => {
                        //si la sauvegarde s'est bien passée
                        if (!err) {
                            //on parcoure ensuite les projets de l'utilisateur
                            user.profile.projects.forEach((project, j) => {
                                //lorsqu'on trouve le bon
                                if (project.project_id === currentProjectId) {
                                    //on retire le projet du tableau des projet
                                    user.profile.projects.splice(j, 1);
                                    //puis on sauvegarde
                                    //on "envoie" une notification a l'utilisateur pour l'informer de ce changement de role
                                    //en remplissant son tableau de notifications avec ce message
                                    user.profile.notifications.push({
                                        content: 'Vous ne faites plus partie des membres du projet "' + this.name + '"',
                                        type: "user"
                                    });
                                    user.save()
                                }
                            })
                        }
                    })
                }
            })
        },
        /**********************************************
         * Methode permettant de savoir si un utilisateur peut quitter le projet.
         * doit remplir les conditions :
         * --------->un admin autre que lui restant apres son depart
         * ---------> sinon, les memes conditions que si c'etait une suppression de projet
         *
         * On fait le choix de l'écrire sous forme de méthode plutot que sous forme d'helpeur
         * car elle doit etre appelée depuis une page ou l'on a pas souscrit a
         * toutes les infos nécessaires (membres et invitations)
         * @return Boolean
         *******************************/
        canCurrentUserQuit(projectId) {
            let project = Project.findOne({_id: projectId})
            //on récupere l'utilisateur courant
          const currentUserId = Meteor.userId()
            //on check qu'il soit membre

            check(project.isMember(currentUserId), true)
            //si il y a d'autres admins, l'utilisateur peut quiter sans soucis
            if (project.isThereOtherAdminsExeptCurrentUser()) {
                return true
                //sinon, on renvoie le resultat de l'helpeur "isDeletable",
                // puisque nous serons ammenés a supprimer le projet
            } else {
                return project.isDeletable()
            }

        }
    }
})