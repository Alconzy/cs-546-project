$(function () {


	$.get('/products/Graph', function (data) {
		console.log("dsfd", data)
		JSC.Chart('chartContainer', {
			// type: 'column',
			title_label_text: 'The product sell graph.',
			annotations: [{
				label_text: 'Product',
				position: 'bottom'
			},{
				label_text: 'Sell',
				position: 'left'
			}],
			series: [
				{
					name: 'product name',
					points: data.product
				}
			]
		});
	
	})
})