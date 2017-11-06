import User from '/imports/classes/User';


User.extend({
    meteorMethods: {
        deleteNotif(type,path, content){
            //on vérifie les arguments
            check(type, String)
            if(path){
                check(path, String)
            }
            if(content){
                check(content, String)
            }

            //on vérifie que l'utilisateur est bien celui qui a appelé la méthode
            check(this._id, Meteor.userId())
            //on boucle sur les notifications de l'utilisateur
            this.profile.notifications.forEach((notification, i)=>{
                //si on a les trois arguments de la fonction
                if(type && path && content){
                    //on selectionne les notifs qui valident les 3 arguments
                    if(notification.type === type
                        && notification.path === path
                        && notification.content === content){
                        //et on les retire du tableau des notifs
                        this.profile.notifications.splice(i,1)
                    }
                    //si il y a que le type et le path,

                } else if(type && path && !content){
                    // on supprime toutes celles qui verifient les conditions
                    if(notification.type === type
                        && notification.path === path){
                        this.profile.notifications.splice(i,1)
                    }
                    //si seul le type est rentré,
                }else if(type &&!content && !path){
                    //on supprime toutes celles du type
                    if(notification.type === type){
                        this.profile.notifications.splice(i,1)
                    }
                }
            })
            //puis on sauvegarde
            return this.save()

        }
    }
})