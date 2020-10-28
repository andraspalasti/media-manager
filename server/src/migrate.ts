import { MikroORM } from "@mikro-orm/core";
import { ORMconfig } from "./mikro-orm.config";

(async () => {
	const orm = await MikroORM.init(ORMconfig);

	const generator = orm.getSchemaGenerator();

	try {
		await generator.dropSchema();
		await generator.createSchema();
		await generator.updateSchema();
	} catch (error) {
		console.log(error);
	} finally {
		await orm.close(true);
	}
})();
