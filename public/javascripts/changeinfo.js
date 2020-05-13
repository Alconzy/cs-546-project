$(function () {
    // Ajax submit form
    $("#submit").click(function () {
        // check form data
        let email = $.trim($('#email').val());
        let password = $.trim($('#password').val());
        let payment = $.trim($('#payment').val());
        let address = $.trim($('#address').val());

        // not none
        if (email.length === 0 || password.length === 0 || payment.length === 0 || address.length === 0) {
            Materialize.toast('Can not empty!', 2000);
            return;
        }
        let data = $("#form").serialize();

        $.ajax({
            type: 'POST',
            dataType: 'json',
            data: data,
            url: '/users/change',
            success: function(data) {
                if (data.info === "success") {
                    location.reload();
                } else if (data.info === "error") {
                    Materialize.toast('Can not empty!', 2000);
                }
            }
        })
    });
});