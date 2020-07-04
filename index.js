const autoCompleteConfig = {
  renderOption(movie) {
    const imgSrc = movie.Poster === "N/A" ? "" : movie.Poster;
    return `
    <img src = "${imgSrc}" />${movie.Title} (${movie.Year})
    `;
  },
  inputValue(movie) {
    return movie.Title;
  },
  async fetchData(searchTerm) {
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
  },
};
// left and right summaries
let leftMovie;
let rightMovie;
for (let side of ["left", "right"]) {
  createAutoComplete({
    ...autoCompleteConfig,
    root: document.querySelector(`#${side}-autocomplete`),
    onOptionSelect(movie) {
      document.querySelector(".tutorial").classList.add("is-hidden");
      onMovieSelect(movie, document.querySelector(`#${side}-summary`), side);
    },
  });
}
//show statisticsof a movie when selected from dropdown
const onMovieSelect = async (movie, summaryElement, side) => {
  const response = await axios.get("http://www.omdbapi.com", {
    params: {
      apikey: "a79da565",
      i: movie.imdbID,
    },
  });
  summaryElement.innerHTML = movieTemplate(response.data);
  side === "left" ? (leftMovie = response.data) : (rightMovie = response.data);
  if (leftMovie && rightMovie) {
    runComparison();
  }
};

const runComparison = () => {
  const leftStats = document.querySelectorAll("#left-summary .notification");
  const rightStats = document.querySelectorAll("#right-summary .notification");

  leftStats.forEach((leftStat, i) => {
    const rightStat = rightStats[i];

    //reset values before comparing
    leftStat.classList.add("is-primary");
    leftStat.classList.remove("is-warning");
    rightStat.classList.add("is-primary");
    rightStat.classList.remove("is-warning");

    // to get value of data-* attribute, use dataset property
    const leftSideValue = parseFloat(leftStat.dataset.value);
    const rightSideValue = parseFloat(rightStat.dataset.value);

    if (rightSideValue > leftSideValue) {
      leftStat.classList.remove("is-primary");
      leftStat.classList.add("is-warning");
    } else if (rightSideValue < leftSideValue) {
      rightStat.classList.remove("is-primary");
      rightStat.classList.add("is-warning");
    } else {
      // Handle equal values, N/A value for one or both
      leftStat.classList.add("is-primary");
      leftStat.classList.remove("is-warning");
      rightStat.classList.add("is-primary");
      rightStat.classList.remove("is-warning");
    }
  });
};

const movieTemplate = (movieDetail) => {
  let boxOfficeData = movieDetail.BoxOffice;

  !boxOfficeData ? (boxOfficeData = "N/A") : boxOfficeData;

  let dollars;

  boxOfficeData === "N/A"
    ? (dollars = 0)
    : (dollars = parseInt(boxOfficeData.replace(/\D/g, "")));
  const metaScore = parseInt(movieDetail.Metascore);
  const imdbRating = parseFloat(movieDetail.imdbRating);
  const imdbVotes = parseInt(movieDetail.imdbVotes.replace(/,/g, ""));
  const awards = movieDetail.Awards.split(" ").reduce((prev, word) => {
    const value = parseInt(word);
    if (isNaN(value)) return prev;
    else return prev + value;
  }, 0);

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
<article data-value=${awards} class="notification is-primary">
  <p class="title">${movieDetail.Awards}</p>
  <p class="subtitle">Awards</p>
</article>
<article data-value=${dollars} class="notification is-primary">
  <p class="title">${boxOfficeData}</p>
  <p class="subtitle">Box Office</p>
</article>
<article data-value=${metaScore} class="notification is-primary">
  <p class="title">${movieDetail.Metascore}</p>
  <p class="subtitle">Metascore</p>
</article>
<article data-value=${imdbRating} class="notification is-primary">
  <p class="title">${movieDetail.imdbRating}</p>
  <p class="subtitle">IMDB Rating</p>
</article>
<article data-value=${imdbVotes} class="notification is-primary">
  <p class="title">${movieDetail.imdbVotes}</p>
  <p class="subtitle">IMDB Votes</p>
</article>
  `;
};
