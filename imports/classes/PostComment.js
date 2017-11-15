import {Class} from 'meteor/jagi:astronomy';
import PostComments from '/lib/collections/PostComments'

/******************************
 * Classe des commentaires des articles de blog
 **************************/
const Post = Class.create({
    name: 'PostComments',
    collection: PostComments,
    fields: {
        post_id: {//correspond a l'user_id si user, project_id si projet
            type :String,
            index : 1
        },
        createdAt: {
            type: Date,
            default: function () {
                return new Date()
            },
            index: -1
        },
        user_id : String,
        username : String,
        content: {
            type: String,
            validators: [
                {
                    type: 'maxLength',
                    param: 1000,
                    message: "la taille des commentaires est limitée à 1 000 caractère"
                }
            ],
        }
    }
})

export default Post