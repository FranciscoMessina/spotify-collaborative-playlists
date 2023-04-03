import { sql, type Kysely } from 'kysely';

export async function up(db: Kysely<unknown>) {
	// Lucia schemas
	await db.schema
		.createTable('auth_user')
		.addColumn('id', 'varchar(15)', (col) => col.notNull().primaryKey())
		.addColumn('email', 'varchar', (col) => col.notNull().unique())
		.addColumn('display_name', 'varchar')
		.addColumn('created_at', 'timestamp', (col) => col.defaultTo(sql`now`).notNull())
		.execute();

	await db.schema
		.createTable('auth_session')
		.addColumn('id', 'varchar(127)', (col) => col.notNull().primaryKey())
		.addColumn('user_id', 'varchar(15)', (col) => col.notNull())
		.addColumn('active_expires', 'bigint', (col) => col.notNull())
		.addColumn('idle_expires', 'bigint', (col) => col.notNull())
		.addForeignKeyConstraint('auth_session_user_id_fk', ['user_id'], 'auth_user', ['id'], (cb) =>
			cb.onDelete('cascade')
		)
		.execute();

	await db.schema
		.createTable('auth_key')
		.addColumn('id', 'varchar(255)', (col) => col.notNull().primaryKey())
		.addColumn('user_id', 'varchar(15)', (col) => col.notNull())
		.addColumn('hashed_password', 'varchar(255)')
		.addColumn('primary_key', 'int2', (col) => col.notNull())
		.addColumn('expires', 'bigint')
		.addForeignKeyConstraint('auth_key_user_id_fk', ['user_id'], 'auth_user', ['id'], (cb) =>
			cb.onDelete('cascade')
		)
		.execute();
	// End lucia schemas

	// await db.schema
	// 	.createTable('user')
	// 	.addColumn('id', 'integer', (col) => col.primaryKey().autoIncrement())
	// 	.addColumn('first_name', 'varchar', (col) => col.notNull())
	// 	.addColumn('last_name', 'varchar')
	// 	.addColumn('email', 'varchar', (col) => col.notNull().unique())
	// 	.addColumn('username', 'varchar', (col) => col.unique())
	// 	.addColumn('created_at', 'timestamp', (col) => col.defaultTo(sql`now`).notNull())
	// 	.execute();

	await db.schema
		.createTable('group')
		.addColumn('id', 'integer', (col) => col.primaryKey().autoIncrement())
		.addColumn('name', 'varchar', (col) => col.notNull())
		.addColumn('owner_id', 'varchar(15)', (col) => col.notNull())
		.addColumn('created_at', 'timestamp', (col) => col.defaultTo(sql`now`).notNull())
		.addForeignKeyConstraint('group_owner_id_fk', ['owner_id'], 'users', ['id'], (cb) =>
			cb.onDelete('cascade')
		)
		.execute();

	await db.schema.createIndex('group_owner_id_index').on('group').column('owner_id').execute();

	await db.schema
		.createTable('group_member')
		.addColumn('group_id', 'integer', (col) => col.notNull())
		.addColumn('member_id', 'varchar(15)', (col) => col.notNull())
		.addColumn('joined_at', 'timestamp', (col) => col.defaultTo(sql`now`).notNull())
		.addForeignKeyConstraint('group_member_member_id_fk', ['member_id'], 'user', ['id'], (cb) =>
			cb.onDelete('cascade')
		)
		.addForeignKeyConstraint('group_member_group_id_fk', ['group_id'], 'group', ['id'], (cb) =>
			cb.onDelete('cascade')
		)
		.execute();
}

export async function down(db: Kysely<unknown>) {
	await db.schema.dropTable('auth_session').execute();
	await db.schema.dropTable('auth_key').execute();
	await db.schema.dropTable('auth_user').execute();
	await db.schema.dropTable('group_member').execute();
	await db.schema.dropTable('group').execute();
	await db.schema.dropTable('user').execute();
}
