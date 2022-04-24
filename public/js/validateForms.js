// Example starter JavaScript for disabling form submissions if there are invalid fields
(function() {
	'use strict';
	// Fetch all the forms we want to apply custom Bootstrap validation styles to
	const forms = document.querySelectorAll('.validated-form');
	//document.getElementById('discount').val
	// Loop over them and prevent submission
	Array.prototype.slice.call(forms).forEach(function(form) {
		form.addEventListener(
			'submit',
			function(event) {
				if (!form.checkValidity()) {
					event.preventDefault();
					event.stopPropagation();
				}

				form.classList.add('was-validated');
			},
			false
		);
	});
})();
	
	// Ravinder:- Seach event on Enter button press
	$("#cust-search-bar").keydown(function(event) {
		if (event.keyCode === 13) {
			$("#search_button").click();
		}
	});

	$("#cust-search-bar").keyup(function(event) {
		if (event.keyCode === 13) {
			$("#search_button").click();
		}
	});


	// Ravinder:- on search button click event.
	$('#search_button').click(function(){
		// Get the text from seach field 
		let searchText = $("#cust-search-bar").val();
		if(searchText.length == 0) {
			alert("Please enter the Product Name.");
			return;

		}
		// Creating url to  get the product data as per the search 
		//let url = 'http://localhost:3000/products?searchText=';
		window.location.href ='/products?searchText=' +searchText;
	});

	// $('#sortMe').change(function(){
	// 	let sortMe = $("#sortMe").val();
	// 	console.log(sortMe);
	// 	window.location.href = 'http://localhost:3000/products?searchText=' + sortMe;
	// });
