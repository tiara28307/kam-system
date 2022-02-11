import * as mongoose from 'mongoose';

export const customerSchema = new mongoose.Schema({
    first_name: {
        type: String
    },
    last_name: {
        type: String
    },
    dob: {
        type: Date
    }
});