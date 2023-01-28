import axios from 'axios';
import Notiflix from 'notiflix';

export default async function fetchPhotos(value, page) {
  try {
    const response = await axios({
      url: 'https://pixabay.com/api/',
      params: {
        key: '33161979-56695e67461a6bb8d382238a0',
        q: value,
        orientation: 'horizontal',
        image_type: 'photo',
        safesearch: true,
        page: page,
        per_page: 40,
      },
    });
    return response;
  } catch (error) {
    console.log(error);
  }
}
