
import {Class} from 'meteor/jagi:astronomy';

/*******************************
 * classe des entité raccorcie, elle permet d'avoir les info rapides sur l'utilisateur ou le projet directement dans les doncuments dont elle est l'enfant
 */
const ShortendEntity = Class.create({
    name: 'ShortendEntity',
    fields: {
        speaker_id: String,
        isProject : Boolean,
        imgUrl : String,
        name : String,
    },
});
export default ShortendEntity
