class SearchHandler {
  async search(query) {
    try {
      const response = await fetch(
        `/.netlify/functions/search?q=${encodeURIComponent(query)}`
      );

      if (!response.ok) {
        throw new Error(`Search API error: ${response.statusText}`);
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
