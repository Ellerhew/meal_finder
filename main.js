'use strict';

const randomBtn = document.querySelector(".random-icon");
const searchBtn = document.querySelector(".search-icon");
const searchBox = document.querySelector(".search-input");
const searchResult = document.querySelector(".searchResult");
const searchResultList = document.querySelector(".searchResult-images");
const mealDescription = document.querySelector(".meal-description");
const mealName = document.querySelector(".meal-name");
const mealImage = document.querySelector(".meal-image");
const mealKeyword = document.querySelector(".meal-keyword");
const mealRecipe = document.querySelector(".meal-recipe");
const ingredientList = document.querySelector(".ingredientList");

let searched;

async function fetchRandomMeal() {
  const res = await fetch('https://www.themealdb.com/api/json/v1/1/random.php')
  const data = await res.json();

  return data.meals[0];
}

function displayMeal(array) {
  ingredientList.innerHTML = '';
  mealDescription.style.display = 'block';
  mealName.innerHTML = `${array.strMeal}`;
  mealImage.src = array.strMealThumb;
  mealKeyword.innerHTML = `<p>${array.strCategory}</p>
  <p>${array.strArea}</p>`
  mealRecipe.innerHTML = array.strInstructions;
  const mealArray = Object.values(array);
  const ingredient = mealArray.splice(9,20);
  const measure = mealArray.splice(9, 20);
  let i;
  for (i=0; i<ingredient.length; i++) {
    if (ingredient[i] != "") {
    const list = document.createElement('li');
    list.innerHTML = `${ingredient[i]}-${measure[i]}`
    ingredientList.appendChild(list);
    list.className = 'ingredientItem';
  }}
}

async function displayImageList(searchedValue) {
  searchResult.innerHTML = ``;
  searchResult.style.display = 'block';
  searchResultList.style.display = 'grid';
  searchResultList.innerHTML = '';
  const allResults = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${searchedValue}`);
  const res = await allResults.json();
  const dataArray = res.meals;
  if (dataArray === null) {
    searchResult.innerHTML = `There is no result for '${searchedValue}'. Try again.`
  } else {
    searchResult.innerHTML = `Search results for '<span class="search-word">${searchedValue}</span>' :`
    dataArray.forEach(item => {
      const itemImg = item.strMealThumb;
      const list = document.createElement('li');
      list.className = 'list-image';
      searchResultList.appendChild(list);
      list.innerHTML = `<img src="${itemImg}"><span class="imageSpan" id="${item.idMeal}">${item.strMeal}</span>`;
    })
    searchResultList.addEventListener('click', async (e) => {
      const getInfo = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${e.target.id}`);
      const response = await getInfo.json();
      const clickedMenu = response.meals[0];
      displayMeal(clickedMenu);
    })
    }
  }


randomBtn.addEventListener("click", async () => {
  searchBox.value = '';
  searchResult.style.display = 'none';
  searchResultList.style.display = 'none';
  const mealInfoArray = await fetchRandomMeal();
  await displayMeal(mealInfoArray);
})

searchBtn.addEventListener("click", () => {
  searched = searchBox.value;
  if (searched) {
    displayImageList(searched);
  } else {
    alert('Please enter a search term');
  }
  mealDescription.style.display = 'none';
})

searchBox.addEventListener('keypress', (e) => {
  if (e.keyCode === 13) {
    searched = searchBox.value;
    if (searched) {
    displayImageList(searched);
    } else {
    alert('Please enter a search term');
    }
    mealDescription.style.display = 'none';
  }
})
