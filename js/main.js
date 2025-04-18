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
        
        // Ініціалізуємо інтерактивні компоненти
        initCardSpread();
        
        // Покращена проста карусель з рухом зліва направо
        initImprovedCarousel();
        
        initCardDeck();
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
        }
        
        @media (min-width: 768px) {
            .text-block:hover, .content-text:hover, .feature-text:hover, .info-text:hover {
                transform: translateY(-5px);
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
        
        @media (max-width: 767px) {
            h1 { font-size: 2rem !important; }
            h2 { font-size: 1.75rem !important; }
            h3 { font-size: 1.5rem !important; }
            
            .text-block, .content-text, .feature-text, .info-text {
                padding: 1rem;
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
        
        // Анімація розкладання карт
        const spreadSection = document.querySelector('.cards-spread-container');
        if (spreadSection) {
            const spreadCards = spreadSection.querySelectorAll('.spread-card');
            
            spreadCards.forEach((card, index) => {
                gsap.fromTo(card, 
                    { 
                        opacity: 0, 
                        scale: 0.8,
                        x: 0,
                        y: 0,
                        rotation: 0
                    },
                    { 
                        opacity: 1, 
                        scale: 1,
                        x: card.dataset.moveX || 0,
                        y: card.dataset.moveY || 0,
                        rotation: card.dataset.rotateAngle || 0,
                        duration: 0.8,
                        delay: index * 0.2,
                        ease: 'power2.out',
                        scrollTrigger: {
                            trigger: spreadSection,
                            start: 'top 70%',
                            toggleActions: 'play none none none'
                        }
                    }
                );
            });
        }
        
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
* Ініціалізація інтерактивних карток з розкладанням
*/
function initCardSpread() {
    const spreadCards = document.querySelectorAll('.spread-card');
    
    spreadCards.forEach(card => {
        if (!card) return;
        
        // Створюємо дані для анімації
        const rotateAngle = card.dataset.rotateAngle || 0;
        const moveX = card.dataset.moveX || 0;
        const moveY = card.dataset.moveY || 0;
        const rotateAdd = card.dataset.rotateAdd || 5; // Додаткове обертання при наведенні
        
        // Додаємо ARIA-атрибути для доступності
        card.setAttribute('role', 'button');
        card.setAttribute('aria-pressed', 'false');
        card.setAttribute('tabindex', '0');
        card.setAttribute('aria-label', 'Інтерактивна метафорична карта');
        
        // Додаємо класи для початкового положення
        card.classList.add('spread-card-positioned');
        
        // Встановлюємо початкове трансформування
        card.style.transform = `translate(-50%, -50%) translateX(${moveX}px) translateY(${moveY}px) rotate(${rotateAngle}deg)`;
        
        // Ефект при наведенні
        card.addEventListener('mouseenter', function() {
            this.style.transform = `translate(-50%, -50%) translateX(${moveX}px) translateY(${moveY}px) translateZ(30px) rotate(${parseFloat(rotateAngle) + parseFloat(rotateAdd)}deg)`;
            this.style.zIndex = '10';
            this.classList.add('hover');
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = `translate(-50%, -50%) translateX(${moveX}px) translateY(${moveY}px) rotate(${rotateAngle}deg)`;
            this.style.zIndex = '';
            this.classList.remove('hover');
        });
        
        // Перевертання картки при кліку
        card.addEventListener('click', function() {
            this.classList.toggle('flipped');
            
            // Оновлюємо ARIA-атрибути
            this.setAttribute('aria-pressed', this.classList.contains('flipped'));
            
            // Повертаємо картку через 2 секунди
            if (this.classList.contains('flipped')) {
                setTimeout(() => {
                    this.classList.remove('flipped');
                    this.setAttribute('aria-pressed', 'false');
                }, 2000);
            }
        });
        
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
* Ініціалізація покращеної каруселі з рухом зліва направо
*/
function initImprovedCarousel() {
    const carousel = document.querySelector('.carousel-3d');
    const prevBtn = document.querySelector('.carousel-prev');
    const nextBtn = document.querySelector('.carousel-next');
    
    if (!carousel) return;
    
    // Отримуємо або створюємо контейнер для карт
    let container = carousel.querySelector('.carousel-container');
    if (!container) {
        container = document.createElement('div');
        container.className = 'carousel-container';
        
        // Перенесення карток у контейнер, якщо вони вже є
        while (carousel.firstChild) {
            if (carousel.firstChild !== prevBtn && carousel.firstChild !== nextBtn) {
                container.appendChild(carousel.firstChild);
            } else {
                break;
            }
        }
        
        carousel.insertBefore(container, carousel.firstChild);
    }
    
    // Отримуємо всі карти
    let cards = carousel.querySelectorAll('.carousel-card');
    
    // Якщо карток менше 12, додаємо необхідну кількість
    if (cards.length < 12) {
        const cardsToAdd = 12 - cards.length;
        const cardTemplate = cards[0]?.cloneNode(true);
        
        if (cardTemplate) {
            for (let i = 0; i < cardsToAdd; i++) {
                const newCard = cardTemplate.cloneNode(true);
                newCard.dataset.index = cards.length + i;
                container.appendChild(newCard);
            }
        }
        
        // Оновлюємо список карток
        cards = carousel.querySelectorAll('.carousel-card');
    }
    
    // Змінюємо стилізацію каруселі
    carousel.classList.remove('carousel-3d');
    carousel.classList.add('smooth-carousel');
    
    // Додаємо CSS стилі для горизонтальної каруселі
    const carouselStyle = document.createElement('style');
    carouselStyle.textContent = `
        .smooth-carousel {
            position: relative;
            overflow: hidden;
            width: 100%;
            margin: 2rem 0;
        }
        
        .carousel-container {
            display: flex;
            transition: transform 0.8s ease;
            width: 100%;
        }
        
        .carousel-card {
            flex: 0 0 auto;
            width: calc(25% - 20px);
            margin: 0 10px;
            transition: all 0.3s ease;
            transform-origin: center center;
            cursor: pointer;
            box-shadow: 0 5px 15px rgba(0,0,0,0.1);
            border-radius: 8px;
            overflow: hidden;
            will-change: transform;
        }
        
        .carousel-card:hover {
            transform: scale(1.05);
            z-index: 10;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        }
        
        .carousel-card .card-inner {
            width: 100%;
            height: 100%;
            position: relative;
            overflow: hidden;
            border-radius: 8px;
        }
        
        .carousel-card img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            transition: transform 0.5s ease;
        }
        
        .carousel-card:hover img {
            transform: scale(1.05);
        }
        
        .carousel-controls {
            position: absolute;
            width: 100%;
            top: 50%;
            transform: translateY(-50%);
            display: flex;
            justify-content: space-between;
            padding: 0 20px;
            pointer-events: none;
        }
        
        .carousel-prev, .carousel-next {
            width: 40px;
            height: 40px;
            background: rgba(255, 255, 255, 0.8);
            border: none;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            transition: all 0.3s ease;
            z-index: 5;
            pointer-events: auto;
            color: #333;
        }
        
        .carousel-prev:hover, .carousel-next:hover {
            background: white;
            box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
            transform: scale(1.1);
        }
        
        @media (max-width: 1024px) {
            .carousel-card {
                width: calc(33.333% - 20px);
            }
        }
        
        @media (max-width: 768px) {
            .carousel-card {
                width: calc(50% - 20px);
            }
        }
        
        @media (max-width: 480px) {
            .carousel-card {
                width: calc(100% - 20px);
            }
        }
    `;
    document.head.appendChild(carouselStyle);
    
    // Налаштування для анімації
    let position = 0;
    let cardWidth;
    let animationId;
    let isPaused = false;
    
    // Функція для розрахунку ширини карток в залежності від екрану
    function updateCardWidth() {
        const viewportWidth = window.innerWidth;
        
        if (viewportWidth <= 480) {
            cardWidth = 100; // 1 картка на ширину для мобільних
        } else if (viewportWidth <= 768) {
            cardWidth = 50;  // 2 картки на ширину для планшетів
        } else if (viewportWidth <= 1024) {
            cardWidth = 33.333; // 3 картки на ширину для невеликих десктопів
        } else {
            cardWidth = 25; // 4 картки на ширину для десктопів
        }
        
        // Застосовуємо нову ширину
        cards.forEach(card => {
            card.style.width = `calc(${cardWidth}% - 20px)`;
        });
        
        return cardWidth;
    }
    
    // Початкове оновлення ширини
    updateCardWidth();
    
    // Функція анімації каруселі
    function animateCarousel() {
        if (isPaused) return;
        
        // Збільшуємо позицію (рух зліва направо)
        position -= 0.2;
        
        // Якщо досягли кінця першої картки, переходимо до початку
        if (position <= -cardWidth) {
            position = 0;
            
            // Перестановка першої картки в кінець
            const firstCard = cards[0];
            container.appendChild(firstCard);
            
            // Оновлюємо список карток
            cards = carousel.querySelectorAll('.carousel-card');
        }
        
        // Застосовуємо переміщення
        container.style.transform = `translateX(${position}%)`;
        
        // Продовжуємо анімацію
        animationId = requestAnimationFrame(animateCarousel);
    }
    
    // Запускаємо анімацію
    animationId = requestAnimationFrame(animateCarousel);
    
    // Зупиняємо анімацію при наведенні
    carousel.addEventListener('mouseenter', () => {
        isPaused = true;
        cancelAnimationFrame(animationId);
    });
    
    // Зупиняємо анімацію при дотику на мобільних
    carousel.addEventListener('touchstart', () => {
        isPaused = true;
        cancelAnimationFrame(animationId);
    }, { passive: true });
    
    // Відновлюємо анімацію при виході миші
    carousel.addEventListener('mouseleave', () => {
        isPaused = false;
        animationId = requestAnimationFrame(animateCarousel);
    });
    
    // Відновлюємо анімацію при закінченні дотику
    carousel.addEventListener('touchend', () => {
        isPaused = false;
        animationId = requestAnimationFrame(animateCarousel);
    }, { passive: true });
    
    // Обробники для кнопок
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            // Зупиняємо анімацію
            cancelAnimationFrame(animationId);
            
            // Переміщуємо останню картку на початок
            const lastCard = cards[cards.length - 1];
            container.insertBefore(lastCard, container.firstChild);
            
            // Коригуємо позицію для плавного переходу
            position = -cardWidth;
            container.style.transform = `translateX(${position}%)`;
            
            // Оновлюємо список карток
            cards = carousel.querySelectorAll('.carousel-card');
            
            // Анімація назад до 0
            function animateBack() {
                position += 5;
                
                if (position >= 0) {
                    position = 0;
                    container.style.transform = `translateX(${position}%)`;
                    
                    // Відновлюємо автоматичну анімацію, якщо не пауза
                    if (!isPaused) {
                        animationId = requestAnimationFrame(animateCarousel);
                    }
                } else {
                    container.style.transform = `translateX(${position}%)`;
                    requestAnimationFrame(animateBack);
                }
            }
            
            // Запускаємо анімацію назад
            requestAnimationFrame(animateBack);
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            // Зупиняємо анімацію
            cancelAnimationFrame(animationId);
            
            // Анімація до -cardWidth
            function animateForward() {
                position -= 5;
                
                if (position <= -cardWidth) {
                    position = 0;
                    
                    // Переміщуємо першу картку в кінець
                    const firstCard = cards[0];
                    container.appendChild(firstCard);
                    
                    // Оновлюємо позицію без анімації
                    container.style.transition = 'none';
                    container.style.transform = `translateX(${position}%)`;
                    
                    // Відновлюємо анімацію
                    setTimeout(() => {
                        container.style.transition = 'transform 0.8s ease';
                        
                        // Оновлюємо список карток
                        cards = carousel.querySelectorAll('.carousel-card');
                        
                        // Відновлюємо автоматичну анімацію, якщо не пауза
                        if (!isPaused) {
                            animationId = requestAnimationFrame(animateCarousel);
                        }
                    }, 10);
                } else {
                    container.style.transform = `translateX(${position}%)`;
                    requestAnimationFrame(animateForward);
                }
            }
            
            // Запускаємо анімацію вперед
            requestAnimationFrame(animateForward);
        });
    }
    
    // Оновлюємо при зміні розміру вікна
    window.addEventListener('resize', () => {
        // Оновлюємо ширину карток
        const newCardWidth = updateCardWidth();
        
        // Оновлюємо змінну
        cardWidth = newCardWidth;
        
        // Скидаємо позицію, щоб уникнути проблем
        position = 0;
        container.style.transform = `translateX(${position}%)`;
    });
    
    // Функція для оновлення каруселі
    function updateCarousel() {
        // Оновлюємо ширину карток
        cardWidth = updateCardWidth();
        
        // Скидаємо позицію
        position = 0;
        container.style.transform = `translateX(${position}%)`;
    }
    
    // Робимо функцію доступною глобально
    updateCarouselGlobal = updateCarousel;
}

/**
* Ініціалізація колоди карт для витягування
*/
function initCardDeck() {
    const deck = document.querySelector('.deck');
    const drawButton = document.querySelector('.draw-button');
    const topCard = document.querySelector('.deck-top');
    
    if (!deck || !drawButton || !topCard) return;
    
    // Додаємо ARIA-атрибути для доступності
    deck.setAttribute('role', 'region');
    deck.setAttribute('aria-label', 'Колода метафоричних карт');
    drawButton.setAttribute('aria-controls', 'deck-top');
    
    drawButton.addEventListener('click', function() {
        // Змінюємо стан кнопки, щоб уникнути повторних натискань
        if (this.classList.contains('disabled')) return;
        this.classList.add('disabled');
        this.setAttribute('aria-disabled', 'true');
        
        // Перевертаємо верхню картку
        topCard.classList.add('flipped');
        topCard.setAttribute('aria-live', 'polite');
        topCard.setAttribute('aria-atomic', 'true');
        
        // Анімація витягування картки з використанням requestAnimationFrame
        let startTime;
        const animationDuration = 500; // 0.5 секунди для підняття
        const returnDuration = 500; // 0.5 секунди для повернення
        const flipDuration = 500; // 0.5 секунди для перевертання
        const waitTime = 800; // 0.8 секунди очікування перед поверненням
        const rotation = -5 + Math.random() * 10; // Випадкове обертання
        
        // Функція анімації підняття картки
        function animateUp(timestamp) {
            if (!startTime) startTime = timestamp;
            const elapsed = timestamp - startTime;
            const progress = Math.min(elapsed / animationDuration, 1);
            
            // Плавне піднімання з використанням кубічної кривої
            const y = -80 * easeOutCubic(progress);
            topCard.style.transform = `translateY(${y}px) rotate(${rotation * progress}deg)`;
            
            if (progress < 1) {
                requestAnimationFrame(animateUp);
            } else {
                // Почати перевертання
                setTimeout(() => {
                    requestAnimationFrame(animateFlip);
                }, 50);
            }
        }
        
        // Функція анімації перевертання
        function animateFlip(timestamp) {
            startTime = timestamp;
            requestAnimationFrame(function flipFrame(timestamp) {
                const elapsed = timestamp - startTime;
                const progress = Math.min(elapsed / flipDuration, 1);
                
                // Перевертання з використанням синусової інтерполяції для природного руху
                const rotateY = 180 * easeInOutSine(progress);
                topCard.style.transform = `translateY(-80px) rotate(${rotation}deg) rotateY(${rotateY}deg)`;
                
                if (progress < 1) {
                    requestAnimationFrame(flipFrame);
                } else {
                    // Чекаємо, потім повертаємо картку
                    setTimeout(() => {
                        startTime = null;
                        requestAnimationFrame(animateDown);
                    }, waitTime);
                }
            });
        }
        
        // Функція анімації опускання картки
        function animateDown(timestamp) {
            if (!startTime) startTime = timestamp;
            const elapsed = timestamp - startTime;
            const progress = Math.min(elapsed / returnDuration, 1);
            
            // Плавне повернення на місце з пружним ефектом
            const y = -80 * (1 - easeOutBack(progress));
            const rotate = rotation * (1 - easeOutQuad(progress));
            topCard.style.transform = `translateY(${y}px) rotate(${rotate}deg) rotateY(180deg)`;
            
            if (progress < 1) {
                requestAnimationFrame(animateDown);
            } else {
                // Перевертаємо картку в початкове положення
                setTimeout(() => {
                    startTime = null;
                    requestAnimationFrame(animateFlipBack);
                }, waitTime);
            }
        }
        
        // Функція анімації перевертання назад
        function animateFlipBack(timestamp) {
            if (!startTime) startTime = timestamp;
            const elapsed = timestamp - startTime;
            const progress = Math.min(elapsed / flipDuration, 1);
            
            // Перевертання назад
            const rotateY = 180 * (1 - easeInOutSine(progress));
            topCard.style.transform = `translateY(0) rotate(0) rotateY(${rotateY}deg)`;
            
            if (progress < 1) {
                requestAnimationFrame(animateFlipBack);
            } else {
                // Перемішуємо карти в колоді після повернення
                const deckCards = document.querySelectorAll('.deck-card:not(.deck-top)');
                deckCards.forEach(card => {
                    const randomRotate = -2 + Math.random() * 4; // Випадкове обертання
                    const randomY = Math.random() * -3; // Випадкове зміщення по Y
                    
                    card.style.transform = `translateY(${randomY}px) rotate(${randomRotate}deg)`;
                });
                
                // Додаємо ефект тряски колоди
                deck.classList.add('shake');
                setTimeout(() => {
                    deck.classList.remove('shake');
                }, 500);
                
                // Анімація закінчена, повертаємо картку в початковий стан
                topCard.classList.remove('flipped');
                
                // Дозволяємо знову натискати кнопку
                drawButton.classList.remove('disabled');
                drawButton.setAttribute('aria-disabled', 'false');
            }
        }
        
        // Функції інтерполяції для плавних анімацій
        function easeOutCubic(x) {
            return 1 - Math.pow(1 - x, 3);
        }
        
        function easeInOutSine(x) {
            return -(Math.cos(Math.PI * x) - 1) / 2;
        }
        
        function easeOutBack(x) {
            const c1 = 1.70158;
            const c3 = c1 + 1;
            return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
        }
        
        function easeOutQuad(x) {
            return 1 - (1 - x) * (1 - x);
        }
        
        // Запускаємо анімацію
        requestAnimationFrame(animateUp);
    });
}

/**
* Ініціалізація 3D сітки карт
*/
function initCardGrid() {
    const gridContainer = document.querySelector('.cards-grid-container');
    if (!gridContainer) return;
    
    const gridCards = document.querySelectorAll('.grid-card');
    if (!gridCards.length) return;
    
    // Додаємо ARIA-атрибути для доступності
    gridContainer.setAttribute('role', 'region');
    gridContainer.setAttribute('aria-label', 'Інтерактивна сітка метафоричних карт');
    
    gridCards.forEach((card, index) => {
        card.setAttribute('role', 'button');
        card.setAttribute('aria-label', `Метафорична карта ${index + 1}`);
        card.setAttribute('tabindex', '0');
    });
    
    // Змінні для плавної анімації
    let targetRotateX = 0;
    let targetRotateY = 0;
    let currentRotateX = 0;
    let currentRotateY = 0;
    let animationFrameId;
    
    // Додаємо ефект трансформації при русі миші тільки на великих екранах
    if (window.innerWidth >= 768) {
        gridContainer.addEventListener('mousemove', function(e) {
            const rect = gridContainer.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            
            const mouseX = e.clientX - centerX;
            const mouseY = e.clientY - centerY;
            
            // Розрахунок кута нахилу
            targetRotateX = (mouseY / rect.height) * 10; // Максимальний кут 10 градусів
            targetRotateY = (mouseX / rect.width) * -10;
            
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
                card.style.transform = `scale(0.95) translateZ(${30 + zTransform * 30}px)`;
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
                card.style.transform = 'scale(0.95) translateZ(0)';
                card.style.zIndex = '';
            });
        });
    }
    
    // Додаємо ефект наведення для кожної картки
    gridCards.forEach(card => {
        // Різні ефекти для десктопу і мобільних
        if (window.innerWidth >= 768) {
            card.addEventListener('mouseenter', function() {
                this.style.transform = 'scale(1.05) translateZ(50px)';
                this.style.zIndex = '10';
            });
            
            card.addEventListener('mouseleave', function() {
                this.style.transform = 'scale(0.95) translateZ(0)';
                this.style.zIndex = '';
            });
        } else {
            // Спрощений ефект для мобільних
            card.addEventListener('touchstart', function() {
                this.style.transform = 'scale(1.03)';
                this.style.zIndex = '10';
            }, { passive: true });
            
            card.addEventListener('touchend', function() {
                this.style.transform = 'scale(1)';
                this.style.zIndex = '';
            }, { passive: true });
        }
        
        // Додаємо підтримку клавіатури
        card.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                // Анімація для фокусу з клавіатури
                this.style.transform = 'scale(1.05) translateZ(50px)';
                this.style.zIndex = '10';
                
                // Імітуємо клік
                this.click();
                
                // Повертаємо початковий стан
                setTimeout(() => {
                    this.style.transform = 'scale(0.95) translateZ(0)';
                    this.style.zIndex = '';
                }, 300);
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
        
        // ID таблиці Google Sheets (буде налаштовано користувачем пізніше)
        const sheetId = contactForm.dataset.sheetId || 'YOUR_SHEET_ID';
        
        // URL для обробки форми через Google Apps Script
        const scriptUrl = `https://script.google.com/macros/s/AKfycbz_SHEET_ID_PLACEHOLDER/exec`;
        
        // Підготовка даних форми
        const formData = new FormData(contactForm);
        const queryString = new URLSearchParams(formData).toString();
        
        // Імітація відправки даних (справжня інтеграція буде додана пізніше)
        setTimeout(() => {
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
    
    // Додаємо стилі для контейнера кнопок, якщо їх ще немає
    if (!document.getElementById('legal-buttons-style')) {
        const style = document.createElement('style');
        style.id = 'legal-buttons-style';
        style.textContent = `
            .footer {
                padding: 2.5rem 0;
                background-color: #f8f8f8;
                border-top: 1px solid #eee;
                margin-top: 3rem;
                text-align: center;
                color: #333;
            }
            
            .legal-buttons-container {
                display: flex;
                justify-content: center;
                flex-wrap: wrap;
                margin: 1.5rem 0;
                gap: 1rem;
            }
            
            .legal-button {
                background-color: #fff;
                border: 1px solid #ddd;
                border-radius: 6px;
                padding: 0.6rem 1.2rem;
                cursor: pointer;
                transition: all 0.3s ease;
                font-size: 0.9rem;
                color: #333;
                font-family: inherit;
                box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
            }
            
            .legal-button:hover {
                background-color: #f0f0f0;
                color: #000;
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            }
            
            .legal-modal {
                max-width: 800px;
                max-height: 80vh;
                overflow-y: auto;
                color: #333;
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
 * Покращена анімація падаючих карт з випадковим розташуванням та природною фізикою
 * Карти спочатку невидимі, з'являються при прокрутці, падають і зникають під секцією
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
    
    // Посилання на зображення карт (це мають бути реальні карти з колекції)
    const cardImages = [
        'https://res.cloudinary.com/djdc6wcpg/image/upload/v1744832849/falling-card-1_ncakxb.jpg',
        'https://res.cloudinary.com/djdc6wcpg/image/upload/v1744832174/falling-card-2_kc1sog.jpg',
        'https://res.cloudinary.com/djdc6wcpg/image/upload/v1744832846/falling-card-3_zljtc1.jpg',
        'https://res.cloudinary.com/djdc6wcpg/image/upload/v1744832728/falling-card-4_twzep6.jpg',
        'https://res.cloudinary.com/djdc6wcpg/image/upload/v1744832838/falling-card-5_bbaqor.jpg'
    ];
    
    // Додаємо стилі для карт
    const cardsStyle = document.createElement('style');
    cardsStyle.textContent = `
        .falling-cards-container {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 200%;
            pointer-events: none;
            z-index: 1;
            overflow: hidden;
        }
        
        .falling-card {
            position: absolute;
            top: -250px; /* Початкова позиція за межами екрану */
            width: 150px;
            height: 230px;
            border-radius: 10px;
            box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
            opacity: 0;
            will-change: transform, opacity;
            pointer-events: none;
            transform-origin: center center;
            overflow: hidden;
            background-color: #fff;
        }
        
        .falling-card img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            object-position: center;
            border-radius: 10px;
        }
        
        /* Градієнти для плавного зникнення карт */
        .cards-fadeout-top,
        .cards-fadeout-bottom {
            position: absolute;
            left: 0;
            width: 100%;
            height: 200px;
            z-index: 3;
            pointer-events: none;
        }
        
        .cards-fadeout-top {
            top: 0;
            background: linear-gradient(to bottom, white 0%, rgba(255,255,255,0) 100%);
        }
        
        .cards-fadeout-bottom {
            bottom: 0;
            background: linear-gradient(to top, white 0%, rgba(255,255,255,0) 100%);
        }
        
        /* Анімації для появи та зникнення карт */
        @keyframes cardFadeIn {
            0% { opacity: 0; }
            100% { opacity: 1; }
        }
        
        @keyframes cardFadeOut {
            0% { opacity: 1; }
            100% { opacity: 0; }
        }
        
        /* Адаптивність для мобільних пристроїв */
        @media (max-width: 767px) {
            .falling-card {
                width: 100px;
                height: 153px; /* Зберігаємо співвідношення сторін */
            }
        }
    `;
    document.head.appendChild(cardsStyle);
    
    // Додаємо градієнти для плавного зникнення карток на кордонах секції
    const fadeoutTop = document.createElement('div');
    fadeoutTop.className = 'cards-fadeout-top';
    sectionWrapper.appendChild(fadeoutTop);
    
    const fadeoutBottom = document.createElement('div');
    fadeoutBottom.className = 'cards-fadeout-bottom';
    sectionWrapper.appendChild(fadeoutBottom);
    
    // Змінні для відстеження анімаційного стану
    let animationStarted = false;
    let currentBatchIndex = 0;
    const batchSize = 3; // Кількість карт, які падають одночасно
    const totalBatches = 5; // Загальна кількість "хвиль" падіння карт
    
    // Функція для створення однієї карти
    function createCard(imageUrl, delay = 0) {
        const card = document.createElement('div');
        card.className = 'falling-card';
        
        // Додаємо зображення карти
        const img = document.createElement('img');
        img.src = imageUrl;
        img.alt = 'Метафорична карта';
        img.loading = 'lazy'; // Лінива загрузка для оптимізації
        card.appendChild(img);
        
        // Випадкові параметри для падіння
        const xPos = 5 + Math.random() * 90; // Від 5% до 95% ширини екрана
        const rotateStart = -30 + Math.random() * 60; // Від -30 до 30 градусів
        const rotateChange = -10 + Math.random() * 20; // Зміна обертання під час падіння
        const rotateEnd = rotateStart + rotateChange;
        const fallingSpeed = 8 + Math.random() * 7; // Від 8 до 15 секунд для падіння
        
        // Встановлюємо початкові стилі
        card.style.left = `${xPos}%`;
        card.style.transform = `rotate(${rotateStart}deg)`;
        card.style.transition = `transform ${fallingSpeed}s cubic-bezier(0.25, 0.1, 0.25, 1), opacity 1s ease`;
        
        // Додаємо карту в контейнер
        fallingCardsContainer.appendChild(card);
        
        // Повертаємо карту для подальшого використання
        return { 
            element: card, 
            xPos, 
            rotateStart, 
            rotateEnd, 
            fallingSpeed, 
            delay 
        };
    }
    
    // Функція для анімації падіння карти
    function animateCard(card, delay) {
        setTimeout(() => {
            // Показуємо карту
            card.element.style.opacity = '1';
            
            // Запускаємо падіння
            const startY = -250; // Початкова позиція за межами екрану
            const endY = window.innerHeight + 250; // Кінцева позиція (нижче екрану)
            
            // Анімація падіння
            card.element.style.transform = `translateY(${endY}px) rotate(${card.rotateEnd}deg)`;
            
            // Встановлюємо початкову позицію перед анімацією
            card.element.style.top = `${startY}px`;
            
            // Зникнення карти ближче до кінця падіння
            setTimeout(() => {
                card.element.style.opacity = '0';
                
                // Видаляємо карту після завершення анімації
                setTimeout(() => {
                    if (card.element.parentNode) {
                        card.element.parentNode.removeChild(card.element);
                    }
                }, 1000);
            }, card.fallingSpeed * 900);
        }, delay);
    }
    
    // Функція для запуску однієї "хвилі" падаючих карт
    function animateBatch(batchIndex) {
        if (batchIndex >= totalBatches) return;
        
        // Вибираємо випадкові зображення для цієї хвилі
        const batchCards = [];
        for (let i = 0; i < batchSize; i++) {
            const randomImageIndex = Math.floor(Math.random() * cardImages.length);
            const cardDelay = i * 500; // Затримка між картами однієї хвилі
            
            // Створюємо карту і одразу анімуємо її
            const card = createCard(cardImages[randomImageIndex], cardDelay);
            batchCards.push(card);
            animateCard(card, cardDelay);
        }
        
        // Плануємо наступну хвилю
        currentBatchIndex = batchIndex + 1;
        setTimeout(() => {
            animateBatch(currentBatchIndex);
        }, 3000); // Затримка між хвилями ~3 секунди
    }
    
    // Створюємо IntersectionObserver для запуску анімації, коли секція потрапляє у вьюпорт
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !animationStarted) {
                    // Починаємо анімацію першої хвилі
                    animationStarted = true;
                    animateBatch(0);
                    
                    // Відключаємо спостерігач
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.2 // Запуск, коли 20% секції у вьюпорті
        });
        
        observer.observe(sectionWrapper);
    } else {
        // Відкат для браузерів без підтримки IntersectionObserver
        setTimeout(() => {
            animationStarted = true;
            animateBatch(0);
        }, 1000);
    }
    
    // Функція для перезапуску анімації (наприклад, при зміні розміру вікна)
    function restartAnimation() {
        // Зупиняємо всі таймаути
        const highestId = window.setTimeout(() => {}, 0);
        for (let i = 0; i < highestId; i++) {
            window.clearTimeout(i);
        }
        
        // Очищаємо контейнер
        fallingCardsContainer.innerHTML = '';
        
        // Скидаємо стан
        animationStarted = false;
        currentBatchIndex = 0;
        
        // Якщо секція видима, запускаємо анімацію знову
        const sectionRect = sectionWrapper.getBoundingClientRect();
        const isVisible = sectionRect.top < window.innerHeight && sectionRect.bottom > 0;
        
        if (isVisible) {
            animationStarted = true;
            animateBatch(0);
        }
    }
    
    // Слухаємо зміну розміру вікна
    window.addEventListener('resize', debounce(restartAnimation, 500));
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