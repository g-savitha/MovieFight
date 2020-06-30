const fetchData = async (searchTerm) => {
  const response = await axios.get("http://www.omdbapi.com", {
    params: {
      apikey: "a79da565",
      s: searchTerm,
    },
  });
  return response.data.Search;
};

const input = document.querySelector("input");

const onInput = async (event) => {
  const movies = await fetchData(event.target.value);
  console.log(movies);
};
//debounce it only when input changes
input.addEventListener("input", debounce(onInput, 500));
