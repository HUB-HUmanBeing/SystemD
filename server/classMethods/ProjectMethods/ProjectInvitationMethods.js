import Project from '/imports/classes/Project'
import ProjectInvitation from '/imports/classes/ProjectInvitation'
import User from '/imports/classes/User';


Project.extend({
    meteorMethods: {

        /**************************
         * methode d'invitation d'un nouvel utilisateur a rejoindre le projet
         * @param userId
         * @param invitationMessage
         * @param encryptedProjectKey
         */
        inviteUser(userId, invitationMessage,encryptedProjectKey) {
            //on check que l'utilisateur qu'on veut ajouter existe
            let invitedUser = User.findOne({_id: userId});
            check(invitedUser, User);
            //on vérifie que l'invitation est valide
            check(this.isInvitableUser(userId), true);
            //on check que l'utilisateur qui fait la demande est admin du projet'
            let adminId = Meteor.userId();
            check(this.isAdmin(adminId), true);
            //on check la clef transmise
            check(encryptedProjectKey, String);
            //on insère l'invitation dans le tableau d'invitations de l'objet courant
            this.invitations.push({
                invitationMessage: invitationMessage,
                user_id: userId,

            });
            //on enregistre, et si tout se passe bien
            this.save((err) => {
                if (!err) {
                    //on insère l'invitation dans l'instance de l'utilisateur
                    invitedUser.profile.invitations.push({
                        project_id: this._id,
                        invitationMessage: invitationMessage,
                        encryptedProjectKey : encryptedProjectKey
                    });
                    //on "envoie" une notification a l'utilisateur pour l'informer de cette invitation
                    //en remplissant son tableau de notifications avec ce message
                    invitedUser.profile.notifications.push({
                        content: 'Invitation du projet "' + this.name + '"',
                        type: "project",
                        path: Router.path("userSelfProjects")
                    });
                    //puis on sauvegarde
                    invitedUser.save()
                }
            })
        },
        /*****************************************
         * Methode de suppression d'une invitation dans le tableau des invitations,
         * elle la supprime aussi du tableau user
         */
        deleteInvitation(user_id) {
            //on verifie que l'id est bien valide
            check(user_id, String);
            //On check que l'utilisateur qui appele la methode est bien un admin du projet
            check(this.isAdmin(Meteor.userId()), true);
            //on récupere les données de l'utilisateur concerné par l'invitation
            let user = User.findOne({_id: user_id});

            //on parcoure les invitations du projet
            this.invitations.forEach((projectSideInvitation, i) => {
                //lorsqu'on trouve la bonne
                if (user._id === projectSideInvitation.user_id) {
                    //on l'enleve du tableau des invitations
                    this.invitations.splice(i, 1)
                    //puis on enregistre
                    this.save((err) => {
                        //si l'enregistrement s'est bien passé et si l'invitation etait "en attente"
                        // on va la supprimer aussi du coté user
                        if (!err) {
                            //on verifie qu'elle etait en attente
                            if (projectSideInvitation.status === "waiting") {
                                //on parcoure les invitations de l'utilisateur
                                user.profile.invitations.forEach((userSideInvitation, j) => {
                                    //si c'est la bonne ET si elle est en attente
                                    if (userSideInvitation.project_id === this._id && userSideInvitation.status === "waiting") {
                                        //on la retire du tableau des invitations de l'utilisateur
                                        user.profile.invitations.splice(j, 1)
                                        //on envoie une notificationa l'utilisateur
                                        user.profile.notifications.push({
                                        content: "Votre invitation à rejoindre le projet \""+ this.name + '" à été annulée',
                                            type: "project",
                                            path: Router.path("userSelfProjects")
                                    }),
                                        //et on sauvegarde
                                        user.save();
                                    }
                                })
                            }
                        }
                    })
                }
            });
        }
    }
});