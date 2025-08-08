tailwind.config = {
    darkMode: 'class',
    theme: {
        fontFamily: {
            sans: ['Inter', 'sans-serif'],
        },
        extend: {
            colors: {
                primary: {
                    light: '#2563eb',
                    dark: '#3b82f6'
                },
                secondary: {
                    light: '#7c3aed',
                    dark: '#8b5cf6'
                }
            },
            animation: {
                'float': 'float 4s ease-in-out infinite',
                'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite'
            },
            keyframes: {
                float: {
                    '0%, 100%': { transform: 'translateY(0px)' },
                    '50%': { transform: 'translateY(-15px)' }
                }
            }
        }
    }
}

// Mobile menu toggle
const mobileMenuButton = document.getElementById('mobile-menu-button');
const mobileMenu = document.getElementById('mobile-menu');

// Profile menu elements
const profileButton = document.getElementById('profile-button');
const profileDropdown = document.getElementById('profile-dropdown');
const profileChevron = document.getElementById('profile-chevron');
const logoutButton = document.getElementById('logout-button');
const userNameElement = document.getElementById('user-name');
const dropdownUserName = document.getElementById('dropdown-user-name');
const dropdownUserEmail = document.getElementById('dropdown-user-email');

mobileMenuButton.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.contains('open');
    mobileMenu.style.maxHeight = isOpen ? '0' : `${mobileMenu.scrollHeight}px`;
    mobileMenu.classList.toggle('open');
});

// Profile menu toggle
profileButton.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = profileDropdown.classList.contains('opacity-100');
    
    if (isOpen) {
        closeProfileMenu();
    } else {
        openProfileMenu();
    }
});

// Close profile menu when clicking outside
document.addEventListener('click', (e) => {
    if (!document.getElementById('user-profile-container').contains(e.target)) {
        closeProfileMenu();
    }
});

// Profile menu functions
function openProfileMenu() {
    profileDropdown.classList.remove('opacity-0', 'invisible', 'scale-95');
    profileDropdown.classList.add('opacity-100', 'visible', 'scale-100');
    profileChevron.style.transform = 'rotate(180deg)';
}

function closeProfileMenu() {
    profileDropdown.classList.remove('opacity-100', 'visible', 'scale-100');
    profileDropdown.classList.add('opacity-0', 'invisible', 'scale-95');
    profileChevron.style.transform = 'rotate(0deg)';
}

// Check for logged in user and update UI
function updateUserInfo() {
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
    
    if (loggedInUser) {
        userNameElement.textContent = loggedInUser.firstName;
        dropdownUserName.textContent = `${loggedInUser.firstName} ${loggedInUser.lastName}`;
        dropdownUserEmail.textContent = loggedInUser.email;
    } else {
        userNameElement.textContent = 'Guest';
        dropdownUserName.textContent = 'Guest User';
        dropdownUserEmail.textContent = 'guest@example.com';
    }
}

// Logout functionality
logoutButton.addEventListener('click', (e) => {
    e.preventDefault();
    
    // Show confirmation dialog
    if (confirm('Are you sure you want to logout?')) {
        // Clear user data
        localStorage.removeItem('loggedInUser');
        
        // Show logout message
        const logoutMessage = document.createElement('div');
        logoutMessage.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 transition-all duration-300';
        logoutMessage.innerHTML = '<i class="fas fa-check-circle mr-2"></i>Successfully logged out!';
        document.body.appendChild(logoutMessage);
        
        // Remove message after 3 seconds
        setTimeout(() => {
            logoutMessage.remove();
        }, 3000);
        
        // Update UI
        updateUserInfo();
        closeProfileMenu();
        
        // Redirect to auth page after a short delay
        setTimeout(() => {
            window.location.href = 'auth.html';
        }, 1500);
    }
});

// Profile menu item click handlers
document.querySelectorAll('.profile-menu-item').forEach(item => {
    if (item.id !== 'logout-button') {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Get the menu item text
            const menuText = item.querySelector('span').textContent;
            
            // Show coming soon message
            const message = document.createElement('div');
            message.className = 'fixed top-4 right-4 bg-blue-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 transition-all duration-300';
            message.innerHTML = `<i class="fas fa-info-circle mr-2"></i>${menuText} - Coming Soon!`;
            document.body.appendChild(message);
            
            // Remove message after 3 seconds
            setTimeout(() => {
                message.remove();
            }, 3000);
            
            closeProfileMenu();
        });
    }
});

// Initialize user info on page load
updateUserInfo();

// Theme toggle
const themeToggle = document.getElementById('theme-toggle');
const html = document.documentElement;
const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');

// Check for saved theme preference or use system preference
const currentTheme = localStorage.getItem('theme');
if (currentTheme === 'dark' || (!currentTheme && prefersDarkScheme.matches)) {
    html.classList.add('dark');
    themeToggle.querySelector('.fa-moon').classList.add('hidden');
    themeToggle.querySelector('.fa-sun').classList.remove('hidden');
}

themeToggle.addEventListener('click', () => {
    html.classList.toggle('dark');
    const isDark = html.classList.contains('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');

    // Toggle icons
    themeToggle.querySelector('.fa-moon').classList.toggle('hidden');
    themeToggle.querySelector('.fa-sun').classList.toggle('hidden');
});

// Navbar scroll effects
const header = document.querySelector('header');
const homeSection = document.getElementById('home');

function updateNavbar() {
    const homeHeight = homeSection.offsetHeight;
    const scrollPosition = window.scrollY;

    if (scrollPosition > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }

    // Show/hide back to top button
    if (scrollPosition > 300) {
        document.getElementById('fab-top').classList.add('visible');
    } else {
        document.getElementById('fab-top').classList.remove('visible');
    }
}

window.addEventListener('scroll', updateNavbar);
updateNavbar(); // Initialize

// Back to top button
document.getElementById('fab-top').addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Scroll animation for elements
const animateElements = document.querySelectorAll('.animate-on-scroll');

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animated');

            // Animate skill bars
            if (entry.target.querySelector('.skill-progress')) {
                const skillBars = entry.target.querySelectorAll('.skill-progress');
                skillBars.forEach(bar => {
                    const width = bar.getAttribute('data-width');
                    bar.style.width = width + '%';
                });
            }
        }
    });
}, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
});

animateElements.forEach(element => {
    observer.observe(element);
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();

        // Close mobile menu if open
        if (mobileMenu.classList.contains('open')) {
            mobileMenu.style.maxHeight = '0';
            mobileMenu.classList.remove('open');
        }

        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);

        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });

            // Update active nav link
            document.querySelectorAll('.nav-link').forEach(link => {
                link.classList.remove('active-nav');
            });

            if (this.classList.contains('nav-link')) {
                this.classList.add('active-nav');
            }
        }
    });
});

// Update active nav link on scroll
const sections = document.querySelectorAll('section');

window.addEventListener('scroll', () => {
    let current = '';

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;

        if (pageYOffset >= (sectionTop - 100)) {
            current = section.getAttribute('id');
        }
    });

    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active-nav');
        if (link.getAttribute('href') === '#' + current) {
            link.classList.add('active-nav');
        }
    });
});

// Contact form submission
const contactForm = document.getElementById('contact-form');
const formMessage = document.getElementById('form-message');

contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(contactForm);
    const submitButton = contactForm.querySelector('button[type="submit"]');
    const originalButtonText = submitButton.textContent;

    try {
        // Show loading state
        submitButton.disabled = true;
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> Sending...';

        // Simulate form submission (replace with actual form submission)
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Show success message
        formMessage.textContent = 'Message sent successfully! I will get back to you soon.';
        formMessage.className = 'form-message success';

        // Reset form
        contactForm.reset();
    } catch (error) {
        console.error('Error:', error);
        formMessage.textContent = 'Failed to send message. Please try again later.';
        formMessage.className = 'form-message error';
    } finally {
        // Reset button state
        submitButton.disabled = false;
        submitButton.innerHTML = '<i class="fas fa-paper-plane mr-2"></i> Send Message';

        // Hide message after 5 seconds
        setTimeout(() => {
            formMessage.textContent = '';
            formMessage.className = 'form-message';
        }, 5000);
    }
});

// View All Projects toggle functionality
const viewAllProjectsBtn = document.getElementById('view-all-projects-btn');
const hiddenProjects = document.querySelectorAll('.hidden-project');

viewAllProjectsBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const isHidden = hiddenProjects[0].style.display === 'none' || hiddenProjects[0].classList.contains('hidden-project');

    hiddenProjects.forEach(project => {
        if (isHidden) {
            project.style.display = 'block';
            project.classList.remove('hidden-project');
        } else {
            project.style.display = 'none';
            project.classList.add('hidden-project');
        }
    });

    if (isHidden) {
        viewAllProjectsBtn.innerHTML = 'View Less <i class="fas fa-arrow-left ml-2"></i>';
    } else {
        viewAllProjectsBtn.innerHTML = 'View All Projects <i class="fas fa-arrow-right ml-2"></i>';
    }
});

// Text rotation for job title
const jobTitleElement = document.getElementById('jobTitle');
const jobTitles = ["Frontend Developer", "Software Engineer", "Data Analyst"];
let currentJobIndex = 0;

function rotateJobTitle() {
    jobTitleElement.style.opacity = 0;
    setTimeout(() => {
        currentJobIndex = (currentJobIndex + 1) % jobTitles.length;
        jobTitleElement.textContent = jobTitles[currentJobIndex];
        jobTitleElement.style.opacity = 1;
    }, 500);
}

setInterval(rotateJobTitle, 1300);

jobTitleElement.style.transition = 'opacity 0.3s ease-in-out';