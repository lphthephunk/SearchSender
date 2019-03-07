import mongoose from "mongoose";
const Schema = mongoose.Schema;

const SearchCriteriaSchema = new Schema({
  executionTime: {
    type: String,
    required: true
  },
  searchText: {
    type: String,
    required: true
  },
  executionDays: {
    type: [String],
    required: true
  },
  userId: {
    type: String,
    required: true
  },
  searchCity: {
    type: String,
    required: true
  }
});

const SearchCriteria = mongoose.model("SearchCriteria", SearchCriteriaSchema);

export default SearchCriteria;
