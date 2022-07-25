import axios from 'axios';

const API_KEY = '28776880-1fc4bbb019fa0e4aa33b54b30';

export async function fetchPictures(query, page, perPage) {
  return await axios.get(
    `https://pixabay.com/api/?key=${API_KEY}&q=${query}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=${perPage}`
  );
}
