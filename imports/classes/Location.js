import {Class} from 'meteor/jagi:astronomy';
const Location = Class.create({
    name: "Location",
    fields: {
        lat: {
            type: Number,
            optional: true
        },
        lng: {
            type: Number,
            optional: true
        },
        city: {
            type: String,
            validator: [
                {
                    type: 'maxLength',
                    param: 100
                }
            ],
            optional: true
        },
        country: {
            type: String,
            validator: [
                {
                    type: 'maxLength',
                    param: 100
                }
            ],
            optional: true
        }
    }
})

export default Location;