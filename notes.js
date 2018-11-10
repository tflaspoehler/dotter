
var days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
var months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
var shapes = ["M24 4 h10 v10 h-10 v-10",
              "M29 14 c -3 0, -5 -2, -5 -5 c 0 -3, 2 -5, 5 -5 c 3 0, 5 2, 5 5 c 0 3, -2 5, -5 5",
              "M29 11.5 c -1.8 0, -2.4 -1.2, -2.4 -2.4 c 0 -1.8, 1.2 -2.4, 2.4 -2.4 c 1.8 0, 2.4 1.2, 2.4 2.4 c 0 1.8, -1.2 2.4, -2.4 2.4"]
var fills = ["#fff",
             "#fff",
             "#333"]
var checks = ["M 25 7 L29 11 L35 1",
              "M29 11.5 c -1.8 0, -2.4 -1.2, -2.4 -2.4 c 0 -1.8, 1.2 -2.4, 2.4 -2.4 c 1.8 0, 2.4 1.2, 2.4 2.4 c 0 1.8, -1.2 2.4, -2.4 2.4",
              "M29 11.5 c -1.8 0, -2.4 -1.2, -2.4 -2.4 c 0 -1.8, 1.2 -2.4, 2.4 -2.4 c 1.8 0, 2.4 1.2, 2.4 2.4 c 0 1.8, -1.2 2.4, -2.4 2.4"]
var check_fills = ["",
                   "rgb(45, 65, 205)",
                   "rgb(45, 65, 205)"]

today =  new Date();
y = today.getFullYear();
m = today.getMonth() + 1;
d = today.getDate();
var day = days[ today.getDay() ];
document.getElementById("date").innerHTML = day + " (" + m + "/" + d + "/" + y + ")";

function check_book() {
    var w = window.outerWidth;
    var h = window.outerHeight;
    if (w > 800) {
      journal = document.getElementById("journal");
      journal.style.borderLeft = "10px solid #123";
      journal.style.borderTopLeftRadius = "20px";
      journal.style.borderBottomLeftRadius = "20px";
      daily = document.getElementById("daily");
      daily.style.width = "50%";
      daily.style.left  = "50%";
      daily.style.right  = "20px";
      bookmark = document.getElementById("bookmark");
      bookmark.style.left = '' + parseInt(w/2-15);
    }
    else {
      journal = document.getElementById("journal");
      journal.style.borderLeft = "0";
      journal.style.borderTopLeftRadius = "0";
      journal.style.borderBottomLeftRadius = "0";
      daily = document.getElementById("daily");
      daily.style.width = "100%";
      daily.style.left = "0";
      daily.style.right  = "20px";
      bookmark = document.getElementById("bookmark");
      bookmark.style.left = "0";
    }
}

function add_listeners() {
  $( ".dot" ).unbind().click(box_click); 
  $( ".check" ).unbind().click(box_click); 
  $( ".change" ).unbind().click(bullet_change); 
  $( ".plus" ).unbind().click(add_line); 
  $( ".ex" ).unbind().click(delete_line); 
  $( ".adder" ).unbind().click(new_line); 
}

$(document).ready(add_listeners);

$("body").on('DOMSubtreeModified', ".line", add_listeners);


function new_line(event) {
  event.stopPropagation();
  console.log('adding line');
  var next = ' <div class="line"><svg id="first" class="bullet" checked="0" xmlns="http://www.w3.org/2000/svg" version="1.0"  width="50" height="20" viewBox="0 0 50 20">';
  next += '<path d="M29 11.5 c -1.8 0, -2.4 -1.2, -2.4 -2.4 c 0 -1.8, 1.2 -2.4, 2.4 -2.4 c 1.8 0, 2.4 1.2, 2.4 2.4 c 0 1.8, -1.2 2.4, -2.4 2.4" class="dot" id="first.checkers" />';
  next += '<path d="M 25 7 L29 11 L35 1" class="check" id="first.check" />';
  next += '  <path d="M 40 14 C 44 10, 44 8, 40 4 m -2 4 l2 -4 l4 2" id="first.change" class="change" stroke="%23333" stroke-width="0.4" fill="transparent"/>';
  next += '<path d="M 19 9 l -5 0 M 16.5 6.5 l 0 5" class="plus" id="first.plus" />';
  next += '<path d="M 5 6.5 l 5 5 M 10 6.5 l -5 5" class="ex" id="first.ex" />';
  next += '</svg>';
  next += '<div class="text" contenteditable="true">note 2</div>';
  next += '</div>';
  event.target.insertAdjacentHTML('beforebegin', next);
}
function add_line(event) {
  event.stopPropagation();
  var boss = event.target.id.split(".")[0];
  line = document.getElementById(boss+".line");
  console.log('adding line');
  var next = ' <div class="line"><svg id="first" class="bullet" checked="0" xmlns="http://www.w3.org/2000/svg" version="1.0"  width="50" height="20" viewBox="0 0 50 20">';
  next += '<path d="M29 11.5 c -1.8 0, -2.4 -1.2, -2.4 -2.4 c 0 -1.8, 1.2 -2.4, 2.4 -2.4 c 1.8 0, 2.4 1.2, 2.4 2.4 c 0 1.8, -1.2 2.4, -2.4 2.4" class="dot" id="first.checkers" />';
  next += '<path d="M 25 7 L29 11 L35 1" class="check" id="first.check" />';
  next += '  <path d="M 40 14 C 44 10, 44 8, 40 4 m -2 4 l2 -4 l4 2" id="first.change" class="change" stroke="%23333" stroke-width="0.4" fill="transparent"/>';
  next += '<path d="M 19 9 l -5 0 M 16.5 6.5 l 0 5" class="plus" id="first.plus" />';
  next += '<path d="M 5 6.5 l 5 5 M 10 6.5 l -5 5" class="ex" id="first.ex" />';
  next += '</svg>';
  next += '<div class="text" contenteditable="true">note 2</div>';
  next += '</div>';
  line.innerHTML = line.innerHTML + next;
}

function delete_line(event) {
  event.stopPropagation();
  event.target.parentNode.parentNode.remove()
  console.log('deleting line');
}

function box_click(event) {
  event.stopPropagation();
  var boss = event.target.id.split(".")[0]
  check = document.getElementById(boss);
  console.log('checking');
  if (check.checked === 1) {
    console.log('not checked')
    check.checked = 0;
    document.getElementById(check.id+".check").style.visibility = 'hidden';
  }
  else {
    console.log('check');
    check.checked = 1;
    document.getElementById(check.id+".check").style.visibility = 'visible';
  }
}

function bullet_change(event) {
  event.stopPropagation();
  var boss = event.target.id.split(".")[0]
  box = document.getElementById(document.getElementById(boss).id+".checkers");
  check = document.getElementById(document.getElementById(boss).id+".check");
  console.log('changing');
  for (i = 0; i < shapes.length; i++) {
    if (box.getAttribute('d') === shapes[i]) {
      break;
    }
  }
  i += -1;
  if (i < 0) {i = shapes.length-1;}
  box.setAttribute('d', shapes[i]);
  box.style.fill = fills[i];
  check.setAttribute('d', checks[i]);
  check.style.fill = check_fills[i];

}
