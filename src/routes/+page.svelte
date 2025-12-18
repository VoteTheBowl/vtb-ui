<script lang="ts">
	import { goto } from '$app/navigation';
	import { EventsAPI } from '$lib/api/events';
	import { Heading, Input, Label, Button, Select } from 'flowbite-svelte';
	import { resolve } from '$app/paths';
	import votingSystems from '$lib/voting-system/config';
	import { getStorageContext } from '$lib/storage/storage';

	const storage = getStorageContext();

	let eventName = $state('');
	let dishes: string[] = $state([]);
	let newDish = $state('');
	let votingSystem: string = $state(votingSystems[0].id);

	const isFormValid = $derived(eventName.trim() !== '' && dishes.length > 0);

	const addDish = () => {
		if (newDish.trim()) {
			dishes = [...dishes, newDish.trim()];
			newDish = '';
		}
	};

	const handleKeyPressOnDishInput = (event: KeyboardEvent) => {
		if (event.key === 'Enter') {
			event.preventDefault();
			addDish();
		}
	};

	const removeDish = (index: number) => {
		dishes = dishes.filter((_, i) => i !== index);
	};

	const handleSubmit = async (event: SubmitEvent) => {
		event.preventDefault();

		const api = new EventsAPI();
		const response = await api.createEvent({
			name: eventName,
			choices: dishes,
			electoral_system: votingSystem
		});

		storage.saveEvent(response.id, response.name, response.host_token);

		await goto(resolve(`/event/${response.id}/host/invitation/`));
	};

	const handleSave = () => {
		// Handle save action here
		console.log('TODO: Event saved as draft');
	};
</script>

<Heading tag="h2">Create a Cook Off Event</Heading>
<form class="space-y-6" onsubmit={handleSubmit}>
	<div>
		<Label for="event-name" class="mb-2">Event Name</Label>
		<Input id="event-name" placeholder="Enter event name" bind:value={eventName} required />
	</div>

	<div>
		<Label class="mb-2">Dishes</Label>
		<div class="space-y-2">
			<div class="flex gap-2">
				<Input
					placeholder="Add a dish"
					bind:value={newDish}
					onkeydown={handleKeyPressOnDishInput}
				/>
				<div>
					<Button color="blue" onclick={addDish}>Add</Button>
				</div>
			</div>
			{#if dishes.length > 0}
				<ul class="space-y-2">
					{#each dishes as dish, i (dish + i)}
						<li class="flex items-center justify-between rounded bg-gray-50 p-2">
							<span>{dish}</span>
							<div>
								<Button color="red" size="xs" onclick={() => removeDish(i)}>Remove</Button>
							</div>
						</li>
					{/each}
				</ul>
			{/if}
		</div>
	</div>

	<div>
		<Label for="voting-system" class="mb-2">Voting System</Label>
		<Select id="voting-system" bind:value={votingSystem}>
			{#each votingSystems as config (config.id)}
				<option value={config.id}>{config.label}</option>
			{/each}
		</Select>
	</div>

	<div class="flex gap-4">
		<Button type="submit" class="flex-1" color="blue" disabled={!isFormValid}>Create Event</Button>
		<Button type="button" class="flex-1" color="dark" onclick={handleSave}>Save Event</Button>
	</div>
</form>
