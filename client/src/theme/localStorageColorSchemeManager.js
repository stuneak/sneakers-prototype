import { isMantineColorScheme } from '@mantine/core';

const key = 'domain-color-scheme';

export function localStorageColorSchemeManager() {
	let handleStorageEvent;

	return {
		get: (defaultValue) => {
			if (typeof window === 'undefined') {
				return defaultValue;
			}

			try {
				return window.localStorage.getItem(key) || defaultValue;
			} catch {
				return defaultValue;
			}
		},

		set: (value) => {
			try {
				window.localStorage.setItem(key, value);
			} catch (error) {
				// eslint-disable-next-line no-console
				console.warn(
					'[@mantine/core] Local storage color scheme manager was unable to save color scheme.',
					error
				);
			}
		},

		subscribe: (onUpdate) => {
			handleStorageEvent = (event) => {
				if (event.storageArea === window.localStorage && event.key === key) {
					// eslint-disable-next-line no-unused-expressions
					isMantineColorScheme(event.newValue) && onUpdate(event.newValue);
				}
			};

			window.addEventListener('storage', handleStorageEvent);
		},

		unsubscribe: () => {
			window.removeEventListener('storage', handleStorageEvent);
		},

		clear: () => {
			window.localStorage.removeItem(key);
		},
	};
}
