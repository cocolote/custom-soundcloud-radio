// The canvas for your awesome JS code

// INITIAL STATE
var sameName;
var seconds;
var sMinutes;
var sSeconds;
var currentTracks;
var radioName;
var radioCategory;
var CLIENT_ID = '7def95cd192f94f4bfca5a1e0c2768ba';
$('.delete-radio').hide();

// HELPERS
function sameRadio(name, category) {
  if (sameName === name && sameCategory === category) {
    return true
  }else{
    sameName = name;
    sameCategory = category;
    return false
  }
}

function initialize(client){
  SC.initialize({
    client_id: client
  });
}

function toggleButton(track) {
  if (track.paused) {
    $('#play-pause-btn').attr('src', '/src/play.png');
  } else {
    $('#play-pause-btn').attr('src', '/src/pause.png');
  }
}

function stopMusic(track) {
  if(typeof(soundManager) !== 'undefined'){
    soundManager.stopAll();
  }
}

// ### MAIN FUNCTIONALITY ###
$('#new-radio-button').on('click', function(e) {
  e.preventDefault();
  $('#new-radio').toggle();
});

$('.list-element').hover(function() {
  var count = $(this).attr('count');
  $('.delete-radio-' + count).fadeIn(200);
}, function() {
  var count = $(this).attr('count');
  $('.delete-radio-' + count).fadeOut(200);
});

// GETS THE EVENT ON CLICK ON A RADIO TO CREATE THE PLAY LIST FOR THAT RADIO
$('.radios').on('click', function(e) {
  e.preventDefault();

  stopMusic();
  radioName = $(this).attr('name');
  radioCategory = $(this).attr('category');

  if (sameRadio(radioName, radioCategory)) {
    alert("this radio is already playing");
  }else{
    $('#radio-playing').text(radioName);
    getTracks();
  }
});


// CREATES THE PLAYLIST
function getTracks() {
  initialize(CLIENT_ID);
  SC.get('/tracks', getParameters(radioCategory), function(songs) {
    currentTracks = songs;
    playSong(currentTracks);
  });
}

function getParameters(radio) {
  var serchParameters;
  var i = Math.floor(Math.random() * 100);
  if (radio === 'genres') {
    var serchParameters = { state: 'finished', sharing: 'public', streamable: true, genres: radioName, limit: 200 };
  }else{
    var serchParameters = { state: 'finished', sharing: 'public', streamable: true, q: radioName, limit: 200 };
  }
  return serchParameters
}

// GETS THE SONG AND PLAYS IT
function playSong(tracks) {
  stopMusic();
  resetTimer();
  var i = Math.floor(Math.random() * 100);
  $('#song-title').replaceWith('<p id="song-title"><marquee behavior="scroll" direction="left">' + tracks[i].title + '</marquee></p>');
  SC.stream('/tracks/' + tracks[i].id, {flashVersion: 9, autoPlay: true, onfinish: function() { playSong(currentTracks) }}, function(track) {
    songController(track);
  });
}

// NEXT SONG
$('#next-btn').on('click', function() {
  stopMusic();
  resetTimer();
  playSong(currentTracks);
});


// CONTROLLER FOR THE PLAY PAUSE BUTTON
function songController(track) {
  toggleButton(track);
  timer(track);
  $('#play-pause-btn').on('click', function() {
    if (track.paused) {
      track.play();
    } else {
      track.pause();
    }
    toggleButton(track);
  });
}

// UPDATES THE SONG TIMER
function timer(track) {
  setInterval(function() {
    min = Math.floor(seconds / 60);
    sec = Math.floor(seconds % 60);
    min.toString().length === 1 ? sMinutes = '0' + min : sMinutes = min;
    sec.toString().length === 1 ? sSeconds = '0' + sec : sSeconds = sec;
    console.log('seconds: ' + seconds);
    if (!track.paused) {
      seconds++;
    }
    $('#timer-p').text(sMinutes + ':' + sSeconds) }, 1000);
}

function resetTimer() {
  seconds = 0;
  var sMinutes = "";
  var sSeconds = "";
  $('#timer-p').replaceWith('<p id="timer-p">00:00</p>');
}
