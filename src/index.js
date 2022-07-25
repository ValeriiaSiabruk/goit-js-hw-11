import { Notify } from 'notiflix';
import { fetchPictures } from './js/fetchPictures';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const formEl = document.querySelector('#search-form');
const searchInputEl = document.querySelector('#search-form input');
const galleryEl = document.querySelector('.gallery');
const loadMoreEl = document.querySelector('.load-more');
let query;
let totalHits;
let page = 1;
const perPage = 40;

const lightbox = new SimpleLightbox('.gallery__link');

const submitHandler = e => {
  e.preventDefault();
  query = searchInputEl.value.trim();
  clearMarkup();
  loadMoreEl.classList.add('is-hidden');

  if (!query) return;

  fetchPictures(query, page, perPage).then(
    ({ data: { hits, totalHits: dataTotalHits } }) => {
      if (!hits.length) {
        Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
        return;
      }
      Notify.success(`Hooray! We found ${dataTotalHits} images.`);
      loadMoreEl.classList.remove('is-hidden');
      totalHits = dataTotalHits;
      renderMarkup(hits);
    }
  );
};

const loadMoreHandler = () => {
  const totalPages = Math.ceil(totalHits / perPage);
  page += 1;

  if (page > totalPages) {
    Notify.failure(
      "We're sorry, but you've reached the end of search results."
    );
    loadMoreEl.classList.add('is-hidden');
    return;
  }

  fetchPictures(query, page, perPage).then(({ data: { hits, totalHits } }) => {
    renderMarkup(hits);
  });
};

formEl.addEventListener('submit', submitHandler);
loadMoreEl.addEventListener('click', loadMoreHandler);

const clearMarkup = () => {
  galleryEl.innerHTML = '';
};

const renderMarkup = data => {
  galleryEl.insertAdjacentHTML('beforeend', createGalleryMarkup(data));
  lightbox.refresh();
};

const createGalleryMarkup = data => {
  return data
    .map(
      ({
        webformatURL,
        tags,
        likes,
        views,
        comments,
        downloads,
        largeImageURL,
      }) =>
        `
        <a class="gallery__link" href="${largeImageURL}">
          <div class="gallery__item">
            <img class="gallery-item__img" src="${webformatURL}" alt="${tags}" loading="lazy" />
            <div class="gallery-item__info">
              <p class="info__value"><b>Likes</b>${likes}</p>
              <p class="info__value"><b>Views</b>${views}</p>
              <p class="info__value"><b>Comments</b>${comments}</p>
              <p class="info__value"><b>Downloads</b>${downloads}</p>
            </div>
          </div>
        </a>
        `
    )
    .join('');
};
