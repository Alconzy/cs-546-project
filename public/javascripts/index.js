$(document).ready(function () {
    $('.carousel').carousel({ full_width: true });
});

var sort_1 = document.getElementById("lth");
sort_1.addEventListener("click", sort_lth);

var sort_2 = document.getElementById("htl");
sort_2.addEventListener("click", sort_htl);

function sort_lth() {
	console.log("LTH");
	var arr = [];
	var products = document.querySelectorAll("#product");
	for(i=0;i<products.length;i++)
	{  
        let obj = {};
		obj.name = products[i].querySelector("#name").innerHTML;
		obj.price = products[i].querySelector("#price").innerHTML;
		obj.id = products[i].querySelector("#id").getAttribute('data-id');
		obj.img = products[i].querySelector("#img").src;
		obj.tag = products[i].querySelector("#name").href;
		arr.push(obj);
	}
	arr.sort(compare);
	console.log(arr);
	arr.forEach((product,index) => {
		products[index].querySelector("#name").innerHTML = product.name;
		products[index].querySelector("#price").innerHTML = product.price;
		products[index].querySelector("#id").setAttribute('data-id',product.id);
		products[index].querySelector("#img").src = product.img;
		products[index].querySelector("#name").href = product.tag;
	});
}

function compare(a,b) {
	const A = parseInt(a.price);
	const B = parseInt(b.price);

	let comparison = 0;
	if (A > B) {
	    comparison = 1;
	} else if (A < B) {
	    comparison = -1;
	}
	return comparison;
	
}

function compare_reverse(a,b) {
	const A = parseInt(a.price);
	const B = parseInt(b.price);

	let comparison = 0;
	if (A > B) {
	    comparison = 1;
	} else if (A < B) {
	    comparison = -1;
	}
	return comparison*-1;
	
}

function sort_htl() {
	console.log("HTL");
	var arr = [];
	var products = document.querySelectorAll("#product");
	for(i=0;i<products.length;i++)
	{  
        let obj = {};
		obj.name = products[i].querySelector("#name").innerHTML;
		obj.price = products[i].querySelector("#price").innerHTML;
		obj.id = products[i].querySelector("#id").getAttribute('data-id');
		obj.img = products[i].querySelector("#img").src;
		obj.tag = products[i].querySelector("#name").href;
		arr.push(obj);
	}
	arr.sort(compare_reverse);
	console.log(arr);
	arr.forEach((product,index) => {
		products[index].querySelector("#name").innerHTML = product.name;
		products[index].querySelector("#price").innerHTML = product.price;
		products[index].querySelector("#id").setAttribute('data-id',product.id);
		products[index].querySelector("#img").src = product.img;
		products[index].querySelector("#name").href = product.tag;
	});
}