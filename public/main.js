// City Gardener Theme JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const mobileMenuButton = document.createElement('button');
    mobileMenuButton.classList.add('mobile-menu-toggle');
    mobileMenuButton.setAttribute('aria-label', 'Toggle navigation menu');
    mobileMenuButton.innerHTML = '<span></span><span></span><span></span>';
    
    const siteNav = document.querySelector('.site-nav');
    const headerInner = document.querySelector('.header-inner');
    
    if (siteNav && headerInner) {
        // Insert the menu button before the nav
        headerInner.insertBefore(mobileMenuButton, siteNav);
        
        // Create a backdrop overlay for mobile menu
        const menuOverlay = document.createElement('div');
        menuOverlay.classList.add('menu-overlay');
        document.body.appendChild(menuOverlay);
        
        // Toggle menu function
        function toggleMenu() {
            document.body.classList.toggle('menu-open');
            siteNav.classList.toggle('active');
            mobileMenuButton.classList.toggle('active');
            menuOverlay.classList.toggle('active');
        }
        
        // Event listeners for menu toggling
        mobileMenuButton.addEventListener('click', toggleMenu);
        menuOverlay.addEventListener('click', toggleMenu);
        
        // Close menu when clicking a nav link (for better UX)
        const navLinks = siteNav.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                if (document.body.classList.contains('menu-open')) {
                    toggleMenu();
                }
            });
        });
        
        // Close menu on escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && document.body.classList.contains('menu-open')) {
                toggleMenu();
            }
        });
    }
    
    // Contact Modal functionality
    const contactBtns = document.querySelectorAll('.get-in-touch-btn');
    const contactModal = document.getElementById('contactModal');
    const modalClose = document.querySelector('.modal-close');
    const contactForm = document.getElementById('contactForm');
    
    // Open modal when "GET IN TOUCH" button is clicked
    if (contactBtns && contactModal) {
        contactBtns.forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                contactModal.classList.add('active');
                document.body.style.overflow = 'hidden'; // Prevent background scrolling
            });
        });
    }
    
    // Close modal when X is clicked
    if (modalClose && contactModal) {
        modalClose.addEventListener('click', function() {
            contactModal.classList.remove('active');
            document.body.style.overflow = ''; // Re-enable scrolling
        });
    }
    
    // Close modal when clicking outside the modal content
    if (contactModal) {
        contactModal.addEventListener('click', function(e) {
            if (e.target === contactModal) {
                contactModal.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }
    
    // Handle form submission
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Here you would normally send the form data to your backend
            // For now, let's just show a success message
            const formData = new FormData(contactForm);
            let formValues = {};
            
            for (let [key, value] of formData.entries()) {
                formValues[key] = value;
            }
            
            console.log("Form submitted with values:", formValues);
            
            // Replace form with success message
            contactForm.innerHTML = '<div class="form-success"><p>Thank you for your message! I\'ll get back to you soon.</p></div>';
            
            // Close modal after a delay
            setTimeout(function() {
                contactModal.classList.remove('active');
                document.body.style.overflow = '';
                
                // Reset form after modal is closed
                setTimeout(function() {
                    contactForm.reset();
                    contactForm.innerHTML = `
                        <div class="modal-form-group">
                            <input type="text" id="name" name="name" placeholder="Name" required>
                        </div>
                        <div class="modal-form-group">
                            <input type="email" id="email" name="email" placeholder="Email Address" required>
                        </div>
                        <div class="modal-form-group">
                            <input type="tel" id="phone" name="phone" placeholder="Phone Number (Optional)">
                        </div>
                        <div class="modal-form-group">
                            <textarea id="message" name="message" placeholder="Message" rows="5" required></textarea>
                        </div>
                        <button type="submit" class="modal-submit-btn">SEND MESSAGE</button>
                    `;
                }, 500);
            }, 3000);
        });
    }
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 100,
                    behavior: 'smooth'
                });
            }
        });
    });
}); 