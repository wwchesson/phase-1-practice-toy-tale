let addToy = false;
let toyCollection = document.querySelector("#toy-collection")

document.addEventListener("DOMContentLoaded", () => {
  getToys();
  postToys();
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    toyFormContainer.addEventListener('submit', (e) => {
        e.preventDefault()
        let nameToy = e.target.childNodes[3].value;
        let imageToy = e.target.childNodes[7].value;
        postToys(nameToy, imageToy)
        console.log(e.target.childNodes[7].value)
    })
    if (addToy) {
      toyFormContainer.style.display = "block"
      
      
    } else {
      toyFormContainer.style.display = "none";
    }
  });
});

  function postToys(name, url) {
    fetch ("http://localhost:3000/toys", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        "Accept": 'application/json'
      },
      body: JSON.stringify({
        "name": name,
        "image": url,
        "likes": 0      
      })
    })
     .then(r => r.json())
     .then((toyobj) => {
      let newtoy = renderToys(toyobj)
      toyCollection.append(newtoy)
    })
  }

function getToys () {
  fetch ("http://localhost:3000/toys")
  .then(r => r.json())
  .then(toyData => toyData.forEach(toy => renderToys(toy)))
}

function renderToys(toy) {
  let h2 = document.createElement('h2')
  h2.innerText = toy.name

  let img = document.createElement('img')
  img.setAttribute('src', toy.image)
  img.setAttribute("class", 'toy-avatar')

  let p = document.createElement('p')
  p.innerText = `${toy.likes} likes`

  let btn = document.createElement('button')
  btn.setAttribute('class', 'like-btn')
  btn.setAttribute('id', toy.id)
  btn.innerText = "like"
  btn.addEventListener('click', (e) => {
    increaseLikes(e)
  })

  let newDiv = document.createElement('div')
  newDiv.setAttribute("class", "card")
  newDiv.append(h2, img, p, btn)
  // console.log(newDiv)
  toyCollection.append(newDiv)
}

function increaseLikes(e) {
   e.preventDefault()
   let numberLikes = parseInt(e.target.previousElementSibling.innerText, 10) 

  fetch(`http://localhost:3000/toys/${e.target.id}`, {
      method: "PATCH",
      headers: {
        'Content-Type': 'application/json',
        "Accept": 'application/json'
      },
     body: JSON.stringify({
        "likes": `${numberLikes += 1}`
      })
  })
   .then(r => r.json())
   .then((toyObj) => {
     e.target.previousElementSibling.innerText = `${toyObj.likes} likes`
   })
}
