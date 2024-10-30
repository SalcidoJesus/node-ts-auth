import jwt from 'jsonwebtoken'
import { envs } from './envs'

const JWT_SEED = envs.JWT_SEED

export class JwtAdapter {

	static async generateToken( payload: any, duration: string = '2h' ) {

		return new Promise( ( resolve, _ ) => {

			jwt.sign( payload, "SEED", { expiresIn: duration }, ( err, token ) => {

				if ( err ) {return resolve(null)

				}

				resolve(token)

			})
		})
	}

	static validateToken( token: string ) {

		throw new Error('Method not implemented.')
		return 'payload'

	}

}

