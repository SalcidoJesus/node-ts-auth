import { bcryptAdapter, envs, JwtAdapter } from "../../config";
import { UserModel } from "../../data";
import { CustomError, RegisterUserDto, UserEntity } from "../../domain";
import { LoginUserDTO } from "../../domain/dtos/auth/login-user.dto";
import { EmailService } from "./email.service";


export class AuthService {

	constructor(
		private readonly emailService: EmailService
	) {}

	public async registerUser(registerUserDto: RegisterUserDto) {

		const existUser = await UserModel.findOne({
			email: registerUserDto.email
		})

		if ( existUser ) throw CustomError.badRequest('Este correo ya se encuentra registrado')


		try {

			const user = new UserModel(registerUserDto)

			// encriptar la contraseña
			user.password = bcryptAdapter.hash(user.password)
			// guardar
			await user.save()

			// enviar correo
			this.sendEmailValidationLink( user.email )

			// JWT

			// email de confirmación

			const {password, ...userEntity} = UserEntity.fromObject(user)
			const token = await JwtAdapter.generateToken({ id: user.id })
			if (!token) throw CustomError.internalServer('No se pudo generar el token')

			return {
				user: userEntity,
				token
			}

		} catch (error) {
			throw CustomError.internalServer(`${error}`)
		}

		return 'todo bien'

	}

	public async loginUser(loginUserDto: LoginUserDTO) {

		// find one para ver si existe
		const user = await UserModel.findOne({
			email: loginUserDto.email
		})
		if ( !user ) throw CustomError.badRequest('Este correo no existe')


		// has match, con el bcrypt
		const match = bcryptAdapter.compare(loginUserDto.password, user.password);
		if (!match) throw CustomError.badRequest('La contraseña es incorrecta');

		const { password, ...userEntity } = UserEntity.fromObject(user)

		// jwt
		const token = await JwtAdapter.generateToken({
			id: user.id,
			email: user.email
		})

		if ( !token ) throw CustomError.internalServer('No se pudo generar el token')

		return {
			user: userEntity,
			token
		}


	}

	private sendEmailValidationLink = async (email: string) => {

		const token = await JwtAdapter.generateToken({
			email
		});

		if ( !token ) throw CustomError.internalServer('No se pudo generar el token');

		const link = `${envs.WEB_SERVICE_URL}/auth/validate-email/${token}`

		const htmlbody = `
		<h1>Validación de correo</h1>

		<p>Para validar tu correo, haz click en el siguiente enlace:</p>
		<a href="${link}">Validar correo</a>
		`

		const options = {
			to: email,
			subject: 'Validación de correo',
			htmlbody
		}

		const isSet = await this.emailService.sendEmail(options);
		if ( !isSet ) throw CustomError.internalServer('No se pudo enviar el correo');

		return true;

	}

	public validateEmail = async ( token: string ) => {

		const payload = await JwtAdapter.validateToken(token);
		console.log({payload})

		if ( !payload ) throw CustomError.unauthorized('No se pudo validar el token');

		const { email } = payload as { email: string };

		if ( !email ) throw CustomError.internalServer('No hay un correo en el token');

		const existUser = await UserModel.findOne({ email });

		if ( !existUser ) throw CustomError.internalServer('Este correo no existe');

		existUser.emailValidated = true;
		await existUser.save();

		return true;

	}

}

