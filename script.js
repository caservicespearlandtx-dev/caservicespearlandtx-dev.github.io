// Footer year
document.getElementById('year').textContent = new Date().getFullYear();

// Mobile nav toggle
const navToggle = document.getElementById('navToggle');
const mainNav = document.getElementById('mainNav');
navToggle.addEventListener('click', () => {
  const isOpen = mainNav.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', String(isOpen));
});
mainNav.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    mainNav.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  });
});

// FAQ accordion
document.querySelectorAll('.faq-item').forEach(item => {
  const question = item.querySelector('.faq-q');
  question.addEventListener('click', () => {
    const isOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item.open').forEach(open => open.classList.remove('open'));
    if (!isOpen) item.classList.add('open');
  });
});

// =========================================================
// Weekly booking calendar
// =========================================================

// -----------------------------------------------------------
// BLOCK TIMES YOU'RE NOT AVAILABLE
// -----------------------------------------------------------
// Add an entry for any date you're already booked or closed.
// - List specific times to block just those hours
// - Use the string 'ALL' to block the entire day
// Date format is always YYYY-MM-DD (year-month-day).
//
// Examples:
//   '2026-08-03': ['9:00 AM', '10:00 AM'],   // only those 2 hours blocked
//   '2026-08-07': 'ALL',                      // fully booked / day off
//
// After editing this list, re-upload script.js to GitHub —
// changes go live about 1-2 minutes after you commit.
// -----------------------------------------------------------
const BLOCKED_SLOTS = {
  // '2026-08-03': ['9:00 AM', '10:00 AM'],
  // '2026-08-07': 'ALL',
};

const TIME_SLOTS = [
  '10:00 AM', '11:00 AM', '12:00 PM',
  '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM'
];
const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const WEEKS_BOOKABLE_AHEAD = 8; // ~2 months of scrollable weeks

const calendarGrid = document.getElementById('calendarGrid');

if (calendarGrid) {
  const calRange = document.getElementById('calRange');
  const calPrev = document.getElementById('calPrev');
  const calNext = document.getElementById('calNext');
  const dateInput = document.getElementById('date');
  const timeInput = document.getElementById('time');
  const selectedSlot = document.getElementById('selectedSlot');

  const now = new Date();
  now.setHours(0, 0, 0, 0);

  // Start of the current (earliest bookable) week and the furthest week allowed
  const firstWeekStart = new Date(now);
  firstWeekStart.setDate(now.getDate() - now.getDay());

  const lastWeekStart = new Date(firstWeekStart);
  lastWeekStart.setDate(firstWeekStart.getDate() + WEEKS_BOOKABLE_AHEAD * 7);

  let weekStart = new Date(firstWeekStart);

  function fmtRange(start) {
    const end = new Date(start);
    end.setDate(start.getDate() + 6);
    const opts = { month: 'short', day: 'numeric' };
    const startStr = start.toLocaleDateString('en-US', opts);
    const endStr = end.toLocaleDateString('en-US', { month: end.getMonth() !== start.getMonth() ? 'short' : undefined, day: 'numeric' });
    const year = end.getFullYear();
    return `${startStr} - ${endStr}, ${year}`;
  }

  function to24Hour(label) {
    const [time, meridiem] = label.split(' ');
    let [h] = time.split(':').map(Number);
    if (meridiem === 'PM' && h !== 12) h += 12;
    if (meridiem === 'AM' && h === 12) h = 0;
    return h;
  }

  function isPastSlot(day, timeLabel) {
    if (day < now) return true;
    if (day.getTime() > now.getTime()) return false;
    // same day as today — compare hour
    return to24Hour(timeLabel) <= new Date().getHours();
  }

  function isBlockedSlot(isoDate, timeLabel) {
    const entry = BLOCKED_SLOTS[isoDate];
    if (!entry) return false;
    if (entry === 'ALL') return true;
    return Array.isArray(entry) && entry.includes(timeLabel);
  }

  function renderCalendar() {
    calRange.textContent = fmtRange(weekStart);
    calPrev.disabled = weekStart.getTime() <= firstWeekStart.getTime();
    calNext.disabled = weekStart.getTime() >= lastWeekStart.getTime();
    calendarGrid.innerHTML = '';

    // corner cell
    const corner = document.createElement('div');
    corner.className = 'cal-cell cal-head';
    calendarGrid.appendChild(corner);

    const days = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(weekStart);
      d.setDate(weekStart.getDate() + i);
      days.push(d);

      const head = document.createElement('div');
      const isToday = d.getTime() === now.getTime();
      head.className = 'cal-cell cal-head' + (isToday ? ' is-today' : '');
      head.innerHTML = `<span class="cal-day-name">${DAY_NAMES[d.getDay()]}</span><span class="cal-day-num">${d.getDate()}</span>`;
      calendarGrid.appendChild(head);
    }

    TIME_SLOTS.forEach(label => {
      const timeCell = document.createElement('div');
      timeCell.className = 'cal-cell cal-time-label';
      timeCell.textContent = label;
      calendarGrid.appendChild(timeCell);

      days.forEach(day => {
        const isoDate = day.toISOString().split('T')[0];
        const past = isPastSlot(day, label);
        const blocked = !past && isBlockedSlot(isoDate, label);
        const unavailable = past || blocked;

        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'cal-cell cal-slot' + (past ? ' past' : '') + (blocked ? ' unavailable' : '');
        btn.innerHTML = '<span class="dot"></span>';
        btn.disabled = unavailable;
        btn.title = blocked ? 'Not available' : (past ? 'Time has passed' : 'Open');
        btn.setAttribute('aria-label', `${DAY_NAMES[day.getDay()]} ${day.getMonth() + 1}/${day.getDate()} at ${label}${unavailable ? ' — unavailable' : ''}`);

        if (dateInput.value === isoDate && timeInput.value === label) {
          btn.classList.add('selected');
        }

        if (!unavailable) {
          btn.addEventListener('click', () => selectSlot(day, label, btn));
        }
        calendarGrid.appendChild(btn);
      });
    });
  }

  function selectSlot(day, label, btn) {
    document.querySelectorAll('.cal-slot.selected').forEach(el => el.classList.remove('selected'));
    btn.classList.add('selected');

    const isoDate = day.toISOString().split('T')[0];
    dateInput.value = isoDate;
    timeInput.value = label;

    const niceDate = day.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
    selectedSlot.textContent = `Selected: ${niceDate} at ${label}`;
    selectedSlot.classList.add('has-selection');
  }

  calPrev.addEventListener('click', () => {
    if (weekStart.getTime() <= firstWeekStart.getTime()) return;
    weekStart.setDate(weekStart.getDate() - 7);
    renderCalendar();
  });
  calNext.addEventListener('click', () => {
    if (weekStart.getTime() >= lastWeekStart.getTime()) return;
    weekStart.setDate(weekStart.getDate() + 7);
    renderCalendar();
  });

  renderCalendar();
}

// Booking form submit feedback
const bookingForm = document.getElementById('bookingForm');
const formNote = document.getElementById('formNote');
if (bookingForm) {
  bookingForm.addEventListener('submit', (e) => {
    const dateVal = document.getElementById('date').value;
    const timeVal = document.getElementById('time').value;
    const selectedSlot = document.getElementById('selectedSlot');

    // Hidden inputs can't show native validation, so check manually first.
    if (!dateVal || !timeVal) {
      e.preventDefault();
      selectedSlot.textContent = 'Please pick a date and time on the calendar above before submitting.';
      selectedSlot.style.color = '#c0392b';
      selectedSlot.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    // If the Formspree endpoint hasn't been configured yet, don't send a broken request —
    // just show a friendly message instead of letting it fail silently.
    if (bookingForm.action.includes('YOUR_FORM_ID')) {
      e.preventDefault();
      formNote.textContent = 'Booking form is almost ready — the site owner still needs to connect a form service (see README).';
      formNote.style.color = '#c0392b';
    } else {
      formNote.textContent = 'Sending your request…';
    }
  });
}
