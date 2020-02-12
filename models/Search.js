/**
 * Search.js includes setting up MongoDB search collection fields and indexes.
 */
const { model, Schema } = require('mongoose');
const SearchSchema = new Schema(
  {
    author_id: {
      type: Number,
      required: true
    },
    search_term: {
      type: String,
      required: true
    }
  },
  {
    versionKey: false,
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    }
  }
);

SearchSchema.index(
  {
    author_id: 1,
    search_term: 1
  },
  {
    unique: true
  }
);
SearchSchema.index({
  created_at: -1
});

const Search = model('Search', SearchSchema);
module.exports = Search;
