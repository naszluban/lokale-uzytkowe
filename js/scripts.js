$(window).load(function(){

	function scrollTo(el, f){
		try {
			var offset = $(el).offset().top;
			var tag = self.navigator.userAgent.toLowerCase().match("safari") ? "html, body" : "html";
			$(tag).scrollTop() === offset ? $(f) : $(tag).animate({ scrollTop: offset }, 1000, f);
		} catch(e) {}
		return false;
	}

  
  $("#menu a, #top-container a").hover(function(){
			$("span", this).fadeIn("fast");
		}, function(){
      $("span", this).fadeOut("fast");
	});


	$("#menu a:not(.noscroll)").click(function(){
		var a = $(this);
		if (a.attr("href") && a.attr("rel")) {
			if ($("#" + a.attr("rel")).hasClass("box") && $("#" + a.attr("rel")).length) {
					scrollTo("#" + a.attr("rel"));
			} else {
				$.ajax({
					url: a.attr("href"),
					beforeSend: function(){
						$("#main").prepend("<p id='preload'><img src='gfx/layout/preload2.gif' alt='' /></p>");
						$("#preload").fadeIn("fast");
					},
					success: function(re){
						$("div.container:first", "#main").attr("id", a.attr("rel")).html($("<div>", {
							css: {
								display: "none"
							},
							html: re,
							id: "container-ajax"
							})
						);
						$("#container-ajax").fadeIn(function(){
              $(this).children().unwrap();
						});
						$("#preload").fadeOut(function(){
							$(this).remove();
							scrollTo("#" + a.attr("rel"));
						});
					},
					error: function(){
						$("#preload").remove();
						alert("Wystąpił problem w połączeniu z serwerem.\nSpróbuj później.");
					}
				});
			}
		} else if (a.is("[href^=#]") && !a.attr("rel")) {
			scrollTo(a.attr("href"));
		}
		return false;
	});


	$("div.box div.image ul a").live("click", function(){
		var a = $(this);
		if (!a.hasClass("active")) {
			$("img", a.parentsUntil("div.box").find("div.image p")).remove();

			var img = new Image();
			$(img).load(function () {
			  $("p", a.parentsUntil("div.box").find("div.image")).html(this).children().wrap("<span />");
				$(this).fadeIn(function(){
					$(this).unwrap();
				});
				$("a.active", a.parentsUntil("div.image")).removeClass("active").addClass("visited");
				a.addClass("active");
			})
			.error(function () {
				alert("Błąd podczas wczytywania obrazka.");
			})
			.attr('src', a.attr("href"));
		}
		return false;
	});


	if ($.fn.validate && $("#kontakt form").length) {
		$("#kontakt form").validate({
			rules: {
			  name: "required",
			  email: {
					required: true,
					email: true
				},
				message: "required",
				comment: "required"
			},
		errorPlacement:	function(error, element) {
     	$("#ajax").remove();
        return false;
  		},
  		unhighlight: function(element, errorClass) {
        $(element).removeClass("error");
  		},
  		submitHandler: function(form){
				var f = $(form);
				$.ajax({
					url: f.attr("action"),
					data: f.serialize(),
					beforeSend: function(){
						$("#ajax", f).remove();
					},
					success: function(re){
						$(":text, textarea", f).val("");
						$("#submit", f).prepend($("<div>", {
							id: "ajax",
							html: re
							})
						);
						$("#ajax", f).fadeIn();
					},
					error: function(){
						alert("Wystąpił problem w połączeniu z serwerem.\nSpróbuj później.");
					}
				});
				return false;
			}
		});
	};
		
		
	if ($.fn.validate && $("#comments form").length) {
		$("#comments form").validate({
			rules: {
			  author: "required",
			  email: {
					required: true,
					email: true
				},
				message: "required",
				comment: "required"
			},
		errorPlacement:	function(error, element) {
     	$("#ajax").remove();
        return false;
  		},
  		unhighlight: function(element, errorClass) {
        $(element).removeClass("error");
		}
		});
	};

});