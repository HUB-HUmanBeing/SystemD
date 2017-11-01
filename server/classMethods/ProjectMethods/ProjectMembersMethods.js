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
                                    project.status.roles.push("admin")
                                    //puis on sauvegarde
                                    user.save()
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
                                    user.save()
                                }
                            })
                        }
                    })
                }
            })
        },
    }
})