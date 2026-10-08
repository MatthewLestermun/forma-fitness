// =====================================================
// FORMA — всё, что делает сайт живым и кликабельным
// =====================================================

// ---------- Расписание (данные) ----------
// Для каждого дня недели: время, занятие, тренер, сколько мест осталось
const SCHEDULE = {
  1: [['07:00', 'Функционал', 'Артём', 6], ['09:00', 'Растяжка', 'Алина', 3], ['18:30', 'Сила', 'Марк', 8], ['20:00', 'Функционал', 'Артём', 2]],
  2: [['08:00', 'Растяжка', 'Алина', 5], ['12:00', 'Сила', 'Марк', 7], ['19:00', 'Функционал', 'Артём', 1], ['20:30', 'Растяжка', 'Алина', 9]],
  3: [['07:00', 'Функционал', 'Артём', 4], ['10:00', 'Сила', 'Марк', 6], ['18:30', 'Растяжка', 'Алина', 2], ['20:00', 'Сила', 'Марк', 5]],
  4: [['08:00', 'Сила', 'Марк', 8], ['12:00', 'Растяжка', 'Алина', 6], ['19:00', 'Функционал', 'Артём', 3], ['20:30', 'Сила', 'Марк', 4]],
  5: [['07:00', 'Функционал', 'Артём', 5], ['09:00', 'Растяжка', 'Алина', 7], ['18:00', 'Сила', 'Марк', 1], ['19:30', 'Функционал', 'Артём', 6]],
  6: [['10:00', 'Функционал', 'Артём', 3], ['12:00', 'Растяжка', 'Алина', 4], ['14:00', 'Сила', 'Марк', 9]],
  0: [['11:00', 'Растяжка', 'Алина', 8], ['13:00', 'Функционал', 'Артём', 5]]
};

const DAY_NAMES = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
const DAY_ORDER = [1, 2, 3, 4, 5, 6, 0]; // неделя с понедельника

// ---------- Окно записи ----------
const modal = document.getElementById('modal');
const form = document.getElementById('book-form');
const programSelect = document.getElementById('program-select');
const modalTitle = document.getElementById('modal-title');

function openModal(choice, title) {
  modal.classList.remove('success');
  if (choice) programSelect.value = choice; // сразу выбрать то, на что кликнули
  modalTitle.textContent = title || 'Бесплатная пробная тренировка';
  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden'; // не прокручивать страницу под окном
  setTimeout(function () { form.elements.name.focus(); }, 250);
}

function closeModal() {
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

// Любой элемент с data-book открывает запись. Значение — что выбрать в списке
document.addEventListener('click', function (event) {
  const trigger = event.target.closest('[data-book]');
  if (!trigger) return;
  event.preventDefault();
  closeMenu();
  const choice = trigger.dataset.book;
  openModal(choice || null, choice && choice.startsWith('Тариф') ? 'Записаться: ' + choice : null);
});

document.querySelectorAll('[data-close]').forEach(function (button) {
  button.addEventListener('click', closeModal);
});

// Клик по тёмному фону и клавиша Esc тоже закрывают окно
modal.addEventListener('click', function (event) {
  if (event.target === modal) closeModal();
});

document.addEventListener('keydown', function (event) {
  if (event.key === 'Escape') {
    closeModal();
    closeMenu();
  }
});

// Отправка: в демо просто показываем «Заявка принята»
form.addEventListener('submit', function (event) {
  event.preventDefault();
  form.reset();
  modal.classList.add('success');
});

// ---------- Мобильное меню ----------
const burger = document.getElementById('burger');

function closeMenu() {
  document.body.classList.remove('menu-open');
}

burger.addEventListener('click', function () {
  document.body.classList.toggle('menu-open');
});

// ---------- Плавная прокрутка к разделам (с учётом шапки) ----------
document.querySelectorAll('[data-scroll]').forEach(function (link) {
  link.addEventListener('click', function (event) {
    const id = link.getAttribute('href');
    const target = id === '#top' ? document.body : document.querySelector(id);
    if (!target) return;
    event.preventDefault();
    closeMenu();
    const top = id === '#top' ? 0 : target.getBoundingClientRect().top + window.scrollY - 64;
    window.scrollTo({ top: top, behavior: 'smooth' });
  });
});

// ---------- Шапка: линия снизу появляется при прокрутке ----------
const header = document.querySelector('.header');
window.addEventListener('scroll', function () {
  header.classList.toggle('scrolled', window.scrollY > 10);
}, { passive: true });

// ---------- Расписание ----------
const daysBox = document.getElementById('days');
const scheduleList = document.getElementById('schedule-list');
const todayIndex = new Date().getDay();

function renderSchedule(day) {
  // Кнопки дней
  daysBox.innerHTML = '';
  DAY_ORDER.forEach(function (d) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'day' + (d === day ? ' active' : '');
    button.setAttribute('role', 'tab');
    button.textContent = DAY_NAMES[d];
    if (d === todayIndex) {
      const dot = document.createElement('span');
      dot.className = 'today-dot';
      dot.title = 'Сегодня';
      button.append(dot);
    }
    button.addEventListener('click', function () { renderSchedule(d); });
    daysBox.append(button);
  });

  // Занятия выбранного дня
  scheduleList.innerHTML = '';
  SCHEDULE[day].forEach(function (slot, index) {
    const row = document.createElement('div');
    row.className = 'slot';
    row.style.animationDelay = (index * 0.05) + 's';

    const time = document.createElement('span');
    time.className = 'slot-time';
    time.textContent = slot[0];

    const name = document.createElement('span');
    name.className = 'slot-name';
    name.textContent = slot[1];

    const coach = document.createElement('span');
    coach.className = 'slot-coach';
    coach.textContent = slot[2];

    const places = document.createElement('span');
    places.className = 'slot-places' + (slot[3] <= 2 ? ' few' : '');
    places.textContent = slot[3] <= 2 ? 'осталось ' + slot[3] : slot[3] + ' мест';

    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'btn btn-dark btn-sm';
    button.textContent = 'Записаться';
    button.addEventListener('click', function () {
      openModal(slot[1], slot[1] + ' · ' + DAY_NAMES[day] + ' ' + slot[0]);
    });

    row.append(time, name, coach, places, button);
    scheduleList.append(row);
  });
}

renderSchedule(todayIndex);

// ---------- Цены: месяц / год ----------
document.querySelectorAll('#price-toggle button').forEach(function (button) {
  button.addEventListener('click', function () {
    const period = button.dataset.period;
    document.querySelectorAll('#price-toggle button').forEach(function (b) {
      b.classList.toggle('active', b === button);
    });
    // Цифры «перелистываются»: прячем, меняем, показываем
    document.querySelectorAll('.price b').forEach(function (price) {
      price.classList.add('flip');
      setTimeout(function () {
        price.textContent = price.dataset[period];
        price.classList.remove('flip');
      }, 180);
    });
  });
});

// ---------- FAQ: открыт только один вопрос за раз ----------
document.querySelectorAll('.faq details').forEach(function (item) {
  item.addEventListener('toggle', function () {
    if (!item.open) return;
    document.querySelectorAll('.faq details').forEach(function (other) {
      if (other !== item) other.open = false;
    });
  });
});

// ---------- Счётчики в полосе с цифрами ----------
function countUp(el) {
  const target = Number(el.dataset.count);
  const decimals = Number(el.dataset.decimals || 0);
  const suffix = el.dataset.suffix || '';
  const duration = 1400;
  const start = performance.now();

  function tick(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3); // плавное замедление в конце
    const value = target * eased;
    el.textContent = value.toLocaleString('ru-RU', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    }) + suffix;
    if (progress < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

// ---------- Появление блоков и запуск счётчиков при прокрутке ----------
const observer = new IntersectionObserver(function (entries) {
  entries.forEach(function (entry) {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    if (el.dataset.count) {
      countUp(el);
    } else {
      // карточки в одной сетке появляются по очереди
      const siblings = Array.from(el.parentElement.children).filter(function (c) {
        return c.classList.contains('reveal');
      });
      el.style.transitionDelay = Math.max(0, siblings.indexOf(el)) * 0.08 + 's';
      el.classList.add('visible');
    }
    observer.unobserve(el);
  });
}, { threshold: 0.15 });

document.querySelectorAll('.reveal, [data-count]').forEach(function (el) {
  observer.observe(el);
});
