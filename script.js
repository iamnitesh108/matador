document.addEventListener('DOMContentLoaded', function () {
      // Initialize variables
      const navbar = document.getElementById('navbar');
      const navLinks = document.querySelectorAll('.nav-link');
      const mobileMenuBtn = document.getElementById('mobileMenuBtn');
      const navMenu = document.getElementById('navMenu');
      const sections = document.querySelectorAll('.section, .hero');

      // Enhanced mobile menu toggle
      mobileMenuBtn.addEventListener('click', function () {
        navMenu.classList.toggle('active');
        this.innerHTML = navMenu.classList.contains('active') ? '✕' : '☰';
        
        // Prevent body scroll when menu is open
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : 'auto';
      });

      // Enhanced smooth scroll
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
          if (navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            mobileMenuBtn.innerHTML = '☰';
            document.body.style.overflow = 'auto';
          }
        });
      });

      // Enhanced scroll effects
      let ticking = false;
      
      function updateOnScroll() {
        const scrollY = window.pageYOffset;

        // Navbar effects
        if (scrollY > 50) {
          navbar.classList.add('scrolled');
        } else {
          navbar.classList.remove('scrolled');
        }

        // Active section highlighting
        let current = '';
        sections.forEach((section) => {
          const sectionTop = section.offsetTop - 150;
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

        ticking = false;
      }

      function requestScrollUpdate() {
        if (!ticking) {
          requestAnimationFrame(updateOnScroll);
          ticking = true;
        }
      }

      window.addEventListener('scroll', requestScrollUpdate);

      // Intersection Observer for animations
      const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px',
      };

      const observer = new IntersectionObserver(function (entries) {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate');

            // Staggered animation for service cards
            if (entry.target.classList.contains('services-grid')) {
              const cards = entry.target.querySelectorAll('.service-card');
              cards.forEach((card, index) => {
                setTimeout(() => {
                  card.classList.add('animate');
                }, index * 150);
              });
            }
          }
        });
      }, observerOptions);

      // Observe elements for animation
      const animateElements = document.querySelectorAll(
        '.section-header, .about-content, .about-image, .services-grid, ' +
        '.trainer-image, .trainer-info, .contact-info, .contact-form, .map-section'
      );

      animateElements.forEach((el) => observer.observe(el));

      // Stats counter animation
      const animateStats = () => {
        const statNumbers = document.querySelectorAll('.stat-number');
        statNumbers.forEach((stat) => {
          const target = parseInt(stat.getAttribute('data-target'));
          const suffix = stat.textContent.includes('%') ? '%' : '+';
          let current = 0;
          const increment = target / 60;
          const duration = 2000;
          const stepTime = duration / 60;

          const updateStat = () => {
            if (current < target) {
              current += increment;
              stat.textContent = Math.ceil(current) + (target === 24 ? '/7' : suffix);
              setTimeout(updateStat, stepTime);
            } else {
              stat.textContent = target + (target === 24 ? '/7' : suffix);
            }
          };

          updateStat();
        });
      };

      // Trigger stats animation for hero section
      setTimeout(animateStats, 2000);

      // Trigger stats animation for trainer section
      const roshanSection = document.getElementById('roshan');
      const roshanObserver = new IntersectionObserver(
        function (entries) {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const trainerStats = entry.target.querySelectorAll('.stat-card .stat-number');
              trainerStats.forEach((stat) => {
                const target = parseInt(stat.getAttribute('data-target'));
                let current = 0;
                const increment = target / 40;

                const updateTrainerStat = () => {
                  if (current < target) {
                    current += increment;
                    stat.textContent = Math.ceil(current) + (target === 100 ? '%' : '+');
                    setTimeout(updateTrainerStat, 50);
                  } else {
                    stat.textContent = target + (target === 100 ? '%' : '+');
                  }
                };

                updateTrainerStat();
              });
              roshanObserver.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.3 }
      );

      roshanObserver.observe(roshanSection);

      // Enhanced form handling
      const contactForm = document.getElementById('contactForm');
      contactForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const formData = new FormData(this);
        const name = formData.get('name');
        const email = formData.get('email');
        const message = formData.get('message');

        if (!name || !email || !message) {
          showNotification('Please fill in all required fields.', 'error');
          return;
        }

        const submitBtn = this.querySelector('.submit-btn');
        const originalText = submitBtn.textContent;
        
        // Button loading state
        submitBtn.innerHTML = 'Sending... ⏳';
        submitBtn.disabled = true;
        submitBtn.style.opacity = '0.7';

        setTimeout(() => {
          showNotification('Thank you for your message! We will get back to you soon.', 'success');
          this.reset();
          submitBtn.innerHTML = originalText;
          submitBtn.disabled = false;
          submitBtn.style.opacity = '1';
        }, 2000);
      });

      // Notification system
      function showNotification(message, type) {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
          <div style="
            position: fixed;
            top: 100px;
            right: 20px;
            background: ${type === 'success' ? 'var(--success)' : '#ef4444'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 12px;
            z-index: 2000;
            transform: translateX(300px);
            transition: transform 0.3s ease;
            box-shadow: var(--shadow);
            font-weight: 500;
            max-width: 300px;
          ">
            ${message}
          </div>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
          notification.firstElementChild.style.transform = 'translateX(0)';
        }, 100);
        
        setTimeout(() => {
          notification.firstElementChild.style.transform = 'translateX(300px)';
          setTimeout(() => {
            if (document.body.contains(notification)) {
              document.body.removeChild(notification);
            }
          }, 300);
        }, 4000);
      }

      // Enhanced spec tag interactions
      const specTags = document.querySelectorAll('.spec-tag');
      specTags.forEach((tag) => {
        tag.addEventListener('click', function () {
          // Remove active class from all tags
          specTags.forEach(t => t.classList.remove('active'));
          
          // Add active class to clicked tag
          this.classList.add('active');
          
          // Ripple effect
          const ripple = document.createElement('span');
          ripple.style.cssText = `
            position: absolute;
            border-radius: 50%;
            background: rgba(255,255,255,0.3);
            width: 100px;
            height: 100px;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%) scale(0);
            animation: ripple 0.6s ease-out;
            pointer-events: none;
          `;
          
          this.style.position = 'relative';
          this.appendChild(ripple);
          
          setTimeout(() => {
            if (ripple.parentNode) {
              ripple.remove();
            }
          }, 600);
        });
      });

      // Add ripple animation keyframes
      const style = document.createElement('style');
      style.textContent = `
        @keyframes ripple {
          to {
            transform: translate(-50%, -50%) scale(2);
            opacity: 0;
          }
        }
        
        .spec-tag.active {
          background: linear-gradient(135deg, var(--accent), var(--success));
          transform: scale(1.05);
        }
      `;
      document.head.appendChild(style);

      // Enhanced CTA button effects
      const ctaButtons = document.querySelectorAll('.cta-button');
      ctaButtons.forEach(button => {
        button.addEventListener('mouseenter', function() {
          this.style.transform = 'translateY(-3px) scale(1.02)';
        });
        
        button.addEventListener('mouseleave', function() {
          this.style.transform = 'translateY(0) scale(1)';
        });

        button.addEventListener('click', function(e) {
          // Create click ripple effect
          const rect = this.getBoundingClientRect();
          const ripple = document.createElement('span');
          const size = Math.max(rect.width, rect.height);
          const x = e.clientX - rect.left - size / 2;
          const y = e.clientY - rect.top - size / 2;
          
          ripple.style.cssText = `
            position: absolute;
            border-radius: 50%;
            background: rgba(255,255,255,0.4);
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            transform: scale(0);
            animation: buttonRipple 0.6s ease-out;
            pointer-events: none;
          `;
          
          this.style.position = 'relative';
          this.style.overflow = 'hidden';
          this.appendChild(ripple);
          
          setTimeout(() => {
            if (ripple.parentNode) {
              ripple.remove();
            }
          }, 600);
        });
      });

      // Add button ripple animation
      const buttonRippleStyle = document.createElement('style');
      buttonRippleStyle.textContent = `
        @keyframes buttonRipple {
          to {
            transform: scale(2);
            opacity: 0;
          }
        }
      `;
      document.head.appendChild(buttonRippleStyle);

      // Enhanced service card hover effects
      const serviceCards = document.querySelectorAll('.service-card');
      serviceCards.forEach((card, index) => {
        card.addEventListener('mouseenter', function () {
          // Add glow effect to nearby cards
          serviceCards.forEach((otherCard, otherIndex) => {
            if (Math.abs(otherIndex - index) === 1) {
              otherCard.style.transform = 'translateY(-4px) scale(1.01)';
              otherCard.style.opacity = '0.8';
            } else if (otherIndex !== index) {
              otherCard.style.opacity = '0.6';
            }
          });
        });

        card.addEventListener('mouseleave', function () {
          // Reset all cards
          serviceCards.forEach((otherCard) => {
            otherCard.style.opacity = '1';
            otherCard.style.transform = 'translateY(0) scale(1)';
          });
        });
      });

      // Resize handler
      window.addEventListener('resize', function () {
        if (window.innerWidth > 640) {
          navMenu.classList.remove('active');
          mobileMenuBtn.innerHTML = '☰';
          document.body.style.overflow = 'auto';
        }
      });

      // Page load animation
      window.addEventListener('load', function () {
        document.body.style.opacity = '0';
        document.body.style.transition = 'opacity 0.5s ease';
        
        setTimeout(() => {
          document.body.style.opacity = '1';
        }, 100);
      });

      // Preload images for better performance
      const imageUrls = [
        'images/temp.jpg',
        'images/roshan.jpg',
      ];

      imageUrls.forEach((url) => {
        const img = new Image();
        img.src = url;
      });

      // Enhanced form input animations
      const formInputs = document.querySelectorAll('.form-group input, .form-group textarea');
      formInputs.forEach(input => {
        const label = input.previousElementSibling;
        
        input.addEventListener('focus', () => {
          label.style.transform = 'translateY(-3px)';
          label.style.color = 'var(--primary)';
          label.style.fontSize = '0.85rem';
          input.style.borderWidth = '2px';
        });
        
        input.addEventListener('blur', () => {
          if (!input.value) {
            label.style.transform = 'translateY(0)';
            label.style.color = 'var(--text-primary)';
            label.style.fontSize = '0.9rem';
          }
          input.style.borderWidth = '1px';
        });
        
        input.addEventListener('input', () => {
          if (input.value) {
            label.style.transform = 'translateY(-3px)';
            label.style.color = 'var(--primary)';
            label.style.fontSize = '0.85rem';
          } else {
            label.style.transform = 'translateY(0)';
            label.style.color = 'var(--text-primary)';
            label.style.fontSize = '0.9rem';
          }
        });
      });

      // Smooth reveal animation for elements
      const revealElements = document.querySelectorAll('.service-card, .feature-item, .stat-card, .contact-item, .map-feature');
      
      const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              entry.target.style.opacity = '1';
              entry.target.style.transform = 'translateY(0) scale(1)';
            }, index * 100);
          }
        });
      }, { threshold: 0.1 });

      revealElements.forEach((el) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px) scale(0.95)';
        el.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
        revealObserver.observe(el);
      });

      // Close mobile menu when clicking outside
      document.addEventListener('click', function(e) {
        if (navMenu.classList.contains('active') && 
            !navMenu.contains(e.target) && 
            !mobileMenuBtn.contains(e.target)) {
          navMenu.classList.remove('active');
          mobileMenuBtn.innerHTML = '☰';
          document.body.style.overflow = 'auto';
        }
      });

      // Enhanced scroll-to-top functionality
      const scrollToTop = document.createElement('button');
      scrollToTop.innerHTML = '↑';
      scrollToTop.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background: linear-gradient(135deg, var(--primary), var(--secondary));
        color: white;
        border: none;
        font-size: 1.5rem;
        cursor: pointer;
        opacity: 0;
        transform: translateY(100px);
        transition: all 0.3s ease;
        z-index: 1000;
        box-shadow: var(--shadow);
      `;
      
      document.body.appendChild(scrollToTop);

      scrollToTop.addEventListener('click', () => {
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      });

      // Show/hide scroll to top button
      window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
          scrollToTop.style.opacity = '1';
          scrollToTop.style.transform = 'translateY(0)';
        } else {
          scrollToTop.style.opacity = '0';
          scrollToTop.style.transform = 'translateY(100px)';
        }
      });

      // Add hover effect to scroll to top button
      scrollToTop.addEventListener('mouseenter', () => {
        scrollToTop.style.transform = 'translateY(-5px) scale(1.1)';
        scrollToTop.style.boxShadow = 'var(--glow-primary)';
      });

      scrollToTop.addEventListener('mouseleave', () => {
        scrollToTop.style.transform = 'translateY(0) scale(1)';
        scrollToTop.style.boxShadow = 'var(--shadow)';
      });

      // Performance optimization: Reduce animations on mobile
      if (window.innerWidth <= 768) {
        // Reduce animation duration for mobile
        const style = document.createElement('style');
        style.textContent = `
          * {
            animation-duration: 0.3s !important;
            transition-duration: 0.3s !important;
          }
        `;
        document.head.appendChild(style);
      }

      // Console welcome message
      console.log(`
        🏋️ Welcome to Matador Fitness!
        💪 Redesigned with modern multi-color palette
        🎨 Mobile-first responsive design
        ⚡ Optimized performance and smooth interactions
        🌈 Indigo, Cyan, Amber & Emerald color scheme
      `);

    });