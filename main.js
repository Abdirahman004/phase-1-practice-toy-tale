document.addEventListener('DOMContentLoaded', () => {
    const toyCollection = document.getElementById('toy-collection');
    const addToyForm = document.getElementById('add-toy-form');
  
    // Fetch and display toys
    fetch('http://localhost:3000/toys')
      .then(response => response.json())
      .then(toys => {
        toys.forEach(toy => displayToy(toy));
      });
  
    // Handle new toy form submission
    addToyForm.addEventListener('submit', event => {
      event.preventDefault();
      const formData = new FormData(addToyForm);
      const toyData = {
        name: formData.get('name'),
        image: formData.get('image'),
        likes: 0
      };
  
      fetch('http://localhost:3000/toys', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(toyData)
      })
      .then(response => response.json())
      .then(newToy => {
        displayToy(newToy);
        addToyForm.reset();
      });
    });
  
    // Function to display a toy
    function displayToy(toy) {
      const toyCard = document.createElement('div');
      toyCard.className = 'card';
      toyCard.innerHTML = `
        <h2>${toy.name}</h2>
        <img src="${toy.image}" class="toy-avatar" />
        <p>${toy.likes} Likes</p>
        <button class="like-btn" id="${toy.id}">Like ❤️</button>
      `;
      toyCollection.appendChild(toyCard);
  
      // Add event listener for like button
      const likeButton = toyCard.querySelector('.like-btn');
      likeButton.addEventListener('click', () => {
        const newLikes = toy.likes + 1;
        fetch(`http://localhost:3000/toys/${toy.id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({ likes: newLikes })
        })
        .then(response => response.json())
        .then(updatedToy => {
          toy.likes = updatedToy.likes;
          toyCard.querySelector('p').textContent = `${updatedToy.likes} Likes`;
        });
      });
    }
  });
  