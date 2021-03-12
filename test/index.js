/* eslint-disable mocha/no-identical-title */

/* Original QUnit test: https://github.com/cowboy/jquery-throttle-debounce/blob/master/unit/unit.js */

import {
	module,
	test,
	expect,
	ok,
	equal as equals,
	start,
	stop
} from 'qunitjs';
import throttle from '../throttle';
import debounce from '../debounce';

window.QUnit.config.autostart = false;

let pause = 500;
let delay = 100;

function execManyTimes(each, complete) {
	let index = 0;
	let repeated, id;

	function start() {
		id = setInterval(function () {
			each();
			if (++index === 50) {
				clearInterval(id);
				complete(
					repeated
						? null
						: function () {
								index = 0;
								repeated = true;
								setTimeout(start, pause);
						  }
				);
			}
		}, 20);
	}

	setTimeout(start, pause);
}

module('throttle');

test('delay, callback', function () {
	expect(7);
	stop();

	let startTime;
	let index = 0;
	let array = [];
	let function_ = function (now) {
		array.push(now - this);
	};
	let throttled = throttle(delay, function_);

	equals(
		throttled.guid,
		function_.guid,
		'throttled-callback and callback should have the same .guid'
	);

	execManyTimes(
		function () {
			let now = Number(new Date());
			startTime = startTime || now;
			index++;
			throttled.call(startTime, now);
		},
		function (callback) {
			let length_ = array.length;

			setTimeout(function () {
				// Console.log( arr, arr.length, len, i );
				ok(
					array.length < index,
					'callback should be executed less # of times than throttled-callback'
				);
				equals(array[0], 0, 'callback should be executed immediately');
				equals(
					array.length - length_,
					1,
					'callback should be executed one more time after finish'
				);

				startTime = null;
				array = [];
				index = 0;

				callback ? callback() : start();
			}, delay * 2);
		}
	);
});

test('delay, false, callback', function () {
	expect(7);
	stop();

	let startTime;
	let index = 0;
	let array = [];
	let function_ = function (now) {
		array.push(now - this);
	};
	let throttled = throttle(delay, false, function_);

	equals(
		throttled.guid,
		function_.guid,
		'throttled-callback and callback should have the same .guid'
	);

	execManyTimes(
		function () {
			let now = Number(new Date());
			startTime = startTime || now;
			index++;
			throttled.call(startTime, now);
		},
		function (callback) {
			let length_ = array.length;

			setTimeout(function () {
				// Console.log( arr, arr.length, len, i );
				ok(
					array.length < index,
					'callback should be executed less # of times than throttled-callback'
				);
				equals(array[0], 0, 'callback should be executed immediately');
				equals(
					array.length - length_,
					1,
					'callback should be executed one more time after finish'
				);

				startTime = null;
				array = [];
				index = 0;

				callback ? callback() : start();
			}, delay * 2);
		}
	);
});

test('delay, true, callback', function () {
	expect(7);
	stop();

	let startTime;
	let index = 0;
	let array = [];
	let function_ = function (now) {
		array.push(now - this);
	};
	let throttled = throttle(delay, true, function_);

	equals(
		throttled.guid,
		function_.guid,
		'throttled-callback and callback should have the same .guid'
	);

	execManyTimes(
		function () {
			let now = Number(new Date());
			startTime = startTime || now;
			index++;
			throttled.call(startTime, now);
		},
		function (callback) {
			let length_ = array.length;

			setTimeout(function () {
				// Console.log( arr, arr.length, len, i );
				ok(
					array.length < index,
					'callback should be executed less # of times than throttled-callback'
				);
				equals(array[0], 0, 'callback should be executed immediately');
				equals(
					array.length - length_,
					0,
					'callback should NOT be executed one more time after finish'
				);

				startTime = null;
				array = [];
				index = 0;

				callback ? callback() : start();
			}, delay * 2);
		}
	);
});

test('cancel', function () {
	expect(2);
	stop();

	let callCount = 0;
	let throttled = throttle(delay * 100, false, function () {
		callCount++;
	});

	equals(1, 1);

	throttled.cancel();
	throttled.call();

	setTimeout(function () {
		equals(callCount, 0, 'callback should not be called');
		start();
	}, delay * 2);
});

test('isPending delay callback', function () {
	expect(4);
	stop();

	let throttled = throttle(delay * 10, function () {});

	ok(!throttled.isPending(), 'callback should not be pending');

	throttled.call();
	
	setTimeout(function () {
		ok(!throttled.isPending(), 'finished initial call, callback should not be pending');
	}, delay);


	setTimeout(function () {
		throttled.call();
	}, delay * 2);

	setTimeout(function () {
		ok(throttled.isPending(), 'callback should be pending');
	}, delay * 5);

	setTimeout(function () {
		ok(!throttled.isPending(), 'finished call, callback should not be pending');
		start();
	}, delay * 11);

});

test('isPending delay false callback', function () {
	expect(4);
	stop();

	let throttled = throttle(delay * 10, false, function () {});

	ok(!throttled.isPending(), 'callback should not be pending');

	throttled.call();
	
	setTimeout(function () {
		ok(!throttled.isPending(), 'finished initial call, callback should not be pending');
	}, delay);


	setTimeout(function () {
		throttled.call();
	}, delay * 2);

	setTimeout(function () {
		ok(throttled.isPending(), 'callback should be pending');
	}, delay * 5);

	setTimeout(function () {
		ok(!throttled.isPending(), 'finished call, callback should not be pending');
		start();
	}, delay * 11);

});

test('isPending delay true callback', function () {
	expect(4);
	stop();

	let throttled = throttle(delay * 10, true, function () {});

	ok(!throttled.isPending(), 'callback should not be pending');

	throttled.call();
	
	setTimeout(function () {
		ok(!throttled.isPending(), 'finished initial call, callback should not be pending');
	}, delay);


	setTimeout(function () {
		throttled.call();
	}, delay * 2);

	setTimeout(function () {
		ok(!throttled.isPending(), 'callback should not be pending');
	}, delay * 5);

	setTimeout(function () {
		throttled.call();
	}, delay * 15);

	setTimeout(function () {
		ok(!throttled.isPending(), 'finished call, callback should not be pending');
		start();
	}, delay * 16);

});

module('debounce');

test('delay, callback', function () {
	expect(5);
	stop();

	let startTime;
	let index = 0;
	let array = [];
	let function_ = function () {
		array.push(Number(new Date()));
	};
	let debounced = debounce(delay, function_);

	equals(
		debounced.guid,
		function_.guid,
		'throttled-callback and callback should have the same .guid'
	);

	execManyTimes(
		function () {
			startTime = startTime || Number(new Date());
			index++;
			debounced.call();
		},
		function (callback) {
			let length_ = array.length;
			let doneTime = Number(new Date());

			setTimeout(function () {
				// Console.log( arr[0] - doneTime );
				equals(array.length, 1, 'callback was executed once');
				ok(
					array[0] >= doneTime,
					'callback should be executed after the finish'
				);

				startTime = null;
				array = [];
				index = 0;

				callback ? callback() : start();
			}, delay * 2);
		}
	);
});

test('delay, false, callback', function () {
	expect(5);
	stop();

	let startTime;
	let index = 0;
	let array = [];
	let function_ = function () {
		array.push(Number(new Date()));
	};
	let debounced = debounce(delay, false, function_);

	equals(
		debounced.guid,
		function_.guid,
		'throttled-callback and callback should have the same .guid'
	);

	execManyTimes(
		function () {
			startTime = startTime || Number(new Date());
			index++;
			debounced.call();
		},
		function (callback) {
			let length_ = array.length;
			let doneTime = Number(new Date());

			setTimeout(function () {
				// Console.log( arr[0] - doneTime );
				equals(array.length, 1, 'callback was executed once');
				ok(
					array[0] >= doneTime,
					'callback should be executed after the finish'
				);

				startTime = null;
				array = [];
				index = 0;

				callback ? callback() : start();
			}, delay * 2);
		}
	);
});

test('delay, true, callback', function () {
	expect(5);
	stop();

	let startTime;
	let index = 0;
	let array = [];
	let function_ = function () {
		array.push(Number(new Date()));
	};
	let debounced = debounce(delay, true, function_);

	equals(
		debounced.guid,
		function_.guid,
		'throttled-callback and callback should have the same .guid'
	);

	execManyTimes(
		function () {
			startTime = startTime || Number(new Date());
			index++;
			debounced.call();
		},
		function (callback) {
			let length_ = array.length;

			setTimeout(function () {
				// Console.log( arr[0] - startTime );
				equals(array.length, 1, 'callback was executed once');
				ok(
					array[0] - startTime <= 5,
					'callback should be executed at the start'
				);

				startTime = null;
				array = [];
				index = 0;

				callback ? callback() : start();
			}, delay * 2);
		}
	);
});

test('cancel', function () {
	expect(3);
	stop();

	let startTime;
	let index = 0;
	let array = [];
	let function_ = function () {
		array.push(Number(new Date()));
	};
	let debounced = debounce(delay, true, function_);

	equals(
		debounced.guid,
		function_.guid,
		'throttled-callback and callback should have the same .guid'
	);

	setTimeout(function () {
		debounced.cancel();
	}, delay / 2);
	execManyTimes(
		function () {
			startTime = startTime || Number(new Date());
			index++;
			debounced.call();
		},
		function (callback) {
			let length_ = array.length;

			setTimeout(function () {
				equals(array.length, 0, 'callback should not be executed');

				startTime = null;
				array = [];
				index = 0;

				callback ? callback() : start();
			}, delay * 2);
		}
	);
});

test('isPending delay callback', function () {
	expect(6);
	stop();

	let calledCount = 0;
	let debounced = debounce(delay * 10, function () {
		calledCount += 1;
	});

	ok(!debounced.isPending(), 'no calls yet, callback should not be pending');

	debounced.call();

	setTimeout(function () {
		ok(debounced.isPending(), 'callback should be pending');
	}, delay * 5);

	setTimeout(function () {
		debounced.call()
	}, delay * 7);

	setTimeout(function () {
		ok(calledCount === 0, 'should not have called yet');
		ok(debounced.isPending(), 'finished call, but trying again, callback should be pending');
	}, delay * 15);

	setTimeout(function () {
		ok(calledCount === 1, 'should have called yet');
		ok(!debounced.isPending(), 'finished call, callback should not be pending');
		start();
	}, delay * 20);
});

test('isPending delay true callback', function () {
	expect(3);
	stop();

	let debounced = debounce(delay * 10, true, function () {});

	ok(!debounced.isPending(), 'no calls yet, callback should not be pending');

	debounced.call();

	setTimeout(function () {
		ok(!debounced.isPending(), 'call already happened, should not be pending');
	}, delay * 5);

	setTimeout(function () {
		ok(!debounced.isPending(), 'ready for the next call, should not be pending');
		start();
	}, delay * 15);

	
});