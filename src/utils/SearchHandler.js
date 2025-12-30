class SearchHandler {
  async search(query) {
    try {
      const response = await fetch(
        `/api/search?q=${encodeURIComponent(query)}`
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Search function error:', response.status, errorText);
        throw new Error(`Search API error (${response.status}): ${errorText}`);
      }

      const data = await response.json();
      return data.summary;
    } catch (error) {
      console.error('Search error:', error);
      throw error;
    }
  }
}

export default SearchHandler;
