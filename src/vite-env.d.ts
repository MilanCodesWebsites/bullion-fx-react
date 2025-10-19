/// <reference types="vite/client" />

// Custom elements typings
declare namespace JSX {
	interface IntrinsicElements {
		'gecko-coin-list-widget': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
			locale?: string;
			'dark-mode'?: string | boolean;
			outlined?: string | boolean;
			'coin-ids'?: string;
			'initial-currency'?: string;
			class?: string;
		};
	}
}
