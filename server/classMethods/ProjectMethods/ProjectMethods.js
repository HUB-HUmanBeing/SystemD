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