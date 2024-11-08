
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

productSchema.set('toJSON', {
	virtuals: true,
	versionKey: false,
	transform: function( doc, ret, options ) {
		delete ret._id;
	}
});

export const ProductModel = mongoose.model('Product', productSchema);
