var firstScriptTag = document.getElementsByTagName('script')[0];

var youtube = document.createElement('script');
youtube.src = "https://www.youtube.com/player_api";
firstScriptTag.parentNode.insertBefore(youtube, firstScriptTag);

var iframe = document.createElement('script');
iframe.src = "https://www.youtube.com/iframe_api";
firstScriptTag.parentNode.insertBefore(iframe, firstScriptTag);

var player;
var flagPlay = true;

//Start-Video
var timer, flag25, flag50, flag75;

function percentage() {

  flag25 = false;
  flag50 = false;
  flag75 = false;

  timer = setInterval(function(){
    var count = parseInt((Math.floor(player.getCurrentTime())/Math.floor(player.getDuration()))*100);

    if (count >= 25 && flag25 != true) {
      flag25 = true;
      dataLayer.push({'event' : 'GAEvent' , 'eventoCategoria' : 'Nivea-Milk' , 'eventoAcao' : 'Video Retencao' , 'eventoRotulo' : '25%-Video'});
    } else if (count >= 50 && flag50 != true) {
      flag50 = true;
      dataLayer.push({'event' : 'GAEvent' , 'eventoCategoria' : 'Nivea-Milk' , 'eventoAcao' : 'Video Retencao' , 'eventoRotulo' : '50%-Video'});
    } else if (count >= 75 && flag75 != true) {
      flag75 = true;
      dataLayer.push({'event' : 'GAEvent' , 'eventoCategoria' : 'Nivea-Milk' , 'eventoAcao' : 'Video Retencao' , 'eventoRotulo' : '75%-Video'});
    };
  }, 1000);

  //checkPercent();
}

function onPlayerStateChange(event) {

  if (event.data === 0) {
          //fim de video
          dataLayer.push({'event' : 'GAEvent' , 'eventoCategoria' : 'Nivea-Milk' , 'eventoAcao' : 'Video Retencao' , 'eventoRotulo' : '100%-Video'});
          clearInterval(timer);
        } else if (event.data == 1 && flagPlay) {
          dataLayer.push({'event' : 'GAEvent' , 'eventoCategoria' : 'Nivea-Milk' , 'eventoAcao' : 'Play' , 'eventoRotulo' : 'Start-Video'});
          flagPlay = null;
          percentage();
        } else if (event.data == 2) {
        // pause
      }
  //end close video
  if(event.data === 0) {
    $('#player').css({
      'opacity': 0,
      'z-index': -1
    });
  }
}

// autoplay video
function onPlayerReady(event) {
  $('#play').on('click', function () {
    event.target.playVideo();
    $('#player').delay('800').css({
      'opacity': 1,
      'z-index': 1
    });
  });
}
window.onYouTubePlayerAPIReady = function() {
  player = new YT.Player('player', {
    videoId: 'WkbydwZJ7mQ',
    playerVars: { 'autoplay': 0, 'showinfo' : 0,'rel': 0},
    events: {
      'onReady': onPlayerReady,
      'onStateChange': onPlayerStateChange
    }
  });
}

$(document).ready(function(){

  var altHtml = document.querySelector('html').clientHeight;
  var w = window.parent.window;
  
  var gScroll;

  w.document.querySelector('iframe').style.minHeight = altHtml + 'px';

  $('.btn-reg').click(function(){
    // document.domain = "nivea.com.br";
    
    topScroll =  $(w).scrollTop()
    globalTopScroll = topScroll;

    w.scrollTo(0,0);

    $('.box-text').animate({scrollTop: 0},100);
    $('#modal').show();

    if(window.innerWidth <= 768){
      var modal = $('#modal').height();
      w.document.querySelector('iframe').style.minHeight = modal + 'px';
    }
  })

  $('body').on('click', '#closeModal', function(){
    var w = window.parent.window;
    w.scrollTo(globalTopScroll,globalTopScroll);
    $('#modal').hide();
    w.document.querySelector('iframe').style.minHeight = altHtml + 'px';
    // document.domain = window.location.hostname;
  })
})

  /////////////////////////////////
  //TAGUEAMENTO
  /////////////////////////////////

  //Pageview
  dataLayer.push({'event' : 'pageTrack' , 'PNPagina' : 'nivea-milk'});

  //Leia o regulamento
  $('.btn-reg').click(function(){
    dataLayer.push({'event' : 'GAEvent' , 'eventoCategoria' : 'Nivea-Milk' , 'eventoAcao' : 'Clique' , 'eventoRotulo' : 'Leia o regulamento'});
  });

  //Entrar em contato
  $('.btn-chat').click(function(){
    dataLayer.push({'event' : 'GAEvent' , 'eventoCategoria' : 'Nivea-Milk' , 'eventoAcao' : 'Clique' , 'eventoRotulo' : 'Entrar em contato'});
  });

  //Compre Aqui
  $('.btn-compre').click(function(){
    dataLayer.push({'event' : 'GAEvent' , 'eventoCategoria' : 'Nivea-Milk' , 'eventoAcao' : 'Clique' , 'eventoRotulo' : 'Compre Aqui'});
  });