$(document).ready(function () {
    let category = "";

    if (location.href.search('man') !== -1) {
        category = "man";
    }

    if (location.href.search('woman') !== -1) {
        category = "woman";
    }

    if (location.href.search('kids') !== -1) {
        category = "kids";
    }

    if (location.href.search('baby') !== -1) {
        category = "baby";
    }

    $.get('/products/category_list/' + category, function (data) {
        data.products.forEach(function (val, index, arr) {
            $('#products').append(`
            <div class="col s3">
                <div class="card product">
                    <div class="card-image">
                        <img id="img" class="materialboxed" src="/images/${val.image}">
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