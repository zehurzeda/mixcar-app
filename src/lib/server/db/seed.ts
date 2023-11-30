import { env } from '$env/dynamic/private';
import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';
import { profiles, profilesToRoles, roles, users } from './schema';
import { hashPassword } from '../auth';

export async function seed() {
	const client = createClient({
		url: env.DATABASE_URL,
		authToken: env.DATABASE_AUTH_TOKEN
	});

	const db = drizzle(client);

	const selectedRoles = await db.select().from(profilesToRoles);

	if (selectedRoles.length > 0) {
		console.log('Already seeded');
		return;
	}

	const userReadRole = await db
		.insert(roles)
		.values({
			name: 'user_read',
			description: 'Leitura de usuários'
		})
		.returning()
		.onConflictDoNothing();

	const userWriteRole = await db
		.insert(roles)
		.values({
			name: 'user_write',
			description: 'Escrita de usuários'
		})
		.returning()
		.onConflictDoNothing();

	const userAdminRole = await db
		.insert(roles)
		.values({
			name: 'user_admin',
			description: 'Escrita em outros usuários'
		})
		.returning()
		.onConflictDoNothing();

	const profileReadRole = await db
		.insert(roles)
		.values({
			name: 'profile_read',
			description: 'Leitura de perfis de acesso'
		})
		.returning()
		.onConflictDoNothing();

	const profileWriteRole = await db
		.insert(roles)
		.values({
			name: 'profile_write',
			description: 'Escrita de perfis de acesso'
		})
		.returning()
		.onConflictDoNothing();

	const clienteReadRole = await db
		.insert(roles)
		.values({
			name: 'cliente_read',
			description: 'Leitura de clientes'
		})
		.returning()
		.onConflictDoNothing();

	const clienteWriteRole = await db
		.insert(roles)
		.values({
			name: 'cliente_write',
			description: 'Escrita de clientes'
		})
		.returning()
		.onConflictDoNothing();

	const veiculoReadRole = await db
		.insert(roles)
		.values({
			name: 'veiculo_read',
			description: 'Leitura de veiculos'
		})
		.returning()
		.onConflictDoNothing();

	const veiculoWriteRole = await db
		.insert(roles)
		.values({
			name: 'veiculo_write',
			description: 'Escrita de veiculos'
		})
		.returning()
		.onConflictDoNothing();

	const orcamentoReadRole = await db
		.insert(roles)
		.values({
			name: 'orcamento_read',
			description: 'Leitura de orçamentos'
		})
		.returning()
		.onConflictDoNothing();

	const orcamentoWriteRole = await db
		.insert(roles)
		.values({
			name: 'orcamento_write',
			description: 'Escrita de orçamentos'
		})
		.returning()
		.onConflictDoNothing();

	const servicoReadRole = await db
		.insert(roles)
		.values({
			name: 'servico_read',
			description: 'Leitura de serviços'
		})
		.returning()
		.onConflictDoNothing();

	const servicoWriteRole = await db
		.insert(roles)
		.values({
			name: 'servico_write',
			description: 'Escrita de serviços'
		})
		.returning()
		.onConflictDoNothing();

	const pacoteReadRole = await db
		.insert(roles)
		.values({
			name: 'pacote_read',
			description: 'Leitura de pacotes'
		})
		.returning()
		.onConflictDoNothing();

	const pacoteWriteRole = await db
		.insert(roles)
		.values({
			name: 'pacote_write',
			description: 'Escrita de pacotes'
		})
		.returning()
		.onConflictDoNothing();

	const categoriaReadRole = await db
		.insert(roles)
		.values({
			name: 'categoria_read',
			description: 'Leitura de categorias'
		})
		.returning()
		.onConflictDoNothing();

	const categoriaWriteRole = await db
		.insert(roles)
		.values({
			name: 'categoria_write',
			description: 'Escrita de categorias'
		})
		.returning()
		.onConflictDoNothing();

	const adminProfile = await db
		.insert(profiles)
		.values({
			name: 'admin'
		})
		.returning()
		.onConflictDoNothing();

	await db
		.insert(users)
		.values({
			userName: 'admin',
			password: hashPassword('admin'),
			profileId: adminProfile[0].id
		})
		.onConflictDoNothing();

	await db
		.insert(profilesToRoles)
		.values([
			{
				profileId: adminProfile[0].id,
				roleId: userReadRole[0].id
			},
			{
				profileId: adminProfile[0].id,
				roleId: userWriteRole[0].id
			},
			{
				profileId: adminProfile[0].id,
				roleId: userAdminRole[0].id
			},
			{
				profileId: adminProfile[0].id,
				roleId: profileReadRole[0].id
			},
			{
				profileId: adminProfile[0].id,
				roleId: profileWriteRole[0].id
			},
			{
				profileId: adminProfile[0].id,
				roleId: clienteReadRole[0].id
			},
			{
				profileId: adminProfile[0].id,
				roleId: clienteWriteRole[0].id
			},
			{
				profileId: adminProfile[0].id,
				roleId: veiculoReadRole[0].id
			},
			{
				profileId: adminProfile[0].id,
				roleId: veiculoWriteRole[0].id
			},
			{
				profileId: adminProfile[0].id,
				roleId: orcamentoReadRole[0].id
			},
			{
				profileId: adminProfile[0].id,
				roleId: orcamentoWriteRole[0].id
			},
			{
				profileId: adminProfile[0].id,
				roleId: servicoReadRole[0].id
			},
			{
				profileId: adminProfile[0].id,
				roleId: servicoWriteRole[0].id
			},
			{
				profileId: adminProfile[0].id,
				roleId: pacoteReadRole[0].id
			},
			{
				profileId: adminProfile[0].id,
				roleId: pacoteWriteRole[0].id
			},
			{
				profileId: adminProfile[0].id,
				roleId: categoriaReadRole[0].id
			},
			{
				profileId: adminProfile[0].id,
				roleId: categoriaWriteRole[0].id
			}
		])
		.onConflictDoNothing();

	return;
}
