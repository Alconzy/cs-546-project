$(function () {
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