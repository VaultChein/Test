import { MongoClient } from 'mongodb';

const options = {
  serverSelectionTimeoutMS: 5000,
  connectTimeoutMS: 10000,
};
console.log('MongoDB URI:', process.env.MONGODB_URI);
declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

function getClientPromise(): Promise<MongoClient> {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error('MONGODB_URI is not defined');

  if (process.env.NODE_ENV === 'development') {
    if (!global._mongoClientPromise) {
      global._mongoClientPromise = new MongoClient(uri, options).connect();
    }
    return global._mongoClientPromise;
  }

  return new MongoClient(uri, options).connect();
}

export default {
  then: (...args: Parameters<Promise<MongoClient>['then']>) => getClientPromise().then(...args),
  catch: (...args: Parameters<Promise<MongoClient>['catch']>) => getClientPromise().catch(...args),
} as Promise<MongoClient>;
