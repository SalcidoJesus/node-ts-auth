import { Validators } from "../../../config";


export class CreateProductDto {

	// es privado para que sólo se pueda instanciar desde aquí
	private constructor(
		public readonly name: string,
		public readonly available: string,
		public readonly price: number,
		public readonly description: string,
		public readonly category: string, // ID
		public readonly user: string // ID
	) { }


	static create(object: { [key: string]: any }): [string?, CreateProductDto?] {

		const {
			name,
			available,
			price,
			description,
			category,
			user
		} = object;

		if ( !name ) return ['Debes agregar un nombre'];
		if ( !user ) return ['Debes agregar un usuario'];
		if ( !Validators.isMongoId( user ) ) return ['El usuario no es valido'];

		if ( !category ) return ['Debes agregar una categoría'];
		if ( !Validators.isMongoId( category ) ) return ['La categoría no es valido'];

		return [undefined, new CreateProductDto(name, available, price, description, category, user)];

	}
}
