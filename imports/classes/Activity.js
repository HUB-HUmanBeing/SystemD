import {Class} from 'meteor/jagi:astronomy';
import Activities from "../../lib/collections/Activities";

const Activity = Class.create({
    name: 'Activity',
    collection: Activities,
    fields: {
        projectId: {
            type: String,
            index: 1
        },
        createdBy: {
            type: String
        },
        symEnc_title:{
            type:String,
            optional: true
        },
        symEnc_detail:{
            type:String,
            optional: true
        },
        taskListId:{
            type: String,
            optional:true
        },
        color:{
            type: Number,
            default:0
        },
        allDay:{
            type: Boolean,
            default:false
        },
        start:{
            type: Date,
            optional:true,
            index: -1
        },
        end:{
            type: Date,
            optional:true,
            index: -1
        },
        createdAt: {
            type: Date,
            default: function () {
                return new Date()
            },
            index: -1
        },
        commentCount: {
            type: Number,
            default: function () {
                return 0
            }
        },
        waitingResponseOf: {
            type: [String],
            default: function () {
                return [];
            }
        },
        participants: {
            type: [String],
            default: function () {
                return [];
            }
        }
    },
    helpers: {}

});

export default Activity
