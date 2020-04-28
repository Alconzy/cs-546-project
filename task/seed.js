const dbConnection = require('../config/mongoConnection');
const data = require('../data');
const products = data.products;

const main = async () => {
	const db = await dbConnection();
    await db.dropDatabase();
    await products.addProduct({			
        name: "Black Pants",
        description: "A pair black pants with a white stripe on the side. Perfect for any occasion.",
        image: "man1.webp",
        tags: "Man",
        stocks: 20,
        price: 65,
        rating: 5});
    await products.addProduct({			
        name: "Beige Winter Coat",
        description: "A heavy winter coat that looks stylish. Perfect for any occasion.",
        image: "man2.webp",
        tags: "Man",
        stocks: 8,
        price: 90,
        rating: 5});        
    await products.addProduct({			
        name: "White's Sport Sweatshirt",
        description: "Perfect sweatshirt for any sport or outdoor relatited activity. So stylish that it is perfect for any occasion.",
        image: "man3.webp",
        tags: "Man",
        stocks: 8,
        price: 60,
        rating: 5});    
    await products.addProduct({			
        name: "Black Shirt With White Stipes",
        description: "Black shirt with white stripes. It looks stylish wherever you go and you can wear it for any occasion.",
        image: "man4.webp",
        tags: "Man",
        stocks: 2,
        price: 20,
        rating: 5});    
    console.log("Done seeding List");
	await db.serverConfig.close();
};

main().catch(console.log);