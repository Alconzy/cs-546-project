$(function() {
    // active modal window
    $('.modal').modal();

    $.get('/users/cart_number', function (data) {
        if (data.num) {
            $('#cart-number').text(data.num);
        } else {
            $('#cart-number').text(0);
        }
    });

    $('.addCart').click(function () {
        let id = $(this).attr('data-id');
        // add cart
        $.post('/users/add_cart', {
            'id': id
        }, function (data) {
            $('#cart-number').text(Number.parseInt($('#cart-number').text()) + 1);
        });
    });

    $('#payment').click(function () {
        $('#modal').modal('open');
    });

    $('.logOut').click(function () {
        console.log("Logout");

        $.get('/users/logout', function (data) {
            //console.log(data.comm);
        });
    });
});