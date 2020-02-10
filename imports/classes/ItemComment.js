import {Class} from 'meteor/jagi:astronomy';
import ItemComments from '../../lib/collections/ItemComments';

const ItemComment = Class.create({
    name:'ItemComment',
    collection: ItemComments,
    fields:{
        projectId: {
            type: String,
            index: 1
        },
        itemId: {
            type: String,
            index: 1
        },
        itemType: {
            type: String
        },
        createdBy: {
            type: String
        },
        symEnc_content: {
            type: String
        },
        createdAt: {
            type: Date,
            default: function() {
                return new Date()
            }
        }
    },
    helpers: {}
});

export default ItemComment