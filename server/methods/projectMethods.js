import Projects from '/lib/collections/Projects'
Meteor.methods({
    /**************
     * renvoie true si le nom de projet n'existes pas
     * @param projectName
     * @returns {boolean}
     */
    isProjectExists : function (projectName) {
        //on verifie l'argument passé par le client
        check(projectName, String)
        //on renvoie le resultat de la verif
        return Projects.find({name : projectName}).count() === 0
    }
})