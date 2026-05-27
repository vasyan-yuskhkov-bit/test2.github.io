const questions = [
  { q: "Где обычно можно встретить иксодового клеща — переносчика вируса?", options: ["Только в густом еловом лесу","В траве, кустарниках, на лесных тропах и опушках, в парках","Только в болотистой местности","В сухой степи без растительности"], correct: 1 },
  { q: "В какое время года риск укуса клеща наиболее высок?", options: ["Декабрь–февраль","Апрель–июнь и август–сентябрь","Только июль","Круглый год одинаков"], correct: 1 },
  { q: "Как чаще всего клещ попадает на человека?", options: ["Падает с дерева","Прицепляется с травы или кустарника на одежду/обувь","Прыгает с земли","Заносится домашними животными при контакте"], correct: 1 },
  { q: "Что нужно сделать сразу после обнаружения присосавшегося клеща?", options: ["Залить его маслом и ждать","Аккуратно удалить и поместить в контейнер","Прижечь йодом","Срочно принять антибиотик"], correct: 1 },
  { q: "Куда лучше всего обращаться для исследования клеща?", options: ["В продуктовый магазин","В лабораторию Роспотребнадзора или инфекционную больницу","В аптеку","В ветеринарную клинику"], correct: 1 },
  { q: "Какие симптомы указывают на клещевой энцефалит?", options: ["Только боль в месте укуса","Высокая температура, головная боль, тошнота, слабость","Зуд и сыпь по всему телу","Кашель и насморк"], correct: 1 },
  { q: "Существует ли прививка от клещевого энцефалита?", options: ["Да, есть эффективные вакцины","Нет, только антибиотики","Есть, но она не помогает","Только народные средства"], correct: 0 },
  { q: "Кому рекомендуется вакцинация в первую очередь?", options: ["Только детям до 7 лет","Только пенсионерам","Жителям эндемичных районов, лесникам, туристам, дачникам","Никому"], correct: 2 },
  { q: "Какая защита в лесу самая эффективная?", options: ["Короткие шорты","Светлая закрытая одежда + репелленты","Нательный крестик","Громкое пение"], correct: 1 },
  { q: "Что может назначить врач для экстренной профилактики?", options: ["Греющий компресс","Банки и горчичники","Иммуноглобулин или противовирусные препараты","Слабительные"], correct: 2 }
];

let current = 0, score = 0, userName = "";

function startTest() {
  userName = document.getElementById('userName').value.trim();
  if (!userName) {
    alert("Пожалуйста, введите ваше имя!");
    return;
  }

  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById('quiz').classList.add('active');
  
  current = 0;
  score = 0;
  document.getElementById('userDisplay').textContent = userName;
  showQuestion();
}

function showQuestion() {
  const q = questions[current];
  document.getElementById('current').textContent = current + 1;
  document.getElementById('question').textContent = q.q;

  const optionsDiv = document.getElementById('options');
  optionsDiv.innerHTML = '';

  q.options.forEach((text, i) => {
    const btn = document.createElement('button');
    btn.textContent = text;
    btn.onclick = () => selectAnswer(i, btn);
    optionsDiv.appendChild(btn);
  });

  document.getElementById('nextBtn').classList.add('hidden');
}

function selectAnswer(selectedIdx, btn) {
  const correctIdx = questions[current].correct;
  const allBtns = document.querySelectorAll('#options button');

  allBtns.forEach((b, idx) => {
    b.disabled = true;
    if (idx === correctIdx) b.classList.add('correct');
  });

  if (selectedIdx !== correctIdx) {
    btn.classList.add('wrong');
  } else {
    score++;
  }

  document.getElementById('nextBtn').classList.remove('hidden');
}

function nextQuestion() {
  current++;
  if (current < questions.length) {
    showQuestion();
  } else {
    showResult();
  }
}

function showResult() {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById('result').classList.add('active');

  const percent = Math.round((score / 10) * 100);
  document.getElementById('resultName').textContent = userName;

  const circle = document.getElementById('scoreCircle');
  circle.textContent = percent + '%';
  circle.style.borderColor = percent >= 80 ? '#10b981' : percent >= 60 ? '#34d399' : '#f59e0b';

  document.getElementById('resultText').textContent = percent >= 80 
    ? 'Отлично! Вы хорошо знаете тему.' 
    : 'Есть пробелы. Рекомендуем повторить материал.';

  saveResult(percent);
}

function saveResult(percent) {
  let results = JSON.parse(localStorage.getItem('tickResults') || '[]');
  results.unshift({
    name: userName,
    date: new Date().toLocaleString('ru-RU'),
    score: percent,
    correct: score
  });
  localStorage.setItem('tickResults', JSON.stringify(results.slice(0, 50)));
}

function showAdmin() {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById('admin').classList.add('active');
  document.getElementById('adminContent').classList.add('hidden');
}

function checkAdmin() {
  const pass = document.getElementById('adminPass').value;
  if (pass === "admin123") {
    document.getElementById('adminContent').classList.remove('hidden');
    showAdminStats();
  } else {
    alert("Неверный пароль!");
  }
}

function showAdminStats() {
  let results = JSON.parse(localStorage.getItem('tickResults') || '[]');
  let html = `<p>Всего прохождений: <b>${results.length}</b></p>`;
  
  results.forEach(r => {
    html += `
      <div class="result-item">
        <strong>${r.name}</strong> — ${r.date}<br>
        <span class="score">${r.score}% (${r.correct}/10)</span>
      </div>`;
  });

  document.getElementById('adminStats').innerHTML = html || '<p>Результатов пока нет</p>';
}

function clearResults() {
  if (confirm("Удалить все результаты?")) {
    localStorage.removeItem('tickResults');
    showAdminStats();
  }
}

function hideAdmin() {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById('result').classList.add('active');
}

function restart() {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById('start').classList.add('active');
  document.getElementById('userName').value = '';
}