$(function () {
    $('.add_comment').click( function (data) {
    	var myBookId = $(this).data('id');
    	//console.log(myBookId);
    	$('.modal-content #product').val(myBookId);
    	//$('#product').html("parth");
        $('#modal').modal('open');
    });

    $('#add_comment').click( function (data) {
        $('#modal').modal('open');
    });
});