function Search() {
  return (
    <div className="bg-gray-50">
      <form className="flex justify-center py-8">
        <label>
          Search:
          <input type="text" name="name" />
        </label>
        <input type="submit" value="Submit" />
      </form>
    </div>
  );
}

export default Search;
