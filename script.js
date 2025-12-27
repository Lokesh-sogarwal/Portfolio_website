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

// Form submission (placeholder)
document.querySelector('form').addEventListener('submit', function(e) {
    e.preventDefault();
    alert('Thank you for your message! I\'ll get back to you soon.');
    this.reset();
});

// Add some interactive effects
document.addEventListener('DOMContentLoaded', function() {
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

    // Skill item click interaction
    const skillItems = document.querySelectorAll('.skill-item');
    skillItems.forEach(item => {
        item.addEventListener('click', function() {
            // Remove clicked class from all items
            skillItems.forEach(si => si.classList.remove('clicked'));
            // Add clicked class to this item
            this.classList.add('clicked');
            
            // Optional: Show a brief tooltip or animation
            const skillName = this.querySelector('h3').textContent;
            const percentage = this.querySelector('.skill-percentage').textContent;
            
            // Create a temporary tooltip
            const tooltip = document.createElement('div');
            tooltip.textContent = `${skillName}: ${percentage} proficiency`;
            tooltip.style.cssText = `
                position: absolute;
                background: rgba(74, 144, 226, 0.9);
                color: white;
                padding: 8px 12px;
                border-radius: 5px;
                font-size: 14px;
                pointer-events: none;
                z-index: 1000;
                top: ${this.offsetTop - 40}px;
                left: ${this.offsetLeft + this.offsetWidth / 2 - 75}px;
                animation: fadeIn 0.3s ease;
            `;
            
            document.body.appendChild(tooltip);
            
            // Remove tooltip after 2 seconds
            setTimeout(() => {
                tooltip.style.animation = 'fadeOut 0.3s ease';
                setTimeout(() => document.body.removeChild(tooltip), 300);
            }, 2000);
        });
    });
});