
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

var n_lines = 1
				   
function user_info() {
  document.getElementById("footer").innerHTML = 'getting data';
//    $.get("user.php", function(data, status){
//        var users = $.parseJSON(data);
	//
  users = [{user_login: 'tflaspoehler',
            user_first: 'Tim',
            user_last: 'Flaspoehler'}]
  document.getElementById("footer").innerHTML = "<b>" + users[0].user_login + "</b> (" + users[0].user_first + " " + users[0].user_last + ")";
//    });
}

function get_date() {
	today =  new Date();
	y = today.getFullYear();
	m = today.getMonth() + 1;
	d = today.getDate();
	var day = days[ today.getDay() ];
	document.getElementById("date").innerHTML = day + " (" + m + "/" + d + "/" + y + ")";
}

function check_book() {
    var w = window.outerWidth;
    var h = window.outerHeight;
    if (w < 0) {
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
    /// fetch('lines')
    ///   .then(function(lines) {
    /// 	console.log('ello gov');
    /// 	console.log(lines);
    ///   });
	$.getJSON(
		"lines",
		function(data) {
			
			var today =  new Date();
			var y = today.getFullYear();
			var m = today.getMonth() + 1;
			var d = today.getDate();
			var day = days[ today.getDay() ];
			var date = day + " (" + m + "/" + d + "/" + y + ")";
			data.days.push({id:1, title:date, text:'&nbsp;'});
			data.lines.push({});
			var next = ''
			for (var i = 0; i < data.days.length; ++i) {				
				next += '<div class="day" id="day' + i +'">';
				next += '  <div class="line title">';
				next += '    <input type="checkbox" name="checkbox.day.' + i +'" id="checkbox.day.' + i +'" value="value">'
                next += '    <label for="checkbox.day.' + i +'" class="heavy" contenteditable="false">' + data.days[i].title + '</label>'
				next += '    <div class="text" contenteditable="true" style="text-align: right; font-style: italic;">' + data.days[i].text + '</div>';
				next += add_lines(data.lines[i], base_id='day' + i +'-0');
				next += '    <div class="line adder" id="adder_line"></div>';
				next += '  </div>';
				next += '</div>';
			}
		    document.getElementById("days").innerHTML = next;
		    $(document).ready(add_listeners);
		}
	);
}

function add_lines(lines, base_id=0) {
  var id = parseInt(base_id.split('-').slice(-1)[0])
  var next = '';
  for (var line in lines) {
	  n_lines = base_id + '-' + lines[line].id;
	  if (lines[line].parent_id === id) {
	  next += '<div class="line" id="' + n_lines + '.line">';
	  next += '    <svg id="' + n_lines + '" class="bullet" checked="0" xmlns="http://www.w3.org/2000/svg" version="1.0"  viewBox="0 0 55 20" style="position: relative; top: 0; left: -1.5em; z-index: 100;">';
	  next += '      <rect x="2.5" y="0" width="10" height="20" class="ex option click_box" id="' + n_lines + '.ex.box" />';
	  next += '      <path d="M 5 6.5 l 5 5 M 10 6.5 l -5 5" class="ex option" id="' + n_lines + '.ex" />';
	  next += '      ';
	  next += '      <rect x="12.5" y="0" width="10" height="20" class="descriptor option click_box" id="' + n_lines + '.descriptor.box" fill="rgba(0, 0, 0, 0)" stroke="rgba(0, 0, 0, 0)" stroke-width="1"/>';
      if (lines[line].important === true) {
	      next += '      <path d="M 15 2.5 l 0.5 7 l 4 0 l 0.5 -7 l -5 0 m 2.5 12.5 c -1.8 0, -2.0 -1.0, -2.0 -2.0 c 0 -1.8, 1.0 -2.0, 2.0 -2.0 c 1.8 0, 2.0 1.0, 2.0 2.0 c 0 1.8, -1.0 2.0, -2.0 2.0" style="visibility: visible; fill: #33f;" id="' + n_lines + '.descriptor" class="descriptor option" />';
	  }
	  else {
		  next += '      <path d="M 15 2.5 l 0.5 7 l 4 0 l 0.5 -7 l -5 0 m 2.5 12.5 c -1.8 0, -2.0 -1.0, -2.0 -2.0 c 0 -1.8, 1.0 -2.0, 2.0 -2.0 c 1.8 0, 2.0 1.0, 2.0 2.0 c 0 1.8, -1.0 2.0, -2.0 2.0" style="visibility: hidden; fill: rgba(0, 0, 0, 0.3);" id="' + n_lines + '.descriptor" class="descriptor option" />';
	      }
	  next += '      ';
	  next += '      <rect x="24" y="0" width="10" height="20" class="dot option click_box" id="' + n_lines + '.checkers.box" fill="rgba(0, 0, 0, 0)" stroke="rgba(0, 0, 0, 0)" stroke-width="1"/>';
	  next += '      <path d="' + shapes[lines[line].shape] + '" fill="' + fills[lines[line].shape] + '" class="dot option" id="' + n_lines + '.checkers"/>';
	  if (lines[line].check === true) {
	      next += '      <path d="' + checks[lines[line].shape] + '" style="visibility: visible; stroke: #33f; fill: ' + check_fills[lines[line].shape] + ';" class="check" id="' + n_lines + '.check" />';
	  }
	  else {
	      next += '      <path d="' + checks[lines[line].shape] + '" style="visibility: hidden; stroke: #33f; fill: ' + check_fills[lines[line].shape] + ';" class="check" id="' + n_lines + '.check" />';
	  }
	  next += '      <rect x="35.5" y="0" width="10" height="20" class="change option click_box" id="' + n_lines + '.change.box" fill="rgba(0, 0, 0, 0)" stroke="rgba(0, 0, 0, 0)" stroke-width="1"/>';
	  next += '      <path d="M 40 14 C 44 10, 44 8, 40 4 m -2 4 l2 -4 l4 2" id="' + n_lines + '.change" class="change option" stroke="#333" stroke-width="0.4" fill="transparent"/>';
	  next += '      <rect x="46.0" y="0" width="9" height="20" class="plus option click_box" id="' + n_lines + '.plus.box" />';
	  next += '      <path d="M 48.5 9 l 5 0 m -2.5 -2.5 l 0 5" class="plus option" id="' + n_lines + '.plus" />';
	  next += '    </svg>';
	  next += '  <div class="text" contenteditable="true" style="position: relative; padding-left: 0; top: 0;">' + lines[line].text;
      for (var subs in lines) {
		  if (lines[line].id === lines[subs].parent_id) {
			  next += add_lines(lines, id=n_lines);
			  break;
		  }
	  }
	  id = lines[line].parent_id;
	  next += '  </div>';
	  next += '</div>';
	  /// add_lines(lines, lines[i].id);
      }
  }
  return next;
}

function add_listeners() {
  $( ".dot" ).unbind().click(box_click); 
  $( ".check" ).unbind().click(box_click); 
  $( ".change" ).unbind().click(bullet_change); 
  $( ".plus" ).unbind().click(add_line); 
  $( ".ex" ).unbind().click(delete_line); 
  $( ".adder" ).unbind().click(new_line);
  $( ".descriptor" ).unbind().click(star_line);
  $( ".lining" ).unbind().click(change_lines);
}

$(document).ready(add_listeners);

$(document).ready(user_info);

$("body").on('DOMSubtreeModified', ".line", add_listeners);


function new_line(event) {
  event.stopPropagation();
  console.log('adding line');
  n_lines += 1
  var next = '';
  next += '<div class="line" id="' + n_lines + '.line">';
  next += '    <svg id="' + n_lines + '" class="bullet" checked="0" xmlns="http://www.w3.org/2000/svg" version="1.0"  viewBox="0 0 55 20" style="position: relative; top: 0; left: -1.5em; z-index: 100;">';
  next += '      <rect x="2.5" y="0" width="10" height="20" class="ex option click_box" id="' + n_lines + '.ex.box" />';
  next += '      <path d="M 5 6.5 l 5 5 M 10 6.5 l -5 5" class="ex option" id="' + n_lines + '.ex" />';
  next += '      ';
  next += '      <rect x="12.5" y="0" width="10" height="20" class="descriptor option click_box" id="' + n_lines + '.descriptor.box" fill="rgba(0, 0, 0, 0)" stroke="rgba(0, 0, 0, 0)" stroke-width="1"/>';
  next += '      <path d="M 15 2.5 l 0.5 7 l 4 0 l 0.5 -7 l -5 0 m 2.5 12.5 c -1.8 0, -2.0 -1.0, -2.0 -2.0 c 0 -1.8, 1.0 -2.0, 2.0 -2.0 c 1.8 0, 2.0 1.0, 2.0 2.0 c 0 1.8, -1.0 2.0, -2.0 2.0" style="visibility: hidden; fill: rgba(0 ,0, 0, 0.3)" id="' + n_lines + '.descriptor" class="descriptor option" />';
  next += '      ';
  next += '      <rect x="24" y="0" width="10" height="20" class="dot option click_box" id="' + n_lines + '.checkers.box" fill="rgba(0, 0, 0, 0)" stroke="rgba(0, 0, 0, 0)" stroke-width="1"/>';
  next += '      <path d="' + shapes[0] + '" fill="' + fills[0] + '" class="dot option" id="' + n_lines + '.checkers"/>';
  next += '      <path d="' + checks[0] + '" style="visibility: hidden;" fill="rgba(0, 0, 0, 0.3)"  class="check" id="' + n_lines + '.check" />';
  next += '      <rect x="35.5" y="0" width="10" height="20" class="change option click_box" id="' + n_lines + '.change.box" fill="rgba(0, 0, 0, 0)" stroke="rgba(0, 0, 0, 0)" stroke-width="1"/>';
  next += '      <path d="M 40 14 C 44 10, 44 8, 40 4 m -2 4 l2 -4 l4 2" id="' + n_lines + '.change" class="change option" stroke="#333" stroke-width="0.4" fill="transparent"/>';
  next += '      <rect x="46.0" y="0" width="9" height="20" class="plus option click_box" id="' + n_lines + '.plus.box" />';
  next += '      <path d="M 48.5 9 l 5 0 m -2.5 -2.5 l 0 5" class="plus option" id="' + n_lines + '.plus" />';
  next += '    </svg>';
  next += '  <div class="text" contenteditable="true" style="position: relative; padding-left: 0; top: 0;">&nbsp;';
  next += '  </div>';
  next += '</div>';
  
  event.target.insertAdjacentHTML('beforebegin', next);
  $(document).ready(add_listeners);
}
function add_line(event) {
  event.stopPropagation();
  var boss = event.target.id.split(".")[0];
  line = document.getElementById(boss+".line");
  lines = document.getElementById(boss+".line").querySelectorAll('*[id]');
  lines = document.getElementById(boss+".line").querySelectorAll(':scope > .line');
  var number = 1;
  if (lines.length > 0) {
	  number = lines[lines.length-1].id.split(".")[0].split("-");
	  number = parseInt(number[number.length-1]) + 1;
  }
  for (var i = 0; i < lines.length; ++i) {
	  console.log('these are the lines ' + lines[i].id);
  }
  console.log('adding line');
  boss += "-" + number;
  var next = '';
  next += '<div class="line" id="' + boss + '.line">';
  next += '    <svg id="' + boss + '" class="bullet" checked="0" xmlns="http://www.w3.org/2000/svg" version="1.0"  viewBox="0 0 55 20" style="position: relative; top: 0; left: -1.5em; z-index: 100;">';
  next += '      <rect x="2.5" y="0" width="10" height="20" class="ex option click_box" id="' + boss + '.ex.box" />';
  next += '      <path d="M 5 6.5 l 5 5 M 10 6.5 l -5 5" class="ex option" id="' + boss + '.ex" />';
  next += '      ';
  next += '      <rect x="12.5" y="0" width="10" height="20" class="descriptor option click_box" id="' + boss + '.descriptor.box" fill="rgba(0, 0, 0, 0)" stroke="rgba(0, 0, 0, 0)" stroke-width="1"/>';
  next += '      <path d="M 15 2.5 l 0.5 7 l 4 0 l 0.5 -7 l -5 0 m 2.5 12.5 c -1.8 0, -2.0 -1.0, -2.0 -2.0 c 0 -1.8, 1.0 -2.0, 2.0 -2.0 c 1.8 0, 2.0 1.0, 2.0 2.0 c 0 1.8, -1.0 2.0, -2.0 2.0" style="visibility: hidden; fill: rgba(0, 0, 0, 0.3)" id="' + boss + '.descriptor" class="descriptor option"/>';
  next += '      ';
  next += '      <rect x="24" y="0" width="10" height="20" class="dot option click_box" id="' + boss + '.checkers.box" fill="rgba(0, 0, 0, 0)" stroke="rgba(0, 0, 0, 0)" stroke-width="1"/>';
  next += '      <path d="' + shapes[0] + '" fill="' + fills[0] + '" class="dot option" id="' + boss + '.checkers"/>';
  next += '      <path d="' + checks[0] + '" style="visibility: hidden;" fill="rgba(0, 0, 0, 0.3)" class="check" id="' + boss + '.check" />';
  next += '      <rect x="35.5" y="0" width="10" height="20" class="change option click_box" id="' + boss + '.change.box" fill="rgba(0, 0, 0, 0)" stroke="rgba(0, 0, 0, 0)" stroke-width="1"/>';
  next += '      <path d="M 40 14 C 44 10, 44 8, 40 4 m -2 4 l2 -4 l4 2" id="' + boss + '.change" class="change option" stroke="#333" stroke-width="0.4" fill="transparent"/>';
  next += '      <rect x="46.0" y="0" width="9" height="20" class="plus option click_box" id="' + boss + '.plus.box" />';
  next += '      <path d="M 48.5 9 l 5 0 m -2.5 -2.5 l 0 5" class="plus option" id="' + boss + '.plus" />';
  next += '    </svg>';
  next += '  <div class="text" contenteditable="true" style="position: relative; padding-left: 0; top: 0;">&nbsp;';
  next += '  </div>';
  next += '</div>';
  line.innerHTML = line.innerHTML + next;
  $(document).ready(add_listeners);
}

function delete_line(event) {
  event.stopPropagation();
  event.target.parentNode.parentNode.remove()
  console.log('deleting line');
}
function change_lines(event) {
  event.stopPropagation();
  days = document.getElementById("days");
  $('#days').attr('class', 'days');
  $('#days').toggleClass(event.target.innerHTML);
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

function star_line(event) {
  event.stopPropagation();
  var boss = event.target.id.split(".")[0]
  check = document.getElementById(boss);
  if (check.starred === 1) {
    console.log('not checked')
    check.starred = 0;
    document.getElementById(check.id+".descriptor").style.visibility = 'hidden';
    document.getElementById(check.id+".descriptor").style.fill = 'rgba(0, 0, 0, 0.3)';
  }
  else {
    console.log('check');
    check.starred = 1;
    document.getElementById(check.id+".descriptor").style.visibility = 'visible';
    document.getElementById(check.id+".descriptor").style.fill = '#33f';
  }
}

function bullet_change(event) {
  event.stopPropagation();
  var boss = event.target.id.split(".")[0]
  box = document.getElementById(document.getElementById(boss).id+".checkers");
  check = document.getElementById(document.getElementById(boss).id+".check");
  console.log('changing '+event.target.id);
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
  check.style.stroke = check_fills[i];
}
