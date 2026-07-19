/* =========================================================
   R.D FITNESS A GYM — Main Script
   ========================================================= */
document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Loading Screen ---------- */
  const loadingScreen = document.getElementById('loading-screen');
  window.addEventListener('load', () => {
    setTimeout(() => loadingScreen.classList.add('hidden'), 500);
  });
  // Fallback in case load event already fired
  setTimeout(() => loadingScreen && loadingScreen.classList.add('hidden'), 2500);

  /* ---------- Scroll Progress Bar ---------- */
  const progressBar = document.getElementById('scroll-progress');
  function updateProgress(){
    const h = document.documentElement;
    const scrolled = (h.scrollTop) / (h.scrollHeight - h.clientHeight) * 100;
    progressBar.style.width = scrolled + '%';
  }
  document.addEventListener('scroll', updateProgress);

  /* ---------- Sticky Navbar ---------- */
  const header = document.getElementById('site-header');
  function updateHeader(){
    if(window.scrollY > 60) header.classList.add('scrolled');
    else header.classList.remove('scrolled');
  }
  document.addEventListener('scroll', updateHeader);
  updateHeader();

  /* ---------- Mobile Menu ---------- */
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');
  const menuOverlay = document.getElementById('menu-overlay');
  const mobileClose = document.getElementById('mobile-close');
  function openMenu(){ mobileMenu.classList.add('open'); menuOverlay.classList.add('show'); }
  function closeMenu(){ mobileMenu.classList.remove('open'); menuOverlay.classList.remove('show'); }
  hamburger && hamburger.addEventListener('click', openMenu);
  mobileClose && mobileClose.addEventListener('click', closeMenu);
  menuOverlay && menuOverlay.addEventListener('click', closeMenu);
  document.querySelectorAll('.mobile-menu a').forEach(a => a.addEventListener('click', closeMenu));

  /* ---------- Dark / Light Mode Toggle ---------- */
  const modeToggle = document.getElementById('mode-toggle');
  modeToggle && modeToggle.addEventListener('click', () => {
    document.body.classList.toggle('light-mode');
    modeToggle.textContent = document.body.classList.contains('light-mode') ? '🌙' : '☀️';
  });

  /* ---------- Ripple Effect ---------- */
  document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('click', function(e){
      const rect = this.getBoundingClientRect();
      const ripple = document.createElement('span');
      ripple.className = 'ripple';
      ripple.style.left = (e.clientX - rect.left) + 'px';
      ripple.style.top = (e.clientY - rect.top) + 'px';
      this.appendChild(ripple);
      setTimeout(() => ripple.remove(), 650);
    });
  });

  /* ---------- Back To Top ---------- */
  const topFab = document.getElementById('top-fab');
  document.addEventListener('scroll', () => {
    if(window.scrollY > 500) topFab.classList.add('show');
    else topFab.classList.remove('show');
  });
  topFab && topFab.addEventListener('click', () => window.scrollTo({top:0, behavior:'smooth'}));

  /* ---------- Mouse Glow (desktop only) ---------- */
  const glow = document.getElementById('mouse-glow');
  if(window.matchMedia('(min-width: 769px)').matches && glow){
    window.addEventListener('mousemove', e => {
      glow.style.opacity = '1';
      glow.style.left = e.clientX + 'px';
      glow.style.top = e.clientY + 'px';
    });
    window.addEventListener('mouseleave', () => glow.style.opacity = '0');
  }

  /* ---------- Scroll Reveal (IntersectionObserver) ---------- */
  const revealEls = document.querySelectorAll('.reveal, .reveal-scale');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        entry.target.classList.add('in');
        io.unobserve(entry.target);
      }
    });
  }, {threshold:0.15});
  revealEls.forEach(el => io.observe(el));

  /* ---------- Counter Animation ---------- */
  const counters = document.querySelectorAll('[data-count]');
  const counterIO = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        const el = entry.target;
        const target = parseFloat(el.dataset.count);
        const decimals = el.dataset.count.includes('.') ? 1 : 0;
        let cur = 0;
        const step = target / 60;
        const tick = () => {
          cur += step;
          if(cur >= target){ el.textContent = target.toFixed(decimals) + (el.dataset.suffix||''); return; }
          el.textContent = cur.toFixed(decimals) + (el.dataset.suffix||'');
          requestAnimationFrame(tick);
        };
        tick();
        counterIO.unobserve(el);
      }
    });
  }, {threshold:0.5});
  counters.forEach(c => counterIO.observe(c));

  /* ---------- Typing Animation ---------- */
  const typeEl = document.getElementById('typing-text');
  if(typeEl){
    const words = JSON.parse(typeEl.dataset.words || '[]');
    let wi = 0, ci = 0, deleting = false;
    function typeLoop(){
      const word = words[wi];
      if(!deleting){
        ci++;
        typeEl.textContent = word.slice(0, ci);
        if(ci === word.length){ deleting = true; setTimeout(typeLoop, 1400); return; }
      } else {
        ci--;
        typeEl.textContent = word.slice(0, ci);
        if(ci === 0){ deleting = false; wi = (wi+1) % words.length; }
      }
      setTimeout(typeLoop, deleting ? 45 : 90);
    }
    typeLoop();
  }

  /* ---------- Particles Background (hero canvas) ---------- */
  const canvas = document.getElementById('particles-canvas');
  if(canvas){
    const ctx = canvas.getContext('2d');
    let particles = [];
    function resize(){
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    }
    function initParticles(){
      particles = Array.from({length: 60}, () => ({
        x: Math.random()*canvas.width,
        y: Math.random()*canvas.height,
        r: Math.random()*1.8+0.4,
        vx: (Math.random()-0.5)*0.25,
        vy: (Math.random()-0.5)*0.25,
        o: Math.random()*0.5+0.15
      }));
    }
    function animate(){
      ctx.clearRect(0,0,canvas.width,canvas.height);
      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if(p.x<0) p.x=canvas.width; if(p.x>canvas.width) p.x=0;
        if(p.y<0) p.y=canvas.height; if(p.y>canvas.height) p.y=0;
        ctx.beginPath();
        ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
        ctx.fillStyle = `rgba(255,215,0,${p.o})`;
        ctx.fill();
      });
      requestAnimationFrame(animate);
    }
    window.addEventListener('resize', () => { resize(); initParticles(); });
    resize(); initParticles(); animate();
  }

  /* ---------- Transformation Before/After Slider ---------- */
  const transformInput = document.getElementById('transform-range');
  const afterEl = document.getElementById('transform-after');
  const handle = document.getElementById('transform-handle');
  if(transformInput){
    transformInput.addEventListener('input', () => {
      const v = transformInput.value;
      afterEl.style.clipPath = `inset(0 ${100-v}% 0 0)`;
      handle.style.left = v + '%';
    });
  }

  /* ---------- BMI Calculator ---------- */
  const bmiForm = document.getElementById('bmi-form');
  if(bmiForm){
    bmiForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const heightCm = parseFloat(document.getElementById('bmi-height').value);
      const weightKg = parseFloat(document.getElementById('bmi-weight').value);
      const result = document.getElementById('bmi-result');
      if(!heightCm || !weightKg || heightCm <= 0 || weightKg <= 0){
        result.classList.remove('show');
        return;
      }
      const heightM = heightCm/100;
      const bmi = weightKg / (heightM*heightM);
      let category, tip;
      if(bmi < 18.5){ category = 'Underweight'; tip = 'Focus on strength training and a calorie surplus with quality protein.'; }
      else if(bmi < 25){ category = 'Healthy Range'; tip = 'Great work — maintain with balanced training and nutrition.'; }
      else if(bmi < 30){ category = 'Overweight'; tip = 'A mix of cardio, strength training and a slight calorie deficit will help.'; }
      else { category = 'Obese'; tip = 'Start with low-impact cardio and consult our trainers for a guided plan.'; }
      result.querySelector('.big').textContent = bmi.toFixed(1);
      result.querySelector('.cat').textContent = category + ' — ' + tip;
      result.classList.add('show');
    });
  }

  /* ---------- Calorie / Workout Calculator ---------- */
  const calForm = document.getElementById('calorie-form');
  if(calForm){
    const MET = { cardio: 8, strength: 6, hiit: 10, yoga: 3, crossfit: 9, cycling: 7.5 };
    calForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const weight = parseFloat(document.getElementById('cal-weight').value);
      const duration = parseFloat(document.getElementById('cal-duration').value);
      const type = document.getElementById('cal-type').value;
      const result = document.getElementById('cal-result');
      if(!weight || !duration || weight<=0 || duration<=0){ result.classList.remove('show'); return; }
      const met = MET[type] || 6;
      const calories = (met * 3.5 * weight / 200) * duration;
      result.querySelector('.big').textContent = Math.round(calories) + ' kcal';
      result.querySelector('.cat').textContent = `Estimated burn for ${duration} min of ${type}`;
      result.classList.add('show');
    });
  }

  /* ---------- Gallery Filter ---------- */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      galleryItems.forEach(item => {
        item.style.display = (filter === 'all' || item.dataset.cat === filter) ? '' : 'none';
      });
    });
  });

  /* ---------- Lightbox ---------- */
  const lightbox = document.getElementById('lightbox');
  const lightboxBox = document.getElementById('lightbox-box');
  const lightboxClose = document.getElementById('lightbox-close');
  galleryItems.forEach(item => {
    item.addEventListener('click', () => {
      lightboxBox.textContent = item.dataset.label || '';
      lightboxBox.style.background = getComputedStyle(item).background;
      lightbox.classList.add('show');
    });
  });
  lightboxClose && lightboxClose.addEventListener('click', () => lightbox.classList.remove('show'));
  lightbox && lightbox.addEventListener('click', (e) => { if(e.target === lightbox) lightbox.classList.remove('show'); });

  /* ---------- Testimonials Slider ---------- */
  const track = document.getElementById('testi-track');
  const dotsWrap = document.getElementById('testi-dots');
  if(track){
    const slides = track.children.length;
    let idx = 0;
    for(let i=0;i<slides;i++){
      const dot = document.createElement('button');
      if(i===0) dot.classList.add('active');
      dot.addEventListener('click', () => goTo(i));
      dotsWrap.appendChild(dot);
    }
    function goTo(i){
      idx = i;
      track.style.transform = `translateX(-${i*100}%)`;
      [...dotsWrap.children].forEach((d,di) => d.classList.toggle('active', di===i));
    }
    setInterval(() => { goTo((idx+1)%slides); }, 5000);
  }

  /* ---------- FAQ Accordion ---------- */
  document.querySelectorAll('.faq-item').forEach(item => {
    const q = item.querySelector('.faq-q');
    const a = item.querySelector('.faq-a');
    q.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item').forEach(i => {
        i.classList.remove('open');
        i.querySelector('.faq-a').style.maxHeight = null;
      });
      if(!isOpen){
        item.classList.add('open');
        a.style.maxHeight = a.scrollHeight + 'px';
      }
    });
  });

  /* ---------- Contact Form Validation ---------- */
  const contactForm = document.getElementById('contact-form');
  if(contactForm){
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      let valid = true;
      const name = document.getElementById('cf-name');
      const phone = document.getElementById('cf-phone');
      const email = document.getElementById('cf-email');
      const message = document.getElementById('cf-message');
      const msgBox = document.getElementById('form-msg');

      [name, phone, email, message].forEach(f => f.closest('.field').classList.remove('invalid'));

      if(name.value.trim().length < 2){ name.closest('.field').classList.add('invalid'); valid = false; }
      if(!/^[0-9+\-\s]{7,15}$/.test(phone.value.trim())){ phone.closest('.field').classList.add('invalid'); valid = false; }
      if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())){ email.closest('.field').classList.add('invalid'); valid = false; }
      if(message.value.trim().length < 5){ message.closest('.field').classList.add('invalid'); valid = false; }

      if(!valid){
        msgBox.textContent = 'Please fix the highlighted fields and try again.';
        msgBox.className = 'form-msg error';
        return;
      }
      msgBox.textContent = `Thanks, ${name.value.trim()}! Your message has been received — our team will call you back shortly.`;
      msgBox.className = 'form-msg success';
      contactForm.reset();
    });
  }

  /* ---------- Newsletter Form ---------- */
  const newsletterForm = document.getElementById('newsletter-form');
  if(newsletterForm){
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = newsletterForm.querySelector('input');
      if(input.value.trim()){
        input.value = '';
        input.placeholder = 'Subscribed! ✓';
      }
    });
  }

});
