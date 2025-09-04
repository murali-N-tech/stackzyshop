import mongoose from 'mongoose';
import 'dotenv/config';
import algoliasearch from 'algoliasearch';
import Product from './src/models/product.model.js';
import connectDB from './src/config/db.js';

const syncToAlgolia = async () => {
  await connectDB();
  try {
    // Initialize Algolia client
    const client = algoliasearch(process.env.ALGOLIA_APP_ID, process.env.ALGOLIA_ADMIN_KEY);
    const index = client.initIndex('products'); // The name of your index in Algolia

    // Clear existing records in Algolia to prevent duplicates
    await index.clearObjects();
    console.log('Algolia index cleared.');

    const products = await Product.find({});
    if (products.length === 0) {
      console.log('No products found in MongoDB to sync.');
      process.exit();
    }

    // Algolia requires a unique objectID for each record
    const records = products.map((product) => ({
      objectID: product._id.toString(),
      name: product.name,
      brand: product.brand,
      category: product.category,
      description: product.description,
      image: product.image,
      price: product.price,
      rating: product.rating,
      numReviews: product.numReviews,
    }));

    // Save the new records to Algolia
    await index.saveObjects(records);
    console.log(`✅ Successfully synced ${records.length} products to Algolia.`);
    process.exit();
  } catch (error) {
    console.error('❌ Error syncing to Algolia:', error);
    process.exit(1);
  }
};

syncToAlgolia();