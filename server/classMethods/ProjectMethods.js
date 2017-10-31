import Project from '/imports/classes/Project'
import Member from '/imports/classes/Member'
import ProjectInvitation from '/imports/classes/ProjectInvitation'
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
            //on verifie que le nom est bien une string
            check(projectName, String)
            //on verifie que le nom n'est pas déja pris
            let alreadyExist = Projects.find({name: projectName}).count();
            check(alreadyExist, 0);
            //et qu'il fait entre 4 et 40 caractères
            let validName = projectName.length >= 4 && projectName.length <= 40;
            check(validName, true)
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
        /*****************************************
         * Methode de suppression d'une invitation dans le tableau des invitations,
         * elle la supprime aussi du tableau user
         * @param invitation
         */
        deleteInvitation(invitation) {
            //on verifie que l'invitation envoyée par le client est bien valide
            check(invitation, ProjectInvitation);
            //On check que l'utilisateur qui appele la methode est bien un admin du projet
            check(this.isAdmin(Meteor.userId()), true);
            //on récupere les données de l'utilisateur concerné par l'invitation
            let user = User.findOne({_id: invitation.user_id});

            //on parcoure les invitations du projet
            this.invitations.forEach((projectSideInvitation, i) => {
                //lorsqu'on trouve la bonne
                if (user._id === projectSideInvitation.user_id) {
                    //on l'enleve du tableau des invitations
                    this.invitations.splice(i,1)
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
                                        user.profile.invitations.splice(j,1)
                                        //et on sauvegarde
                                        user.save()
                                    }
                                })
                            }
                        }
                    })
                }
            });
        },
        giveAdminRights(memberId) {
            //On check que l'utilisateur qui appele la methode est bien un admin du projet
            check(this.isAdmin(Meteor.userId()), true);
            check(memberId, String);
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
                                if(project.project_id === this._id){
                                    //on ajoute le role admin
                                    project.status.roles.push("admin")
                                    //puis on sauvegarde
                                    project.save()
                                }
                            })
                        }
                    })
                }
            })
        },

        kickMember(memberId) {
            //On check que l'utilisateur qui appele la methode est bien un admin du projet
            check(this.isAdmin(Meteor.userId()), true);
            //on verifie que l'entrée est bien du type member
            check(memberId, String);
            //on récupere les données de l'utilisateur concerné par l'invitation
            let user = User.findOne({_id: memberId});
            //on parcoure les membres du projet
            this.members.forEach((member,i) => {
                //lorsqu'on trouve le bon
                if (member.user_id === memberId) {
                    //on retire le membre du tableau des membres
                    this.members.splice(i,1);
                    //puis on sauvegarde
                    this.save((err) => {
                        //si la sauvegarde s'est bien passée
                        if (!err) {
                            //on parcoure ensuite les projets de l'utilisateur
                            user.profile.projects.forEach((project,j) => {
                                //lorsqu'on trouve le bon
                                if(project.project_id === this._id){
                                    //on retire le projet du tableau des projet
                                    user.profile.projects.splice(j,1);
                                    //puis on sauvegarde
                                    project.save()
                                }
                            })
                        }
                    })
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

            let project = Project.findOne(this._id);

            //et on renvoie le nombre de membres -1 car il y a la valeur {} par default
            return project.members.length

        }
    }
});