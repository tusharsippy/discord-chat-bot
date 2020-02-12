/**
 * searchController will create and find user searched terms on google
 */
const Search = require('../models/Search');

/**
 * Create an entry for user searched term on google
 * @param authorId: Message sender id
 * @param searchTerm: User searched term on google
 * @return void
 */
exports.create = (authorId, searchTerm) => {
  const search = new Search({
    author_id: authorId,
    search_term: searchTerm
  });
  search
    .save()
    .then(() => {
      console.info('New google search record created');
    })
    .catch(error => {
      console.error(error);
    });
};

/**
 * Find author search term in historical data in descending order of searched time
 * @param authorId: Message sender id
 * @param searchTerm: User searched term on google
 * @param limit: Number of results to return for specific searched term (default: 10)
 * @return array
 */
exports.find = async (authorId, searchTerm, limit = 10) => {
  let searchParams = {
    author_id: authorId,
    search_term: new RegExp(searchTerm, 'i') // case insenstive search query
  };

  // handling case when reent search term is empty or all
  if (searchTerm == '' || searchTerm == 'all') {
    searchParams = {
      author_id: authorId
    };
  }
  try {
    const searchResults = await Search.find(searchParams, {
        _id: 0,
        search_term: 1
      })
      .sort({
        created_at: -1
      })
      .limit(limit)
      .exec();
    return searchResults;
  } catch (error) {
    return [];
  }
};