declare module 'throttle-debounce' {
	function throttle<T extends Function>(delay: number, callback: T, debounceMode?: boolean): T;
	function throttle<T extends Function>(delay: number, noTrailing: boolean, callback: T, debounceMode?: boolean	): T;

	function debounce<T extends Function>(delay: number, callback: T): T;
	function debounce<T extends Function>(delay: number, atBegin: boolean, callback: T): T;
}
