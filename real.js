  // Mouse trailer effect
  const mouseTrailer = document.querySelector('.mouse-trailer');
  let mouseX = 0, mouseY = 0;
  let trailerX = 0, trailerY = 0;

  document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      
      // Create particle on mouse move
      if (Math.random() > 0.8) {
          createParticle(e.clientX, e.clientY);
      }
  });

  function animate() {
      let dx = mouseX - trailerX;
      let dy = mouseY - trailerY;
      
      trailerX += dx * 0.1;
      trailerY += dy * 0.1;
      
      mouseTrailer.style.transform = `translate(${trailerX}px, ${trailerY}px)`;
      
      requestAnimationFrame(animate);
  }
  animate();

  // Particle effect
  function createParticle(x, y) {
      const particle = document.createElement('div');
      particle.className = 'tech-particle';
      particle.style.left = x + 'px';
      particle.style.top = y + 'px';
      
      document.querySelector('.particles-container').appendChild(particle);
      
      // Animate particle
      requestAnimationFrame(() => {
          particle.style.opacity = '0.5';
          particle.style.transform = `
              translate(
                  ${(Math.random() - 0.5) * 100}px,
                  ${(Math.random() - 0.5) * 100}px
              )
          `;
      });
      
      setTimeout(() => particle.remove(), 1000);
  }

  // Floating tech icons
  const techIcons = ['⚡', '💻', '🔧', '🚀', '⚙️', '📱', '🛹','🛵'];
  function createFloatingIcons() {
      const container = document.querySelector('.floating-icons');
      
      for (let i = 0; i < 20; i++) {
          const icon = document.createElement('div');
          icon.className = 'tech-icon';
          icon.textContent = techIcons[Math.floor(Math.random() * techIcons.length)];
          
          icon.style.left = `${Math.random() * 100}%`;
          icon.style.top = `${Math.random() * 100}%`;
          icon.style.animationDelay = `${Math.random() * 5}s`;
          
          container.appendChild(icon);
      }
  }
  createFloatingIcons();

  // Button hover effects
  document.querySelectorAll('.cta-button').forEach(button => {
      button.addEventListener('mouseover', () => {
          createParticle(
              button.getBoundingClientRect().left + button.offsetWidth / 2,
              button.getBoundingClientRect().top + button.offsetHeight / 2
          );
      });
  });