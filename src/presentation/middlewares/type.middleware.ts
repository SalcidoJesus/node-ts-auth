import { NextFunction, Request, Response } from "express";


export class TypeMiddleware {

	static validTypes( validTypes: string[]) {

		return ( req: Request, res: Response, next: NextFunction ) => {

			const type = req.url.split( '/' ).at(2) ?? '';

			if (!validTypes.includes(type)) {
				return res.status(400).json({error: "Categoría inválida, debe ser 'users', 'products' o 'categories'"});
			}

			next();

		}
	}

}
