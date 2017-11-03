import Project from '/imports/classes/Project'
import User from '/imports/classes/User';
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

    }
})