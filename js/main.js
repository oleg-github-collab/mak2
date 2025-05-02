/**
 * Main JavaScript file for Roots & Wings Website
 * Metaphorical associative cards
 */

// Глобальні змінні для відстеження унікальних зображень між секціями
const usedImagesDeck = [];
const usedImagesFalling = [];
const usedImagesCarousel = [];

// Global variable for carousel update function
let updateCarouselGlobal;

// Єдина точка ініціалізації обробників подій для кнопок
document.addEventListener('DOMContentLoaded', () => {
    // Єдиний делегований обробник для всіх кнопок
    document.body.addEventListener('click', e => {
        // Обробка кнопок витягування карт
        const drawButton = e.target.closest('.draw-button');
        if (drawButton) {
            handleDrawCardClick.call(drawButton, e);
            return;
        }

        // Обробка кнопки прикладу
        const exampleButton = e.target.closest('#openExampleModal');
        if (exampleButton) {
            handleExampleButtonClick.call(exampleButton, e);
            return;
        }

        // Обробка кнопок модальних вікон
        const modalButton = e.target.closest('.modal-trigger, .modal-close, [data-modal]');
        if (modalButton) {
            handleModalButtonClick.call(modalButton, e);
            return;
        }
    });

    // Обробник кліку для кнопки витягування карт
    function handleDrawCardClick(e) {
        const deckContainer = this.closest('.card-deck-section')?.querySelector('.card-deck-container') || 
                              document.querySelector('.card-deck-container');
        
        if (!deckContainer) return;
        
        // Get all cards in deck
        const cards = deckContainer.querySelectorAll('.deck-card');
        if (!cards.length) return;
        
        // Reset all active cards
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
        
        // Вибір зображень для колоди карт
        const deckImages = [
            'https://res.cloudinary.com/djdc6wcpg/image/upload/v1745600681/i9n7r9hsuh2pyyettj4j.jpg',
            'https://res.cloudinary.com/djdc6wcpg/image/upload/v1745600682/setmj5edlqzrw111wtxz.jpg',
            'https://res.cloudinary.com/djdc6wcpg/image/upload/v1745600684/xulr8shwulwvutqttjpf.jpg',
            'https://res.cloudinary.com/djdc6wcpg/image/upload/v1745600686/z0gzhthffzz0mq8ulgyq.jpg',
            'https://res.cloudinary.com/djdc6wcpg/image/upload/v1745600687/xsprk2uwmypkcc1hkl2f.jpg',
            'https://res.cloudinary.com/djdc6wcpg/image/upload/v1745600703/hgkmrbvhftcldykixrlp.jpg',
            'https://res.cloudinary.com/djdc6wcpg/image/upload/v1745600721/fzxqt1rrvsvsipilocpe.jpg',
            'https://res.cloudinary.com/djdc6wcpg/image/upload/v1745600749/uxln9ecoyl5m12xvdzx4.jpg',
            'https://res.cloudinary.com/djdc6wcpg/image/upload/v1745600748/qoyhr1zarnmpa3mtvcip.jpg',
            'https://res.cloudinary.com/djdc6wcpg/image/upload/v1745600740/l9cfb034n04igxdlh0ov.jpg',
            'https://res.cloudinary.com/djdc6wcpg/image/upload/v1745600747/vw8b1yi6y0fnh4lune14.jpg',
            'https://res.cloudinary.com/djdc6wcpg/image/upload/v1745600743/t3gzt4cnil4ykislbknp.jpg',
            'https://res.cloudinary.com/djdc6wcpg/image/upload/v1745600738/nf7de1pek9fslrwp4n5o.jpg'
        ];
        
        // Randomly select a card
        const randomIndex = Math.floor(Math.random() * cards.length);
        const selectedCard = cards[randomIndex];
        
        // Вибираємо випадкове зображення з жорстко заданих для колоди
        const uniqueImage = deckImages[Math.floor(Math.random() * deckImages.length)];
        
        // Update card image if different from current
        const cardImage = selectedCard.querySelector('img');
        if (cardImage && cardImage.src !== uniqueImage) {
            cardImage.src = uniqueImage;
        }
        
        // Activate selected card
        selectedCard.classList.add('active');
        selectedCard.style.transform = 'translate(0, -50px) rotate(0deg) scale(1.1)';
        selectedCard.style.zIndex = 20;
        selectedCard.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.3)';
        
        // Add button animation for feedback
        this.classList.add('clicked');
        setTimeout(() => {
            this.classList.remove('clicked');
        }, 300);
    }

    // Обробник кліку для кнопки прикладу
    function handleExampleButtonClick(e) {
        if (typeof openDemoModal === 'function') {
            openDemoModal();
        } else {
            const exampleModal = document.getElementById('exampleModal');
            if (exampleModal) {
                exampleModal.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        }
    }

    // Обробник кліку для кнопок модальних вікон
    function handleModalButtonClick(e) {
        const modalId = this.dataset.modal;
        if (modalId) {
            const modal = document.getElementById(modalId);
            if (modal) {
                modal.style.display = 'flex';
                modal.classList.add('open');
                document.body.style.overflow = 'hidden';
            }
        } else if (this.classList.contains('modal-close')) {
            const modal = this.closest('.modal');
            if (modal) {
                modal.classList.remove('active');
                modal.classList.remove('open');
                document.body.style.overflow = '';
            }
        }
    }
});

// Wait for DOM to load before initializing scripts
document.addEventListener('DOMContentLoaded', function() {
    // Fix for mobile devices with scroll delay
    document.documentElement.style.scrollBehavior = 'auto';
    setTimeout(() => {
        document.documentElement.style.scrollBehavior = 'smooth';
    }, 100);

    // Load required external libraries dynamically
    loadExternalLibraries().then(() => {
        // Initialize gradient preloader with text animation
        initGradientPreloader();
        
        // Detect if mobile device
        const isMobile = window.innerWidth < 768 || 'ontouchstart' in window;
        
        // Initialize custom cursor only for desktops
        if (!isMobile) {
            initCursor();
        } else {
            // Hide cursor elements on mobile
            hideCustomCursor();
        }
        
        // Initialize main site functionality
        initMobileMenu();
        fixMobileHeaderSpace();
        initHeaderScroll();
        initSmoothScroll();
        initAnimations();
        initImprovedCarousel();
        initAnimatedCardDeck();
        initDeckDrawButton();
        initCardGrid();
        initParallax();
        initContactForm();
        initBackToTop();
        initModals();
        initVanillaTilt();
        simplifyHeroSection();
        initOptimizedFallingCards(true);
        hideLogoImage();
        adjustCardSizeToImages();
        initLegalButtons();
        optimizeTextBlocks();
        initSocialPlaceholders();
        initExampleDemo(); // Initialize the example demo
        
        // Initialize optimized image loading
        initOptimizedImageLoading();
    }).catch(error => {
        console.error('Error loading external libraries:', error);
        // Initialize basic functionality even if libraries fail to load
        initBasicFunctionality();
        initExampleDemo(); // Initialize example demo even if libraries fail
    });
});

/**
 * Функція для отримання унікальних зображень між секціями
 * @param {string} currentSection - 'deck', 'falling', або 'carousel'
 * @returns {string} URL зображення, яке не використовується в інших секціях
 */
function getUniqueImage(currentSection) {
    // Масив зображень для колоди карт (deck)
    const deckImages = [
        'https://res.cloudinary.com/djdc6wcpg/image/upload/v1745600681/i9n7r9hsuh2pyyettj4j.jpg',
        'https://res.cloudinary.com/djdc6wcpg/image/upload/v1745600682/setmj5edlqzrw111wtxz.jpg',
        'https://res.cloudinary.com/djdc6wcpg/image/upload/v1745600684/xulr8shwulwvutqttjpf.jpg',
        'https://res.cloudinary.com/djdc6wcpg/image/upload/v1745600686/z0gzhthffzz0mq8ulgyq.jpg',
        'https://res.cloudinary.com/djdc6wcpg/image/upload/v1745600687/xsprk2uwmypkcc1hkl2f.jpg',
        'https://res.cloudinary.com/djdc6wcpg/image/upload/v1745600703/hgkmrbvhftcldykixrlp.jpg',
        'https://res.cloudinary.com/djdc6wcpg/image/upload/v1745600721/fzxqt1rrvsvsipilocpe.jpg',
        'https://res.cloudinary.com/djdc6wcpg/image/upload/v1745600749/uxln9ecoyl5m12xvdzx4.jpg',
        'https://res.cloudinary.com/djdc6wcpg/image/upload/v1745600748/qoyhr1zarnmpa3mtvcip.jpg',
        'https://res.cloudinary.com/djdc6wcpg/image/upload/v1745600740/l9cfb034n04igxdlh0ov.jpg',
        'https://res.cloudinary.com/djdc6wcpg/image/upload/v1745600747/vw8b1yi6y0fnh4lune14.jpg',
        'https://res.cloudinary.com/djdc6wcpg/image/upload/v1745600743/t3gzt4cnil4ykislbknp.jpg',
        'https://res.cloudinary.com/djdc6wcpg/image/upload/v1745600738/nf7de1pek9fslrwp4n5o.jpg'
      ];      
    
    // Масив усіх доступних зображень для інших секцій
    const cardImages = [
  'https://res.cloudinary.com/djdc6wcpg/image/upload/v1745600681/i9n7r9hsuh2pyyettj4j.jpg',
  'https://res.cloudinary.com/djdc6wcpg/image/upload/v1745600682/setmj5edlqzrw111wtxz.jpg',
  'https://res.cloudinary.com/djdc6wcpg/image/upload/v1745600683/ckjmvjpwmqs0fijtdfnd.jpg',
  'https://res.cloudinary.com/djdc6wcpg/image/upload/v1745600684/xulr8shwulwvutqttjpf.jpg',
  'https://res.cloudinary.com/djdc6wcpg/image/upload/v1745600685/aivdmsixkujkivcmlcsa.jpg',
  'https://res.cloudinary.com/djdc6wcpg/image/upload/v1745600686/z0gzhthffzz0mq8ulgyq.jpg',
  'https://res.cloudinary.com/djdc6wcpg/image/upload/v1745600687/xsprk2uwmypkcc1hkl2f.jpg',
  'https://res.cloudinary.com/djdc6wcpg/image/upload/v1745600688/lfgq2atikgu70ofz1z04.jpg',
  'https://res.cloudinary.com/djdc6wcpg/image/upload/v1745600689/pk8tdsmnynq7iwy6y6yi.jpg',
  'https://res.cloudinary.com/djdc6wcpg/image/upload/v1745600690/pgsh0sdvqvrrfy32lxyc.jpg',
  'https://res.cloudinary.com/djdc6wcpg/image/upload/v1745600691/xznzabsiebxhw0cgxnm9.jpg',
  'https://res.cloudinary.com/djdc6wcpg/image/upload/v1745600693/eaburgsknmtg8catv9jg.jpg',
  'https://res.cloudinary.com/djdc6wcpg/image/upload/v1745600694/mqme8ikqwaildu1djpau.jpg',
  'https://res.cloudinary.com/djdc6wcpg/image/upload/v1745600695/bl3kbpsypksaq3chjrl7.jpg',
  'https://res.cloudinary.com/djdc6wcpg/image/upload/v1745600696/sg4op2pp7xrca8mro8bc.jpg',
  'https://res.cloudinary.com/djdc6wcpg/image/upload/v1745600698/mle3uwaewljvoji9prv8.jpg',
  'https://res.cloudinary.com/djdc6wcpg/image/upload/v1745600699/p6yfjozbuod0lzg6ccjm.jpg',
  'https://res.cloudinary.com/djdc6wcpg/image/upload/v1745600700/olvorkbhgucy9ut6yuog.jpg',
  'https://res.cloudinary.com/djdc6wcpg/image/upload/v1745600701/tmq11ozk6ewkh6oqlnp5.jpg',
  'https://res.cloudinary.com/djdc6wcpg/image/upload/v1745600702/ulsz2bjzl8ba4fvvlsax.jpg',
  'https://res.cloudinary.com/djdc6wcpg/image/upload/v1745600703/hgkmrbvhftcldykixrlp.jpg',
  'https://res.cloudinary.com/djdc6wcpg/image/upload/v1745600704/jtwtnvcluij8685yqdhd.jpg',
  'https://res.cloudinary.com/djdc6wcpg/image/upload/v1745600706/p0iecqmavtsvkrkktlgr.jpg',
  'https://res.cloudinary.com/djdc6wcpg/image/upload/v1745600707/sse5nx43ucg1ciwmnta5.jpg',
  'https://res.cloudinary.com/djdc6wcpg/image/upload/v1745600709/iu9heh9kjz66rr3mq2rr.jpg',
  'https://res.cloudinary.com/djdc6wcpg/image/upload/v1745600710/bq6hz5jihj6najip4ykl.jpg',
  'https://res.cloudinary.com/djdc6wcpg/image/upload/v1745600711/rylo9z0bxwhpbizwlhzk.jpg',
  'https://res.cloudinary.com/djdc6wcpg/image/upload/v1745600712/a2blwfmdroplrl8f0jlc.jpg',
  'https://res.cloudinary.com/djdc6wcpg/image/upload/v1745600714/tosgkz9dbdipwnghnhyo.jpg',
  'https://res.cloudinary.com/djdc6wcpg/image/upload/v1745600716/rpcxco1ysg3gunvvehhp.jpg',
  'https://res.cloudinary.com/djdc6wcpg/image/upload/v1745600717/rt1mcwdiqpwklakzsuey.jpg',
  'https://res.cloudinary.com/djdc6wcpg/image/upload/v1745600718/vo06qnqcwsu8uippzvzu.jpg',
  'https://res.cloudinary.com/djdc6wcpg/image/upload/v1745600720/tkyqqqsf6nt9h1we8kqj.jpg',
  'https://res.cloudinary.com/djdc6wcpg/image/upload/v1745600721/fzxqt1rrvsvsipilocpe.jpg',
  'https://res.cloudinary.com/djdc6wcpg/image/upload/v1745600722/plqatwaxn8nj2qojh6hn.jpg',
  'https://res.cloudinary.com/djdc6wcpg/image/upload/v1745600723/omb8ev61heoggzbytopd.jpg',
  'https://res.cloudinary.com/djdc6wcpg/image/upload/v1745600725/knfbxovh1j51pgaijszl.jpg',
  'https://res.cloudinary.com/djdc6wcpg/image/upload/v1745600727/pvnmdfwxb09csoinnwlk.jpg',
  'https://res.cloudinary.com/djdc6wcpg/image/upload/v1745600728/nmjy4rwwpvdotix6dexv.jpg',
  'https://res.cloudinary.com/djdc6wcpg/image/upload/v1745600732/wrlsd9dywof5hk44mcxn.jpg',
  'https://res.cloudinary.com/djdc6wcpg/image/upload/v1745600733/uflkjmwo71iztk0wiqzt.jpg',
  'https://res.cloudinary.com/djdc6wcpg/image/upload/v1745600735/ur9kjv2nsjaqupweovia.jpg',
  'https://res.cloudinary.com/djdc6wcpg/image/upload/v1745600736/r661f5jkffmaxgfyl4ia.jpg',
  'https://res.cloudinary.com/djdc6wcpg/image/upload/v1745600737/gxewzqlmmviczx5zxggj.jpg',
  'https://res.cloudinary.com/djdc6wcpg/image/upload/v1745600738/nf7de1pek9fslrwp4n5o.jpg',
  'https://res.cloudinary.com/djdc6wcpg/image/upload/v1745600739/spqburarnorvmfvcjwvj.jpg',
  'https://res.cloudinary.com/djdc6wcpg/image/upload/v1745600740/l9cfb034n04igxdlh0ov.jpg',
  'https://res.cloudinary.com/djdc6wcpg/image/upload/v1745600741/nh5bpwqxh5xiunbx32es.jpg',
  'https://res.cloudinary.com/djdc6wcpg/image/upload/v1745600742/yzgnnaef8heojwrgkv12.jpg',
  'https://res.cloudinary.com/djdc6wcpg/image/upload/v1745600743/t3gzt4cnil4ykislbknp.jpg',
  'https://res.cloudinary.com/djdc6wcpg/image/upload/v1745600744/ptp39lg4e8eakv41jdhg.jpg',
  'https://res.cloudinary.com/djdc6wcpg/image/upload/v1745600746/at6yuwanlntwhaihznlw.jpg',
  'https://res.cloudinary.com/djdc6wcpg/image/upload/v1745600747/vw8b1yi6y0fnh4lune14.jpg',
  'https://res.cloudinary.com/djdc6wcpg/image/upload/v1745600748/qoyhr1zarnmpa3mtvcip.jpg',
  'https://res.cloudinary.com/djdc6wcpg/image/upload/v1745600749/uxln9ecoyl5m12xvdzx4.jpg'
];

    
    // Якщо секція - це колода карт (deck), повертаємо жорстко задані зображення
    if (currentSection === 'deck') {
        // Якщо всі зображення колоди вже використані, скидаємо відстеження
        if (usedImagesDeck.length >= deckImages.length) {
            usedImagesDeck.length = 0;
        }
        
        // Вибираємо зображення, яке ще не використовувалось
        let availableImages = deckImages.filter(img => !usedImagesDeck.includes(img));
        
        // Якщо немає доступних, використовуємо перше
        if (availableImages.length === 0) {
            availableImages = [deckImages[0]];
        }
        
        // Вибираємо випадкове зображення з доступних
        const selectedImage = availableImages[Math.floor(Math.random() * availableImages.length)];
        
        // Додаємо зображення до використаних
        usedImagesDeck.push(selectedImage);
        
        return selectedImage;
    }
    
    // Для інших секцій використовуємо загальний пул зображень
    // Створюємо множину всіх зображень, які вже використовуються в інших секціях
    const excluded = new Set([
        ...usedImagesDeck,
        ...usedImagesFalling,
        ...usedImagesCarousel
    ]);
    
    // Фільтруємо доступні зображення
    let available = cardImages.filter(img => !excluded.has(img));
    
    // Якщо немає доступних зображень, використовуємо всі (крайній випадок)
    if (available.length === 0) {
        available = cardImages;
    }
    
    // Вибираємо випадкове зображення з доступних
    const selected = available[Math.floor(Math.random() * available.length)];
    
    // Додаємо зображення до відповідного списку використаних
    if (currentSection === 'falling') usedImagesFalling.push(selected);
    if (currentSection === 'carousel') usedImagesCarousel.push(selected);
    
    return selected;
}

/**
 * Функція для генерації неперекривающихся позицій карток
 * @param {number} containerWidth - Ширина контейнера
 * @param {number} containerHeight - Висота контейнера
 * @param {number} cardWidth - Ширина картки
 * @param {number} cardHeight - Висота картки
 * @param {number} cardCount - Кількість карток
 * @returns {Array} Масив об'єктів з координатами {x, y}
 */
function generateNonOverlappingPositions(containerWidth, containerHeight, cardWidth, cardHeight, cardCount) {
    const positions = [];
    const zoneWidth = containerWidth / cardCount;
    
    for (let i = 0; i < cardCount; i++) {
        let posX, posY;
        let tries = 0;
        do {
            posX = i * zoneWidth + Math.random() * (zoneWidth - cardWidth);
            posY = Math.random() * (containerHeight - cardHeight);
            tries++;
        } while (positions.some(p => Math.hypot(p.x - posX, p.y - posY) < cardWidth * 0.8) && tries < 50);
        positions.push({ x: posX, y: posY });
    }
    return positions;
}

/**
 * Gradient preloader with text animation
 * Виправлено для повного відображення тексту на мобільних пристроях
 */
function initGradientPreloader() {
    const preloader = document.querySelector('.preloader');
    if (!preloader) return;
    
    // Add class for custom cursor
    preloader.classList.add('cursor-hover-trigger');
    
    // Set up preloader structure with gradient background
    preloader.innerHTML = `
        <div class="preloader-gradient"></div>
        <div class="preloader-text-container">
            <div class="preloader-animated-text">Ви завітали до презентації серії карт<br>"Коріння та Крила"</div>
        </div>
    `;
    
    // Add styles for gradient preloader with improved mobile text display
    const style = document.createElement('style');
    style.textContent = `
        .preloader {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 9999;
            overflow: hidden;
            transition: opacity 0.5s ease, visibility 0.5s ease;
        }
        
        .preloader-gradient {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(-45deg, #ffffff, #f5f5f5, #e0e0e0, #cccccc);
            background-size: 400% 400%;
            animation: gradientAnimation 5s ease infinite;
            z-index: -1;
        }
        
        @keyframes gradientAnimation {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
        }
        
        .preloader-text-container {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 90%;
            max-width: 800px;
            min-height: 150px;
            padding: 20px;
            overflow: visible;
        }
        
        .preloader-animated-text {
            color: #e67e22;
            font-size: 2.5rem;
            font-weight: 700;
            text-align: center;
            opacity: 0;
            transform: translateY(20px);
            animation: textFadeIn 0.8s ease forwards 0.5s, 
                       textHold 1.6s ease forwards 1.3s,
                       textFadeOut 0.8s ease forwards 2.9s;
            width: 100%;
            line-height: 1.4;
        }
        
        @media (max-width: 767px) {
            .preloader-text-container {
                min-height: 180px;
                padding: 15px 10px;
            }
            
            .preloader-animated-text {
                font-size: 1.8rem;
                width: 100%;
                word-wrap: break-word;
                line-height: 1.3;
            }
        }
        
        @keyframes textFadeIn {
            0% { opacity: 0; transform: translateY(20px); }
            100% { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes textHold {
            0%, 100% { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes textFadeOut {
            0% { opacity: 1; transform: translateY(0); }
            100% { opacity: 0; transform: translateY(-20px); }
        }
        
        body.loaded .preloader,
        .preloader[style*="visibility: hidden"],
        .preloader[style*="opacity: 0"] {
            opacity: 0 !important;
            visibility: hidden !important;
            pointer-events: none !important;
        }
        
        /* Force hide after 7 seconds as failsafe */
        @keyframes forceHidePreloader {
            to { opacity: 0; visibility: hidden; z-index: -1; display: none; }
        }
        
        .preloader {
            animation: forceHidePreloader 0s 7s forwards !important;
        }
    `;
    document.head.appendChild(style);
    
    // Text animation sequence
    setTimeout(() => {
        const textContainer = preloader.querySelector('.preloader-text-container');
        if (!textContainer) return;
        
        textContainer.innerHTML = '<div class="preloader-animated-text">Ласкаво просимо!</div>';
        
        // Set up event that will trigger after animation completes
        setTimeout(() => {
            removePreloader();
        }, 3000); // Remove after second text animation completes
    }, 3000); // Start second text after 3 seconds
    
    // Set a timeout to ensure preloader removes after 6 seconds
    setTimeout(() => {
        removePreloader();
    }, 6000);
    
    // Track page load progress
    window.addEventListener('load', () => {
        // Auto remove preloader once page is loaded
        setTimeout(() => {
            if (!document.body.classList.contains('loaded')) {
                removePreloader();
            }
        }, 6000);
    });
    
    // Handle preloader removal
    function removePreloader() {
        if (!preloader.parentNode) return;
        
        preloader.style.opacity = '0';
        preloader.style.visibility = 'hidden';
        document.body.classList.remove('no-scroll');
        document.body.classList.add('loaded');
        
        // Completely remove element after animation completes
        setTimeout(() => {
            if (preloader && preloader.parentNode) {
                preloader.parentNode.removeChild(preloader);
            }
            // Start initial animations
            startInitialAnimations();
        }, 800);
    }
    
    // Additional failsafe - if page already loaded, remove preloader immediately
    if (document.readyState === 'complete') {
        setTimeout(() => {
            removePreloader();
        }, 6000);
    }
}

/**
 * Optimized image loading system
 */
function initOptimizedImageLoading() {
    // Додавання preconnect для доменів зображень
    const domains = ['res.cloudinary.com', 'cdnjs.cloudflare.com'];
    domains.forEach(domain => {
        if (!document.querySelector(`link[rel="preconnect"][href="https://${domain}"]`)) {
            const link = document.createElement('link');
            link.rel = 'preconnect';
            link.href = `https://${domain}`;
            document.head.appendChild(link);
        }
    });
    
    // Check if IntersectionObserver is supported
    if (!('IntersectionObserver' in window)) {
        // Fallback for browsers without support - just load all images normally
        document.querySelectorAll('img[loading="lazy"], img[data-src]').forEach(img => {
            if (img.dataset.src) {
                img.src = img.dataset.src;
                delete img.dataset.src;
            }
        });
        return;
    }
    
    // Create observer for lazy loading images
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                
                // If image has data-src, use it
                if (img.dataset.src) {
                    // Create a low-quality placeholder effect
                    if (!img.dataset.loaded) {
                        img.style.filter = 'blur(5px)'; // Reduced blur for faster perception
                        img.style.transition = 'filter 0.3s ease'; // Faster transition
                    }
                    
                    // Load actual image with higher priority
                    img.src = img.dataset.src;
                    img.onload = () => {
                        img.style.filter = '';
                        img.dataset.loaded = 'true';
                    };
                    
                    delete img.dataset.src;
                }
                
                // Stop observing once loaded
                imageObserver.unobserve(img);
            }
        });
    }, {
        rootMargin: '200px', // Increased margin for earlier loading
        threshold: 0.01 // Lower threshold to start loading sooner
    });
    
    // Observe all images with loading="lazy" or data-src
    document.querySelectorAll('img[loading="lazy"], img[data-src]').forEach(img => {
        // Set initial size to prevent layout shifts
        if (!img.width && !img.height && !img.style.width && !img.style.height) {
            // For card images, enforce 2:3 aspect ratio
            if (img.closest('.carousel-card, .grid-card, .falling-card, .deck-card')) {
                img.style.aspectRatio = '2/3';
                img.style.width = '100%';
                img.style.height = 'auto';
            }
        }
        
        // Prefetch critical images immediately
        if (img.classList.contains('critical-image') || 
            img.closest('.hero-section, .carousel-card:nth-child(-n+3)') ||
            img.closest('.preloader, .header')) {
            if (img.dataset.src) {
                // Use higher priority for critical images
                const imgLoader = new Image();
                imgLoader.src = img.dataset.src;
                imgLoader.onload = () => {
                    img.src = img.dataset.src;
                    delete img.dataset.src;
                };
            }
        } else {
            // Observe non-critical images
            imageObserver.observe(img);
        }
    });
    
    // Prioritize images in the viewport
    const prioritizeViewportImages = () => {
        const viewportHeight = window.innerHeight;
        document.querySelectorAll('img[data-src]').forEach(img => {
            const rect = img.getBoundingClientRect();
            
            // If image is in viewport
            if (rect.top < viewportHeight && rect.bottom > 0) {
                // Load it immediately
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    delete img.dataset.src;
                    
                    // Stop observing
                    imageObserver.unobserve(img);
                }
            }
        });
    };
    
    // Call once and then on scroll
    prioritizeViewportImages();
    window.addEventListener('scroll', debounce(prioritizeViewportImages, 100)); // Reduced delay
}

/**
 * Optimized falling cards animation
 * Оновлена версія з унікальними зображеннями та розподілом карток без перекриття
 * @param {boolean} forceStart - Force animation to start immediately
 */
function initOptimizedFallingCards(forceStart = false) {
    const fallingCardsSection = document.querySelector('.falling-cards');
    let fallingCardsContainer = document.querySelector('.falling-cards-container');
    
    // Create container if it doesn't exist
    if (!fallingCardsContainer) {
        // Find or create the section
        const sectionWrapper = fallingCardsSection || document.createElement('section');
        if (!fallingCardsSection) {
            sectionWrapper.className = 'section falling-cards';
            // Find appropriate place to insert in DOM
            const targetSection = document.querySelector('.section:nth-child(2)');
            if (targetSection) {
                document.body.insertBefore(sectionWrapper, targetSection);
            } else {
                document.body.appendChild(sectionWrapper);
            }
        }
        
        // Create container for falling cards
        fallingCardsContainer = document.createElement('div');
        fallingCardsContainer.className = 'falling-cards-container';
        sectionWrapper.appendChild(fallingCardsContainer);
    }
    
    // Clear container
    fallingCardsContainer.innerHTML = '';
    
    // Check if mobile device
    const isMobile = window.innerWidth < 768;
    
    // Add CSS for falling animation - improved for mobile with no cropping
    const style = document.createElement('style');
    style.textContent = `
        /* Контейнер для падаючих карток - без обмеження переповнення */
        .falling-cards {
            position: relative;
            overflow: visible !important;
            padding-bottom: 800px !important;
            z-index: 1;
        }
        
        .falling-cards-container {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: calc(100% + 1000px) !important;
            pointer-events: none;
            z-index: 5;
            overflow: hidden !important;
        }
        
        .falling-card {
            position: absolute;
            z-index: 10 !important;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
            border-radius: 8px;
            transform: rotate(var(--data-rotate-angle, 0deg));
            transition: transform 0.3s ease;
            opacity: 0;
            width: var(--data-card-size, 420px) !important;
            height: auto !important;
            aspect-ratio: 2/3;
        }
        
        .falling-card img {
            width: 100%;
            height: 100%;
            display: block;
            border-radius: 8px;
            object-fit: cover;
        }
        
        .falling-card.animated {
            animation: falling var(--data-falling-duration, 8s) forwards var(--data-falling-delay, 0s) linear;
        }
        
        /* Оновлені ключові кадри для анімації - на 20% швидше */
        @keyframes falling {
            0% {
                top: -300px;
                transform: rotate(var(--data-rotate-angle, 0deg));
                opacity: 0;
            }
            10% {
                opacity: 1;
            }
            85% {
                opacity: 1;
            }
            95% {
                opacity: 0;
            }
            100% {
                top: 65vh;
                transform: rotate(var(--data-rotate-angle, 0deg));
                opacity: 0;
            }
        }
        
        /* Mobile styles - centered cards with specific tilt */
        @media (max-width: 767px) {
            .falling-card {
                width: 300px !important;
                height: auto !important;
                left: 50% !important;
                transform: translateX(-50%) rotate(var(--data-rotate-angle, 0deg)) !important;
            }
            
            .falling-cards-container {
                min-height: 800px;
            }
            
            .falling-cards {
                overflow: visible !important;
                padding-bottom: 900px !important;
            }
            
            .falling-card + .falling-card {
                margin-top: 200px !important;
            }
        }
        
        /* Дозволяємо .falling-cards-wrapper показувати картки по центру */
        .falling-cards-wrapper {
            overflow: visible !important;
        }
    `;
    document.head.appendChild(style);
    
    // Переконаємося, що секції та батьківські елементи не обрізують контент
    if (fallingCardsSection) {
        let parent = fallingCardsSection.parentElement;
        while (parent && parent !== document.body) {
            const computedStyle = window.getComputedStyle(parent);
            if (computedStyle.overflow === 'hidden') {
                parent.style.overflow = 'visible';
            }
            parent = parent.parentElement;
        }
    }
    
    // Track animation state
    let animationActive = forceStart;
    let animationInterval;
    let mobileCardCount = 0; // Track number of cards currently falling on mobile
    const maxMobileCards = 1; // Maximum number of cards for mobile
    const minDesktopCards = 3; // Minimum number of cards for desktop
    let activeCards = 0; // Кількість активних карток
    
    // Function to create falling cards with non-overlapping positions
    function createFallingCard() {
        // Clean up completed cards
        fallingCardsContainer.querySelectorAll('.falling-card.completed').forEach(card => {
            card.remove();
            activeCards--;
        });
        
        // On mobile, limit number of cards
        if (isMobile && mobileCardCount >= maxMobileCards) {
            return; // Skip creating a new card until others finish
        }
        
        // Check if we already have enough cards
        const currentCards = fallingCardsContainer.querySelectorAll('.falling-card:not(.completed)').length;
        if (!isMobile && currentCards >= minDesktopCards) {
            return; // We already have enough cards
        }
        
        // Get unique image for falling card
        const imageUrl = getUniqueImage('falling');
        
        // Create new card
        const card = document.createElement('div');
        card.className = 'falling-card';
        
        // Position distribution based on device type
        if (isMobile) {
            // Center on mobile
            card.style.left = '50%';
            mobileCardCount++;
            
            // Random tilt angle 5-20 degrees (positive or negative)
            const rotateAngle = Math.random() > 0.5 ? 
                5 + Math.random() * 15 : // 5 to 20 degrees
                -(5 + Math.random() * 15); // -5 to -20 degrees
            
            // Set CSS variables for animation
            card.style.setProperty('--data-rotate-angle', rotateAngle + 'deg');
            card.style.setProperty('--data-falling-delay', '0s'); // Instant start on mobile
            card.style.setProperty('--data-falling-duration', '8s'); // 20% faster animation
            card.style.setProperty('--data-card-size', '300px');
            
            // Set initial position
            card.style.width = '300px';
            card.style.top = '-300px';
        } else {
            // For desktop, use non-overlapping positions
            const containerWidth = fallingCardsContainer.offsetWidth;
            const cardWidth = 420 + Math.random() * 40;
            const cardHeight = cardWidth * 1.5; // Based on 2:3 aspect ratio
            
            // Generate positions for multiple cards
            const cardCount = Math.min(5, minDesktopCards - currentCards);
            const positions = generateNonOverlappingPositions(
                containerWidth, 
                fallingCardsContainer.offsetHeight * 0.5, 
                cardWidth, 
                cardHeight, 
                cardCount
            );
            
            if (positions.length > 0) {
                const position = positions[0];
                
                // Random tilt angle -5 to 5 degrees
                const rotateAngle = -5 + Math.random() * 10;
                
                // Delayed start on desktop
                const fallingDelay = Math.random() * 3;
                
                // Set CSS variables for animation
                card.style.setProperty('--data-rotate-angle', rotateAngle + 'deg');
                card.style.setProperty('--data-falling-delay', fallingDelay + 's');
                card.style.setProperty('--data-falling-duration', '8s');
                card.style.setProperty('--data-card-size', cardWidth + 'px');
                
                // Set initial position
                card.style.left = position.x + 'px';
                card.style.width = cardWidth + 'px';
                card.style.top = '-' + cardHeight + 'px';
            }
        }
        
        // Set common properties
        card.style.aspectRatio = '2/3';
        card.style.height = 'auto';
        
        // Add image
        const img = document.createElement('img');
        img.src = imageUrl;
        img.alt = 'Metaphorical card';
        img.loading = 'lazy';
        card.appendChild(img);
        
        // Add to container
        fallingCardsContainer.appendChild(card);
        activeCards++;
        
        // Activate animation
        setTimeout(() => {
            card.classList.add('animated');
            
            // Mark as completed after animation ends
            setTimeout(() => {
                card.classList.add('completed');
                
                // On mobile, decrement counter when card completes
                if (isMobile) {
                    mobileCardCount--;
                }
                
                // Check if we need to add more cards to maintain minimum
                if (!isMobile && activeCards < minDesktopCards) {
                    createFallingCard();
                }
            }, parseInt(card.style.getPropertyValue('--data-falling-duration')) * 1000);
        }, 100);
    }
    
    // Function to ensure minimum number of falling cards
    function ensureMinimumCards() {
        if (isMobile) return; // Skip on mobile
        
        const currentCards = fallingCardsContainer.querySelectorAll('.falling-card:not(.completed)').length;
        const cardsNeeded = minDesktopCards - currentCards;
        
        for (let i = 0; i < cardsNeeded; i++) {
            setTimeout(() => createFallingCard(), i * 300);
        }
    }
    
    // Start animation if forced or section is visible
    if (forceStart) {
        // Create initial cards
        if (isMobile) {
            createFallingCard(); // Just one card on mobile
        } else {
            // Create multiple cards for desktop
            for (let i = 0; i < minDesktopCards; i++) {
                setTimeout(() => createFallingCard(), i * 300);
            }
        }
        
        // Different intervals for mobile and desktop
        const interval = isMobile ? 4000 : 8000;
        animationInterval = setInterval(() => {
            createFallingCard();
            ensureMinimumCards();
        }, interval);
        animationActive = true;
    } else {
        // Use IntersectionObserver to start animation when section enters viewport
        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        // Start animation if not already running
                        if (!animationActive) {
                            animationActive = true;
                            
                            if (isMobile) {
                                createFallingCard(); // Just one card on mobile
                            } else {
                                // Create multiple cards for desktop
                                for (let i = 0; i < minDesktopCards; i++) {
                                    setTimeout(() => createFallingCard(), i * 300);
                                }
                            }
                            
                            // Different intervals for mobile and desktop
                            const interval = isMobile ? 4000 : 8000;
                            animationInterval = setInterval(() => {
                                createFallingCard();
                                ensureMinimumCards();
                            }, interval);
                        }
                    }
                });
            }, {
                threshold: 0.1,
                rootMargin: '0px'
            });
            
            if (fallingCardsSection) {
                observer.observe(fallingCardsSection);
            }
        } else {
            // Fallback for older browsers
            animationActive = true;
            
            if (isMobile) {
                createFallingCard();
            } else {
                for (let i = 0; i < minDesktopCards; i++) {
                    setTimeout(() => createFallingCard(), i * 300);
                }
            }
            
            const interval = isMobile ? 4000 : 8000;
            animationInterval = setInterval(() => {
                createFallingCard();
                ensureMinimumCards();
            }, interval);
        }
    }
    
    // Pause animation when page is not active
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            clearInterval(animationInterval);
        } else if (animationActive) {
            clearInterval(animationInterval);
            const interval = isMobile ? 4000 : 8000;
            animationInterval = setInterval(() => {
                createFallingCard();
                ensureMinimumCards();
            }, interval);
        }
    });
    
    // Update positions on window resize
    window.addEventListener('resize', debounce(() => {
        // Check if mobile device status changed
        const wasMobile = isMobile;
        const newIsMobile = window.innerWidth < 768;
        
        // If device type changed, restart animation
        if (wasMobile !== newIsMobile && animationActive) {
            // Clear existing cards
            fallingCardsContainer.innerHTML = '';
            mobileCardCount = 0;
            activeCards = 0;
            
            // Restart animation
            clearInterval(animationInterval);
            
            if (newIsMobile) {
                createFallingCard();
            } else {
                for (let i = 0; i < minDesktopCards; i++) {
                    setTimeout(() => createFallingCard(), i * 300);
                }
            }
            
            const interval = newIsMobile ? 4000 : 8000;
            animationInterval = setInterval(() => {
                createFallingCard();
                if (!newIsMobile) ensureMinimumCards();
            }, interval);
        }
    }, 300));
    
    // Clean up on page unload
    window.addEventListener('beforeunload', () => {
        clearInterval(animationInterval);
    });
}

/**
 * Initialize improved carousel with 3-card layout and auto-rotation
 * Центральна картка чітка, бокові заблюрені
 */
function initImprovedCarousel() {
    const carousel = document.querySelector('.carousel-3d, .improved-carousel');
    if (!carousel) return;
    
    // Додаємо клас improved-carousel для уніфікованої ідентифікації
    carousel.classList.add('improved-carousel');
    
    // Отримуємо всі картки в каруселі
    const cards = Array.from(carousel.querySelectorAll('.carousel-card'));
    if (cards.length < 3) {
        console.warn('Для правильної роботи каруселі потрібно щонайменше 3 картки');
        return;
    }
    
    // Додаємо стилі для 3D каруселі з більшою висотою
    const style = document.createElement('style');
    style.textContent = `
        .improved-carousel {
            position: relative;
            width: 100%;
            height: 540px; /* Висота встановлена на 540px */
            margin: 50px auto;
            perspective: 1500px;
            overflow: visible;
            display: flex;
            justify-content: center;
            align-items: center;
        }
        
        .improved-carousel .carousel-cards-container {
            position: relative;
            width: 100%;
            height: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
        }
        
        .improved-carousel .carousel-card {
            position: absolute;
            width: 320px;
            height: 480px;
            transition: all 1.5s ease;
            border-radius: 15px;
            overflow: visible;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
            aspect-ratio: 2/3;
            opacity: 0;
            transform-origin: center;
            backface-visibility: hidden;
            pointer-events: none;
        }
        
        .improved-carousel .carousel-card img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            display: block;
        }
        
        .improved-carousel .carousel-card.active {
            opacity: 1;
            transform: translateX(0) scale(1.1) rotateY(0deg);
            z-index: 10;
            filter: blur(0) brightness(1.05);
            box-shadow: 0 15px 35px rgba(0, 0, 0, 0.3);
            pointer-events: auto;
        }
        
        .improved-carousel .carousel-card.prev {
            opacity: 0.85;
            transform: translateX(-65%) scale(0.85) rotateY(25deg);
            z-index: 5;
            filter: blur(2px) brightness(0.9);
            box-shadow: -5px 10px 25px rgba(0, 0, 0, 0.2);
            pointer-events: none;
        }
        
        .improved-carousel .carousel-card.next {
            opacity: 0.85;
            transform: translateX(65%) scale(0.85) rotateY(-25deg);
            z-index: 5;
            filter: blur(2px) brightness(0.9);
            box-shadow: 5px 10px 25px rgba(0, 0, 0, 0.2);
            pointer-events: none;
        }
        
        .improved-carousel .carousel-card.far-prev {
            opacity: 0.4;
            transform: translateX(-130%) scale(0.6) rotateY(35deg);
            z-index: 1;
            filter: blur(3px) brightness(0.7);
        }
        
        .improved-carousel .carousel-card.far-next {
            opacity: 0.4;
            transform: translateX(130%) scale(0.6) rotateY(-35deg);
            z-index: 1;
            filter: blur(3px) brightness(0.7);
        }
        
        .improved-carousel .carousel-card.hidden {
            opacity: 0;
            transform: translateX(0) scale(0.3);
            z-index: 0;
        }
        
        /* Оптимізація для мобільних пристроїв */
        @media (max-width: 992px) {
            .improved-carousel {
                height: 460px;
                margin: 30px auto;
            }
            
            .improved-carousel .carousel-card {
                width: 260px;
                height: 390px;
            }
            
            .improved-carousel .carousel-card.prev {
                transform: translateX(-55%) scale(0.8) rotateY(20deg);
            }
            
            .improved-carousel .carousel-card.next {
                transform: translateX(55%) scale(0.8) rotateY(-20deg);
            }
        }
        
        @media (max-width: 576px) {
            .improved-carousel {
                height: 400px;
                margin: 20px auto;
            }
            
            .improved-carousel .carousel-card {
                width: 220px;
                height: 330px;
            }
            
            .improved-carousel .carousel-card.prev {
                transform: translateX(-50%) scale(0.75) rotateY(15deg);
            }
            
            .improved-carousel .carousel-card.next {
                transform: translateX(50%) scale(0.75) rotateY(-15deg);
            }
        }
    `;
    document.head.appendChild(style);
    
    // Створюємо контейнер для карток, якщо його ще немає
    let cardsContainer = carousel.querySelector('.carousel-cards-container');
    if (!cardsContainer) {
        cardsContainer = document.createElement('div');
        cardsContainer.className = 'carousel-cards-container';
        
        // Переміщаємо всі картки в контейнер
        cards.forEach(card => {
            // Додавання карток у трекінгові масиви для уникнення дублювання
            const cardImage = card.querySelector('img');
            if (cardImage && cardImage.src) {
                usedImagesCarousel.push(cardImage.src);
            }
            
            card.remove();
            cardsContainer.appendChild(card);
        });
        
        carousel.appendChild(cardsContainer);
    }
    
    // Поточний індекс активної картки
    let activeIndex = 0;
    
    // Функція для оновлення каруселі на основі activeIndex
    function setupCarousel() {
        cards.forEach((card, index) => {
            // Спочатку видаляємо всі класи
            card.classList.remove('active', 'prev', 'next', 'far-prev', 'far-next', 'hidden');
            
            // Визначаємо позицію картки відносно активної
            const diff = (index - activeIndex + cards.length) % cards.length;
            
            if (diff === 0) {
                // Активна картка (по центру)
                card.classList.add('active');
            } else if (diff === cards.length - 1 || diff === -1) {
                // Попередня картка (зліва)
                card.classList.add('prev');
            } else if (diff === 1) {
                // Наступна картка (справа)
                card.classList.add('next');
            } else if (diff === cards.length - 2 || diff === -2) {
                // Дальня попередня картка
                card.classList.add('far-prev');
            } else if (diff === 2) {
                // Дальня наступна картка
                card.classList.add('far-next');
            } else {
                // Приховані картки
                card.classList.add('hidden');
            }
        });
    }
    
    // Ініціалізуємо карусель
    setupCarousel();
    
    // Налаштовуємо автопрокрутку
    let autoplayInterval;
    const interval = parseInt(carousel.dataset.interval) || 4000;
    
    function startAutoplay() {
        autoplayInterval = setInterval(() => {
            activeIndex = (activeIndex + 1) % cards.length;
            setupCarousel();
        }, interval);
    }
    
    function stopAutoplay() {
        if (autoplayInterval) {
            clearInterval(autoplayInterval);
        }
    }
    
    // Запускаємо автопрокрутку
    startAutoplay();
    
    // Зупиняємо автопрокрутку при наведенні курсору, якщо це увімкнено
    carousel.addEventListener('mouseenter', () => {
        if (carousel.dataset.pauseOnHover === 'true') {
            stopAutoplay();
        }
    });
    
    carousel.addEventListener('mouseleave', () => {
        if (carousel.dataset.pauseOnHover === 'true') {
            startAutoplay();
        }
    });
    
    // При зміні видимості вкладки
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            stopAutoplay();
        } else {
            startAutoplay();
        }
    });
    
    // Обробка подій перетягування (свайпів) для мобільних
    let startX, moveX, initialX;
    let isDragging = false;
    
    function handleTouchStart(e) {
        startX = e.touches[0].clientX;
        initialX = cardsContainer.getBoundingClientRect().left;
        isDragging = true;
        stopAutoplay();
    }
    
    function handleTouchMove(e) {
        if (!isDragging) return;
        moveX = e.touches[0].clientX;
        const diffX = moveX - startX;
        // Обмежений рух для запобігання різким стрибкам
        const maxDiff = 100;
        const clampedDiff = Math.max(-maxDiff, Math.min(maxDiff, diffX));
        cardsContainer.style.transform = `translateX(${clampedDiff}px)`;
    }
    
    function handleTouchEnd() {
        if (!isDragging) return;
        isDragging = false;
        
        if ((moveX - startX) < -50) {
            // Свайп вліво - наступна картка
            activeIndex = (activeIndex + 1) % cards.length;
        } else if ((moveX - startX) > 50) {
            // Свайп вправо - попередня картка
            activeIndex = (activeIndex - 1 + cards.length) % cards.length;
        }
        
        setupCarousel();
        cardsContainer.style.transform = '';
        startAutoplay();
    }
    
    // Додаємо обробники для свайпів на мобільних
    cardsContainer.addEventListener('touchstart', handleTouchStart, { passive: true });
    cardsContainer.addEventListener('touchmove', handleTouchMove, { passive: true });
    cardsContainer.addEventListener('touchend', handleTouchEnd);
    
    // Експортуємо функцію оновлення для зовнішнього використання
    window.updateCarouselGlobal = setupCarousel;
    
    // Очищаємо ресурси при закритті сторінки
    window.addEventListener('beforeunload', () => {
        stopAutoplay();
    });
}

/**
 * Initialize social placeholders for authors
 */
function initSocialPlaceholders() {
    const authors = document.querySelectorAll('.author-card');
    
    authors.forEach(author => {
        // Find social icons
        const socialLinks = author.querySelectorAll('.social-icons a, .author-social a');
        
        socialLinks.forEach(link => {
            // Get author name for placeholders
            const authorName = author.querySelector('.author-name')?.textContent || 'Author';
            
            // If link text or classes contain "behance" for Marina or "linkedin" for Oksana
            if ((link.textContent.toLowerCase().includes('behance') || 
                link.classList.contains('behance-link') || 
                link.querySelector('.fa-behance')) && 
                authorName.toLowerCase().includes('марин')) {
                
                // Replace Behance with Telegram for Marina
                link.href = '#telegram-marina-placeholder';
                link.setAttribute('data-social', 'telegram');
                link.setAttribute('title', 'Telegram Марини');
                
                // Update icon if present
                const icon = link.querySelector('i');
                if (icon) {
                    icon.className = '';
                    icon.classList.add('fa', 'fa-telegram');
                } else {
                    link.innerHTML = '<i class="fa fa-telegram"></i>';
                }
            }
            
            // If link text or classes contain "linkedin" for Oksana
            else if ((link.textContent.toLowerCase().includes('linkedin') || 
                    link.classList.contains('linkedin-link') || 
                    link.querySelector('.fa-linkedin')) && 
                    authorName.toLowerCase().includes('оксан')) {
                
                // Replace LinkedIn with Telegram for Oksana
                link.href = '#telegram-oksana-placeholder';
                link.setAttribute('data-social', 'telegram');
                link.setAttribute('title', 'Telegram Оксани');
                
                // Update icon if present
                const icon = link.querySelector('i');
                if (icon) {
                    icon.className = '';
                    icon.classList.add('fa', 'fa-telegram');
                } else {
                    link.innerHTML = '<i class="fa fa-telegram"></i>';
                }
            }
            
            // Set placeholder attribute
            link.setAttribute('data-placeholder', 'true');
            link.setAttribute('data-original-text', link.textContent);
        });
        
        // Add Telegram placeholder if not present
        if (!author.querySelector('[data-social="telegram"]')) {
            const socialContainer = author.querySelector('.social-icons, .author-social');
            if (socialContainer) {
                const authorName = author.querySelector('.author-name')?.textContent || 'Author';
                const telegramLink = document.createElement('a');
                telegramLink.href = '#telegram-placeholder';
                telegramLink.setAttribute('data-social', 'telegram');
                telegramLink.setAttribute('data-placeholder', 'true');
                telegramLink.setAttribute('title', `Telegram ${authorName}`);
                telegramLink.innerHTML = '<i class="fa fa-telegram"></i>';
                socialContainer.appendChild(telegramLink);
            }
        }
    });
}

/**
 * Initialize deck draw button functionality
 */
function initDeckDrawButton() {
    const drawButtons = document.querySelectorAll('.draw-button');
    
    drawButtons.forEach(drawButton => {
        const deckContainer = drawButton.closest('.card-deck-section')?.querySelector('.card-deck-container') || 
                              document.querySelector('.card-deck-container');
        
        if (!drawButton || !deckContainer) return;
        
        // Набір зображень для колоди карт
        const deckImages = [
            'https://res.cloudinary.com/djdc6wcpg/image/upload/v1745600681/i9n7r9hsuh2pyyettj4j.jpg',
            'https://res.cloudinary.com/djdc6wcpg/image/upload/v1745600682/setmj5edlqzrw111wtxz.jpg',
            'https://res.cloudinary.com/djdc6wcpg/image/upload/v1745600684/xulr8shwulwvutqttjpf.jpg',
            'https://res.cloudinary.com/djdc6wcpg/image/upload/v1745600686/z0gzhthffzz0mq8ulgyq.jpg',
            'https://res.cloudinary.com/djdc6wcpg/image/upload/v1745600687/xsprk2uwmypkcc1hkl2f.jpg',
            'https://res.cloudinary.com/djdc6wcpg/image/upload/v1745600703/hgkmrbvhftcldykixrlp.jpg',
            'https://res.cloudinary.com/djdc6wcpg/image/upload/v1745600721/fzxqt1rrvsvsipilocpe.jpg',
            'https://res.cloudinary.com/djdc6wcpg/image/upload/v1745600749/uxln9ecoyl5m12xvdzx4.jpg',
            'https://res.cloudinary.com/djdc6wcpg/image/upload/v1745600748/qoyhr1zarnmpa3mtvcip.jpg',
            'https://res.cloudinary.com/djdc6wcpg/image/upload/v1745600740/l9cfb034n04igxdlh0ov.jpg',
            'https://res.cloudinary.com/djdc6wcpg/image/upload/v1745600747/vw8b1yi6y0fnh4lune14.jpg',
            'https://res.cloudinary.com/djdc6wcpg/image/upload/v1745600743/t3gzt4cnil4ykislbknp.jpg',
            'https://res.cloudinary.com/djdc6wcpg/image/upload/v1745600738/nf7de1pek9fslrwp4n5o.jpg'
        ];
        
        // Store all card images for button to randomly select from
        deckContainer.dataset.allCardImages = JSON.stringify(deckImages);
    });
    
    // Add styles for button animation
    const style = document.createElement('style');
    style.textContent = `
        .draw-button {
            padding: 12px 24px;
            background-color: var(--color-accent, #3498db);
            color: white;
            border: none;
            border-radius: 30px;
            font-size: 16px;
            cursor: pointer;
            transition: all 0.3s ease;
            margin-top: 20px;
            position: relative;
            z-index: 2;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
        }
        
        .draw-button:hover {
            background-color: var(--color-accent-dark, #2980b9);
            transform: translateY(-2px);
            box-shadow: 0 8px 20px rgba(0, 0, 0, 0.25);
        }
        
        .draw-button:active, .draw-button.clicked {
            transform: translateY(1px);
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.15);
        }
    `;
    document.head.appendChild(style);
}

/**
 * Fix header space issues on mobile devices
 */
function fixMobileHeaderSpace() {
    const header = document.querySelector('.header');
    const firstSection = document.querySelector('.section:first-of-type');
    
    if (!header || !firstSection) return;
    
    // Add CSS for mobile spacing fixes
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
            
            /* Fix for text visibility under header */
            main {
                padding-top: 60px;
            }
            
            /* Improve text readability */
            p, .text-content {
                font-size: 16px !important;
                line-height: 1.6 !important;
            }
        }
    `;
    document.head.appendChild(style);
    
    // Update padding on window resize
    window.addEventListener('resize', function() {
        if (window.innerWidth < 768) {
            const headerHeight = header.offsetHeight;
            firstSection.style.paddingTop = `calc(${headerHeight}px + 2rem)`;
        } else {
            firstSection.style.paddingTop = '';
        }
    });
    
    // Apply padding on load
    if (window.innerWidth < 768) {
        const headerHeight = header.offsetHeight;
        firstSection.style.paddingTop = `calc(${headerHeight}px + 2rem)`;
    }
}

/**
 * Hide custom cursor elements on mobile devices
 */
function hideCustomCursor() {
    const cursorElements = document.querySelectorAll('.cursor-dot, .cursor-outline, .cursor-text');
    
    cursorElements.forEach(el => {
        if (el) {
            el.style.display = 'none';
            el.remove(); // Completely remove to reduce load
        }
    });
    
    // Remove class from body
    document.body.classList.remove('cursor-enabled');
    
    // Restore standard cursor
    document.documentElement.style.cursor = '';
}

/**
 * Simplify hero section, removing floating elements
 */
function simplifyHeroSection() {
    const heroSection = document.querySelector('.hero-section');
    if (!heroSection) return;
    
    // Remove all floating cards
    const floatingCards = heroSection.querySelectorAll('.floating-card');
    floatingCards.forEach(card => card.remove());
    
    // Find hero image
    const heroImage = heroSection.querySelector('.hero-image');
    if (heroImage) {
        // Add simple hover effect
        heroImage.style.transition = 'transform 0.5s ease, box-shadow 0.5s ease';
        
        heroImage.addEventListener('mouseenter', function() {
            if (window.innerWidth >= 768) { // Desktop only
                this.style.transform = 'scale(1.03)';
                this.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.15)';
            }
        });
        
        heroImage.addEventListener('mouseleave', function() {
            this.style.transform = '';
            this.style.boxShadow = '';
        });
    }
    
    // Add styles for mobile optimization
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
 * Optimize text blocks and their animations
 */
function optimizeTextBlocks() {
    // Add styles for improved text blocks
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
            
            /* Specific style for "Who are the cards for" section */
            .target-section .text-block:hover, 
            .target-section .feature-text:hover {
                box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
                background-color: rgba(255, 255, 255, 0.8);
            }
        }
        
        /* Improve text readability */
        p, .text-content {
            line-height: 1.7;
            color: #333;
        }
        
        /* Improve contrast for headings */
        h1, h2, h3, h4, h5, h6 {
            color: #222;
            margin-bottom: 1rem;
        }
        
        /* Improved contrast for "Our Mission" section */
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
            
            /* Increase card size on mobile */
            .cards-grid-container .grid-card {
                width: 90% !important;
                height: auto !important;
                margin: 0 auto 20px;
            }
        }
    `;
    document.head.appendChild(style);
    
    // Find all text blocks and add classes
    document.querySelectorAll('.section p:not(.hero-description)').forEach(p => {
        const parent = p.parentElement;
        if (!parent.classList.contains('text-block') && 
            !parent.classList.contains('content-text') && 
            !parent.classList.contains('feature-text') &&
            !parent.classList.contains('info-text')) {
            parent.classList.add('text-block');
        }
    });
    
    // Add 3D tilt for text blocks in target section
    const targetSection = document.querySelector('.target-section');
    if (targetSection) {
        const textBlocks = targetSection.querySelectorAll('.text-block, .feature-text, .info-text');
        
        textBlocks.forEach(block => {
            // Add tracking class
            block.classList.add('text-tilt');
            
            // Add handlers for tilt on hover
            block.addEventListener('mousemove', function(e) {
                if (window.innerWidth < 768) return; // Desktop only
                
                const rect = this.getBoundingClientRect();
                const x = e.clientX - rect.left; // X position relative to block
                const y = e.clientY - rect.top; // Y position relative to block
                
                // Calculate tilt angles (max 15 degrees)
                const tiltX = ((y / rect.height) - 0.5) * 15;
                const tiltY = ((x / rect.width) - 0.5) * -15;
                
                // Apply transform
                this.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
            });
            
            // Return to original position when cursor leaves
            block.addEventListener('mouseleave', function() {
                this.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
            });
        });
    }
}

/**
 * Dynamically load external libraries
 */
function loadExternalLibraries() {
    return new Promise((resolve, reject) => {
        let librariesLoaded = 0;
        const requiredLibraries = 2; // VanillaTilt and Particles.js
        
        function checkIfComplete() {
            librariesLoaded++;
            if (librariesLoaded >= requiredLibraries) {
                resolve();
            }
        }

        // Load VanillaTilt if missing
        if (typeof VanillaTilt === 'undefined') {
            const vanillaTiltScript = document.createElement('script');
            vanillaTiltScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/vanilla-tilt/1.8.0/vanilla-tilt.min.js';
            vanillaTiltScript.onload = checkIfComplete;
            vanillaTiltScript.onerror = () => {
                console.warn('Failed to load VanillaTilt.js');
                checkIfComplete();
            };
            document.head.appendChild(vanillaTiltScript);
        } else {
            checkIfComplete();
        }
        
        // Load Particles.js if missing
        if (typeof particlesJS === 'undefined') {
            const particlesScript = document.createElement('script');
            particlesScript.src = 'https://cdn.jsdelivr.net/particles.js/2.0.0/particles.min.js';
            particlesScript.onload = checkIfComplete;
            particlesScript.onerror = () => {
                console.warn('Failed to load Particles.js');
                checkIfComplete();
            };
            document.head.appendChild(particlesScript);
        } else {
            checkIfComplete();
        }
        
        // Set timeout to avoid infinite waiting
        setTimeout(() => {
            if (librariesLoaded < requiredLibraries) {
                console.warn('Some libraries failed to load in time');
                resolve();
            }
        }, 5000);
    });
}

/**
 * Initialize basic functionality that doesn't depend on external libraries
 */
function initBasicFunctionality() {
    initGradientPreloader();
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
    initDeckDrawButton();
}

/**
 * Initial animations that start after preloader disappears
 */
function startInitialAnimations() {
    // Animate hero section elements
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
    
    // Create observer for initially visible elements
    initScrollObserver();
    
    // Immediately start falling cards animation
    initOptimizedFallingCards(true);
}

/**
 * Initialize scroll observer for animations
 */
function initScrollObserver() {
    // Check IntersectionObserver support
    if (!('IntersectionObserver' in window)) {
        // If not supported, show all elements
        document.querySelectorAll('.lazy-load, .visual-title, .split-text:not(.hero-title):not(.hero-subtitle), .content-item, .feature-card, .target-card, .author-card, .spread-card, .falling-card, .grid-card').forEach(el => {
            el.classList.add('revealed');
            el.classList.add('loaded');
        });
        return;
    }
    
    // Create observer
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                entry.target.classList.add('loaded');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    
    // Observe elements
    document.querySelectorAll('.lazy-load, .visual-title, .split-text:not(.hero-title):not(.hero-subtitle), .content-item, .feature-card, .target-card, .author-card, .spread-card, .grid-card').forEach(el => {
        observer.observe(el);
    });
}

/**
 * Custom cursor functionality
 * Only displays on desktop and popup windows
 */
function initCursor() {
    const cursor = document.querySelector('.cursor-dot') || createCursorElement('cursor-dot');
    const cursorOutline = document.querySelector('.cursor-outline') || createCursorElement('cursor-outline');
    const cursorText = document.querySelector('.cursor-text') || createCursorElement('cursor-text');
    
    // Function to create cursor elements if they don't exist
    function createCursorElement(className) {
        const element = document.createElement('div');
        element.className = className;
        document.body.appendChild(element);
        return element;
    }
    
    // Check if device has touch capabilities
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0;
    
    if (!isTouchDevice && window.innerWidth >= 768) {
        document.body.classList.add('cursor-enabled');
        
        // Apply styles for cursor elements
        const style = document.createElement('style');
        style.textContent = `
            .cursor-dot, .cursor-outline, .cursor-text {
                position: fixed;
                pointer-events: none;
                z-index: 9999;
            }
            
            .cursor-dot {
                width: 8px;
                height: 8px;
                background-color: #e67e22;
                border-radius: 50%;
                transform: translate(-50%, -50%);
                transition: width 0.2s, height 0.2s, opacity 0.2s;
            }
            
            .cursor-outline {
                width: 40px;
                height: 40px;
                border: 2px solid #e67e22;
                border-radius: 50%;
                transform: translate(-50%, -50%);
                transition: width 0.3s, height 0.3s, border-color 0.3s;
            }
            
            .cursor-text {
                background-color: #3498db;
                color: #fff;
                padding: 5px 10px;
                border-radius: 5px;
                font-size: 14px;
                transform: translate(-50%, -50%) translateY(-30px);
                opacity: 0;
                visibility: hidden;
                white-space: nowrap;
            }
            
            body.cursor-text-visible .cursor-text {
                opacity: 1;
                visibility: visible;
            }
            
            .cursor-hover {
                transform: translate(-50%, -50%) scale(1.5) !important;
            }
            
            .cursor-dot.cursor-hover {
                background-color: #2980b9;
                box-shadow: 0 0 10px rgba(41, 128, 185, 0.5);
            }
            
            .cursor-outline.cursor-hover {
                border-color: rgba(41, 128, 185, 0.9);
                width: 50px;
                height: 50px;
            }
            
            .cursor-click {
                transform: translate(-50%, -50%) scale(0.8) !important;
                opacity: 0.8;
            }
            
            /* Show cursor on preloader */
            .preloader .cursor-dot, .preloader .cursor-outline, 
            .preloader .cursor-hover, .preloader .cursor-click {
                z-index: 10000 !important;
            }
            
            /* Show text cursor above preloader */
            body.cursor-text-visible .cursor-text {
                z-index: 10000;
            }
        `;
        document.head.appendChild(style);
        
        // Update cursor position on mouse move using requestAnimationFrame
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
            // Smooth cursor following
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
        
        // Add effect on hover over interactive elements (including preloader elements)
        const interactiveElements = document.querySelectorAll('a, button, .card, .interactive, input, textarea, .cursor-hover-trigger, .spread-card, .carousel-card, .grid-card, .deck-card, .draw-button, .carousel-prev, .carousel-next, .modal-close, .author-photo, .floating-card, .legal-button, .btn-modal, .modal-content, .modal-body, .modal-trigger, .preloader, .preloader-enter, .preloader-welcome, .preloader-progress, .preloader-particles');
        
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursor.classList.add('cursor-hover');
                cursorOutline.classList.add('cursor-hover');
                
                // Show text for elements with data-cursor-text
                if (cursorText && el.dataset.cursorText) {
                    cursorText.textContent = el.dataset.cursorText;
                    document.body.classList.add('cursor-text-visible');
                }
            });
            
            el.addEventListener('mouseleave', () => {
                cursor.classList.remove('cursor-hover');
                cursorOutline.classList.remove('cursor-hover');
                
                // Hide text
                if (cursorText) {
                    document.body.classList.remove('cursor-text-visible');
                }
            });
        });
        
        // Add click effect
        document.addEventListener('mousedown', () => {
            cursor.classList.add('cursor-click');
            cursorOutline.classList.add('cursor-click');
        });
        
        document.addEventListener('mouseup', () => {
            cursor.classList.remove('cursor-click');
            cursorOutline.classList.remove('cursor-click');
        });
        
        // Hide standard cursor
        document.documentElement.style.cursor = 'none';
        
        // Add observer for new modal windows
        const observer = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                if (mutation.addedNodes.length) {
                    mutation.addedNodes.forEach(node => {
                        if (node.classList && (node.classList.contains('modal') || node.classList.contains('modal-content'))) {
                            const newInteractiveElements = node.querySelectorAll('a, button, .cursor-hover-trigger, .modal-close, .modal-content, .modal-body');
                            
                            newInteractiveElements.forEach(el => {
                                el.addEventListener('mouseenter', () => {
                                    cursor.classList.add('cursor-hover');
                                    cursorOutline.classList.add('cursor-hover');
                                });
                                
                                el.addEventListener('mouseleave', () => {
                                    cursor.classList.remove('cursor-hover');
                                    cursorOutline.classList.remove('cursor-hover');
                                });
                            });
                        }
                    });
                }
            });
        });
        
        observer.observe(document.body, { childList: true, subtree: true });
    } else {
        // On mobile, completely hide custom cursor
        hideCustomCursor();
    }
}

/**
 * Mobile menu functionality
 */
function initMobileMenu() {
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const mobileMenu = document.querySelector('.mobile-menu');
    const menuClose = document.querySelector('.mobile-menu-close');
    const mobileLinks = document.querySelectorAll('.mobile-nav-link');
    const header = document.querySelector('.header');
    
    if (!menuToggle || !mobileMenu) return;
    
    // Toggle menu
    menuToggle.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        menuToggle.classList.toggle('active');
        mobileMenu.classList.toggle('open');
        document.body.classList.toggle('menu-open');
        
        // Focus on first menu item for better accessibility
        if (mobileMenu.classList.contains('open') && mobileLinks.length > 0) {
            mobileLinks[0].focus();
        }
    });
    
    // Close menu
    if (menuClose) {
        menuClose.addEventListener('click', function(e) {
            e.preventDefault();
            menuToggle.classList.remove('active');
            mobileMenu.classList.remove('open');
            document.body.classList.remove('menu-open');
            menuToggle.focus(); // Return focus to menu button
        });
    }
    
    // Close menu when link clicked
    mobileLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Don't close if link opens submenu
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
    
    // Close menu when clicking outside
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
    
    // Handle Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && document.body.classList.contains('menu-open')) {
            menuToggle.classList.remove('active');
            mobileMenu.classList.remove('open');
            document.body.classList.remove('menu-open');
            menuToggle.focus(); // Return focus to menu button
        }
    });
    
    // Fix for menu to avoid navigation element duplication
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
                // Close mobile menu
                menuToggle.classList.remove('active');
                mobileMenu.classList.remove('open');
                document.body.classList.remove('menu-open');
            }
        }
    }
    
    // Call function on load
    adjustMenuVisibility();
    
    // And on window resize
    window.addEventListener('resize', adjustMenuVisibility);
    
    // Improve styles for mobile menu
    const style = document.createElement('style');
    style.textContent = `
        @media (max-width: 767px) {
            .mobile-menu {
                padding-top: 80px; /* Increase top padding for better appearance */
            }
            
            .mobile-nav-link {
                padding: 12px 20px; /* Increase tap area */
                font-size: 18px; /* Increase font for better readability */
            }
            
            .mobile-menu-toggle {
                top: 15px; /* Center hamburger relative to header */
            }
        }
    `;
    document.head.appendChild(style);
}

/**
 * Header scroll effect
 */
function initHeaderScroll() {
    const header = document.querySelector('.header');
    if (!header) return;
    
    // Check scroll position and add/remove classes
    function checkScroll() {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }
    
    // Initial check
    checkScroll();
    
    // Check on scroll with performance optimization
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
    
    // Improve header styles for mobile
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
 * Smooth scroll for anchor links
 */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (!targetElement) {
                console.warn(`Element with id=${targetId} not found`);
                return;
            }
            
            // Get offset accounting for header height
            const headerHeight = document.querySelector('.header')?.offsetHeight || 0;
            const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
            
            // Scroll to target
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
            
            // Add browser history
            history.pushState(null, null, targetId);
            
            // Close mobile menu if open
            const mobileMenu = document.querySelector('.mobile-menu');
            const menuToggle = document.querySelector('.mobile-menu-toggle');
            if (mobileMenu && mobileMenu.classList.contains('open')) {
                mobileMenu.classList.remove('open');
                document.body.classList.remove('menu-open');
                if (menuToggle) menuToggle.classList.remove('active');
            }
            
            // Set focus on target for better accessibility
            targetElement.setAttribute('tabindex', '-1');
            targetElement.focus({preventScroll: true});
            
            // Add class for target animation
            targetElement.classList.add('target-active');
            setTimeout(() => {
                targetElement.classList.remove('target-active');
            }, 1500);
        });
    });
    
    // Add handler for scroll indicator - remove this indicator per requirements
    const scrollIndicator = document.querySelector('.scroll-indicator');
    if (scrollIndicator) {
        scrollIndicator.style.display = 'none'; // Hide as requested
        scrollIndicator.remove(); // Remove completely
    }
    
    // Remove all "scroll to see animation" text
    document.querySelectorAll('.scroll-text, .scroll-hint, .scroll-instruction').forEach(el => {
        el.style.display = 'none';
        el.remove(); // Remove completely
    });
    
    // Check for any element containing text about scrolling
    document.querySelectorAll('p, div, span').forEach(el => {
        if (el.textContent && 
            (el.textContent.toLowerCase().includes('прокрутіть') || 
             el.textContent.toLowerCase().includes('scroll'))) {
            el.style.display = 'none';
            el.remove();
        }
    });
}

/**
 * Back to top button
 */
function initBackToTop() {
    const backToTopBtn = document.querySelector('.back-to-top');
    if (!backToTopBtn) return;
    
    // Add icon if not present
    if (!backToTopBtn.querySelector('i')) {
        backToTopBtn.innerHTML = '<i class="fa fa-arrow-up"></i>';
    }
    
    // Check scroll position and toggle button visibility
    function checkScrollPosition() {
        if (window.scrollY > 500) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    }
    
    // Scroll to top when button clicked
    backToTopBtn.addEventListener('click', function(e) {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
        
        // Set focus on top element
        const focusTarget = document.querySelector('header, body');
        if (focusTarget) {
            focusTarget.setAttribute('tabindex', '-1');
            focusTarget.focus({preventScroll: true});
        }
    });
    
    // Check scroll position on scroll with optimization
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
    
    // Initial check
    checkScrollPosition();
    
    // Mobile improvements
    const style = document.createElement('style');
    style.textContent = `
        .back-to-top {
            position: fixed;
            bottom: 20px;
            right: 20px;
            background-color: #333;
            color: #fff;
            border-radius: 50%;
            width: 50px;
            height: 50px;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s ease;
            z-index: 90;
        }
        
        .back-to-top i {
            font-size: 20px;
        }
        
        .back-to-top.visible {
            opacity: 1;
            visibility: visible;
        }
        
        .back-to-top:hover {
            transform: translateY(-5px);
            background-color: #444;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.25);
        }
        
        @media (max-width: 767px) {
            .back-to-top {
                width: 40px;
                height: 40px;
                bottom: 15px;
                right: 15px;
            }
            
            .back-to-top i {
                font-size: 16px;
            }
        }
    `;
    document.head.appendChild(style);
}

/**
 * Initialize all animations
 */
function initAnimations() {
    // Text splitting for animations
    initTextSplitting();
    
    // Initialize scroll animations
    initScrollAnimations();
    
    // Add enhanced card animations
    enhanceCardAnimations();
}

/**
 * Text splitting for animations
 */
function initTextSplitting() {
    const splitTextElements = document.querySelectorAll('.split-text');
    
    splitTextElements.forEach(element => {
        if (element.dataset.splitted) return; // Avoid re-splitting
        
        let text = element.textContent;
        let splitHtml = '';
        
        // Split by words
        const words = text.split(' ');
        
        words.forEach((word, wordIndex) => {
            splitHtml += `<span class="word" aria-hidden="true">`;
            
            // Split by characters
            Array.from(word).forEach((char, charIndex) => {
                splitHtml += `<span class="char" style="transition-delay: ${(wordIndex * 0.05) + (charIndex * 0.03)}s">${char}</span>`;
            });
            
            splitHtml += `</span> `;
        });
        
        // Save original text for accessibility
        const originalText = document.createElement('span');
        originalText.className = 'sr-only';
        originalText.textContent = text;
        
        element.innerHTML = splitHtml;
        element.appendChild(originalText);
        element.dataset.splitted = 'true';
    });
}

/**
 * Enhanced card animations
 */
function enhanceCardAnimations() {
    // Add styles for enhanced card animations
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
        
        /* Enhanced appear animations for cards */
        @keyframes cardAppear {
            from { opacity: 0; transform: translateY(30px); }
            to { opacity: 1; transform: translateY(0); }
        }
        
        .feature-card.revealed, .target-card.revealed, .author-card.revealed, .grid-card.revealed {
            animation: cardAppear 0.6s forwards cubic-bezier(0.2, 0.8, 0.2, 1);
        }
        
        /* Mobile styling */
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
    
    // Add additional classes for cards before the "who are the cards for" section
    const targetSection = document.querySelector('.target-section');
    if (targetSection) {
        const prevSection = targetSection.previousElementSibling;
        if (prevSection) {
            const cards = prevSection.querySelectorAll('.card, .feature-card');
            cards.forEach(card => {
                card.classList.add('enhanced-animation');
                
                // Add styles for enhanced cards
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
 * Scroll animations initialization
 */
function initScrollAnimations() {
    // Use GSAP & ScrollTrigger if available
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        // Section title animations on scroll
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
        
        // Card animations on scroll
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
        
        // Parallax animation for mission section
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
        
        // Card grid animation - disable on mobile
        const cardsGridContainer = document.querySelector('.cards-grid-container');
        if (cardsGridContainer) {
            const gridCards = cardsGridContainer.querySelectorAll('.grid-card');
            
            // Check for mobile devices
            if (window.innerWidth >= 768) {
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
            } else {
                // On mobile just show cards without animation
                gsap.set(cardsGridContainer, { rotationX: 0, rotationY: 0 });
                gridCards.forEach(card => {
                    gsap.set(card, { opacity: 1, scale: 1, z: 0 });
                });
            }
        }
    } else {
        // Alternative animations without GSAP
        document.querySelectorAll('.section-title, .feature-card, .author-card, .target-card, .grid-card').forEach((el, index) => {
            el.style.transitionDelay = `${index * 0.1}s`;
            el.classList.add('animate-on-scroll');
        });
        
        // Add styles for animations without GSAP
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
            
            @media (max-width: 767px) {
                /* Disable animations on mobile for grid section */
                .cards-grid-container {
                    transform: none !important;
                    transition: none !important;
                }
                
                .cards-grid-container .grid-card {
                    opacity: 1 !important;
                    transform: none !important;
                    transition: box-shadow 0.3s ease !important;
                }
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
 * Initialize 3D card grid (disable animation on mobile)
 */
function initCardGrid() {
    const gridContainer = document.querySelector('.cards-grid-container');
    if (!gridContainer) return;
    
    const gridCards = document.querySelectorAll('.grid-card');
    if (!gridCards.length) return;
    
    // Check if mobile device
    const isMobile = window.innerWidth < 768;
    
    // Add styles for larger cards
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
            width: 100%;
            height: auto;
            aspect-ratio: 2/3; /* Fixed 2:3 aspect ratio */
        }
        
        .grid-card img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
        
        /* Desktop animations */
        @media (min-width: 768px) {
            .grid-card:hover {
                transform: scale(1.05) translateZ(30px);
                box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
                z-index: 10;
            }
            
            .grid-card:hover img {
                transform: scale(1.05);
            }
        }
        
        /* Responsive styles */
        @media (max-width: 1024px) {
            .cards-grid-container {
                grid-template-columns: repeat(3, 1fr);
                gap: 20px;
            }
        }
        
        /* Disable animations for mobile */
        @media (max-width: 767px) {
            .cards-grid-container {
                grid-template-columns: repeat(2, 1fr);
                gap: 15px;
                transform: none !important;
                perspective: none;
                transform-style: flat;
            }
            
            .grid-card {
                transition: box-shadow 0.3s ease;
                transform: none !important; /* Disable transforms */
            }
            
            .grid-card:hover {
                transform: none !important;
                box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15);
            }
            
            .grid-card img {
                transition: none;
            }
            
            .grid-card:hover img {
                transform: none;
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
        }
    `;
    document.head.appendChild(style);
    
    // Add ARIA attributes for accessibility
    gridContainer.setAttribute('role', 'region');
    gridContainer.setAttribute('aria-label', 'Interactive grid of metaphorical cards');
    
    gridCards.forEach((card, index) => {
        card.setAttribute('role', 'button');
        card.setAttribute('aria-label', `Metaphorical card ${index + 1}`);
        card.setAttribute('tabindex', '0');
        
        // Ensure 2:3 aspect ratio
        card.style.aspectRatio = '2/3';
        
        // Add to tracking for unique images
        const cardImage = card.querySelector('img');
        if (cardImage && cardImage.src) {
            // Add to tracking list to prevent duplicates
            usedImagesCarousel.push(cardImage.src);
        }
    });
    
    // Add 3D effect ONLY for desktop
    if (!isMobile) {
        // Variables for smooth animation
        let targetRotateX = 0;
        let targetRotateY = 0;
        let currentRotateX = 0;
        let currentRotateY = 0;
        let animationFrameId;
        
        // Add transform effect on mouse move
        gridContainer.addEventListener('mousemove', function(e) {
            const rect = gridContainer.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            
            const mouseX = e.clientX - centerX;
            const mouseY = e.clientY - centerY;
            
            // Calculate tilt angle
            targetRotateX = (mouseY / rect.height) * 5; // Max 5 degrees
            targetRotateY = (mouseX / rect.width) * -5;
            
            if (!animationFrameId) {
                animationFrameId = requestAnimationFrame(updateGridAnimation);
            }
        });
        
        // Function for smooth animation
        function updateGridAnimation() {
            // Smooth approximation to target angle
            currentRotateX += (targetRotateX - currentRotateX) * 0.1;
            currentRotateY += (targetRotateY - currentRotateY) * 0.1;
            
            // Apply transform to container
            gridContainer.style.transform = `rotateX(${currentRotateX}deg) rotateY(${currentRotateY}deg)`;
            
            // Apply transform to cards
            gridCards.forEach(card => {
                // Calculate card position relative to center
                const cardRect = card.getBoundingClientRect();
                const containerRect = gridContainer.getBoundingClientRect();
                const cardCenterX = cardRect.left + cardRect.width / 2 - containerRect.left;
                const cardCenterY = cardRect.top + cardRect.height / 2 - containerRect.top;
                
                // Calculate distance from center
                const distanceX = ((cardCenterX / containerRect.width) - 0.5) * 2;
                const distanceY = ((cardCenterY / containerRect.height) - 0.5) * 2;
                
                // Calculate Z-transform
                const zTransform = Math.abs(distanceX) + Math.abs(distanceY);
                
                // Apply transform
                card.style.transform = `scale(0.98) translateZ(${20 + zTransform * 20}px)`;
            });
            
            // Continue animation if significant difference
            if (Math.abs(targetRotateX - currentRotateX) > 0.01 || Math.abs(targetRotateY - currentRotateY) > 0.01) {
                animationFrameId = requestAnimationFrame(updateGridAnimation);
            } else {
                animationFrameId = null;
            }
        }
        
        // Return to initial state when mouse leaves container
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
        
        // Add hover effect for each card
        gridCards.forEach(card => {
            card.addEventListener('mouseenter', function() {
                this.style.transform = 'scale(1.05) translateZ(40px)';
                this.style.zIndex = '10';
            });
            
            card.addEventListener('mouseleave', function() {
                this.style.transform = 'scale(0.98) translateZ(0)';
                this.style.zIndex = '';
            });
        });
    } else {
        // For mobile, disable all 3D effects
        gridContainer.style.transform = 'none';
        gridContainer.style.perspective = 'none';
        
        gridCards.forEach(card => {
            card.style.transform = 'none';
            
            // Only basic tap effect
            card.addEventListener('touchstart', function() {
                this.style.boxShadow = '0 10px 25px rgba(0, 0, 0, 0.15)';
            }, { passive: true });
            
            card.addEventListener('touchend', function() {
                this.style.boxShadow = '';
            }, { passive: true });
        });
    }
    
    // Add keyboard support
    gridCards.forEach(card => {
        card.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    });
}

/**
 * Initialize parallax effects
 */
function initParallax() {
    const parallaxElements = document.querySelectorAll('[data-parallax-speed]');
    
    if (!parallaxElements.length) return;
    
    // Use requestAnimationFrame for smooth animation
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
    
    // Optimize scroll handling
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
    
    // Initial update
    updateParallax();
}

/**
 * Initialize contact form with Google Sheets integration
 */
function initContactForm() {
    const contactForm = document.querySelector('.contact-form');
    
    if (!contactForm) return;
    
    // Add accessibility attributes
    contactForm.setAttribute('aria-live', 'polite');
    
    // Add animation for input focus
    const formInputs = contactForm.querySelectorAll('input, textarea');
    
    formInputs.forEach(input => {
        // Add wrapper for label if doesn't exist
        const wrapper = input.parentElement;
        if (!wrapper.classList.contains('input-wrapper')) {
            const newWrapper = document.createElement('div');
            newWrapper.className = 'input-wrapper';
            input.parentElement.insertBefore(newWrapper, input);
            newWrapper.appendChild(input);
            
            // Create label if doesn't exist
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
        
        // Check if value exists on load
        if (input.value) {
            input.parentElement.classList.add('focused');
        }
    });
    
    // Add or update hidden input for Google Apps Script URL
    let scriptUrlInput = contactForm.querySelector('input[name="script_url"]');
    if (!scriptUrlInput) {
        scriptUrlInput = document.createElement('input');
        scriptUrlInput.type = 'hidden';
        scriptUrlInput.name = 'script_url';
        contactForm.appendChild(scriptUrlInput);
    }
    
    // Get script URL from data attribute or use default
    scriptUrlInput.value = contactForm.dataset.scriptUrl || 'https://script.google.com/macros/s/AKfycbxNSguZ2FH8Bwc6LNxxB1ne8TGQrjqHpM8fLTwPCPcKuhtycmy8aZNCT5KpDVGvBNEXlw/exec';
    
    // Handle form submission to Google Sheets
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Form validation
        if (!validateForm(contactForm)) {
            return;
        }
        
        // Show loading state
        const submitButton = contactForm.querySelector('button[type="submit"]');
        if (!submitButton) return;
        
        const originalText = submitButton.textContent;
        submitButton.textContent = 'Надсилання...';
        submitButton.disabled = true;
        
        // Get Google Apps Script URL
        const scriptUrl = scriptUrlInput.value;
        if (!scriptUrl) {
            showError(submitButton, 'URL скрипта не налаштовано');
            submitButton.textContent = originalText;
            submitButton.disabled = false;
            return;
        }
        
        // Prepare form data
        const formData = new FormData(contactForm);
        const jsonData = {};
        
        formData.forEach((value, key) => {
            jsonData[key] = value;
        });
        
        // Add timestamp
        jsonData.timestamp = new Date().toISOString();
        
        // Send data to Google Apps Script with improved error handling
        fetch(scriptUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(jsonData),
            mode: 'cors', // Add CORS mode
            cache: 'no-cache' // Don't use cache
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Мережева помилка: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            if (data.success) {
                // Show success message
                const successMessage = contactForm.querySelector('.success-message');
                if (!successMessage) {
                    const newSuccessMessage = document.createElement('div');
                    newSuccessMessage.className = 'success-message';
                    newSuccessMessage.textContent = 'Ваше повідомлення успішно надіслано!';
                    newSuccessMessage.setAttribute('role', 'alert');
                    contactForm.appendChild(newSuccessMessage);
                } else {
                    successMessage.classList.remove('hidden');
                    successMessage.setAttribute('role', 'alert');
                }
                
                // Clear form
                contactForm.reset();
                formInputs.forEach(input => {
                    input.parentElement.classList.remove('focused');
                });
                
                // Hide message after 5 seconds
                setTimeout(() => {
                    const currentSuccessMessage = contactForm.querySelector('.success-message');
                    if (currentSuccessMessage) {
                        currentSuccessMessage.classList.add('hidden');
                    }
                }, 5000);
            } else {
                throw new Error(data.error || 'Не вдалося надіслати повідомлення');
            }
        })
        .catch(error => {
            console.error('Помилка відправки форми:', error);
            showError(submitButton, 'Помилка відправки: ' + error.message);
            
            // Add a fallback method message
            const fallbackMessage = document.createElement('div');
            fallbackMessage.className = 'fallback-message';
            fallbackMessage.innerHTML = `Якщо проблема повторюється, будь ласка, надішліть повідомлення на електронну пошту <a href="mailto:rootswings25@gmail.com">rootswings25@gmail.com</a>`;
            
            const existingFallback = contactForm.querySelector('.fallback-message');
            if (existingFallback) {
                existingFallback.remove();
            }
            
            contactForm.appendChild(fallbackMessage);
        })
        .finally(() => {
            // Restore button to initial state
            submitButton.textContent = originalText;
            submitButton.disabled = false;
        });
    });
    
    // Form validation function
    function validateForm(form) {
        const name = form.querySelector('#name');
        const email = form.querySelector('#email');
        const message = form.querySelector('#message');
        let isValid = true;
        
        // Clear previous error messages
        form.querySelectorAll('.error-message').forEach(msg => msg.remove());
        
        // Name validation
        if (name && !name.value.trim()) {
            showError(name, 'Будь ласка, введіть ваше ім\'я');
            isValid = false;
        }
        
        // Email validation
        if (email) {
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!email.value.trim() || !emailPattern.test(email.value)) {
                showError(email, 'Будь ласка, введіть коректну електронну адресу');
                isValid = false;
            }
        }
        
        // Message validation
        if (message && !message.value.trim()) {
            showError(message, 'Будь ласка, введіть ваше повідомлення');
            isValid = false;
        }
        
        return isValid;
    }
    
    // Function to display errors
    function showError(field, message) {
        const errorElement = document.createElement('div');
        errorElement.className = 'error-message';
        errorElement.textContent = message;
        
        field.parentElement.appendChild(errorElement);
        field.parentElement.classList.add('error');
        
        // Remove error message when field is edited
        field.addEventListener('input', function() {
            const errorMsg = field.parentElement.querySelector('.error-message');
            if (errorMsg) errorMsg.remove();
            field.parentElement.classList.remove('error');
        }, { once: true });
    }
    
    // Add improved styles for contact form
    const style = document.createElement('style');
    style.textContent = `
        .contact-form {
            position: relative;
            max-width: 600px;
            margin: 0 auto;
        }
        
        .input-wrapper {
            position: relative;
            margin-bottom: 25px;
        }
        
        .input-wrapper label {
            position: absolute;
            top: 12px;
            left: 15px;
            color: #666;
            transition: all 0.3s ease;
            pointer-events: none;
        }
        
        .input-wrapper.focused label,
        .input-wrapper.error label {
            top: -10px;
            left: 10px;
            font-size: 12px;
            background-color: #fff;
            padding: 0 5px;
            color: #333;
        }
        
        .input-wrapper.error label {
            color: #e74c3c;
        }
        
        .input-wrapper input,
        .input-wrapper textarea {
            width: 100%;
            padding: 12px 15px;
            border: 1px solid #ddd;
            border-radius: 5px;
            font-size: 16px;
            transition: all 0.3s ease;
        }
        
        .input-wrapper.error input,
        .input-wrapper.error textarea {
            border-color: #e74c3c;
        }
        
        .input-wrapper input:focus,
        .input-wrapper textarea:focus {
            border-color: #3498db;
            box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.2);
            outline: none;
        }
        
        .error-message {
            color: #e74c3c;
            font-size: 12px;
            margin-top: 5px;
            padding-left: 15px;
        }
        
        .success-message {
            background-color: #2ecc71;
            color: white;
            padding: 15px;
            border-radius: 5px;
            margin-top: 20px;
            text-align: center;
            animation: fadeIn 0.5s ease;
        }
        
        .fallback-message {
            background-color: #f8f9fa;
            padding: 10px 15px;
            border-radius: 5px;
            margin-top: 15px;
            border-left: 3px solid #3498db;
            font-size: 14px;
        }
        
        .fallback-message a {
            color: #3498db;
            text-decoration: underline;
        }
        
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(-10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        
        .contact-form button[type="submit"] {
            padding: 12px 30px;
            background-color: #3498db;
            color: white;
            border: none;
            border-radius: 5px;
            font-size: 16px;
            cursor: pointer;
            transition: all 0.3s ease;
        }
        
        .contact-form button[type="submit"]:hover {
            background-color: #2980b9;
            transform: translateY(-2px);
        }
        
        .contact-form button[type="submit"]:disabled {
            background-color: #95a5a6;
            cursor: not-allowed;
            transform: none;
        }
        
        .hidden {
            display: none;
        }
    `;
    document.head.appendChild(style);
}

/**
 * Initialize legal buttons in footer
 */
function initLegalButtons() {
    // Check if footer exists
    let footer = document.querySelector('footer');
    if (!footer) {
        console.warn('Footer element not found. Creating it.');
        const newFooter = document.createElement('footer');
        newFooter.className = 'footer';
        document.body.appendChild(newFooter);
        footer = newFooter;
    }
    
    // Add dark background for footer
    footer.classList.add('dark-bg');
    
    // Create container for buttons if it doesn't exist
    let legalContainer = footer.querySelector('.legal-buttons-container');
    if (!legalContainer) {
        legalContainer = document.createElement('div');
        legalContainer.className = 'legal-buttons-container';
        footer.appendChild(legalContainer);
    }
    
    // Legal documents data
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
                <p>Якщо у вас є питання щодо цієї політики конфіденційності, будь ласка, зв'яжіться з нами за електронною адресою: rootswings25@gmail.com</p>
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
                <p>Якщо у вас виникли питання щодо цих умов використання, будь ласка, зв'яжіться з нами за електронною адресою: rootswings25@gmail.com</p>
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
                <p>Якщо у вас є питання щодо нашої політики використання файлів cookie, будь ласка, зв'яжіться з нами за електронною адресою: rootswings25@gmail.com</p>
            `
        }
    ];
    
    // Create modal windows if they don't exist
    legalDocs.forEach(doc => {
        if (!document.getElementById(doc.id)) {
            // Create modal window
            const modal = document.createElement('div');
            modal.id = doc.id;
            modal.className = 'modal';
            modal.setAttribute('aria-hidden', 'true');
            
            // Add modal content
            modal.innerHTML = `
                <div class="modal-content legal-modal cursor-hover-trigger">
                    <button class="modal-close cursor-hover-trigger" aria-label="Close">&times;</button>
                    <div class="modal-body cursor-hover-trigger">
                        ${doc.content}
                    </div>
                </div>
            `;
            
            // Add modal to body
            document.body.appendChild(modal);
            
            // Create button in footer
            const button = document.createElement('button');
            button.className = 'legal-button modal-trigger cursor-hover-trigger';
            button.textContent = doc.title;
            button.dataset.modal = doc.id;
            
            // Add button to container
            legalContainer.appendChild(button);
        }
    });
    
    // Add styles for footer and legal document buttons
    if (!document.getElementById('legal-buttons-style')) {
        const style = document.createElement('style');
        style.id = 'legal-buttons-style';
        style.textContent = `
            .footer {
                padding: 2.5rem 0;
                background-color: #1a1a1a; /* Dark footer background */
                border-top: 1px solid #333;
                margin-top: 3rem;
                text-align: center;
                color: #f0f0f0; /* Light text for contrast */
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
                background-color: rgba(255, 255, 255, 0.1); /* Semi-transparent button background */
                border: 1px solid rgba(255, 255, 255, 0.2);
                border-radius: 6px;
                padding: 0.6rem 1.2rem;
                cursor: pointer;
                transition: all 0.3s ease;
                font-size: 0.9rem;
                color: #fff; /* White text for buttons */
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
            
            /* Styles for dark footer */
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
}

/**
 * Initialize modal windows
 */
function initModals() {
    const modalTriggers = document.querySelectorAll('.modal-trigger');
    const modals = document.querySelectorAll('.modal');
    
    if (!modalTriggers.length && !modals.length) return;
    
    // Add ARIA attributes and prepare modal windows
    modals.forEach(modal => {
        // Skip if modal already initialized
        if (modal.dataset.initialized === 'true') return;
        
        modal.setAttribute('role', 'dialog');
        modal.setAttribute('aria-modal', 'true');
        modal.setAttribute('aria-hidden', 'true');
        
        // Add class for custom cursor
        modal.classList.add('cursor-hover-trigger');
        
        // Check for close button
        if (!modal.querySelector('.modal-close')) {
            const closeButton = document.createElement('button');
            closeButton.className = 'modal-close cursor-hover-trigger';
            closeButton.innerHTML = '&times;';
            closeButton.setAttribute('aria-label', 'Close');
            
            const modalContent = modal.querySelector('.modal-content');
            if (modalContent) {
                modalContent.appendChild(closeButton);
            } else {
                // Create content wrapper if none exists
                const content = document.createElement('div');
                content.className = 'modal-content cursor-hover-trigger';
                while (modal.firstChild) {
                    content.appendChild(modal.firstChild);
                }
                content.appendChild(closeButton);
                modal.appendChild(content);
            }
        }
        
        // Add handler for close button
        const closeButton = modal.querySelector('.modal-close');
        if (closeButton) {
            closeButton.addEventListener('click', function() {
                closeModal(modal);
            });
        }
        
        // Add handler for closing when clicking background
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                closeModal(this);
            }
        });
        
        // Add focus trap elements
        const focusStart = document.createElement('div');
        focusStart.className = 'focus-trap';
        focusStart.setAttribute('tabindex', '0');
        focusStart.style.position = 'absolute';
        focusStart.style.opacity = '0';
        focusStart.style.pointerEvents = 'none';
        
        const focusEnd = focusStart.cloneNode(true);
        
        modal.insertBefore(focusStart, modal.firstChild);
        modal.appendChild(focusEnd);
        
        // Set initialization flag
        modal.dataset.initialized = 'true';
    });
    
    // Function to open modal
    window.openModal = function(modalId) {
        const modal = typeof modalId === 'string' ? document.getElementById(modalId) : modalId;
        if (!modal) return;
        
        // Save element that had focus
        const activeElement = document.activeElement;
        modal.dataset.previouslyFocused = activeElement ? activeElement.id : '';
        
        // Display modal with animation
        modal.style.display = 'flex';
        setTimeout(() => {
            modal.classList.add('open');
            modal.setAttribute('aria-hidden', 'false');
        }, 10);
        
        // Block scrolling on main page
        document.body.classList.add('modal-open');
        
        // Set focus on first interactive element
        const focusableElements = modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
        if (focusableElements.length > 0) {
            setTimeout(() => {
                focusableElements[0].focus();
            }, 100);
        } else {
            // If no focusable elements, focus on modal itself
            modal.setAttribute('tabindex', '-1');
            modal.focus();
        }
        
        // Add handler for focus trapping
        modal.addEventListener('keydown', trapFocus);
        
        // Add handler for Escape key
        document.addEventListener('keydown', handleEscapeKey);
    };
    
    // Function to close modal
    window.closeModal = function(modalId) {
        const modal = typeof modalId === 'string' ? document.getElementById(modalId) : modalId;
        if (!modal) return;
        
        // Close modal with animation
        modal.classList.remove('open');
        modal.setAttribute('aria-hidden', 'true');
        setTimeout(() => {
            modal.style.display = 'none';
        }, 300);
        
        // Unblock scrolling
        document.body.classList.remove('modal-open');
        
        // Remove event handlers
        modal.removeEventListener('keydown', trapFocus);
        document.removeEventListener('keydown', handleEscapeKey);
        
        // Return focus to previous element
        const previouslyFocusedId = modal.dataset.previouslyFocused;
        if (previouslyFocusedId) {
            const element = document.getElementById(previouslyFocusedId);
            if (element) element.focus();
        }
    };
    
    // Function to trap focus inside modal
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
    
    // Function to handle Escape key
    function handleEscapeKey(e) {
        if (e.key === 'Escape') {
            const openModal = document.querySelector('.modal.open');
            if (openModal) {
                closeModal(openModal);
            }
        }
    }
    
    // Add styles to improve modal windows
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
 * Initialize 3D effects for cards using VanillaTilt
 */
function initVanillaTilt() {
    // Check if VanillaTilt library is loaded
    if (typeof VanillaTilt === 'undefined') {
        console.warn('VanillaTilt library not loaded. 3D card effects will not work.');
        return;
    }
    
    // Initialize effect only for desktop devices
    if (window.innerWidth < 768) return;
    
    // Initialize 3D effect for cards
    const tiltElements = document.querySelectorAll('[data-tilt]');
    
    if (tiltElements.length) {
        VanillaTilt.init(tiltElements, {
            max: 15, // Maximum tilt (in degrees)
            speed: 400, // Speed of transition
            glare: true, // Enable glare effect
            'max-glare': 0.2, // Maximum glare intensity
            perspective: 800, // Perspective for 3D effect
            scale: 1.05, // Scale on hover
            gyroscope: true, // Use gyroscope on mobile devices
            gyroscopeMinAngleX: -20, // Minimum X tilt angle for gyroscope
            gyroscopeMaxAngleX: 20, // Maximum X tilt angle for gyroscope
            gyroscopeMinAngleY: -20, // Minimum Y tilt angle for gyroscope
            gyroscopeMaxAngleY: 20, // Maximum Y tilt angle for gyroscope
            easing: "cubic-bezier(.03,.98,.52,.99)", // Easing function
            reset: true, // Reset transformation on mouse leave
            'full-page-listening': false, // Listen to entire page, not just element
        });
    }
}

/**
 * Initialize animated card deck
 * Оновлена версія з унікальними зображеннями та повним відображенням карток
 */
function initAnimatedCardDeck() {
    // Find or create section for card deck
    let deckSection = document.querySelector('.card-deck-section');
    if (!deckSection) {
        const heroSection = document.querySelector('.hero-section');
        if (!heroSection) return;
        
        // Create new section after hero section
        deckSection = document.createElement('section');
        deckSection.className = 'section card-deck-section';
        deckSection.style.display = 'block';
        deckSection.style.visibility = 'visible';
        heroSection.parentNode.insertBefore(deckSection, heroSection.nextSibling);
        
        // Add header and description
        const sectionHeader = document.createElement('div');
        sectionHeader.className = 'section-header';
        sectionHeader.innerHTML = `
            <h2 class="section-title">Метафоричні карти</h2>
            <p class="section-description">Витягніть та погляньте на деякі ближче</p>
        `;
        deckSection.appendChild(sectionHeader);
    }
    
    // Create container for deck if missing
    let deckContainer = deckSection.querySelector('.card-deck-container');
    if (!deckContainer) {
        deckContainer = document.createElement('div');
        deckContainer.className = 'card-deck-container';
        deckContainer.style.display = 'block';
        deckContainer.style.visibility = 'visible';
        deckSection.appendChild(deckContainer);
    }
    
    // Clear container
    deckContainer.innerHTML = '';
    
    // Add styles for card deck with explicit visibility
    const style = document.createElement('style');
    style.textContent = `
        .card-deck-section {
            padding: 60px 0;
            text-align: center;
            overflow: visible !important;
            position: relative;
            z-index: 1;
            display: block !important;
            visibility: visible !important;
            min-height: 400px;
            color: #333;
        }
        
        .card-deck-section .section-title {
            color: #e67e22;
            margin-bottom: 20px;
            font-size: 2rem;
        }
        
        .card-deck-section .section-description {
            color: #ffffff;
            margin-bottom: 30px;
        }
        
        .card-deck-container {
            position: relative;
            width: 300px;
            height: 450px;
            margin: 40px auto;
            perspective: 1000px;
            overflow: visible !important;
            display: block !important;
            visibility: visible !important;
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
            aspect-ratio: 2/3;
            background-color: #fff;
            visibility: visible !important;
            display: block !important;
        }
        
        .deck-card img {
            width: 100%;
            height: 100%;
            object-fit: contain;
            border-radius: 15px;
            background-color: #fff;
            visibility: visible !important;
            display: block !important;
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
    
    // Make sure section and parent elements don't crop content
    let parent = deckSection.parentElement;
    while (parent && parent !== document.body) {
        const computedStyle = window.getComputedStyle(parent);
        if (computedStyle.overflow === 'hidden') {
            parent.style.overflow = 'visible';
        }
        parent = parent.parentElement;
    }
    
    // Набір зображень для колоди карт
    const deckImages = [
        'https://res.cloudinary.com/djdc6wcpg/image/upload/v1745535690/mmtdm8ky4ab0ol9yutqr.jpg',
        'https://res.cloudinary.com/djdc6wcpg/image/upload/v1745535695/qt4k2ipi2jhc9mmwzxis.jpg',
        'https://res.cloudinary.com/djdc6wcpg/image/upload/v1745535699/zcpbltaflvwaquvd0kju.jpg',
        'https://res.cloudinary.com/djdc6wcpg/image/upload/v1745535702/ub9ylmdcigbc5e82fesi.jpg',
        'https://res.cloudinary.com/djdc6wcpg/image/upload/v1745535704/r3nzu5v02euvqeq1rmgf.jpg',
        'https://res.cloudinary.com/djdc6wcpg/image/upload/v1745535708/ofoaejquc9zuamosvgo9.jpg',
        'https://res.cloudinary.com/djdc6wcpg/image/upload/v1745535713/ht1bnprywburf4pkvxpy.jpg',
        'https://res.cloudinary.com/djdc6wcpg/image/upload/v1745535717/p4zp9n68duiabbsc9d1t.jpg',
        'https://res.cloudinary.com/djdc6wcpg/image/upload/v1745535722/x8jvlkkviu5cy1l13nci.jpg',
        'https://res.cloudinary.com/djdc6wcpg/image/upload/v1745535725/b6sgcufua3trsuemuljl.jpg',
        'https://res.cloudinary.com/djdc6wcpg/image/upload/v1745535729/o8p00xqbnixgksezsol1.jpg',
        'https://res.cloudinary.com/djdc6wcpg/image/upload/v1745535732/svx7xjtve5zf1dkkipef.jpg'
    ];
    
    // Create 6 cards for deck display
    for (let i = 0; i < 6; i++) {
        const card = document.createElement('div');
        card.className = 'deck-card';
        card.dataset.index = i;
        
        // Random position and rotation for chaotic look
        const randomRotate = -15 + Math.random() * 30;
        const randomX = -15 + Math.random() * 30;
        const randomY = -15 + Math.random() * 30;
        const zIndex = i;
        
        // Set initial styles
        card.style.transform = `translate(${randomX}px, ${randomY}px) rotate(${randomRotate}deg)`;
        card.style.zIndex = zIndex;
        card.style.visibility = 'visible';
        card.style.display = 'block';
        
        // Вибираємо випадкове зображення з заданого масиву для колоди
        const uniqueImage = deckImages[Math.floor(Math.random() * deckImages.length)];
        
        // Create image for card
        const img = document.createElement('img');
        img.src = uniqueImage;
        img.alt = 'Metaphorical card ' + (i + 1);
        img.loading = 'lazy';
        card.appendChild(img);
        
        // Add card to container
        deckContainer.appendChild(card);
        
        // Add hover effect - card slightly raises
        card.addEventListener('mouseenter', function() {
            if (!this.classList.contains('active')) {
                this.style.transform = `translate(${randomX}px, ${randomY - 20}px) rotate(${randomRotate}deg) scale(1.05)`;
                this.style.zIndex = 10; // Bring to front on hover
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
        
        // Add click effect - card raises and moves to top of stack
        card.addEventListener('click', function() {
            // Reset all cards first
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
            
            // Activate this card
            this.classList.add('active');
            this.style.transform = 'translate(0, -50px) rotate(0deg) scale(1.1)';
            this.style.zIndex = 20;
            this.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.3)';
        });
    }
    
    // Store all card images for button to randomly select from
    deckContainer.dataset.allCardImages = JSON.stringify(deckImages);
    
    // Add button for drawing card
    if (!deckSection.querySelector('.draw-button')) {
        const drawButton = document.createElement('button');
        drawButton.className = 'draw-button';
        drawButton.textContent = 'Витягти карту';
        deckSection.appendChild(drawButton);
    } else {
        // Update text of existing button
        const existingButton = deckSection.querySelector('.draw-button');
        existingButton.textContent = 'Витягти карту';
    }
    
    // Force visibility
    setTimeout(() => {
        deckSection.style.display = 'block';
        deckSection.style.visibility = 'visible';
        deckContainer.style.display = 'block';
        deckContainer.style.visibility = 'visible';
        
        document.querySelectorAll('.deck-card').forEach(card => {
            card.style.display = 'block';
            card.style.visibility = 'visible';
        });
    }, 1000);
}

/**
 * Hide logo image, leaving only "Roots & Wings" text
 */
function hideLogoImage() {
    const logoImg = document.querySelector('.logo-img');
    if (logoImg) {
        logoImg.style.display = 'none';
        
        // Increase text logo font for more prominent display
        const logoText = document.querySelector('.logo-text');
        if (logoText) {
            logoText.style.fontSize = '1.8rem';
            logoText.style.fontWeight = '700';
        }
    }
}

/**
 * Adjust card sizes in grid to match images while maintaining 2:3 aspect ratio
 * Змінено objectFit з 'cover' на 'contain' для повного відображення карток
 */
function adjustCardSizeToImages() {
    const gridCards = document.querySelectorAll('.grid-card');
    
    gridCards.forEach(card => {
        // Find image inside card
        const cardImage = card.querySelector('img');
        if (cardImage) {
            // Ensure 2:3 aspect ratio (width:height)
            card.style.aspectRatio = '2/3';
            
            // After image loads, adjust size
            if (cardImage.complete) {
                adjustCardImage(card, cardImage);
            } else {
                cardImage.onload = () => adjustCardImage(card, cardImage);
            }
        }
    });
    
    function adjustCardImage(card, image) {
        // Ensure image fits completely without cropping
        image.style.width = '100%';
        image.style.height = '100%';
        image.style.objectFit = 'cover'; // Changed from cover to contain
        image.style.backgroundColor = 'transparent'; // Optional background for visible card edges
    }
}

/**
 * Function to initialize the example demonstration modal
 */
function initExampleDemo() {  
  // Елементи для взаємодії  
  const openExampleButton = document.getElementById('openExampleModal');  
  const exampleModal = document.getElementById('exampleModal');  
  const closeModal = document.getElementById('closeModal');  
  const returnToSite = document.getElementById('returnToSite');  
    
  // Слайди та кнопки навігації  
  const slide1 = document.getElementById('slide1');  
  const slide2 = document.getElementById('slide2');  
  const slide3 = document.getElementById('slide3');  
  const slide4 = document.getElementById('slide4');  
  const slide5 = document.getElementById('slide5');  
    
  const nextSlide1 = document.getElementById('nextSlide1');  
  const nextSlide2 = document.getElementById('nextSlide2');  
  const nextSlide3 = document.getElementById('nextSlide3');  
  const nextSlide4 = document.getElementById('nextSlide4');  
    
  const deckDemo = document.getElementById('deckDemo');  
  const selectedCardsContainer = document.getElementById('selectedCardsContainer');  
  const thankYouMessage = document.getElementById('thankYouMessage');  
    
  // Масив URL зображень карток (замініть на реальні URL)  
  const cardImages = [  
    'https://res.cloudinary.com/djdc6wcpg/image/upload/v1745600681/i9n7r9hsuh2pyyettj4j.jpg',
    'https://res.cloudinary.com/djdc6wcpg/image/upload/v1745600682/setmj5edlqzrw111wtxz.jpg',
    'https://res.cloudinary.com/djdc6wcpg/image/upload/v1745600683/ckjmvjpwmqs0fijtdfnd.jpg',
    'https://res.cloudinary.com/djdc6wcpg/image/upload/v1745600684/xulr8shwulwvutqttjpf.jpg',
    'https://res.cloudinary.com/djdc6wcpg/image/upload/v1745600685/aivdmsixkujkivcmlcsa.jpg',
    'https://res.cloudinary.com/djdc6wcpg/image/upload/v1745600686/z0gzhthffzz0mq8ulgyq.jpg',
    'https://res.cloudinary.com/djdc6wcpg/image/upload/v1745600687/xsprk2uwmypkcc1hkl2f.jpg',
    'https://res.cloudinary.com/djdc6wcpg/image/upload/v1745600688/lfgq2atikgu70ofz1z04.jpg',
    'https://res.cloudinary.com/djdc6wcpg/image/upload/v1745600689/pk8tdsmnynq7iwy6y6yi.jpg', 
  ];  
    
  // Функція для створення колоди карток  
  function createDeck() {  
    if (!deckDemo) return;
    
    deckDemo.innerHTML = '';  
      
    // Створення 9 карток в колоді  
    for (let i = 0; i < 9; i++) {  
      const card = document.createElement('div');  
      card.className = 'deck-card';  
      card.style.zIndex = 9 - i;  
      card.style.transform = `translateZ(${-i * 2}px)`;  
        
      const img = document.createElement('img');  
      img.src = cardImages[i];  
      img.alt = `Картка ${i + 1}`;  
        
      card.appendChild(img);  
      deckDemo.appendChild(card);  
    }  
  }  
    
  // Функція для анімації витягування карток  
  function drawCards() {  
    if (!selectedCardsContainer) return;
    
    // Очищаємо контейнер для обраних карток  
    selectedCardsContainer.innerHTML = '';  
      
    // Вибираємо 3 випадкові картки з колоди  
    const selectedIndices = [];  
    while (selectedIndices.length < 3) {  
      const randomIndex = Math.floor(Math.random() * 9);  
      if (!selectedIndices.includes(randomIndex)) {  
        selectedIndices.push(randomIndex);  
      }  
    }  
      
    // Створюємо елементи для обраних карток  
    for (let i = 0; i < 3; i++) {  
      const card = document.createElement('div');  
      card.className = 'selected-card';  
        
      const img = document.createElement('img');  
      img.src = cardImages[selectedIndices[i]];  
      img.alt = `Обрана картка ${i + 1}`;  
        
      card.appendChild(img);  
      selectedCardsContainer.appendChild(card);  
    }  
  }  
    
  // Функція для показу обраних карток з анімацією  
  function revealSelectedCards() {  
    const selectedCards = document.querySelectorAll('.selected-card');  
      
    setTimeout(() => {  
      selectedCards.forEach(card => {  
        card.classList.add('visible');  
      });  
    }, 300);  
  }  
    
  // Функція для показу подяки  
  function showThankYou() {  
    if (!thankYouMessage) return;
    
    setTimeout(() => {  
      thankYouMessage.classList.add('visible');  
    }, 300);  
  }  
    
  // Функція для очищення активних слайдів  
  function clearActiveSlides() {  
    const slides = document.querySelectorAll('.slide');  
    slides.forEach(slide => {  
      slide.classList.remove('active');  
    });  
  }  
    
  // Функція для відкриття модального вікна  
  function openDemoModal() {  
    if (!exampleModal) return;
    
    exampleModal.classList.add('active');  
    document.body.style.overflow = 'hidden'; // Заборона прокрутки основної сторінки  
      
    // Скидаємо стан презентації  
    clearActiveSlides();  
    if (slide1) slide1.classList.add('active');  
      
    // Створюємо колоду карток  
    createDeck();  
      
    // Видаляємо класи видимості з елементів  
    const selectedCards = document.querySelectorAll('.selected-card');  
    selectedCards.forEach(card => {  
      card.classList.remove('visible');  
    });  
      
    if (thankYouMessage) thankYouMessage.classList.remove('visible');  
  }  
    
  // Функція для закриття модального вікна  
  function closeDemoModal() {  
    if (!exampleModal) return;
    
    exampleModal.classList.remove('active');  
    document.body.style.overflow = ''; // Відновлення прокрутки основної сторінки  
  }  

  // Expose functions to global scope
  window.openDemoModal = openDemoModal;
  window.closeDemoModal = closeDemoModal;
  window.createDeck = createDeck;
  window.drawCards = drawCards;
  window.revealSelectedCards = revealSelectedCards;
  window.showThankYou = showThankYou;
  window.clearActiveSlides = clearActiveSlides;
    
  // Обробники подій для кнопок навігації в слайдах
  if (nextSlide1) {
    nextSlide1.addEventListener('click', () => {  
      clearActiveSlides();  
      if (slide2) slide2.classList.add('active');  
      drawCards();  
      revealSelectedCards();  
    });  
  }
    
  if (nextSlide2) {
    nextSlide2.addEventListener('click', () => {  
      clearActiveSlides();  
      if (slide3) slide3.classList.add('active');  
    });  
  }
    
  if (nextSlide3) {
    nextSlide3.addEventListener('click', () => {  
      clearActiveSlides();  
      if (slide4) slide4.classList.add('active');  
    });  
  }
    
  if (nextSlide4) {
    nextSlide4.addEventListener('click', () => {  
      clearActiveSlides();  
      if (slide5) slide5.classList.add('active');  
      showThankYou();  
    });  
  }
    
  // Обробники закриття модального вікна
  if (closeModal) {
    closeModal.addEventListener('click', closeDemoModal);  
  }
  
  if (returnToSite) {
    returnToSite.addEventListener('click', closeDemoModal);  
  }
    
  // Закриття модального вікна при кліку поза його вмістом  
  if (exampleModal) {
    exampleModal.addEventListener('click', (e) => {  
      if (e.target === exampleModal) {  
        closeDemoModal();  
      }  
    });  
  }
    
  // Закриття модального вікна при натисканні клавіші Escape  
  document.addEventListener('keydown', (e) => {  
    if (e.key === 'Escape' && exampleModal && exampleModal.classList.contains('active')) {  
      closeDemoModal();  
    }  
  });  
    
  // Ініціалізація колоди при завантаженні сторінки  
  createDeck();  
}

// Initialize event listeners for window
window.addEventListener('load', function() {
    // Check if page already loaded
    if (document.body.classList.contains('loaded')) {
        // If so, start initial animations
        startInitialAnimations();
    }
});

// Optimize window resize handling
window.addEventListener('resize', debounce(function() {
    // Update carousel cards
    if (typeof updateCarouselGlobal === 'function') {
        updateCarouselGlobal();
    }
    
    // Update card grid for adaptation to new screen size
    const gridContainer = document.querySelector('.cards-grid-container');
    if (gridContainer) {
        gridContainer.style.transform = 'rotateX(0) rotateY(0)';
        
        const gridCards = gridContainer.querySelectorAll('.grid-card');
        gridCards.forEach(card => {
            card.style.transform = 'scale(0.95) translateZ(0)';
        });
    }
    
    // Check menu element visibility
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const desktopNav = document.querySelector('.desktop-nav');
    
    if (mobileMenuToggle && desktopNav) {
        const isMobile = window.innerWidth < 768;
        
        if (isMobile) {
            desktopNav.setAttribute('aria-hidden', 'true');
            desktopNav.style.display = 'none';
            mobileMenuToggle.style.display = 'block';
            // Disable custom cursor on mobile
            hideCustomCursor();
        } else {
            desktopNav.removeAttribute('aria-hidden');
            desktopNav.style.display = 'flex';
            mobileMenuToggle.style.display = 'none';
            
            // Close mobile menu if open
            const mobileMenu = document.querySelector('.mobile-menu');
            if (mobileMenu && mobileMenu.classList.contains('open')) {
                mobileMenu.classList.remove('open');
                document.body.classList.remove('menu-open');
                mobileMenuToggle.classList.remove('active');
            }
        }
    }
    
    // Adjust card sizes on window resize
    adjustCardSizeToImages();
    
    // Update header space for mobile
    fixMobileHeaderSpace();
}, 150));

/**
 * Debounce function for optimizing frequent event handling
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

// Export updateCarousel function to global scope
window.updateCarousel = function() {
    if (typeof updateCarouselGlobal === 'function') {
        updateCarouselGlobal();
    }
};