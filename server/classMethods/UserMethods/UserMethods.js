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
           let user = User.findOne(this._id);
            //et on renvoie les infos sous forme d'objet
            return {
                nbOfProjects: user.nbOfProjects(),
                distance: user.distance()
            }
        },
    }
});