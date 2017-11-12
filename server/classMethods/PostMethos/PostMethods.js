import Project from '/imports/classes/Project'
import User from '/imports/classes/User';
import Post from '/imports/classes/Post';

Post.extend({
    meteorMethods: {
        /************************************
         * Action de création d'un nouveau post
         * @param isProject
         * @param author_id
         * @param title
         * @param content
         * @param isImageWide
         * @param imageUrl
         */
        createPost(isProject, author_id, title, content, isImageWide, imageUrl) {
            //on fait les check a la vollée pour chacunes des proprietes
            let currentUser = Meteor.user();
            check(isProject, Boolean);
            this.isProject = isProject;
            check(author_id, String);
            //si c'est un article de projet
            if (isProject) {
                let project = Project.findOne({_id: author_id});
                //on check que l'utilisateur est bien admin du projet
                check(project.isAdmin(currentUser._id), true);
                //et on transmet les données
                this.author_id = author_id;
                this.lonLat = project.publicInfo.location.lonLat;
            } else {
                //sinoon (blog user) on verifie que l'utilisateur courant est bien l'auteur
                check(currentUser._id, author_id)
                this.author_id = author_id;
                this.author_id = author_id;
                this.lonLat = currentUser.profile.location.lonLat;
            }
            //on complete le reste des champs de l'article
            check(title, String);
            this.title = title;
            check(content, String);
            this.content = content;
            check(isImageWide, Boolean);
            this.isImageWide = isImageWide;
            check(imageUrl, String);
            this.imageUrl = imageUrl;
            //puis on enregistre et on retourne l'id du nouvel article
            return this.save()
        },
        /**************************************
         * Action de supression d'un post
         */
        deletePost() {
            //on verifie que l'utilisateur qui fait la demande est soit admin du projet soit l'auteur du post
            if (this.isProject) {
                let project = Project.findOne({_id: this.author_id})
                check(project.isAdmin(Meteor.userId()), true)
            }else{
                check(this.author_id, Meteor.userId())
            }
            //et on le supprime
            return this.remove()
        }
    }
});
