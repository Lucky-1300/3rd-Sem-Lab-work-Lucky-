
    // === Utilities ===
    const $ = sel => document.querySelector(sel);
    const qs = sel => Array.from(document.querySelectorAll(sel));

    const elems = {
      startBtn: $('#startBtn'), resetBtn: $('#resetBtn'), amount: $('#amount'), category: $('#category'), difficulty: $('#difficulty'), type: $('#type'),
      scoresList: $('#scores'), questionCard: $('#questionCard'), startCard: $('#startCard'), questionText: $('#questionText'), answers: $('#answers'), qIndex: $('#qIndex'),
      progressBar: $('#progressBar'), scoreDisplay: $('#scoreDisplay'), nextBtn: $('#nextBtn'), feedback: $('#feedback'), timer: $('#timer')
    };

    // decode HTML entities from API
    const decode = (s)=>{ const txt = document.createElement('textarea'); txt.innerHTML = s; return txt.value; };

    // shuffle an array (Fisher-Yates)
    const shuffle = arr => {
      const a = arr.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a;
    };

    // local storage helpers for highscores
    const HKEY = 'quiz_highscores_v1';
    const loadHighscores = ()=> JSON.parse(localStorage.getItem(HKEY) || '[]');
    const saveHighscores = (list)=> localStorage.setItem(HKEY, JSON.stringify(list));

    function renderHighscores(){
      const list = loadHighscores(); elems.scoresList.innerHTML = list.slice(0,10).map(s=>`<li><strong>${s.score}</strong> — ${s.amount}q • ${s.difficulty||'any'} • ${new Date(s.when).toLocaleString()}</li>`).join('') || '<li class="muted">No scores yet</li>';
    }

    // fallback sample questions (used if API fails)
    const FALLBACK = [
      {question: 'Which method converts JSON to a JavaScript object?', correct_answer: 'JSON.parse()', incorrect_answers: ['JSON.stringify()', 'Object.fromJSON()', 'JSON.toObject()']},
      {question: 'Which keyword declares a block-scoped variable?', correct_answer: 'let', incorrect_answers:['var','const?','static']},
    ];

    // === Quiz class ===
    class Quiz {
      constructor(questions){
        this.questions = questions; this.index = 0; this.score = 0; this.perQuestionTime = 20; this.timerId = null; this.timeLeft = 0; this.onChange = ()=>{};
      }
      get current(){ return this.questions[this.index]; }
      get total(){ return this.questions.length; }
      start(){ this.index = 0; this.score = 0; this._emit(); }
      selectAnswer(answer){
        if(this._answered) return; // prevent double-clicks
        this._answered = true;
        const correct = answer === this.current.correct_answer;
        if(correct) this.score += 10; // scoring simple: +10 per correct
        clearInterval(this.timerId);
        return correct;
      }
      next(){ this.index++; this._answered = false; this._emit(); }
      _emit(){ this.onChange && this.onChange(this); }
      startTimer(seconds, onTick, onExpire){
        this.timeLeft = seconds; onTick(this.timeLeft);
        clearInterval(this.timerId);
        this.timerId = setInterval(()=>{
          this.timeLeft -= 1; onTick(this.timeLeft);
          if(this.timeLeft <= 0){ clearInterval(this.timerId); onExpire(); }
        },1000);
      }
    }

    // === API fetch ===
    async function fetchQuestions({amount=10, category='', difficulty='', type=''}){
      const params = new URLSearchParams({amount});
      if(category) params.set('category', category);
      if(difficulty) params.set('difficulty', difficulty);
      if(type) params.set('type', type);
      params.set('encode', 'url3986'); // easier to decode reliably
      const url = `https://opentdb.com/api.php?${params.toString()}`;
      try{
        const res = await fetch(url);
        if(!res.ok) throw new Error('Network response not ok');
        const data = await res.json();
        if(data.response_code !== 0) throw new Error('API returned no results');
        // decode and normalize
        const items = data.results.map(r=>({
          question: decode(decodeURIComponent(r.question)),
          correct_answer: decode(decodeURIComponent(r.correct_answer)),
          incorrect_answers: r.incorrect_answers.map(a=>decode(decodeURIComponent(a)))
        }));
        return items;
      }catch(err){
        console.error('Fetch error',err);
        // graceful fallback
        return FALLBACK.map(q=>({question:q.question, correct_answer:q.correct_answer, incorrect_answers:q.incorrect_answers}));
      }
    }

    // === UI wiring ===
    let quiz = null;

    function buildAnswersUI(q){
      const choices = q.type === 'boolean' ? ['True','False'] : shuffle([q.correct_answer, ...q.incorrect_answers]);
      elems.answers.innerHTML = '';
      choices.forEach(choice => {
        const btn = document.createElement('button'); btn.className = 'answer'; btn.setAttribute('tabindex',0);
        btn.innerHTML = `<span>${choice}</span>`;
        btn.addEventListener('click', ()=> handleSelect(btn, choice));
        elems.answers.appendChild(btn);
      });
    }

    function updateProgress(){
      const pct = Math.round((quiz.index / quiz.total) * 100);
      elems.progressBar.style.width = pct + '%';
      elems.scoreDisplay.textContent = quiz.score;
      elems.qIndex.textContent = `Question ${Math.min(quiz.index+1, quiz.total)} of ${quiz.total}`;
    }

    function showQuestion(){
      if(quiz.index >= quiz.total){ showResults(); return; }
      const q = quiz.current;
      elems.questionCard.hidden = false; elems.startCard.hidden = true;
      elems.feedback.textContent = '';
      elems.questionText.textContent = q.question;
      buildAnswersUI(q);
      elems.nextBtn.disabled = true;

      // start per-question timer
      quiz.startTimer(20, (sec)=>{ elems.timer.textContent = `${sec}s`; }, ()=>{
        // time expired
        elems.feedback.textContent = 'Time up!';
        revealCorrect(); elems.nextBtn.disabled = false;
      });
      updateProgress();
    }

    function revealCorrect(){
      const correct = quiz.current.correct_answer;
      qs('.answer').forEach(btn=>{
        if(btn.textContent.trim() === correct) btn.classList.add('correct');
      });
    }

    function handleSelect(btn, choice){
      const correct = quiz.selectAnswer(choice);
      // mark buttons
      qs('.answer').forEach(b=>{ b.disabled=true; b.classList.remove('correct','wrong'); });
      if(correct){ btn.classList.add('correct'); elems.feedback.textContent = 'Correct! +10'; }
      else{ btn.classList.add('wrong'); elems.feedback.textContent = `Wrong — correct was: ${quiz.current.correct_answer}`; revealCorrect(); }
      elems.nextBtn.disabled = false;
      updateProgress();
    }

    function showResults(){
      // record highscore
      const item = {score: quiz.score, amount: quiz.total, difficulty: elems.difficulty.value || 'any', when: Date.now()};
      const list = loadHighscores(); list.unshift(item); list.sort((a,b)=>b.score-a.score); saveHighscores(list);
      renderHighscores();

      elems.questionCard.hidden = true; elems.startCard.hidden = false;
      elems.startCard.innerHTML = `<div style="padding:16px"><h2>Quiz finished</h2><p class="muted">Your score: <strong>${quiz.score}</strong> / ${quiz.total*10}</p><p class="muted">High scores updated.</p></div>`;
      elems.progressBar.style.width = '100%';
    }

    // buttons
    elems.nextBtn.addEventListener('click', ()=>{
      quiz.next(); showQuestion();
    });

    elems.resetBtn.addEventListener('click', ()=>{ if(confirm('Clear saved highscores?')){ localStorage.removeItem(HKEY); renderHighscores(); } });

    elems.startBtn.addEventListener('click', async ()=>{
      const opts = {amount: Math.max(1, Number(elems.amount.value || 10)), category: elems.category.value, difficulty: elems.difficulty.value, type: elems.type.value};
      elems.startBtn.disabled = true; elems.startBtn.textContent = 'Fetching...';
      const items = await fetchQuestions(opts);
      // normalize type for boolean questions (API returns 'True'/'False' strings), but store 'type' optional
      const normalized = items.map(it=>({...it, type: (it.incorrect_answers.length===1 && it.incorrect_answers.includes('False')? 'boolean':'multiple')}));
      quiz = new Quiz(normalized);
      quiz.onChange = ()=>{};
      quiz.start(); showQuestion();
      elems.startBtn.disabled = false; elems.startBtn.textContent = 'Start Quiz';
    });

    // initial render
    renderHighscores();

    // keyboard accessibility: Enter on answer triggers click
    document.addEventListener('keydown', (e)=>{
      if(e.key === 'Enter' && document.activeElement && document.activeElement.classList.contains('answer')){
        document.activeElement.click();
      }
    });

  
