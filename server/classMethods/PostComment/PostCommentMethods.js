import Project from '/imports/classes/Project'
import User from '/imports/classes/User';
import Post from '/imports/classes/Post';
import PostComment from '/imports/classes/PostComment';

/*********************
 * Methodes des commentaires de blog
 */
PostComment.extend({
    meteorMethods: {
        /******************************************
         * Methode d'ajout d'un commentaire et d'envoi de notifications
         * @param post_id
         * @param content
         * @param author_id
         * @param isProject
         */
        newComment(post_id, content, author_id, isProject) {
            //check et assign de l'id du post
            check(post_id, String);
            this.post_id = post_id;
            //on récupère le post commenté pour lui ajouter un commentaire au compteur
            let commentedPost = Post.findOne({_id: post_id});
            //on check et insere le content
            check(content, String);
            this.content = content;
            //on recupere l'utilisateur courant qui vient de faire le commentaire
            let user_id = Meteor.userId();
            //on check l'id pour verifier qu'il etait ien connecté
            check(user_id, String);
            //on recupere son nom et on l'assigne ainsi que son id
            let currentUser = User.findOne({_id: user_id});
            this.user_id = user_id;
            this.username = currentUser.username
            //on sauvegarde, puis
            this.save((err) => {
                //on log l'erreur au cas ou
                if (err) {
                    console.log(err)
                    //si ya pas d'erreur, on passe aux opérations secondaires
                } else {
                    //on s'occupe d'incrémenter le nombre de commentaires de l'article dans l'objet post
                    commentedPost.nbOfComments++
                    commentedPost.save()

                    //puis on notifie l'auteur du commentaire
                    //on check l'id de l'auteur de l'article et son type
                    check(author_id, String);
                    check(isProject, Boolean);
                    //on recupere la route vers laquele devra pointer la notif
                    let route = isProject ? "projectMainPage" : "userMainPage";
                    //si c'est un article d'utilisateur
                    // todo : notif aux projets lorsque les notifs de projet seront implémentées
                    if (!isProject) {
                        //on envoie une notif seulement si c'est pas l'auteur lui meme qui commente son propre article
                        if (author_id !== currentUser._id) {
                            //on recupere l'instance user de l'auteur
                            let author = User.findOne({_id: author_id})
                            //on lui push dans sa liste de notif la notif du commentaire
                            author.profile.notifications.push({
                                content: "nouveau commentaire pour votre article \"" + commentedPost.title + "\"",
                                type: "user",
                                path: Router.path(route, {_id: author_id}, {query: "focus=" + post_id})
                            });
                            //puis on le sauvegarde
                            author.save()
                        }
                    }

                    //on notifie ensuite les commentateurs récent de l'article que la discussion se poursuit
                    let limitDate = new Date(new Date().setDate(new Date().getDate() - 5)) //(il y a 5 jours)
                    //on récupere la liste des utilisateurs vrifiant les conditions
                    let otherCommentUsersId = PostComment.find(
                        {
                            '$and': [
                                {post_id: post_id},//doivent avoir commenté le meme post
                                {user_id: {'$ne': currentUser._id}}, //doivent etre l'auteur du commentaire
                                {createdAt: {"$gte": limitDate}}//après que la date limite
                            ]
                        },
                        {user_id: 1}//todo :  verifier que ca selectionne pas trop
                    ).fetch();
                    //pour chacun de ces utilisateurs
                    otherCommentUsersId.forEach((otherCommentUserId) => {
                        //on instancie l'objet user avec leurs sonnées
                        let toNotifyUser = User.findOne({_id: otherCommentUserId.user_id})
                        //puis on leur push une notification
                        toNotifyUser.profile.notifications.push({
                            content: "nouveau commentaire sur l'article \"" + commentedPost.title + "\" que vous avez commenté",
                            type: "user",
                            path: Router.path(route, {_id: author_id}, {query: "focus=" + post_id})
                        });
                        //et enfin on sauvegarde
                        toNotifyUser.save()
                    })
                }

            })
        }
    }
})