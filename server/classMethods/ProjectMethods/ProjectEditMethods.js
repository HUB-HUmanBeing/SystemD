import Project from '/imports/classes/Project'
import User from '/imports/classes/User';
import Projects from '/lib/collections/Projects'
import {ValidationError} from 'meteor/jagi:astronomy';

Project.extend({
    meteorMethods: {

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
        /******************************
         * Methode de suppression d'un projet
         */
        deleteProject(){
            //on check que l'utilisateur est admin du projet
            check(this.isAdmin(Meteor.userId()), true);
            //on check que le projet est bien supprimable
            check(this.isDeletable(), true)
            //on instancie l'admin
            let admin = User.findOne({_id :  Meteor.userId()});
            //on boucle sur les projets de l'utilisateur
            admin.profile.projects.forEach((project, i )=>{
                if(project.project_id === this._id){
                    admin.profile.projects.splice(i, 1)
                    admin.save((err)=>{
                        if(!err){
                            this.remove()
                        }
                    })
                }
            })

        }
    }
})