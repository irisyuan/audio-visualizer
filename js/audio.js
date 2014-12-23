var context;
var source, sourceJs;
var analyser;
var url = 'data/test.mp3';
var array = new Array();
var boost = 0;

try {
	if(typeof webkitAudioContext === 'function' || 'webkitAudioContext' in window) {
		context = new webkitAudioContext();
	} else {
		context = new AudioContext();
	}
}
catch(e) {
	alert("Uh oh, use Chrome or another Web Audio API supported browser.");
}

var request = new XMLHttpRequest();
request.open("GET", url, true);
request.responseType = "arraybuffer";

request.onload = function() {
	context.decodeAudioData(
		request.response,
		function(buffer) {
			
			sourceJs = context.createScriptProcessor(2048, 1, 1);
			sourceJs.buffer = buffer;
			sourceJs.connect(context.destination);
			analyser = context.createAnalyser();
			analyser.smoothingTimeConstant = 0.6;
			analyser.fftSize = 512;

			source = context.createBufferSource();
			source.buffer = buffer;
			source.loop = true;

			source.connect(analyser);
			analyser.connect(sourceJs);
			source.connect(context.destination);

			sourceJs.onaudioprocess = function(e) {
				array = new Uint8Array(analyser.frequencyBinCount);
				analyser.getByteFrequencyData(array);
				boost = 0;
				for (var i = 0; i < array.length; i++) {
		            boost += array[i];
		        }
		        boost = boost / array.length;
			};

			// popup
			$('body').append($('<div onclick="play();" id="play" style="width: ' + $(window).width() + 'px; height: ' + $(window).height() + 'px;"><div id="play-button"></div></div>'));
			$('#play-button').css('top', ($(window).height() / 2 - $('#play-button').height() / 2) + 'px');
			$('#play-button').css('left', ($(window).width() / 2 - $('#play-button').width() / 2) + 'px');
			$('#play').fadeIn();
		},
		function(error) {
			alert("Uh oh!" + error);
		}
	);
};

request.onerror = function() {
	alert("Buffer: XHR error");
};

request.send();

function displayTime(time) {
	if (time < 60) {
		return '0:' + (time < 10 ? '0' + time : time);
	} else {
		var minutes = Math.floor(time / 60);
		time -= minutes * 60;
		return minutes + ':' + (time < 10 ? '0' + time : time);
	}
}

function play() {
	$('#play').fadeOut('normal', function() {
		$(this).remove();
	});
	source.start(0);
}

$(window).resize(function() {
	if($('#play').length === 1) {
		$('#play').width($(window).width());
		$('#play').height($(window).height());

		if($('#play-button').length === 1) {
			$('#play-button').css('top', ($(window).height() / 2 - $('#play-button').height() / 2) + 'px');
			$('#play-button').css('left', ($(window).width() / 2 - $('#play-button').width() / 2) + 'px');
		}
	}
});
