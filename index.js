document.addEventListener('DOMContentLoaded', () => {

    // ---- Dynamic Favicon Logic (Canvas) ----
    function updateFavicon(isLightMode) {
        const favicon = document.getElementById('dynamic-favicon');
        if (!favicon) return;

        if (!isLightMode) {
            favicon.href = "mylogo.png";
            return;
        }

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();
        
        img.crossOrigin = "anonymous"; // Prevents security errors on deployment
        
        img.src = "mylogo.png";
        img.onload = () => {
            canvas.width = img.width;
            canvas.height = img.height;
            
            ctx.filter = 'invert(1) hue-rotate(180deg)';
            ctx.drawImage(img, 0, 0);
            
            favicon.href = canvas.toDataURL('image/png');
        };
    }
    
    // ---- Theme Toggle Logic (Dark/Light Mode) ----
    const themeToggleBtn = document.getElementById('theme-toggle');
    const body = document.body;
    
    let savedTheme;
    try {
        savedTheme = localStorage.getItem('portfolio-theme');
    } catch (e) {
        console.warn("localStorage is not available.");
    }
    
    if (savedTheme === 'light') {
        body.classList.add('light-mode');
    }

    updateFavicon(body.classList.contains('light-mode'));

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            body.classList.toggle('light-mode');
            
            const isLight = body.classList.contains('light-mode');
            
            updateFavicon(isLight);
            
            try {
                if (isLight) {
                    localStorage.setItem('portfolio-theme', 'light');
                } else {
                    localStorage.setItem('portfolio-theme', 'dark');
                }
            } catch(e) {}
        });
    }

    // ---- Mobile Nav Logic ----
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('nav');
    const navLinks = document.querySelectorAll('nav ul a');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            const isActive = hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
            hamburger.setAttribute('aria-expanded', isActive);
        });

        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                hamburger.setAttribute('aria-expanded', 'false');
            });
        });
    }

    // ---- Tabs Logic ----
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            tabButtons.forEach(btn => {
                btn.classList.remove('active');
                btn.setAttribute('aria-selected', 'false');
            });
            tabContents.forEach(content => content.classList.remove('active'));
            
            button.classList.add('active');
            button.setAttribute('aria-selected', 'true');
            const targetId = button.getAttribute('data-target');
            document.getElementById(targetId).classList.add('active');
        });
    });

    // ---- Carousel Logic ----
    const carousels = document.querySelectorAll('.carousel-wrapper');
    
    carousels.forEach(wrapper => {
        const carousel = wrapper.querySelector('.carousel');
        const prevBtn = wrapper.querySelector('.prev-btn');
        const nextBtn = wrapper.querySelector('.next-btn');

        if (prevBtn && nextBtn && carousel) {
            nextBtn.addEventListener('click', () => {
                carousel.scrollBy({ left: carousel.clientWidth, behavior: 'smooth' });
            });

            prevBtn.addEventListener('click', () => {
                carousel.scrollBy({ left: -carousel.clientWidth, behavior: 'smooth' });
            });
        }
    });

    // ---- Lightbox Logic (Projects & Certificates) ----
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const closeBtn = document.querySelector('.lightbox-close');
    const prevLightBtn = document.querySelector('.lightbox-prev');
    const nextLightBtn = document.querySelector('.lightbox-next');
    
    let currentImageArray = [];
    let currentImageIndex = 0;

    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach(card => {
        const images = Array.from(card.querySelectorAll('.carousel img'));
        images.forEach((img, index) => {
            img.addEventListener('click', () => {
                currentImageArray = images.map(imgElement => ({ src: imgElement.src }));
                currentImageIndex = index;
                showLightbox(currentImageArray[currentImageIndex].src);
            });
        });
    });

    const certCards = document.querySelectorAll('.cert-card');
    certCards.forEach(card => {
        const openCert = () => {
            const certImgSrc = card.getAttribute('data-cert-img');
            if(certImgSrc) {
                currentImageArray = [{ src: certImgSrc }];
                currentImageIndex = 0;
                showLightbox(certImgSrc);
            }
        };

        card.addEventListener('click', openCert);
        card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                openCert();
            }
        });
    });

    function showLightbox(src) {
        lightboxImg.src = src;
        lightbox.classList.add('active');
        closeBtn.focus();
        
        if (currentImageArray.length <= 1) {
            prevLightBtn.style.display = 'none';
            nextLightBtn.style.display = 'none';
        } else {
            prevLightBtn.style.display = 'flex';
            nextLightBtn.style.display = 'flex';
        }
    }

    closeBtn.addEventListener('click', () => {
        lightbox.classList.remove('active');
    });

    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            lightbox.classList.remove('active');
        }
    });

    prevLightBtn.addEventListener('click', (e) => {
        e.stopPropagation(); 
        currentImageIndex = (currentImageIndex - 1 + currentImageArray.length) % currentImageArray.length;
        lightboxImg.src = currentImageArray[currentImageIndex].src;
    });

    nextLightBtn.addEventListener('click', (e) => {
        e.stopPropagation(); 
        currentImageIndex = (currentImageIndex + 1) % currentImageArray.length;
        lightboxImg.src = currentImageArray[currentImageIndex].src;
    });

    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;
        if (e.key === 'Escape') lightbox.classList.remove('active');
        else if (e.key === 'ArrowRight' && currentImageArray.length > 1) {
            currentImageIndex = (currentImageIndex + 1) % currentImageArray.length;
            lightboxImg.src = currentImageArray[currentImageIndex].src;
        } else if (e.key === 'ArrowLeft' && currentImageArray.length > 1) {
            currentImageIndex = (currentImageIndex - 1 + currentImageArray.length) % currentImageArray.length;
            lightboxImg.src = currentImageArray[currentImageIndex].src;
        }
    });

    // ---- Contact Form Logic ----
    const contactForm = document.getElementById('contact-form');
    const successMessage = document.getElementById('success-message');

    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault(); 
            
            const submitBtn = contactForm.querySelector('.submit-btn');
            const originalBtnText = submitBtn.innerHTML;
            submitBtn.innerHTML = 'Sending...';
            submitBtn.disabled = true;

            const formData = new FormData(contactForm);

            fetch(contactForm.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            })
            .then(response => {
                if (response.ok) {
                    contactForm.style.display = 'none';
                    successMessage.style.display = 'flex';
                    contactForm.reset(); 
                } else {
                    throw new Error('Network response was not ok.');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                submitBtn.innerHTML = originalBtnText;
                submitBtn.disabled = false;
                alert('Oops! There was a problem submitting your form. Please try again.');
            });
        });
    }
});