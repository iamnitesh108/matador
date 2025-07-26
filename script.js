document.addEventListener('DOMContentLoaded', function () {
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const navMenu = document.getElementById('navMenu');
  const sections = document.querySelectorAll('.section, .hero');

  // Mobile menu toggle
  mobileMenuBtn.addEventListener('click', function () {
    navMenu.classList.toggle('active');
    this.innerHTML = navMenu.classList.contains('active') ? '✕' : '☰';
  });

  // Smooth scroll for navigation links
  navLinks.forEach((link) => {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      const targetSection = document.querySelector(targetId);

      if (targetSection) {
        const offsetTop = targetSection.offsetTop - 80;
        window.scrollTo({
          top: offsetTop,
          behavior: 'smooth',
        });
      }

      // Close mobile menu
      navMenu.classList.remove('active');
      mobileMenuBtn.innerHTML = '☰';
    });
  });

  // Navbar scroll effects and active section highlighting
  window.addEventListener('scroll', function () {
    const scrollY = window.pageYOffset;

    // Navbar background effect
    if (scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Active section highlighting
    let current = '';
    sections.forEach((section) => {
      const sectionTop = section.offsetTop - 100;
      const sectionHeight = section.clientHeight;

      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });

    // Update active nav link
    navLinks.forEach((link) => {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + current) {
        link.classList.add('active');
      }
    });
  });

  // Intersection Observer for animations
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px',
  };

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate');

        // Special handling for service cards with staggered animation
        if (entry.target.classList.contains('services-grid')) {
          const cards = entry.target.querySelectorAll('.service-card');
          cards.forEach((card, index) => {
            setTimeout(() => {
              card.classList.add('animate');
            }, index * 200);
          });
        }
      }
    });
  }, observerOptions);

  // Observe elements for animation
  const animateElements = document.querySelectorAll(
    '.section-title, .about-text, .about-image, .services-grid, ' +
      '.profile-image, .profile-details, .contact-info, .contact-form, .map-section'
  );

  animateElements.forEach((el) => observer.observe(el));

  // Stats counter animation
  const animateStats = () => {
    const statNumbers = document.querySelectorAll('.stat-number');
    statNumbers.forEach((stat) => {
      const text = stat.textContent;
      const target = parseInt(text.replace(/\D/g, '')) || 100;
      let current = 0;
      const increment = target / 50;
      const suffix = text.includes('%') ? '%' : '+';

      const updateStat = () => {
        if (current < target) {
          current += increment;
          stat.textContent = Math.ceil(current) + suffix;
          requestAnimationFrame(updateStat);
        } else {
          stat.textContent = target + suffix;
        }
      };

      updateStat();
    });
  };

  // Trigger stats animation when Roshan section comes into view
  const roshanSection = document.getElementById('roshan');
  const roshanObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setTimeout(animateStats, 500);
          roshanObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  roshanObserver.observe(roshanSection);

  // Contact form handling
  const contactForm = document.getElementById('contactForm');
  contactForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const formData = new FormData(this);
    const name = formData.get('name');
    const email = formData.get('email');
    const message = formData.get('message');

    if (!name || !email || !message) {
      alert('Please fill in all required fields.');
      return;
    }

    const submitBtn = this.querySelector('.submit-btn');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;

    setTimeout(() => {
      alert('Thank you for your message! We will get back to you soon.');
      this.reset();
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
    }, 2000);
  });

  // Create floating particles
  const createParticles = () => {
    const particlesContainer = document.getElementById('particles');

    for (let i = 0; i < 30; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle';
      particle.style.left = Math.random() * 100 + '%';
      particle.style.animationDelay = Math.random() * 10 + 's';
      particle.style.animationDuration = Math.random() * 10 + 5 + 's';
      particlesContainer.appendChild(particle);
    }
  };

  createParticles();

  // Parallax effect for hero section
  window.addEventListener('scroll', function () {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    if (hero && scrolled < window.innerHeight) {
      const rate = scrolled * -0.5;
      hero.style.transform = `translateY(${rate}px)`;
    }
  });

  // Add interactive effects to spec tags
  const specTags = document.querySelectorAll('.spec-tag');
  specTags.forEach((tag) => {
    tag.addEventListener('click', function () {
      this.style.transform = 'scale(1.1)';
      this.style.boxShadow = '0 4px 15px rgba(255, 107, 53, 0.5)';

      setTimeout(() => {
        this.style.transform = 'scale(1)';
        this.style.boxShadow = 'none';
      }, 200);
    });
  });

  // Add hover effects for service cards
  const serviceCards = document.querySelectorAll('.service-card');
  serviceCards.forEach((card) => {
    card.addEventListener('mouseenter', function () {
      this.style.transform = 'translateY(-10px) scale(1.02)';
    });

    card.addEventListener('mouseleave', function () {
      this.style.transform = 'translateY(0) scale(1)';
    });
  });

  // Typing effect for hero title
  const heroTitle = document.querySelector('.hero h1');
  if (heroTitle) {
    const text = heroTitle.textContent;
    heroTitle.textContent = '';
    heroTitle.style.borderRight = '2px solid #ff6b35';

    let i = 0;
    const typeWriter = () => {
      if (i < text.length) {
        heroTitle.textContent += text.charAt(i);
        i++;
        setTimeout(typeWriter, 100);
      } else {
        // Remove cursor after typing is complete
        setTimeout(() => {
          heroTitle.style.borderRight = 'none';
        }, 1000);
      }
    };

    setTimeout(typeWriter, 1000);
  }

  // Add loading animation
  window.addEventListener('load', function () {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';

    setTimeout(() => {
      document.body.style.opacity = '1';
    }, 100);
  });

  // Smooth scroll behavior for CTA button
  const ctaButton = document.querySelector('.cta-button');
  if (ctaButton) {
    ctaButton.addEventListener('click', function (e) {
      e.preventDefault();
      const targetSection = document.querySelector(this.getAttribute('href'));
      if (targetSection) {
        const offsetTop = targetSection.offsetTop - 80;
        window.scrollTo({
          top: offsetTop,
          behavior: 'smooth',
        });
      }
    });
  }

  // Add resize handler for mobile optimization
  window.addEventListener('resize', function () {
    if (window.innerWidth > 768) {
      navMenu.classList.remove('active');
      mobileMenuBtn.innerHTML = '☰';
    }
  });

  // Preload images for better performance
  const imageUrls = [
    'images/matador.jpg',
    'images/temp.jpg',
    'images/roshan.jpg',
  ];

  imageUrls.forEach((url) => {
    const img = new Image();
    img.src = url;
  });
});
