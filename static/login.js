
function find_book(id=0, title='') {
	$.ajax({
					type: "POST",
					url: "/lines_id",
					contentType: "application/json",
					data: JSON.stringify({id: id}),
					dataType: "json",
					success: function(response) {
						add_book(id, title);
						$(".landing").fadeOut();
					},
					error: function(err) {
						console.log('nope');
						console.log(err);
					}
				});
}
function new_book(event) {
	if ($('#new_book').val() == '') {
		$('#new_book').attr('placeholder', 'please enter title');
	}
	else {
		$.ajax({
						type: "POST",
						url: "/new_book",
						contentType: "application/json",
						data: JSON.stringify({title: $('#new_book').val(), public:$('#public').is(":checked")}),
						async: false,
						dataType: "json",
						success: function(response) {
							location.reload(); 
						},
						error: function(err) {
							location.reload(); 
						}
					});
	}
}
				
function delete_book(event, id=0) {
	event.stopPropagation()
	console.log('deleting book', id);
	$.ajax({
					type: "POST",
					url: "/delete_book",
					contentType: "application/json",
					data: JSON.stringify({id: id}),
					async: false,
					dataType: "json",
					success: function(response) {
						console.log('removing book', '#book.'+id);
						document.getElementById('book.'+id).remove();
						//location.reload(); 
					},
					error: function(err) {
						//location.reload(); 
					}
				});
}

function get_books(event, id=0) {
	console.log('getting books');
	$.getJSON(
		"get_books",
		function(json) {
			console.log(json);
			var next = ''
			console.log(json.data.length);
			for (var i = 0; i < json.data.length; ++i) {	
				next += '<div class="card" id="book.' + json.data[i].id + '" onclick="find_book(' + json.data[i].id + ', \'' + json.data[i].title + '\')"><div class="notebook" title="' + json.data[i].title + '"><div class="keeper"></div></div><b>' + json.data[i].title + '</b><br>(tflaspoehler)</div>'
			}
		    document.getElementById("library").innerHTML = next + document.getElementById("library").innerHTML;
			$(document).ready(add_book_listeners);
		}
	);
}

function public_click(event){
	let checked = event.target.checked
	let id = event.target.id.split('.')[0]
	$.ajax({
					type: "POST",
					url: "/make_public",
					contentType: "application/json",
					data: JSON.stringify({id: id, checked: checked}),
					async: true,
					dataType: "json",
				});
}

function login() {
	console.log('logging in');
	var queryString = $('#login_form').serialize();
	console.log(queryString);
}

function land() {
	$(".landing").fadeIn();
}

function logout() {
	console.log('logging out');
	window.location = "/logout";
}

function add_book_listeners() {
  $("#login").unbind().click(login);
  $( ".logout" ).unbind().click(logout); 
  $( ".header" ).unbind().click(land); 
  $( ".public" ).unbind().click(public_click); 
}

$(document).ready(add_book_listeners);

