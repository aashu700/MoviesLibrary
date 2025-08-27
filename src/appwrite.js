import { Client, Databases, ID, Query } from 'appwrite'
import { getUniqueId } from './helpers';

const PROJECT_ID = import.meta.env.VITE_APPWRITE_PROJECT_ID;
const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const COLLECTION_ID = import.meta.env.VITE_APPWRITE_COLLECTION_ID;

const client = new Client()
  .setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT) // Your Appwrite Endpoint
  .setProject(PROJECT_ID)

const database = new Databases(client);

export const updateSearchCount = async (searchTerm, movie) => {
  try {
    let doc;

    try {
      // Try to get the document
      doc = await database.getDocument(DATABASE_ID, COLLECTION_ID, getUniqueId(movie.id));

      // Update count if found
      await database.updateDocument(DATABASE_ID, COLLECTION_ID, doc.$id, {
        count: doc.count + 1,
      });

    } catch (error) {
      if (error.code === 404) {
        // Document not found → create a new one
        console.log("Document not found, creating new...");
        await database.createDocument(DATABASE_ID, COLLECTION_ID, getUniqueId(movie.id), {
          searchTerm,
          count: 1,
          movie_id: movie.id,
          poster_url: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
        });
      } else {
        // Some other error
        throw error;
      }
    }

  } catch (err) {
    console.error("Unexpected error =>>", err);
  }
}

export const getTrendingMovies = async () => {
  try {
    const result = await database.listDocuments(DATABASE_ID, COLLECTION_ID, [
      Query.limit(5),
      Query.orderDesc("count")
    ])

    return result.documents;
  } catch (error) {
    console.error(error);
  }
}