window.HTML5PRO = window.HTML5PRO || {};
HTML5PRO.APPS = HTML5PRO.APPS || {};

YUI().use('node', 'event', function (Y) {

	HTML5PRO.APPS.Radio = function () {

		var audio,
			audioChiado,
			audioList = Y.one('audio'),
			audioContainner = Y.one('#audio_containner'),
			audioSource,
			volumeAudio = 1,
			anguloAtual = 0,
			anguloInicial = null,

			tuner = Y.one(".tuner .controllerCont"),
			tunerRotElement = Y.one(".tuner .controller"),
			tunerCenterX = tuner.getXY()[0] + (tuner._node.offsetWidth / 2),
			tunerCenterY = tuner.getXY()[1] + (tuner._node.offsetHeight / 2),
			tunerDown = false,

			numChannels = 10,
			displayWidth = 230,
			channel = 0,
			audios = [],

			pointer = Y.one(".pointer"),
			pointerPosInicial = 0,
			pointerPosFinal = 227,

			volume = Y.one(".volume .controllerCont"),
			volumeRotElement = Y.one(".volume .controller"),
			volumeCenterX = volume.getXY()[0] + (volume._node.offsetWidth / 2),
			volumeCenterY = volume.getXY()[1] + (volume._node.offsetHeight / 2),
			volumeDown = false,

			volumeAnguloAtual = 0,
			volumeAnguloInicial = null,

			// blockMove = 0,
			wavePos = (Math.cos (((0 * (numChannels - 1) * 2) / displayWidth) * Math.PI) * 0.5 + 0.5),
			playing = false;

		bind = function() {

			Y.one(".on-off").on('click', function(e) {

				e.preventDefault();

				if (playing) {
					playing = false;
					audios[channel].pause();
					Y.one(".case").removeClass('on');
				} else {
					playing = true;
					audios[channel].play();
					Y.one(".case").addClass('on');
				}

				audios[channel].currentTime = 0;
				setVolume(volumeAudio);

			});

			Y.one(".global-radio").on('mouseup', function(e) {
				volumeDown = false;
				volumeAnguloInicial = null;
				anguloInicial = null;
				blockMove = 0;
			});

			// --- Volume --- //

			volume.on('mousedown', function(e) {

				volumeDown = true;

				var self = this,
					anguloEmRadianos = Math.atan2(volumeCenterY - e.pageY, volumeCenterX - e.pageX);

				volumeAnguloInicial = (anguloEmRadianos * (180 / Math.PI)) - volumeAnguloAtual;

			});

			volume.on('mousemove', function(e) {

				if (volumeAnguloInicial !== null) {

					var self = this,
						anguloEmRadianos = Math.atan2(volumeCenterY - e.pageY, volumeCenterX - e.pageX),
						anguloRelativo = anguloEmRadianos * (180 / Math.PI),
						anguloTemp = volumeAnguloAtual;

					volumeAnguloAtual = (volumeAnguloInicial * 0) + (anguloRelativo - volumeAnguloInicial);

					var angTemp = (anguloTemp - volumeAnguloAtual);

					//mantem o angulo entre 0 e 360
					if (volumeAnguloAtual < 0) {
						volumeAnguloAtual += 360;
					}

					if (volumeAnguloAtual > 360) {
						volumeAnguloAtual -= 360;
					}

					if (volumeAnguloAtual < 90 && anguloTemp > 270 && blockMove != -1) {
					    blockMove = 1;
					    volumeAnguloInicial = null;
					}

					if (volumeAnguloAtual < 180 && anguloTemp < 270 && blockMove != 1) {
					    blockMove =- 1;
					    volumeAnguloInicial = null;
					}

					if (blockMove == -1) {
					    volumeAnguloAtual = 180;
					}

					if (blockMove == 1) {
						volumeAnguloAtual = 360;
					}

					volumeAudio = (volumeAnguloAtual - 180) / 180;

					setVolume(volumeAudio);

                    Y.one(volumeRotElement).setStyle("MozTransform", "rotate(" + volumeAnguloAtual + "deg)");
                    Y.one(volumeRotElement).setStyle("webkitTransform", "rotate(" + volumeAnguloAtual + "deg)");
                    Y.one(volumeRotElement).setStyle("transform", "rotate(" + volumeAnguloAtual + "deg)");
				}

			});

			// --- Tuner --- //

			tuner.on('mouseup', function (e) {
				tunerDown = false;
				anguloInicial = null;
			});

			tuner.on('mousedown', function (e) {

				tunerDown = true;

				var self = this,
					anguloEmRadianos = Math.atan2(tunerCenterY - e.pageY, tunerCenterX - e.pageX);

				anguloInicial = (anguloEmRadianos * (180 / Math.PI)) - anguloAtual;

			});

			tuner.on('mousemove', function (e) {

				if (anguloInicial !== null) {

					var self = this,
						anguloEmRadianos = Math.atan2(tunerCenterY - e.pageY, tunerCenterX - e.pageX),
						anguloRelativo = anguloEmRadianos * (180 / Math.PI),
						anguloTemp = anguloAtual;

					anguloAtual = (anguloInicial * 0) + (anguloRelativo - anguloInicial);
					var angTemp = (anguloTemp - anguloAtual);

					if (angTemp > 180) {
						angTemp -= 360;
					}
					if (angTemp < -180) {
						angTemp += 360;
					}

					pointerPosInicial += angTemp * -0.07;

					if (pointerPosInicial < 0) {
						anguloInicial=anguloRelativo;
						anguloTemp=anguloAtual=0;
						pointerPosInicial = 0;
					} else if (pointerPosInicial > pointerPosFinal) {
						anguloInicial=anguloRelativo;
						anguloTemp=anguloAtual=0;
						pointerPosInicial = pointerPosFinal;
					}

					pointer.setStyle("left", pointerPosInicial);

					Y.one(tunerRotElement).setStyle("MozTransform", "rotate(" + anguloAtual + "deg)");
					Y.one(tunerRotElement).setStyle("webkitTransform", "rotate(" + anguloAtual + "deg)");
					Y.one(tunerRotElement).setStyle("transform", "rotate(" + anguloAtual + "deg)");

					// calcula canal e ruido
					var newChannel = Math.round( (pointerPosInicial * (numChannels - 1)) / displayWidth) ;

					if (newChannel != channel) {

						audios[channel].pause();
						audios[channel].currentTime = 0;

						channel = newChannel;

						if (playing) {
							audios[channel].play();
						}

					}

					wavePos = (Math.cos( ((pointerPosInicial * (numChannels - 1) * 2) / displayWidth) * Math.PI ) * 0.5 + 0.5);
					setVolume(volumeAudio);

				}

			});

		},

		setVolume = function(vol){

			var volBase = (1 - wavePos) - 0.1;

			if (volBase < 0) {
				volBase = 0;
			}

			if (playing) {
				audioChiado.volume = volBase * 0.7 * vol;
				audios[channel].volume = wavePos * vol;
			} else {
				audioChiado.volume = 0;
			}

		},

		konamiCode = function(){

			var kkeys = [],
				konami = "38,38,40,40,37,39,37,39,66,65";

			Y.one(document).on('keydown', function(e) {

			  kkeys.push( e.keyCode );

			  if ( kkeys.toString().indexOf( konami ) >= 0 ){
			    Y.one(document).detach('keydown', arguments.callee);
		    	Y.one("html").addClass("tron");
			  }

			});
		}

		return {

			init: function() {

				for (var i = 0; i < numChannels; i++) {
					var newAudio = document.createElement('audio');
					newAudio.innerHTML='<source src="http://media.zenorocha.com/oldradio/' + i + '.mp3" type="audio/mpeg"><source src="http://media.zenorocha.com/oldradio/' + i + '.ogg" type="audio/ogg">';
					audioContainner.appendChild(newAudio);
					audios.push(newAudio);
					newAudio.addEventListener("ended", function(e){ e.target.play(); }, false);
				}

				audioChiado = document.getElementById("audio_chiado");
				audioSource = Y.one('#audio source');
				audioChiado.volume = 0;

				//loop
				audioChiado.addEventListener("ended", function(e){ e.target.play(); }, false);

				audioChiado.play();
				bind();
				konamiCode();
			}

		};
	};

	var radio = new HTML5PRO.APPS.Radio();
	radio.init();

});

