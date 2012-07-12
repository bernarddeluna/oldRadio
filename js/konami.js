YUI.add('konami', function (Y) {
    Y.Event.define('konami', {
      on: function (node, subscription, notifier) {
          var kkeys = [],
              konami = "38,38,40,40,37,39,37,39,66,65";

          subscription._handle = Y.on('keydown', function(e) {
            kkeys.push( e.keyCode );
            if ( kkeys.toString().indexOf( konami ) >= 0 ){
              notifier.fire(e);
            }
          });
      },

      detach: function (node, subscription, notifier) {
        subscription._handle.detach();
      }
    });
}, '0.0.1', { requires: ['event'] });