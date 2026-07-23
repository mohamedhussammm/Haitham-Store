const { MongoClient } = require('mongodb');

const LOCAL_URI = 'mongodb://127.0.0.1:27017/bamteek';
const REMOTE_URI = 'mongodb+srv://admin:admin123@cluster0.lw8b5x6.mongodb.net/bamteek';

async function migrate() {
  const localClient = new MongoClient(LOCAL_URI);
  const remoteClient = new MongoClient(REMOTE_URI);

  try {
    console.log('Connecting to local DB...');
    await localClient.connect();
    const localDb = localClient.db();

    console.log('Connecting to remote Atlas DB...');
    await remoteClient.connect();
    const remoteDb = remoteClient.db();

    const collections = await localDb.listCollections().toArray();
    
    for (let collInfo of collections) {
      const collName = collInfo.name;
      console.log(`Migrating collection: ${collName}...`);
      
      const localColl = localDb.collection(collName);
      const remoteColl = remoteDb.collection(collName);
      
      const docs = await localColl.find({}).toArray();
      if (docs.length > 0) {
        await remoteColl.deleteMany({}); // Clear remote first
        await remoteColl.insertMany(docs);
        console.log(`  -> Inserted ${docs.length} documents.`);
      } else {
        console.log(`  -> Collection is empty.`);
      }
    }

    console.log('✅ Migration completed successfully!');
  } catch (err) {
    console.error('❌ Migration failed:', err);
  } finally {
    await localClient.close();
    await remoteClient.close();
  }
}

migrate();
