import { ID } from 'appwrite';

export const getUniqueId = (movieId) => {
  return ID.custom(`${movieId}_3369`);
}