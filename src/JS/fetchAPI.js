import axios from 'axios';

export async function fetchImages(value, page) {
  const url = 'https://pixabay.com/api/';
  const key = '33161979-56695e67461a6bb8d382238a0';
  const filter = `?key=${key}&q=${value}$&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${page}`;
  return await axios.get(`${url}${filter}`).then(response => response.data);
}
