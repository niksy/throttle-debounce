/* eslint-disable no-undefined,no-param-reassign,no-shadow */

/**
 * Throttle execution of a function. Especially useful for rate limiting
 * execution of handlers on events like resize and scroll.
 *
 * @param {number} delay -                  A zero-or-greater delay in milliseconds. For event callbacks, values around 100 or 250 (or even higher)
 *                                            are most useful.
 * @param {Function} callback -               A function to be executed after delay milliseconds. The `this` context and all arguments are passed through,
 *                                            as-is, to `callback` when the throttled-function is executed.
 * @param {object} [options] -              An object to configure options.
 * @param {boolean} [options.noTrailing] -   Optional, defaults to false. If noTrailing is true, callback will only execute every `delay` milliseconds
 *                                            while the throttled-function is being called. If noTrailing is false or unspecified, callback will be executed
 *                                            one final time after the last throttled-function call. (After the throttled-function has not been called for
 *                                            `delay` milliseconds, the internal counter is reset).
 * @param {boolean} [options.noLeading] -   Optional, defaults to false. If noLeading is false, the first throttled-function call will execute callback
 *                                            immediately. If noLeading is true, the first the callback execution will be skipped. It should be noted that
 *                                            callback will never executed if both noLeading = true and noTrailing = true.
 * @param {boolean} [options.debounceMode] - If `debounceMode` is true (at begin), schedule `clear` to execute after `delay` ms. If `debounceMode` is
 *                                            false (at end), schedule `callback` to execute after `delay` ms.
 *
 * @returns {Function} A new, throttled, function.
 */
export default function (delay, callback, options) {
	const {
		noTrailing = false,
		noLeading = false,
		debounceMode = undefined
	} = options || {};
	/*
	 * After wrapper has stopped being called, this timeout ensures that
	 * `callback` is executed at the proper times in `throttle` and `end`
	 * debounce modes.
	 */
	let timeoutID;
	let cancelled = false;

	// Keep track of the last time `callback` was executed.
	let lastExec = 0;

	// Function to clear existing timeout
	function clearExistingTimeout() {
		if (timeoutID) {
			clearTimeout(timeoutID);
		}
	}

	// Function to cancel next exec
	function cancel(options) {
		const { upcomingOnly = false } = options || {};
		clearExistingTimeout();
		cancelled = !upcomingOnly;
	}

	/*
	 * The `wrapper` function encapsulates all of the throttling / debouncing
	 * functionality and when executed will limit the rate at which `callback`
	 * is executed.
	 */
	function wrapper(...arguments_) {
		let self = this;
		let elapsed = Date.now() - lastExec;

		if (cancelled) {
			return;
		}

		// Execute `callback` and update the `lastExec` timestamp.
		function exec() {
			lastExec = Date.now();
			callback.apply(self, arguments_);
		}

		/*
		 * If `debounceMode` is true (at begin) this is used to clear the flag
		 * to allow future `callback` executions.
		 */
		function clear() {
			timeoutID = undefined;
		}

		if (!noLeading && debounceMode && !timeoutID) {
			/*
			 * Since `wrapper` is being called for the first time and
			 * `debounceMode` is true (at begin), execute `callback`
			 * and noLeading != true.
			 */
			exec();
		}

		clearExistingTimeout();

		if (debounceMode === undefined && elapsed > delay) {
			if (noLeading) {
				/*
				 * In throttle mode with noLeading, if `delay` time has
				 * been exceeded, update `lastExec` and schedule `callback`
				 * to execute after `delay` ms.
				 */
				lastExec = Date.now();
				if (!noTrailing) {
					timeoutID = setTimeout(debounceMode ? clear : exec, delay);
				}
			} else {
				/*
				 * In throttle mode without noLeading, if `delay` time has been exceeded, execute
				 * `callback`.
				 */
				exec();
			}
		} else if (noTrailing !== true) {
			/*
			 * In trailing throttle mode, since `delay` time has not been
			 * exceeded, schedule `callback` to execute `delay` ms after most
			 * recent execution.
			 *
			 * If `debounceMode` is true (at begin), schedule `clear` to execute
			 * after `delay` ms.
			 *
			 * If `debounceMode` is false (at end), schedule `callback` to
			 * execute after `delay` ms.
			 */
			timeoutID = setTimeout(
				debounceMode ? clear : exec,
				debounceMode === undefined ? delay - elapsed : delay
			);
		}
	}

	wrapper.cancel = cancel;

	// Return the wrapper function.
	return wrapper;
}
