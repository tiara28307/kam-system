import { Document } from "mongoose";

export interface Customer extends Document {
    readonly first_name: String;
    readonly last_name: String;
    readonly dob: Date;
}