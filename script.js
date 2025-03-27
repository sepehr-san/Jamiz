// Elements
const writeBtn = document.getElementById('writeBtn');
const modal = document.getElementById('modal');
const closeModal = document.getElementById('closeModal');
const noteForm = document.getElementById('noteForm');
const cardsContainer = document.getElementById('cardsContainer');

// Show modal when "Write" button is clicked.
writeBtn.addEventListener('click', () => {
  modal.style.display = 'block';
});

// Hide modal when the close icon is clicked.
closeModal.addEventListener('click', () => {
  modal.style.display = 'none';
});

// Hide modal if user clicks outside the modal content.
window.addEventListener('click', (event) => {
  if (event.target === modal) {
    modal.style.display = 'none';
  }
});

// Function to render cards in the DOM.
function renderCards(cards) {
  cardsContainer.innerHTML = '';
  cards.forEach(card => {
    const cardDiv = document.createElement('div');
    cardDiv.className = 'card';
    cardDiv.innerHTML = `<strong>${card.name}</strong><br>${card.note}`;
    cardsContainer.appendChild(cardDiv);
  });
}

// Load cards from the server.
function loadCards() {
  fetch('/cards')
    .then(res => res.json())
    .then(data => {
      renderCards(data);
    })
    .catch(err => console.error('Error loading cards:', err));
}

// Handle form submission.
noteForm.addEventListener('submit', (event) => {
  event.preventDefault();
  
  const name = document.getElementById('name').value.trim();
  const note = document.getElementById('note').value.trim();
  
  if (!name || !note) {
    alert('Both fields are required!');
    return;
  }
  
  // Send POST request to add a new card.
  fetch('/cards', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ name, note })
  })
  .then(res => res.json())
  .then(response => {
    if (response.success) {
      // Clear the form.
      noteForm.reset();
      modal.style.display = 'none';
      // Reload cards.
      loadCards();
    } else {
      alert('Error adding card: ' + response.error);
    }
  })
  .catch(err => console.error('Error submitting card:', err));
});
// Footer popup functionality
const footerText = document.getElementById('footerText');

footerText.addEventListener('click', () => {
  showToast('حوصله‌ام سر رفته بود می‌خواستم ببینم بقیه چی دوست دارن بگن');
});
// Dont click popup
cardsContainer.addEventListener('click', (event) => {
  if (event.target.classList.contains('card')) {
    showToast('دست به اینا نزنی‌وا');
  }
});
// Jamiz Popup
const jamiz = document.getElementById('jamizHeader');
jamiz.addEventListener('click', () => {
  showToast('لطفا دماغ نچسبانید');
});
// toast
function showToast(message) {
  const toast = document.createElement('div');
  toast.className = 'toast-message';
  toast.innerText = message;
  document.body.appendChild(toast);

  // Trigger fade-in
  setTimeout(() => {
    toast.classList.add('show');
  }, 100);

  // Fade-out and remove after 3 seconds
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 500); // Wait for fade-out to finish before removing
  }, 3000);
}

// Initial load of cards when the page loads.
loadCards();
