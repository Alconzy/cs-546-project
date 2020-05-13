
$(function(){

    $('#login-failed').hide();

    $( "#loginForm" ).submit(function( event ) {
        event.preventDefault();
        $.post( "/users/login", $('#loginForm').serialize())
            .done(function(data) {
                if(data.success){
                    window.location.href = "/";
                } else {
                    $("#login-failed span").text(data.message);
                    $("#login-failed").show()
                }
            })
            .fail(function() {
                $("#login-failed span").text("Something went Wrong!");
                $("#login-failed").show()
            })
    });
});
