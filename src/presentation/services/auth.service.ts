import { bcryptAdapter, JwtAdapter } from "../../config";
import { UserModel } from "../../data/ index";
import { CustomError, RegisterUserDto, UserEntity } from "../../domain";
import { LoginUserDTO } from "../../domain/dtos/auth/login-user.dto";


export class AuthService {

	constructor() {}

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

			// JWT

			// email de confirmación

			const {password, ...userEntity} = UserEntity.fromObject(user)

			return {
				user: userEntity,
				token: 'ABC'
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
}

