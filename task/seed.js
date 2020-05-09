const dbConnection = require('../config/mongoConnection');
const data = require('../data');
const products = data.products;

const main = async () => {
	const db = await dbConnection();
    await db.dropDatabase();
    await products.addProduct({			

            name: "White Baby Suit",
            description: "Perfect clothing for any baby.",
            image: "baby1.webp",
            tags: "baby",
            stocks: 20,
            price: 50,
            rating: 5,
            color:"white",
            sellCount:0});
    await products.addProduct({			
            name: "Baby Jacket",
            description: "It's a black baby jacket. Looks fashionable and great for outdoor acitvity.",
            image: "baby2.webp",
            tags: "baby",
            stocks: 8,
            price: 64,
            rating: 5,
            color:"Black",
            sellCount:0});        
    await products.addProduct({			
            name: "Elsa Dress",
            description: "Elsa dress for babies.",
            image: "baby3.webp",
            tags: "baby",
            stocks: 8,
            price: 60,
            rating: 5,
            color:"Blue",
            sellCount:0});   
    await products.addProduct({			
            name: "Red Button Jacket",
            description: "Goot looking black red buttoned jacket. Used to wear over other clothing and protect babies from temperature.",
            image: "baby4.webp",
            tags: "baby",
            stocks: 2,
            price: 45,
            rating: 5,
            color:"Red",
            sellCount:0});    
    await products.addProduct({			
            name: "Black Pants",
            description: "A pair black pants with a white stripe on the side. Perfect for any occasion.",
            image: "man1.webp",
            tags: "Man",
            stocks: 20,
            price: 65,
            rating: 5,
            color:"Black",
            sellCount:0});
    await products.addProduct({			
            name: "Beige Winter Coat",
            description: "A heavy winter coat that looks stylish. Perfect for any occasion.",
            image: "man2.webp",
            tags: "Man",
            stocks: 8,
            price: 90,
            rating: 5,
            color:"Brown",
            sellCount:0});        
    await products.addProduct({			
            name: "White's Sport Sweatshirt",
            description: "Perfect sweatshirt for any sport or outdoor relatited activity. So stylish that it is perfect for any occasion.",
            image: "man3.webp",
            tags: "Man",
            stocks: 8,
            price: 60,
            rating: 5,
            color:"white",
            sellCount:0});    
    await products.addProduct({			
            name: "Black Shirt With White Stipes",
            description: "Black shirt with white stripes. It looks stylish wherever you go and you can wear it for any occasion.",
            image: "man4.webp",
            tags: "Man",
            stocks: 2,
            price: 20,
            rating: 5,
            color:"Blue",
            sellCount:0});    
    await products.addProduct({			
            name: "Purple Dress",
            description: "Nice outdoor dress",
            image: "woman1.webp",
            tags: "woman",
            stocks: 20,
            price: 65,
            rating: 5,
            color:"purple",
            sellCount:0});
    await products.addProduct({			
            name: "Full Clothing Set",
            description: "Matching Jeans with top.",
            image: "woman2.webp",
            tags: "woman",
            stocks: 8,
            price: 90,
            rating: 5,
            color:"Black",
            sellCount:0});        
    await products.addProduct({			
            name: "Women's Overcoat",
            description: "Gray Overcoat, perfect for outdoors.",
            image: "woman3.webp",
            tags: "woman",
            stocks: 8,
            price: 60,
            rating: 5,
            color:"Grey",
            sellCount:0});    
    await products.addProduct({			
            name: "Womens Overall",
            description: "Dark overalls.",
            image: "woman4.webp",
            tags: "woman",
            stocks: 2,
            price: 20,
            rating: 5,
            color:"Blue",
            sellCount:0}); 
    await products.addProduct({	  
            name: "Kid1",
            description: "The clothes are very good, the clothes are not ordinary good!",
            image: "kid1.webp",
            tags: "kids",
            stocks: "123",
            price: "32",
            rating: "5",
            color: "Black",
            sellCount: 0});
    await products.addProduct({	     
            name: "Kid2",
            description: "The clothes are very good, the clothes are not ordinary good!",
            image: "kid2.webp",
            tags: "kids",
            stocks: "10",
            price: "10",
            rating: "5",
            color: "Red",
            sellCount: 0});
    await products.addProduct({	       
            name: "Kid3",
            description: "The clothes are very good, the clothes are not ordinary good!",
            image: "kid3.webp",
            tags: "kids",
            stocks: "12",
            price: "12",
            rating: "5",
            color: "Black",
            sellCount: 0});
    await products.addProduct({	         
            name: "Kid4",
            description: "The clothes are very good, the clothes are not ordinary good!",
            image: "kid4.webp",
            tags: "kids",
            stocks: "10",
            price: "10",
            rating: "5",
            color: "Blue",
            sellCount: 0});
    console.log("Done seeding List");
	await db.serverConfig.close();
};

main().catch(console.log);