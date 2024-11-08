import { NextFunction, Request, Response } from "express";
import { JwtAdapter } from "../../config";
import { UserModel } from "../../data";
import { UserEntity } from "../../domain";

export class AuthMiddleware {

	static async validateJWT( req: Request, res: Response, next: NextFunction ) {

		const authorization = req.header('Authorization');

		if ( !authorization ) return res.status(401).json({error: 'Debe estar autenticado'});
		if ( !authorization.startsWith('Bearer ') ) return res.status(401).json({error: 'Formato de token invalido'});


		const token = authorization.replace('Bearer ', '');

		try {

			const payload = await JwtAdapter.validateToken<{ id: string }>(token);
			if ( !payload ) return res.status(401).json({error: 'Token invalido'});

			const user = await UserModel.findById(payload.id);

			// aquí puedo validar que el usuario está activo jiji

			if ( !user ) return res.status(401).json({error: 'Token invalido - usuario'});

			req.body.user = UserEntity.fromObject(user);

			next();


		} catch (error) {

			console.log(error);
			res.status(500).json({error: 'Internal server error'});

		}


	}


}

