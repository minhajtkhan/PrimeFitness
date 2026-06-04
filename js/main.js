/* ============================================================
   PRIME FITNESS CLUB — CORE INTERACTIVE JAVASCRIPT
   Clean Light Theme: Lightbox, Form Validation, FAQ, Animations
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  initNavbarScroll();
  initScrollReveal();
  initFaqAccordion();
  initLightbox();
  initEnquiryValidation();
});

/* ── STICKY NAVBAR CLASS TOGGLE ── */
function initNavbarScroll() {
  const navbar = document.querySelector('.prime-navbar');
  if (!navbar) return;

  const handleScroll = () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll);
  handleScroll(); // Trigger on load in case page starts scrolled
}

/* ── SCROLL REVEAL EFFECT ── */
function initScrollReveal() {
  const reveals = document.querySelectorAll('.reveal');
  if (reveals.length === 0) return;

  const revealOnScroll = () => {
    const triggerBottom = window.innerHeight * 0.9;
    reveals.forEach(el => {
      const top = el.getBoundingClientRect().top;
      if (top < triggerBottom) {
        el.classList.add('visible');
      }
    });
  };

  window.addEventListener('scroll', revealOnScroll);
  revealOnScroll(); // Run immediately
}

/* ── CUSTOM ACCORDION (FAQ) ── */
function initFaqAccordion() {
  const questions = document.querySelectorAll('.faq-question');
  questions.forEach(q => {
    q.addEventListener('click', () => {
      const answer = q.nextElementSibling;
      const isOpen = answer.classList.contains('open');

      // Close all other open answers
      document.querySelectorAll('.faq-answer').forEach(ans => {
        ans.classList.remove('open');
        ans.style.maxHeight = null;
        ans.previousElementSibling.setAttribute('aria-expanded', 'false');
      });

      if (!isOpen) {
        answer.classList.add('open');
        answer.style.maxHeight = answer.scrollHeight + 'px';
        q.setAttribute('aria-expanded', 'true');
      }
    });
  });
}

/* ── LIGHTBOX (GALLERY) ── */
function initLightbox() {
  const galleryItems = document.querySelectorAll('.gallery-item');
  if (galleryItems.length === 0) return;

  // Create Lightbox DOM structure if not exists
  let lightbox = document.getElementById('lightbox');
  if (!lightbox) {
    lightbox = document.createElement('div');
    lightbox.id = 'lightbox';
    lightbox.className = 'lightbox-overlay';
    lightbox.innerHTML = `
      <button class="lightbox-close" aria-label="Close Lightbox">&times;</button>
      <img alt="Enlarged Preview" class="lightbox-img">
    `;
    document.body.appendChild(lightbox);
  }

  const lightboxImg = lightbox.querySelector('.lightbox-img');
  const closeBtn = lightbox.querySelector('.lightbox-close');

  galleryItems.forEach(item => {
    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      if (img) {
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden'; // Lock scrolling
      }
    });
  });

  const closeLightbox = () => {
    lightbox.classList.remove('active');
    document.body.style.overflow = ''; // Unlock scrolling
  };

  closeBtn.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
      closeLightbox();
    }
  });

  // Handle escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.classList.contains('active')) {
      closeLightbox();
    }
  });
}

/* ── FORM VALIDATION & SUCCESS POPUP ── */
function initEnquiryValidation() {
  const form = document.getElementById('enquiry-form');
  if (!form) return;

  const fields = {
    name: {
      el: document.getElementById('form-name'),
      err: document.getElementById('error-name'),
      validate: (v) => v.trim().length >= 2 || 'Name must be at least 2 characters.'
    },
    email: {
      el: document.getElementById('form-email'),
      err: document.getElementById('error-email'),
      validate: (v) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(v.trim()) || 'Please enter a valid email address.';
      }
    },
    phone: {
      el: document.getElementById('form-phone'),
      err: document.getElementById('error-phone'),
      validate: (v) => {
        const clean = v.replace(/\D/g, '');
        return clean.length >= 7 || 'Please enter a valid phone number.';
      }
    },
    service: {
      el: document.getElementById('form-service'),
      err: document.getElementById('error-service'),
      validate: (v) => v !== '' || 'Please select a fitness program.'
    },
    message: {
      el: document.getElementById('form-message'),
      err: document.getElementById('error-message'),
      validate: (v) => v.trim().length >= 10 || 'Message must be at least 10 characters.'
    }
  };

  // Live input validation listeners
  Object.keys(fields).forEach(key => {
    const field = fields[key];
    if (field.el) {
      field.el.addEventListener('input', () => {
        validateField(field);
      });
      field.el.addEventListener('blur', () => {
        validateField(field);
      });
    }
  });

  function validateField(field) {
    const res = field.validate(field.el.value);
    if (res === true) {
      field.err.classList.remove('visible');
      field.err.textContent = '';
      field.el.classList.remove('border-danger');
      return true;
    } else {
      field.err.classList.add('visible');
      field.err.textContent = res;
      field.el.classList.add('border-danger');
      return false;
    }
  }

  // Handle Submit
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let isAllValid = true;

    Object.keys(fields).forEach(key => {
      const isValid = validateField(fields[key]);
      if (!isValid) isAllValid = false;
    });

    if (isAllValid) {
      showSuccessPopup();
      form.reset();
    }
  });

  function showSuccessPopup() {
    let popup = document.getElementById('success-popup');
    if (!popup) {
      popup = document.createElement('div');
      popup.id = 'success-popup';
      popup.className = 'success-popup';
      popup.innerHTML = `
        <div class="success-icon">✅</div>
        <h3 class="mb-3 text-primary">Enquiry Submitted</h3>
        <p class="text-muted-custom mb-4">Thank you for contacting Prime Fitness Club. A membership representative will connect with you shortly.</p>
        <button class="btn-neon btn-neon-blue" id="popup-close-btn">Dismiss</button>
      `;
      document.body.appendChild(popup);
    }

    popup.classList.add('active');

    const dismissBtn = popup.querySelector('#popup-close-btn');
    const dismissPopup = () => {
      popup.classList.remove('active');
    };

    dismissBtn.addEventListener('click', dismissPopup);
  }
}
