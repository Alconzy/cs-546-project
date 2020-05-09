$(function () {
    // Ajax submit form
    $("#submit").click(function () {
        // check form data
        let email = $.trim($('#email').val());
        let password = $.trim($('#password').val());

        // not none
        if (email.length === 0 || password.length === 0) {
            Materialize.toast('Email or password is empty!', 2000);
            return;
        }
        let data = $("#form").serialize();

        $.ajax({
            type: 'POST',
            dataType: 'json',
            data: data,
            url: '/users',
            success: function(data) {
                if (data.info === "success") {
                    location = '/';
                } else if (data.info === "error") {
                    Materialize.toast('Email is already registered', 2000);
                }
            }
        })
    });
});