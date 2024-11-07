
import mongoose, { Schema } from "mongoose";


const productSchema = new mongoose.Schema({
	name: {
		type: String,
		required: [true, "El nombre es requerido"],
		unique: true
	},
	available: {
		type: Boolean,
		default: false,
	},
	price: {
		type: Number,
		default: 0
	},
	description: {
		type: String
	},

	user: {
		type: Schema.Types.ObjectId,
		ref: 'User',
		required: true
	},

	category: {
		type: Schema.Types.ObjectId,
		ref: 'Category',
		required: true
	}
});


export const ProductyModel = mongoose.model('Product', productSchema);
