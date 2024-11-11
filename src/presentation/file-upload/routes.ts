import { Router } from 'express';
import { AuthMiddleware } from '../middlewares/auth.middlewares';
import { CategoryService } from '../services/category.service';
import { FileUploadController } from './controller';
import { FileUploadService } from '../services/file-upload.service';
import { FileUploadMiddleware } from '../middlewares/file-upload.middleware';
import { TypeMiddleware } from '../middlewares/type.middleware';




export class FileUploadRoutes {


  static get routes(): Router {

    const router = Router();
	const fileUploadService = new FileUploadService();
	const controller = new FileUploadController( fileUploadService );

	router.use( FileUploadMiddleware.containFiles )
	router.use( TypeMiddleware.validTypes( ['users', 'products', 'categories'] ) )

    // Definir las rutas
	// api/upload/single/<user|category|product>
	// api/upload/multiple/<user|category|product>
    router.post('/single/:type', [ AuthMiddleware.validateJWT ], controller.uploadFile);
    router.post('/multiple/:type', [ AuthMiddleware.validateJWT ], controller.uploadMultipleFiles);



    return router;
  }


}

