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
let timeoutId;
const onInput = (event) => {
  //main logic to get the delayed input
  if (timeoutId) {
    clearTimeout(timeoutId);
  }
  timeoutId = setTimeout(() => {
    fetchData(event.target.value);
  }, 500);
};
input.addEventListener("input", onInput);
