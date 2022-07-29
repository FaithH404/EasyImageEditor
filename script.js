const fileInput = document.querySelector(".file-input"),
  filterOptions = document.querySelectorAll(".filter button"),
  filterName = document.querySelector(".filter-info .name"),
  filterValue = document.querySelector(".filter-info .value"),
  filterSlider = document.querySelector(".slider input"),
  rotateOptions = document.querySelectorAll(".rotate button"),
  previewImg = document.querySelector(".preview-img img"),
  resetFilterBtn = document.querySelector(".reset-filter"),
  chooseImgBtn = document.querySelector(".choose-img"),
  saveImgBtn = document.querySelector(".save-img");

let brightness = 100,
  saturation = 100,
  inversion = 0,
  grayscale = 0;
let rotate = 0,
  fliphorizontal = 1,
  flipvertical = 1;

const applyFilters = () => {
  previewImg.style.transform = `rotate(${rotate}deg) scaleY(${fliphorizontal}) scaleX(${flipvertical})`;
  previewImg.style.filter = `brightness(${brightness}%) saturate(${saturation}%) invert(${inversion}%) grayscale(${grayscale}%)`;
};

const loadImage = () => {
  let file = fileInput.files[0]; // User gets the file from the input
  if (!file) return; // return if user hasn't chosen a file
  previewImg.src = URL.createObjectURL(file); // passing file as preview img src
  previewImg.addEventListener("load", () => {
    resetFilterBtn.click(); // reset filter to default
    document.querySelector(".container").classList.remove("disable");
  });
};

filterOptions.forEach((option) => {
  option.addEventListener("click", () => {
    // adding event listener to each filter option
    document.querySelector(".filter .active").classList.remove("active");
    option.classList.add("active");
    filterName.innerText = option.innerText;

    if (option.id === "brightness") {
      filterSlider.max = "200";
      filterSlider.value = `${brightness}`;
      filterValue.innerText = `${brightness}%`;
    } else if (option.id === "saturation") {
      filterSlider.max = "200";
      filterSlider.value = `${saturation}`;
      filterValue.innerText = `${saturation}%`;
    } else if (option.id === "inversion") {
      filterSlider.max = "100";
      filterSlider.value = `${inversion}`;
      filterValue.innerText = `${inversion}%`;
    } else {
      filterSlider.max = "100";
      filterSlider.value = `${grayscale}`;
      filterValue.innerText = `${grayscale}%`;
    }
  });
});

const updateFilter = () => {
  filterValue.innerText = `${filterSlider.value}%`;
  const selectedFilter = document.querySelector(".filter .active");

  if (selectedFilter.id === "brightness") {
    brightness = filterSlider.value;
  } else if (selectedFilter.id === "saturation") {
    saturation = filterSlider.value;
  } else if (selectedFilter.id === "inversion") {
    inversion = filterSlider.value;
  } else {
    grayscale = filterSlider.value;
  }
  applyFilters();
};

rotateOptions.forEach((option) => {
  option.addEventListener("click", () => {
    // adding event listener to each rotate option
    if (option.id === "left") {
      rotate -= 90; // rotate left if clicked
    } else if (option.id === "right") {
      rotate += 90; // rotate right if clicked
    } else if (option.id === "horizontal") {
      fliphorizontal = fliphorizontal === 1 ? -1 : 1; // flip horizontal if clicked
    } else {
      flipvertical = flipvertical === 1 ? -1 : 1; // flip vertical if clicked
    }
    applyFilters();
  });
});

const resetFilter = () => {
  // Reset all filters to default
  brightness = 100;
  saturation = 100;
  inversion = 0;
  grayscale = 0;
  rotate = 0;
  fliphorizontal = 1;
  flipvertical = 1;
  filterOptions[0].click();
  applyFilters();
};

const saveImage = () => {
  const canvas = document.createElement("canvas"); // create canvas
  const ctx = canvas.getContext("2d"); // get context from canvas
  canvas.width = previewImg.naturalWidth; // set canvas width to preview img width
  canvas.height = previewImg.naturalHeight; // set canvas height to preview img height

  // aplly filter to canvas
  ctx.filter = `brightness(${brightness}%) saturate(${saturation}%) invert(${inversion}%) grayscale(${grayscale}%)`;
  ctx.translate(canvas.width / 2, canvas.height / 2); // translate canvas to center
  if (rotate !== 0) {
    ctx.rotate((rotate * Math.PI) / 180);
  } // rotate canvas if rotate is not 0
  ctx.scale(flipvertical, fliphorizontal); // flip canvas
  ctx.drawImage(previewImg, -canvas.width / 2, -canvas.height / 2, canvas.width, canvas.height); // draw preview img to canvas

  const link = document.createElement("a"); // create link
  link.download = "image.png"; // set link download to "image.jpg"
  link.href = canvas.toDataURL(); // set link href to canvas data url
  link.click(); // click link
};

fileInput.addEventListener("change", loadImage);
filterSlider.addEventListener("input", updateFilter);
resetFilterBtn.addEventListener("click", resetFilter);
saveImgBtn.addEventListener("click", saveImage);
chooseImgBtn.addEventListener("click", () => fileInput.click());
