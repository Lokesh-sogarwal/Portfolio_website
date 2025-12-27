// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
        // Close mobile menu after clicking
        const navUl = document.querySelector('nav ul');
        const menuToggle = document.querySelector('.menu-toggle');
        if (navUl && navUl.classList.contains('show')) {
            navUl.classList.remove('show');
            menuToggle.classList.remove('active');
        }
    });
});

// Intersection Observer for scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate');
            // Trigger anime.js animations
            if (entry.target.classList.contains('animate')) {
                anime({
                    targets: entry.target,
                    opacity: [0, 1],
                    translateY: [30, 0],
                    duration: 800,
                    easing: 'easeOutQuad'
                });
            }
        }
    });
}, observerOptions);

// Observe elements for animation
document.querySelectorAll('.animate').forEach(el => {
    observer.observe(el);
});

// Also observe h2 titles
document.querySelectorAll('h2').forEach(h2 => {
    h2.classList.add('fade-in');
    observer.observe(h2);
});

// Progress bar animation
document.querySelectorAll('.progress').forEach(bar => {
    const width = bar.style.width;
    bar.style.setProperty('--progress-width', width);
    bar.style.width = '0';
});

// Enhanced Contact Form Functionality
// Features:
// - Form validation with visual feedback
// - Loading states and animations
// - Success/error status messages
// - Server-side saving of form responses to contact_responses.txt file
// - API endpoints for viewing/downloading all responses
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.querySelector('.contact-form');
    const submitBtn = document.querySelector('.submit-btn');
    const statusMessages = document.querySelectorAll('.status-message');

    // Input field animations and interactions
    const inputs = document.querySelectorAll('input, textarea');

    inputs.forEach(input => {
        // Focus/blur animations
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');

            // Animate input icon
            const icon = this.parentElement.querySelector('.input-icon');
            if (icon) {
                anime({
                    targets: icon,
                    scale: [1, 1.2, 1],
                    duration: 300,
                    easing: 'easeOutQuad'
                });
            }
        });

        input.addEventListener('blur', function() {
            this.parentElement.classList.remove('focused');
        });

        // Real-time validation
        input.addEventListener('input', function() {
            validateField(this);
        });

        // Typing animation effect
        input.addEventListener('keydown', function(e) {
            if (e.key !== 'Backspace' && e.key !== 'Delete') {
                const icon = this.parentElement.querySelector('.input-icon');
                if (icon) {
                    anime({
                        targets: icon,
                        rotate: [0, 10, -10, 0],
                        duration: 200,
                        easing: 'easeOutQuad'
                    });
                }
            }
        });
    });

    // Field validation function
    function validateField(field) {
        const value = field.value.trim();
        const fieldName = field.name;
        let isValid = true;

        // Remove existing validation classes
        field.classList.remove('valid', 'invalid');

        switch(fieldName) {
            case 'name':
                isValid = value.length >= 2;
                break;
            case 'email':
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                isValid = emailRegex.test(value);
                break;
            case 'message':
                isValid = value.length >= 10;
                break;
        }

        // Add validation classes and animations
        if (value.length > 0) {
            field.classList.add(isValid ? 'valid' : 'invalid');

            // Animate border color
            const border = field.parentElement.querySelector('.input-border');
            if (border) {
                anime({
                    targets: border,
                    background: isValid
                        ? 'linear-gradient(90deg, #27ae60, #2ecc71)'
                        : 'linear-gradient(90deg, #e74c3c, #c0392b)',
                    duration: 300,
                    easing: 'easeOutQuad'
                });
            }
        }

        return isValid;
    }

    // Form submission with enhanced UX
    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        // Hide any existing status messages
        statusMessages.forEach(msg => msg.classList.remove('show'));

        // Validate all fields
        const fields = this.querySelectorAll('input, textarea');
        let allValid = true;

        fields.forEach(field => {
            if (!validateField(field)) {
                allValid = false;
            }
        });

        if (!allValid) {
            showStatusMessage('error', 'Please fill in all fields correctly.');
            return;
        }

        // Show loading state
        submitBtn.classList.add('loading');

        // Submit form data to server
        try {
            const formData = new FormData(this);
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: formData.get('name'),
                    email: formData.get('email'),
                    message: formData.get('message')
                })
            });

            const result = await response.json();

            if (result.success) {
                // Success animation
                showStatusMessage('success', result.message);

                // Reset form with animation
                setTimeout(() => {
                    contactForm.reset();
                    inputs.forEach(input => {
                        input.classList.remove('valid', 'invalid');
                        const border = input.parentElement.querySelector('.input-border');
                        if (border) {
                            anime({
                                targets: border,
                                background: 'linear-gradient(90deg, #3498db, #27ae60)',
                                duration: 300
                            });
                        }
                    });
                }, 2000);
            } else {
                showStatusMessage('error', result.message);
            }

        } catch (error) {
            console.error('Form submission error:', error);
            showStatusMessage('error', 'Network error. Please try again or check if the server is running.');
        } finally {
            submitBtn.classList.remove('loading');
        }
    });

    // Status message display function
    function showStatusMessage(type, message) {
        const messageElement = document.querySelector(`.status-message.${type}`);
        const messageText = messageElement.querySelector('span');
        messageText.textContent = message;

        messageElement.classList.add('show');

        // Auto-hide success messages
        if (type === 'success') {
            setTimeout(() => {
                messageElement.classList.remove('show');
            }, 5000);
        }
    }

    // Contact info item interactions
    const infoItems = document.querySelectorAll('.info-item');

    infoItems.forEach(item => {
        item.addEventListener('click', function() {
            const icon = this.querySelector('.info-icon');
            const content = this.querySelector('.info-content p');

            // Bounce animation for icon
            anime({
                targets: icon,
                scale: [1, 1.2, 1],
                duration: 400,
                easing: 'easeOutQuad'
            });

            // Copy to clipboard functionality
            if (content && content.textContent) {
                navigator.clipboard.writeText(content.textContent).then(() => {
                    // Show temporary success feedback
                    const originalText = content.textContent;
                    content.textContent = 'Copied!';
                    content.style.color = '#27ae60';

                    setTimeout(() => {
                        content.textContent = originalText;
                        content.style.color = '';
                    }, 1000);
                });
            }
        });
    });

    // Contact particles animation
    const particles = document.querySelectorAll('.contact-particle');

    particles.forEach((particle, index) => {
        // Add random movement
        setInterval(() => {
            anime({
                targets: particle,
                translateX: anime.random(-20, 20),
                translateY: anime.random(-20, 20),
                duration: anime.random(2000, 4000),
                easing: 'easeInOutQuad',
                direction: 'alternate'
            });
        }, anime.random(3000, 6000));
    });

    // Intersection Observer for contact section animations
    const contactSection = document.querySelector('#contact');
    const contactObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Animate contact info items
                anime({
                    targets: '.info-item',
                    opacity: [0, 1],
                    translateY: [30, 0],
                    duration: 800,
                    easing: 'easeOutQuad',
                    delay: anime.stagger(200)
                });

                // Animate form elements
                anime({
                    targets: '.form-group',
                    opacity: [0, 1],
                    translateX: [-30, 0],
                    duration: 800,
                    easing: 'easeOutQuad',
                    delay: anime.stagger(150, {start: 400})
                });
            }
        });
    }, { threshold: 0.3 });

    if (contactSection) {
        contactObserver.observe(contactSection);
    }
});
    // Mobile menu toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const navUl = document.querySelector('nav ul');

    if (menuToggle && navUl) {
        menuToggle.addEventListener('click', function() {
            navUl.classList.toggle('show');
            menuToggle.classList.toggle('active');
        });
    }

    // Scroll to top button
    const scrollToTopBtn = document.getElementById('scroll-to-top');

    if (scrollToTopBtn) {
        // Show/hide button based on scroll position
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) {
                scrollToTopBtn.classList.add('show');
            } else {
                scrollToTopBtn.classList.remove('show');
            }
        });

        // Scroll to top when clicked
        scrollToTopBtn.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // Typing effect for hero text (optional enhancement)
    const heroText = document.querySelector('#hero h1');
    if (heroText) {
        const text = heroText.textContent;
        heroText.textContent = '';
        let i = 0;
        const typeWriter = () => {
            if (i < text.length) {
                heroText.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, 100);
            }
        };
        setTimeout(typeWriter, 1000);
    }

    // Skill bars animation on scroll
    const skillSection = document.querySelector('#skills');
    const skillObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const progressBars = entry.target.querySelectorAll('.progress');
                progressBars.forEach(bar => {
                    const targetWidth = bar.style.getPropertyValue('--progress-width');
                    anime({
                        targets: bar,
                        width: targetWidth,
                        duration: 1500,
                        easing: 'easeOutQuad',
                        delay: anime.stagger(200)
                    });
                });
            }
        });
    }, { threshold: 0.5 });

    if (skillSection) {
        skillObserver.observe(skillSection);
    }

    // Projects filtering functionality
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            button.classList.add('active');

            const filterValue = button.getAttribute('data-filter');

            projectCards.forEach(card => {
                const cardCategory = card.getAttribute('data-category');

                if (filterValue === 'all' || cardCategory === filterValue) {
                    // Show card with animation
                    card.style.display = 'block';
                    anime({
                        targets: card,
                        opacity: [0, 1],
                        scale: [0.8, 1],
                        duration: 600,
                        easing: 'easeOutQuad',
                        delay: anime.stagger(100)
                    });
                } else {
                    // Hide card
                    anime({
                        targets: card,
                        opacity: [1, 0],
                        scale: [1, 0.8],
                        duration: 400,
                        easing: 'easeInQuad',
                        complete: () => {
                            card.style.display = 'none';
                        }
                    });
                }
            });
        });
    });

    // Enhanced project card interactions
    projectCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            // Add glow effect
            this.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.4), 0 0 30px rgba(52, 152, 219, 0.3)';

            // Animate tech badges
            const badges = this.querySelectorAll('.tech-badge');
            anime({
                targets: badges,
                scale: [1, 1.1],
                duration: 300,
                easing: 'easeOutQuad',
                delay: anime.stagger(50)
            });
        });

        card.addEventListener('mouseleave', function() {
            // Reset glow effect
            this.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.3)';

            // Reset tech badges
            const badges = this.querySelectorAll('.tech-badge');
            anime({
                targets: badges,
                scale: [1.1, 1],
                duration: 300,
                easing: 'easeOutQuad'
            });
        });

        // Click interaction for project details
        card.addEventListener('click', function(e) {
            // Don't trigger if clicking on links
            if (e.target.tagName === 'A') return;

            // Toggle expanded state
            this.classList.toggle('expanded');

            const details = this.querySelector('.project-details');
            if (this.classList.contains('expanded')) {
                // Create and show project details
                if (!details) {
                    const projectDetails = document.createElement('div');
                    projectDetails.className = 'project-details';
                    projectDetails.innerHTML = `
                        <div class="project-details-content">
                            <h4>Project Overview</h4>
                            <p>${this.querySelector('p').textContent}</p>
                            <h4>Technologies Used</h4>
                            <div class="tech-list">
                                ${Array.from(this.querySelectorAll('.tech-badge')).map(badge =>
                                    `<span class="tech-item">${badge.textContent}</span>`
                                ).join('')}
                            </div>
                            <div class="project-actions">
                                <button class="btn close-details">Close Details</button>
                            </div>
                        </div>
                    `;
                    this.appendChild(projectDetails);

                    // Animate details appearance
                    anime({
                        targets: projectDetails,
                        opacity: [0, 1],
                        scale: [0.9, 1],
                        duration: 400,
                        easing: 'easeOutQuad'
                    });
                }
            } else {
                // Hide details
                if (details) {
                    anime({
                        targets: details,
                        opacity: [1, 0],
                        scale: [1, 0.9],
                        duration: 300,
                        easing: 'easeInQuad',
                        complete: () => {
                            this.removeChild(details);
                        }
                    });
                }
            }
        });
    });

    // Close project details when clicking close button
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('close-details')) {
            const card = e.target.closest('.project-card');
            card.classList.remove('expanded');
            const details = card.querySelector('.project-details');
            if (details) {
                anime({
                    targets: details,
                    opacity: [1, 0],
                    scale: [1, 0.9],
                    duration: 300,
                    easing: 'easeInQuad',
                    complete: () => {
                        card.removeChild(details);
                    }
                });
            }
        }
    });

    // Animate progress bars on scroll
    const progressObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const progressFill = entry.target.querySelector('.progress-fill');
                if (progressFill) {
                    const targetWidth = progressFill.style.width;
                    anime({
                        targets: progressFill,
                        width: targetWidth,
                        duration: 2000,
                        easing: 'easeOutQuad'
                    });
                }
            }
        });
    }, { threshold: 0.5 });

    document.querySelectorAll('.progress-bar').forEach(bar => {
        progressObserver.observe(bar);
    });

    // Staggered animation for project cards on load
    const projectsSection = document.querySelector('#projects');
    const projectsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                anime({
                    targets: '.project-card',
                    opacity: [0, 1],
                    translateY: [50, 0],
                    duration: 800,
                    easing: 'easeOutQuad',
                    delay: anime.stagger(200)
                });
            }
        });
    }, { threshold: 0.1 });

    if (projectsSection) {
        projectsObserver.observe(projectsSection);
    }