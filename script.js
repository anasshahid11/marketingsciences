// ===== COUNTRY CODE SELECTOR =====
const phoneInput = document.querySelector("#phone");
let iti;

// Initialize country code selector
if (phoneInput) {
    iti = window.intlTelInput(phoneInput, {
        initialCountry: "auto",
        geoIpLookup: function(callback) {
            fetch('https://ipapi.co/json/')
                .then(res => res.json())
                .then(data => callback(data.country_code))
                .catch(() => callback('us'));
        },
        separateDialCode: true,
        preferredCountries: ['us', 'gb', 'ca', 'au', 'pk', 'in', 'ae'],
        utilsScript: "https://cdn.jsdelivr.net/npm/intl-tel-input@19.5.6/build/js/utils.js"
    });
}

// ===== MOUSE GLOW EFFECT =====
const mouseGlow = document.querySelector('.mouse-glow');
const starsContainer = document.querySelector('.stars-container');

let mouseX = 0;
let mouseY = 0;
let glowX = 0;
let glowY = 0;
let mouseTimeout;
let touchStartX = 0;
let touchEndX = 0;

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    clearTimeout(mouseTimeout);
    mouseGlow.style.opacity = '0.6';
    mouseTimeout = setTimeout(() => {
        mouseGlow.style.opacity = '0';
    }, 2000);
    
    if (Math.random() > 0.9) {
        createStar(e.clientX, e.clientY);
    }
});

document.addEventListener('mouseleave', () => {
    mouseGlow.style.opacity = '0';
});

function animateGlow() {
    glowX += (mouseX - glowX) * 0.1;
    glowY += (mouseY - glowY) * 0.1;
    
    mouseGlow.style.left = `${glowX - 200}px`;
    mouseGlow.style.top = `${glowY - 200}px`;
    
    requestAnimationFrame(animateGlow);
}
animateGlow();

function createStar(x, y) {
    const star = document.createElement('div');
    star.className = 'star';
    
    const offsetX = (Math.random() - 0.5) * 50;
    const offsetY = (Math.random() - 0.5) * 50;
    
    star.style.left = `${x + offsetX}px`;
    star.style.top = `${y + offsetY}px`;
    
    starsContainer.appendChild(star);
    
    setTimeout(() => {
        star.remove();
    }, 1000);
}

// ===== SMOOTH SCROLLING =====
function scrollToContact() {
    const contactSection = document.getElementById('contact');
    contactSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href').substring(1);
        const targetSection = document.getElementById(targetId);
        targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
});

// ===== 3D CAROUSEL ROTATIONS =====
let nicheRotation = 0;
let platformRotation = 0;
let whyRotation = 0;

function rotateNiches(direction) {
    nicheRotation -= direction * 120;
    const carousel = document.querySelector('.carousel-3d');
    if (carousel) {
        carousel.style.transform = `rotateY(${nicheRotation}deg)`;
        resetAutoRotation(carousel);
    }
}

function rotatePlatforms(direction) {
    platformRotation -= direction * 120;
    const carousel = document.querySelector('.platforms-carousel');
    if (carousel) {
        carousel.style.transform = `rotateY(${platformRotation}deg)`;
        resetAutoRotation(carousel);
    }
}

function rotateWhy(direction) {
    whyRotation -= direction * 90;
    const carousel = document.querySelector('.why-carousel');
    if (carousel) {
        carousel.style.transform = `rotateY(${whyRotation}deg)`;
        resetAutoRotation(carousel);
    }
}

function handleSwipe(rotateFunction) {
    if (touchEndX < touchStartX - 50) {
        // Swipe left - go to next
        rotateFunction(1);
    }
    if (touchEndX > touchStartX + 50) {
        // Swipe right - go to previous
        rotateFunction(-1);
    }
}

// Enable swipe on all carousels
const carouselsInitialized = new Set();

function handleCarouselSwipe(carouselElement, rotateFunction) {
    if (!carouselElement || carouselsInitialized.has(carouselElement)) return;
    
    carouselElement.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
        resetAutoRotation(carouselElement);
    }, {passive: true});

    carouselElement.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe(rotateFunction);
    }, {passive: true});
    
    carouselsInitialized.add(carouselElement);
}

// ===== AUTO-ROTATION SYSTEM =====
const intervals = {};

function resetAutoRotation(element) {
    const section = element.closest('section');
    if (!section) return;
    const id = section.id || section.className;
    
    if (intervals[id]) {
        clearInterval(intervals[id]);
        let rotateFn;
        if (section.classList.contains('specialization-section')) rotateFn = rotateNiches;
        else if (section.classList.contains('platforms-section')) rotateFn = rotatePlatforms;
        else if (section.classList.contains('why-us-section')) rotateFn = rotateWhy;
        
        if (rotateFn) {
            // We set a flag to avoid infinite recursion if rotateFn calls resetAutoRotation
            if (!element.isResetting) {
                element.isResetting = true;
                intervals[id] = setInterval(() => rotateFn(1), 2000);
                setTimeout(() => { element.isResetting = false; }, 100);
            }
        }
    }
}

// Initialize carousels
function initCarousels() {
    handleCarouselSwipe(document.querySelector('.carousel-3d'), rotateNiches);
    handleCarouselSwipe(document.querySelector('.platforms-carousel'), rotatePlatforms);
    handleCarouselSwipe(document.querySelector('.why-carousel'), rotateWhy);
    
    // Setup Auto-rotation
    setupAutoRotation();
}

function setupAutoRotation() {
    const observerOptions = { threshold: 0.3 };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const id = entry.target.id || entry.target.className;
            
            if (entry.isIntersecting) {
                if (!intervals[id]) {
                    let rotateFn;
                    if (entry.target.classList.contains('specialization-section')) rotateFn = rotateNiches;
                    else if (entry.target.classList.contains('platforms-section')) rotateFn = rotatePlatforms;
                    else if (entry.target.classList.contains('why-us-section')) rotateFn = rotateWhy;
                    
                    if (rotateFn) {
                        intervals[id] = setInterval(() => rotateFn(1), 2000);
                    }
                }
            } else {
                if (intervals[id]) {
                    clearInterval(intervals[id]);
                    delete intervals[id];
                }
            }
        });
    }, observerOptions);
    
    document.querySelectorAll('.specialization-section, .platforms-section, .why-us-section').forEach(section => {
        observer.observe(section);
    });
}

// Initialize on load
initCarousels();

// Reinitialize on window resize (only if new elements appear, but here we just ensure listeners are there)
window.addEventListener('resize', () => {
    initCarousels();
});

// ===== GLOWING BORDER EFFECT ON CARDS =====
const glowCards = document.querySelectorAll('.glow-card');

glowCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const cardGlow = card.querySelector('.card-glow');
        if (cardGlow) {
            cardGlow.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(184, 255, 60, 0.6), transparent 40%)`;
        }
    });
    
    card.addEventListener('mouseleave', () => {
        const cardGlow = card.querySelector('.card-glow');
        if (cardGlow) {
            cardGlow.style.background = 'radial-gradient(circle, rgba(184, 255, 60, 0.5), transparent 40%)';
        }
    });
});

// ===== HEADER SCROLL EFFECT =====
let lastScroll = 0;
const header = document.querySelector('.floating-header');
const backToTopBtn = document.getElementById('backToTop');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        if (currentScroll > lastScroll) {
            header.style.transform = 'translateX(-50%) translateY(-150%)';
        } else {
            header.style.transform = 'translateX(-50%) translateY(0)';
        }
    } else {
        header.style.transform = 'translateX(-50%) translateY(0)';
    }
    
    if (currentScroll > 500) {
        backToTopBtn.classList.add('visible');
    } else {
        backToTopBtn.classList.remove('visible');
    }
    
    lastScroll = currentScroll;
});

backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// ===== PARALLAX EFFECT ON ORB BACKGROUNDS =====
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const orbs = document.querySelectorAll('.orb');
    
    orbs.forEach((orb, index) => {
        const speed = 0.5 + (index * 0.2);
        orb.style.transform = `translateY(${scrolled * speed}px)`;
    });
});

// ===== FORM SUBMISSION =====
const contactForm = document.getElementById('contact-form');
const formError = document.getElementById('form-error');

function showError(message) {
    formError.textContent = message;
    formError.classList.add('show');
    
    setTimeout(() => {
        formError.classList.remove('show');
    }, 5000);
}

function hideError() {
    formError.classList.remove('show');
}

contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    hideError();
    
    if (iti) {
        if (!iti.isValidNumber()) {
            showError('❌ Please enter a valid phone number with the correct country code');
            
            phoneInput.style.borderColor = 'rgba(255, 80, 80, 0.5)';
            phoneInput.style.boxShadow = '0 0 20px rgba(255, 80, 80, 0.3)';
            
            setTimeout(() => {
                phoneInput.style.borderColor = '';
                phoneInput.style.boxShadow = '';
            }, 3000);
            
            return;
        }
        
        const fullNumber = iti.getNumber();
        document.getElementById('phone-full').value = fullNumber;
    }
    
    const submitBtn = contactForm.querySelector('.form-submit');
    const originalText = submitBtn.querySelector('.btn-text').textContent;
    
    submitBtn.querySelector('.btn-text').textContent = 'Sending...';
    submitBtn.disabled = true;
    
    const formData = new FormData(contactForm);
    const data = Object.fromEntries(formData.entries());
    
    fetch(contactForm.action, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    })
    .then(response => {
        if (response.ok) {
            submitBtn.querySelector('.btn-text').textContent = '✓ Message Sent!';
            contactForm.reset();
            if (iti) iti.setNumber('');
            setTimeout(() => {
                submitBtn.querySelector('.btn-text').textContent = originalText;
                submitBtn.disabled = false;
            }, 3000);
        } else {
            throw new Error('Form submission failed');
        }
    })
    .catch(error => {
        showError('❌ Failed to send message. Please try again.');
        submitBtn.querySelector('.btn-text').textContent = originalText;
        submitBtn.disabled = false;
    });
});

// ===== VIDEO PLACEHOLDER INTERACTION =====
const videoContainer = document.querySelector('.video-container');
if (videoContainer) {
    videoContainer.addEventListener('click', () => {
        alert('Video player would open here. Replace this with your actual CEO message video embed.');
    });
}

// ===== PLATFORM CARDS BORDER GLOW EXTENSION =====
const platformCards = document.querySelectorAll('.platform-card');
platformCards.forEach((card, index) => {
    card.addEventListener('mouseenter', () => {
        if (platformCards[index - 1]) {
            platformCards[index - 1].style.boxShadow = '0 10px 40px rgba(184, 255, 60, 0.1)';
        }
        if (platformCards[index + 1]) {
            platformCards[index + 1].style.boxShadow = '0 10px 40px rgba(184, 255, 60, 0.1)';
        }
    });
    
    card.addEventListener('mouseleave', () => {
        platformCards.forEach(c => {
            if (c !== card) {
                c.style.boxShadow = '';
            }
        });
    });
});

// ===== SMOOTH PAGE LOAD ANIMATION =====
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    }, 100);
});

console.log('🚀 Marketing Sciences Website Loaded');
console.log('✨ Glass Morphism Theme Active');
console.log('💚 Parrot Green + Deep Black Palette');
