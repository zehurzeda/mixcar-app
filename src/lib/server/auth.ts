import { compare, hashSync } from 'bcrypt';
import jose from 'jose';
import { db } from './db';
import { profiles, profilesToRoles, roles, users } from './db/schema';
import { eq } from 'drizzle-orm';
import { env } from '$env/dynamic/private';

export interface User {
	id: number;
	userName: string;
	profile: {
		id: number;
		name: string | null;
	};
	roles: string[];
}

export function hashPassword(password: string): string {
	return hashSync(password, 12);
}

export async function loginUser(username: string, password: string) {
	const userData = await db.select().from(users).where(eq(users.userName, username));

	if (userData.length === 0) {
		throw new Error('Usuário ou senha incorretos');
	}

	const passCompare = await compare(password, userData[0].password);

	if (!passCompare) {
		throw new Error('Usuário ou senha incorretos');
	}

	const alg = 'RS256';
	const key = env.JWT_PRIVATE_KEY;
	const privateKey = await jose.importPKCS8(key, alg);

	const jwt = await new jose.SignJWT({})
		.setProtectedHeader({ alg: 'RS256' })
		.setSubject(userData[0].userName)
		.setExpirationTime('2h')
		.sign(privateKey);

	return jwt;
}

async function verifyToken(token: string) {
	const alg = 'RS256';
	const key = env.JWT_PUBLIC_KEY;
	const publicKey = await jose.importSPKI(key, alg);

	const jwt = await jose.jwtVerify(token, publicKey);

	return jwt;
}

export async function getAutenticatedUserByToken(token: string | undefined): Promise<User | null> {
	if (!token) {
		return null;
	}

	try {
		const verifiedToken = await verifyToken(token);

		if (!verifiedToken.payload.sub) {
			return null;
		}

		const usersSelect = await db
			.select()
			.from(users)
			.innerJoin(profiles, eq(users.profileId, profiles.id))
			.where(eq(users.userName, verifiedToken.payload.sub));

		const userRolesSelect = await db
			.select({
				roleName: roles.name
			})
			.from(roles)
			.innerJoin(profilesToRoles, eq(roles.id, profilesToRoles.roleId))
			.where(eq(profilesToRoles.profileId, usersSelect[0].profiles.id));

		const user: User = {
			id: usersSelect[0].users.id,
			userName: usersSelect[0].users.userName,
			profile: {
				id: usersSelect[0].profiles.id,
				name: usersSelect[0].profiles.name
			},
			roles: userRolesSelect.map((role) => role.roleName)
		};

		return user;
	} catch (error) {
		console.error(error);
		return null;
	}
}
