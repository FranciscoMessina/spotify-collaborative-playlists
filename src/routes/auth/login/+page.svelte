<script lang="ts">
	import type { PageData } from './$types';
	import { superForm } from 'sveltekit-superforms/client';

	export let data: PageData;

	const { form, enhance } = superForm(data.form);
</script>

<div class="min-h-screen flex items-center justify-center">
	<form method="POST" class="w-full" use:enhance>
		<div class="max-w-sm w-full mx-auto flex flex-col gap-4 text-zinc-200">
			<h1 class="text-2xl font-bold text-center">Log in</h1>
			<div>
				<label for="email">Email:</label>
				<input type="text" name="email" class="p-2 rounded w-full" bind:value={$form.email} />
			</div>

			<div>
				<label for="email">Password:</label>
				<input type="text" name="password" class="p-2 rounded w-full" bind:value={$form.password} />
			</div>

			<button class="w-full bg-purple-700 py-2 rounded font-semibold">Submit</button>
		</div>
	</form>
</div>
