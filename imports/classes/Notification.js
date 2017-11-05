import {Class} from 'meteor/jagi:astronomy';

const Notification = Class.create({
    name: 'Notification',
    fields: {
        //contenu affiché
        content: String,
        //endroit ou elle doit etre signalée
        type: String,
        //url vers laquelle doit pointer le lien
        path: {
            type : String,
            default : "home"
        },
        sendAt :  {
            type: Date,
            default: function () {
                return new Date()
            }
        }
    },
});
export default Notification