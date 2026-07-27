document.addEventListener('DOMContentLoaded', () => {
    // --- 1. THEME SYSTEM ---
    const themeToggleBtn = document.getElementById('theme-toggle');
    const htmlElement = document.documentElement;

    // Load theme setting or default to dark
    const currentTheme = localStorage.getItem('theme') || 'dark';
    htmlElement.setAttribute('data-theme', currentTheme);

    themeToggleBtn.addEventListener('click', () => {
        const activeTheme = htmlElement.getAttribute('data-theme');
        let newTheme = 'dark';
        if (activeTheme === 'dark') {
            newTheme = 'light';
        }
        htmlElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    });

    // --- 2. MOBILE DRAWER NAVIGATION ---
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // --- 3. NAVBAR SCROLL EFFECT ---
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // --- 4. HERO SECTION TYPEWRITER EFFECT ---
    const typewriterElement = document.getElementById('typewriter');
    const words = [
        "AI / ML Engineer",
        "Data Scientist",
        "Python Full Stack Developer",
        "Data Analyst",
        "Generative AI Developer"
    ];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;

    function handleTypewriter() {
        const currentWord = words[wordIndex];

        if (isDeleting) {
            typewriterElement.textContent = currentWord.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 50; // Erasing is faster
        } else {
            typewriterElement.textContent = currentWord.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 100;
        }

        if (!isDeleting && charIndex === currentWord.length) {
            // Wait before erasing
            typingSpeed = 1800;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % words.length;
            typingSpeed = 500; // Small delay before next word starts typing
        }

        setTimeout(handleTypewriter, typingSpeed);
    }

    // Start typewriter loop if the element exists
    if (typewriterElement) {
        handleTypewriter();
    }

    // --- 5. INTERSECTION OBSERVER FOR SCROLL REVEALS & ACTIVE LINKS ---
    const revealElements = document.querySelectorAll('.reveal-on-scroll');
    const sections = document.querySelectorAll('section');
    const navLinkItems = document.querySelectorAll('.nav-link');

    // Observer options
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    // Scroll reveal observer
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');

                // If it's a skill card, animate the inner skill bars
                if (entry.target.classList.contains('skills-card')) {
                    animateSkillBars(entry.target);
                }

                observer.unobserve(entry.target); // Reveal once
            }
        });
    }, observerOptions);

    revealElements.forEach(element => {
        revealObserver.observe(element);
    });

    // Function to animate skill progress bars
    function animateSkillBars(card) {
        const progressBars = card.querySelectorAll('.skill-fill');
        progressBars.forEach(bar => {
            const targetWidth = bar.getAttribute('data-progress');
            bar.style.width = targetWidth;
        });
    }

    // Navigation highlight observer
    const navOptions = {
        root: null,
        rootMargin: '-30% 0px -60% 0px', // Standard sweet spot for tracking middle of page
        threshold: 0
    };

    const navObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const sectionId = entry.target.getAttribute('id');
                navLinkItems.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, navOptions);

    sections.forEach(section => {
        navObserver.observe(section);
    });

    // --- 6. CONTACT FORM VALIDATION & HANDLING ---
    const contactForm = document.getElementById('contact-form');
    const successFeedback = document.getElementById('submit-success');
    const nameInput = document.getElementById('form-name');
    const emailInput = document.getElementById('form-email');
    const subjectInput = document.getElementById('form-subject');
    const messageInput = document.getElementById('form-message');

    // Validate email pattern helper
    function isValidEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }

    // Function to clear input invalid flags
    function clearInvalid(input) {
        input.classList.remove('invalid');
    }

    // Add inputs clean behavior on typing
    const formFields = [nameInput, emailInput, subjectInput, messageInput];
    formFields.forEach(field => {
        if (field) {
            field.addEventListener('input', () => {
                clearInvalid(field);
            });
        }
    });

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            let isFormValid = true;

            // Validate Name
            if (!nameInput.value.trim()) {
                nameInput.classList.add('invalid');
                isFormValid = false;
            } else {
                nameInput.classList.remove('invalid');
            }

            // Validate Email
            if (!emailInput.value.trim() || !isValidEmail(emailInput.value.trim())) {
                emailInput.classList.add('invalid');
                isFormValid = false;
            } else {
                emailInput.classList.remove('invalid');
            }

            // Validate Subject
            if (!subjectInput.value.trim()) {
                subjectInput.classList.add('invalid');
                isFormValid = false;
            } else {
                subjectInput.classList.remove('invalid');
            }

            // Validate Message
            if (!messageInput.value.trim()) {
                messageInput.classList.add('invalid');
                isFormValid = false;
            } else {
                messageInput.classList.remove('invalid');
            }

            if (isFormValid) {
                const submitBtn = document.getElementById('btn-submit');
                const originalText = submitBtn.innerHTML;

                // Visual feedback of loader / disabled
                submitBtn.disabled = true;
                submitBtn.innerHTML = `Sending...`;

                // Real submission via FormSubmit AJAX endpoint
                fetch("https://formsubmit.co/ajax/premrajrupnar41@gmail.com", {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify({
                        Name: nameInput.value.trim(),
                        Email: emailInput.value.trim(),
                        Subject: subjectInput.value.trim(),
                        Message: messageInput.value.trim()
                    })
                })
                    .then(response => {
                        if (response.ok) {
                            // Success visual
                            successFeedback.classList.add('active');
                            contactForm.reset();
                            // Hide success message after 5 seconds
                            setTimeout(() => {
                                successFeedback.classList.remove('active');
                            }, 5000);
                        } else {
                            alert("Oops! There was a problem submitting your form. Please try again.");
                        }
                    })
                    .catch(error => {
                        console.error("Form error:", error);
                        alert("Oops! There was a problem submitting your form. Please check your connection and try again.");
                    })
                    .finally(() => {
                        submitBtn.disabled = false;
                        submitBtn.innerHTML = originalText;
                    });
            }
        });
    }

    // --- 7. CERTIFICATE MODAL LIGHTBOX ---
    const certModal = document.getElementById('cert-modal');
    const certModalImg = document.getElementById('cert-modal-img');
    const certModalCaption = document.getElementById('cert-modal-caption');
    const certModalClose = document.getElementById('cert-modal-close');
    const viewCertButtons = document.querySelectorAll('.view-cert-btn');

    function closeCertModal() {
        if (certModal) {
            certModal.classList.remove('active');
            certModal.setAttribute('aria-hidden', 'true');

            // Re-enable body scroll
            document.body.style.overflow = '';

            // Hide display block after opacity transition completes
            setTimeout(() => {
                if (!certModal.classList.contains('active')) {
                    certModal.style.display = 'none';
                    if (certModalImg) certModalImg.src = '';
                }
            }, 300); // 300ms matches style.css transition
        }
    }

    if (viewCertButtons.length > 0 && certModal) {
        viewCertButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const certSrc = btn.getAttribute('data-cert');
                const certTitle = btn.getAttribute('data-title');

                if (certModalImg && certModalCaption) {
                    certModalImg.src = certSrc;
                    certModalCaption.textContent = certTitle;

                    // Show block display first
                    certModal.style.display = 'flex';

                    // Trigger reflow to ensure transition animation executes
                    certModal.offsetHeight;

                    // Add active class for fade-in & scale-up
                    certModal.classList.add('active');
                    certModal.setAttribute('aria-hidden', 'false');

                    // Disable scroll on main window while viewing cert
                    document.body.style.overflow = 'hidden';
                }
            });
        });

        // Close on close button click
        if (certModalClose) {
            certModalClose.addEventListener('click', closeCertModal);
        }

        // Close on clicking backdrop/overlay area
        certModal.addEventListener('click', (e) => {
            if (e.target === certModal || e.target.classList.contains('cert-modal-content-container')) {
                closeCertModal();
            }
        });

        // Close on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                closeCertModal();
            }
        });
    }
});
