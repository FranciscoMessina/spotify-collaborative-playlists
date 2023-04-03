import { Kysely, SqliteDialect, type Generated } from 'kysely';
import Database from 'better-sqlite3';
import type { KyselyLuciaDatabase } from '@lucia-auth/adapter-kysely';

interface UserTable {
	id: Generated<number>;

	first_name: string;

	last_name: string | null;

	email: string;

	username: string;

	created_at: Date;
}

interface GroupTable {
	id: Generated<number>;

	name: string;

	owner_id: number;

	username: string;

	// created_at: Date;
}

interface GroupMemberTable {
	group_id: number;
	member_id: number;
	joined_at: Date;
}

type Database = {
	user: UserTable;
	group: GroupTable;
	group_member: GroupMemberTable;
} & KyselyLuciaDatabase;

export const db = new Kysely<Database>({
	dialect: new SqliteDialect({
		database: new Database('db.sqlite')
	})
});
