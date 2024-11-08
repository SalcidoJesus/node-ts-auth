
import { envs } from "../../config";
import { CategoryModel, MongoDatabase, ProductModel, UserModel } from "../mongo";
import { seedData } from "./data";


(async () => {
	await MongoDatabase.connect({
		dbName: envs.MONGO_DB_NAME,
		mongoUrl: envs.MONGO_URL,
	});

	await main();

	await MongoDatabase.disconnect();
})();


const randomBetween0AndX = (x: number) => {
	return Math.floor(Math.random() * x);
}


async function main() {


	// 0 - borrar todo
	await Promise.all([
		UserModel.deleteMany({}),
		CategoryModel.deleteMany({}),
		ProductModel.deleteMany({}),
	]);

	// 1 - crear usuarios
	const users = await UserModel.insertMany(seedData.users);


	// 2 - crear categorías
	const categories = await CategoryModel.insertMany(
		seedData.categories.map(cat => {
			return {
				...cat,
				user: users[randomBetween0AndX(users.length  - 1 )]._id,
			}
		})
	);

	// 3 - crear productos
	const products = await ProductModel.insertMany(
		seedData.products.map(prod => {
			return {
				...prod,
				user: users[randomBetween0AndX(users.length  - 1 )]._id,
				category: categories[randomBetween0AndX(categories.length  - 1 )]._id
			}
		})
	)

	console.log('Listo :D');


}
