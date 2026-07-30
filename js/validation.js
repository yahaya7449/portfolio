const form   = document.getElementById('contact-form');
const status = document.getElementById('form-status');

// Regular expressions
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;  // pragmatic email check
const PHONE_RE = /^\d+$/;                        // digits only

// Small helper: mark a field valid or invalid and toggle its message
function setFieldState(fieldId, isValid) {
  const field = document.getElementById(fieldId);
  if (isValid) {
    field.classList.remove('invalid');
  } else {
    field.classList.add('invalid');
  }
  return isValid;
}

// Validate a single rule and return true/false
function validateName() {
  const value = document.getElementById('name').value.trim();
  return setFieldState('field-name', value !== '');
}

function validateEmail() {
  const value = document.getElementById('email').value.trim();
  return setFieldState('field-email', value !== '' && EMAIL_RE.test(value));
}

function validatePhone() {
  const value = document.getElementById('phone').value.trim();
  return setFieldState('field-phone', value !== '' && PHONE_RE.test(value));
}

function validateMessage() {
  const value = document.getElementById('message').value.trim();
  return setFieldState('field-message', value !== '');
}

// Show a status banner under the form
function showStatus(message, ok) {
  status.textContent = message;
  status.className = 'form-status show ' + (ok ? 'ok' : 'bad');
}

//  Submit handler 
form.addEventListener('submit', function (e) {
  e.preventDefault();  // stop the browser from reloading / submitting

  // run every check (call all four so every error shows at once)
  const nameOk    = validateName();
  const emailOk   = validateEmail();
  const phoneOk   = validatePhone();
  const messageOk = validateMessage();

  const allValid = nameOk && emailOk && phoneOk && messageOk;

  if (allValid) {
    showStatus('Thanks — your message has been validated and is ready to send.', true);
    form.reset();
  } else {
    showStatus('Please fix the highlighted fields and try again.', false);
  }
});

// Live feedback: clear a field's error as the user fixes it 
document.getElementById('name').addEventListener('input', validateName);

document.getElementById('email').addEventListener('input', validateEmail);
document.getElementById('phone').addEventListener('input', validatePhone);
document.getElementById('message').addEventListener('input', validateMessage);
