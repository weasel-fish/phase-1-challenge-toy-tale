let addToy = false;

function getInitialToys() {
  fetch('http://localhost:3000/toys')
  .then(data => data.json())
  .then(populateInitialToys)
}

function populateInitialToys(obj) {
  const initialToys = [...obj]
  const collection = document.querySelector('#toy-collection')

  for(toy of initialToys){
    let div = document.createElement('div')
    div.classList.add('card')
    addInfoToCard(div, toy)
    collection.append(div)
  }
}

function addInfoToCard(div, toy) {
  let h2 = document.createElement('h2')
  h2.textContent = toy.name
  div.append(h2)
  
  let img = document.createElement('img')
  img.src = toy.image
  img.className = 'toy-avatar'
  div.append(img)

  let p = document.createElement('p')
  p.textContent = `${toy.likes} Likes`
  div.append(p)

  let button = document.createElement('button')
  button.className = 'like-btn'
  button.id = toy.id
  button.textContent = 'Like <3'
  button.addEventListener('click', increaseLikes)
  div.append(button)
}

function addNewToy() {
  document.querySelector('.add-toy-form').addEventListener('submit', postNewToy)
}

function postNewToy(event) {
  event.preventDefault()
  
  let newToy = {
    name : event.target.name.value,
    image : event.target.image.value,
    likes : 0
  }

  fetch('http://localhost:3000/toys', {
    method: 'POST',
    headers: {
      'Content-Type': "application/json",
      'Accept': "application/json"
    },
    body: JSON.stringify(newToy)
  })
  .then(resp => resp.json())
  .then(toy => {
    let div = document.createElement('div')
    div.classList.add('card')
    addInfoToCard(div, toy)
    document.querySelector('#toy-collection').append(div)
  })
}

function increaseLikes(event) {
  let id = event.target.id
  let p = event.target.previousSibling
  let numLikes = parseInt(p.textContent[0])


  fetch(`http://localhost:3000/toys/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': "application/json",
      'Accept': "application/json"
    },
    body: JSON.stringify({likes: numLikes += 1})
  })
  .then(resp => resp.json())
  .then(toy => {
    p.textContent = `${toy.likes} Likes`
  })
}

function init() {
  getInitialToys()
  addNewToy()
}

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });
  init()
});
