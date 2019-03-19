import {Class} from 'meteor/jagi:astronomy';
import Topics from "../../lib/collections/Topics";


const Topic = Class.create({
    name: 'Topic',
    collection: Topics,
    fields: {
        projectId: {
            type: String,
            index: 1
        },
        type: {
            type: String,
        },
        categoryId: String,
        symEnc_name: {
            type:String
        },
        membersToNotify: {
            type: [String],
            default: function () {
                return [];
            }
        },
        createdAt: {
            type: Date,
            default: function () {
                return new Date()
            }
        },
    },
    helpers: {
    }

});

export default Topic
