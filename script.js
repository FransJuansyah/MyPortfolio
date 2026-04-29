// 1. STARFIELD ANIMATION
const canvas = document.getElementById('starfield');
const ctx = canvas.getContext('2d');
let stars = [];
let w, h;

function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
    
    // Pastikan bintang mengisi ulang area baru saat resize
    if (stars.length > 0) {
        stars.forEach(s => {
            s.x = Math.random() * w;
            s.y = Math.random() * h;
        });
    }
}

window.addEventListener('resize', resize);
resize();

class Star {
    constructor() {
        this.reset();
    }
    reset() {
        this.x = Math.random() * w;
        this.y = Math.random() * h;
        this.size = Math.random() * 2 + 0.5;
        this.opacity = Math.random() * 0.5 + 0.3;
        this.speed = Math.random() * 0.05 + 0.01;
        this.angle = Math.random() * Math.PI * 2;
    }
    update() {
        this.angle += this.speed;
        this.curOpacity = this.opacity + Math.sin(this.angle) * 0.3;
    }
    draw() {
        ctx.fillStyle = `rgba(255, 255, 255, ${this.curOpacity})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

for (let i = 0; i < 200; i++) stars.push(new Star());

// Parallax Mouse Effect
let mX = 0, mY = 0;
window.addEventListener('mousemove', (e) => {
    mX = (e.clientX - w / 2) * 0.05;
    mY = (e.clientY - h / 2) * 0.05;
});

function animate() {
    ctx.clearRect(0, 0, w, h);
    stars.forEach(s => {
        s.update();
        ctx.save();
        ctx.translate(mX * (s.size / 2), mY * (s.size / 2));
        s.draw();
        ctx.restore();
    });
    requestAnimationFrame(animate);
}
animate();

// 2. SMOOTH CUSTOM CURSOR
const dot = document.getElementById('cursor-dot');
const ring = document.getElementById('cursor-ring');
let curX = 0, curY = 0, targetX = 0, targetY = 0;

window.addEventListener('mousemove', (e) => {
    targetX = e.clientX;
    targetY = e.clientY;
});

function updateCursor() {
    if (!dot || !ring) return; // Safety check
    
    if (window.innerWidth <= 1024) return; // Nonaktifkan di mobile

    curX += (targetX - curX) * 0.15;
    curY += (targetY - curY) * 0.15;
    
    dot.style.left = targetX + 'px';
    dot.style.top = targetY + 'px';
    ring.style.left = curX + 'px';
    ring.style.top = curY + 'px';
    
    requestAnimationFrame(updateCursor);
}
updateCursor();

document.querySelectorAll('a, button, .work-card').forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
});

// 3. INTERSECTION OBSERVER (Scroll Reveals)
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
            if (entry.target.querySelector('.counter')) {
                animateCounters(entry.target);
            }
        }
    });
}, { threshold: 0.15 });

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

function animateCounters(container) {
    const counters = container.querySelectorAll('.counter');
    counters.forEach(c => {
        const target = +c.getAttribute('data-target');
        let now = 0;
        const update = () => {
        const step = target / 30;
            if (now < target) {
                now += step;
            c.innerText = Math.floor(now);
            setTimeout(update, 40);
            } else {
            c.innerText = target + (target === 50 ? "+" : "");
            }
        };
        update();
    });
}

// 4. NAVBAR BEHAVIOR
window.addEventListener('scroll', () => {
    const nav = document.getElementById('navbar');
    nav.classList.toggle('scrolled', window.scrollY > 50);
});

// 5. PORTFOLIO FILTER
const filterBtns = document.querySelectorAll('.filter-btn');
const items = document.querySelectorAll('.work-card');

// Initialize: Show 'design' category by default and hide others
window.addEventListener('DOMContentLoaded', () => {
    const defaultFilter = 'web';
    items.forEach(item => {
        if (item.dataset.cat === defaultFilter) {
            item.style.display = 'block';
            item.style.opacity = '1';
        } else {
            item.style.display = 'none';
            item.style.opacity = '0';
        }
    });
});

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        const f = btn.dataset.filter;
        items.forEach(item => {
            if (item.dataset.cat === f) {
                item.style.display = 'block';
                setTimeout(() => item.style.opacity = '1', 10);
            } else {
                item.style.opacity = '0';
                item.style.display = 'none';
            }
        });
    });
});

// 6. LETTER REVEAL ANIMATION
const title = document.getElementById('reveal-title');
if (title) {
    const textContent = title.innerHTML;
    title.innerHTML = '';
    let charCounter = 0;
    
    const processNode = (html) => {
        const temp = document.createElement('div');
        temp.innerHTML = html;
        return Array.from(temp.childNodes).map(node => {
            if (node.nodeType === 3) {
                return node.textContent.split('').map(char => 
                    `<span class="letter" style="animation-delay: ${0.03 * charCounter++}s">${char === ' ' ? '&nbsp;' : char}</span>`
                ).join('');
            } else {
                node.innerHTML = processNode(node.innerHTML);
                return node.outerHTML;
            }
        }).join('');
    };
    title.innerHTML = processNode(textContent);
}

// 7. MOBILE MENU TOGGLE
const ham = document.getElementById('hamburger');
const close = document.getElementById('close-menu');
const mobileOverlay = document.getElementById('mobile-overlay');

if (ham && mobileOverlay) {
    ham.addEventListener('click', () => mobileOverlay.classList.add('active'));
    close.addEventListener('click', () => mobileOverlay.classList.remove('active'));
    document.querySelectorAll('.m-link').forEach(link => {
        link.addEventListener('click', () => mobileOverlay.classList.remove('active'));
    });
}

// 8. WHATSAPP FORM INTEGRATION
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Mengambil data dari input
        const name = this.querySelector('input[type="text"]').value;
        const email = this.querySelector('input[type="email"]').value;
        const message = this.querySelector('textarea').value;
        
        // SILAKAN GANTI NOMOR DI BAWAH INI (Gunakan kode negara tanpa '+', misal: 628123456789)
        const phoneNumber = "6281366412499"; 
        
        const text = `Halo Frans!\n\nAda pesan baru dari portofolio:\n\nNama: ${name}\nEmail: ${email}\n\nPesan:\n${message}`;
        const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(text)}`;
        
        window.open(whatsappUrl, '_blank');
    });
}