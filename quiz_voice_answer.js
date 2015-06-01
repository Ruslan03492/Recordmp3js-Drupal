function __log(e, data) {
  log.innerHTML = "\n" + e + " " + (data || '');
}

var audio_context;
var recorder;
var audioStream = null;

var rec = document.getElementById('rec');
if (rec) {
  rec.addEventListener(
    'click', function () {
      if (navigator.getUserMedia) {
        navigator.getUserMedia(
          {audio: true}, startUserMedia, function (e) {
            __log(Drupal.t('No live audio input: ') + e);
          }
        );
      }
    }
  );
}

function startUserMedia(stream) {
  audioStream = stream;
  var input = audio_context.createMediaStreamSource(stream);
  input.connect(audio_context.destination);
  recorder = new Recorder(input);
  startRecording(rec);
}

function startRecording(button) {
  recorder && recorder.record();
  button.disabled = true;
  button.nextElementSibling.disabled = false;
  __log(Drupal.t('Recording...'));
}

function stopRecording(button) {
  recorder && recorder.stop();
  button.disabled = true;
  button.previousElementSibling.disabled = false;
  // create WAV download link using audio data blob.
  createDownloadLink();
  recorder.clear();
}

function createDownloadLink() {
  recorder && recorder.exportWAV(function (blob) {
  });
}

var stop = document.getElementById('stop');
if (stop) {
  stop.addEventListener(
    'click', function () {
      stopRecording(this);
      audioStream.stop();
    }
  );
}

window.onload = function init() {
  try {
    // webkit shim.
    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    navigator.getUserMedia = ( navigator.getUserMedia ||
    navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia ||
    navigator.msGetUserMedia);
    window.URL = window.URL || window.webkitURL;
    audio_context = new AudioContext;
  } catch (e) {
    alert(Drupal.t('No web audio support in this browser!'));
  }
};
