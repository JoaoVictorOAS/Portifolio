// Update year in footer
document.addEventListener('DOMContentLoaded', function() {
    const yearElement = document.getElementById('year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Add animation on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe all cards
    document.querySelectorAll('.skill-card, .project-card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        observer.observe(card);
    });

    buildTimelineRiver();
});

function buildTimelineRiver() {
    const container = document.querySelector('.timeline-river-container');
    if (!container) return;

    const ns = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(ns, 'svg');
    svg.classList.add('tl-river-svg');

    const glowPath = document.createElementNS(ns, 'path');
    glowPath.classList.add('river-glow');

    const mainPath = document.createElementNS(ns, 'path');
    mainPath.classList.add('river-main');

    svg.appendChild(glowPath);
    svg.appendChild(mainPath);
    container.insertBefore(svg, container.firstChild);

    function update() {
        const cr = container.getBoundingClientRect();
        const W = cr.width;
        const H = cr.height;

        svg.setAttribute('width', W);
        svg.setAttribute('height', H);
        svg.setAttribute('viewBox', `0 0 ${W} ${H}`);

        const dots = container.querySelectorAll('.tl-dot');
        const isMobile = window.innerWidth <= 768;

        const pts = Array.from(dots).map(dot => {
            const r = dot.getBoundingClientRect();
            return {
                x: r.left - cr.left + r.width / 2,
                y: r.top - cr.top + r.height / 2
            };
        });

        if (!pts.length) return;

        const cx = pts[0].x;
        const bendX = isMobile ? 0 : Math.min(cx * 0.28, 85);

        let d = `M ${cx} 0 L ${cx} ${pts[0].y}`;

        for (let i = 0; i < pts.length - 1; i++) {
            const p1 = pts[i];
            const p2 = pts[i + 1];
            const h = p2.y - p1.y;

            if (isMobile || bendX === 0) {
                d += ` L ${cx} ${p2.y}`;
            } else {
                // Alternate bends: even → right, odd → left
                const bx = i % 2 === 0 ? cx + bendX : cx - bendX;
                d += ` C ${bx} ${p1.y + h * 0.3}, ${bx} ${p1.y + h * 0.7}, ${cx} ${p2.y}`;
            }
        }

        d += ` L ${cx} ${H}`;

        mainPath.setAttribute('d', d);
        mainPath.setAttribute('stroke-width', isMobile ? 2.5 : 5);
        glowPath.setAttribute('d', d);
        glowPath.setAttribute('stroke-width', isMobile ? 7 : 18);
    }

    update();

    let timer;
    window.addEventListener('resize', () => {
        clearTimeout(timer);
        timer = setTimeout(update, 80);
    });
}
