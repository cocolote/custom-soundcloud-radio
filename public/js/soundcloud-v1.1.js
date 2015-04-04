// The canvas for your awesome JS code

// INITIAL STATE
var sameName;
var sMinutes;
var sSeconds;
var currentTracks;
var radioName;
var trackID;
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
    var soundsIDs = soundManager.soundIDs;
    trackID = soundsIDs[0];
    for (i = 0; i < soundsIDs.length; i++) {
      soundManager.destroySound(soundsIDs[i]);
    }
  }
}

$('.list-element').hover(function() {
  var count = $(this).attr('count');
  $('.list-element-' + count).addClass('light-up');
  $('.delete-radio-' + count).fadeIn(50);
}, function() {
  var count = $(this).attr('count');
  $('.list-element-' + count).removeClass('light-up');
  $('.delete-radio-' + count).fadeOut(50);
});

// ### MAIN FUNCTIONALITY ###
$('#new-radio-button').on('click', function(e) {
  e.preventDefault();
  if ($('#new-radio').is(':hidden')) {
    $('#new-radio').slideDown('slow');
  } else {
    $('#new-radio').slideUp('slow');
  }
});


// GETS THE EVENT ON CLICK ON A RADIO TO CREATE THE PLAY LIST FOR THAT RADIO
$('.radios').on('click', function(e) {
  e.preventDefault();
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
    stopMusic();
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
  var i = Math.floor(Math.random() * 100);
  $('#song-title').replaceWith('<p id="song-title"><marquee behavior="scroll" direction="left">' + tracks[i].title + '</marquee></p>');
  SC.stream('/tracks/' + tracks[i].id, {flashVersion: 9, autoPlay: true, multiShot: false, onfinish: function() { playSong(currentTracks) }}, function(track) {
    songController(track);
  });
}

// NEXT SONG
$('#next-btn').on('click', function() {
  $('#next-btn').on('mousedown', function() {
    $('#next-song').addClass('presed-button');
    $(this).on('mouseup', function() {
      $('#next-song').removeClass('presed-button');
    });
  });
  stopMusic();
  playSong(currentTracks);
});


// CONTROLLER FOR THE PLAY PAUSE BUTTON
function songController(track) {
  toggleButton(track);
  timer(track);

  $('#play-pause-btn').on('mousedown', function() {
    $('#play-pause').addClass('presed-button');
    $(this).on('mouseup', function() {
      $('#play-pause').removeClass('presed-button');
    });
  });

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
    if (track.sID === soundManager.soundIDs[0]) {
        var seconds = track.position / 1000;
        min = Math.floor(seconds / 60);
        sec = Math.floor(seconds % 60);
        min.toString().length === 1 ? sMinutes = '0' + min : sMinutes = min;
        sec.toString().length === 1 ? sSeconds = '0' + sec : sSeconds = sec;
        $('#timer-p').text(sMinutes + ':' + sSeconds);
        containerWidth = $('#progress-bar-container').css('width');
        progress = parseInt(containerWidth) / (track.durationEstimate / 1000);
        $('#progess-bar').css('width', (progress * seconds));
      }
    }, 100);
}
