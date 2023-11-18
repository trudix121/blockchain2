const { MongoClient, ServerApiVersion } = require("mongodb");
const uri = 'mongodb+srv://blockchain:pylex@main.9fbvhcv.mongodb.net/?retryWrites=true&w=majority';
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function connect() {
  try {
    // Connect the client to the server (optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Database Connected "
    );
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
    process.exit(1); // Optionally, handle the connection failure
  }
}

/*async function create_db(db_name){
   try{
        await client.db(db_name)
    }
    finally{

        await console.log(`database created successfully (db name: ${db_name})` );
    }
}
*/

async function find(db, collection, data) {
  try {
    const result = await client
      .db(db)
      .collection(collection)
      .find(data)
      .toArray();
    //console.log(result);
    return result; // Return the result array
  } catch (error) {
    //console.error('Failed to find data:', error);
    return []; // Return an empty array if an error occurs
  }
}

async function find_one(db, collection, data) {
  try {
    const result = await client.db(db).collection(collection).findOne(data);
    //console.log(result);
    if (result) {
      //console.log('Data Found');
      return result; // Return the entire result object
    } else {
      //console.log('Data Not Found');
      return null; // Return null if no result found
    }
  } finally {
  }
}

async function find_one_badges(db, collection, data) {
  try {
    const result = await client.db(db).collection(collection).findOne(data);
    if (result) {
      const badges = []; // Initialize an empty array for badges
      if (result.pro_badge === 1) {
        badges.push("pro_badge");
      }
      if (result.beginner_badge === 1) {
        badges.push("beginner_badge");
      }
      if (result.semi_beginner === 1) {
        badges.push("semi_beginner");
      }
      result.badges = badges; // Add the badges array to the result object
      return result;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Failed to find data:", error);
    return null;
  }
}

async function insert(db, collection, data) {
  try {
    await connect(); // Connect to the MongoDB server
    await client.db(db).collection(collection).insertOne(data);
  } finally {
    //console.log('Success: Inserted document, data:', data);
  }
}

async function delete1(db, collection, data_to_delete) {
  try {
    await client.db(db).collection(collection).deleteOne(data_to_delete);
  } finally {
    console.log("Succes To delete document, data: ", data_to_delete);
  }
}

async function update(db, collection, query, newvalue) {
  try {
    await client.db(db).collection(collection).updateOne(query, newvalue);
  } finally {
    console.log("Succes To update document, data: ", newvalue);
  }
}

module.exports = {
  find,
  insert,
  update,
  find_one,
  find_one_badges,
};
connect();
