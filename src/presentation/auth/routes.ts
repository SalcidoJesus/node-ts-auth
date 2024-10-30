import { Router } from 'express';
import { AuthController } from './controller';
import { AuthService } from '../services/auth.service';




export class AuthRoutes {


  static get routes(): Router {

    const router = Router();
	const authService = new AuthService()

	const controller = new AuthController(authService)

    // Definir las rutas
    router.post('/login', controller.login );
    router.post('/register', controller.register );

    router.get('/validate-email/:token', controller.validateEmail );



    return router;
  }


}

