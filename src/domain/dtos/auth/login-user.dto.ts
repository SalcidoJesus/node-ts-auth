import { regularExps } from "../../../config"


export class LoginUserDTO {

	private constructor(
		public email: string,
		public password: string
	) {}

	static create(object: {[key:string]:any}) : [string?, LoginUserDTO?] {

		const { email, password } = object

		if (!email) return ['El correo es requerido']
		if (!regularExps.email.test(email)) return ['El correo no es valido']
		if (!password) return ['La contraseña es requerida']
		if (password.length < 8) return ['La contraseña es muy corta']

		return [undefined, new LoginUserDTO(email, password)]

	}
}

