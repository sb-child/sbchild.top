import { getContext, setContext } from 'svelte';
import { browser } from '$app/env';

type Theme = 'light' | 'dark';

class ThemeState {
	#theme = $state<Theme>('light');

	constructor() {
		if (browser) {
			const saved = localStorage.getItem('theme') as Theme | null;
			this.#theme =
				saved ??
				(window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
		}
	}

	get current(): Theme {
		return this.#theme;
	}

	toggle() {
		this.#theme = this.#theme === 'dark' ? 'light' : 'dark';
	}

	sync() {
		document.documentElement.classList.toggle('dark', this.#theme === 'dark');
		localStorage.setItem('theme', this.#theme);
	}
}

const KEY = 'theme';

export function setTheme() {
	const theme = new ThemeState();
	setContext(KEY, theme);
	$effect(() => {
		if (browser) theme.sync();
	});
}

export function getTheme(): ThemeState {
	return getContext<ThemeState>(KEY);
}