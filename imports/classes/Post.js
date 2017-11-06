import {Class} from 'meteor/jagi:astronomy';
import Posts from '/lib/collections/Posts'

/******************************
 * Classe des articles de blog
 **************************/
const Posts = Class.create({
    name: 'Posts',
    collection: Posts,
    fields: {
        pinned: {//permet a l'utilisateur d'epingler en haut de son fil un article
            type: Number,
            default: 0
        },
        isProject: Boolean,
    }
}
