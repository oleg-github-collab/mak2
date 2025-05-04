// js/exercise.js
(() => {
    // ---- Всі URL карт (deckImages + cardImages із вашого коду) ----
    const cardImages = [
      // Deck images
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
      'https://res.cloudinary.com/djdc6wcpg/image/upload/v1745600738/nf7de1pek9fslrwp4n5o.jpg',
      // Card images pool
      'https://res.cloudinary.com/djdc6wcpg/image/upload/v1745600683/ckjmvjpwmqs0fijtdfnd.jpg',
      'https://res.cloudinary.com/djdc6wcpg/image/upload/v1745600685/aivdmsixkujkivcmlcsa.jpg',
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
      'https://res.cloudinary.com/djdc6wcpg/image/upload/v1745600739/spqburarnorvmfvcjwvj.jpg',
      'https://res.cloudinary.com/djdc6wcpg/image/upload/v1745600741/nh5bpwqxh5xiunbx32es.jpg',
      'https://res.cloudinary.com/djdc6wcpg/image/upload/v1745600742/yzgnnaef8heojwrgkv12.jpg',
      'https://res.cloudinary.com/djdc6wcpg/image/upload/v1745600744/ptp39lg4e8eakv41jdhg.jpg',
      'https://res.cloudinary.com/djdc6wcpg/image/upload/v1745600746/at6yuwanlntwhaihznlw.jpg'
    ];
  
    // ---- Створення DOM елементів модалки ----
    const body = document.body;
    const popup = document.createElement('div');
    popup.id = 'family-exercise-popup';
    popup.innerHTML = `
      <div class="exercise-modal">
        <button class="modal-close" aria-label="Закрити">&times;</button>
        <div class="slides">
          <!-- Слайд 1 -->
          <div class="slide" data-slide="1">
            <h2>Вправа «Коріння та крила»</h2>
            <p>Згадайте одну сильну родинну історію, що надихає вас сьогодні.</p>
            <div class="card-random" id="slide1-card"></div>
            <button id="start-exercise" class="btn bounce">Почати</button>
          </div>
          <!-- Слайд 1.5 – пояснення -->
          <div class="slide" data-slide="1.5">
            <h2>Про що ця вправа?</h2>
            <p>Ми обираємо образи з карт, щоб символічно відобразити якості, що допомогли вашому роду вижити.</p>
            <button id="to-2" class="btn">Далі</button>
          </div>
          <!-- Слайд 2 -->
          <div class="slide" data-slide="2">
            <h2>Оберіть 3 карти</h2>
            <p>Кожна — символ якості чи навички вашої родини.</p>
            <div class="cards-grid" id="slide2-grid"></div>
            <button id="to-3" class="btn" disabled>Підтвердити</button>
          </div>
          <!-- Слайд 2.5 – пояснення -->
          <div class="slide" data-slide="2.5">
            <h2>Чому саме 3?</h2>
            <p>Три опори — стійкість, витримка та креативність. Уявіть, як ці якості працюють у вашій історії.</p>
            <button id="to-3b" class="btn">Далі</button>
          </div>
          <!-- Слайд 3 -->
          <div class="slide" data-slide="3">
            <h2>Подумайте над образами</h2>
            <p>Уявіть, чому саме ці карти резонують із історією вашого роду.</p>
            <div class="selected-cards" id="slide3-cards"></div>
            <button id="to-4" class="btn">Далі</button>
          </div>
          <!-- Слайд 3.5 – пояснення -->
          <div class="slide" data-slide="3.5">
            <h2>Як працює символ?</h2>
            <p>Символи активують емоції та спогади. Дайте їм працювати в уяві.</p>
            <button id="to-4b" class="btn">Далі</button>
          </div>
          <!-- Слайд 4 -->
          <div class="slide" data-slide="4">
            <h2>Розкажіть історію</h2>
            <p>Програйте в уяві родинний досвід через ці образи.</p>
            <button id="to-5" class="btn">Завершити</button>
          </div>
          <!-- Слайд 5 -->
          <div class="slide" data-slide="5">
            <h2>Дякуємо!</h2>
            <p>Цей символічний шлях — лише приклад вправи для саморозвитку. 💚</p>
            <button id="exercise-close" class="btn">Закрити</button>
          </div>
        </div>
      </div>
    `;
    body.appendChild(popup);
  
    // ---- Змінні та функції навігації ----
    let selected2 = [];
    const showSlide = num => {
      popup.querySelectorAll('.slide').forEach(sl => {
        sl.classList.toggle('active', sl.dataset.slide === num.toString());
      });
    };
    const closeAll = () => popup.classList.remove('open');
  
    // ---- Slide 1: рандомна карта ----
    const rndImg = cardImages[Math.floor(Math.random() * cardImages.length)];
    document.getElementById('slide1-card').innerHTML = `<img src="${rndImg}" alt="random card">`;
  
    // ---- Slide 2: рендер сітки унікальних карт ----
    function renderGrid() {
      const isMobile = window.matchMedia('(max-width:768px)').matches;
      const count = isMobile ? 8 : 9;
      const copy = [...cardImages];
      const picks = [];
      for (let i = 0; i < count; i++) {
        const idx = Math.floor(Math.random() * copy.length);
        picks.push(copy.splice(idx, 1)[0]);
      }
      const grid = document.getElementById('slide2-grid');
      grid.innerHTML = picks.map(u => `<img src="${u}" data-url="${u}">`).join('');
      grid.querySelectorAll('img').forEach(img => {
        img.onclick = () => {
          const url = img.dataset.url;
          if (selected2.includes(url)) {
            selected2 = selected2.filter(u => u !== url);
            img.classList.remove('selected');
          } else if (selected2.length < 3) {
            selected2.push(url);
            img.classList.add('selected');
          }
          const btn = document.getElementById('to-3');
          btn.disabled = selected2.length !== 3;
          if (!btn.disabled) {
            btn.classList.add('bounce');
            setTimeout(() => btn.classList.remove('bounce'), 350);
          }
        };
      });
    }
  
    // ---- Обробники кнопок переходу ----
    popup.querySelector('#start-exercise').onclick = () => showSlide(1.5);
    popup.querySelector('#to-2').onclick = () => {
      showSlide(2);
      selected2 = [];
      renderGrid();
    };
    popup.querySelector('#to-3').onclick = () => showSlide(2.5);
    popup.querySelector('#to-3b').onclick = () => {
      showSlide(3);
      document.getElementById('slide3-cards').innerHTML =
        selected2.map(u => `<img src="${u}">`).join('');
    };
    popup.querySelector('#to-4').onclick = () => showSlide(4);
    popup.querySelector('#to-4b').onclick = () => showSlide(4);
    popup.querySelector('#to-5').onclick = () => showSlide(5);
  
    // ---- Закриття модалки ----
    popup.querySelector('.modal-close').onclick = closeAll;
    popup.querySelector('#exercise-close').onclick = closeAll;
    popup.addEventListener('click', e => {
      if (e.target === popup) closeAll();
    });
  
    // ---- Відкриття по кнопці у вашій секції #open-exercise ----
    document.querySelector('#open-exercise')?.addEventListener('click', () => {
      popup.classList.add('open');
      showSlide(1);
    });
  
    // ---- Старт ----
    showSlide(1);
  })();
  