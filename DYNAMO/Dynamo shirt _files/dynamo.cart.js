(function($, undefined) {
	$.widget('dynamo.cartDynamo', {

		options: {
			url: '/shop/cart/',
		},

		_create: function() {
			this.$this = this.element;
			this.$step1 = this.$this.find('.step1').show();
			this.$step2 = this.$this.find('.step2').hide();
			this.$step3 = this.$this.find('.step3').hide();
			this.$step4 = this.$this.find('.step4').hide();
			//
			this.$formCart = this.$this.find('#form-cart');
			this.$formCheckout = this.$this.find('#form-checkout');
			//
			this.siteuser = this.$formCheckout.attr('data-siteuser');
			this.step = 1;
			this.deliveryType = null;
			this.deliveryPrice = 0;
			this.delivery = null;
			this.payment = null;
			this.totalAmount = 0;
			this.totalQuantity = 0;
			//
			this.deliveries = null;
			this.countryDelivery = 175;
			this.cityDelivery = 0;
			this.locationDelivery = 0;
			this.cityDeliveryStr = '';
			//
			this._initCart();
		},

		_initCart:function() {
			var _this = this;
			this.$this.find('.next-further').bind('click', function(e) {
				e.preventDefault();
				$(this).blur();
				//
				_this._gotoStep(_this.step+1);
			});
			this.$this.find('.prev-further').bind('click', function(e) {
				e.preventDefault();
				$(this).blur();
				//
				_this._gotoStep(_this.step-1);
			});
			//
			this._initCartList();
		},

		_gotoStep: function(step) {
			if (step == 1) {
				this.step = step;
				this._showStep(step);
			} else if (step == 2 && this._checkStep1()) {
				this.step = step;
				this._showStep(step);
				this._initStep2();
			} else if (step == 3 && this._checkStep1() && this._checkStep2()) {
				this.step = step;
				this._showStep(step);
				this._initStep3();
			} else if (step == 4 && this._checkStep1() && this._checkStep2() && this._checkStep3()) {
				this.step = step;
				this._showStep(step);
				this._initStep4();
			}
		},

		_showStep: function(step) {
			this.$step1.hide();
			this.$step2.hide();
			this.$step3.hide();
			this.$step4.hide();
			//
			if (step == 1) {
				this.$step1.show();
			} else if (step == 2) {
				this.$step2.show();
			} else if (step == 3) {
				this.$step3.show();
			} else if (step == 4) {
				this.$step4.show();
			}
			//
			if (step > 1) {
				this.$this.find('.prev-further').show();
			} else {
				this.$this.find('.prev-further').hide();
			}
			if (step == 4) {
				this.$this.find('.submit').hide();
			} else {
				this.$this.find('.submit').show();
			}
			//
			var $stepsList = this.$this.find('.step-order-list');
			$stepsList.find('li').removeClass('current');
			$stepsList.find('li:eq(' + (step-1) + ')').addClass('current');
			$.scrollTo($stepsList.offset().top - 70, 250);
		},

		_checkStep1: function() {
			var $form = this.$formCart;
			if ($form.attr('data-quantity') > 0) {
				return true;
			}
			return false;
		},

		_checkStep2: function() {
			var $city = this.$step2.find('.country_city');
			var $delivery = this.$step2.find('.delivery');
			var $payment = this.$step2.find('.payment');
			if (this.countryDelivery != 175 || (this.countryDelivery == 175 && (this.cityDelivery > 0 || this.cityDeliveryStr != ''))) {
				$city.find('.country, .city').removeClass('input-error');
			} else {
				$city.find('.city').addClass('input-error');
				$.scrollTo($city.offset().top - 70, 250);
				return false;
			}
			if (this.delivery == null) {
				$delivery.addClass('input-error');
				$.scrollTo($delivery.offset().top - 70, 250);
				return false;
			} else {
				$delivery.removeClass('input-error');
			}
			if (this.payment == null) {
				$payment.addClass('input-error');
				$.scrollTo($payment.offset().top - 70, 250);
				return false;
			} else {
				$payment.removeClass('input-error');
			}
			return true;
		},

		_checkStep3: function() {
			if (this.$formCheckout.valid()) {
				return true;
			}
			return false;
		},

		_initStep2: function() {
			var _this = this;
			this.$step2.find('select[name=delivery_country]').unbind('change').bind('change', function() {
				var val  = $(this).val();
				_this.countryDelivery = val;
				_this._getListDeliveries();
				//
				if (val != 175) {
					_this.$step2.find('.country_city .city').hide();
				} else {
					_this.$step2.find('.country_city .city').removeClass('input-error').show();
				}
			});
			this.$step2.find('input[name=delivery_city]').autocomplete({
				serviceUrl: this.url,
				minChars: 2,
				maxHeight: 200,
				zIndex: 9999,
				deferRequestBy: 200,
				params: {get_city_ajax: 1},
				onSelect: function(response){
					if (response.data > 0) {
						_this.cityDelivery = response.data;
						_this.locationDelivery = response.location_id;
						_this.cityDeliveryStr = response.value;
						_this.$step2.find('input.delivery_city').val(response.value);
						_this._getListDeliveries();
					} else {
						_this.cityDelivery = 0;
						_this.cityDeliveryStr = '';
					}
				},
				onSearchError: function (query, jqXHR, textStatus, errorThrown) {
					console.log(textStatus);
				},
				beforeRender: function(cont) {
				}
			});
			this.$step2.find('.country_city .city button').unbind('click').bind('click', function(e) {
				e.preventDefault();
				//
				var val = _this.$step2.find('input[name=delivery_city]').val();
				if (val != '') {
					_this.cityDeliveryStr = val;
					_this._getListDeliveries();
				}
				_this.cityDelivery = 0;
			});
			//
			this.$step2.find('input[name=shop_payment_system_id]').unbind('change').bind('change', function() {
				_this.payment = $(this).val();
				$(this).parents('.payment').removeClass('input-error');
			});
			this.$step2.find('input[name=shop_payment_system_id]:checked').trigger('change');
		},

		_initStep3: function() {
			this.$step3.find('.skyline-column-block input[type=text]').removeClass('required').removeClass('input-error');
			this.$step3.find('.skyline-column-block.' + this.deliveryType + ' input[type=text]').addClass('required');
			//
			this.$formCheckout.validate({
				focusInvalid: true,
				errorClass: 'input-error',
				rules: {
					email: {
						email: true
					}
				},
				errorPlacement: function(error, element) {
				}
			});
		},

		_initStep4: function() {
			var _this = this;
			//
			this.$step4.find('.edit_goods').unbind('click').bind('click', function(e) {
				e.preventDefault();
				_this._gotoStep(1);
			});
			this.$step4.find('.edit_payment, .edit_delivery').unbind('click').bind('click', function(e) {
				e.preventDefault();
				_this._gotoStep(2);
			});
			this.$step4.find('.edit_personal').unbind('click').bind('click', function(e) {
				e.preventDefault();
				_this._gotoStep(3);
			});
			this.$step4.find('.finish').unbind('click').bind('click', function(e) {
				e.preventDefault();
				_this._sendOrder();
			});
			//
			var $goods = this.$step4.find('.goods-cont');
			$goods.html(this.$formCart.find('.goods').html());
			$goods.find('.skyline-order-block-good').each(function() {
				$(this).find('.trow_even').html('');
				$(this).find('.order-del').remove();
				$(this).find('.value-block .minus, .value-block .plus').remove();
				$(this).find('.value-block input').attr('disabled', 'disabled');
			});
			//
			this.$step4.find('.name-cont').html(this.$formCheckout.find('input[name=name]').val());
			this.$step4.find('.phone-cont').html(this.$formCheckout.find('input[name=phone]').val());
			this.$step4.find('.email-cont').html(this.$formCheckout.find('input[name=email]').val());
			var address = '';
			if (this.siteuser > 0) {
				var addressUser = this.$formCheckout.find('input[name=address_user]:checked').val();
				if (addressUser > 0) {
					address += this.$formCheckout.find('label[for=address' + addressUser + ']').html();
				}
			} else {
				if (this.$formCheckout.find('input[name=postcode]').val() != '') {
					address += this.$formCheckout.find('input[name=postcode]').val() + ', ';
				}
				if (this.$formCheckout.find('input[name=city]').val() != '') {
					address += this.$formCheckout.find('input[name=city]').val();
				}
				if (this.$formCheckout.find('input[name=street]').val() != '') {
					address += ', ул. ' + this.$formCheckout.find('input[name=street]').val();
				}
				if (this.$formCheckout.find('input[name=house]').val() != '') {
					address += ', д. ' + this.$formCheckout.find('input[name=house]').val();
				}
				if (this.$formCheckout.find('input[name=flat]').val() != '') {
					address += ', кв. ' + this.$formCheckout.find('input[name=flat]').val();
				}
			}
			if (address == '') {
				this.$step4.find('.address-row').hide();
			} else {
				this.$step4.find('.address-row').show();
				this.$step4.find('.address-cont').html(address);
			}
			//
			var delivery = this.$formCheckout.find('input[name=shop_delivery_type]:checked').next('label').html();
			this.$step4.find('.delivery-cont').html(delivery);
			var payment = this.$formCheckout.find('input[name=shop_payment_system_id]:checked').next('label').html();
			this.$step4.find('.payment-cont').html(payment);
			//
			var total = this.totalAmount + this.deliveryPrice;
			var $total = this.$step4.find('.total-amount');
			$total.html(this.$step1.find('.total-amount').html());
			if (this.deliveryPrice > 0) {
				$total.find('.delivery-price span').html($.number(this.deliveryPrice, 0, ',', ' ' ) + ' р');
				$total.find('.delivery-price').show();
			}
			$total.find('.total span').html($.number(total, 0, ',', ' ' ) + ' р');
		},

		_initCartList: function() {
			var _this = this;
			this.$formCart = this.$this.find('#form-cart');
			this.totalAmount = Number(this.$formCart.attr('data-amount'));
			this.totalQuantity = Number(this.$formCart.attr('data-quantity'));
			//
			if (this.totalQuantity == 0) {
				this.$step1.find('.submit').remove();
				this.$step2.remove();
				this.$step3.remove();
				this.$step4.remove();
				return true;
			}
			//
			this.$this.find('.skyline-order-block-good').each(function() {
				var $row = $(this);
				var id = $row.attr('data-id');
				$row.find('.minus').bind('click', function(e) {
					e.preventDefault();
					_this._addQuantity(id, -1);
				});
				$row.find('.plus').bind('click', function(e) {
					e.preventDefault();
					_this._addQuantity(id, 1);
				});
				$row.find('.order-del').bind('click', function(e) {
					e.preventDefault();
					_this._deleteItem(id);
				});
			});
			//
			this.$formCart.unbind('change').bind('change', function() {
				_this._recountCart();
			});
		},

		_addQuantity: function(id, count) {
			var $input = this.$this.find('#quantity_' + id);
			var val = Number($input.val());
			val += count;
			if (val <= 0) {
				val = 1;
			}
			if (Number($input.val()) != val) {
				$input.val(val).trigger('change');
			}
		},

		_deleteItem: function(id) {
			var _this = this;
			$.ajax({  
				type: 'get',
				url: this.url,
				dataType: 'json',
				data: {'ajax': 1, 'delete': id},
				success: function(response) {
					if(response.status == 1) {
						_this._recountCart();
					}
				},
				error: function(XMLHttpRequest, textStatus, errorThrown) {
				}
			});
		},
		
		_recountCart: function() {
			var _this = this;
			var $contAjax = this.$step1.find('.cont-ajax');
			var $form = this.$formCart;
			var options = {
				url: this.url,
				method: 'post',
				dataType: 'html',
				data: {'ajax': 1, 'action': 'recount'},
				success: function(response) {
					loader.remove();
					$contAjax.html(response).fadeTo(150, 1);
					_this._initCartList();
				},
				error: function(XMLHttpRequest, textStatus, errorThrown) {
					loader.remove();
					$contAjax.html(response).fadeTo(150, 1);
				}
			}
			loader.set();
			$form.ajaxSubmit(options);
			$contAjax.fadeTo(150, 0.75);
		},
		
		_getListDeliveries: function() {
			if (!(this.countryDelivery != 175 || this.countryDelivery == 175 && (this.cityDelivery > 0 || this.cityDeliveryStr != ''))) {
				return false;
			}
			//
			var _this = this;
			var params = new Object();
			params.country = this.countryDelivery;
			params.city = this.cityDelivery;
			params.city_str = this.cityDeliveryStr;
			params.get_types_deliveries = 1;
			//
			$.ajax({
				type: 'post',
				url: this.url,
				data: params,
				timeout: 10000,
				dataType: 'json',
				success: function(data) {
					if (data) {
						_this._setListDeliveries(data);
					}
					_this.$step2.find('.country_city').fadeTo(200, 1);
				},
				error: function(XMLHttpRequest, textStatus, errorThrown) {
					console.log(textStatus);
					_this.$step2.find('.country_city').fadeTo(200, 1);
				}
			});
			//
			_this.$step2.find('.country_city').fadeTo(200, 0.2);
			_this.$step2.find('.delivery, .payment').removeClass('input-error').hide();
			//
			this.deliveryType = null;
			this.deliveryPrice = 0;
			this.delivery = null;
			this.deliveries = null;
		},
		
		_setListDeliveries: function(data) {
			var _this = this;
			this.deliveries = data;
			var $cont = this.$step2.find('.delivery .list-cont').html('');
			if (this.deliveries) {
				for (var i in data) {
					var delivery = data[i];
					//
					var row = '<div class="radio-block">';
					row += '<input type="radio" name="shop_delivery_type" value="' + delivery['id'] + '" id="delivery_' + delivery['id'] + '" data-type="' + delivery['type'] + '" data-price="' + delivery['price'] + '" data-cash="' + delivery['cash'] + '" />';
					row += '<label class="radio-label" for="delivery_' + delivery['id'] + '">' + delivery['name'];
					if (delivery['price'] > 0 && delivery['time'] != undefined && delivery['time'] != '') {
						row += '<span>' + delivery['price'] + ' р / ' + delivery['time'] + '</span></label>';
					} else if (delivery['price'] > 0) {
						row += '<span>' + delivery['price'] + ' р</span></label>';
					} else {
						row += '<span>бесплатно</span></label>';
					}
					if (delivery.points != undefined) {
						row += '<div class="points" style="display:none;"><select name="point_' + delivery['id'] + '" class="select-box">';
						for (var j in delivery.points) {
							row += '<option value="' + delivery.points[j] + '">' + delivery.points[j] + '</option>';
						}
						row += '</select></div>';
					}
					row += '</div>';
					$cont.append(row);
				}
				$cont.find('.select-box').each(function() {
					var sb = new SelectBox({
						selectbox: $(this),
						height: 130
					});
				});
				//
				this.$step2.find('input[name=shop_delivery_type]').unbind('change').bind('change', function() {
					var val = $(this).val();
					_this.delivery = val;
					_this.deliveryType = $(this).attr('data-type');
					_this.deliveryPrice = Number($(this).attr('data-price'));
					$(this).parents('.delivery').removeClass('input-error');
					$(this).parents('.delivery').find('.points').hide();
					$(this).parent().find('.points').show();
					//
					_this._setListPayments(val);
				});
				if (this.$step2.find('input[name=shop_delivery_type]').length == 1) {
					this.$step2.find('input[name=shop_delivery_type]').prop('checked', true).trigger('change');
				}
				//
				this.$step2.find('.delivery, .payment').removeClass('input-error').show();
			}
		},
		
		_setListPayments: function(delivery) {
			if (this.deliveries != null && this.deliveries[delivery] != undefined) {
				var delivery = this.deliveries[delivery];
				if (delivery['cash'] == 1) {
					this.$step2.find('.payment .radio-block').show();
				} else {
					this.$step2.find('.payment .radio-block.cash').hide();
					//
					if (this.$step2.find('.payment .radio-block:visible input:checked').length == 0) {
						this.$step2.find('.payment .radio-block:visible:first input').prop('checked', true).trigger('change');
					}
				}
			}
		},
		
		_sendOrder: function() {
			var _this = this;
			var $form = this.$formCheckout;
			if (this.requestOrder != true) {
				var params = {'step': 'finish'};
				params.country = this.countryDelivery;
				params.city = this.cityDelivery;
				params.location = this.locationDelivery;
				params.city_str = this.cityDeliveryStr;
				var options = {
					url: this.url,
					method: 'post',
					dataType: 'html',
					data: params,
					success: function(response) {
						loader.remove();
						if (response) {
							var $div = $('<div>');
							$div.append(response);
							if ($div.find('.notice-block')) {
								_this._disableCart();
								_this._showSuccess(response);
							}
						}
					},
					error: function(XMLHttpRequest, textStatus, errorThrown) {
						loader.remove();
						this.requestOrder = false;
					}
				}
			}
			loader.set();
			$form.ajaxSubmit(options);
			this.requestOrder = true;
		},
		
		_disableCart: function() {
			this.$this.find('.further-block').remove();			
		},
		
		_showSuccess: function(data) {
			openPopupDis('notice_popup', data);
		}

	});
}(jQuery));