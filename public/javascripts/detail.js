$(function () {
    let productId = location.href.split('/')[5];
    $.get("/products/detail/product/" + productId, function (product) {
        let detail = $('#detail');
        $('#product').val(product._id);
        detail.empty();
        detail.append(
            `
            <div class="card-image">
                <img class="materialboxed" src="/images/${product.image}">
            </div>
            <div class="card-stacked">
                <div class="card-content">
                    <h5 class="red-text">${product.name}</h5>
                    <p><strong>Price: $${product.price}</strong></p>
                    <p><strong>Stock: ${product.stocks}</strong></p>
                    <p>${product.description}</p>
                </div>
                <div class="card-action">
                    <a data-id="${product._id}" title="Add to cart" class="addCart waves-effect waves-light btn red"><i
                            class="large material-icons">shopping_cart</i></a>
                    <a id="add_comment" title="Add comment" class="waves-effect waves-light btn"><i
                            class="large material-icons">comment</i></a>
                </div>
            </div>
            `
        );

        $('#add_comment').click(function () {
            $('#modal').modal('open');
        });

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

    $.get("/products/detail/comments/" + productId, function (comments) {
        let comment = $('#comment_container');
        comment.empty();
        comment.append('<li class="collection-header"><h5>Comments</h5></li>');

        comments.forEach(function (val, index, array) {
            comment.append(`
            <li class="collection-item avatar">
                <img src="/images/avatar.jpg" alt="avatar" class="circle">
                <p><strong>${val.name}</strong></p>
                <p><strong>Rating: ${val.rating}</strong></p>
                <p>${val.comment}</p>
            </li>
            `);
        });
    })
});