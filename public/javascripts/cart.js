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

    $('#payment').click(function () {
        $('#modal').modal('open');
    });
});