import { Request, Response } from "express";
import { CustomError } from "../../domain";
import { FileUploadService } from "../services/file-upload.service";
import { UploadedFile } from "express-fileupload";

export class FileUploadController {

	constructor(
		private readonly fileUploadService: FileUploadService
	) {}


	private handleError = ( error: unknown, res: Response ) => {
		if ( error instanceof CustomError) {
			return res.status(error.statusCode).json({error: error.message});
		}

		console.log(`${error}`);

		return res.status(500).json({error: 'Internal server error'});
	}


	uploadFile = (req: Request, res: Response) => {

		const type = req.params.type;

		const file = req.body.files.at(0) as UploadedFile;

		this.fileUploadService.uploadSingle( file, `uploads/${type}` )
			.then( up => res.json(up) )
			.catch( err => this.handleError(err, res) );


	}


	uploadMultipleFiles = (req: Request, res: Response) => {

		const type = req.params.type;

		const file = req.body.files as UploadedFile[];

		this.fileUploadService.uploadMultiple( file, `uploads/${type}` )
			.then( up => res.json(up) )
			.catch( err => this.handleError(err, res) );

	}

}

