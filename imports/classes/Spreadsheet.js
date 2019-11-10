import {Class} from 'meteor/jagi:astronomy';
import Spreadsheets from "../../lib/collections/Spreadsheets";

const SpreadsheetsContent = Class.create({
    name: 'SpreadsheetsContent',
    fields:{
        symEnc_table: {
            type:String,
            optional: true,
        }
    }
})

const Spreadsheet = Class.create({
    name: 'Spreadsheet',
    collection: Spreadsheets,
    fields: {
        projectId: {
            type: String,
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
        content:{
            type:SpreadsheetsContent,
            default: function () {
                return {};
            }
        }
    },
    helpers: {

    }

});

export default Spreadsheet
