// ===== Theme Toggle =====
const themeToggle = document.getElementById('themeToggle');
const htmlElement = document.documentElement;

// Load saved theme
const savedTheme = localStorage.getItem('theme') || 'dark';
htmlElement.setAttribute('data-theme', savedTheme);

themeToggle.addEventListener('click', () => {
    const currentTheme = htmlElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    htmlElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    
    // Recreate charts with new theme colors
    if (window.skillsChartInstance) {
        updateChartsTheme();
    }
});

// ===== Resume Download Functions =====
function downloadResume() {
    const link = document.createElement('a');
    link.href = './Ayush_Pawar_Resume.pdf';
    link.download = 'Ayush_Pawar_Resume.pdf';
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Show success message
    showNotification('✅ Resume download started!', 'success');
}

function viewResume() {
    window.open('./Ayush_Pawar_Resume.pdf', '_blank');
}

// ===== Notification System =====
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => notification.classList.add('show'), 100);
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// ===== Typing Animation =====
const typingText = document.querySelector('.typing-text');
const words = ['Data Analyst', 'SQL Expert', 'Power BI Developer', 'Python Enthusiast', 'Problem Solver'];
let wordIndex = 0;
let charIndex = 0;
let isDeleting = false;

function type() {
    const currentWord = words[wordIndex];
    
    if (isDeleting) {
        typingText.textContent = currentWord.substring(0, charIndex - 1);
        charIndex--;
    } else {
        typingText.textContent = currentWord.substring(0, charIndex + 1);
        charIndex++;
    }
    
    let typeSpeed = isDeleting ? 50 : 100;
    
    if (!isDeleting && charIndex === currentWord.length) {
        typeSpeed = 2000;
        isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        wordIndex = (wordIndex + 1) % words.length;
        typeSpeed = 500;
    }
    
    setTimeout(type, typeSpeed);
}

document.addEventListener('DOMContentLoaded', () => {
    type();
    initCharts();
    animateCounters();
    animateImpactCounters();
});

// ===== Mobile Menu Toggle =====
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
});

document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
    });
});

// ===== Navbar Scroll Effect =====
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    const scrollTopBtn = document.getElementById('scrollTop');
    
    if (window.scrollY > 50) {
        navbar.style.padding = '15px 0';
    } else {
        navbar.style.padding = '20px 0';
    }
    
    if (window.scrollY > 500) {
        scrollTopBtn.classList.add('visible');
    } else {
        scrollTopBtn.classList.remove('visible');
    }
});

// ===== Scroll to Top =====
document.getElementById('scrollTop').addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ===== Intersection Observer for Animations =====
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

document.querySelectorAll('.skill-card, .project-card, .timeline-item, .contact-card, .chart-card, .impact-card').forEach(el => {
    el.classList.add('fade-in');
    observer.observe(el);
});

// ===== Smooth Scroll =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            window.scrollTo({
                top: target.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    });
});

// ===== Animated Counters (Hero Stats) =====
function animateCounters() {
    const counters = document.querySelectorAll('.stat-item h3');
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseFloat(counter.getAttribute('data-count'));
                const text = counter.textContent;
                const prefix = text.includes('$') ? '$' : '';
                const suffix = text.includes('M') ? 'M' : text.includes('K') ? 'K+' : '+';
                let count = 0;
                const increment = target / 50;
                
                const updateCount = () => {
                    if (count < target) {
                        count += increment;
                        counter.textContent = prefix + count.toFixed(target < 10 ? 1 : 0) + suffix;
                        setTimeout(updateCount, 30);
                    } else {
                        counter.textContent = prefix + target + suffix;
                    }
                };
                updateCount();
                counterObserver.unobserve(counter);
            }
        });
    }, { threshold: 0.5 });
    
    counters.forEach(counter => counterObserver.observe(counter));
}

// ===== Animated Impact Counters (NEW) =====
function animateImpactCounters() {
    const counters = document.querySelectorAll('.impact-card [data-target]');
    
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseFloat(counter.getAttribute('data-target'));
                const suffix = counter.getAttribute('data-suffix') || '';
                const isDecimal = counter.hasAttribute('data-decimal');
                const duration = 2000;
                const startTime = performance.now();
                
                const updateCount = (currentTime) => {
                    const elapsed = currentTime - startTime;
                    const progress = Math.min(elapsed / duration, 1);
                    const easeOut = 1 - Math.pow(1 - progress, 3);
                    const current = target * easeOut;
                    
                    if (isDecimal) {
                        counter.textContent = current.toFixed(1) + suffix;
                    } else {
                        counter.textContent = Math.floor(current) + suffix;
                    }
                    
                    if (progress < 1) {
                        requestAnimationFrame(updateCount);
                    } else {
                        counter.textContent = (isDecimal ? target.toFixed(1) : target) + suffix;
                    }
                };
                
                requestAnimationFrame(updateCount);
                counterObserver.unobserve(counter);
            }
        });
    }, { threshold: 0.3 });
    
    counters.forEach(counter => counterObserver.observe(counter));
}

// ===== CHARTS =====
function getChartColors() {
    const theme = htmlElement.getAttribute('data-theme');
    return {
        text: theme === 'dark' ? '#8badd6' : '#4a6fa5',
        grid: theme === 'dark' ? 'rgba(76, 201, 240, 0.1)' : 'rgba(4, 102, 200, 0.1)',
        primary: '#0466c8',
        secondary: '#00b4d8',
        accent: '#4cc9f0'
    };
}

function initCharts() {
    const colors = getChartColors();
    
    // Skills Radar Chart
    const skillsCtx = document.getElementById('skillsChart');
    if (skillsCtx) {
        window.skillsChartInstance = new Chart(skillsCtx, {
            type: 'radar',
            data: {
                labels: ['SQL', 'Python', 'Power BI', 'DAX', 'PostgreSQL', 'Excel'],
                datasets: [{
                    label: 'Proficiency Level',
                    data: [90, 85, 92, 88, 87, 95],
                    backgroundColor: 'rgba(76, 201, 240, 0.2)',
                    borderColor: '#4cc9f0',
                    borderWidth: 2,
                    pointBackgroundColor: '#0466c8',
                    pointBorderColor: '#fff',
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: '#0466c8',
                    pointRadius: 5
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    r: {
                        beginAtZero: true,
                        max: 100,
                        ticks: { 
                            color: colors.text,
                            backdropColor: 'transparent'
                        },
                        grid: { color: colors.grid },
                        angleLines: { color: colors.grid },
                        pointLabels: { 
                            color: colors.text,
                            font: { size: 12, weight: '600' }
                        }
                    }
                },
                plugins: {
                    legend: {
                        labels: { color: colors.text }
                    }
                }
            }
        });
    }
    
    // Projects Doughnut Chart
    const projectsCtx = document.getElementById('projectsChart');
    if (projectsCtx) {
        window.projectsChartInstance = new Chart(projectsCtx, {
            type: 'doughnut',
            data: {
                labels: ['SaaS Analytics', 'Music Analytics', 'HR Analytics', 'Other'],
                datasets: [{
                    data: [40, 25, 25, 10],
                    backgroundColor: [
                        '#0466c8',
                        '#00b4d8',
                        '#4cc9f0',
                        '#003566'
                    ],
                    borderColor: 'transparent',
                    borderWidth: 0,
                    hoverOffset: 15
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: { 
                            color: colors.text,
                            padding: 15,
                            font: { size: 12 }
                        }
                    }
                }
            }
        });
    }
}

function updateChartsTheme() {
    const colors = getChartColors();
    
    if (window.skillsChartInstance) {
        window.skillsChartInstance.options.scales.r.ticks.color = colors.text;
        window.skillsChartInstance.options.scales.r.pointLabels.color = colors.text;
        window.skillsChartInstance.options.scales.r.grid.color = colors.grid;
        window.skillsChartInstance.options.scales.r.angleLines.color = colors.grid;
        window.skillsChartInstance.options.plugins.legend.labels.color = colors.text;
        window.skillsChartInstance.update();
    }
    
    if (window.projectsChartInstance) {
        window.projectsChartInstance.options.plugins.legend.labels.color = colors.text;
        window.projectsChartInstance.update();
    }
}

// ===== Testimonials Slider =====
const testimonialCards = document.querySelectorAll('.testimonial-card');
const dotIndicators = document.querySelectorAll('.dot-indicator');
let currentTestimonial = 0;

function showTestimonial(index) {
    testimonialCards.forEach((card, i) => {
        card.classList.remove('active');
        if (i === index) card.classList.add('active');
    });
    
    dotIndicators.forEach((dot, i) => {
        dot.classList.remove('active');
        if (i === index) dot.classList.add('active');
    });
    
    currentTestimonial = index;
}

dotIndicators.forEach(dot => {
    dot.addEventListener('click', () => {
        const index = parseInt(dot.getAttribute('data-index'));
        showTestimonial(index);
    });
});

// Auto-rotate testimonials
setInterval(() => {
    const nextIndex = (currentTestimonial + 1) % testimonialCards.length;
    showTestimonial(nextIndex);
}, 5000);