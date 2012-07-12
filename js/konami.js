YUI.add('konami', function (Y) {
    Y.Event.define('konami', {
      on: function (node, subscription, notifier) {
          var pressedKeys = [],
              konamiKeys = "38,38,40,40,37,39,37,39,66,65";

          subscription._handle = Y.on('keydown', function(e) {
            pressedKeys.push( e.keyCode );
            if ( pressedKeys.toString().indexOf( konamiKeys ) >= 0 ){
              notifier.fire(e);
            }
          });
      },

      detach: function (node, subscription, notifier) {
        subscription._handle.detach();
      }
    });
}, '0.0.2', { requires: ['event'] });