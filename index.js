const fetchData = async (searchTerm) => {
  const response = await axios.get("http://www.omdbapi.com", {
    params: {
      apikey: "a79da565",
      s: searchTerm,
    },
  });
  if (response.data.Error) {
    return [];
  }
  return response.data.Search;
};

const root = document.querySelector(".autocomplete");
root.innerHTML = `
<label for="search"><b>Search for a movie</b></label>
<input type="text" class="input" />
<div class="dropdown">
  <div class="dropdown-menu">
    <div class="dropdown-content results"></div>
  </div>
</div>
`;

const input = document.querySelector("input");
const dropdown = document.querySelector(".dropdown");
const resultsWrapper = document.querySelector(".results");

const onInput = async (event) => {
  const movies = await fetchData(event.target.value);
  //handling empty responses
  if (!movies.length) {
    dropdown.classList.remove("is-active");
    return;
  }
  //clears data after search, instead of appending to previous list
  resultsWrapper.innerHTML = "";
  dropdown.classList.add("is-active");

  for (let movie of movies) {
    const option = document.createElement("a");
    //some images dont have posters.
    const imgSrc = movie.Poster === "N/A" ? "" : movie.Poster;
    option.classList.add("dropdown-item");
    option.innerHTML = `
    <img src = "${imgSrc}" />${movie.Title}
    `;
    option.addEventListener("click", () => {
      dropdown.classList.remove("is-active");
      input.value = movie.Title;
      onMovieSelect(movie);
    });
    resultsWrapper.appendChild(option);
  }
};
input.addEventListener("input", debounce(onInput, 500));
//close the dropdown by clicking anywhere on screen
//other than dropdown itself
document.addEventListener("click", (event) => {
  if (!root.contains(event.target)) {
    dropdown.classList.remove("is-active");
  }
});
//show statisticsof a movie when selected from dropdown
const onMovieSelect = async (movie) => {
  const response = await axios.get("http://www.omdbapi.com", {
    params: {
      apikey: "a79da565",
      i: movie.imdbID,
    },
  });
  document.querySelector("#summary").innerHTML = movieTemplate(response.data);
};

const movieTemplate = (movieDetail) => {
  return `
  <article class="media">
  <figure class="media-left">
    <p class="image"><img src="${movieDetail.Poster}"></p>
  </figure>
  <div class="media-content">
    <div class="content">
      <h1>${movieDetail.Title}</h1>
      <h4>${movieDetail.Genre}</h4>
      <p>${movieDetail.Plot}</p>
    </div>
  </div>
</article>
<article class="notification is-primary">
  <p class="title">${movieDetail.Awards}</p>
  <p class="subtitle">Awards</p>
</article>
<article class="notification is-primary">
  <p class="title">${movieDetail.BoxOffice}</p>
  <p class="subtitle">Box Office</p>
</article>
<article class="notification is-primary">
  <p class="title">${movieDetail.Metascore}</p>
  <p class="subtitle">Metascore</p>
</article>
<article class="notification is-primary">
  <p class="title">${movieDetail.imdbRating}</p>
  <p class="subtitle">IMDB Rating</p>
</article>
<article class="notification is-primary">
  <p class="title">${movieDetail.imdbVotes}</p>
  <p class="subtitle">IMDB Votes</p>
</article>
  `;
};
