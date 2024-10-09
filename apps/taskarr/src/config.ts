const {
	POSTGRES_HOST,
	POSTGRES_PORT,
	POSTGRES_USER,
	POSTGRES_PASSWORD,
	POSTGRES_DB,
} = process.env;

export const postgres = {
	host: POSTGRES_HOST,
	port: POSTGRES_PORT ? parseInt(POSTGRES_PORT) : 5432,
	user: POSTGRES_USER,
	password: POSTGRES_PASSWORD,
	database: POSTGRES_DB,
}
