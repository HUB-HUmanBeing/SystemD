import {Class} from 'meteor/jagi:astronomy';
import Comments from "../../lib/collections/Comments";

const Comment = Class.create({
    name: 'Comment',
    collection: Comments,
    fields: {

        projectId: {
            type: String,
            index:1
        },
        publicationId: {
            type: String,
            index:1
        },
        commentId:{
            type: String,
            index:1,
            optional:true
        },
        isRootComment:{
            type: Boolean,
            index:1
        },
        createdBy: { //memberId of the admin who emit the Comment
            type: String
        },
        symEnc_content: {
            type:String
        },
        createdAt: {
            type: Date,
            default: function () {
                return new Date()
            }
        }
    },
    helpers: {

    }

});

export default Comment
