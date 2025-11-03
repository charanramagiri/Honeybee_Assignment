// Adjust API_BASE if backend runs on different host/port
const API_BASE = 'http://localhost:4000';

const form = document.getElementById('reg-form');
const msg = document.getElementById('msg');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  msg.textContent = '';
  const fullName = document.getElementById('fullName').value.trim();
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;
  const phone = document.getElementById('phone').value.trim();

  // Basic client-side validation (helps user)
  if (!fullName || !email || !password || !phone) {
    msg.style.color = 'crimson';
    msg.textContent = 'Please fill all fields.';
    return;
  }
  if (password.length < 6) {
    msg.style.color = 'crimson';
    msg.textContent = 'Password must be at least 6 characters.';
    return;
  }

  try {
    const res = await fetch(API_BASE + '/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fullName, email, password, phone })
    });

    const data = await res.json();
    if (!res.ok) {
      msg.style.color = 'crimson';
      msg.textContent = data.error || 'Registration failed';
      return;
    }

    msg.style.color = 'green';
    msg.textContent = 'Registration successful! You can login now.';
    form.reset();
  } catch (err) {
    msg.style.color = 'crimson';
    msg.textContent = 'Unable to contact server.';
    console.error(err);
  }
});
