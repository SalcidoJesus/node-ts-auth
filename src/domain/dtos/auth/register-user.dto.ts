import { regularExps } from "../../../config"


export class RegisterUserDto {

	private constructor(
		public name: string,
		public email: string,
		public password: string
	) {}

	static create(object: {[key:string]:any}) : [string?, RegisterUserDto?] {

		const { name, email, password } = object

		if (!name) return ['El nombre es requerido']
		if (!email) return ['El correo es requerido']
		if (!regularExps.email.test(email)) return ['El correo no es valido']
		if (!password) return ['La contraseña es requerida']
		if (password.length < 8) return ['La contraseña es muy corta']

		return [undefined, new RegisterUserDto(name, email, password)]

	}
}

