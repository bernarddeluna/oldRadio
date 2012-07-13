YUI.add('konami', function (Y) {
	Y.Event.define('konami', {
		_konamiSequence: [38,38,40,40,37,39,37,39,66,65],

		on: function (node, sub, notifier) {
			var instance = this;

			sub._firstLength = 0;
			sub._index = 0;
			sub._handle = Y.on('keydown', Y.rbind(instance._handleKeyDown, instance, sub, notifier));
		},

		_handleKeyDown: function(e, sub, notifier) {
			var instance = this,
				index = sub._index,
				konamiKeys = this._konamiSequence,
				keyCode = e.keyCode;

			if (sub._firstLength === 0) {
				while (konamiKeys[0] === konamiKeys[++sub._firstLength]);
			}

			if (keyCode === konamiKeys[index])  {
				if (++index === konamiKeys.length) {
					notifier.fire(e);
					index = 0;
				}
			}
			else {

				if ((index === sub._firstLength) && (keyCode === konamiKeys[0])) {
					return;
				}

				index = 0;
			}

			sub._index = index;
		},

		detach: function (node, sub, notifier) {
			sub._handle.detach();
		}
	});
}, '1.0', { requires: ['event-synthetic'] });