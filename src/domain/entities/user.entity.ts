// esto es por si de repente cambiamos mongoose
// entonces retornamos esta entidad en vez de mongoose

import { CustomError } from "../errors/custom.error"

export class UserEntity {

	constructor(
		public id: string,
		public name: string,
		public email: string,
		public emailValidated: boolean,
		public password: string,
		public role: string[],
		public img?: string,
	){}


	static fromObject(object: { [key: string]:any }) {
		const { id, _id, name, email, emailValidated, password, role, img } = object

		if ( !_id && !id ) {
			throw CustomError.badRequest('El id es requerido')
		}

		if (!name) throw CustomError.badRequest('El nombre es requerido')
		if (!email) throw CustomError.badRequest('El correo es requerido')
		if (emailValidated === undefined) throw CustomError.badRequest('El correo electrónico debe ser validado')
		if (!password) throw CustomError.badRequest('La contraseña es requerida')
		if (!role) throw CustomError.badRequest('El rol es requerido')


		return new UserEntity(
			id || _id,
			name,
			email,
			emailValidated,
			password,
			role,
			img
		)


	}
}
