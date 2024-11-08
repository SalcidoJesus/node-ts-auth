
// crud

import { CategoryModel } from "../../data";
import { CreateCategoryDto, CustomError, PaginationDTO, UserEntity } from "../../domain";


export class CategoryService {

	// DI?
	constructor() {}


	async createCategory( createCategoryDto: CreateCategoryDto, user: UserEntity ) {

		const categoryExists = await CategoryModel.findOne({
			name: createCategoryDto.name
		});

		if ( categoryExists ) throw CustomError.badRequest('Ya existe una categoria con ese nombre');

		try {

			const category = new CategoryModel({
				...createCategoryDto,
				user: user.id
			});

			await category.save();

			return {
				id: category.id,
				name: category.name,
				available: category.available
			}

		} catch (error) {
			throw CustomError.internalServer(`${error}`);
		}

	}


	async getCategories( paginationDto: PaginationDTO ) {

		const { limit, page } = paginationDto

		try {

			const [total, categories] = await Promise.all([
				// 1
				CategoryModel.countDocuments(),
				// 2
				CategoryModel.find()
				.skip( (page - 1) * limit )
				.limit( limit )
			])

			const data = categories.map( c => {
				return {
					id: c.id,
					name: c.name,
					available: c.available
				}
			});


			const next = ( page >= Math.ceil(total / limit) )
				? null
				: `/api/categories?page=${ page + 1 }&limit=${ limit }`;
			const prev = ( page > 1 ) ? `/api/categories?page=${ page - 1 }&limit=${ limit }` : null


			return {
				page,
				limit,
				total,
				next,
				prev,
				data
			}

		} catch (error) {
			throw CustomError.internalServer(`${error}`);
		}


	}


}
