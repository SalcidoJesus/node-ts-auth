
import mongoose from "mongoose";


const userSchema = new mongoose.Schema({
	name: {
		type: String,
		required: [true, "El nombre es requerido"],
	},
	email: {
		type: String,
		required: [true, "El correo es requerido"],
		unique: true,
	},
	emailValidated: {
		type: Boolean,
		default: false
	},
	password: {
		type: String,
		required: [true, "La contraseña es requerida"],
	},
	img: {
		type: String,
	},
	role: {
		type: [String],
		enum: ['ADMIN_ROLE', 'USER_ROLE'],
		default: ['USER_ROLE'],
	}
});

userSchema.set('toJSON', {
	virtuals: true,
    versionKey: false,
    transform: function(doc, ret, options ) {
        delete ret._id;
        delete ret.password;
    }
})

export const UserModel = mongoose.model('User', userSchema);
