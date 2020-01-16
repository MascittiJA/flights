function selectDate(selector) {
  $selector = "#" + selector;
  $spanSelector = $selector.replace("circle", "span");
  var current = $selector.replace("circle", "");

  $(".active").removeClass("active");
  $($selector).addClass("active");

  if ($($spanSelector).hasClass("right")) {
    $(".center").removeClass("center").addClass("left")
    $($spanSelector).addClass("center");
    $($spanSelector).removeClass("right")
  } else if ($($spanSelector).hasClass("left")) {
    $(".center").removeClass("center").addClass("right");
    $($spanSelector).addClass("center");
    $($spanSelector).removeClass("left");
  };
};

//form initialization
function setDateForm() {
  var today = new Date();
  var firstRTA = addMinutes(today,120);

  document.getElementById("dateInputETD").value = getDate(today);
  document.getElementById("timeInputETD").value = getTime(today);
  document.getElementById("dateInputRTA").value = getDate(firstRTA);
  document.getElementById("timeInputRTA").value = getTime(firstRTA);
}

function addMinutes(date, minutes) {
  return new Date(date.getTime() + (1000 * 60 * minutes));;
}

function getDate(date) {
  var dd = date.getDate();
  var mm = date.getMonth()+1; //January is 0!
  var yyyy = date.getFullYear();

  var dateFormat = yyyy + '-' + formatNumber(mm) + '-' + formatNumber(dd);
  return dateFormat
}

function getTime(time) {
  var h = time.getHours();
  var m = time.getMinutes();

  var timeFormat = formatNumber(h) + ':' + formatNumber(m);
  return timeFormat;
}

function spanDate(date) {
  return getDate(date) + ", " + getTime(date);

}

function formatNumber(number){
    if (number<10){
      return '0' + number
    } else {
      return number
    }
}

function newDate(date, time){
  var splitDate = date.split('-');
  var year = splitDate[0];
  var month = splitDate[1];
  var day = splitDate[2];

  var splitTime = time.split(':');
  var HH = splitTime[0];
  var mm = splitTime[1];

  var today = new Date(year, month, day, HH, mm)
  //console.log(today);
  return today
}

function diffTime(date1, date2) {
  var newDate = new Date(date1.getTime() - date2.getTime());
  //console.log(newDate.getTime());
  return  formatElapsed(newDate);
}

function formatElapsed(elapsed) {
  var hours = Math.trunc(elapsed / (1000 * 60 * 60)) % 24;
  var minutes = Math.trunc(elapsed / (1000 * 60)) % 60;
  //console.log(formatNumber(hours) + ":" + formatNumber(minutes));
  return formatNumber(hours) + ":" + formatNumber(minutes);
}

//Main function. Draw your circles.
function makeCircles() {

  var restChecked = document.getElementById("rest").checked;
  console.log(restChecked);

  //Calculate data
  var ETDdate = document.getElementById("dateInputETD").value;
  var ETDtime = document.getElementById("timeInputETD").value;
  var RTAdate = document.getElementById("dateInputRTA").value;
  var RTAtime = document.getElementById("timeInputRTA").value;

  var ETD = newDate(ETDdate,ETDtime);
  var RTA = newDate(RTAdate,RTAtime);

  var CCT = addMinutes(ETD, -120);
  var LEY = addMinutes(ETD, -60);
  var FIN = addMinutes(RTA, 30);

  var first = CCT.getTime();
  var last = FIN.getTime() - first;

  //Setting Time Flights
  document.getElementById("tablita").rows[1].cells[0].innerHTML = diffTime(RTA, ETD);
  document.getElementById("tablita").rows[1].cells[1].innerHTML = diffTime(FIN, LEY);
  document.getElementById("tablita").rows[1].cells[2].innerHTML = diffTime(FIN, CCT);

  // Clean Content
  $("#line").text("");
  $("#mainCont").text("");

  //Draw first date circle (CCT)
  $("#line").append('<div class="circle" id="circle0" style="left: ' + 0 + '%;"><div class="popupSpan">' + spanDate(CCT) + '</div></div>');
  $("#mainCont").append('<span id="span0" class="center">' + 'CCT' + '</span>');

  //Draw the date circle (LEY)
  var relativeInt = (LEY.getTime() - first) / last;
  $("#line").append('<div class="circle" id="circle1" style="left: ' + relativeInt * 100 + '%;"><div class="popupSpan">' + spanDate(LEY) + '</div></div>');
  $("#mainCont").append('<span id="span1" class="right">' + 'LEY' + '</span>');

  //Draw the date circle (ETDº)
  var relativeInt = (ETD.getTime() - first) / last;
  $("#line").append('<div class="circle" id="circle2" style="left: ' + relativeInt * 100 + '%;"><div class="popupSpan">' + spanDate(ETD) + '</div></div>');
  $("#mainCont").append('<span id="span2" class="right">' + 'ETD' + '</span>');

  //Draw the date circle (RTA)
  var relativeInt = (RTA.getTime() - first) / last;
  $("#line").append('<div class="circle" id="circle3" style="left: ' + relativeInt * 100 + '%;"><div class="popupSpan">' + spanDate(RTA) + '</div></div>');
  $("#mainCont").append('<span id="span3" class="right">' + 'RTA' + '</span>');

  //Draw the date circle (FIN)
  $("#line").append('<div class="circle" id="circle4" style="left: ' + 99 + '%;"><div class="popupSpan">' + spanDate(FIN) + '</div></div>');
  $("#mainCont").append('<span id="span4" class="right">' + 'FIN' + '</span>');

  $(".circle:first").addClass("active");

  $(".circle").mouseenter(function() {
    $(this).addClass("hover");
  });

  $(".circle").mouseleave(function() {
    $(this).removeClass("hover");
  });

  $(".circle").click(function() {
    var spanNum = $(this).attr("id");
    selectDate(spanNum);
  });

  selectDate('circle2');
}

setDateForm();

makeCircles();
