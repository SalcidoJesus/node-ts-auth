
// crud

import { ProductModel } from "../../data/index";
import { CreateProductDto, CustomError, PaginationDTO } from "../../domain";


export class ProductService {

	// DI?
	constructor() {}


	async createProduct( createproductDto: CreateProductDto ) {

		const productExists = await ProductModel.findOne({
			name: createproductDto.name
		});

		if ( productExists ) throw CustomError.badRequest('Ya existe un producto con ese nombre');

		try {

			const product = new ProductModel( createproductDto );

			await product.save();

			return product;

		} catch (error) {
			throw CustomError.internalServer(`${error}`);
		}

	}


	async getproducts( paginationDto: PaginationDTO ) {

		const { limit, page } = paginationDto

		try {

			const [total, products] = await Promise.all([
				// 1
				ProductModel.countDocuments(),
				// 2
				ProductModel.find()
				.skip( (page - 1) * limit )
				.limit( limit )
				.populate('user', 'name email')
				.populate('category', 'name')
			]);

			return {
				page,
				limit,
				total,
				data: products
			}

		} catch (error) {
			throw CustomError.internalServer(`${error}`);
		}


	}


}
