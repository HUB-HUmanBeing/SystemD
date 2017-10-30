import Project from '/imports/classes/Project'
import User from '/imports/classes/User';
import Projects from '/lib/collections/Projects'
import {ValidationError} from 'meteor/jagi:astronomy';

Project.extend({
    meteorMethods: {

        /*****************************
         * methode de creation d'un nouveau projet
         * @param projectName String
         *******************************/
        'createProject': function (projectName) {
            //on verifie que le nom n'est pas déja pris
            let alreadyExist = Projects.find({name: projectName}).count();
            check(alreadyExist, 0);
            //on check que l'utilisateur est bien connecté
            check(Meteor.userId(), String);
            //on modifie le nom
            this.name = projectName;
            //on rajoute l'utilisateur courant comme admin du projet
            this.members.push({
                user_id: Meteor.userId(),
                username: Meteor.user().username,
                roles: ['member', 'admin']
            });

            //On véfirie la validité de la valeur du champ "name" avec les validators de la classe.
            this.validate({
                fields: ['name']
            }, (err) => {
                //Si la valeur n'est pas valide, on arrète la méthode en renvoyant une Meteor.error.
                if (ValidationError.is(err)) {
                    throw new Meteor.Error();
                } else {
                    // sinon on sauvegarde le projet, puis
                    return this.save(function (err, id) {
                        //si il n'y a pas d'erreur
                        if (!err) {
                            //on recupere l'objet astronomy de l'utilisateur actuel
                            let user = User.findOne(Meteor.userId());
                            //on ajoute le projet créé
                            user.profile.projects.push({
                                project_id: id,
                                name: projectName,
                                roles: ['member', 'admin']
                            });
                            //et on sauvegarde
                            user.save()
                        }
                    });
                }
            })
        },


        updateInfoItem(key, value) {
            //on check que l'utilisateur est bien admin du projet
            check(key, String);
            check(this.isAdmin(Meteor.userId()), true);
            this.publicInfo[key] = value;
            return this.save()


        },
        /**********************************
         * modifie la localisation du projet
         * @param lat
         * @param lng
         * @param city
         * @param country
         */
        updateProjectLocation(lat, lng, city, country) {
            //on check que l'utilisateur est bien admin du projet
            check(this.isAdmin(Meteor.userId()), true);
            this.publicInfo.location.lonLat = [lng, lat];
            this.publicInfo.location.city = city;
            this.publicInfo.location.country = country;
            return this.save()

        },
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
            check(this.isInvitableUser(userId), true);
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

        },
        /*******************************
         * renvoie le nombre d'utilisateurs participant au projet
         * @return Number
         */
        numberOfMembers() {
            //on recupere l'object utilisateur complet (car en théorie l'utilisateur
            // courant n'a que l'objet amputé des info non publiées)
            project = Project.findOne(this._id);
            //et on renvoie le nombre de membres -1 car il y a la valeur {} par default
            return project.members.length

        }
    }
});