const fetchData = async (searchTerm) => {
  const response = await axios.get("http://www.omdbapi.com", {
    params: {
      apikey: "a79da565",
      s: searchTerm,
    },
  });
  console.log(response.data);
};

const input = document.querySelector("input");

const onInput = (event) => {
  fetchData(event.target.value);
};
//debounce it only when input changes
input.addEventListener("input", debounce(onInput, 500));
