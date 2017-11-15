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

    },
    /***********************************
     * ajout d'un autheur a la liste des auteurs suivis
     * @param author_id
     */
    followAuthor(author_id){
        //on vérifie les arguments
        check(author_id, String)
        //on vérifie que l'utilisateur est bien celui qui a appelé la méthode
        check(this._id, Meteor.userId())
        //on ajoute l'id a la liste des auteurs suivis
        this.profile.followedAuthors.push(author_id)
        //puis on sauvegarde
        this.save()

    },
    /*****************************************************
     * retrait d'un auteur de la liste des auteurs suivis
     * @param author_id
     */
    unFollowAuthor(author_id){
        //on vérifie les arguments
        check(author_id, String)
        //on vérifie que l'utilisateur est bien celui qui a appelé la méthode
        check(this._id, Meteor.userId())
        //on ajboucle sur les id des auteurs suivis
        this.profile.followedAuthors.forEach((followedAuthor,i)=>{
            if(followedAuthor === author_id){
                this.profile.followedAuthors.splice(i,1)
            }
        });
        //puis on sauvegarde
        this.save()
    }
});