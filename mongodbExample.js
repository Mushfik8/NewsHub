// mongodbExample.js

// We need the MongoClient class from the official MongoDB Node.js driver.
// Note: You must install the driver and dotenv first by running: npm install mongodb dotenv
require('dotenv').config({ path: '.env.local' });
const { MongoClient, ServerApiVersion } = require('mongodb');

// Read the connection string from environment variables.
// If it's missing, we fall back to a hardcoded string ONLY for testing/fallback purposes (never commit real passwords here!).
const uri = process.env.MONGODB_URI || "your_connection_string_here";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
// The Stable API ensures that your connections remain compatible with future MongoDB versions.
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // 1. Connect to the MongoDB Atlas cluster
    console.log("Connecting to MongoDB Atlas...");
    await client.connect();
    console.log("✅ Successfully connected to MongoDB Atlas!");

    // 2. Select the database and collection
    // For an Activity Feed app, we might want a database called 'social_network'
    // and a collection called 'activities'
    const db = client.db("social_network");
    const activitiesCollection = db.collection("activities");

    // Clear previous data if any exists (Optional, just to keep the example clean)
    await activitiesCollection.deleteMany({});

    // 3. Insert 10 realistic activity documents
    // We are simulating an activity feed where users follow each other, like posts, and leave comments.
    const now = new Date();
    const mockActivities = [
      { userId: "user_101", action: "like", targetId: "post_99", timestamp: new Date(now.getTime() - 10000) },
      { userId: "user_204", action: "comment", targetId: "post_99", content: "Great post!", timestamp: new Date(now.getTime() - 20000) },
      { userId: "user_101", action: "follow", targetId: "user_204", timestamp: new Date(now.getTime() - 30000) },
      { userId: "user_305", action: "share", targetId: "post_42", timestamp: new Date(now.getTime() - 40000) },
      { userId: "user_204", action: "like", targetId: "post_42", timestamp: new Date(now.getTime() - 50000) },
      { userId: "user_509", action: "post", content: "Hello world!", timestamp: new Date(now.getTime() - 60000) },
      { userId: "user_101", action: "comment", targetId: "post_42", content: "Agreed.", timestamp: new Date(now.getTime() - 70000) },
      { userId: "user_888", action: "follow", targetId: "user_101", timestamp: new Date(now.getTime() - 80000) },
      { userId: "user_305", action: "like", targetId: "post_5", timestamp: new Date(now.getTime() - 90000) },
      { userId: "user_204", action: "share", targetId: "post_5", timestamp: new Date(now.getTime() - 100000) }
    ];

    console.log("Inserting 10 activity feed documents...");
    const insertResult = await activitiesCollection.insertMany(mockActivities);
    console.log(`✅ Successfully inserted ${insertResult.insertedCount} documents!`);

    // 4. Read and print the 5 most recent activities
    // We sort by 'timestamp' in descending order (-1) to get the newest first
    console.log("\nFetching the 5 most recent activities:");
    const recentActivities = await activitiesCollection
      .find({})
      .sort({ timestamp: -1 }) // Sort descending (newest to oldest)
      .limit(5)               // Limit to 5 results
      .toArray();
      
    console.log(recentActivities);

    // 5. Read and print ONE document exactly by its unique _id
    // We use the ID built by MongoDB from the very first item in our recently fetched array.
    const targetId = recentActivities[0]._id;
    console.log(`\nFetching a specific activity exactly by _id (${targetId}):`);
    
    // findOne returns exactly one document that matches the query
    const singleActivity = await activitiesCollection.findOne({ _id: targetId });
    console.log(singleActivity);

  } catch (error) {
    // Catch any network errors or authentication failures
    console.error("❌ An error occurred interacting with MongoDB:", error);
  } finally {
    // 6. Close the connection when we are finished
    console.log("\nClosing connection...");
    await client.close();
    console.log("Connection closed.");
  }
}

// Execute the async function
run().catch(console.dir);
