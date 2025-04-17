import { useUserStore } from './store';

export async function getSneakers() {
	const { setSneakers } = useUserStore.getState();

	const response = await fetch('/api/sneakers');
	const data = await response.json();
	setSneakers(data.data);
}
