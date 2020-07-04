const createAutoComplete = ({
  root,
  renderOption,
  onOptionSelect,
  inputValue,
  fetchData,
}) => {
  root.innerHTML = `
<label for="search"><b>Search</b></label>
<input type="text" class="input" />
<div class="dropdown">
  <div class="dropdown-menu">
    <div class="dropdown-content results"></div>
  </div>
</div>
`;

  const input = root.querySelector("input");
  const dropdown = root.querySelector(".dropdown");
  const resultsWrapper = root.querySelector(".results");

  const onInput = async (event) => {
    const items = await fetchData(event.target.value);
    //handling empty responses
    if (!items.length) {
      dropdown.classList.remove("is-active");
      return;
    }
    //clears data after search, instead of appending to previous list
    resultsWrapper.innerHTML = "";
    dropdown.classList.add("is-active");

    for (let item of items) {
      const option = document.createElement("a");
      //some images dont have posters.
      option.classList.add("dropdown-item");
      option.innerHTML = renderOption(item);
      option.addEventListener("click", () => {
        dropdown.classList.remove("is-active");
        input.value = inputValue(item);
        onOptionSelect(item);
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
};
