import { Request, Response } from "express";
import fs from 'fs'
import path from 'path'

export class ImageController {

	constructor() {}

	getImage( req: Request, res: Response) {

		const { type = '', img = '' } = req.params;

		const imagePath = path.resolve(__dirname, `../../../uploads/${type}/${img}`)
		console.log({imagePath});


		if (!fs.existsSync(imagePath)) {
            return res.status(404).json({ message: 'Imagen no encontrada' });
        }

		res.sendFile(imagePath);

	}

}
