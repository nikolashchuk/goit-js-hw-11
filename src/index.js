import fetchPhotos from './js/fetchPhotos';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

let query = '';
let page;
let newpages;

const target = document.querySelector('.target');
const options = {
  root: null,
  rootMargin: '300px',
  threshold: 1.0,
};
const observer = new IntersectionObserver(updatePhotos, options);
const searchForm = document.querySelector('#search-form');
const galleryBox = document.querySelector('.gallery');

searchForm.addEventListener('submit', onFormSubmit);

function onFormSubmit(e) {
  e.preventDefault();

  galleryBox.innerHTML = '';
  observer.unobserve(target);
  page = 1;
  query = e.target.elements.searchQuery.value;
  if (!query) {
    Notiflix.Notify.failure('Enter any value');
    return;
  }
  fetchPhotos(query, page).then(response => {
    console.log(response.data.hits);
    if (response.data.totalHits === 0) {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      return;
    }
    if (response.data.totalHits > 1) {
      Notiflix.Notify.success(
        `Hooray! We found ${response.data.totalHits} images.`
      );
    }

    renderCards(response.data.hits);
    observer.observe(target);
  });
}

function renderCards(images) {
  const listOfPhotos = images
    .map(image => {
      return `<div class="photo-card">
  <a class="card-link" href="${image.largeImageURL}"><img src="${image.webformatURL}" alt="${image.tags}" loading="lazy" /></a>
  <div class="info">
    <p class="info-item">
      <b>Likes ${image.likes}</b>
    </p>
    <p class="info-item">
      <b>Views ${image.views}</b>
    </p>
    <p class="info-item">
      <b>Comments ${image.comments}</b>
    </p>
    <p class="info-item">
      <b>Downloads ${image.downloads}</b>
    </p>  
  </div>
</div>`;
    })
    .join('');

  galleryBox.insertAdjacentHTML('beforeend', listOfPhotos);

  const lightbox = new SimpleLightbox('.gallery a', {});
  lightbox.refresh();
}

function updatePhotos(entries) {
  console.log(entries);
  newpages = entries.forEach(entry => {
    if (entry.isIntersecting) {
      console.log(query);
      page += 1;
      fetchPhotos(query, page).then(response => {
        if (response.data.totalHits < page * 40) {
          Notiflix.Notify.failure(
            `We're sorry, but you've reached the end of search results.`
          );
          observer.unobserve(target);
          return;
        }
        renderCards(response.data.hits);
      });
    }
  });
}
