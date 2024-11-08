

export class PaginationDTO {

	private constructor (
		public readonly page: number,
		public readonly limit: number
	) {}


	static create( page: number = 1, limit: number = 10 ): [string?, PaginationDTO?] {

		if ( isNaN(page) || isNaN(limit) ) return ['La pagina y el limite deben ser numericos'];

		if ( page <= 0 ) return ['La pagina debe ser mayor a 0'];
		if ( limit <= 0 ) return ['El limite debe ser mayor a 0'];

		return [ undefined, new PaginationDTO(page, limit)]

	}


}
