//ForcedEntry192- Hunterz192 
const faqData = [
    {
        question: "What is Forced Entry?",
        answer: `Forced Entry is a fast-paced FPS shooter developed by Hunterz, featuring intense knockout-style gameplay and multiple competitive modes.`
    },
    {
        question: "What game modes are available in Forced Entry?",
        answer: `
            Forced Entry features multiple knockout-style modes:<br><br>
            <ul>
                <li><b>5v5 Team Knockout:</b> Teams of five battle until one team remains.</li>
                <li><b>Five Team 2v2 Knockout:</b> 5 teams of 2 players each compete to be the last team standing.</li>
                <li><b>Solo Knockout:</b> Every player fights for themselves until only one remains.</li>
                <li><b>Deathmatch:</b> Fighting and respawning until 20 kills get reached.</li>
            </ul>
        `
    },
    {
        question: "How many players can join a match?",
        answer: `Depending on the mode, matches support 10 players (Free-for-All or 5v5), or 10 teams of 2 players each.`
    },
    {
        question: "How can I report bugs or give feedback?",
        answer: `You can reach us at <b>forcedentry.game@gmail.com</b>.`
    },
    {
        question: "Can I play solo or only with friends?",
        answer: `Forced Entry supports both solo matchmaking and team play with friends.`
    },
];
document.addEventListener('DOMContentLoaded', function() {
    initFaq();
    setupListeners();
    setupNav();
    startTypewriter();
});
function initFaq() {
    faqData.forEach((faq, index) => {
        const faqItem = document.createElement('div');
        faqItem.className = 'faq-item';
        faqItem.style.animationDelay = `${index * 0.1}s`;
        faqItem.innerHTML = `
            <div class="faq-question" tabindex="0">
                ${faq.question}
                <span class="faq-toggle">+</span>
            </div>
            <div class="faq-answer">
                ${faq.answer}
            </div>
        `;
        document.getElementById('faqList').appendChild(faqItem);
        const question = faqItem.querySelector('.faq-question');
        question.addEventListener('click', () => toggleFaq(faqItem));
        question.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                toggleFaq(faqItem);
            }
        });
    });
}
function toggleFaq(faqItem) {
    const isActive = faqItem.classList.contains('active');
    const answer = faqItem.querySelector('.faq-answer');
    if (!isActive) {
        faqItem.classList.add('active');
        answer.classList.add('active');
    } else {
        faqItem.classList.remove('active');
        answer.classList.remove('active');
    }
}
function setupListeners() {
    const downloadBtn = document.getElementById('downloadBtn');
    if (downloadBtn) {
        downloadBtn.addEventListener('click', startDownload);
        downloadBtn.addEventListener('keypress', function(e) {
            if (e.key === "Enter" || e.key === " ") {
                startDownload();
            }
        });
    }
}
function startDownload() {
    let progressbar = document.querySelector('.download-progress');
    if (!progressbar) {
        progressbar = document.createElement('div');
        progressbar.className = 'download-progress';
        progressbar.innerHTML = '<div class="progress-bar"></div>';
        const downloadBtn = document.getElementById('downloadBtn');
        downloadBtn.parentNode.insertBefore(progressbar, downloadBtn.nextSibling);
    }
    const progress = progressbar.querySelector('.progress-bar');
    progressbar.style.display = 'block';
    let prog = 0;
    const interval = setInterval(() => {
        prog += Math.random() * 12;
        if (prog >= 100) {
            prog = 100;
            clearInterval(interval);
            setTimeout(() => {
                progressbar.style.display = 'none';
                progress.style.width = '0%';
                showDownloadComplete();
            }, 400);
        }
        progress.style.width = prog + "%";
    }, 100);
    const downloadBtn = document.getElementById('downloadBtn');
    const originalText = downloadBtn.innerHTML;
    downloadBtn.innerHTML = '<i class="fas fa-download"></i> Downloading...';
    downloadBtn.disabled = true;
    setTimeout(() => {
        downloadBtn.innerHTML = originalText;
        downloadBtn.disabled = false;
    }, 4000);
}
function showDownloadComplete() {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(45deg, #3b3b3b, #f7f8f9);
        color: #000;
        padding: 1rem 2rem;
        border-radius: 10px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        z-index: 1000;
        animation: slideIn 0.5s ease-out;
        font-weight: 600;
    `;
    notification.innerHTML = '<i class="fas fa-check-circle"></i> Download Complete!';
    document.body.appendChild(notification);
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.5s ease-in';
        setTimeout(() => {
            if (notification.parentNode) {
                document.body.removeChild(notification);
            }
        }, 500);
    }, 3000);
}
function updateNav() {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= sectionTop && pageYOffset < sectionTop + sectionHeight) {
            current = section.getAttribute('id');
        }
    });
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
}
function setupNav() {
    const navDownload = document.getElementById('navDownload');
    const navFaq = document.getElementById('navFaq');
    const navUpdates = document.getElementById('navUpdates');
    if (navDownload) {
        navDownload.addEventListener('click', (e) => {
            e.preventDefault();
            document.getElementById('download').scrollIntoView({
                behavior: 'smooth'
            });
        });
    }
    if (navUpdates) {
        navUpdates.addEventListener('click', (e) => {
            e.preventDefault();
            document.getElementById('updates').scrollIntoView({
                behavior: 'smooth'
            });
        });
    }
    if (navFaq) {
        navFaq.addEventListener('click', (e) => {
            e.preventDefault();
            document.getElementById('faq').scrollIntoView({
                behavior: 'smooth'
            });
        });
    }
    window.addEventListener('scroll', updateNav);
}
const phrases = [
    "Fast. Precise. Lethal.",
    "No Respawn. No Mercy.",
    "Knockout or Be Knocked.",
    "Enter. Fight. Survive."
];
function startTypewriter() {
    const typewriterElement = document.getElementById('typewriter');
    if (!typewriterElement) return;
    let phraseIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;
    function type() {
        const currentPhrase = phrases[phraseIndex];
        if (isDeleting) {
            typewriterElement.textContent = currentPhrase.substring(0, typewriterElement.textContent.length - 1);
            typingSpeed = 50;
        } else {
            typewriterElement.textContent = currentPhrase.substring(0, typewriterElement.textContent.length + 1);
            typingSpeed = 100;
        }
        if (!isDeleting && typewriterElement.textContent === currentPhrase) {
            typingSpeed = 2000; 
            isDeleting = true;
        } 
        else if (isDeleting && typewriterElement.textContent === '') {
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
            typingSpeed = 500; 
        }
        setTimeout(type, typingSpeed);
    }
    type();
}
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
    .download-progress {
        width: 100%;
        height: 4px;
        background: rgba(255, 255, 255, 0.1);
        border-radius: 2px;
        margin-top: 1rem;
        overflow: hidden;
        display: none;
    }
    .progress-bar {
        height: 100%;
        background: linear-gradient(45deg, #ffffff, #999999);
        width: 0%;
        transition: width 0.3s ease;
    }
`;
document.head.appendChild(style);
