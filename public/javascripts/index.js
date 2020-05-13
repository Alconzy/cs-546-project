$(document).ready(function () {
	// require the carousel products
	$.get('/products/carouselList', function (data) {
		data.carouselList.forEach(function (val, index, arr) {
			$('#carousel').append(`<a class="carousel-item" href="/products/detail/${val._id}"><img src="images/${val.image}" role="presentation"></a>`);
		});
		$('.carousel').carousel({full_width: true});
	});

	// require all products
	$.get('/products/all', function (data) {
		data.product.forEach(function (val, index, arr) {
			$('#products').append(`
            <div class="col s3">
                <div class="card product">
                    <div class="card-image">
                        <img id="img" class="materialboxed" src="images/${val.image}">
                        <a id="id" title="Add to cart" data-id="${val._id}" class="addCart btn-floating halfway-fab waves-effect waves-light red"><i class="material-icons">add</i></a>
                    </div>
                    <div class="card-content index-card-content">
                        <p><a id="name" href="/products/detail/${val._id}" class="red-text">${val.name}</a></p>
                        <p id="price">${val.price}</p>
                    </div>
                </div>
            </div>
            `);
		});
		$('.materialboxed').materialbox();

		$('.addCart').click(function () {
			let id = $(this).attr('data-id');
			// add cart
			$.post('/users/add_cart', {
				'id': id
			}, function (data) {
				if (data.length > 50) {
					location = '/login.html';
				} else {
					$.get('/users/cart_number', function (data) {
						if (data.num) {
							$('#cart-number').text(data.num);
						} else {
							$('#cart-number').text(0);
						}
					});
				}
			});
		});
	});
});