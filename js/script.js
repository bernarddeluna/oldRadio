window.HTML5PRO = window.HTML5PRO || {};
HTML5PRO.APPS = HTML5PRO.APPS || {};

(function($){
	
	HTML5PRO.APPS.Radio = function(){
		
		var audio,
			audioChiado,
			audioList = $('audio'),
			audioContainner = $('#audio_containner')[0],
			audioSource,
			volumeAudio=1,
			anguloAtual = 0,
			anguloInicial = null,
			
			tuner = $(".tuner .controllerCont"),
			tunerRotElement = $(".tuner .controller"),
			tunerCenterX = tuner.offset().left + (tuner.width() / 2),
			tunerCenterY = tuner.offset().top + (tuner.height() / 2),
			tunerDown = false,

			numChannels = 10,
			displayWidth = 230,
			channel = 0,
			audios = new Array(),

			pointer = $(".pointer"),
			pointerPosInicial = 0,
			pointerPosFinal = 227,

			volume = $(".volume .controllerCont"),
			volumeRotElement = $(".volume .controller"),
			volumeCenterX = volume.offset().left + (volume.width() / 2),
			volumeCenterY = volume.offset().top + (volume.height() / 2),
			volumeDown = false,

			volumeAnguloAtual = 0,
			volumeAnguloInicial = null,

			blockMove = 0,
			wavePos = (Math.cos( ((0*(numChannels-1)*2)/displayWidth)*Math.PI )*0.5+0.5),
			playing = false;
		
		bind = function() {

			$(".on-off").click(function(e) {
				
				e.preventDefault();
				
				if (playing) { 
					playing = false;
					audios[channel].pause();
					$(".case").removeClass('on');
				} else { 
					playing = true;
					audios[channel].play();
					$(".case").addClass('on');
				}

				audios[channel].currentTime=0;
				setVolume(volumeAudio);

			});

			$(".global-radio").mouseup(function(e) {
				volumeDown = false;
				volumeAnguloInicial = null;
				anguloInicial = null;
				blockMove = 0;
			});

			// --- Volume --- //

			volume.mousedown(function(e) {

				volumeDown = true;
				
				var self = this,
					anguloEmRadianos = Math.atan2(volumeCenterY - e.pageY, volumeCenterX - e.pageX);
				
				volumeAnguloInicial = (anguloEmRadianos * (180 / Math.PI)) - volumeAnguloAtual;

			});

			volume.mousemove(function(e) {

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

					if(blockMove == -1) {
					    volumeAnguloAtual = 180;
					}

					if(blockMove == 1) {
						volumeAnguloAtual = 360;
					}

					volumeAudio = ( volumeAnguloAtual - 180 ) / 180;

					setVolume(volumeAudio);

                    $(volumeRotElement).css("-webkit-transform", "rotate(" + volumeAnguloAtual + "deg)");
                    $(volumeRotElement).css("-moz-transform", "rotate(" + volumeAnguloAtual + "deg)");
				}

			});

			// --- Tuner --- //

			tuner.mouseup(function(e) {
				tunerDown = false;
				anguloInicial = null;
			});

			tuner.mousedown(function(e) {

				tunerDown = true;

				var self = this,
					anguloEmRadianos = Math.atan2(tunerCenterY - e.pageY, tunerCenterX - e.pageX);
					
				anguloInicial = (anguloEmRadianos * (180 / Math.PI)) - anguloAtual;

			});

			tuner.mousemove(function(e) {
				
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
						pointerPosInicial = 0;
					} else if (pointerPosInicial > pointerPosFinal) {
						pointerPosInicial = pointerPosFinal;
					}

					pointer.css("left", pointerPosInicial);

					$(tunerRotElement).css("-webkit-transform", "rotate(" + anguloAtual + "deg)");
					$(tunerRotElement).css("-moz-transform", "rotate(" + anguloAtual + "deg)");

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

		}

		return {
			
			init: function(){ 
				
				for (var i = 0; i < numChannels; i++) {
					var newAudio = document.createElement('audio');
					newAudio.innerHTML='<source src="http://media.zenorocha.com/oldradio/' + i + '.mp3" type="audio/mpeg"><source src="http://media.zenorocha.com/oldradio/' + i + '.ogg" type="audio/ogg">';
					audioContainner.appendChild(newAudio);
					audios.push(newAudio);
					//loop
					newAudio.addEventListener("ended", function(e){ e.target.play(); }, false);
				}

				$(document).bind('keypress', function (e) {
				    
				});
				
				audioChiado = document.getElementById("audio_chiado");
				audioSource = $('#audio source')[0];
				audioChiado.volume = 0;

				//loop
				audioChiado.addEventListener("ended", function(e){ e.target.play(); }, false);

				audioChiado.play();
				bind();
			}

		};
	};
	
	$(function(){
		var radio = new HTML5PRO.APPS.Radio();
		radio.init();
	});
	
}(jQuery));

