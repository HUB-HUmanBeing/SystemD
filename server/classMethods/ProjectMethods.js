import Project from '/imports/classes/Project'
import User from '/imports/classes/User';

Project.extend({
    meteorMethods: {

        /**************************
         * methode d'invitation d'un nouvel utilisateur a rejoindre le projet
         * @param userId
         * @param invitationMessage
         */
        inviteUser(userId, invitationMessage) {
            //on check que l'utilisateur qu'on veut ajouter existe
            let invitedUser = User.findOne({_id: userId});
            check(invitedUser, User);
            //on vérifie que l'invitation est valide
            check(this.isInvitableUser(userId), true)
            //on check que l'utilisateur qui fait la demande est admin du projet'
            let adminId = Meteor.userId();
            check(this.isAdmin(adminId), true);

            //on insère l'invitation dans le tableau d'invitations de l'objet courant
            this.invitations.push({
                adminId: adminId,
                invitationMessage: invitationMessage,
                user_id: userId
            });
            //on enregistre, et si tout se passe bien
            this.save((err) => {

                if (!err) {
                    //on insère l'invitation dans l'instance de l'utilisateur
                    invitedUser.profile.invitations.push({
                        project_id: this._id,
                        invitationMessage: invitationMessage
                    });
                    //puis on sauvegarde
                    invitedUser.save()
                }
            })

        }
    }
})