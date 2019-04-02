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
            default: "chat"
        },
        createdBy: {
          type:String
        },
        categoryId: {
            type:String,
            optional:true,
            index:1
        },
        symEnc_name: {
            type:String
        },
        membersToNotify: {
            type: [String],
            default: function () {
                return [];
            }
        },
        lastActivity:{
            type: Date,
            default: function () {
                return new Date()
            },
            index:-1
        },
        seenBy: {
            type: [String],
            default: function () {
                return [];
            }
        },
        isMainTopic:{
            type: Boolean,
            default: function () {
                return false
            }
        },
        publicationTotalCount:{
            type: Number,
            default: function () {
                return 0
            }
        }
    },
    helpers: {

    }

});

export default Topic
