//// define dynamic content to be used throughout
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
                   "#33f",
                   "#33f"]
var next_line = 1
				   
function user_info() {
  //document.getElementById("footer").innerHTML = 'getting data';
//    $.get("user.php", function(data, status){
//        var users = $.parseJSON(data);
	//
  users = [{user_login: 'tflaspoehler',
            user_first: 'Tim',
            user_last: 'Flaspoehler'}]
  // document.getElementById("footer").innerHTML = "<b>" + users[0].user_login + "</b> (" + users[0].user_first + " " + users[0].user_last + ")";
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
}

function add_book(id=1, title='') {
	document.getElementById("days").innerHTML = '<div class="line adder dadder" id="day_adder" onclick="new_day(id=' + id + ')">new entry</div>';
	document.getElementById("book_title").innerHTML = title;
	$.ajax({
		type: "POST",
		url: "/days",
		contentType: "application/json",
		data: JSON.stringify({id: id}),
		dataType: "json",
		async: false,
		success: function(data) {
/////$.getJSON(
/////	"days",
/////	function(data) {
			
			var today =  new Date();
			var y = today.getFullYear();
			var m = today.getMonth() + 1;
			var d = today.getDate();
			var day = days[ today.getDay() ];
			var date = day + " (" + m + "/" + d + "/" + y + ")";
			// data.days.push({id:1, title:date, quote:'&nbsp;'});
			// data.lines.push({});
			let next = ''
			for (var i = 0; i < data.days.length; ++i) {
				let label = data.days[i].id
				let collapse = '';
				if (data.days[i].collapse) {
					collapse = 'checked';
				}
				next = '';
				next += '<div class="day" id="day' + data.days[i].id +'">';
				next += '  <div class="line title" id="day'+ data.days[i].id + '.content">';
				next += '  <div class="delete_day" id="delete.day.' + data.days[i].id +'"></div>'
				next += '    <input type="checkbox" name="checkbox.day.' + data.days[i].id +'" id="checkbox.day.' + data.days[i].id +'" value="value" ' + collapse + '>'
                next += '    <label style="position: relative; z-index: 100;" class="collapse" id="label.day.' + data.days[i].id +'" for="checkbox.day.' + data.days[i].id +'"></label>'
				next += '    <input style="position: relative; z-index: 100;" class="heavy" type="text" value="' + data.days[i].title + '" id="title.' + data.days[i].id +'"></input>'
				next += '    <div class="quote" contenteditable="true" style="text-align: right; font-style: italic;">' + data.days[i].quote + '</div>';
				next += '  </div>';
				next += '<br></div>';
				document.getElementById("days").innerHTML += next;
				$.ajax({
								type: "POST",
								url: "/lines",
								contentType: "application/json",
								data: JSON.stringify({id: label}),
								dataType: "json",
								async: false,
								success: function(response) {
									// next_line = max([next_line, max(response.lines()['id'], key=lambda x: x['id'])+1]);
									next_line = response.lines.reduce((max, line) => parseInt(line.id) > max ? line.id : max, next_line)
									console.log('max', next_line);
									let nxt = add_lines(response.lines, base_id='day' + label +'-0');
									nxt += '    <div class="line adder ladder" id="adder_line.' + data.days[i].id +'">new line</div>';
									document.getElementById('day'+ label + '.content').innerHTML += nxt;
								},
								error: function(err) {
									document.getElementById('day'+ label + '.content').innerHTML += 'problem reading db';
									console.log(err);
								}
							});
			}
		    $(document).ready(add_listeners);
			$("body").on('DOMSubtreeModified', ".line", add_listeners);
		}
		});
}

function add_lines(lines, base_id=0) {
  var id = parseInt(base_id.split('-').slice(-1)[0])
  let nxt = '';
  for (var line in lines) {
	  let name = base_id + '-' + lines[line].id;
	  if (lines[line].parent_id === id) {
	  var checked = 0;
	  if (lines[line].check === true) {checked = 1;}
	  nxt += '<div class="line" id="' + name + '.line">';
	  nxt += '    <svg draggable="true" id="' + name + '" class="bullet" checked="' + checked + '" xmlns="http://www.w3.org/2000/svg" version="1.0"  viewBox="0 0 55 20" style="position: relative; top: 0; left: -1.5em; z-index: 100;">';
	  nxt += '      <rect x="2.5" y="0" width="10" height="20" class="ex option click_box" id="' + name + '.ex.box" />';
	  nxt += '      <path d="M 5 6.5 l 5 5 M 10 6.5 l -5 5" class="ex option" id="' + name + '.ex" />';
	  nxt += '      ';
	  nxt += '      <rect x="12.5" y="0" width="10" height="20" class="descriptor option click_box" id="' + name + '.descriptor.box" fill="rgba(0, 0, 0, 0)" stroke="rgba(0, 0, 0, 0)" stroke-width="1"/>';
      if (lines[line].important === true) {
	      nxt += '      <path d="M 15 2.5 l 0.5 7 l 4 0 l 0.5 -7 l -5 0 m 2.5 12.5 c -1.8 0, -2.0 -1.0, -2.0 -2.0 c 0 -1.8, 1.0 -2.0, 2.0 -2.0 c 1.8 0, 2.0 1.0, 2.0 2.0 c 0 1.8, -1.0 2.0, -2.0 2.0" style="visibility: visible; fill: #33f;" id="' + name + '.descriptor" class="descriptor option" />';
	  }
	  else {
		  nxt += '      <path d="M 15 2.5 l 0.5 7 l 4 0 l 0.5 -7 l -5 0 m 2.5 12.5 c -1.8 0, -2.0 -1.0, -2.0 -2.0 c 0 -1.8, 1.0 -2.0, 2.0 -2.0 c 1.8 0, 2.0 1.0, 2.0 2.0 c 0 1.8, -1.0 2.0, -2.0 2.0" style="visibility: hidden; fill: rgba(0, 0, 0, 0.3);" id="' + name + '.descriptor" class="descriptor option" />';
	      }
	  nxt += '      ';
	  nxt += '      <rect x="24" y="0" width="10" height="20" class="dot option click_box" id="' + name + '.checkers.box" fill="rgba(0, 0, 0, 0)" stroke="rgba(0, 0, 0, 0)" stroke-width="1"/>';
	  nxt += '      <path d="' + shapes[lines[line].shape] + '" fill="' + fills[lines[line].shape] + '" class="dot option" id="' + name + '.checkers"/>';
	  if (lines[line].check === true) {
	      nxt += '      <path d="' + checks[lines[line].shape] + '" style="visibility: visible; stroke: #33f; fill: ' + check_fills[lines[line].shape] + ';" class="check" id="' + name + '.check" />';
	  }
	  else {
	      nxt += '      <path d="' + checks[lines[line].shape] + '" style="visibility: hidden; stroke: #33f; fill: ' + check_fills[lines[line].shape] + ';" class="check" id="' + name + '.check" />';
	  }
	  nxt += '      <rect x="35.5" y="0" width="10" height="20" class="change option click_box" id="' + name + '.change.box" fill="rgba(0, 0, 0, 0)" stroke="rgba(0, 0, 0, 0)" stroke-width="1"/>';
	  nxt += '      <path d="M 40 14 C 44 10, 44 8, 40 4 m -2 4 l2 -4 l4 2" id="' + name + '.change" class="change option" stroke="#333" stroke-width="0.4" fill="transparent"/>';
	  nxt += '      <rect x="46.0" y="0" width="9" height="20" class="plus option click_box" id="' + name + '.plus.box" />';
	  nxt += '      <path d="M 48.5 9 l 5 0 m -2.5 -2.5 l 0 5" class="plus option" id="' + name + '.plus" />';
	  nxt += '    </svg>';
	  nxt += '  <div class="text" id="text.' + name + '" contenteditable="true" style="position: relative; padding-left: 0; top: 0;">' + lines[line].text + '</div>';
      for (var subs in lines) {
		  if (lines[line].id === lines[subs].parent_id) {
			  nxt += add_lines(lines, id=name);
			  break;
		  }
	  }
	  id = lines[line].parent_id;
	  nxt += '</div>';
	  /// add_lines(lines, lines[i].id);
      }
  }
  return nxt;
}

function add_listeners() {
  $( ".dot" ).unbind().click(box_click); 
  $( ".check" ).unbind().click(box_click); 
  $( ".change" ).unbind().click(bullet_change); 
  $( ".plus" ).unbind().click(add_line); 
  $( ".ex" ).unbind().click(delete_line); 
  $( ".ladder" ).unbind().click(new_line);
  $( ".descriptor" ).unbind().click(star_line);
  $( ".lining" ).unbind().click(change_lines);
  $( ".zoom" ).unbind().click(zoom);
  $( ".collapse" ).unbind().click(collapse);
  $( ".text" ).on('drop',function(event){drop_event(event)});
  $('input[type="text"]').keyup(resizeInput).each(resizeInput);
  $( ".text" ).unbind().focusout(update_line);
  $( ".heavy" ).unbind().focusout(update_title);
  $( ".delete_day" ).unbind().click(delete_day);
}

// window.onload = add_book();
// $(document).ready(add_listeners);
// $(document).ready(user_info);

$(window).on('resize', check_book());

function resizeInput() {
    $(this).attr('size', $(this).val().length + 3);
}

function drop_event(event) {
  event.stopPropagation();
}

function new_day(id=1) {
	$.ajax({
		type: "POST",
		url: "/new_day",
		contentType: "application/json",
		data: JSON.stringify({id: id}),
		dataType: "json",
		async: false,
		success: function(response) {
			console.log('added day', response.id,);
		}
	});
	add_book(id=id, title=$("#book_title").text());
}

function update_line(event) {
	$.ajax({
		type: "POST",
		url: "/update_line",
		contentType: "application/json",
		data: JSON.stringify({id: event.target.id.split('-').pop(), text: event.target.innerHTML}),
		dataType: "json",
		async: true
	});
}

function update_title(event) {
	$.ajax({
		type: "POST",
		url: "/update_title",
		contentType: "application/json",
		data: JSON.stringify({id: event.target.id.split('.').pop(), title: event.target.value}),
		dataType: "json",
		async: true
	});
}

function collapse(event) {
	let id = event.target.id.split('.').pop()
	let name = "checkbox.day."+id
	let collapse = document.getElementById(name).checked;
	console.log(id, name, collapse, );
	$.ajax({
		type: "POST",
		url: "/collapse_day",
		contentType: "application/json",
		data: JSON.stringify({id: id, collapse: collapse}),
		dataType: "json",
		async: true
	});
}

function new_line(event) {
  event.stopPropagation();
	$.ajax({
		type: "POST",
		url: "/new_line",
		contentType: "application/json",
		data: JSON.stringify({day_id: event.target.id.split('.').pop(), line_id: 0}),
		dataType: "json",
		async: false,
		success: function(response) {
			let name = '';
			if (response.id == 0) {
				name = 'day' + event.target.id.split('.').pop() + '-0-' + next_line;
				next_line += 1
			}
			else {
				name = 'day' + event.target.id.split('.').pop() + '-0-' + response.id
			}
			let next = '';
			next += '<div class="line" id="' + name + '.line">';
			next += '    <svg draggable="true" id="' + name + '" class="bullet" checked="0" xmlns="http://www.w3.org/2000/svg" version="1.0"  viewBox="0 0 55 20" style="position: relative; top: 0; left: -1.5em; z-index: 100;">';
			next += '      <rect x="2.5" y="0" width="10" height="20" class="ex option click_box" id="' + name + '.ex.box" />';
			next += '      <path d="M 5 6.5 l 5 5 M 10 6.5 l -5 5" class="ex option" id="' + name + '.ex" />';
			next += '      ';
			next += '      <rect x="12.5" y="0" width="10" height="20" class="descriptor option click_box" id="' + name + '.descriptor.box" fill="rgba(0, 0, 0, 0)" stroke="rgba(0, 0, 0, 0)" stroke-width="1"/>';
			next += '      <path d="M 15 2.5 l 0.5 7 l 4 0 l 0.5 -7 l -5 0 m 2.5 12.5 c -1.8 0, -2.0 -1.0, -2.0 -2.0 c 0 -1.8, 1.0 -2.0, 2.0 -2.0 c 1.8 0, 2.0 1.0, 2.0 2.0 c 0 1.8, -1.0 2.0, -2.0 2.0" style="visibility: hidden; fill: rgba(0 ,0, 0, 0.3)" id="' + name + '.descriptor" class="descriptor option" />';
			next += '      ';
			next += '      <rect x="24" y="0" width="10" height="20" class="dot option click_box" id="' + name + '.checkers.box" fill="rgba(0, 0, 0, 0)" stroke="rgba(0, 0, 0, 0)" stroke-width="1"/>';
			next += '      <path d="' + shapes[0] + '" fill="' + fills[0] + '" class="dot option" id="' + name + '.checkers"/>';
			next += '      <path d="' + checks[0] + '" style="visibility: hidden;" fill="rgba(0, 0, 0, 0.3)"  class="check" id="' + name + '.check" />';
			next += '      <rect x="35.5" y="0" width="10" height="20" class="change option click_box" id="' + name + '.change.box" fill="rgba(0, 0, 0, 0)" stroke="rgba(0, 0, 0, 0)" stroke-width="1"/>';
			next += '      <path d="M 40 14 C 44 10, 44 8, 40 4 m -2 4 l2 -4 l4 2" id="' + name + '.change" class="change option" stroke="#333" stroke-width="0.4" fill="transparent"/>';
			next += '      <rect x="46.0" y="0" width="9" height="20" class="plus option click_box" id="' + name + '.plus.box" />';
			next += '      <path d="M 48.5 9 l 5 0 m -2.5 -2.5 l 0 5" class="plus option" id="' + name + '.plus" />';
			next += '    </svg>';
			next += '  <div class="text" id="text.' + name + '" contenteditable="true" style="position: relative; padding-left: 0; top: 0;"><br></div>';
			next += '</div>';
			
			event.target.insertAdjacentHTML('beforebegin', next);
		}
	});
  $(document).ready(add_listeners);
}
function add_line(event) {
	event.stopPropagation();
	var bss = event.target.id.split(".")[0];
	line = document.getElementById(bss+".line");
	lines = document.getElementById(bss+".line").querySelectorAll(':scope > .line');
	var number = 1;
	if (lines.length > 0) {
		number = lines[lines.length-1].id.split(".")[0].split("-");
		number = parseInt(number[number.length-1]) + 1;
	}
	let today = event.target.id.split('-')[0].split('day').pop()
	let lid = event.target.id.split('-').pop().split('.')[0]
	$.ajax({
		type: "POST",
		url: "/new_line",
		contentType: "application/json",
		data: JSON.stringify({day_id: today, line_id: lid}),
		dataType: "json",
		async: false,
		success: function(response) {
			let name = ''
			if (response.id == 0) {
				name = bss + "-" + next_line;
				next_line += 1
			}
			else {
				name = bss + "-" + response.id;
			}
			let next = '';
			next += '<div class="line" id="' + name + '.line">';
			next += '    <svg draggable="true" id="' + name + '" class="bullet" checked="0" xmlns="http://www.w3.org/2000/svg" version="1.0"  viewBox="0 0 55 20" style="position: relative; top: 0; left: -1.5em; z-index: 100;">';
			next += '      <rect x="2.5" y="0" width="10" height="20" class="ex option click_box" id="' + name + '.ex.box" />';
			next += '      <path d="M 5 6.5 l 5 5 M 10 6.5 l -5 5" class="ex option" id="' + name + '.ex" />';
			next += '      ';
			next += '      <rect x="12.5" y="0" width="10" height="20" class="descriptor option click_box" id="' + name + '.descriptor.box" fill="rgba(0, 0, 0, 0)" stroke="rgba(0, 0, 0, 0)" stroke-width="1"/>';
			next += '      <path d="M 15 2.5 l 0.5 7 l 4 0 l 0.5 -7 l -5 0 m 2.5 12.5 c -1.8 0, -2.0 -1.0, -2.0 -2.0 c 0 -1.8, 1.0 -2.0, 2.0 -2.0 c 1.8 0, 2.0 1.0, 2.0 2.0 c 0 1.8, -1.0 2.0, -2.0 2.0" style="visibility: hidden; fill: rgba(0, 0, 0, 0.3)" id="' + name + '.descriptor" class="descriptor option"/>';
			next += '      ';
			next += '      <rect x="24" y="0" width="10" height="20" class="dot option click_box" id="' + name + '.checkers.box" fill="rgba(0, 0, 0, 0)" stroke="rgba(0, 0, 0, 0)" stroke-width="1"/>';
			next += '      <path d="' + shapes[0] + '" fill="' + fills[0] + '" class="dot option" id="' + name + '.checkers"/>';
			next += '      <path d="' + checks[0] + '" style="visibility: hidden;" fill="rgba(0, 0, 0, 0.3)" class="check" id="' + name + '.check" />';
			next += '      <rect x="35.5" y="0" width="10" height="20" class="change option click_box" id="' + name + '.change.box" fill="rgba(0, 0, 0, 0)" stroke="rgba(0, 0, 0, 0)" stroke-width="1"/>';
			next += '      <path d="M 40 14 C 44 10, 44 8, 40 4 m -2 4 l2 -4 l4 2" id="' + name + '.change" class="change option" stroke="#333" stroke-width="0.4" fill="transparent"/>';
			next += '      <rect x="46.0" y="0" width="9" height="20" class="plus option click_box" id="' + name + '.plus.box" />';
			next += '      <path d="M 48.5 9 l 5 0 m -2.5 -2.5 l 0 5" class="plus option" id="' + name + '.plus" />';
			next += '    </svg>';
			next += '  <div class="text" id="text.' + name + '" contenteditable="true" style="position: relative; padding-left: 0; top: 0;"><br></div>';
			next += '</div>';
			line.innerHTML = line.innerHTML + next;
			$('#'+name+'.line').children().last().attr("tabindex",-1).focus();
		}
	});
	$(document).ready(add_listeners);
}

function delete_line(event) {
  event.stopPropagation();
  event.target.parentNode.parentNode.remove()
  let lid = event.target.id.split('-').pop().split('.')[0]
  modify_line(lid, 'delete');
}
function change_lines(event) {
  event.stopPropagation();
  days = document.getElementById("days");
  $('#days').attr('class', 'days');
  $('#days').toggleClass(event.target.innerHTML);
}

function box_click(event) {
  event.stopPropagation();
  var boss = event.target.id.replace(".checkers","").replace(".box","").replace(".check","")
  check = document.getElementById(boss);
  if (check.getAttribute('checked') === '1') {
    check.setAttribute('checked', '0');
    document.getElementById(check.id+".check").style.visibility = 'hidden';
  }
  else {
    check.setAttribute('checked', '1');
    document.getElementById(check.id+".check").style.visibility = 'visible';
  }
  let lid = event.target.id.split('-').pop().split('.')[0]
  modify_line(lid, 'checked', value=check.getAttribute('checked'));
}

function star_line(event) {
  event.stopPropagation();
  var boss = event.target.id.split(".")[0]
  check = document.getElementById(boss);
  if (check.starred === 1) {
    check.starred = 0;
    document.getElementById(check.id+".descriptor").style.visibility = 'hidden';
    document.getElementById(check.id+".descriptor").style.fill = 'rgba(0, 0, 0, 0.3)';
  }
  else {
    check.starred = 1;
    document.getElementById(check.id+".descriptor").style.visibility = 'visible';
    document.getElementById(check.id+".descriptor").style.fill = '#33f';
  }
  let lid = event.target.id.split('-').pop().split('.')[0]
  modify_line(lid, 'important', value=check.starred);
}

function bullet_change(event) {
  event.stopPropagation();
  var boss = event.target.id.split(".")[0]
  box = document.getElementById(document.getElementById(boss).id+".checkers");
  check = document.getElementById(document.getElementById(boss).id+".check");
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
  let lid = event.target.id.split('-').pop().split('.')[0]
  modify_line(lid, 'change', value=i);
}

function zoom(event) {
  event.stopPropagation();
  var target = event.target.id
  if (target === 'in') {
	   var size = parseInt($('html').css('font-size').split('%')[0].split('em')[0].split('px')[0])*1.1;
  }
  else {
	   var size = parseInt($('html').css('font-size').split('%')[0].split('em')[0].split('px')[0])/1.1;
  }
  if ($('html').css('font-size').includes('px')) {
	  $('html').css('font-size', size+'px')
  }
  else if ($('html').css('font-size').includes('em')) {
	  $('html').css('font-size', size+'em')
  }
  else if ($('html').css('font-size').includes('%')) {
	  $('html').css('font-size', size+'%')
  }
  // $('html').css('font-size', newFontSize)
}

function modify_line(id, type, value=0) {
	$.ajax({
		type: "POST",
		url: "/modify_line",
		contentType: "application/json",
		data: JSON.stringify({id:id, type:type, value:value}),
		dataType: "json",
		async: true,
	});
}

function delete_day(event) {
	$.ajax({
		type: "POST",
		url: "/delete_day",
		contentType: "application/json",
		data: JSON.stringify({id: event.target.id.split('.').pop()}),
		dataType: "json",
		async: true,
	});
	event.target.parentNode.parentNode.remove();
}