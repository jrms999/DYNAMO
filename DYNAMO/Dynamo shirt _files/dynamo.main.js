$(document).foundation();

$(document).ready(function() {

    var bodyTag = document.getElementsByTagName("body")[0];
    bodyTag.className = bodyTag.className.replace("noJS", "hasJS");
	
	$('a.open_close').each(function() {
		$(this).bind('click', function(e) {
			e.preventDefault();
			$(this).parent().next('.hide').stop(true).slideToggle(250);
		});
	});

	// слайдер
	$(".slider").slidesjs({
	  	width: 1200,
	  	height: 360,
	  	navigation: false,
	  	effect: {
	    	slide: {
	      	speed: 1000
	    	}
	    },
        play: {
            auto: true,
            interval: 4000    
        }
	});

	makeTshirtSlider = function(){
		function slideTo(num){

			current_slide = num;

			slides.removeClass('active');
			slides.eq(num).addClass('active');
			activateProperties(slides.eq(num).data('mid'));
			set_shirt_submit_button();
			DisplayShirtPrice();



		}
		function activateProperties(mid){
			var tsz = $('.__shirt_size');
			tsz.find(".select-size-item[data-pid=" + mid + ']').show();
			tsz.find(".select-size-item").not('[data-pid=' + mid + ']').hide();
		}

		var t = $('.__shirt_slider');
		
		if(typeof(t.children()[0]) == "undefined") return false;
		var slides = t.find(t.children()[0].tagName.toLowerCase());
		var cont = null;
		var arrows = null;
		var current_slide_o = slides.filter('.active');
		var current_slide = current_slide_o.index();

		activateProperties(current_slide_o.data('mid'));
		DisplayShirtPrice();

		if (!t.length || !slides.length) return false;

		t.wrapAll('<div class="shirt-slider__container"></div>');

		var btn_next = $('<a/>', { 'class': 'slider--next', 'href': '#'}),
			btn_prev = $('<a/>', { 'class': 'slider--prev', 'href': '#' })
		;

		cont = t.parent();
		cont.append('<div class="slider--buttons"></div>');

		$(btn_next).appendTo(cont.find('.slider--buttons')).on('click', function(e){
			e.preventDefault();			
			slideTo(++current_slide > (slides.length - 1) ? 0 : current_slide++);		
		});
		$(btn_prev).appendTo(cont.find('.slider--buttons')).on('click', function(e){
			e.preventDefault();			
			slideTo(--current_slide < 0 ? (slides.length - 1) : current_slide--)
		});
	};

	$(".select-box").each(function() {	
		if($(this).hasClass("good-select-list")){
			var parent = $(this).parents('.good-select-name');
			var sb = new SelectBox({
				selectbox: $(this),
				height: 130,
				changeCallback: function(val){
					if(val != 0){
						parent.addClass('active');
					}else{
						parent.removeClass('active');
					}
				}
			});
		}else{
			var sb = new SelectBox({
				selectbox: $(this),
				height: 130,
				changeCallback: function(val){
					this.selectbox.trigger('change');
				}
			});
		}
	});
  
  
	// табы
	$('.tab-list li').click(function() {
		var obj = $(this);
		var container = obj.parents('.tab-container');
		var index = obj.index();
		$('.tab-list li', container).removeClass('active').eq(index).addClass('active');
		$('.tab-pane .pane', container).removeClass('active').eq(index).addClass('active');
	});
	$('.maincontent .tab-list li:first').trigger('click');
    

    function is_inputs_not_empty(){
    	var name = $('.text-name-input');
    	var num = $('.text-number-input');
    	var btns = $('.__shirt_size .select-size-item.active:visible').length > 0 ? true : false;
    	// var res = $.trim(name.val()) === '' || $.trim(num.val()) === '' || !btns ? false : true;

    	if ($.trim(name.val()) === '' || $.trim(num.val()) === '' || !btns) {
    		return false;
    	} else {
    		return true;
    	}    	
    };

    function set_shirt_submit_button() {
		var b = $('.__shirt_submit');
	    if (is_inputs_not_empty()) {
	    	b.removeClass('off');
	    } else {
	    	b.hasClass('off') ? '' : b.addClass('off');
	    }
    }

	// текст на футболке
	$('.text-name-input').keyup(function (){
		var val = $(this).val();
		$('.tshirt-name span').text(val);
        if($(this).val() != ""){
            $(this).parents('.text-name-block').addClass('active');            
        }else{
            $(this).parents('.text-name-block').removeClass('active');            
        }

    	set_shirt_submit_button();    	
	});

	$('.text-number-input').keyup(function (){
		var val = $(this).val();
		$('.tshirt-value span').text(val);
        if($(this).val() != ""){
            $(this).parents('.text-name-block').addClass('active');
            $('.__shirt_submit').removeClass('off');
        }else{
            $(this).parents('.text-name-block').removeClass('active');
            $('.__shirt_submit').addClass('off');
        }

        set_shirt_submit_button();    	
	});

	$('.__fio_selector').on('change', function(){
	  var t = $(this);
	  var val = t.find('option:selected').val();

	  if (val === '') {
	  	$('.text-name-input, .text-number-input').val('');
	  	$('.tshirt-name span, .tshirt-value span').text('')
	  	$('.__shirt_submit').removeClass('off');
	  } else {
	    var r = val.split(';');
	    	    
	    $('.tshirt-name span').text(r[0]);
	    $('.tshirt-value span').text(r[1]);
	    $('.text-name-input').val(r[0]);
	    $('.text-number-input').val(r[1]);
	    $('.__shirt_submit').addClass('off');
	  }

		set_shirt_submit_button();    	
	});	

	$('.__shirt_size .select-size-item').on('click', function(e){
		var t = $(this);

		if (t.hasClass('active')) {
			t.removeClass('active');
		} else {
			t.siblings().removeClass('active');
			t.addClass('active');
		}

		set_shirt_submit_button();
	});

	$('.__shirt_logo .select-sponsor-item').on('click', function(e){
		var t = $(this);

		if (t.hasClass('active')) {
			t.removeClass('active');
		} else {
			t.addClass('active');
		};
		DisplayShirtPrice();

	});

	function DisplayShirtPrice(){
		var a = $('.fitting-block.tab-container');
		var t = $('.__shirt_slider');
		var price_block = a.find('.current-cena');
		var active_slide = t.find(t.children()[0].tagName.toLowerCase() + '.active');
		var sponsors = $('.fitting-sponsors__list');
		
		var price = parseInt(active_slide.data("price"));

		sponsors.find('.select-sponsor-item.active').each(function(){
			price += $(this).data('price');
		});
		price_block.html(price.toLocaleString() + ' р');
	}

	function ConstructShirtSizesBlock(){
		var a = $('.fitting-block.tab-container');
		var t = $('.__shirt_slider');
		var price_block = a.find('.current-cena');
		var active_slide = t.find(t.children()[0].tagName.toLowerCase() + '.active');
		var sponsors = $('.fitting-sponsors__list');
		
		var price = parseInt(active_slide.data("price"));

		sponsors.find('.select-sponsor-item.active').each(function(){
			price += $(this).data('price');
		});
		price_block.html(price.toLocaleString() + ' р');
	}

	$('.__shirt_submit').on('click', function(e){
		if ($(this).hasClass('off')) {
			e.preventDefault();
		}else{
			console.log("addToBasket");

		}
	});

	$('.filter-box-title').click(function () {
		var obj = $(this).parent();
		obj.toggleClass('open');
		$('.filter-box-container', obj).slideToggle(200);
	});


	$('.find-close').click(function () {
		$('.find-block').fadeOut(200);
	});


	$('body').click(function(e) {
		if($(e.target).closest('.overlay-border').length==0) $('.overlay-block').fadeOut(200);
	});

	$('.close-form').click(function () {
		$('.overlay-block').fadeOut(200);
	});


	// Всплывающие окна
	/*$('.popup').click(function(){
		var attr = $(this).attr('data-link');
		$('.'+attr).fadeIn();
		return false;
	});*/

    $('.main_parent>a').click(function(e){
      
        if($(this).parent('.main_parent').hasClass('active')){
          $('.main_parent').removeClass('active');
        }else{
          $('.main_parent').removeClass('active');
          $(this).parent('.main_parent').addClass('active');    
        }
        return false;      
      
    })
  

	$('.jdelivery').jcarousel({
	  wrap: 'circular'
	});
	$('.onair .jprev').jcarouselControl({target: '-=1'});
	$('.onair .jnext').jcarouselControl({target: '+=1'});


	$('.maincontent .kslik').slick({
	  	dots: false,
	  	infinite: true,
	  	speed: 500,
	  	slidesToShow: 5,
	  	draggable: false,
	  	slidesToScroll: 1,
	  	responsive: [
	    	{
	      	breakpoint: 1201,
	      	settings: {
					infinite: true,
	        		slidesToShow: 4
	      	}
	  		},
		   {
		      breakpoint: 961,
		      settings: {
				infinite: true,
		        slidesToShow: 3,
		        slidesToScroll: 1
		      }
	    	},
		   {
		      breakpoint: 741,
		      settings: {
				infinite: false,
		        slidesToShow: 1,
		        slidesToScroll: 1
		      }
	    	}
	  	]
	});

	$('body').on('click', '.element-prev', function () {
		var element = $(this).parents('.element-image-cont');
		var currentSlide = $('.element-image li.current', element);
		var nextCurrentSlide = currentSlide.prev();
		if (nextCurrentSlide.length == 0) {
			nextCurrentSlide = $('.element-image li', element).last();
		};
		currentSlide.removeClass('current');
		nextCurrentSlide.addClass('current');
	});

	$('body').on('click', '.element-next', function () {
		var element = $(this).parents('.element-image-cont');
		var currentSlide = $('.element-image li.current', element);
		var nextCurrentSlide = currentSlide.next();
		if (nextCurrentSlide.length == 0) {
			nextCurrentSlide = $('.element-image li', element).first();
		};
		currentSlide.removeClass('current');
		nextCurrentSlide.addClass('current');
	});

	$('body').on('mouseenter', '.element-preview li', function(e){
        e.preventDefault();
		var element = $(this).parents('.element-image-box');
		var obj = $(this);
        var index = element.find('.element-preview li').index(obj);
		//$('.element-image li', element).removeClass('current').eq(index).addClass('current');
		$('.element-image-cont', element).hide().eq(index).fadeIn(250);
		$('.element-preview li', element).removeClass('current').eq(index).addClass('current');
	});
  
	$('body').on('mouseenter', '.good-preview li', function(e){
        e.preventDefault();
		var element = $(this).parents('.good-image-box');
		var obj = $(this);
		var index = element.find('.good-preview li').index(obj);
		$('.good-image li', element).removeClass('current').eq(index).addClass('current');
		$('.good-preview li', element).removeClass('current').eq(index).addClass('current');
	});


	$('.order-table .checkbox input').each(function(){
		$(':checked').parents('.trow_even').addClass('checked');
	});

	$('.order-table .checkbox input').click(function(){
		$(this).parents('.trow_even').toggleClass('checked');
	});

    $('.slick_show_more').on('click', function(){
        var slider = $(this).parent().find('.kslik_slider_main');
        var count = slider.find('.slick-slide').length;
        var new_height = slider.height() + 1200;
      
        if(new_height < (count * 240)){
            slider.css("max-height", new_height);
        }else{
            var ost = count % 5;
            new_height = slider.height() + ost * 240;
            slider.animate({ "maxHeight": new_height}, 500);
        }
    });
  
    $('.gotodiscount').on('click', function(){
        if($(this).hasClass('next')){
            $('#select-list-discount').toggle( "slide" );
            $('#select-list-popular').toggle( "slide" );
        }else{
            $('#select-list-discount').toggle( "slide" );
            $('#select-list-popular').toggle( "slide" );
            
        }
        $('.gotodiscount').show()
        $(this).hide(); 
    });
  
    $('.package_checkbox').on('click', function(){
        if($(this).is(':checked')){
            $(this).parents('.good_package ').addClass('active');
        }else{
            $(this).parents('.good_package ').removeClass('active');
        }
    });

	initLittleCart();
	updateFavorite(null);
	
	if ($('.catalog').length) {
		$('.catalog').each(initCatalog);
		$('.catalog').each(initCatalogAjax);
	}
	if ($('.goodblock').length) {
		$('.goodblock').each(initGoodBlock);
	}

	$('.search-block').each(initFastSearch);
	$('.delivery-block').each(initDeliveryMap);

	$('.cart-page').cartDynamo();

	$('.lightbox').lightBox();

	makeTshirtSlider();
});


/* Catalog */

function initCatalog() {
	$('.select-size-item').click(function() {
		$(this).toggleClass('active');
		
		if ($(this).hasClass('active')) {
			$(this).find('input[type=checkbox]').prop('checked', true).trigger('change');
		} else {
			$(this).find('input[type=checkbox]').prop('checked', false).trigger('change');
		}
	});
  
	$('.color-list li').click(function() {
		$(this).toggleClass('active');
		if ($(this).hasClass('active')) {
			$(this).find('input[type=checkbox]').prop('checked', true).trigger('change');
		} else {
			$(this).find('input[type=checkbox]').prop('checked', false).trigger('change');
		}
	});
  
	$('.showfilter').click(function() {
      if($(this).parents('.container').hasClass('active')){
        $(this).parents('.container').removeClass('active');
      }else{
        $(this).parents('.container').addClass('active');
      }
	});

	$('.slider-range').slider({
		animate: false,
		range: true,
		values: [ Number($('input[name=price_from]').val()), Number($('input[name=price_to]').val()) ],
		min: Number($('.slider-range').attr('data-minprice')),
		max: Number($('.slider-range').attr('data-maxprice')),
		step: 1,
		slide: function( event, ui ) {
			if(ui.values[1]-ui.values[0]<1) return false;
			$('input[name=price_from]').val(ui.values[0]);
			$('input[name=price_to]').val(ui.values[1]);
		},
		change: function( event, ui ) {
			$('input[name=price_from]').trigger('change');
		}
	});
}

function initCatalogAjax() {
	var $cont = $(this);
	var $contAjax = $cont.find('#ajax-cont');
	var $form = $cont.find('form');
	//
	$form.unbind('submit').bind('submit', function(e) {
		var options = {
			type: 'get',
			dataType: 'html',
			data: {'ajax': 1},
			success: function(response) {
				$contAjax.html(response);
				$cont.each(initCatalogAjax);
				$contAjax.stop().fadeTo(250, 1);
				$.scrollTo($contAjax.offset().top - 110, 250);
			},
			error: function(XMLHttpRequest, textStatus, errorThrown) {
				$contAjax.stop().fadeTo(250, 1);
			}
		}
		$form.ajaxSubmit(options);
		$contAjax.stop().fadeTo(250, 0.3);
		//
		return false;
	});
	$form.find('input').unbind('change').bind('change', function() {
		$form.trigger('submit');
	});
	//
	$cont.find('.navigation-list a').unbind('click').bind('click', function(e) {
		e.preventDefault();
		$.ajax({  
			type: 'get',
			url: $(this).attr('href'),
			dataType: 'html',
			data: {'ajax': 1},
			success: function(response) {
				$contAjax.html(response);
				$cont.each(initCatalogAjax);
				$contAjax.stop().fadeTo(250, 1);
				$.scrollTo($contAjax.offset().top - 110, 250);
			},
			error: function(XMLHttpRequest, textStatus, errorThrown) {
				$contAjax.stop().fadeTo(250, 1);
			}
		});
		$contAjax.stop().fadeTo(250, 0.3);
	});
}

function initGoodBlock() {
	var $cont = $(this);
	var $contAjax = $cont.find('.cont-ajax');

	// Sizes
	$('.select-size-item').click(function() {
		$('.select-size-item').removeClass('active').find('input[type=radio]').prop('checked', false);
		//
		var id = $(this).find('input').val();
		$('.select-size-item:has(input[value=' + id + '])').addClass('active').find('input[type=radio]').prop('checked', true).trigger('change');
		//
		$('.button.good_buy').removeClass('off');
	});

	// Associated
	$cont.find('.select-tshirt-list-big li').each(function() {
		var $li = $(this);
		var $a = $li.find('a');
		$a.bind('click', function(e) {
			e.preventDefault();
			if ($a.parents('li').hasClass('active')) {
				return false;
			}
			//
			var $list = '';
			$.ajax({  
				type: 'get',
				url: $(this).attr('href'),
				dataType: 'html',
				data: {'ajax': 1},
				success: function(response) {
					$contAjax.html(response);
					$cont.find('.associated-ajax').html($list);
					$cont.each(initGoodBlock);
					$contAjax.stop().fadeTo(250, 1);
				},
				error: function(XMLHttpRequest, textStatus, errorThrown) {
					$contAjax.stop().fadeTo(250, 1);
				}
			});
			$contAjax.stop().fadeTo(250, 0.3);
			//
			$li.parent().find('li').removeClass('active');
			$li.addClass('active');
			$list = $li.parents('.associated-ajax').html();
		});
	});
}

function addToCart(path, id, count) {
	var id = id;
	if ($('input[name=size_item]').length) {
		if ($('input[name=size_item]:checked').length) {
			id = $('input[name=size_item]:checked').val();
		} else {
			id = false;
		}
	}
	var i_props = $('input[name=spec_props]').val();
	if (id) {
		if(i_props && i_props.length > 0) return $.addIntoCartProps(path, id, count, i_props);
		return $.addIntoCart(path, id, count);
	}
	return false;
}


/* Little cart */

function initLittleCart() {
	var $cont = $('#little_cart');
	//
	$cont.find('.jbasket').each(function(){
		var len = $(this).find('> ul > li').length;
		if (len > 3) {
			$cont.find('.jbasket-box').addClass('onair');
		}
	});
	$cont.find('.onair .jbasket').jcarousel({});
	$cont.find('.onair .jprev').jcarouselControl({target: '-=1'});
	$cont.find('.onair .jnext').jcarouselControl({target: '+=1'});
	//
	$cont.find('.jbasket li').each(function() {
		var $li = $(this);
		$(this).find('.del').unbind('click').bind('click', function(e) {
			e.preventDefault();
			//
			$.ajax({  
				type: 'get',
				url: $(this).attr('href'),
				dataType: 'json',
				data: {'ajax': 1},
				success: function(response) {
				},
				error: function(XMLHttpRequest, textStatus, errorThrown) {
				}
			});
			$li.remove();
			//
			var len = $cont.find('.jbasket li').length;
			if (len == 0) {
				$cont.find('.basket-popup').remove();
				refreshLittleCart();
			} else if (len <= 3) {
				$cont.find('.jbasket-box').removeClass('onair');
			}
			//
			var totalQuantity = 0;
			var totalAmount = 0;
			$cont.find('.jbasket li').each(function() {
				totalQuantity += Number($(this).attr('data-quantity'));
				totalAmount += Math.round(Number($(this).attr('data-price')) * Number($(this).attr('data-quantity')));
			});
			$cont.find('.basket-value > .spin').html(totalQuantity);
			$cont.find('.basket-cena > span').html($.number(totalAmount, 0, ',', ' ' ));
		});
	});
}

function updateLittleCart(data) {
	var $cont = $('#little_cart');
	$cont.html(data);
	//
	initLittleCart();
}

function refreshLittleCart() {
	$.ajax({  
		type: 'get',
		url: '/shop/cart/',
		dataType: 'html',
		data: {'action': 'refresh_little_cart'},
		success: function(response) {
			if (response) {
				updateLittleCart(response);
			}
		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {
		}
	});
	return false;
}


/* Favorite */

function initFavorite() {
	
}

function removeItemFavorite(id, $li) {
	var $cont = $('#favorite_cont');
	var $kslik = $cont.find('.kslik');
	//
	$li.fadeOut(200, function() {
		$kslik.slick('slickRemove', $li.index());
	});
	//
	var len = $cont.find('li').length;
	if (len > 1) {
		addFavorite(id, false);
	} else {
		addFavorite(id, true);
	}
	$cont.find('.spin').html(len-1);
}

function addFavorite(id, html) {
	$.ajax({  
		type: 'get',
		url: '/shop/',
		dataType: 'html',
		data: 'favorite=' + id,
		success: function(response) {
			if (response && html != false) {
				updateFavorite(response);
			}
		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {
		}
	});
	//
	if (id == 'all_remove') {
		$('.add-fav-block, .good_fav').removeClass('active');
	} else {
		var $a = $('.shop-item' + id + ' .add-fav-block');
		$a.toggleClass('active');
		//
		var $a2 = $('.shop-item' + id + ' .good_fav');
		$a2.toggleClass('active');
	}
	//
	return false;
}

function updateFavorite(data) {
	var $cont = $('#favorite_cont');
	//
	if (data != null) {
		$cont.html(data);
	}
	//
	var $kslik = $cont.find('.kslik');
	if ($kslik.length) {
		$kslik.slick({
		  	dots: false,
		  	infinite: false,
		  	speed: 500,
		  	slidesToShow: 5,
		  	draggable: false,
		  	slidesToScroll: 1,
		  	responsive: [
		    	{
		      	breakpoint: 1201,
		      	settings: {
						infinite: false,
		        		slidesToShow: 4
		      	}
		  		},
			   {
			      breakpoint: 961,
			      settings: {
					infinite: false,
			        slidesToShow: 3,
			        slidesToScroll: 1
			      }
		    	},
			   {
			      breakpoint: 741,
				      settings: {
					infinite: false,
			        slidesToShow: 1,
			        slidesToScroll: 1
			      }
		    	}
		  	]
		});
	}
}


/* Popup */

function openPopupUrl(id, url) {
	$.get(url, function(data) {
		openPopup(id, data);
	});
	//
	return false;
}

function openPopup(id, data) {
	if ($('.reveal-modal#' + id).length) {
		$('.reveal-modal#' + id).remove();
	}
	if (data != '' && data != null) {
		var $modal = $('<div id="' + id + '" class="reveal-modal stylize ' + id + '" data-reveal>'
			+ '<div class="reveal-body">'
			+ '<a class="close-reveal-modal" aria-label="Close"></a>'
			+ data
			+ '</div></div>');
		$('body').append($modal);
		$modal.foundation('reveal', 'open');
	}
	//
	return false;
}

function openPopupDis(id, data) {
	if ($('.reveal-modal#' + id).length) {
		$('.reveal-modal#' + id).remove();
	}
	if (data != '' && data != null) {
		var $modal = $('<div id="' + id + '" class="reveal-modal stylize ' + id + '" data-reveal data-options="close_on_background_click:false">'
			+ '<div class="reveal-body">'
			+ data
			+ '</div></div>');
		$('body').append($modal);
		$modal.foundation('reveal', 'open');
	}
	//
	return false;
}


/* Order */

function getOrderInfo(id) {
	$.ajax({  
		type: 'post',
		url: '/users/',
		dataType: 'html',
		data: {'get_order_info': id, 'ajax': 1},
		success: function(response) {
			openPopup('history_popup', response);
		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {
		}
	});
	//
	return false;
}


/* Profile */

function refreshProfile(page) {
	var $contAjax = $('.profile_ajax');
	var params = {'ajax': 1};
	if (page != undefined && page != null) {
		params['page'] = page;
	}
	$.ajax({  
		type: 'post',
		url: '/users/',
		dataType: 'html',
		data: params,
		success: function(response) {
			$contAjax.html(response);
			$contAjax.stop().fadeTo(250, 1);
		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {
			$contAjax.stop().fadeTo(250, 1);
		}
	});
	$contAjax.stop().fadeTo(250, 0.3);
	//
	return false;
}

function openProfileForm(type, page, id) {
	var params = {'profile_form': type, 'ajax': 1};
	if (id != undefined && id != null) {
		params['id'] = id;
	}
	$.ajax({  
		type: 'post',
		url: '/users/',
		dataType: 'html',
		data: params,
		success: function(response) {
			if (response != '') {
				openPopup('personal_popup', response);
				initFormProfile(page);
				$(document).foundation();
			}
		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {
		}
	});
	//
	return false;
}

function initFormProfile(page) {
	var $form = $('#form-profile');
	var type = $form.find('input[name=type]').val();
	$form.validate({
		focusInvalid: true,
		errorClass: 'input-error',
		rules: {
			email: {
				email: true
			},
			password: {
				minlength: 5
			},
			password2: {
				minlength: 5
			}
		},
		errorPlacement: function(error, element) {
		}
	}).resetForm();
	initLookPassword();
	//
	$form.unbind('submit').bind('submit', function() {
		if ($form.valid() && $form.attr('data-request') != 1) {
			var options = {
				method: 'post',
				dataType: 'json',
				data: {'save_profile': 1},
				success: function(response) {
					$form.find('.error').html('').hide();
					if (response.success) {
						$(document).foundation('reveal', 'close');
						refreshProfile(page);
					} else if (response.error) {
						$form.find('.error').html(response.error).show();
						$form.attr('data-request', 0);
					}
				},
				error: function(XMLHttpRequest, textStatus, errorThrown) {
					$form.attr('data-request', 0);
				}
			}
			$form.ajaxSubmit(options);
			$form.attr('data-request', 1);
		}
		return false;
	});
}

function sendFormQuestion($form) {
	if ($form.valid() && $form.attr('data-request') != 1) {
		var options = {
			dataType: 'html',
			data: {'Submit': 1},
			success: function(response) {
				$form.html(response);
			},
			error: function(XMLHttpRequest, textStatus, errorThrown) {
				$form.attr('data-request', 0);
			}
		}
		$form.ajaxSubmit(options);
		$form.attr('data-request', 1);
	}
	return false;
}


/* Fast Search */

var fastSearch = {request:null, interval:null, cont:null};

function initFastSearch() {
	var $cont = $(this);
	fastSearch.cont = $(this).find('.autosearch');
	//
	fastSearch.cont.mouseover(function() {
		if (fastSearch.interval != null) {
			clearInterval(fastSearch.interval);
		}
	});
	fastSearch.cont.mouseleave(function() {
		fastSearch.interval = setInterval(function() {
			closeFastSearch();
		}, 1500);
	});
	$cont.find('input[name=text]').bind('textchange', function (event, previousText) {
		var val = $(this).val();
		if (val.length >= 3) {
			fastSearchRequest(val);
		} else {
			closeFastSearch();
		}
	});

}
function closeFastSearch() {
	fastSearch.cont.html('').hide();
	if (fastSearch.interval != null) {
		clearInterval(fastSearch.interval);
	}
}
function fastSearchRequest(val) {
	if (fastSearch.request != null) {
		fastSearch.request.abort();
	}
	fastSearch.request = $.ajax({  
		type: 'get',
		url: '/search/',
		dataType: 'html',
		data: {'fast': 1, 'text': val},
		success: function(data) {
			fastSearch.cont.html(data);
			if (fastSearch.cont.find('.search_good').length > 0) {
				fastSearch.cont.show();
			} else {
				closeFastSearch();
			}
		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {
			closeFastSearch();
		}
	});	
}


/* Delivery Map */

function initDeliveryMap() {
	var $cont = $(this);
	var mapId = 'delivery-map';
	var mapIdReveal = 'delivery-map-reveal';
	//
	$cont.find('.jdelivery-box .jnext').jcarouselControl({target: '+=1'});
	//
	var map = null;
	var mapReveal = null;
	var collection = null;
	var points = new Array();
	ymaps.ready(function(){
		map = new ymaps.Map(mapId, {
            center: [55.75399400, 37.62209300],
            zoom: 12,
			controls: []
        });
		map.controls
			.add('zoomControl', {
				position: {
					top: 10,
					left: 10
				}
			})
			.add('fullscreenControl');
		//
		mapReveal = new ymaps.Map(mapIdReveal, {
            center: [55.75399400, 37.62209300],
            zoom: 12,
			controls: []
        });
		mapReveal.controls
			.add('zoomControl', {
				position: {
					top: 10,
					left: 10
				}
			})
			.add('fullscreenControl');
		//
		collection = new ymaps.GeoObjectCollection({}, {preset: 'islands#blueIcon'});
		//
		$cont.find('.jdelivery-item').each(function() {
			var num = $(this).attr('data-num');
			var lat = $(this).attr('data-lat');
			var lng = $(this).attr('data-lng');
			var id = $(this).attr('data-id');
			var placemark = new ymaps.Placemark([lat, lng], {
				iconContent: num
			});
			points[id] = placemark;
			collection.add(placemark);
		});
		map.geoObjects.add(collection);
		map.setBounds(collection.getBounds(), {checkZoomRange: true});
		//
		$cont.find('.jdelivery-item').each(function() {
			var $item = $(this);
			var id = $(this).attr('data-id');
			var point = points[id];
			$item.bind('click', function() {
				$(this).toggleClass('active');
				//
				if ($(this).hasClass('active')) {
					collection.add(point);
				} else {
					collection.remove(point);				
				}
				map.setBounds(collection.getBounds(), {checkZoomRange: true});
			});
			$item.find('.showmap').bind('click', function() {
				mapReveal.geoObjects.each(function(context) {
			        mapReveal.geoObjects.remove(context);
			    });
				mapReveal.geoObjects.add(point);
				mapReveal.setCenter(point.geometry.getCoordinates(), 14, {checkZoomRange: true});
			});
		});
	});
}


/* Auth */

function openAuth(id) {
	var $modal = $('#' + id);
	$modal.each(initFormAuth);
	$modal.foundation('reveal','open');
	return false;
}

function initFormAuth() {
	var $modal = $(this);
	var $form = $modal.find('.form-auth');
	var $formForgot = $modal.find('.form-forgot');
	$form.show();
	$formForgot.hide();
	$modal.find('.form-button').show();
	$modal.find('.error, .success').html('').hide();
	//
	$form.validate({
		focusInvalid: true,
		errorClass: 'input-error',
		rules: {
			email: {
				email: true
			}
		},
		errorPlacement: function(error, element) {
		}
	}).resetForm();
	$formForgot.validate({
		focusInvalid: true,
		errorClass: 'input-error',
		rules: {
			email: {
				email: true
			}
		},
		errorPlacement: function(error, element) {
		}
	}).resetForm();
	//
	if ($form.attr('data-init') == 1) {
		return true;
	} else {
		$form.attr('data-init', 1);
	}
	//
	initLookPassword();
	//
	$form.bind('submit', function() {
		var form = $(this);
		if (form.valid()) {
			var $error = form.find('.error');
			var redirect = './';
			if (form.find('input[name=location]').length) {
				redirect = form.find('input[name=location]').val();
			}
			var options = {
				dataType: 'json',
				data: {},
				success: function(response) {
					$error.html('').hide();
					if (response.success) {
						window.location = redirect;
					} else if (response.error) {
						$error.html(response.error).show();
					}
				},
				error: function(XMLHttpRequest, textStatus, errorThrown) {
				}
			}
			$(this).ajaxSubmit(options);
		}
		return false;
	});
	$formForgot.bind('submit', function() {
		var form = $(this);
		if (form.valid()) {
			var $error = form.find('.error');
			var $success = form.find('.success');
			var options = {
				dataType: 'json',
				data: {},
				success: function(response) {
					$error.html('').hide();
					$success.html('').hide();
					if (response.success) {
						$success.html(response.success).show();
						form.find('.form-button').hide();
					} else if (response.error) {
						$error.html(response.error).show();
					}
				},
				error: function(XMLHttpRequest, textStatus, errorThrown) {
				}
			}
			form.ajaxSubmit(options);
		}
		return false;
	});
	//
	$form.find('.forgot').unbind('click').bind('click', function(e) {
		e.preventDefault();
		$form.hide();
		$formForgot.show();
	});
}

function initLookPassword() {
	$('.eye, .lookpass').unbind('click').bind('click', function(e){
		e.preventDefault();
		//
		var obj = $(this).parent();
		var input = obj.find('input');
		obj.toggleClass('active');
		if (obj.hasClass('active')) {
			input.attr('type', 'text');
		} else {
			input.attr('type', 'password');
		};
	});
}

(function(){
	var loader = function() {	
		var o = {
			set: function(){
				var b = $('body');
				var html = ''+
				'<div class="loader">'+
				'    <div class="loader__content">'+
				'        <div class="loader__spinner"></div>'+
				'        <p>Загрузка, пожалуйста, подождите</p>'+
				'    </div>'+
				'</div>'+
				'';

				$(html).appendTo(b).addClass('show');
			},
			remove: function(){
				var b = $('body');

				b.find('.loader').fadeOut('fast', function(){
					$(this).remove();
				});
			}
		}

		return o;
	};
	window.loader = loader();
})();