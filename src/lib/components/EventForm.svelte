<script lang="ts">
	import { goto } from '$app/navigation';
	import { EventsAPI } from '#lib/api/events.js';
	import { resolve } from '$app/paths';
	import votingSystems from '#lib/voting-system/config.js';
	import { getStorageContext } from '#lib/storage/storage.svelte.js';
	import Button from './Button.svelte';
	import Icon from './Icon.svelte';
	import Section from './Section.svelte';
	import TextInput from './TextInput.svelte';

	const storage = getStorageContext();

	let eventName: string = $state('');
	let choices: string[] = $state([]);
	let hideChoiceLabels: boolean = $state(false);
	let aliasPrefix: string = $state('Chilli');
	let newDish = $state('');
	let votingSystem: string = $state('ST');

	const isFormValid = $derived(eventName.trim() !== '' && choices.length > 1);

	const addDish = () => {
		const trimmedDish = newDish.trim();
		if (trimmedDish && !choices.includes(trimmedDish)) {
			choices = [...choices, trimmedDish];
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
		choices = choices.filter((_, i) => i !== index);
	};

	const handleSubmit = async (event: SubmitEvent) => {
		event.preventDefault();

		const normalizedChoices = choices.map((label, index) => ({
			label,
			alias: hideChoiceLabels && aliasPrefix ? `${aliasPrefix} ${index + 1}` : undefined
		}));

		const api = new EventsAPI();
		const response = await api.createEvent({
			name: eventName,
			choices: normalizedChoices,
			electoral_system: votingSystem,
			allow_registration: true
		});

		storage.saveEvent(response.id, response.name, response.host_token);

		await goto(resolve(`host/event/registration?e=${response.id}`));
	};
</script>

<Section title="Create an event">
	<form class="space-y-6" onsubmit={handleSubmit}>
		<div>
			<label for="event-name" class="mb-2">Event Name</label>
			<TextInput
				id="event-name"
				placeholder="Bob's Redhot Chilli Cookoff"
				value={eventName}
				oninput={(e) => {
					eventName = e.currentTarget.value;
				}}
				required
			/>
		</div>

		<div>
			<label for="voting-system" class="mb-2">Voting System</label>
			<select id="voting-system" bind:value={votingSystem}>
				{#each Object.entries(votingSystems) as [id, config] (id)}
					<option value={id}>{config.label}</option>
				{/each}
			</select>
		</div>

		<div>
			<div>
				<label for="dish" class="flex items-baseline gap-2">
					Choices
					<div
						class="w-full border-t-2 border-gray-400 transition-colors duration-(--theme-duration) dark:border-gray-500"
					></div>
				</label>
				<div
					class="ml-1 border-l-2 border-gray-400 pt-2 pl-3 transition-colors duration-(--theme-duration) dark:border-gray-500"
				>
					<div class="mb-6 flex items-stretch gap-2">
						<input
							id="dish"
							placeholder="Add Choice"
							bind:value={newDish}
							onkeydown={handleKeyPressOnDishInput}
						/>
						<Button variant="secondary" onclick={addDish}>
							<span class="sr-only">Add Choice</span>
							<Icon icon="plus" />
						</Button>
					</div>
					{#if choices.length > 0}
						<ul class="space-y-2">
							{#each choices as choice, i (choice + i)}
								<li
									class="flex items-center justify-between rounded bg-gray-200 pl-3 text-xl dark:bg-gray-700 dark:text-white"
								>
									<span>
										{choice}
										{#if hideChoiceLabels}
											<span class="ml-2 text-lg text-gray-600 italic dark:text-gray-300">
												({aliasPrefix}
												{i + 1})
											</span>
										{/if}
									</span>
									<div>
										<Button
											variant="danger"
											class="rounded-l-none rounded-r p-2!"
											onclick={() => removeDish(i)}
										>
											<Icon icon="x-circle" />
										</Button>
									</div>
								</li>
							{/each}
						</ul>
					{/if}
				</div>
			</div>
		</div>

		<div>
			<label class="mb-2 flex cursor-pointer items-center gap-2">
				<input
					class="h-6 w-6 cursor-pointer"
					type="checkbox"
					checked={hideChoiceLabels}
					onchange={() => (hideChoiceLabels = !hideChoiceLabels)}
				/>
				Hide Choice Labels
			</label>
			{#if hideChoiceLabels}
				<div>
					<label for="alias" class="mb-2">Alias</label>
					<TextInput
						id="alias"
						value={aliasPrefix}
						required
						oninput={(e) => {
							aliasPrefix = e.currentTarget.value;
						}}
					/>
				</div>
			{/if}
		</div>
		<Button type="submit" class="flex-1" disabled={!isFormValid}>Create Event</Button>
	</form>
</Section>
