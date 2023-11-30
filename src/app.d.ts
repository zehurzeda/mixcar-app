// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces



// and what to do when importing types
declare namespace App {
	import type { User } from "$lib/server/auth";
	interface Locals {
		user?: User; 
			

	}
	// interface PageData {}
	// interface Error {}
	// interface Platform {}
}
