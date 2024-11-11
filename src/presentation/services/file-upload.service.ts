import { UploadedFile } from "express-fileupload";
import path from 'path';
import fs from 'fs';
import { Uuid } from "../../config/uuid.adapter";
import { CustomError } from "../../domain";


export class FileUploadService {

	constructor(
		private readonly uuid = Uuid.v4
	) {}


	private checkFolder( filderPath: string ) {
		if ( !fs.existsSync( filderPath ) ) {
			fs.mkdirSync( filderPath );
		}
	}

	async uploadSingle(
		file: UploadedFile,
        folderPath: string = 'uploads',
		validExtensions: string[] = ['png', 'jpg', 'jpeg', 'gif']
	) {

		try {

			const fileExtension = file.mimetype.split('/').at(1) ?? '';

			if ( !validExtensions.includes(fileExtension) ) {
				throw CustomError.badRequest("Sólo se permiten las extenciones .png, .jpg, .jpeg, .gif")
			}

			const destination = path.resolve(__dirname, `../../../${ folderPath }`);
			this.checkFolder(destination);

			const fileName = `${this.uuid()}.${fileExtension}`;

			file.mv(`${ destination }/${ fileName }`);
			return {fileName};


		} catch (error) {
			console.log({error});
			throw error;
		}


	}

	async uploadMultiple(
		files: UploadedFile[],
        folderPath: string = 'uploads',
		validExtensions: string[] = ['png', 'jpg', 'jpeg', 'gif']
	) {

		const fileNames = await Promise.all(
			files.map(file => this.uploadSingle(file, folderPath, validExtensions))
		)

		return fileNames;

	}
}
