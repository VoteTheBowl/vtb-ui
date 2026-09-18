<script lang="ts">
	import { asset } from '$app/paths';

	const {
		icon,
		class: classes
	}: {
		icon:
			| 'star'
			| 'check-circle'
			| 'clipboard'
			| 'lock'
			| 'refresh-ccw'
			| 'x-circle'
			| 'x'
			| 'moon'
			| 'sun';
		class?: string;
	} = $props();
</script>

<svg
	class="h-6 w-6 fill-none stroke-current stroke-2 {classes}"
	style="stroke-linecap: round; stroke-linejoin: round;"
>
	<use href={asset(`/feather-sprite.svg#${icon}`)} />
</svg>
