import {Class} from 'meteor/jagi:astronomy';
import Posts from '/lib/collections/Posts'

/******************************
 * Classe des articles de blog
 **************************/
const Post = Class.create({
    name: 'Post',
    collection: Posts,
    fields: {
        pinned: {//permet a l'utilisateur d'epingler en haut de son fil un article
            type: Number,
            default: 0
        },
        isProject: Boolean,//si c'est false, c'est que c'est un user
        author_id: String,//correspond a l'user_id si user, project_id si projet
        lonLat: {
            type: [Number],
            optional: true,
            validators: [
                {
                    type: 'length',
                    param: 2
                }
            ],
        },
        createdAt: {
            type: Date,
            default: function () {
                return new Date()
            }
        },
        lastEdit: {
            type: Date,
            optional: true
        },
        title: {
            type: String,
            optional: true
        },
        content: {
            type: String,
            validators: [
                {
                    type: 'maxLength',
                    param: 10000,
                    message: "la taille des articles est limitée à 10 000 caractère"
                },
                {
                    type: 'minLength',
                    param: 30,
                    message: "Les articles doivent faire au moins 50 caractères"
                }
            ],
        },
        isImageWide: {
            type: Boolean,
            default: false
        },
        imageUrl: String
    }
})

export default Post