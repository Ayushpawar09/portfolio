// ============================================
// UTILITIES
// ============================================
const raf = window.requestAnimationFrame.bind(window);

// ============================================
// PARTICLE BACKGROUND
// ============================================
class ParticleBackground {
    constructor() {
        this.canvas = document.getElementById('particleCanvas');
        this.ctx = this.canvas.getContext('2d', { alpha: true });
        this.particles = [];
        this.mouse = { x: -9999, y: -9999, radius: 120 };
        this.init();
    }

    init() {
        this.resize();
        this.createParticles();
        this.loop();

        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                this.resize();
                this.createParticles();
            }, 300);
        }, { passive: true });

        window.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
        }, { passive: true });
    }

    resize() {
        this.canvas.width  = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    createParticles() {
        const count = Math.min(
            Math.floor((this.canvas.width * this.canvas.height) / 20000),
            50
        );
        this.particles = Array.from({ length: count }, () => ({
            x:      Math.random() * this.canvas.width,
            y:      Math.random() * this.canvas.height,
            size:   Math.random() * 1.2 + 0.4,
            vx:     (Math.random() - 0.5) * 0.25,
            vy:     (Math.random() - 0.5) * 0.25,
            alpha:  Math.random() * 0.35 + 0.08
        }));
    }

    loop() {
        const ctx = this.ctx;
        const w   = this.canvas.width;
        const h   = this.canvas.height;

        ctx.clearRect(0, 0, w, h);

        for (let i = 0; i < this.particles.length; i++) {
            const p = this.particles[i];
            p.x += p.vx;
            p.y += p.vy;
            if (p.x < 0 || p.x > w) p.vx *= -1;
            if (p.y < 0 || p.y > h) p.vy *= -1;

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(99,102,241,${p.alpha})`;
            ctx.fill();

            for (let j = i + 1; j < this.particles.length; j++) {
                const p2   = this.particles[j];
                const dx   = p.x - p2.x;
                const dy   = p.y - p2.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 100) {
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(99,102,241,${0.05 * (1 - dist / 100)})`;
                    ctx.lineWidth   = 0.4;
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(p2.x, p2.y);
                    ctx.stroke();
                }
            }
        }

        raf(() => this.loop());
    }
}

// ============================================
// CUSTOM CURSOR
// ============================================
class CustomCursor {
    constructor() {
        this.follower = document.getElementById('cursorFollower');
        this.dot      = document.getElementById('cursorDot');
        this.mx = 0; this.my = 0;
        this.fx = 0; this.fy = 0;
        this.visible = false;
        this.init();
    }

    init() {
        if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
            this.follower.style.display = 'none';
            this.dot.style.display      = 'none';
            return;
        }

        document.addEventListener('mousemove', (e) => {
            this.mx = e.clientX;
            this.my = e.clientY;

            if (!this.visible) {
                this.visible = true;
                this.fx = this.mx;
                this.fy = this.my;
                this.follower.classList.add('active');
                this.dot.classList.add('active');
            }

            this.dot.style.transform =
                `translate(${this.mx - 4}px, ${this.my - 4}px)`;
        }, { passive: true });

        document.addEventListener('mouseleave', () => {
            this.follower.classList.remove('active');
            this.dot.classList.remove('active');
            this.visible = false;
        });

        const hoverEls = document.querySelectorAll(
            'a, button, .project-card, .skill-category, .contact-card'
        );
        hoverEls.forEach(el => {
            el.addEventListener('mouseenter', () =>
                this.follower.classList.add('hover'));
            el.addEventListener('mouseleave', () =>
                this.follower.classList.remove('hover'));
        });

        this.animateFollower();
    }

    animateFollower() {
        this.fx += (this.mx - this.fx) * 0.1;
        this.fy += (this.my - this.fy) * 0.1;

        this.follower.style.transform =
            `translate(${this.fx - 20}px, ${this.fy - 20}px)`;

        raf(() => this.animateFollower());
    }
}

// ============================================
// TYPING EFFECT
// ============================================
class TypingEffect {
    constructor() {
        this.el    = document.getElementById('typingText');
        this.words = [
            'Data Analyst',
            'SQL Expert',
            'Power BI Developer',
            'Python Enthusiast',
            'Problem Solver',
            'Dashboard Designer'
        ];
        this.wi        = 0;
        this.ci        = 0;
        this.deleting  = false;
        this.speed     = 100;
        setTimeout(() => this.tick(), 800);
    }

    tick() {
        const word = this.words[this.wi];

        if (this.deleting) {
            this.el.textContent = word.substring(0, --this.ci);
            this.speed = 45;
        } else {
            this.el.textContent = word.substring(0, ++this.ci);
            this.speed = 95;
        }

        if (!this.deleting && this.ci === word.length) {
            this.speed   = 2200;
            this.deleting = true;
        } else if (this.deleting && this.ci === 0) {
            this.deleting = false;
            this.wi       = (this.wi + 1) % this.words.length;
            this.speed    = 400;
        }

        setTimeout(() => this.tick(), this.speed);
    }
}

// ============================================
// NAVIGATION
// ============================================
class Navigation {
    constructor() {
        this.navbar    = document.getElementById('navbar');
        this.hamburger = document.getElementById('hamburger');
        this.mobileMenu = document.getElementById('mobileMenu');
        this.navLinks  = document.querySelectorAll('.nav-link');
        this.sections  = document.querySelectorAll('section[id]');
        this.ticking   = false;
        this.init();
    }

    init() {
        window.addEventListener('scroll', () => {
            if (!this.ticking) {
                raf(() => {
                    this.handleScroll();
                    this.ticking = false;
                });
                this.ticking = true;
            }
        }, { passive: true });

        this.hamburger.addEventListener('click', () => {
            const open = this.mobileMenu.classList.toggle('active');
            this.hamburger.classList.toggle('active', open);
            document.body.style.overflow = open ? 'hidden' : '';
        });

        document.querySelectorAll('.mobile-link').forEach(link => {
            link.addEventListener('click', () => {
                this.mobileMenu.classList.remove('active');
                this.hamburger.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }

    handleScroll() {
        const scrolled = window.scrollY > 50;
        this.navbar.classList.toggle('scrolled', scrolled);

        let current = '';
        this.sections.forEach(sec => {
            if (window.scrollY >= sec.offsetTop - 130) {
                current = sec.id;
            }
        });

        this.navLinks.forEach(link => {
            link.classList.toggle(
                'active',
                link.getAttribute('data-section') === current
            );
        });
    }
}

// ============================================
// SCROLL REVEAL
// ============================================
class ScrollReveal {
    constructor() {
        this.els = document.querySelectorAll(
            '.reveal-up, .reveal-left, .reveal-right'
        );
        this.init();
    }

    init() {
        const io = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;
                const delay = parseInt(entry.target.dataset.delay) || 0;
                setTimeout(() => entry.target.classList.add('revealed'), delay);
                io.unobserve(entry.target);
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

        this.els.forEach(el => io.observe(el));
    }
}

// ============================================
// SKILL BARS
// ============================================
class SkillBars {
    constructor() {
        this.bars = document.querySelectorAll(
            '.skill-progress, .edu-progress-fill'
        );
        this.init();
    }

    init() {
        const io = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;
                entry.target.style.width = entry.target.dataset.width + '%';
                io.unobserve(entry.target);
            });
        }, { threshold: 0.3 });

        this.bars.forEach(b => io.observe(b));
    }
}

// ============================================
// CONTACT FORM
// ============================================
class ContactForm {
    constructor() {
        this.form = document.getElementById('contactForm');
        if (this.form) {
            this.form.addEventListener('submit', (e) => this.submit(e));
        }
    }

    submit(e) {
        e.preventDefault();
        const d   = new FormData(this.form);
        const url = `mailto:pawarayush498@gmail.com`
            + `?subject=${encodeURIComponent(d.get('subject'))}`
            + `&body=${encodeURIComponent(
                `Name: ${d.get('name')}\nEmail: ${d.get('email')}\n\n${d.get('message')}`
            )}`;

        window.location.href = url;

        const btn  = this.form.querySelector('button[type="submit"]');
        const orig = btn.innerHTML;
        btn.innerHTML = '<span>Message Sent!</span><i class="fas fa-check"></i>';
        btn.style.background = 'linear-gradient(135deg,#10b981,#059669)';

        setTimeout(() => {
            btn.innerHTML    = orig;
            btn.style.background = '';
            this.form.reset();
        }, 3000);
    }
}

// ============================================
// SMOOTH SCROLL
// ============================================
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(a => {
        a.addEventListener('click', e => {
            e.preventDefault();
            const target = document.querySelector(a.getAttribute('href'));
            if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    });
}

// ============================================
// INIT
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    new Navigation();
    new TypingEffect();
    initSmoothScroll();

    setTimeout(() => {
        new ParticleBackground();
        new CustomCursor();
    }, 100);

    setTimeout(() => {
        new ScrollReveal();
        new SkillBars();
        new ContactForm();
    }, 200);
});