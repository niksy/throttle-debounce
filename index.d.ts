declare module 'throttle-debounce' {
	function throttle(delay: number, callback: Function, debounceMode?: boolean): Function;
	function throttle(delay: number, noTrailing: boolean, callback: Function, debounceMode?: boolean): Function;

	function debounce(delay: number, callback: Function): Function;
	function debounce(delay: number, atBegin: boolean, callback: Function): Function;
}
