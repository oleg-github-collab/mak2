/**
 * Головний JavaScript файл для сайту Roots & Wings
 * Метафоричні асоціативні карти
 */

// Глобальна змінна для функції оновлення каруселі
let updateCarouselGlobal;

// Очікуємо завантаження DOM перед ініціалізацією скриптів
document.addEventListener('DOMContentLoaded', function() {
    // Виправлення для мобільних пристроїв із затримкою прокрутки
    document.documentElement.style.scrollBehavior = 'auto';
    setTimeout(() => {
        document.documentElement.style.scrollBehavior = 'smooth';
    }, 100);

    // Завантажуємо необхідні зовнішні бібліотеки динамічно, якщо вони відсутні
    loadExternalLibraries().then(() => {
        // Ініціалізуємо прелоадер для початкового завантаження сайту
        initPreloader();
        
        // Визначаємо, чи це мобільний пристрій
        const isMobile = window.innerWidth < 768 || 'ontouchstart' in window;
        
        // Ініціалізуємо кастомний курсор тільки для десктопів
        if (!isMobile) {
            initCursor();
        } else {
            // Приховуємо елементи курсора на мобільних
            hideCustomCursor();
        }
        
        // Ініціалізуємо мобільне меню
        initMobileMenu();
        
        // Виправлення відступу під хедером для мобільних пристроїв
        fixMobileHeaderSpace();
        
        // Ініціалізуємо ефект прокрутки для хедера
        initHeaderScroll();
        
        // Ініціалізуємо плавну прокрутку для якорів
        initSmoothScroll();
        
        // Ініціалізуємо анімації
        initAnimations();
        
        // Покращена проста карусель з рухом зліва направо
        initImprovedCarousel();
        
        // Нова анімована колода карт під герой-секцією
        initAnimatedCardDeck();
        
        // Ініціалізуємо оптимізовану сітку карт
        initCardGrid();
        
        // Ініціалізуємо паралакс-ефекти
        initParallax();
        
        // Ініціалізуємо контактну форму з інтеграцією Google Spreadsheets
        initContactForm();
        
        // Ініціалізуємо кнопку "повернутися нагору"
        initBackToTop();
        
        // Ініціалізуємо модальні вікна
        initModals();
        
        // Ініціалізуємо 3D ефекти для карток (VanillaTilt)
        initVanillaTilt();
        
        // Прибираємо рухомі елементи з герой-секції і залишаємо лише фото
        simplifyHeroSection();
        
        // Покращені рандомні падаючі карти з більш природною фізикою
        initEnhancedFallingCards();
        
        // Скриваємо зображення логотипу, залишаємо тільки текст
        hideLogoImage();
        
        // Підганяємо розмір карток до зображень у сітці
        adjustCardSizeToImages();
        
        // Ініціалізуємо кнопки правових документів у футері з покращеними кольорами
        initLegalButtons();
        
        // Оптимізація тексту для мобільних пристроїв
        optimizeTextBlocks();
    }).catch(error => {
        console.error('Помилка при завантаженні зовнішніх бібліотек:', error);
        // Ініціалізуємо базову функціональність навіть при помилці завантаження бібліотек
        initBasicFunctionality();
    });
});

/**
 * Виправляємо проблему з відступами під хедером для мобільних пристроїв
 */
function fixMobileHeaderSpace() {
    const header = document.querySelector('.header');
    const firstSection = document.querySelector('.section:first-of-type');
    
    if (!header || !firstSection) return;
    
    // Додаємо CSS для виправлення відступів на мобільних
    const style = document.createElement('style');
    style.textContent = `
        @media (max-width: 767px) {
            .section:first-of-type {
                padding-top: calc(60px + 2rem) !important;
            }
            
            .header {
                height: 60px;
            }
            
            .hero-title, .hero-subtitle, .hero-description {
                margin-bottom: 1rem !important;
            }
            
            /* Виправлення для видимості тексту під хедером */
            main {
                padding-top: 60px;
            }
            
            /* Поліпшення читабельності тексту */
            p, .text-content {
                font-size: 16px !important;
                line-height: 1.6 !important;
            }
        }
    `;
    document.head.appendChild(style);
    
    // Оновлюємо відступи при зміні розміру вікна
    window.addEventListener('resize', function() {
        if (window.innerWidth < 768) {
            const headerHeight = header.offsetHeight;
            firstSection.style.paddingTop = `calc(${headerHeight}px + 2rem)`;
        } else {
            firstSection.style.paddingTop = '';
        }
    });
    
    // Застосовуємо відступи при завантаженні
    if (window.innerWidth < 768) {
        const headerHeight = header.offsetHeight;
        firstSection.style.paddingTop = `calc(${headerHeight}px + 2rem)`;
    }
}

/**
 * Приховує елементи кастомного курсора для мобільних пристроїв
 */
function hideCustomCursor() {
    const cursorElements = document.querySelectorAll('.cursor-dot, .cursor-outline, .cursor-text');
    
    cursorElements.forEach(el => {
        if (el) {
            el.style.display = 'none';
            el.remove(); // Повністю видаляємо, щоб зменшити навантаження
        }
    });
    
    // Видаляємо клас з body
    document.body.classList.remove('cursor-enabled');
    
    // Відновлюємо стандартний курсор
    document.documentElement.style.cursor = '';
}

/**
 * Спрощує секцію hero, прибираючи рухомі елементи
 */
function simplifyHeroSection() {
    const heroSection = document.querySelector('.hero-section');
    if (!heroSection) return;
    
    // Видаляємо всі плаваючі картки
    const floatingCards = heroSection.querySelectorAll('.floating-card');
    floatingCards.forEach(card => card.remove());
    
    // Знаходимо зображення героя
    const heroImage = heroSection.querySelector('.hero-image');
    if (heroImage) {
        // Додаємо простий ефект при наведенні
        heroImage.style.transition = 'transform 0.5s ease, box-shadow 0.5s ease';
        
        heroImage.addEventListener('mouseenter', function() {
            if (window.innerWidth >= 768) { // Тільки для десктопів
                this.style.transform = 'scale(1.03)';
                this.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.15)';
            }
        });
        
        heroImage.addEventListener('mouseleave', function() {
            this.style.transform = '';
            this.style.boxShadow = '';
        });
    }
    
    // Додаємо стилі для мобільної оптимізації
    const style = document.createElement('style');
    style.textContent = `
        .hero-section {
            position: relative;
            overflow: hidden;
        }
        
        .hero-image {
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
        }
        
        .hero-image img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            transition: transform 0.5s ease;
        }
        
        @media (max-width: 767px) {
            .hero-image {
                margin-top: 1.5rem;
                margin-bottom: 1.5rem;
                height: auto !important;
                max-height: 60vh;
            }
            
            .hero-content {
                text-align: center;
            }
            
            .hero-buttons {
                justify-content: center;
                margin-top: 1.5rem;
            }
        }
    `;
    document.head.appendChild(style);
}

/**
 * Оптимізує текстові блоки та їх анімації
 */
function optimizeTextBlocks() {
    // Додаємо стилі для покращення текстових блоків
    const style = document.createElement('style');
    style.textContent = `
        .text-block, .content-text, .feature-text, .info-text {
            transition: transform 0.3s ease, box-shadow 0.3s ease, background-color 0.3s ease;
            padding: 1.5rem;
            border-radius: 8px;
            perspective: 1000px;
            transform-style: preserve-3d;
            will-change: transform;
        }
        
        @media (min-width: 768px) {
            .text-tilt {
                transition: transform 0.3s ease;
            }
            
            /* Специфічний стиль для секції "Кому підійдуть карти" */
            .target-section .text-block:hover, 
            .target-section .feature-text:hover {
                box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
                background-color: rgba(255, 255, 255, 0.8);
            }
        }
        
        /* Покращення читабельності тексту */
        p, .text-content {
            line-height: 1.7;
            color: #333;
        }
        
        /* Покращення контрасту для заголовків */
        h1, h2, h3, h4, h5, h6 {
            color: #222;
            margin-bottom: 1rem;
        }
        
        /* Покращений контраст для секції "Наша місія" */
        .mission-section p, 
        .mission-section .text-content, 
        .mission-section h2, 
        .mission-section h3, 
        .mission-section h4 {
            color: #f8f8f8;
            text-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
        }
        
        @media (max-width: 767px) {
            h1 { font-size: 2rem !important; }
            h2 { font-size: 1.75rem !important; }
            h3 { font-size: 1.5rem !important; }
            
            .text-block, .content-text, .feature-text, .info-text {
                padding: 1rem;
            }
            
            /* Збільшуємо розмір карток на смартфоні */
            .cards-grid-container .grid-card {
                width: 90% !important;
                height: auto !important;
                margin: 0 auto 20px;
            }
        }
    `;
    document.head.appendChild(style);
    
    // Знаходимо всі текстові блоки та додаємо їм класи
    document.querySelectorAll('.section p:not(.hero-description)').forEach(p => {
        const parent = p.parentElement;
        if (!parent.classList.contains('text-block') && 
            !parent.classList.contains('content-text') && 
            !parent.classList.contains('feature-text') &&
            !parent.classList.contains('info-text')) {
            parent.classList.add('text-block');
        }
    });
    
    // Додаємо 3D нахил для текстових блоків у секції "Кому підійдуть карти"
    const targetSection = document.querySelector('.target-section');
    if (targetSection) {
        const textBlocks = targetSection.querySelectorAll('.text-block, .feature-text, .info-text');
        
        textBlocks.forEach(block => {
            // Додаємо клас для відстеження
            block.classList.add('text-tilt');
            
            // Додаємо обробники для нахилу при наведенні
            block.addEventListener('mousemove', function(e) {
                if (window.innerWidth < 768) return; // Тільки для десктопів
                
                const rect = this.getBoundingClientRect();
                const x = e.clientX - rect.left; // положення по X відносно блоку
                const y = e.clientY - rect.top; // положення по Y відносно блоку
                
                // Розрахунок кутів нахилу (максимум 15 градусів)
                const tiltX = ((y / rect.height) - 0.5) * 15;
                const tiltY = ((x / rect.width) - 0.5) * -15;
                
                // Застосовуємо трансформацію
                this.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
            });
            
            // Повертаємо в початкове положення, коли курсор виходить
            block.addEventListener('mouseleave', function() {
                this.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
            });
        });
    }
}

/**
 * Динамічне завантаження зовнішніх бібліотек
 * Завантажує VanillaTilt та Particles.js, якщо вони відсутні
 */
function loadExternalLibraries() {
    return new Promise((resolve, reject) => {
        let librariesLoaded = 0;
        const requiredLibraries = 2; // VanillaTilt та Particles.js
        
        function checkIfComplete() {
            librariesLoaded++;
            if (librariesLoaded >= requiredLibraries) {
                resolve();
            }
        }

        // Завантаження VanillaTilt, якщо він відсутній
        if (typeof VanillaTilt === 'undefined') {
            const vanillaTiltScript = document.createElement('script');
            vanillaTiltScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/vanilla-tilt/1.8.0/vanilla-tilt.min.js';
            vanillaTiltScript.onload = checkIfComplete;
            vanillaTiltScript.onerror = () => {
                console.warn('Не вдалося завантажити VanillaTilt.js');
                checkIfComplete();
            };
            document.head.appendChild(vanillaTiltScript);
        } else {
            checkIfComplete();
        }
        
        // Завантаження Particles.js, якщо він відсутній
        if (typeof particlesJS === 'undefined') {
            const particlesScript = document.createElement('script');
            particlesScript.src = 'https://cdn.jsdelivr.net/particles.js/2.0.0/particles.min.js';
            particlesScript.onload = checkIfComplete;
            particlesScript.onerror = () => {
                console.warn('Не вдалося завантажити Particles.js');
                checkIfComplete();
            };
            document.head.appendChild(particlesScript);
        } else {
            checkIfComplete();
        }
        
        // Встановлюємо таймаут для завантаження, щоб уникнути нескінченного очікування
        setTimeout(() => {
            if (librariesLoaded < requiredLibraries) {
                console.warn('Деякі бібліотеки не вдалося завантажити вчасно');
                resolve();
            }
        }, 5000);
    });
}

/**
 * Ініціалізація основних функцій, які не залежать від зовнішніх бібліотек
 */
function initBasicFunctionality() {
    initPreloader();
    initMobileMenu();
    initHeaderScroll();
    initSmoothScroll();
    initBackToTop();
    initContactForm();
    initModals();
    initLegalButtons();
    fixMobileHeaderSpace();
    simplifyHeroSection();
    optimizeTextBlocks();
}

/**
* Функціональність прелоадера
* Відображає прогрес завантаження сайту та приховує прелоадер після завершення
*/
function initPreloader() {
    const preloader = document.querySelector('.preloader');
    if (!preloader) return;
    
    // Примусове видалення прелоадера після короткої затримки
    const removePreloader = () => {
        // Спочатку приховуємо з анімацією
        preloader.style.opacity = '0';
        preloader.style.visibility = 'hidden';
        document.body.classList.remove('no-scroll');
        document.body.classList.add('loaded');
        
        // Повністю видаляємо елемент через 1.5 секунди
        setTimeout(() => {
            if (preloader && preloader.parentNode) {
                preloader.parentNode.removeChild(preloader);
            }
            // Запускаємо початкові анімації
            startInitialAnimations();
        }, 1500);
    };
    
    // Негайний запуск видалення прелоадера після короткої затримки
    setTimeout(removePreloader, 2000);
    
    // Додаткові обробники для надійності
    window.addEventListener('load', removePreloader);
    
    // Якщо сторінка вже завантажена, видаляємо прелоадер негайно
    if (document.readyState === 'complete') {
        removePreloader();
    }
    
    // Додаємо CSS для гарантованого приховування
    const style = document.createElement('style');
    style.textContent = `
        .preloader {
            transition: opacity 0.5s ease, visibility 0.5s ease;
        }
        
        body.loaded .preloader,
        .preloader[style*="visibility: hidden"],
        .preloader[style*="opacity: 0"] {
            opacity: 0 !important;
            visibility: hidden !important;
            pointer-events: none !important;
        }
        
        /* Додаткова страховка - приховати через 8 секунд */
        @keyframes forceHidePreloader {
            to { opacity: 0; visibility: hidden; z-index: -1; display: none; }
        }
        
        .preloader {
            animation: forceHidePreloader 0s 8s forwards !important;
        }
    `;
    document.head.appendChild(style);
}

/**
* Початкові анімації, які запускаються після зникнення прелоадера
*/
function startInitialAnimations() {
    // Анімація елементів головної секції
    const heroTitle = document.querySelector('.hero-title');
    const heroSubtitle = document.querySelector('.hero-subtitle');
    const heroDescription = document.querySelector('.hero-description');
    const heroButtons = document.querySelector('.hero-buttons');
    const heroImage = document.querySelector('.hero-image');
    
    if (heroTitle) heroTitle.classList.add('revealed');
    if (heroSubtitle) {
        setTimeout(() => {
            heroSubtitle.classList.add('revealed');
        }, 200);
    }
    if (heroDescription) {
        setTimeout(() => {
            heroDescription.classList.add('revealed');
        }, 400);
    }
    if (heroButtons) {
        setTimeout(() => {
            heroButtons.classList.add('revealed');
        }, 600);
    }
    if (heroImage) {
        setTimeout(() => {
            heroImage.classList.add('revealed');
        }, 800);
    }
    
    // Створюємо спостерігач для відображення елементів, які спочатку видимі
    initScrollObserver();
}

/**
* Ініціалізація спостерігача прокрутки для анімацій
*/
function initScrollObserver() {
    // Перевіряємо підтримку IntersectionObserver
    if (!('IntersectionObserver' in window)) {
        // Якщо не підтримується, просто показуємо всі елементи
        document.querySelectorAll('.lazy-load, .visual-title, .split-text:not(.hero-title):not(.hero-subtitle), .content-item, .feature-card, .target-card, .author-card, .spread-card, .falling-card, .grid-card').forEach(el => {
            el.classList.add('revealed');
            el.classList.add('loaded');
        });
        return;
    }
    
    // Створюємо спостерігач
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                entry.target.classList.add('loaded');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    
    // Спостерігаємо за елементами
    document.querySelectorAll('.lazy-load, .visual-title, .split-text:not(.hero-title):not(.hero-subtitle), .content-item, .feature-card, .target-card, .author-card, .spread-card, .falling-card, .grid-card').forEach(el => {
        observer.observe(el);
    });
}

/**
* Функціональність кастомного курсора
* Тепер відображається тільки на десктопах
*/
function initCursor() {
    const cursor = document.querySelector('.cursor-dot');
    const cursorOutline = document.querySelector('.cursor-outline');
    const cursorText = document.querySelector('.cursor-text');
    
    if (!cursor || !cursorOutline) return;
    
    // Перевіряємо, чи має пристрій сенсорні можливості
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0;
    
    if (!isTouchDevice && window.innerWidth >= 768) {
        document.body.classList.add('cursor-enabled');
        
        // Оновлюємо положення курсора при русі миші з використанням requestAnimationFrame
        let mouseX = 0;
        let mouseY = 0;
        let cursorX = 0;
        let cursorY = 0;
        let frameId;
        
        document.addEventListener('mousemove', e => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            
            if (!frameId) {
                frameId = requestAnimationFrame(updateCursor);
            }
        });
        
        function updateCursor() {
            // Плавне слідування за курсором
            cursorX += (mouseX - cursorX) * 0.2;
            cursorY += (mouseY - cursorY) * 0.2;
            
            cursor.style.left = `${mouseX}px`;
            cursor.style.top = `${mouseY}px`;
            
            cursorOutline.style.left = `${cursorX}px`;
            cursorOutline.style.top = `${cursorY}px`;
            
            if (cursorText) {
                cursorText.style.left = `${cursorX}px`;
                cursorText.style.top = `${cursorY}px`;
            }
            
            frameId = requestAnimationFrame(updateCursor);
        }
        
        // Додаємо ефект при наведенні на інтерактивні елементи
        const interactiveElements = document.querySelectorAll('a, button, .card, .interactive, input, textarea, .cursor-hover-trigger, .spread-card, .carousel-card, .grid-card, .deck-card, .draw-button, .carousel-prev, .carousel-next, .modal-close, .author-photo, .floating-card, .legal-button, .btn-modal');
        
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursor.classList.add('cursor-hover');
                cursorOutline.classList.add('cursor-hover');
                
                // Показуємо текст для елементів з data-cursor-text
                if (cursorText && el.dataset.cursorText) {
                    cursorText.textContent = el.dataset.cursorText;
                    document.body.classList.add('cursor-text-visible');
                }
            });
            
            el.addEventListener('mouseleave', () => {
                cursor.classList.remove('cursor-hover');
                cursorOutline.classList.remove('cursor-hover');
                
                // Приховуємо текст
                if (cursorText) {
                    document.body.classList.remove('cursor-text-visible');
                }
            });
        });
        
        // Додаємо ефект при натисканні
        document.addEventListener('mousedown', () => {
            cursor.classList.add('cursor-click');
            cursorOutline.classList.add('cursor-click');
        });
        
        document.addEventListener('mouseup', () => {
            cursor.classList.remove('cursor-click');
            cursorOutline.classList.remove('cursor-click');
        });
        
        // Приховуємо стандартний курсор
        document.documentElement.style.cursor = 'none';
    } else {
        // На мобільних повністю приховуємо кастомний курсор
        hideCustomCursor();
    }
}

/**
* Функціональність мобільного меню
*/
function initMobileMenu() {
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const mobileMenu = document.querySelector('.mobile-menu');
    const menuClose = document.querySelector('.mobile-menu-close');
    const mobileLinks = document.querySelectorAll('.mobile-nav-link');
    const header = document.querySelector('.header');
    
    if (!menuToggle || !mobileMenu) return;
    
    // Перемикання меню
    menuToggle.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        menuToggle.classList.toggle('active');
        mobileMenu.classList.toggle('open');
        document.body.classList.toggle('menu-open');
        
        // Фокусуємося на першому елементі меню для кращої доступності
        if (mobileMenu.classList.contains('open') && mobileLinks.length > 0) {
            mobileLinks[0].focus();
        }
    });
    
    // Закриття меню
    if (menuClose) {
        menuClose.addEventListener('click', function(e) {
            e.preventDefault();
            menuToggle.classList.remove('active');
            mobileMenu.classList.remove('open');
            document.body.classList.remove('menu-open');
            menuToggle.focus(); // Повертаємо фокус на кнопку меню
        });
    }
    
    // Закриття меню при натисканні на посилання
    mobileLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Не закриваємо меню, якщо посилання відкриває підменю
            if (this.classList.contains('has-submenu')) {
                e.preventDefault();
                this.classList.toggle('submenu-open');
                return;
            }
            
            menuToggle.classList.remove('active');
            mobileMenu.classList.remove('open');
            document.body.classList.remove('menu-open');
        });
    });
    
    // Закриття меню при натисканні поза ним
    document.addEventListener('click', function(e) {
        if (document.body.classList.contains('menu-open') && 
            !mobileMenu.contains(e.target) && 
            e.target !== menuToggle && 
            !menuToggle.contains(e.target)) {
            menuToggle.classList.remove('active');
            mobileMenu.classList.remove('open');
            document.body.classList.remove('menu-open');
        }
    });
    
    // Обробка клавіші Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && document.body.classList.contains('menu-open')) {
            menuToggle.classList.remove('active');
            mobileMenu.classList.remove('open');
            document.body.classList.remove('menu-open');
            menuToggle.focus(); // Повертаємо фокус на кнопку меню
        }
    });
    
    // Виправлення для меню, щоб уникнути дублювання навігаційних елементів
    function adjustMenuVisibility() {
        const desktopNav = document.querySelector('.desktop-nav');
        const isMobile = window.innerWidth < 768;
        
        if (desktopNav) {
            if (isMobile) {
                desktopNav.setAttribute('aria-hidden', 'true');
                desktopNav.style.display = 'none';
                if (menuToggle) menuToggle.style.display = 'block';
            } else {
                desktopNav.removeAttribute('aria-hidden');
                desktopNav.style.display = 'flex';
                if (menuToggle) menuToggle.style.display = 'none';
                // Закриваємо мобільне меню
                menuToggle.classList.remove('active');
                mobileMenu.classList.remove('open');
                document.body.classList.remove('menu-open');
            }
        }
    }
    
    // Виклик функції при завантаженні
    adjustMenuVisibility();
    
    // І при зміні розміру екрану
    window.addEventListener('resize', adjustMenuVisibility);
    
    // Покращуємо стилі для мобільного меню
    const style = document.createElement('style');
    style.textContent = `
        @media (max-width: 767px) {
            .mobile-menu {
                padding-top: 80px; /* Збільшуємо відступ зверху для кращого вигляду */
            }
            
            .mobile-nav-link {
                padding: 12px 20px; /* Збільшуємо область натискання */
                font-size: 18px; /* Збільшуємо шрифт для кращої читабельності */
            }
            
            .mobile-menu-toggle {
                top: 15px; /* Центруємо гамбургер відносно хедера */
            }
        }
    `;
    document.head.appendChild(style);
}

/**
* Ефект прокрутки для хедера
*/
function initHeaderScroll() {
    const header = document.querySelector('.header');
    if (!header) return;
    
    // Перевіряємо положення прокрутки та додаємо/видаляємо класи
    function checkScroll() {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }
    
    // Початкова перевірка
    checkScroll();
    
    // Перевірка при прокрутці з оптимізацією продуктивності
    let ticking = false;
    window.addEventListener('scroll', function() {
        if (!ticking) {
            window.requestAnimationFrame(function() {
                checkScroll();
                ticking = false;
            });
            ticking = true;
        }
    });
    
    // Покращення стилів хедера для мобільних
    const style = document.createElement('style');
    style.textContent = `
        .header {
            transition: background-color 0.3s ease, box-shadow 0.3s ease, height 0.3s ease;
        }
        
        .header.scrolled {
            background-color: rgba(255, 255, 255, 0.95);
            box-shadow: 0 2px 15px rgba(0, 0, 0, 0.1);
        }
        
        @media (max-width: 767px) {
            .header {
                padding: 0 15px;
            }
            
            .header.scrolled {
                height: 60px;
            }
            
            .logo {
                font-size: 1.5rem;
            }
        }
    `;
    document.head.appendChild(style);
}

/**
* Плавна прокрутка для якірних посилань
*/
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (!targetElement) {
                console.warn(`Елемент з id=${targetId} не знайдено`);
                return;
            }
            
            // Отримуємо зміщення з урахуванням висоти хедера
            const headerHeight = document.querySelector('.header')?.offsetHeight || 0;
            const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
            
            // Прокручуємо до цілі
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
            
            // Додаємо історію браузера
            history.pushState(null, null, targetId);
            
            // Закриваємо мобільне меню, якщо воно відкрите
            const mobileMenu = document.querySelector('.mobile-menu');
            const menuToggle = document.querySelector('.mobile-menu-toggle');
            if (mobileMenu && mobileMenu.classList.contains('open')) {
                mobileMenu.classList.remove('open');
                document.body.classList.remove('menu-open');
                if (menuToggle) menuToggle.classList.remove('active');
            }
            
            // Встановлюємо фокус на ціль для кращої доступності
            targetElement.setAttribute('tabindex', '-1');
            targetElement.focus({preventScroll: true});
            
            // Додаємо клас для анімації цілі
            targetElement.classList.add('target-active');
            setTimeout(() => {
                targetElement.classList.remove('target-active');
            }, 1500);
        });
    });
    
    // Додаємо обробник для індикатора прокрутки
    const scrollIndicator = document.querySelector('.scroll-indicator');
    if (scrollIndicator) {
        scrollIndicator.addEventListener('click', function() {
            const nextSection = document.querySelector('.section:nth-child(2)');
            if (nextSection) {
                const headerHeight = document.querySelector('.header')?.offsetHeight || 0;
                const targetPosition = nextSection.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Встановлюємо фокус на наступну секцію
                nextSection.setAttribute('tabindex', '-1');
                nextSection.focus({preventScroll: true});
            }
        });
    }
}

/**
* Ініціалізація кнопки "повернутися нагору"
*/
function initBackToTop() {
    const backToTopBtn = document.querySelector('.back-to-top');
    if (!backToTopBtn) return;
    
    // Перевіряємо положення прокрутки та перемикаємо видимість кнопки
    function checkScrollPosition() {
        if (window.scrollY > 500) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    }
    
    // Прокрутка до початку сторінки при натисканні на кнопку
    backToTopBtn.addEventListener('click', function(e) {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
        
        // Встановлюємо фокус на верхній елемент сторінки
        const focusTarget = document.querySelector('header, body');
        if (focusTarget) {
            focusTarget.setAttribute('tabindex', '-1');
            focusTarget.focus({preventScroll: true});
        }
    });
    
    // Перевірка положення прокрутки при прокрутці з оптимізацією
    let ticking = false;
    window.addEventListener('scroll', function() {
        if (!ticking) {
            window.requestAnimationFrame(function() {
                checkScrollPosition();
                ticking = false;
            });
            ticking = true;
        }
    });
    
    // Початкова перевірка
    checkScrollPosition();
    
    // Покращення для мобільних
    const style = document.createElement('style');
    style.textContent = `
        .back-to-top {
            position: fixed;
            bottom: 20px;
            right: 20px;
            background-color: #fff;
            color: #333;
            border-radius: 50%;
            width: 50px;
            height: 50px;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s ease;
            z-index: 90;
        }
        
        .back-to-top.visible {
            opacity: 1;
            visibility: visible;
        }
        
        .back-to-top:hover {
            transform: translateY(-5px);
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.15);
        }
        
        @media (max-width: 767px) {
            .back-to-top {
                width: 40px;
                height: 40px;
                bottom: 15px;
                right: 15px;
            }
        }
    `;
    document.head.appendChild(style);
}

/**
* Ініціалізація всіх анімацій
*/
function initAnimations() {
    // Розділення тексту для анімацій
    initTextSplitting();
    
    // Ініціалізуємо анімації при прокрутці
    initScrollAnimations();
    
    // Додаємо покращені анімації для карток
    enhanceCardAnimations();
}

/**
* Розділення тексту для анімацій
*/
function initTextSplitting() {
    const splitTextElements = document.querySelectorAll('.split-text');
    
    splitTextElements.forEach(element => {
        if (element.dataset.splitted) return; // Уникаємо повторного розділення
        
        let text = element.textContent;
        let splitHtml = '';
        
        // Розділяємо за словами
        const words = text.split(' ');
        
        words.forEach((word, wordIndex) => {
            splitHtml += `<span class="word" aria-hidden="true">`;
            
            // Розділяємо за символами
            Array.from(word).forEach((char, charIndex) => {
                splitHtml += `<span class="char" style="transition-delay: ${(wordIndex * 0.05) + (charIndex * 0.03)}s">${char}</span>`;
            });
            
            splitHtml += `</span> `;
        });
        
        // Зберігаємо оригінальний текст для доступності
        const originalText = document.createElement('span');
        originalText.className = 'sr-only';
        originalText.textContent = text;
        
        element.innerHTML = splitHtml;
        element.appendChild(originalText);
        element.dataset.splitted = 'true';
    });
}

/**
* Покращені анімації для карток
*/
function enhanceCardAnimations() {
    // Додаємо стилі для покращених анімацій карток
    const style = document.createElement('style');
    style.textContent = `
        .feature-card, .target-card, .author-card, .spread-card, .carousel-card {
            transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275), 
                       box-shadow 0.4s ease, 
                       opacity 0.4s ease;
        }
        
        .feature-card:hover, .target-card:hover, .author-card:hover {
            transform: translateY(-10px) scale(1.03);
            box-shadow: 0 15px 30px rgba(0, 0, 0, 0.15);
            z-index: 5;
        }
        
        .carousel-card:hover {
            transform: translateY(-5px) scale(1.08);
            z-index: 10;
        }
        
        .spread-card:hover {
            transform: translate(-50%, -50%) translateZ(40px) rotate(var(--rotate-angle)) !important;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
            z-index: 10;
        }
        
        /* Покращені анімації появи для карток */
        @keyframes cardAppear {
            from { opacity: 0; transform: translateY(30px); }
            to { opacity: 1; transform: translateY(0); }
        }
        
        .feature-card.revealed, .target-card.revealed, .author-card.revealed, .grid-card.revealed {
            animation: cardAppear 0.6s forwards cubic-bezier(0.2, 0.8, 0.2, 1);
        }
        
        /* Стилізація для мобільних пристроїв */
        @media (max-width: 767px) {
            .feature-card, .target-card, .author-card {
                margin-bottom: 20px;
            }
            
            .feature-card:active, .target-card:active, .author-card:active {
                transform: scale(0.98);
            }
        }
    `;
    document.head.appendChild(style);
    
    // Додаємо додаткові класи для карток перед секцією "кому підійдуть карти"
    const targetSection = document.querySelector('.target-section');
    if (targetSection) {
        const prevSection = targetSection.previousElementSibling;
        if (prevSection) {
            const cards = prevSection.querySelectorAll('.card, .feature-card');
            cards.forEach(card => {
                card.classList.add('enhanced-animation');
                
                // Додаємо стилі для покращених карток
                card.style.transition = 'transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275), box-shadow 0.5s ease, opacity 0.5s ease';
                
                card.addEventListener('mouseenter', function() {
                    if (window.innerWidth >= 768) {
                        this.style.transform = 'translateY(-15px) scale(1.05)';
                        this.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.15)';
                        this.style.zIndex = '5';
                    }
                });
                
                card.addEventListener('mouseleave', function() {
                    this.style.transform = '';
                    this.style.boxShadow = '';
                    this.style.zIndex = '';
                });
            });
        }
    }
}

/**
* Ініціалізація анімацій при прокрутці
*/
function initScrollAnimations() {
    // Використовуємо GSAP & ScrollTrigger для анімацій, якщо вони доступні
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        // Анімація заголовків розділів при прокрутці
        gsap.utils.toArray('.section-title').forEach(title => {
            gsap.fromTo(title, 
                { opacity: 0, y: 50 },
                { 
                    opacity: 1, 
                    y: 0, 
                    duration: 0.8,
                    scrollTrigger: {
                        trigger: title,
                        start: 'top 80%',
                        toggleActions: 'play none none none'
                    }
                }
            );
        });
        
        // Анімація карт при прокрутці
        gsap.utils.toArray('.feature-card, .author-card, .target-card').forEach((card, index) => {
            gsap.fromTo(card, 
                { opacity: 0, y: 50 },
                { 
                    opacity: 1, 
                    y: 0, 
                    duration: 0.6,
                    delay: index * 0.1,
                    scrollTrigger: {
                        trigger: card.parentElement,
                        start: 'top 80%',
                        toggleActions: 'play none none none'
                    }
                }
            );
        });
        
        // Анімація паралакса для місії
        const missionSection = document.querySelector('.mission-section');
        if (missionSection) {
            const parallaxBg = missionSection.querySelector('.parallax-bg');
            if (parallaxBg) {
                gsap.to(parallaxBg, {
                    y: '30%',
                    ease: 'none',
                    scrollTrigger: {
                        trigger: missionSection,
                        start: 'top bottom',
                        end: 'bottom top',
                        scrub: true
                    }
                });
            }
        }
        
        // Анімація сітки карт
        const cardsGridContainer = document.querySelector('.cards-grid-container');
        if (cardsGridContainer) {
            const gridCards = cardsGridContainer.querySelectorAll('.grid-card');
            
            gsap.fromTo(cardsGridContainer,
                { rotationX: 10, rotationY: -10 },
                {
                    rotationX: 0,
                    rotationY: 0,
                    duration: 1.5,
                    ease: 'power2.out',
                    scrollTrigger: {
                        trigger: cardsGridContainer,
                        start: 'top 70%',
                        end: 'bottom 30%',
                        scrub: 1
                    }
                }
            );
            
            gridCards.forEach((card, index) => {
                gsap.fromTo(card,
                    { opacity: 0, scale: 0.8, z: -50 },
                    {
                        opacity: 1,
                        scale: 1,
                        z: 0,
                        duration: 0.8,
                        delay: index * 0.1,
                        ease: 'back.out(1.7)',
                        scrollTrigger: {
                            trigger: cardsGridContainer,
                            start: 'top 70%',
                            toggleActions: 'play none none none'
                        }
                    }
                );
            });
        }
    } else {
        // Альтернативні анімації без GSAP
        document.querySelectorAll('.section-title, .feature-card, .author-card, .target-card, .grid-card').forEach((el, index) => {
            el.style.transitionDelay = `${index * 0.1}s`;
            el.classList.add('animate-on-scroll');
        });
        
        // Додаємо стилі для анімацій без GSAP
        const style = document.createElement('style');
        style.textContent = `
            .animate-on-scroll {
                opacity: 0;
                transform: translateY(30px);
                transition: opacity 0.6s ease, transform 0.6s ease;
            }
            
            .animate-on-scroll.revealed {
                opacity: 1;
                transform: translateY(0);
            }
            
            @media (prefers-reduced-motion: reduce) {
                .animate-on-scroll {
                    transition: none;
                    opacity: 1;
                    transform: none;
                }
            }
        `;
        document.head.appendChild(style);
    }
}

/**
* Ініціалізація покращеної каруселі з рухом зліва направо (без кнопок)
*/
function initImprovedCarousel() {
    const carousel = document.querySelector('.carousel-3d, .smooth-carousel');
    if (!carousel) return;
    
    // Додаємо клас smooth-carousel для єдиної ідентифікації
    carousel.classList.add('smooth-carousel');
    
    // Отримуємо або створюємо контейнер для карток
    let cardsContainer = carousel.querySelector('.carousel-cards-container');
    if (!cardsContainer) {
        cardsContainer = document.createElement('div');
        cardsContainer.className = 'carousel-cards-container';
        
        // Переміщуємо всі картки в контейнер
        const cards = Array.from(carousel.querySelectorAll('.carousel-card'));
        cards.forEach(card => cardsContainer.appendChild(card));
        
        // Додаємо контейнер на сторінку
        carousel.prepend(cardsContainer);
    }
    
    // Отримуємо картки в каруселі
    let cards = Array.from(carousel.querySelectorAll('.carousel-card'));
    
    // Якщо карток менше 8, дублюємо їх до потрібної кількості
    if (cards.length < 8) {
        const initialCount = cards.length;
        
        for (let i = 0; i < 8 - initialCount; i++) {
            const sourceCard = cards[i % initialCount];
            const clonedCard = sourceCard.cloneNode(true);
            cardsContainer.appendChild(clonedCard);
        }
        
        // Оновлюємо список карток
        cards = Array.from(carousel.querySelectorAll('.carousel-card'));
    }
    
    // ВАЖЛИВО: видаляємо будь-які існуючі кнопки навігації
    const prevButton = carousel.querySelector('.carousel-prev');
    const nextButton = carousel.querySelector('.carousel-next');
    const controlsContainer = carousel.querySelector('.carousel-controls');
    
    if (prevButton) prevButton.remove();
    if (nextButton) nextButton.remove();
    if (controlsContainer) controlsContainer.remove();
    
    // Додатково перевіряємо чи є кнопки навігації десь інде
    document.querySelectorAll('.carousel-prev, .carousel-next').forEach(button => {
        if (button.closest('.carousel-3d, .smooth-carousel')) {
            button.remove();
        }
    });
    
    // Створюємо циркулярну карусель
    const style = document.createElement('style');
    style.textContent = `
        .smooth-carousel {
            position: relative;
            width: 100%;
            height: 500px;
            margin: 50px auto;
            perspective: 1000px;
        }
        
        .carousel-cards-container {
            position: absolute;
            width: 100%;
            height: 100%;
            transform-style: preserve-3d;
            animation: carousel-rotate 32s linear infinite;
        }
        
        .carousel-cards-container:hover {
            animation-play-state: paused;
        }
        
        .carousel-card {
            position: absolute;
            width: 280px;
            height: 400px;
            top: 50%;
            left: 50%;
            transform-origin: center center;
            transition: transform 0.5s ease, opacity 0.5s ease, box-shadow 0.5s ease;
            box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
            border-radius: 12px;
            overflow: hidden;
            backface-visibility: hidden;
            opacity: 0.9;
        }
        
        .carousel-card img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
        
        @keyframes carousel-rotate {
            0% { transform: rotateY(0deg); }
            100% { transform: rotateY(360deg); }
        }
        
        /* Блокуємо взаємодію з картками, коли вони задом */
        .carousel-card.back-facing {
            pointer-events: none;
        }
    `;
    document.head.appendChild(style);
    
    // Розміщуємо картки по колу
    const radius = 400; // Радіус кола каруселі
    const totalCards = cards.length;
    const angleStep = (2 * Math.PI) / totalCards;
    
    cards.forEach((card, index) => {
        // Встановлюємо початкове положення
        const angle = angleStep * index;
        const x = radius * Math.sin(angle);
        const z = radius * Math.cos(angle);
        
        // Трансформація для розміщення картки в 3D-просторі
        card.style.transform = `translate(-50%, -50%) translateX(${x}px) translateZ(${z}px) rotateY(${-angle * 180 / Math.PI}deg)`;
        
        // Встановлюємо затримку для плавної анімації
        card.style.transitionDelay = `${index * 0.05}s`;
        
        // Додаємо слухача подій для ефекту при наведенні
        card.addEventListener('mouseenter', function() {
            this.style.transform = `${this.style.transform.split(') ')[0]}) scale(1.1)`;
            this.style.boxShadow = '0 15px 30px rgba(0, 0, 0, 0.3)';
            this.style.opacity = '1';
            this.style.zIndex = '10';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = this.style.transform.replace(' scale(1.1)', '');
            this.style.boxShadow = '0 10px 20px rgba(0, 0, 0, 0.2)';
            this.style.opacity = '0.9';
            this.style.zIndex = '';
        });
    });
    
    // Функція для динамічного оновлення стилю карток в залежності від їх положення
    function updateCardStyles() {
        cards.forEach((card, index) => {
            const angle = (angleStep * index) + getCurrentRotation();
            const z = radius * Math.cos(angle);
            
            // Якщо картка повернута задом (z < 0), зменшуємо її непрозорість
            if (z < 0) {
                card.style.opacity = '0.5';
                card.style.filter = 'blur(3px)';
                card.classList.add('back-facing');
            } else {
                card.style.opacity = '0.9';
                card.style.filter = 'none';
                card.classList.remove('back-facing');
            }
        });
    }
    
    // Отримання поточного кута обертання контейнера
    function getCurrentRotation() {
        const style = window.getComputedStyle(cardsContainer);
        const matrix = new DOMMatrix(style.transform);
        return Math.atan2(matrix.m32, matrix.m33);
    }
    
    // Запускаємо оновлення кожні 100ms
    setInterval(updateCardStyles, 100);
    
    // Експортуємо функцію оновлення для використання ззовні
    window.updateCarouselGlobal = function() {
        // Перерозміщення карток при зміні розміру вікна
        const viewportWidth = window.innerWidth;
        const adjustedRadius = viewportWidth < 768 ? 300 : 400;
        
        cards.forEach((card, index) => {
            const angle = angleStep * index;
            const x = adjustedRadius * Math.sin(angle);
            const z = adjustedRadius * Math.cos(angle);
            
            card.style.transform = `translate(-50%, -50%) translateX(${x}px) translateZ(${z}px) rotateY(${-angle * 180 / Math.PI}deg)`;
        });
        
        updateCardStyles();
    };
    
    // Встановлюємо флаг ініціалізації
    carousel.dataset.initialized = 'true';
}

/**
 * Ініціалізація анімованої колоди карт під герой-секцією
 */
function initAnimatedCardDeck() {
    // Знаходимо або створюємо секцію для колоди карт
    let deckSection = document.querySelector('.card-deck-section');
    if (!deckSection) {
        const heroSection = document.querySelector('.hero-section');
        if (!heroSection) return;
        
        // Створюємо нову секцію після герой-секції
        deckSection = document.createElement('section');
        deckSection.className = 'section card-deck-section';
        heroSection.parentNode.insertBefore(deckSection, heroSection.nextSibling);
        
        // Додаємо заголовок та опис
        const sectionHeader = document.createElement('div');
        sectionHeader.className = 'section-header';
        sectionHeader.innerHTML = `
            <h2 class="section-title">Метафоричні карти</h2>
            <p class="section-description">Виберіть карту зі стосу для ближчого знайомства</p>
        `;
        deckSection.appendChild(sectionHeader);
    }
    
    // Створюємо контейнер для колоди, якщо він відсутній
    let deckContainer = deckSection.querySelector('.card-deck-container');
    if (!deckContainer) {
        deckContainer = document.createElement('div');
        deckContainer.className = 'card-deck-container';
        deckSection.appendChild(deckContainer);
    }
    
    // Очищаємо контейнер
    deckContainer.innerHTML = '';
    
    // Додаємо стилі для колоди карт
    const style = document.createElement('style');
    style.textContent = `
        .card-deck-section {
            padding: 60px 0;
            text-align: center;
        }
        
        .card-deck-container {
            position: relative;
            width: 300px;
            height: 450px;
            margin: 40px auto;
            perspective: 1000px;
        }
        
        .deck-card {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            border-radius: 15px;
            overflow: hidden;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
            transition: transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275), 
                        box-shadow 0.5s ease,
                        z-index 0s 0.5s;
            cursor: pointer;
            transform-origin: center center;
        }
        
        .deck-card img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            border-radius: 15px;
        }
        
        .deck-card.active {
            transition: transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275), 
                        box-shadow 0.5s ease,
                        z-index 0s;
        }
        
        @media (max-width: 768px) {
            .card-deck-container {
                width: 240px;
                height: 360px;
            }
            
            .deck-card.active {
                transform: translate(0, -30px) rotate(0deg) scale(1.1) !important;
            }
        }
    `;
    document.head.appendChild(style);
    
    // Зображення карт для колоди
    const cardImages = [
        'https://res.cloudinary.com/djdc6wcpg/image/upload/v1744832849/falling-card-1_ncakxb.jpg',
        'https://res.cloudinary.com/djdc6wcpg/image/upload/v1744832174/falling-card-2_kc1sog.jpg',
        'https://res.cloudinary.com/djdc6wcpg/image/upload/v1744832846/falling-card-3_zljtc1.jpg',
        'https://res.cloudinary.com/djdc6wcpg/image/upload/v1744832728/falling-card-4_twzep6.jpg',
        'https://res.cloudinary.com/djdc6wcpg/image/upload/v1744832838/falling-card-5_bbaqor.jpg',
        'https://res.cloudinary.com/djdc6wcpg/image/upload/v1744832849/falling-card-1_ncakxb.jpg'
    ];
    
    // Створюємо 6 карт для колоди
    for (let i = 0; i < 6; i++) {
        const card = document.createElement('div');
        card.className = 'deck-card';
        card.dataset.index = i;
        
        // Випадкове положення та обертання для хаотичного вигляду
        const randomRotate = -15 + Math.random() * 30; // -15 до 15 градусів
        const randomX = -15 + Math.random() * 30; // -15px до 15px
        const randomY = -15 + Math.random() * 30; // -15px до 15px
        const zIndex = i;
        
        // Встановлюємо початкові стилі
        card.style.transform = `translate(${randomX}px, ${randomY}px) rotate(${randomRotate}deg)`;
        card.style.zIndex = zIndex;
        
        // Створюємо зображення для карти
        const img = document.createElement('img');
        img.src = cardImages[i];
        img.alt = 'Метафорична карта ' + (i + 1);
        img.loading = 'lazy';
        card.appendChild(img);
        
        // Додаємо карту в контейнер
        deckContainer.appendChild(card);
        
        // Додаємо ефект наведення - карта трохи висувається
        card.addEventListener('mouseenter', function() {
            if (!this.classList.contains('active')) {
                this.style.transform = `translate(${randomX}px, ${randomY - 20}px) rotate(${randomRotate}deg) scale(1.05)`;
                this.style.zIndex = 10; // Виносимо наперед при наведенні
                this.style.boxShadow = '0 15px 30px rgba(0, 0, 0, 0.2)';
            }
        });
        
        card.addEventListener('mouseleave', function() {
            if (!this.classList.contains('active')) {
                this.style.transform = `translate(${randomX}px, ${randomY}px) rotate(${randomRotate}deg)`;
                this.style.zIndex = zIndex;
                this.style.boxShadow = '';
            }
        });
        
        // Додаємо ефект кліку - карта висувається і переміщується вгору стосу
        card.addEventListener('click', function() {
            // Спочатку скидаємо всі карти
            document.querySelectorAll('.deck-card.active').forEach(activeCard => {
                const idx = parseInt(activeCard.dataset.index);
                const rX = -15 + Math.random() * 30;
                const rY = -15 + Math.random() * 30;
                const rR = -15 + Math.random() * 30;
                
                activeCard.classList.remove('active');
                activeCard.style.transform = `translate(${rX}px, ${rY}px) rotate(${rR}deg)`;
                activeCard.style.zIndex = idx;
                activeCard.style.boxShadow = '';
            });
            
            // Активуємо цю карту
            this.classList.add('active');
            this.style.transform = 'translate(0, -50px) rotate(0deg) scale(1.1)';
            this.style.zIndex = 20;
            this.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.3)';
        });
    }
}

/**
* Ініціалізація 3D сітки карт
*/
function initCardGrid() {
    const gridContainer = document.querySelector('.cards-grid-container');
    if (!gridContainer) return;
    
    const gridCards = document.querySelectorAll('.grid-card');
    if (!gridCards.length) return;
    
    // Додаємо стилі для збільшення карток у 2 рази
    const style = document.createElement('style');
    style.textContent = `
        .cards-grid-container {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 30px;
            perspective: 1000px;
            transform-style: preserve-3d;
            width: 100%;
            max-width: 1200px;
            margin: 0 auto;
            padding: 40px 0;
        }
        
        .grid-card {
            position: relative;
            border-radius: 15px;
            overflow: hidden;
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
            transition: transform 0.5s cubic-bezier(0.165, 0.84, 0.44, 1), 
                        box-shadow 0.5s ease;
            transform-style: preserve-3d;
            width: 100%; /* Розмір картки збільшено у 2 рази */
            height: auto;
            aspect-ratio: 2/3; /* Фіксовані пропорції картки */
        }
        
        .grid-card img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            transition: transform 0.5s ease;
        }
        
        .grid-card:hover {
            transform: scale(1.05) translateZ(30px);
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
            z-index: 10;
        }
        
        .grid-card:hover img {
            transform: scale(1.05);
        }
        
        /* Адаптивні стилі */
        @media (max-width: 1024px) {
            .cards-grid-container {
                grid-template-columns: repeat(3, 1fr);
                gap: 20px;
            }
        }
        
        @media (max-width: 768px) {
            .cards-grid-container {
                grid-template-columns: repeat(2, 1fr);
                gap: 15px;
            }
            
            .grid-card {
                transition: transform 0.3s ease, box-shadow 0.3s ease;
            }
            
            /* Без анімації з боковим зміщенням для мобільних */
            .grid-card:hover {
                transform: scale(1.03);
            }
        }
        
        @media (max-width: 480px) {
            .cards-grid-container {
                grid-template-columns: 1fr;
            }
            
            .grid-card {
                width: 85%;
                margin: 0 auto;
            }
            
            /* Центрування картки без анімації на найменших екранах */
            .cards-grid-container .grid-card {
                transform: none !important;
                transition: box-shadow 0.3s ease;
            }
        }
    `;
    document.head.appendChild(style);
    
    // Додаємо ARIA-атрибути для доступності
    gridContainer.setAttribute('role', 'region');
    gridContainer.setAttribute('aria-label', 'Інтерактивна сітка метафоричних карт');
    
    gridCards.forEach((card, index) => {
        card.setAttribute('role', 'button');
        card.setAttribute('aria-label', `Метафорична карта ${index + 1}`);
        card.setAttribute('tabindex', '0');
    });
    
    // Додаємо 3D ефект тільки для десктопів
    if (window.innerWidth >= 768) {
        // Змінні для плавної анімації
        let targetRotateX = 0;
        let targetRotateY = 0;
        let currentRotateX = 0;
        let currentRotateY = 0;
        let animationFrameId;
        
        // Додаємо ефект трансформації при русі миші
        gridContainer.addEventListener('mousemove', function(e) {
            const rect = gridContainer.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            
            const mouseX = e.clientX - centerX;
            const mouseY = e.clientY - centerY;
            
            // Розрахунок кута нахилу
            targetRotateX = (mouseY / rect.height) * 5; // Максимальний кут 5 градусів
            targetRotateY = (mouseX / rect.width) * -5;
            
            if (!animationFrameId) {
                animationFrameId = requestAnimationFrame(updateGridAnimation);
            }
        });
        
        // Функція для плавної анімації
        function updateGridAnimation() {
            // Плавне наближення до цільового кута
            currentRotateX += (targetRotateX - currentRotateX) * 0.1;
            currentRotateY += (targetRotateY - currentRotateY) * 0.1;
            
            // Застосовуємо трансформацію до контейнера
            gridContainer.style.transform = `rotateX(${currentRotateX}deg) rotateY(${currentRotateY}deg)`;
            
            // Застосовуємо трансформацію до карток
            gridCards.forEach(card => {
                // Розрахунок позиції картки відносно центру
                const cardRect = card.getBoundingClientRect();
                const containerRect = gridContainer.getBoundingClientRect();
                const cardCenterX = cardRect.left + cardRect.width / 2 - containerRect.left;
                const cardCenterY = cardRect.top + cardRect.height / 2 - containerRect.top;
                
                // Розрахунок відстані від центру
                const distanceX = ((cardCenterX / containerRect.width) - 0.5) * 2;
                const distanceY = ((cardCenterY / containerRect.height) - 0.5) * 2;
                
                // Розрахунок Z-трансформації
                const zTransform = Math.abs(distanceX) + Math.abs(distanceY);
                
                // Застосовуємо трансформацію
                card.style.transform = `scale(0.98) translateZ(${20 + zTransform * 20}px)`;
            });
            
            // Продовжуємо анімацію, якщо є значна різниця
            if (Math.abs(targetRotateX - currentRotateX) > 0.01 || Math.abs(targetRotateY - currentRotateY) > 0.01) {
                animationFrameId = requestAnimationFrame(updateGridAnimation);
            } else {
                animationFrameId = null;
            }
        }
        
        // Повертаємо до початкового стану, коли миша покидає контейнер
        gridContainer.addEventListener('mouseleave', function() {
            targetRotateX = 0;
            targetRotateY = 0;
            
            if (!animationFrameId) {
                animationFrameId = requestAnimationFrame(updateGridAnimation);
            }
            
            gridCards.forEach(card => {
                card.style.transform = 'scale(0.98) translateZ(0)';
                card.style.zIndex = '';
            });
        });
    }
    
    // Додаємо ефект наведення для кожної картки
    gridCards.forEach(card => {
        // Різні ефекти для десктопу і мобільних
        if (window.innerWidth >= 768) {
            card.addEventListener('mouseenter', function() {
                this.style.transform = 'scale(1.05) translateZ(40px)';
                this.style.zIndex = '10';
            });
            
            card.addEventListener('mouseleave', function() {
                this.style.transform = 'scale(0.98) translateZ(0)';
                this.style.zIndex = '';
            });
        } else {
            // Спрощений ефект для мобільних - карта з'являється по центру без бокового зміщення
            card.addEventListener('touchstart', function() {
                this.style.transform = 'scale(1.02)';
                this.style.boxShadow = '0 10px 25px rgba(0, 0, 0, 0.15)';
            }, { passive: true });
            
            card.addEventListener('touchend', function() {
                this.style.transform = 'scale(1)';
                this.style.boxShadow = '';
            }, { passive: true });
        }
        
        // Додаємо підтримку клавіатури
        card.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    });
}

/**
* Ініціалізація паралакс-ефектів
*/
function initParallax() {
    const parallaxElements = document.querySelectorAll('[data-parallax-speed]');
    
    if (!parallaxElements.length) return;
    
    // Використовуємо requestAnimationFrame для плавної анімації
    let lastScrollY = window.pageYOffset;
    let ticking = false;
    
    function updateParallax() {
        const scrollTop = window.pageYOffset;
        
        parallaxElements.forEach(element => {
            const speed = parseFloat(element.dataset.parallaxSpeed) || 0.5;
            const offset = scrollTop * speed;
            
            requestAnimationFrame(() => {
                element.style.transform = `translateY(${offset}px)`;
            });
        });
        
        ticking = false;
    }
    
    // Оптимізуємо обробку прокрутки
    window.addEventListener('scroll', function() {
        lastScrollY = window.pageYOffset;
        
        if (!ticking) {
            window.requestAnimationFrame(function() {
                updateParallax();
                ticking = false;
            });
            ticking = true;
        }
    });
    
    // Початкове оновлення
    updateParallax();
}

/**
* Ініціалізація контактної форми з інтеграцією Google Spreadsheets
*/
function initContactForm() {
    const contactForm = document.querySelector('.contact-form');
    
    if (!contactForm) return;
    
    // Додаємо атрибути для доступності
    contactForm.setAttribute('aria-live', 'polite');
    
    // Додаємо анімацію для фокусу на полях форми
    const formInputs = contactForm.querySelectorAll('input, textarea');
    
    formInputs.forEach(input => {
        // Додаємо обгортку для підпису, якщо її ще немає
        const wrapper = input.parentElement;
        if (!wrapper.classList.contains('input-wrapper')) {
            const newWrapper = document.createElement('div');
            newWrapper.className = 'input-wrapper';
            input.parentElement.insertBefore(newWrapper, input);
            newWrapper.appendChild(input);
            
            // Створюємо підпис, якщо його ще немає
            if (!wrapper.querySelector('label')) {
                const label = document.createElement('label');
                label.textContent = input.placeholder || input.name;
                label.setAttribute('for', input.id || input.name);
                newWrapper.appendChild(label);
            }
        }
        
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
        });
        
        input.addEventListener('blur', function() {
            if (!this.value) {
                this.parentElement.classList.remove('focused');
            }
        });
        
        // Перевіряємо, чи є значення при завантаженні
        if (input.value) {
            input.parentElement.classList.add('focused');
        }
    });
    
    // Додаємо прихований input для ID таблиці Google Sheets
    if (!contactForm.querySelector('input[name="spreadsheet_id"]')) {
        const spreadsheetInput = document.createElement('input');
        spreadsheetInput.type = 'hidden';
        spreadsheetInput.name = 'spreadsheet_id';
        spreadsheetInput.value = contactForm.dataset.sheetId || '';
        contactForm.appendChild(spreadsheetInput);
    }
    
    // Обробка відправки форми до Google Spreadsheets
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Валідація форми
        if (!validateForm(contactForm)) {
            return;
        }
        
        // Показуємо стан завантаження
        const submitButton = contactForm.querySelector('button[type="submit"]');
        if (!submitButton) return;
        
        const originalText = submitButton.textContent;
        submitButton.textContent = 'Відправка...';
        submitButton.disabled = true;
        
        // Отримуємо ID таблиці Google Sheets
        const sheetId = contactForm.dataset.sheetId || contactForm.querySelector('input[name="spreadsheet_id"]')?.value || '';
        
        // Якщо ID таблиці не вказано, імітуємо відправку
        if (!sheetId) {
            console.warn('ID Google Spreadsheet не вказано. Форма не буде відправлена.');
            
            // Імітуємо успішну відправку через 1.5 секунди
            setTimeout(() => {
                const successMessage = contactForm.querySelector('.success-message');
                if (successMessage) {
                    successMessage.classList.remove('hidden');
                    successMessage.setAttribute('role', 'alert');
                }
                
                // Очищаємо форму
                contactForm.reset();
                formInputs.forEach(input => {
                    input.parentElement.classList.remove('focused');
                });
                
                // Повертаємо кнопку до початкового стану
                submitButton.textContent = originalText;
                submitButton.disabled = false;
                
                // Приховуємо повідомлення через 5 секунд
                setTimeout(() => {
                    if (successMessage) {
                        successMessage.classList.add('hidden');
                    }
                }, 5000);
            }, 1500);
            
            return;
        }
        
        // Підготовка даних форми
        const formData = new FormData(contactForm);
        
        // URL для відправки даних в Google Sheets (використовуємо Google Apps Script)
        // Приклад URL (в реальному проекті потрібно замінити ID на реальний)
        const scriptUrl = `https://script.google.com/macros/s/${sheetId}/exec`;
        
        // Відправляємо дані за допомогою fetch API
        fetch(scriptUrl, {
            method: 'POST',
            body: formData,
            mode: 'no-cors' // Потрібно для CORS з Google Scripts
        })
        .then(() => {
            // Показуємо повідомлення про успішну відправку
            const successMessage = contactForm.querySelector('.success-message');
            if (successMessage) {
                successMessage.classList.remove('hidden');
                successMessage.setAttribute('role', 'alert');
            }
            
            // Очищаємо форму
            contactForm.reset();
            formInputs.forEach(input => {
                input.parentElement.classList.remove('focused');
            });
            
            // Приховуємо повідомлення через 5 секунд
            setTimeout(() => {
                if (successMessage) {
                    successMessage.classList.add('hidden');
                }
            }, 5000);
        })
        .catch(error => {
            console.error('Помилка при відправці форми:', error);
            
            // Показуємо повідомлення про помилку
            alert('Виникла помилка при відправці форми. Будь ласка, спробуйте ще раз пізніше.');
        })
        .finally(() => {
            // Повертаємо кнопку до початкового стану
            submitButton.textContent = originalText;
            submitButton.disabled = false;
        });
    });
    
    // Функція валідації форми
    function validateForm(form) {
        const name = form.querySelector('#name');
        const email = form.querySelector('#email');
        const message = form.querySelector('#message');
        let isValid = true;
        
        // Очищаємо попередні повідомлення про помилки
        form.querySelectorAll('.error-message').forEach(msg => msg.remove());
        
        // Валідація імені
        if (!name.value.trim()) {
            showError(name, 'Будь ласка, введіть ваше ім\'я');
            isValid = false;
        }
        
        // Валідація електронної пошти
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email.value.trim() || !emailPattern.test(email.value)) {
            showError(email, 'Будь ласка, введіть коректну електронну пошту');
            isValid = false;
        }
        
        // Валідація повідомлення
        if (!message.value.trim()) {
            showError(message, 'Будь ласка, введіть ваше повідомлення');
            isValid = false;
        }
        
        return isValid;
    }
    
    // Функція для відображення помилок
    function showError(field, message) {
        const errorElement = document.createElement('div');
        errorElement.className = 'error-message';
        errorElement.textContent = message;
        
        field.parentElement.appendChild(errorElement);
        field.parentElement.classList.add('error');
        
        // Видаляємо повідомлення про помилку при редагуванні поля
        field.addEventListener('input', function() {
            errorElement.remove();
            field.parentElement.classList.remove('error');
        }, { once: true });
    }
    
    // Покращення стилів форми
    const style = document.createElement('style');
    style.textContent = `
        .contact-form {
            max-width: 600px;
            margin: 0 auto;
        }
        
        .input-wrapper {
            position: relative;
            margin-bottom: 1.5rem;
        }
        
        .input-wrapper label {
            position: absolute;
            top: 0;
            left: 0;
            padding: 0.75rem 1rem;
            pointer-events: none;
            transition: all 0.3s ease;
            color: #666;
        }
        
        .input-wrapper.focused label, 
        .input-wrapper input:focus + label,
        .input-wrapper textarea:focus + label {
            transform: translateY(-100%) scale(0.85);
            color: #333;
            padding: 0;
            margin-bottom: 5px;
        }
        
        .input-wrapper input, 
        .input-wrapper textarea {
            width: 100%;
            padding: 0.75rem 1rem;
            border: 1px solid #ccc;
            border-radius: 8px;
            font-size: 16px;
            transition: border-color 0.3s ease, box-shadow 0.3s ease;
        }
        
        .input-wrapper input:focus, 
        .input-wrapper textarea:focus {
            border-color: #4a90e2;
            box-shadow: 0 0 0 2px rgba(74, 144, 226, 0.2);
            outline: none;
        }
        
        .input-wrapper.error input, 
        .input-wrapper.error textarea {
            border-color: #e74c3c;
        }
        
        .error-message {
            color: #e74c3c;
            font-size: 0.85rem;
            margin-top: 0.5rem;
        }
        
        .contact-form button[type="submit"] {
            background-color: #4a90e2;
            color: white;
            border: none;
            padding: 0.75rem 1.5rem;
            border-radius: 8px;
            font-size: 16px;
            cursor: pointer;
            transition: background-color 0.3s ease, transform 0.3s ease;
        }
        
        .contact-form button[type="submit"]:hover {
            background-color: #3a80d2;
            transform: translateY(-2px);
        }
        
        .contact-form button[type="submit"]:disabled {
            background-color: #ccc;
            cursor: not-allowed;
            transform: none;
        }
        
        .success-message {
            background-color: #2ecc71;
            color: white;
            padding: 1rem;
            border-radius: 8px;
            margin-top: 1rem;
            text-align: center;
        }
        
        .success-message.hidden {
            display: none;
        }
        
        @media (max-width: 767px) {
            .contact-form {
                padding: 0 15px;
            }
            
            .input-wrapper input, 
            .input-wrapper textarea {
                font-size: 16px; /* Запобігає збільшенню форми на iOS */
            }
        }
    `;
    document.head.appendChild(style);
}

/**
* Ініціалізація кнопок правових документів у футері
*/
function initLegalButtons() {
    // Перевіряємо, чи існує футер
    let footer = document.querySelector('footer');
    if (!footer) {
        console.warn('Елемент footer не знайдено. Створюємо його.');
        const newFooter = document.createElement('footer');
        newFooter.className = 'footer';
        document.body.appendChild(newFooter);
        footer = newFooter;
    }
    
    // Додаємо темний фон для футера
    footer.classList.add('dark-bg');
    
    // Створюємо контейнер для кнопок, якщо його немає
    let legalContainer = footer.querySelector('.legal-buttons-container');
    if (!legalContainer) {
        legalContainer = document.createElement('div');
        legalContainer.className = 'legal-buttons-container';
        footer.appendChild(legalContainer);
    }
    
    // Дані для правових документів
    const legalDocs = [
        {
            id: 'privacy-policy',
            title: 'Політика конфіденційності',
            content: `
                <h3>Політика конфіденційності</h3>
                <p>Ми поважаємо вашу приватність та зобов'язуємося захищати ваші особисті дані.</p>
                <p>Ця політика конфіденційності пояснює, як ми збираємо, використовуємо та захищаємо вашу особисту інформацію.</p>
                <h4>Збір інформації</h4>
                <p>Ми збираємо інформацію, яку ви надаєте при заповненні форм на нашому сайті, включаючи ваше ім'я, електронну адресу та контактні дані.</p>
                <h4>Використання інформації</h4>
                <p>Зібрана інформація використовується для:</p>
                <ul>
                    <li>Надання послуг, які ви запитуєте</li>
                    <li>Відповіді на ваші запити та повідомлення</li>
                    <li>Покращення нашого сайту та послуг</li>
                </ul>
                <h4>Захист інформації</h4>
                <p>Ми впроваджуємо відповідні заходи безпеки для захисту ваших особистих даних від несанкціонованого доступу або розкриття.</p>
                <h4>Cookies</h4>
                <p>Наш сайт може використовувати файли cookie для поліпшення вашого досвіду. Ви можете налаштувати свій браузер для відмови від файлів cookie.</p>
                <h4>Контактна інформація</h4>
                <p>Якщо у вас є питання щодо цієї політики конфіденційності, будь ласка, зв'яжіться з нами за електронною адресою: contact@rootsandwings.com</p>
            `
        },
        {
            id: 'terms-of-service',
            title: 'Умови використання',
            content: `
                <h3>Умови використання</h3>
                <p>Ласкаво просимо на наш сайт. Ці умови використання регулюють ваш доступ та використання нашого сайту та послуг.</p>
                <h4>Прийняття умов</h4>
                <p>Використовуючи наш сайт, ви погоджуєтеся з цими умовами. Якщо ви не згодні з будь-якою частиною цих умов, будь ласка, не використовуйте наш сайт.</p>
                <h4>Інтелектуальна власність</h4>
                <p>Увесь контент на сайті, включаючи тексти, графіку, логотипи, зображення та програмне забезпечення, є нашою власністю і захищений законами про інтелектуальну власність.</p>
                <h4>Обмеження відповідальності</h4>
                <p>Ми не несемо відповідальності за будь-які прямі, непрямі, випадкові чи штрафні збитки, пов'язані з використанням або неможливістю використання нашого сайту.</p>
                <h4>Посилання на інші сайти</h4>
                <p>Наш сайт може містити посилання на сторонні сайти. Ми не несемо відповідальності за вміст або практики конфіденційності цих сайтів.</p>
                <h4>Зміни умов</h4>
                <p>Ми можемо оновлювати ці умови використання в будь-який час. Продовжуючи використовувати сайт після таких змін, ви погоджуєтеся з оновленими умовами.</p>
                <h4>Контактна інформація</h4>
                <p>Якщо у вас виникли питання щодо цих умов використання, будь ласка, зв'яжіться з нами за електронною адресою: contact@rootsandwings.com</p>
            `
        },
        {
            id: 'cookie-policy',
            title: 'Політика використання файлів cookie',
            content: `
                <h3>Політика використання файлів cookie</h3>
                <p>Наш веб-сайт використовує файли cookie для покращення вашого досвіду.</p>
                <h4>Що таке файли cookie?</h4>
                <p>Файли cookie — це невеликі текстові файли, які зберігаються на вашому пристрої при відвідуванні нашого сайту.</p>
                <h4>Як ми використовуємо файли cookie</h4>
                <p>Ми використовуємо файли cookie для:</p>
                <ul>
                    <li>Запам'ятовування ваших налаштувань</li>
                    <li>Аналізу використання нашого сайту</li>
                    <li>Покращення навігації та функціональності</li>
                </ul>
                <h4>Типи файлів cookie</h4>
                <p>Ми використовуємо наступні типи файлів cookie:</p>
                <ul>
                    <li>Необхідні файли cookie: для базового функціонування сайту</li>
                    <li>Аналітичні файли cookie: для аналізу відвідуваності та поведінки користувачів</li>
                    <li>Функціональні файли cookie: для запам'ятовування ваших налаштувань</li>
                </ul>
                <h4>Управління файлами cookie</h4>
                <p>Ви можете налаштувати свій браузер для відмови від всіх або деяких файлів cookie або для сповіщення при їх встановленні.</p>
                <h4>Контактна інформація</h4>
                <p>Якщо у вас є питання щодо нашої політики використання файлів cookie, будь ласка, зв'яжіться з нами за електронною адресою: contact@rootsandwings.com</p>
            `
        }
    ];
    
    // Створюємо модальні вікна, якщо вони ще не існують
    legalDocs.forEach(doc => {
        if (!document.getElementById(doc.id)) {
            // Створюємо модальне вікно
            const modal = document.createElement('div');
            modal.id = doc.id;
            modal.className = 'modal';
            
            // Додаємо контент модального вікна
            modal.innerHTML = `
                <div class="modal-content legal-modal">
                    <button class="modal-close" aria-label="Закрити">&times;</button>
                    <div class="modal-body">
                        ${doc.content}
                    </div>
                </div>
            `;
            
            // Додаємо модальне вікно до body
            document.body.appendChild(modal);
            
            // Створюємо кнопку у футері
            const button = document.createElement('button');
            button.className = 'legal-button modal-trigger';
            button.textContent = doc.title;
            button.dataset.modal = doc.id;
            
            // Додаємо кнопку до контейнера
            legalContainer.appendChild(button);
        }
    });
    
    // Додаємо стилі для футера та кнопок правових документів
    if (!document.getElementById('legal-buttons-style')) {
        const style = document.createElement('style');
        style.id = 'legal-buttons-style';
        style.textContent = `
            .footer {
                padding: 2.5rem 0;
                background-color: #1a1a1a; /* Темний фон футера */
                border-top: 1px solid #333;
                margin-top: 3rem;
                text-align: center;
                color: #f0f0f0; /* Світлий текст для контрасту */
            }
            
            .footer.dark-bg {
                background-color: #111;
                color: #fff;
            }
            
            .legal-buttons-container {
                display: flex;
                justify-content: center;
                flex-wrap: wrap;
                margin: 1.5rem 0;
                gap: 1rem;
            }
            
            .legal-button {
                background-color: rgba(255, 255, 255, 0.1); /* Напівпрозорий фон кнопок */
                border: 1px solid rgba(255, 255, 255, 0.2);
                border-radius: 6px;
                padding: 0.6rem 1.2rem;
                cursor: pointer;
                transition: all 0.3s ease;
                font-size: 0.9rem;
                color: #fff; /* Білий текст для кнопок */
                font-family: inherit;
                box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
            }
            
            .legal-button:hover {
                background-color: rgba(255, 255, 255, 0.2);
                border-color: rgba(255, 255, 255, 0.3);
                transform: translateY(-2px);
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
            }
            
            .legal-modal {
                max-width: 800px;
                max-height: 80vh;
                overflow-y: auto;
                color: #333;
                background-color: #fff;
            }
            
            .legal-modal h3 {
                color: #222;
                margin-bottom: 1.5rem;
                font-size: 1.5rem;
            }
            
            .legal-modal h4 {
                color: #444;
                margin: 1.5rem 0 0.5rem;
                font-size: 1.2rem;
            }
            
            .legal-modal p, .legal-modal li {
                line-height: 1.7;
                margin-bottom: 0.7rem;
                color: #555;
            }
            
            .legal-modal ul {
                margin-left: 1.5rem;
                margin-bottom: 1rem;
            }
            
            .modal {
                display: none;
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(0, 0, 0, 0.5);
                z-index: 1000;
                justify-content: center;
                align-items: center;
            }
            
            .modal.open {
                display: flex;
            }
            
            .modal-content {
                background-color: #fff;
                border-radius: 12px;
                padding: 2.5rem;
                position: relative;
                width: 90%;
                max-width: 700px;
                margin: auto;
                box-shadow: 0 5px 25px rgba(0, 0, 0, 0.15);
            }
            
            .modal-close {
                position: absolute;
                top: 1rem;
                right: 1rem;
                background: none;
                border: none;
                font-size: 1.8rem;
                cursor: pointer;
                color: #666;
                transition: color 0.3s ease;
            }
            
            .modal-close:hover {
                color: #000;
            }
            
            .modal-body {
                margin-top: 1rem;
            }
            
            /* Стилі для темного футера */
            .footer h2, .footer h3 {
                color: #fff;
            }
            
            .footer p, .footer li, .footer a {
                color: rgba(255, 255, 255, 0.8);
            }
            
            .footer a:hover {
                color: #fff;
            }
            
            .footer-logo, .footer-navigation, .footer-legal, .footer-social {
                margin-bottom: 2rem;
            }
            
            .footer-bottom {
                border-top: 1px solid rgba(255, 255, 255, 0.1);
                padding-top: 1.5rem;
                color: rgba(255, 255, 255, 0.6);
            }
            
            .social-icons a {
                color: rgba(255, 255, 255, 0.7);
                margin: 0 0.5rem;
                transition: color 0.3s ease;
            }
            
            .social-icons a:hover {
                color: #fff;
            }
            
            @media (max-width: 768px) {
                .modal-content {
                    width: 95%;
                    padding: 1.8rem;
                }
                
                .legal-button {
                    padding: 0.5rem 1rem;
                    font-size: 0.85rem;
                }
                
                .footer {
                    padding: 2rem 15px;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    // Додаємо обробники для кнопок правових документів
    document.querySelectorAll('.modal-trigger').forEach(trigger => {
        trigger.addEventListener('click', function() {
            const modalId = this.dataset.modal;
            if (modalId) {
                const modal = document.getElementById(modalId);
                if (modal) {
                    modal.style.display = 'flex';
                    modal.classList.add('open');
                }
            }
        });
    });
    
    // Додаємо обробники для закриття модальних вікон
    document.querySelectorAll('.modal-close').forEach(close => {
        close.addEventListener('click', function() {
            const modal = this.closest('.modal');
            if (modal) {
                modal.classList.remove('open');
                setTimeout(() => {
                    modal.style.display = 'none';
                }, 300);
            }
        });
    });
}

/**
* Ініціалізація модальних вікон
*/
function initModals() {
    const modalTriggers = document.querySelectorAll('.modal-trigger');
    const modals = document.querySelectorAll('.modal');
    
    if (!modalTriggers.length && !modals.length) return;
    
    // Додаємо ARIA-атрибути та підготовлюємо модальні вікна
    modals.forEach(modal => {
        // Якщо модальне вікно вже ініціалізоване, пропускаємо
        if (modal.dataset.initialized === 'true') return;
        
        modal.setAttribute('role', 'dialog');
        modal.setAttribute('aria-modal', 'true');
        modal.setAttribute('aria-hidden', 'true');
        
        // Перевіряємо наявність кнопки закриття
        if (!modal.querySelector('.modal-close')) {
            const closeButton = document.createElement('button');
            closeButton.className = 'modal-close';
            closeButton.innerHTML = '&times;';
            closeButton.setAttribute('aria-label', 'Закрити');
            
            const modalContent = modal.querySelector('.modal-content');
            if (modalContent) {
                modalContent.appendChild(closeButton);
            } else {
                // Створюємо обгортку контенту, якщо її немає
                const content = document.createElement('div');
                content.className = 'modal-content';
                while (modal.firstChild) {
                    content.appendChild(modal.firstChild);
                }
                content.appendChild(closeButton);
                modal.appendChild(content);
            }
        }
        
        // Додаємо обробник для кнопки закриття
        const closeButton = modal.querySelector('.modal-close');
        if (closeButton) {
            closeButton.addEventListener('click', function() {
                closeModal(modal);
            });
        }
        
        // Додаємо обробник для закриття при кліку на фон
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                closeModal(this);
            }
        });
        
        // Додаємо елементи для фокусування
        const focusStart = document.createElement('div');
        focusStart.className = 'focus-trap';
        focusStart.setAttribute('tabindex', '0');
        focusStart.style.position = 'absolute';
        focusStart.style.opacity = '0';
        focusStart.style.pointerEvents = 'none';
        
        const focusEnd = focusStart.cloneNode(true);
        
        modal.insertBefore(focusStart, modal.firstChild);
        modal.appendChild(focusEnd);
        
        // Встановлюємо флаг ініціалізації
        modal.dataset.initialized = 'true';
    });
    
    // Додаємо обробники для тригерів
    modalTriggers.forEach(trigger => {
        // Якщо тригер вже ініціалізовано, пропускаємо
        if (trigger.dataset.initialized === 'true') return;
        
        trigger.addEventListener('click', function(e) {
            e.preventDefault();
            const modalId = this.dataset.modal;
            if (modalId) {
                openModal(modalId);
            }
        });
        
        // Встановлюємо флаг ініціалізації
        trigger.dataset.initialized = 'true';
    });
    
    // Функція для відкриття модального вікна
    window.openModal = function(modalId) {
        const modal = typeof modalId === 'string' ? document.getElementById(modalId) : modalId;
        if (!modal) return;
        
        // Зберігаємо елемент, який мав фокус
        const activeElement = document.activeElement;
        modal.dataset.previouslyFocused = activeElement ? activeElement.id : '';
        
        // Відображаємо модальне вікно з анімацією
        modal.style.display = 'flex';
        setTimeout(() => {
            modal.classList.add('open');
            modal.setAttribute('aria-hidden', 'false');
        }, 10);
        
        // Блокуємо прокрутку на основній сторінці
        document.body.classList.add('modal-open');
        
        // Встановлюємо фокус на перший інтерактивний елемент
        const focusableElements = modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
        if (focusableElements.length > 0) {
            setTimeout(() => {
                focusableElements[0].focus();
            }, 100);
        } else {
            // Якщо немає фокусованих елементів, фокусуємося на модальному вікні
            modal.setAttribute('tabindex', '-1');
            modal.focus();
        }
        
        // Додаємо обробник для утримання фокусу
        modal.addEventListener('keydown', trapFocus);
        
        // Додаємо обробник для клавіші Escape
        document.addEventListener('keydown', handleEscapeKey);
    };
    
    // Функція для закриття модального вікна
    window.closeModal = function(modalId) {
        const modal = typeof modalId === 'string' ? document.getElementById(modalId) : modalId;
        if (!modal) return;
        
        // Закриваємо модальне вікно з анімацією
        modal.classList.remove('open');
        modal.setAttribute('aria-hidden', 'true');
        setTimeout(() => {
            modal.style.display = 'none';
        }, 300);
        
        // Розблоковуємо прокрутку
        document.body.classList.remove('modal-open');
        
        // Видаляємо обробники подій
        modal.removeEventListener('keydown', trapFocus);
        document.removeEventListener('keydown', handleEscapeKey);
        
        // Повертаємо фокус на попередній елемент
        const previouslyFocusedId = modal.dataset.previouslyFocused;
        if (previouslyFocusedId) {
            const element = document.getElementById(previouslyFocusedId);
            if (element) element.focus();
        }
    };
    
    // Функція для утримання фокусу всередині модального вікна
    function trapFocus(e) {
        if (e.key !== 'Tab') return;
        
        const modal = e.currentTarget;
        const focusableElements = Array.from(modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'));
        
        if (focusableElements.length === 0) return;
        
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
        
        if (e.shiftKey) {
            if (document.activeElement === firstElement) {
                e.preventDefault();
                lastElement.focus();
            }
        } else {
            if (document.activeElement === lastElement) {
                e.preventDefault();
                firstElement.focus();
            }
        }
    }
    
    // Функція для обробки клавіші Escape
    function handleEscapeKey(e) {
        if (e.key === 'Escape') {
            const openModal = document.querySelector('.modal.open');
            if (openModal) {
                closeModal(openModal);
            }
        }
    }
    
    // Додаємо стилі для покращення модальних вікон на мобільних
    const style = document.createElement('style');
    style.textContent = `
        body.modal-open {
            overflow: hidden;
        }
        
        .modal {
            opacity: 0;
            transition: opacity 0.3s ease;
        }
        
        .modal.open {
            opacity: 1;
        }
        
        .modal-content {
            transform: translateY(20px);
            transition: transform 0.3s ease;
        }
        
        .modal.open .modal-content {
            transform: translateY(0);
        }
        
        @media (max-width: 767px) {
            .modal-content {
                max-height: 85vh;
                overflow-y: auto;
                margin: 15px;
                padding: 1.5rem;
            }
        }
    `;
    document.head.appendChild(style);
}

/**
* Ініціалізація 3D ефектів для карток з використанням VanillaTilt
*/
function initVanillaTilt() {
    // Перевіряємо, чи завантажено бібліотеку VanillaTilt
    if (typeof VanillaTilt === 'undefined') {
        console.warn('VanillaTilt library not loaded. 3D card effects will not work.');
        return;
    }
    
    // Ініціалізуємо ефект тільки для десктопних пристроїв
    if (window.innerWidth < 768) return;
    
    // Ініціалізуємо 3D-ефект для карток
    const tiltElements = document.querySelectorAll('[data-tilt]');
    
    if (tiltElements.length) {
        VanillaTilt.init(tiltElements, {
            max: 15, // максимальний нахил (в градусах)
            speed: 400, // швидкість перетворення
            glare: true, // ефект блиску
            'max-glare': 0.2, // максимальна інтенсивність блиску
            perspective: 800, // перспектива для ефекту 3D
            scale: 1.05, // збільшення при наведенні
            gyroscope: true, // використання гіроскопа на мобільних пристроях
            gyroscopeMinAngleX: -20, // мінімальний кут нахилу X для гіроскопа
            gyroscopeMaxAngleX: 20, // максимальний кут нахилу X для гіроскопа
            gyroscopeMinAngleY: -20, // мінімальний кут нахилу Y для гіроскопа
            gyroscopeMaxAngleY: 20, // максимальний кут нахилу Y для гіроскопа
            easing: "cubic-bezier(.03,.98,.52,.99)", // функція пом'якшення
            reset: true, // скидати трансформацію при виході миші
            'full-page-listening': false, // прослуховування всієї сторінки, а не лише даного елементу
        });
    }
}

/**
 * Ініціалізація фонових частинок з використанням Particles.js
 */
function initParticles() {
    // Перевіряємо, чи завантажено бібліотеку particlesJS
    if (typeof particlesJS === 'undefined') {
        console.warn('Particles.js library not loaded. Background particles will not work.');
        return;
    }
    
    // Ініціалізуємо фонові частинки для hero-секції
    const particlesContainer = document.getElementById('particles-js');
    if (!particlesContainer) return;
    
    particlesJS('particles-js', {
        "particles": {
            "number": {
                "value": 70,
                "density": {
                    "enable": true,
                    "value_area": 800
                }
            },
            "color": {
                "value": "#f5f5f5"
            },
            "shape": {
                "type": "circle",
                "stroke": {
                    "width": 0,
                    "color": "#000000"
                },
                "polygon": {
                    "nb_sides": 5
                }
            },
            "opacity": {
                "value": 0.5,
                "random": true,
                "anim": {
                    "enable": true,
                    "speed": 1,
                    "opacity_min": 0.1,
                    "sync": false
                }
            },
            "size": {
                "value": 3,
                "random": true,
                "anim": {
                    "enable": true,
                    "speed": 2,
                    "size_min": 0.3,
                    "sync": false
                }
            },
            "line_linked": {
                "enable": true,
                "distance": 150,
                "color": "#f5f5f5",
                "opacity": 0.4,
                "width": 1
            },
            "move": {
                "enable": true,
                "speed": 1,
                "direction": "none",
                "random": true,
                "straight": false,
                "out_mode": "out",
                "bounce": false,
                "attract": {
                    "enable": false,
                    "rotateX": 600,
                    "rotateY": 1200
                }
            }
        },
        "interactivity": {
            "detect_on": "canvas",
            "events": {
                "onhover": {
                    "enable": true,
                    "mode": "grab"
                },
                "onclick": {
                    "enable": true,
                    "mode": "push"
                },
                "resize": true
            },
            "modes": {
                "grab": {
                    "distance": 140,
                    "line_linked": {
                        "opacity": 1
                    }
                },
                "bubble": {
                    "distance": 400,
                    "size": 40,
                    "duration": 2,
                    "opacity": 8,
                    "speed": 3
                },
                "repulse": {
                    "distance": 200,
                    "duration": 0.4
                },
                "push": {
                    "particles_nb": 4
                },
                "remove": {
                    "particles_nb": 2
                }
            }
        },
        "retina_detect": true
    });
}

/**
 * Покращена анімація падаючих карт з повною видимістю та збільшеним розміром
 */
function initEnhancedFallingCards() {
    const fallingCardsSection = document.querySelector('.falling-cards');
    const fallingCardsContainer = document.querySelector('.falling-cards-container');
    
    // Якщо немає відповідних елементів, виходимо
    if (!fallingCardsContainer) return;
    
    // Додаємо обгортку, якщо її немає
    const sectionWrapper = fallingCardsSection || fallingCardsContainer.parentElement;
    if (!sectionWrapper) return;
    
    // Очищаємо контейнер
    fallingCardsContainer.innerHTML = '';
    
    // Посилання на зображення карт
    const cardImages = [
        'https://res.cloudinary.com/djdc6wcpg/image/upload/v1744832849/falling-card-1_ncakxb.jpg',
        'https://res.cloudinary.com/djdc6wcpg/image/upload/v1744832174/falling-card-2_kc1sog.jpg',
        'https://res.cloudinary.com/djdc6wcpg/image/upload/v1744832846/falling-card-3_zljtc1.jpg',
        'https://res.cloudinary.com/djdc6wcpg/image/upload/v1744832728/falling-card-4_twzep6.jpg',
        'https://res.cloudinary.com/djdc6wcpg/image/upload/v1744832838/falling-card-5_bbaqor.jpg'
    ];
    
    // Зменшуємо кількість карток до 0.7 від оригінальної кількості (з ~7 до 5)
    const numCards = 5; 
    const segmentWidth = 100 / numCards;
    
    // Змінна для відстеження активного стану анімації
    let animationActive = false;
    let animationInterval;
    
    // Створюємо функцію для генерації нових карток
    function createAndAnimateCards() {
        // Очищаємо старі картки, які вийшли за межі видимості
        fallingCardsContainer.querySelectorAll('.falling-card.completed').forEach(card => {
            card.remove();
        });
        
        // Створюємо нові картки
        for (let i = 0; i < numCards; i++) {
            const cardIndex = Math.floor(Math.random() * cardImages.length);
            const imageUrl = cardImages[cardIndex];
            
            const card = document.createElement('div');
            card.className = 'falling-card';
            
            // Рівномірний розподіл по ширині з невеликим випадковим зміщенням
            const segmentStart = i * segmentWidth;
            const leftPosition = segmentStart + (Math.random() * (segmentWidth * 0.7));
            
            // Випадкові параметри для падіння з постійною швидкістю та кутом
            const rotateAngle = -5 + Math.random() * 10; // від -5 до 5 градусів
            const fallingDelay = Math.random() * 3; // від 0 до 3 секунд
            const fallingDuration = 7; // постійна швидкість 7 секунд
            
            // Збільшуємо розмір карток в 1.5 рази (з ~140px до ~210px)
            const cardSize = 210 + Math.random() * 30; // від 210px до 240px
            
            // Встановлюємо CSS змінні для анімації
            card.style.setProperty('--data-x-position', leftPosition + '%');
            card.style.setProperty('--data-rotate-angle', rotateAngle + 'deg');
            card.style.setProperty('--data-falling-delay', fallingDelay + 's');
            card.style.setProperty('--data-falling-duration', fallingDuration + 's');
            card.style.setProperty('--data-card-size', cardSize + 'px');
            
            // Встановлюємо початкове положення
            card.style.left = leftPosition + '%';
            card.style.width = cardSize + 'px';
            card.style.top = '-' + cardSize + 'px';
            
            // Додаємо зображення
            const img = document.createElement('img');
            img.src = imageUrl;
            img.alt = 'Метафорична карта';
            img.loading = 'lazy';
            card.appendChild(img);
            
            // Додаємо картку в контейнер
            fallingCardsContainer.appendChild(card);
            
            // Активуємо анімацію
            setTimeout(() => {
                card.classList.add('animated');
                
                // Відмічаємо картку як завершену після закінчення анімації
                setTimeout(() => {
                    card.classList.add('completed');
                }, fallingDuration * 1000);
            }, 100);
        }
    }
    
    // Додаємо CSS для анімації падіння
    const style = document.createElement('style');
    style.textContent = `
        .falling-cards-container {
            position: relative;
            width: 100%;
            height: 100%;
            min-height: 800px; /* Збільшуємо висоту контейнера для більших карток */
            overflow: hidden;
        }
        
        .falling-card {
            position: absolute;
            z-index: 2;
            width: var(--data-card-size, 210px); /* Збільшений розмір за замовчуванням */
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
            border-radius: 8px;
            overflow: hidden;
            transform: rotate(var(--data-rotate-angle, 0deg));
            transition: transform 0.3s ease;
            opacity: 0;
        }
        
        .falling-card img {
            width: 100%;
            height: auto;
            display: block;
            border-radius: 8px;
        }
        
        .falling-card.animated {
            animation: falling var(--data-falling-duration, 7s) forwards var(--data-falling-delay, 0s) linear;
        }
        
        @keyframes falling {
            0% {
                top: -300px; /* Збільшуємо початкову точку для більших карток */
                transform: rotate(var(--data-rotate-angle, 0deg));
                opacity: 0;
            }
            10% {
                opacity: 1;
            }
            100% {
                top: calc(100% - 50px); /* Гарантуємо, що картки повністю видно перед зникненням */
                transform: rotate(var(--data-rotate-angle, 0deg)); /* Постійний кут */
                opacity: 0.8;
            }
        }
        
        /* Впевнюємось, що картки не перекриваються */
        .falling-card:nth-child(odd) {
            z-index: 1;
        }
        
        .falling-card:nth-child(even) {
            z-index: 2;
        }
    `;
    document.head.appendChild(style);
    
    // Використовуємо IntersectionObserver для запуску анімації, коли секція входить у в'юпорт
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Запускаємо анімацію, якщо вона ще не запущена
                    if (!animationActive) {
                        animationActive = true;
                        createAndAnimateCards();
                        // Створюємо нові картки регулярно, але рідше (0.7 від оригінальної частоти)
                        animationInterval = setInterval(createAndAnimateCards, 6000); // Збільшено з 4000 до 6000
                    }
                } else {
                    // Зупиняємо анімацію, коли секція виходить з в'юпорта
                    animationActive = false;
                    clearInterval(animationInterval);
                }
            });
        }, {
            threshold: 0.1, // Запуск, коли 10% секції у в'юпорті
            rootMargin: '0px' // Додаткова область навколо в'юпорта
        });
        
        observer.observe(sectionWrapper);
    } else {
        // Запасний варіант для старих браузерів
        animationActive = true;
        createAndAnimateCards();
        animationInterval = setInterval(createAndAnimateCards, 6000); // Збільшено з 4000 до 6000
    }
    
    // Зупиняємо анімацію, коли сторінка не активна
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            clearInterval(animationInterval);
        } else if (animationActive) {
            clearInterval(animationInterval);
            animationInterval = setInterval(createAndAnimateCards, 6000); // Збільшено з 4000 до 6000
        }
    });
}

/**
 * Приховує логотип-зображення, залишаючи тільки текст "Roots & Wings"
 */
function hideLogoImage() {
    const logoImg = document.querySelector('.logo-img');
    if (logoImg) {
        logoImg.style.display = 'none';
        
        // Збільшуємо шрифт тексту логотипу для більш виразного відображення
        const logoText = document.querySelector('.logo-text');
        if (logoText) {
            logoText.style.fontSize = '1.8rem';
            logoText.style.fontWeight = '700';
        }
    }
}

/**
 * Підганяє розміри карток у сітці під розміри зображень
 */
function adjustCardSizeToImages() {
    const gridCards = document.querySelectorAll('.grid-card');
    
    gridCards.forEach(card => {
        // Знаходимо зображення всередині картки
        const cardImage = card.querySelector('img');
        if (cardImage) {
            // Після завантаження зображення налаштовуємо розмір картки
            if (cardImage.complete) {
                adjustCardToImage(card, cardImage);
            } else {
                cardImage.onload = () => adjustCardToImage(card, cardImage);
            }
        }
    });
    
    function adjustCardToImage(card, image) {
        // Отримуємо природні розміри зображення
        const imageRatio = image.naturalWidth / image.naturalHeight;
        
        // Встановлюємо фіксоване співвідношення сторін для картки
        card.style.aspectRatio = imageRatio;
        
        // Переконуємося, що зображення поміщається повністю
        image.style.width = '100%';
        image.style.height = '100%';
        image.style.objectFit = 'contain'; // Забезпечуємо повне відображення без обрізання
    }
}

// Ініціалізуємо слухачі подій для вікна
window.addEventListener('load', function() {
    // Перевіряємо, чи вже було завантажено сторінку
    if (document.body.classList.contains('loaded')) {
        // Якщо так, запускаємо початкові анімації
        startInitialAnimations();
    }
});

// Оптимізація для обробки зміни розміру вікна
window.addEventListener('resize', debounce(function() {
    // Оновлюємо карусель карт
    if (typeof updateCarouselGlobal === 'function') {
        updateCarouselGlobal();
    }
    
    // Оновлюємо сітку карт для адаптації до нового розміру екрану
    const gridContainer = document.querySelector('.cards-grid-container');
    if (gridContainer) {
        gridContainer.style.transform = 'rotateX(0) rotateY(0)';
        
        const gridCards = gridContainer.querySelectorAll('.grid-card');
        gridCards.forEach(card => {
            card.style.transform = 'scale(0.95) translateZ(0)';
        });
    }
    
    // Перевіряємо видимість елементів меню
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const desktopNav = document.querySelector('.desktop-nav');
    
    if (mobileMenuToggle && desktopNav) {
        const isMobile = window.innerWidth < 768;
        
        if (isMobile) {
            desktopNav.setAttribute('aria-hidden', 'true');
            desktopNav.style.display = 'none';
            mobileMenuToggle.style.display = 'block';
            // Вимикаємо кастомний курсор на мобільних
            hideCustomCursor();
        } else {
            desktopNav.removeAttribute('aria-hidden');
            desktopNav.style.display = 'flex';
            mobileMenuToggle.style.display = 'none';
            
            // Закриваємо мобільне меню, якщо воно відкрите
            const mobileMenu = document.querySelector('.mobile-menu');
            if (mobileMenu && mobileMenu.classList.contains('open')) {
                mobileMenu.classList.remove('open');
                document.body.classList.remove('menu-open');
                mobileMenuToggle.classList.remove('active');
            }
        }
    }
    
    // Підганяємо розміри карток при зміні розмірів вікна
    adjustCardSizeToImages();
    
    // Оновлюємо відступ під хедером для мобільних
    fixMobileHeaderSpace();
}, 150));

/**
 * Функція debounce для оптимізації обробки частих подій
 */
function debounce(func, wait) {
    let timeout;
    return function() {
        const context = this;
        const args = arguments;
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(context, args), wait);
    };
}

// Експортуємо функцію updateCarousel у глобальну область видимості
window.updateCarousel = function() {
    if (typeof updateCarouselGlobal === 'function') {
        updateCarouselGlobal();
    }
};