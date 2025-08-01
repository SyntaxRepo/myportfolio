document.addEventListener('DOMContentLoaded', function () {
    // Get all sections and nav links
    const navLinks = document.querySelectorAll('.nav-link-item');
    const sections = document.querySelectorAll('main section');
    const header = document.getElementById('header');
    const footer = document.getElementById('main-footer');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const navBrand = document.querySelector('.nav-link[data-target="header"]');
    
    let skillsAnimated = false;

    // Function to handle showing and hiding pages and scrolling to them
    const showPage = (id) => {
        // Hide all sections initially
        sections.forEach(section => section.classList.add('hidden'));
        footer.classList.add('hidden');
        
        // Remove active class from all nav links
        document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));

        // Show the requested page
        const targetPage = document.getElementById(id);
        if (targetPage) {
            targetPage.classList.remove('hidden');
            // Scroll to the target page itself
            targetPage.scrollIntoView({ behavior: 'smooth' });
        }
        
        // Show the footer only when a content section is active
        if (id !== 'header') {
            footer.classList.remove('hidden');
        } else {
            header.scrollIntoView({ behavior: 'smooth' });
        }

        // Animate progress bars only the first time the skills page is shown
        if (id === 'skills' && !skillsAnimated) {
            const progressBars = document.querySelectorAll('#skills [data-progress]');
            progressBars.forEach(bar => {
                const progress = bar.getAttribute('data-progress');
                bar.style.width = progress + '%';
            });
            skillsAnimated = true;
        }

        // Add active class to the current nav link
        const activeLink = document.querySelector(`.nav-link[data-target="${id}"]`);
        if (activeLink) {
            activeLink.classList.add('active');
        }
    };
    
    // Event listener for all navigation links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('data-target');
            showPage(targetId);
            // Close the mobile menu after clicking a link
            mobileMenu.classList.add('hidden');
        });
    });

    // Mobile Menu Toggle
    mobileMenuButton.addEventListener('click', function () {
        mobileMenu.classList.toggle('hidden');
    });

    // Initial setup: show only the header and hide everything else
    showPage('header');


    // Modal functionality (unchanged from original code)
    const emailButton = document.getElementById('email-button');
    const emailModal = document.getElementById('email-modal');
    const closeEmailModalButton = document.getElementById('close-email-modal-button');
    const copyEmailButton = document.getElementById('copy-email-button');
    const emailText = document.getElementById('email-text');
    const copyEmailMessage = document.getElementById('copy-email-message');

    const callButton = document.getElementById('call-button');
    const callModal = document.getElementById('call-modal');
    const closeCallModalButton = document.getElementById('close-call-modal-button');
    const copyCallButton = document.getElementById('copy-call-button');
    const callText = document.getElementById('call-text');
    const copyCallMessage = document.getElementById('copy-call-message');

    const openModal = (modal) => {
        modal.classList.remove('hidden');
        setTimeout(() => modal.classList.add('flex'), 10);
    };

    const closeModal = (modal) => {
        modal.classList.add('hidden');
    };

    emailButton.addEventListener('click', () => openModal(emailModal));
    closeEmailModalButton.addEventListener('click', () => closeModal(emailModal));
    callButton.addEventListener('click', () => openModal(callModal));
    closeCallModalButton.addEventListener('click', () => closeModal(callModal));
    
    // Close modals when clicking outside
    window.addEventListener('click', (event) => {
        if (event.target === emailModal) {
            closeModal(emailModal);
        }
        if (event.target === callModal) {
            closeModal(callModal);
        }
    });

    // Copy to clipboard functionality
    const setupCopyButton = (button, textInput, messageElement) => {
        button.addEventListener('click', () => {
            textInput.select();
            textInput.setSelectionRange(0, 99999);
            try {
                // For broader browser support within iframes
                document.execCommand('copy');
                messageElement.classList.remove('hidden');
                setTimeout(() => {
                    messageElement.classList.add('hidden');
                }, 2000);
            } catch (err) {
                console.error('Failed to copy text: ', err);
            }
        });
    };
    
    setupCopyButton(copyEmailButton, emailText, copyEmailMessage);
    setupCopyButton(copyCallButton, callText, copyCallMessage);

    // ===================================
    // JavaScript for the Electron Background
    // ===================================
    const canvas = document.getElementById('electron-canvas');
    const ctx = canvas.getContext('2d');
    let particles = [];
    const particleCount = 100;
    const linkDistance = 150; // Increased link distance for a more spaced-out look
    
    // Adjust canvas size to match header element
    const resizeCanvas = () => {
        canvas.width = header.clientWidth;
        canvas.height = header.clientHeight;
    };

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.vx = (Math.random() - 0.5) * 0.5;
            this.vy = (Math.random() - 0.5) * 0.5;
            this.radius = Math.random() * 2 + 1;
            this.color = `rgba(88, 166, 255, ${Math.random() * 0.5 + 0.5})`; // Blue color for particles
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.fill();
            ctx.closePath();
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;

            // Wrap particles around the screen
            if (this.x < 0) this.x = canvas.width;
            if (this.x > canvas.width) this.x = 0;
            if (this.y < 0) this.y = canvas.height;
            if (this.y > canvas.height) this.y = 0;
        }
    }

    const initParticles = () => {
        particles = [];
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }
    };

    const drawLines = () => {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const p1 = particles[i];
                const p2 = particles[j];
                const distance = Math.sqrt((p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2);
                
                if (distance < linkDistance) {
                    ctx.beginPath();
                    ctx.moveTo(p1.x, p1.y);
                    ctx.lineTo(p2.x, p2.y);
                    ctx.strokeStyle = `rgba(88, 166, 255, ${1 - distance / linkDistance})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                    ctx.closePath();
                }
            }
        }
    };

    const animate = () => {
        requestAnimationFrame(animate);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        for (let i = 0; i < particles.length; i++) {
            particles[i].update();
            particles[i].draw();
        }
        
        drawLines();
    };

    // Initial setup for the canvas animation
    window.addEventListener('load', () => {
        resizeCanvas();
        initParticles();
        animate();
    });

    // Handle window resizing
    window.addEventListener('resize', () => {
        resizeCanvas();
        initParticles();
    });
});