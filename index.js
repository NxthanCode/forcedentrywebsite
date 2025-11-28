
//ForcedEntry192
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




const downloadBtn = document.getElementById('downloadBtn');
const faqList = document.getElementById('faqList');

document.addEventListener('DOMContentLoaded', function() {
    initfaq();
    setuplistener();
    setupNav();
});

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
        if (link.getAttribute('href') === `${current}`) {
            link.classList.add('active');
        }
    });
}

window.addEventListener('scroll', updateNav);

function setupNav() {
    const navDownload = document.getElementById('navDownload');
    const navFaq = document.getElementById('navFaq');

    navDownload.addEventListener('click', (e) => {
        e.preventDefault();
        document.getElementById('download').scrollIntoView({
            behavior: 'smooth'
        });
    });
    navFaq.addEventListener('click', (e) => {
        e.preventDefault();
        document.getElementById('faq').scrollIntoView({
            behavior: 'smooth'
        });
    });
}


function setuplistener() {
    downloadBtn.addEventListener('click', startDownload);

    downloadBtn.addEventListener('keypress', function(e) {
        if (e.key === "Enter" || e.key === " ") {
            startDownload();
        }
    });
}

function initfaq() {
    faqData.forEach((faq, index) => {
        const faqItem = document.createElement('div');
        faqItem.className = 'faq-item';
        faqItem.style.animationDelay = `${index * 0.1}s`;

        faqItem.innerHTML = `
            <div class="faq-question" tabIndex="0">
                ${faq.question}
                <span class="faq-toggle">+</span>
            </div>
            <div class="faq-answer">
                ${faq.answer}
            </div>
        `;

        faqList.appendChild(faqItem);

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

function startDownload() {
    let progressbar = document.querySelector('.download-progress');
    if (!progressbar) {
        progressbar = document.createElement('div');
        progressbar.className = 'download-progress';
        progressbar.innerHTML = '<div class="progress-bar"></div>';
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
                showDownloadcomplete();
            }, 400);
        }
        progress.style.width = prog + "%";

    }, 100);

    const originalText = downloadBtn.innerHTML;
    downloadBtn.innerHTML = 'Downloading...'; 
    downloadBtn.disabled = true;

    setTimeout(() => {
        downloadBtn.innerHTML = originalText;
        downloadBtn.disabled = false;
    }, 4000);
}

function showDownloadcomplete() {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(45deg, #3b3b3bff, #f7f8f9ff);
        color: white;
        padding: 1rem 2rem;
        border-radius: 10px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        z-index: 1000;
        animation: slide 0.5s ease-out;
    `;




    setTimeout(() => {
        notification.style.animation = 'slideout 0.5s ease-in';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 500);
    }, 3000);
}

// Remove spin animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slide {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideout {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);
