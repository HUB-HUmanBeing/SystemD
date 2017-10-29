import {Class} from 'meteor/jagi:astronomy';

const Location = Class.create({
    name: "Location",
    fields: {
        lonLat: {
            type: [Number],
            optional: true,
            validator: [
                {
                    type: 'length',
                    param: 2
                }
            ],
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