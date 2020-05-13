$(function () {
    $.get('/products/orderProduct', function (products) {
        let container = $('#container');
        if (products.length === 0) {
            container.append(`
                <li class="collection-header">
                    <h4>Sorry, there is no products.</h4>
                </li>
            `);
        } else {
            container.append(`
                <li class="collection-header">
                    <h4>Products Order</h4>
                </li>
            `);
        }
        products.forEach(function (val, index, arr) {
            container.append(`
                <div class="col s12 m7">
                    <div class="mycard card horizontal">
                        <div class="card-image">
                            <img src="/images/${val.image}">
                        </div>
                        <div class="card-stacked">
                            <div class="card-content">
                                <p><strong><a href="/products/detail/${val._id}">${val.name}</a></strong></p>
                                <p><strong>Price: $${val.price}</strong></p>
                            </div>
                            <div class="card-action">
                                <a class="red-text" href="/products/order/delete/${val._id}">Delete</a>
                            </div>
                        </div>
                    </div>
                </div>
            `);
        });
    });
});