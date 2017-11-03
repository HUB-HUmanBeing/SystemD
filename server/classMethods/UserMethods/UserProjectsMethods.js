import User from '/imports/classes/User';
import Project from '/imports/classes/Project';


User.extend({
    meteorMethods: {
        quitProject(projectId) {
            let currentUserId = Meteor.userId()
                //on check que l'instance d'User est bien celle de l'utilisateur courant
            check(this._id, currentUserId)
            //on verifie que l'entrée est bien du type string
            check(projectId, String);
            let projectToQuit = Project.findOne({_id : projectId})
            //on check que le projet est bien quitable
            projectToQuit.callMethod('canCurrentUserQuit',
                projectId,
                (err, result)=>{
                //si il n'y a pas d'erreur
                if(!err){
                    //on verifie que l'utilisateur courant peut bien quiter le projet
                    check(result, true)
                    //on regarde ensuite si on est dans la situation ou
                    // il y a juste a quitter le projet, ou si l'on doit aussi le fermer au passage
                    if(projectToQuit.isThereOtherAdminsExeptCurrentUser()){
                        //on parcoure les membres du projet
                        console.log("premier cas")
                        projectToQuit.members.forEach((member, i) => {
                            //lorsqu'on trouve l'utilisateur courant
                            if (member.user_id === currentUserId) {
                                //on retire l'utilisateur courant du tableau des membres
                                projectToQuit.members.splice(i, 1);
                                //puis on sauvegarde
                                projectToQuit.save((err) => {

                                    //si la sauvegarde s'est bien passée
                                    if (!err) {
                                        console.log("premier cas")
                                        //on parcoure ensuite les projets de notre instance d'utilisateur appelée
                                        this.profile.projects.forEach((project, j) => {
                                            //lorsqu'on trouve le projet correspondant a celui qu'on veut retirer
                                            if (project.project_id === projectId) {
                                                //on retire le projet du tableau des projet
                                                this.profile.projects.splice(j, 1);
                                                //puis on sauvegarde
                                                console.log('pret a sauvegarder')
                                                this.save()
                                            }
                                        })
                                    }
                                })
                            }
                        })
                    //sinon, c'est qu'on doit supprimer le projet
                    }else if(projectToQuit.isDeletable()){
                        console.log("deuxieme cas")
                        //on appelle alors la methode correspondant a la suppression de projet
                        projectToQuit.callMethod("deleteProject")
                    }
                }
            })

        },
    }
})