import { relations, sql } from 'drizzle-orm';
import { integer, primaryKey, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const users = sqliteTable('users', {
	id: integer('id').primaryKey({autoIncrement: true}),
	userName: text('user_name').unique().notNull(),
	password: text('password').notNull(),
	fullName: text('full_name'),
	email: text('email'),
	isFirstLogin: integer('is_first_login', {mode: 'boolean'}).default(true),
	profileId: integer('profile_id'),
	createdAt: integer('created_at', {mode: 'timestamp'}).default(sql`CURRENT_TIMESTAMP`),
	updatedAt: integer('updated_at', {mode: 'timestamp'}).default(sql`CURRENT_TIMESTAMP`)
});

export const userRelations = relations(users, ({ one }) => ({
	author: one(profiles, {
		fields: [users.profileId],
		references: [profiles.id]
	})
}));

export const profiles = sqliteTable('profiles', {
  id: integer('id').primaryKey({autoIncrement: true}),
  name: text('name').unique().notNull(),
  createdAt: integer('created_at', {mode: 'timestamp'}).default(sql`CURRENT_TIMESTAMP`),
  updatedAt: integer('updated_at', {mode: 'timestamp'}).default(sql`CURRENT_TIMESTAMP`)
});

export const profilesRelations = relations(profiles, ({ many }) => ({
	users: many(users),
	profileRoles: many(profilesToRoles)
}));

export const roles = sqliteTable('roles', {
	id: integer('id').primaryKey({autoIncrement: true}),
	name: text('name').unique().notNull(),
	description: text('description')
});

export const rolesRelations = relations(roles, ({ many }) => ({
	profileRoles: many(profilesToRoles)
}));

export const profilesToRoles = sqliteTable(
	'profiles_roles',
	{
		profileId: integer('profile_id')
			.notNull()
			.references(() => profiles.id),
		roleId: integer('role_id')
			.notNull()
			.references(() => roles.id)
	},
	(table) => ({
		pk: primaryKey({columns: [table.profileId, table.roleId]})
	})
);