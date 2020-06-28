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
//this logic makes a request for every keypress -> this is bad
input.addEventListener("input", (event) => {
  //capture the input and send it as a search term
  fetchData(event.target.value);
});
