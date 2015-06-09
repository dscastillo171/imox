domready(function(){
	/** Helpers **/
	// Validate an email addres/
	function validateEmail(email){
	    var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
	    return re.test(email);
	};

	// Load a template.
	var loadTemplate = function(path){
		return fetch(path).then(function(response){
			return response.text();
		});
	};

	// Set a template.
	var setTemplate = (function(){
		var container = $('#content');
		return function(template){
			container.html(template);
		};
	})();

	/** Core **/
	// Define the routes.
	var setRoutes = function(templates){
		// Routing function.
		var route = function(template, link, scroll, callback){
			link++;
			return function(req, event){
				setTemplate(template);
				$('#header .menu .selected').removeClass('selected');
				if(link){
					$('#header .menu > a:nth-child(' + link + ')').addClass('selected');
				}
				if(scroll){
					var offset = $(scroll)[0].offsetTop;
					window.scrollTo(0, offset - 80);
				} else{
					window.scrollTo(0, 0);
				}
				if(typeof(callback) === 'function'){
					callback();
				}
				event.stopPropagation();
			}
		};

		// Define the router.
		var router = new Grapnel();
		router.get('company', route(templates[1], 0));
		router.get('services', route(templates[2], 1));
		router.get('services/engines', route(templates[2], 1));
		router.get('services/field', route(templates[2], 1, '#services .field'));
		router.get('services/parts', route(templates[2], 1, '#services .parts'));
		router.get('contact', route(templates[3], 2, null, function(){
			// Send button.
			$('#contact .form .button').on('click', function(){
				if(!$('#contact .form .button').hasClass('loading')){
					// Start loading.
					$('#contact .form .button').addClass('loading');

					// Remove the error clases.
					var removeErrorClass = function(id){
						var el = $(id);
						if(el.hasClass('error')){
							el.removeClass('error');
						}
					};
					removeErrorClass('#contact .name');
					removeErrorClass('#contact .mail');
					removeErrorClass('#contact .message');

					// Retrieve the fields.
					var name = $('#contact .name input').val();
					var company = $('#contact .company input').val();
					var mail = $('#contact .mail input').val();
					var message = $('#contact .message textarea').val();
					
					// Error message.
					var errorMessage = function(){
						$('#contact .form .button').removeClass('loading');
						$('#alert').addClass('visible');
						$('#alert').addClass('error');
					};

					// Verify the fields.
					if(!name || name.length < 1){
						$('#contact .name').addClass('error');
						$('#contact .form .button').removeClass('loading');
					} else if(!mail || !validateEmail(mail)){
						$('#contact .mail').addClass('error');
						$('#contact .form .button').removeClass('loading');
					} else if(!message || message.length < 1){
						$('#contact .message').addClass('error');
						$('#contact .form .button').removeClass('loading');
					} else{
						fetch('/mail', {
							method: 'post',
							headers: {
								'Accept': 'application/json',
								'Content-Type': 'application/json'
							},
							body: JSON.stringify({
								name: name,
								company: company,
								mail: mail,
								message: message
							})
						}).then(function(response){
							if(response.status === 200){
								$('#contact .form .button').removeClass('loading');
								$('#alert').addClass('visible');
								$('#contact .name input').val('');
								$('#contact .company input').val('');
								$('#contact .mail input').val('');
								$('#contact .message textarea').val('');
							} else{
								errorMessage();
							}
						}, errorMessage);
					}
				}
			});
		}));
		router.get('*', route(templates[0], -1, null, function(){
			// Clients carousel.
			$('#home .clients .next').on('click', function(){
				var el = $('#home .clients');
				if(!el.hasClass('right')){
					el.addClass('right');
				}
			});
			$('#home .clients .preview').on('click', function(){
				var el = $('#home .clients');
				if(el.hasClass('right')){
					el.removeClass('right');
				}
			});
		}));
	}

	// Start by loading the templates.
	var promises = [];
	promises.push(loadTemplate('templates/home.html'));
	promises.push(loadTemplate('templates/company.html'));
	promises.push(loadTemplate('templates/services.html'));
	promises.push(loadTemplate('templates/contact.html'));
	Promise.all(promises).then(setRoutes);

	// Make the header thiner on scroll.
	var header = $('#header');
	window.onscroll = function(obj1, obj2){
		var pageOffset = (window.pageYOffset || document.scrollTop) - (document.clientTop || 0) || 0;
		if(pageOffset > 40 && !header.hasClass('thin')){
			header.addClass('thin');
		} else if(pageOffset <= 40 && header.hasClass('thin')){
			header.removeClass('thin');
		}
	};

	// Dismiss the modal dialog.
	$('#alert').on('click', function(){
		var el = $('#alert');
		if(el.hasClass('visible')){
			el.removeClass('visible');
		}
	});
});