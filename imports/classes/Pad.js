import {Class} from 'meteor/jagi:astronomy';
import Pads from "../../lib/collections/Pads";


const Padchange = Class.create({
    name: 'Padchange',
    fields:{
        symEnc_change: {
            type:String
        },
        createdAt:{
            type: Date,
            default: function () {
                return new Date()
            }
        },
        createdBy: {
            type:String
        },
    }
})
const Cursor = Class.create({
    name: 'Cursor',
    fields:{
        range: {
            type: String
        },
        updatedAt:{
            type: Date,
            default: function () {
                return new Date()
            }
        },
        memberId: {
            type:String
        },
    }
})

const Pad = Class.create({
    name: 'Pad',
    collection: Pads,
    fields: {
        projectId: {
            type: String,
            index: 1
        },
        categoryId: {
            type: String,
            optional: true,
            index: 1
        },
        createdBy: {
          type:String
        },
        symEnc_name: {
            type:String
        },
        lastActivity:{
            type: Date,
            default: function () {
                return new Date()
            },
            index:-1
        },
        symEnc_content: {
            type:String,
            optional: true,
        },
        changes: {
            type: [Padchange],
            default: function () {
                return [];
            }
        },
        cursors: {
            type: [Cursor],
            default: function () {
                return [];
            }
        }
    },
    helpers: {

    }

});

export default Pad
