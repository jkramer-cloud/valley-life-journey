/* VALLEY LIFE JOURNEY · An original life-skills board adventure
   Fictional economics and scenarios for classroom play.
   No external libraries, logins, trackers, or network requests.
*/
(() => {
  'use strict';
  const SAVE_KEY = 'naches-valley-life-journey-v1';
  const BOARD_LENGTH = 54;
  const PAYDAYS = new Set([7, 14, 21, 28, 35, 42, 49]);
  const MILESTONES = new Set([11, 22, 33, 44]);
  const COLORS = ['#f38a4f', '#36a8bd', '#a575c3', '#75ae57'];
  const NAMES = ['You', 'Player 2', 'Player 3', 'Player 4'];
  const MONEY = new Intl.NumberFormat('en-US', { style:'currency', currency:'USD', maximumFractionDigits:0 });
  const $ = id => document.getElementById(id);
  const htmlSafe = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const clip = (v, min, max) => Math.max(min, Math.min(max, v));
  const money = n => MONEY.format(Math.round(n || 0));
  const rand = n => Math.floor(Math.random() * n);
  const PALETTE = {
    start:'#e9b24b', opportunity:'#25849e', money:'#df974c', surprise:'#a46aad',
    community:'#4d976e', wellbeing:'#e07f70', learning:'#537aab', payday:'#33aa83', milestone:'#efc452', end:'#f0b953'
  };
  const ICONS = {start:'GO', opportunity:'✧', money:'$', surprise:'?', community:'♥', wellbeing:'+', learning:'✎', payday:'PAY', milestone:'★', end:'END'};
  const KIND_NAMES = {opportunity:'Opportunity', money:'Money decision', surprise:'Life surprise', community:'Community', wellbeing:'Wellbeing', learning:'Learning', payday:'Payday',milestone:'Major milestone'};
  const JOBS = [
    {id:'teacher',name:'Teacher',icon:'📚',pay:3900,detail:'Help people learn, lead, and grow.'},
    {id:'electrician',name:'Electrician',icon:'⚡',pay:4650,detail:'Install and maintain useful technology.'},
    {id:'nurse',name:'Nurse',icon:'🩺',pay:4900,detail:'Care for people in many settings.'},
    {id:'designer',name:'Graphic Designer',icon:'🎨',pay:4000,detail:'Solve problems using creative communication.'},
    {id:'coder',name:'Software Developer',icon:'💻',pay:5200,detail:'Build tools and applications.'},
    {id:'chef',name:'Chef',icon:'🍳',pay:3650,detail:'Plan and prepare food for others.'},
    {id:'ranger',name:'Park Ranger',icon:'🌲',pay:3850,detail:'Care for public lands and visitors.'},
    {id:'technician',name:'Medical Technician',icon:'🔬',pay:4400,detail:'Support medical testing and patient care.'}
  ];
  const opt = (title,desc,changes) => ({title,desc,changes});
  const SCENARIOS = [
    {id:'bike',kind:'money',title:'Getting around town',text:'You need dependable transportation. How will you travel?',options:[opt('Buy a used bike','Lower cost, with more exercise.',{cash:-420,happiness:3}),opt('Pay for extra rides','More convenience, higher cost.',{cash:-1150,happiness:2})]},
    {id:'repair',kind:'surprise',title:'Surprise car repair',text:'A warning light comes on. You have to make a plan.',options:[opt('Use emergency cash','Repair it now and avoid a bigger breakdown.',{cash:-1450,skills:1}),opt('Take a small repair loan','Save cash today, but owe more later.',{debt:1750,happiness:-3})]},
    {id:'skills',kind:'learning',title:'New skill opportunity',text:'An affordable class could open doors.',options:[opt('Take the workshop','Learn a useful skill and meet new people.',{cash:-650,skills:3,happiness:2}),opt('Learn with free resources','More time invested, smaller direct cost.',{skills:1,community:1})]},
    {id:'team',kind:'community',title:'Help with a youth activity',text:'A local group is looking for volunteers.',options:[opt('Help organize it','Give time to build community connections.',{community:3,happiness:4}),opt('Donate supplies','Support the activity with your budget.',{cash:-450,community:2})]},
    {id:'wellness',kind:'wellbeing',title:'Make room for rest',text:'Your schedule has been nonstop lately.',options:[opt('Protect a free afternoon','A little downtime helps you recharge.',{happiness:7}),opt('Take a wellness class','Spend money now to form a healthy habit.',{cash:-400,happiness:6,skills:1})]},
    {id:'payraise',kind:'opportunity',title:'A project goes well!',text:'Your effort is recognized at work.',options:[opt('Ask for more responsibility','You might earn more every future payday.',{pay:200,skills:1,happiness:-1}),opt('Celebrate with friends','Enjoy the moment and build relationships.',{cash:-300,happiness:6,community:1})]},
    {id:'library',kind:'learning',title:'Discover the library',text:'The local library offers a free career event.',options:[opt('Attend the event','Learn about opportunities in your area.',{skills:2,community:1}),opt('Join a book club','Build friendships around new ideas.',{happiness:3,community:2,skills:1})]},
    {id:'hobby',kind:'wellbeing',title:'Find a new hobby',text:'What will help you enjoy life outside of work?',options:[opt('Try a low-cost outdoor hobby','Walk, explore, and enjoy fresh air.',{cash:-150,happiness:7}),opt('Invest in creative equipment','Make art or music with your own supplies.',{cash:-750,happiness:8,skills:1})]},
    {id:'energy',kind:'money',title:'Energy bills are rising',text:'Electricity and heating cost more than expected.',options:[opt('Make energy-saving changes','A small upgrade helps with future costs.',{cash:-450,skills:1}),opt('Pay the bigger bill','Handle the immediate problem.',{cash:-850})]},
    {id:'festival',kind:'community',title:'Valley community festival',text:'A neighborhood celebration is coming up.',options:[opt('Volunteer at a booth','Connect with neighbors and pitch in.',{community:3,happiness:4}),opt('Go for the day','Enjoy food and games with friends.',{cash:-200,happiness:6})]},
    {id:'market',kind:'money',title:'Grocery decisions',text:'Your food budget needs attention this month.',options:[opt('Plan meals and compare prices','Save money while building a useful habit.',{cash:450,skills:1}),opt('Choose convenient prepared meals','Save time but spend more.',{cash:-450,happiness:2})]},
    {id:'sidegig',kind:'opportunity',title:'A weekend opportunity',text:'Someone asks whether you can help with a short project.',options:[opt('Take the side job','Earn money, but use some free time.',{cash:1400,happiness:-3,skills:1}),opt('Keep the weekend free','Time to rest, play, or see friends.',{happiness:5})]},
    {id:'donate',kind:'community',title:'Help the food pantry',text:'Your community food pantry needs support.',options:[opt('Make a small donation','Share some of what you have.',{cash:-350,community:3,happiness:2}),opt('Donate your time','Pack boxes and help visitors.',{community:3,skills:1})]},
    {id:'trip',kind:'surprise',title:'A chance to take a trip',text:'A short vacation could be a great memory.',options:[opt('Go on a budget adventure','Explore somewhere nearby.',{cash:-700,happiness:8}),opt('Plan a bigger getaway','Spend more for an exciting experience.',{cash:-1850,happiness:12})]},
    {id:'rain',kind:'surprise',title:'Storm cleanup',text:'Wind and heavy rain leave a mess in your neighborhood.',options:[opt('Pitch in with cleanup','Help your neighbors recover.',{community:3,happiness:1}),opt('Hire someone to fix the damage','Get repairs handled, at a cost.',{cash:-1100})]},
    {id:'course',kind:'learning',title:'Career certification',text:'A new credential could qualify you for different assignments.',options:[opt('Earn the certification','Up-front expense for more future pay.',{cash:-1100,skills:3,pay:300}),opt('Practice on free projects','More skills without a large bill.',{skills:2,happiness:1})]},
    {id:'coach',kind:'community',title:'Mentor a younger student',text:'Your experience could help a new student.',options:[opt('Become a mentor','Encourage someone else and gain perspective.',{community:3,happiness:5}),opt('Support a scholarship','Give what you can financially.',{cash:-300,community:2})]},
    {id:'sport',kind:'wellbeing',title:'Build healthy routines',text:'You want to improve your daily activity habits.',options:[opt('Walk with a friend','Free exercise and good conversation.',{happiness:6,community:1}),opt('Join a recreation program','A small fee for structured activities.',{cash:-550,happiness:8})]},
    {id:'device',kind:'surprise',title:'Your laptop stops working',text:'Technology problems arrive at the worst time.',options:[opt('Repair your laptop','Spend less and extend its life.',{cash:-650,skills:1}),opt('Replace it','A new device costs more upfront.',{cash:-1800,happiness:3})]},
    {id:'bonus',kind:'opportunity',title:'Recognition bonus',text:'A completed project earns some extra money.',options:[opt('Put the bonus into savings','Build a cushion for the future.',{savings:900,happiness:2}),opt('Use the bonus for fun','Enjoy an experience right now.',{cash:700,happiness:5})]},
    {id:'account',kind:'money',title:'Savings challenge',text:'You could set money aside for emergencies.',options:[opt('Move $900 into savings','Keep it available for later and earn security points.',{cash:-900,savings:900,skills:1}),opt('Keep money in your wallet','More spending flexibility, for now.',{happiness:1})]},
    {id:'bikepath',kind:'community',title:'Make the neighborhood safer',text:'Residents propose a new walking and cycling path.',options:[opt('Support the planning group','Work together to improve your community.',{community:3,skills:1}),opt('Contribute a little money','Help fund supplies and equipment.',{cash:-400,community:2})]},
    {id:'garden',kind:'wellbeing',title:'Start a small garden',text:'You have a chance to learn how food grows.',options:[opt('Try a container garden','Use inexpensive materials and learn.',{cash:-250,happiness:6,skills:1}),opt('Build raised beds','Invest in a bigger project.',{cash:-750,happiness:9,skills:2})]},
    {id:'neighbor',kind:'community',title:'A neighbor needs a hand',text:'Someone nearby needs help with a project.',options:[opt('Offer a few hours','Help out without expecting payment.',{community:3,happiness:3}),opt('Lend useful equipment','Make your tools available for a good cause.',{community:2,skills:1})]},
    {id:'overtime',kind:'opportunity',title:'Extra hours at work',text:'Your employer offers an optional extra shift.',options:[opt('Work the extra shift','Make some money but sacrifice some rest.',{cash:1100,happiness:-4}),opt('Protect your time','Recharge and keep your plans.',{happiness:5})]},
    {id:'taxes',kind:'money',title:'Annual budgeting checkpoint',text:'You review bills, subscriptions, and savings goals.',options:[opt('Cancel unused subscriptions','Free up some money.',{cash:550,skills:2}),opt('Meet with a financial educator','Pay for help learning to plan.',{cash:-350,skills:3})]},
    {id:'pet',kind:'surprise',title:'Considering a pet',text:'You like animals, but caring for one takes commitment.',options:[opt('Adopt a pet responsibly','Budget for food, supplies, and veterinary care.',{cash:-1050,happiness:9}),opt('Volunteer with an animal shelter','Spend time helping animals without adopting.',{community:3,happiness:5})]},
    {id:'farm',kind:'community',title:'Support local growers',text:'The farmers market is holding a community day.',options:[opt('Volunteer at the event','Get involved and learn about food systems.',{community:3,skills:1}),opt('Buy local groceries','Support small businesses.',{cash:-300,happiness:3,community:1})]},
    {id:'project',kind:'learning',title:'Learn a practical skill',text:'You want to fix things instead of replacing them.',options:[opt('Take a repair workshop','Gain a useful hands-on skill.',{cash:-350,skills:3}),opt('Watch free tutorials and practice','Save money and learn more slowly.',{skills:2})]},
    {id:'healthbill',kind:'surprise',title:'Unexpected health expense',text:'You receive a bill that you did not plan for.',options:[opt('Pay it from cash','Handle the bill without creating new debt.',{cash:-1200,happiness:-2}),opt('Arrange a payment plan','Keep more cash available, but owe money.',{debt:1350,happiness:-3})]},
    {id:'reunion',kind:'wellbeing',title:'Catch up with old friends',text:'You have a chance to reconnect with people you care about.',options:[opt('Host a simple gathering','Make a low-cost memory.',{cash:-180,happiness:7,community:1}),opt('Plan a weekend reunion','Spend more to make it special.',{cash:-950,happiness:10})]},
    {id:'presentation',kind:'opportunity',title:'Present a new idea',text:'Your team asks for ideas on improving a project.',options:[opt('Present your proposal','Learn through trying something challenging.',{skills:2,pay:125,happiness:2}),opt('Support your teammate','Help someone else shine.',{community:2,happiness:3})]},
    {id:'saver',kind:'money',title:'Emergency fund milestone',text:'A little financial cushion can help with surprises.',options:[opt('Save $1,250','Set money aside where you can reach it later.',{cash:-1250,savings:1250,skills:1}),opt('Make a $700 debt payment','Reduce future money stress.',{cash:-700,debt:-700,happiness:2})]},
    {id:'birthday',kind:'wellbeing',title:'Celebrate a milestone',text:'How will you celebrate a birthday or special occasion?',options:[opt('Picnic with friends','Make the occasion meaningful without overspending.',{cash:-160,happiness:7,community:1}),opt('Big celebration','A more expensive memorable event.',{cash:-950,happiness:10})]},
    {id:'fixroof',kind:'surprise',title:'Home maintenance season',text:'An important repair needs attention where you live.',options:[opt('Fix the problem promptly','Spend now and prevent bigger issues.',{cash:-1000,happiness:-1}),opt('Build a repair plan','Pay a little less now, but accept some stress.',{cash:-300,happiness:-5,skills:1})]},
    {id:'museum',kind:'learning',title:'Visit a cultural exhibit',text:'A local exhibit teaches something new.',options:[opt('Visit on a free day','Learn and enjoy something different.',{skills:2,happiness:3}),opt('Join a guided workshop','Pay a little for an interactive experience.',{cash:-300,skills:3,happiness:4})]},
    {id:'fundraiser',kind:'community',title:'Community fundraiser',text:'A family in town is raising money after a difficult year.',options:[opt('Donate what you can','Provide direct financial support.',{cash:-450,community:3}),opt('Organize a donation drive','Give time and build connections.',{community:4,skills:1})]},
    {id:'stargaze',kind:'wellbeing',title:'Enjoy the night sky',text:'It is a clear evening in the valley.',options:[opt('Invite friends to stargaze','An almost-free way to connect.',{happiness:6,community:1}),opt('Join an astronomy outing','A small fee for new learning.',{cash:-280,skills:2,happiness:6})]},
    {id:'freelance',kind:'opportunity',title:'A creative project request',text:'A local business needs help with a short project.',options:[opt('Take the paid project','Earn extra money and practice skills.',{cash:950,skills:1,happiness:-2}),opt('Teach someone else instead','Share what you know.',{community:2,skills:2})]},
    {id:'discount',kind:'money',title:'A tempting sale',text:'A store advertises a huge discount.',options:[opt('Stick to the shopping list','Avoid spending on things you did not need.',{cash:250,skills:1}),opt('Buy a nonessential item','Get something fun but reduce your budget.',{cash:-850,happiness:4})]},
    {id:'neighborfestival',kind:'community',title:'Community art mural',text:'Students and residents are painting a mural.',options:[opt('Paint with the team','Contribute your ideas and time.',{community:3,skills:1,happiness:3}),opt('Buy supplies for the project','Help the artists get what they need.',{cash:-320,community:2})]},
    {id:'emergency',kind:'surprise',title:'A major unexpected bill',text:'Life sends a bill you were not expecting.',options:[opt('Pay the expense now','It is expensive, but avoids borrowing.',{cash:-2000,happiness:-2}),opt('Finance the expense','Pay over time with additional cost.',{debt:2400,happiness:-4})]}
  ];
  const MILESTONE_EVENTS = {
    11: {id:'housing',kind:'milestone',title:'Where will you make your home?',text:'Housing is a major decision. Renting and buying both involve trade-offs. Buying requires a down payment and borrowing.',options:[
      opt('Rent and stay flexible','Keep your cash for other goals. Recurring cost: $1,150/turn.',{home:'rent',happiness:3}),
      opt('Buy a modest home','Pay a down payment, gain home value, take on a mortgage. Cost: $900/turn.',{cash:-7200,debt:21000,equity:26000,home:'owner',happiness:4})
    ]},
    22: {id:'connections',kind:'milestone',title:'Who is part of your life?',text:'There is no single right family or support network. Choose how you want to invest in people.',options:[
      opt('Build strong friendships','Time with friends and chosen family is valuable.',{happiness:8,community:2}),
      opt('Take on a caregiving role','Support a family member or someone close to you.',{dependents:1,happiness:5,community:3}),
      opt('Raise a child','Add responsibilities and meaningful experiences. Living costs rise.',{dependents:1,happiness:6,community:2,cash:-1500})
    ]},
    33: {id:'career',kind:'milestone',title:'Your career can keep changing',text:'You have experience now. Where will you focus your energy?',options:[
      opt('Pursue an advancement','Higher future pay, but spend on training.',{cash:-1800,pay:550,skills:2,happiness:-3}),
      opt('Seek better work-life balance','A little less income in exchange for more time.',{pay:-250,happiness:13}),
      opt('Start a side project','Explore something new with modest risk.',{cash:-1000,skills:3,community:2})
    ]},
    44: {id:'planning',kind:'milestone',title:'Plan for the years ahead',text:'You are getting closer to retirement. Do you build savings, reduce debt, or strengthen your community?',options:[
      opt('Add $2,000 to savings','Cash moves into protected savings.',{cash:-2000,savings:2000,skills:1}),
      opt('Pay down $2,000 of debt','Reduce liabilities to improve your financial security.',{cash:-2000,debt:-2000,happiness:2}),
      opt('Invest in people and learning','You can have many different kinds of wealth.',{cash:-450,community:4,skills:2,happiness:6})
    ]}
  };
  const DEFAULT_KINDS = ['start','opportunity','money','learning','community','surprise','wellbeing'];
  const CELLS = Array.from({length:BOARD_LENGTH}, (_,i) => {
    const kind = i===0?'start':i===BOARD_LENGTH-1?'end':MILESTONES.has(i)?'milestone':PAYDAYS.has(i)?'payday':DEFAULT_KINDS[1+((i*17 + Math.floor(i/4)*13 + (i*i)%11)%6)];
    return {index:i, kind, label: i===0?'START':i===53?'RETIRE':kind==='milestone'?({11:'HOME',22:'PEOPLE',33:'CAREER',44:'FUTURE'}[i]):kind==='payday'?'PAY':`${i}`};
  });

  let game = null;
  let spinAngle = 0;
  let spinTimer = null;
  let toastTimer = null;
  let overlayView = null;

  function makePlayer(name, idx) {
    return {id:`p${idx}`,name:name.trim().slice(0,25)||`Player ${idx+1}`,color:COLORS[idx],position:0,turns:0,
      cash:12000,savings:0,debt:0,equity:0,happiness:66,community:0,skills:0,
      pay:0,career:null,path:null,home:'rent',dependents:0,retired:false,used:[],
      journal:[]};
  }
  const current = () => game?.players?.[game.current] || null;
  const netWorth = p => p.cash + p.savings + p.equity - p.debt;
  function score(p){return Math.max(0,Math.round(netWorth(p)/450)) + p.happiness*2 + p.community*9 + p.skills*12;}
  function store(){try{if(game)localStorage.setItem(SAVE_KEY,JSON.stringify(game));}catch(err){showToast('Browser storage is unavailable; export a backup.');}}
  function readStore(){try{const s=JSON.parse(localStorage.getItem(SAVE_KEY)||'null');return validGame(s)?s:null;}catch{return null;}}
  function validGame(s){return !!(s && s.version===1 && Array.isArray(s.players) && s.players.length>=1 && s.players.length<=4 &&
    s.players.every(p=>typeof p.name==='string'&&p.name.length<=25&&Number.isFinite(p.cash)&&Number.isFinite(p.position)&&p.position>=0&&p.position<BOARD_LENGTH)&&
    Number.isInteger(s.current)&&s.current>=0&&s.current<s.players.length&&typeof s.phase==='string'&&Array.isArray(s.pending));}
  function commit(){store();render();}
  function log(p,title,description){const e={title,description,turn:p.turns,time:new Date().toISOString()};p.journal.unshift(e);p.journal=p.journal.slice(0,80);}
  function showToast(s){const el=$('toast');el.textContent=s;el.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.remove('show'),3200);}
  function setModal(eyebrow,title,description,body,bottom){
    $('modalEyebrow').textContent=eyebrow;
    $('modalTitle').textContent=title;
    $('modalCopy').textContent=description;
    $('modalBody').innerHTML=body;
    $('modalBottom').innerHTML=bottom;
    $('modal').hidden=false;
    requestAnimationFrame(()=>$('modalCard').focus());
  }
  function hideModal(){overlayView=null;$('modal').hidden=true;}

  function setupView(saved){
    overlayView='setup';
    const body=`<div class="setup-form"><label class="field-label">How many players?
      <select id="playerCount"><option value="1">1 player · Solo adventure</option><option value="2">2 players · Pass & play</option><option value="3">3 players · Pass & play</option><option value="4">4 players · Pass & play</option></select></label>
      <div class="name-fields">${NAMES.map((n,i)=>`<label class="name-field" data-idx="${i}">${i===0?'Your name':`Player ${i+1}`}<input id="name${i}" maxlength="25" value="${htmlSafe(n)}" autocomplete="off"></label>`).join('')}</div>
      <div class="notice-box"><strong>How it works:</strong> Each player spins 1–6 spaces and makes decisions. The first path choice and career choice happen before anyone spins. There are 54 spaces including START and RETIRE. One device, turn by turn. Everything saves locally.</div>
      </div>`;
    const bottom=`<button class="primary-btn" id="beginBtn" type="button">Start a new journey</button>
      ${saved?'<button class="secondary-btn" id="resumeBtn" type="button">Continue saved journey</button>':''}
      <button class="secondary-btn" id="importBtn" type="button">Import backup</button><input type="file" id="importFile" accept="application/json,.json" hidden>`;
    setModal('NACHES LEARNING HUB · AN ORIGINAL BOARD ADVENTURE','Your future is yours to shape',
      'Earn, save, learn, give back, and respond to surprises. The player with the strongest overall life-balance score wins.',body,bottom);
    const toggle=()=>{const n=+$('playerCount').value;document.querySelectorAll('.name-field').forEach((el,i)=>el.style.display=i<n?'grid':'none');};
    $('playerCount').addEventListener('change',toggle);toggle();
    $('beginBtn').onclick=()=>{
      if(saved&&!confirm('Start a fresh journey? The current saved game will be replaced. Export a backup first if you want to keep it.'))return;
      const n=+$('playerCount').value;
      game={version:1,phase:'path',current:0,players:Array.from({length:n},(_,i)=>makePlayer($(`name${i}`).value,i)),pending:[],lastSpin:null,started:new Date().toISOString()};
      commit();pathView();
    };
    if(saved)$('resumeBtn').onclick=()=>{game=saved;if(game.phase==='moving')game.phase='ready';hideModal();commit();if(game.phase==='path')pathView();if(game.phase==='career')careerView();if(game.phase==='final')resultView();};
    $('importBtn').onclick=()=>$('importFile').click();
    $('importFile').onchange=async e=>{const f=e.target.files[0];if(!f)return;try{const s=JSON.parse(await f.text());if(!validGame(s))throw Error('Not a valid Valley Life Journey backup');if(!confirm('Load this backup? It replaces your current saved journey on this browser.'))return;game=s;if(game.phase==='moving')game.phase='ready';commit();hideModal();if(game.phase==='path')pathView();if(game.phase==='career')careerView();if(game.phase==='final')resultView();showToast('Journey restored.');}catch(err){alert(`Could not import: ${err.message}`);}};
  }
  function pathView(){
    overlayView='path';
    const p=current();
    const body=`<div class="option-grid"><button class="option-card" data-path="earn"><span class="option-icon">🧰</span><span class="option-name">Start earning</span><span class="option-description">Begin work and learn on the job. Receive $1,800 right away and gain a practical skill.</span><span class="option-detail">+ $1,800 · +1 skill</span></button>
      <button class="option-card" data-path="train"><span class="option-icon">🎓</span><span class="option-name">Study or train</span><span class="option-description">Pay for a training program. Begin with $9,000 of education debt but gain more skills and future pay.</span><span class="option-detail harm">+ $9,000 debt · +3 skills · + future pay</span></button></div>`;
    setModal(`PLAYER ${game.current+1} OF ${game.players.length} · FIRST BIG CHOICE`,`${p.name}, choose your starting path`,
      'Both paths can lead to a successful life. Education and training come in many forms; these are simplified game options.',body,'');
    document.querySelectorAll('[data-path]').forEach(btn=>btn.onclick=()=>{
      p.path=btn.dataset.path;
      if(p.path==='earn'){applyChange(p,{cash:1800,skills:1});log(p,'Starting path','Began earning and gaining experience.');}
      else{applyChange(p,{debt:9000,skills:3});log(p,'Starting path','Started a study or training program.');}
      game.phase='career';commit();careerView();
    });
  }
  function careerView(){
    overlayView='career';
    const p=current();
    const body=`<div class="option-grid">${JOBS.map(j=>`<button class="option-card" data-job="${j.id}"><span class="option-icon">${j.icon}</span><span class="option-name">${htmlSafe(j.name)}</span><span class="option-description">${htmlSafe(j.detail)}</span><span class="option-detail">Simulated payday: ${money(Math.round(j.pay*(p.path==='train'?1.12:1)))}</span></button>`).join('')}</div>`;
    setModal(`PLAYER ${game.current+1} · CHOOSE A CAREER`,`${p.name}, what will you do?`,
      'Choose a career to begin your story. These pay amounts are invented for gameplay—not real salaries or career advice.',body,'');
    document.querySelectorAll('[data-job]').forEach(btn=>btn.onclick=()=>{
      const job=JOBS.find(j=>j.id===btn.dataset.job);
      p.career=job.id;
      p.pay=Math.round(job.pay*(p.path==='train'?1.12:1));
      log(p,'Career selected',`${job.name} · simulated payday ${money(p.pay)}.`);
      if(game.current+1<game.players.length){game.current++;game.phase='path';commit();pathView();}
      else{game.current=0;game.phase='ready';commit();hideModal();showToast('All set! Spin to begin the adventure.');}
    });
  }

  function getCellKind(i){return CELLS[i].kind;}
  function boardCoordinates(){return CELLS.map((cell,i)=>{
    const row=Math.floor(i/9), col=i%9;
    return {x:79+(row%2?8-col:col)*92,y:93+row*92+Math.sin((i+row)*1.4)*5};
  });}
  const POINTS=boardCoordinates();
  function sceneSvg(){
    const lake=`<path d="M40 516 Q110 467 158 513 T252 520 Q220 601 122 617 T40 516" fill="#b9dada" opacity=".53"/>`;
    const mountains=Array.from({length:8},(_,i)=>{let x=20+i*119;let y=i%2?34:41;return `<path d="M${x} ${y+48}l33 -55 37 55Z" fill="${i%3?'#d2e3d5':'#c7dacd'}" opacity=".67"/><path d="M${x+24} ${y+12}l9 -19 12 19" fill="#f5f6e8"/>`}).join('');
    const shrubs=Array.from({length:24},(_,i)=>{let x=35+(i*73)%835,y=53+(i*137)%571;return `<path d="M${x} ${y}q-8 -10 -12 0m12 0q3 -15 13 -5m-13 5v7" stroke="#7cac87" opacity=".45" fill="none" stroke-width="2.3"/>`}).join('');
    return `<defs><linearGradient id="ground" x2="1" y2="1"><stop stop-color="#e3efda"/><stop offset=".52" stop-color="#fff5d9"/><stop offset="1" stop-color="#d4e9d8"/></linearGradient><filter id="shadow"><feDropShadow dx="0" dy="3" stdDeviation="2" flood-opacity=".2"/></filter></defs><rect width="900" height="665" fill="url(#ground)"/>${mountains}${lake}${shrubs}<text x="456" y="31" font-size="10" letter-spacing="3" text-anchor="middle" fill="#85ad9a" font-weight="800">CHOOSE YOUR OWN ADVENTURE</text>`;
  }
  function routePath(){let d=`M${POINTS[0].x} ${POINTS[0].y}`;for(let i=1;i<POINTS.length;i++){
      const prev=POINTS[i-1],next=POINTS[i];const vx=(prev.x+next.x)/2,vy=(prev.y+next.y)/2;
      if(i%9===0){d+=` Q ${prev.x} ${(prev.y+next.y)/2}, ${next.x} ${next.y}`;}
      else d+=` L ${next.x} ${next.y}`;
    }return d;}
  function drawBoard(){
    const road=routePath();
    let tiles='';
    CELLS.forEach((c,i)=>{
      const pos=POINTS[i];const milestone=c.kind==='milestone'||c.kind==='end';
      const isActive=game&&current()?.position===i;
      tiles+=`<g transform="translate(${pos.x} ${pos.y})" aria-label="Space ${i}: ${KIND_NAMES[c.kind]||c.kind}">
        ${milestone?`<circle r="28" fill="${PALETTE[c.kind]}" opacity=".26"/>`:''}
        <circle r="22" fill="${PALETTE[c.kind]}" stroke="${isActive?'#fff0b4':'#fffaee'}" stroke-width="${isActive?6:3}" filter="url(#shadow)"/>
        <text font-weight="900" y="${c.kind==='payday'||c.kind==='start'||c.kind==='end'?4:6}" text-anchor="middle" fill="${c.kind==='milestone'?'#614b24':'white'}" font-size="${c.kind==='start'||c.kind==='end'?10:c.kind==='payday'?12:19}">${ICONS[c.kind]||i}</text>
        ${c.kind==='milestone'?`<text y="39" font-size="10" font-weight="900" fill="#4d665b" text-anchor="middle">${c.label}</text>`:''}
        <title>Space ${i} · ${c.label} · ${KIND_NAMES[c.kind]||c.kind}</title>
      </g>`;
    });
    const markers=game?game.players.map((p,i)=>{
      const pt=POINTS[p.position];const shifts=[[-12,-27],[13,-28],[-12,28],[13,28]][i];const x=pt.x+shifts[0],y=pt.y+shifts[1];
      return `<g transform="translate(${x} ${y})"><circle r="12" fill="${p.color}" stroke="#f9fff6" stroke-width="3" filter="url(#shadow)"/><text text-anchor="middle" y="4" font-size="10" fill="#173844" font-weight="1000">${i+1}</text><title>${htmlSafe(p.name)} at space ${p.position}</title></g>`;
    }).join(''):'';
    $('boardSvg').innerHTML=sceneSvg()+`<path d="${road}" stroke="#9fbea6" stroke-width="40" fill="none" stroke-linecap="round" stroke-linejoin="round" opacity=".33"/><path d="${road}" stroke="#fff9d8" stroke-width="34" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="${road}" stroke="#d0a877" stroke-width="24" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="${road}" stroke="#fee4b3" stroke-width="2.8" stroke-dasharray="6 13" fill="none" stroke-linecap="round"/>${tiles}${markers}`;
  }

  function applyChange(p,c){
    if(!c)return;
    for(const [key,value] of Object.entries(c)){
      if(['cash','savings','debt','equity','happiness','community','skills','pay','dependents'].includes(key))p[key]=(Number(p[key])||0)+value;
      if(key==='home')p.home=value;
    }
    p.happiness=clip(p.happiness,0,100);
    p.community=clip(p.community,0,35);
    p.skills=clip(p.skills,0,28);
    p.pay=Math.max(1000,p.pay);
    p.debt=Math.max(0,p.debt);
    p.equity=Math.max(0,p.equity);
    p.dependents=clip(p.dependents,0,4);
    if(p.cash<0){p.debt+=-p.cash;p.cash=0;}
    if(p.savings<0){p.cash+=p.savings;p.savings=0;if(p.cash<0){p.debt+=-p.cash;p.cash=0;}}
  }
  function livingCost(p){return (p.home==='owner'?900:1150)+p.dependents*300;}
  function makeScenario(p,kind){
    const selection=SCENARIOS.filter(s=>s.kind===kind);
    const available=selection.filter(s=>!p.used.includes(s.id));
    const pool=available.length?available:selection.length?selection:SCENARIOS;
    const s=pool[rand(pool.length)];p.used.push(s.id);if(p.used.length>SCENARIOS.length)p.used=p.used.slice(-12);
    return JSON.parse(JSON.stringify(s));
  }
  function spin(){
    if(!game||game.phase!=='ready'||!current()||current().retired)return;
    const spinValue=rand(6)+1;
    game.phase='moving';game.lastSpin=spinValue;
    spinAngle+=4*360+((6-spinValue)*60)+(spinAngle%60===0?0:0);
    $('wheelDisc').style.transform=`rotate(${spinAngle}deg)`;
    $('wheelHub').textContent='…';
    commit();
    clearTimeout(spinTimer);
    spinTimer=setTimeout(()=>{spinTimer=null;move(spinValue);},900);
  }
  function move(value){
    if(!game||game.phase!=='moving')return;
    const p=current();
    const from=p.position;
    const to=Math.min(BOARD_LENGTH-1,from+value);
    const travelled=to-from;
    p.turns++;
    p.position=to;
    const expense=livingCost(p);
    applyChange(p,{cash:-expense});
    log(p,'Everyday living',`Chapter ${p.turns}: ${money(expense)} in simulated living expenses.`);
    const crossed=Array.from({length:travelled},(_,i)=>from+i+1);
    const paydays=crossed.filter(i=>PAYDAYS.has(i)).length;
    if(paydays){applyChange(p,{cash:paydays*p.pay});log(p,'Payday!',`You earned ${money(paydays*p.pay)} in simulated wages.`);}
    game.pending=[];
    for(const i of crossed){if(MILESTONES.has(i))game.pending.push(JSON.parse(JSON.stringify(MILESTONE_EVENTS[i])));}
    if(to!==BOARD_LENGTH-1 && !MILESTONES.has(to)){const cellKind=getCellKind(to);game.pending.push(makeScenario(p,cellKind==='payday'?'money':cellKind));}
    game.phase='decision';
    if(game.pending.length===0)finishTurn();else commit();
    $('wheelHub').textContent=String(value);
  }
  function chooseOption(index){
    if(!game||game.phase!=='decision'||!game.pending.length)return;
    const p=current(),event=game.pending[0],choice=event.options[index];
    if(!choice)return;
    applyChange(p,choice.changes);
    log(p,event.title,choice.title+': '+choice.desc);
    game.pending.shift();
    if(game.pending.length===0)finishTurn();else commit();
  }
  function finishTurn(){
    const p=current();
    if(p.position===BOARD_LENGTH-1){p.retired=true;log(p,'Retirement reached',`Finished with net worth ${money(netWorth(p))} and life-balance score ${score(p)}.`);}
    if(game.players.every(q=>q.retired)){game.phase='final';commit();resultView();return;}
    game.phase='handoff';commit();
  }
  function nextTurn(){
    if(!game||game.phase!=='handoff')return;
    let idx=game.current;
    for(let i=0;i<game.players.length;i++){
      idx=(idx+1)%game.players.length;
      if(!game.players[idx].retired)break;
    }
    game.current=idx;game.phase='ready';commit();
  }
  function effectBadges(e){
    return Object.entries(e||{}).filter(([k,v])=>v!==0&&k!=='home').map(([k,v])=>{
      const desc=({cash:'cash',savings:'saved',debt:'debt',equity:'home value',happiness:'wellbeing',community:'community',skills:'skills',pay:'payday',dependents:'responsibility'}[k]||k);
      const val=(['cash','savings','debt','equity','pay'].includes(k)?money(Math.abs(v)):Math.abs(v));
      const isBad=(k==='debt'&&v>0)||(k==='cash'&&v<0)||(k==='pay'&&v<0)||(k==='happiness'&&v<0);
      return `<span class="effect-tag ${isBad?'neg':''}">${v>=0?'+':'−'}${val} ${desc}</span>`;
    }).join('');
  }
  function render(){
    drawBoard();
    const p=current();
    const playable=!!game;
    $('exportBtn').disabled=!playable;
    $('spinBtn').disabled=!playable||game.phase!=='ready';
    $('spinBtn').textContent=game?.phase==='moving'?'Spinning…':'Spin & move';
    $('playerStrip').innerHTML=playable?game.players.map((q,i)=>`<div class="player-tile ${game.current===i?'active':''} ${q.retired?'retired':''}" title="${htmlSafe(q.name)}"><div class="pawn-swatch" style="--pawn:${q.color}"></div><div class="player-details"><div class="player-name">${htmlSafe(q.name)} ${q.retired?'✓':''}</div><div class="player-sub">Space ${q.position}/53 · ${money(q.cash)}</div></div></div>`).join(''):'<div class="player-tile"><div class="player-details"><div class="player-name">Start a new journey</div><div class="player-sub">1–4 players</div></div></div>';
    $('phaseBadge').textContent=!playable?'Ready for adventure':game.phase==='final'?'Journey complete':`${game.players.filter(q=>q.retired).length} retired · ${game.players.length} total`;
    $('mapProgress').textContent=p?`SPACE ${p.position} / 53`:'0 / 53 SPACES';
    $('turnChip').textContent=!playable?'SETUP':game.phase==='ready'?'READY':game.phase==='decision'?'CHOOSE':game.phase==='handoff'?'NEXT PLAYER':game.phase==='moving'?'MOVING':game.phase==='final'?'COMPLETE':'SETUP';
    $('turnLabel').textContent=p?`${htmlSafe(p.name).toUpperCase()} · CHAPTER ${p.turns+1}`:'YOUR NEXT CHAPTER';
    $('decisionArea').innerHTML='';
    $('handoffArea').hidden=true;
    const wheelShown=playable&&['ready','moving'].includes(game.phase);
    $('wheelArea').style.display=wheelShown?'flex':'none';
    if(!playable){$('actionTitle').textContent='Your story begins here';$('actionDescription').textContent='Choose players to begin. Each choice changes your future.';}
    else if(wheelShown){$('actionTitle').textContent=game.phase==='moving'?'Moving along the trail…':p.name==='You'?'Your turn!':`It's ${p.name}'s turn!`;
      $('actionDescription').textContent='Spin 1–6 spaces, handle expenses and paydays, then decide what to do with the opportunities ahead.';
      $('wheelHint').textContent=game.phase==='moving'?'Finding your next chapter…':`Simulated living cost this turn: ${money(livingCost(p))}.`;}
    else if(game.phase==='decision'){
      const e=game.pending[0];
      $('actionTitle').textContent=e?.title||'Make a decision';$('actionDescription').textContent='Every choice has trade-offs. What works for your goals?';
      $('decisionArea').innerHTML=`<div class="decision-label">${KIND_NAMES[e.kind]||'Life decision'} · Space ${p.position}</div><p class="decision-description">${htmlSafe(e.text)}</p>${e.options.map((o,i)=>`<button type="button" class="choice-card" data-option="${i}"><span class="choice-title">${htmlSafe(o.title)}</span><span class="choice-sub">${htmlSafe(o.desc)}</span><span class="effect-tags">${effectBadges(o.changes)}</span></button>`).join('')}`;
      document.querySelectorAll('[data-option]').forEach(b=>b.onclick=()=>chooseOption(+b.dataset.option));
    }else if(game.phase==='handoff'){
      $('actionTitle').textContent=p.retired?'Journey complete!':'Chapter complete!';
      $('actionDescription').textContent=p.retired?`${p.name} has reached retirement. Other players can finish their journeys.`:'Your decisions are saved. Pass the device to the next player when ready.';
      const next=game.players.find((q,i)=>i!==game.current&&!q.retired)||p;
      $('handoffArea').hidden=false;
      $('handoffArea').innerHTML=`<p>${game.players.length>1?`Next up: <strong>${htmlSafe(next.name)}</strong>`:'Ready for another spin?'}</p><button type="button" class="primary-btn" id="nextTurnBtn">${game.players.length>1?'Next player':'Continue journey'}</button>`;
      $('nextTurnBtn').onclick=nextTurn;
    }else if(game.phase==='final'){
      $('actionTitle').textContent='Every journey has a story';
      $('actionDescription').textContent='Everyone reached retirement. Compare outcomes and see how the choices added up.';
      $('handoffArea').hidden=false;
      $('handoffArea').innerHTML=`<button class="primary-btn" type="button" id="seeResultsBtn">See final results</button>`;
      $('seeResultsBtn').onclick=resultView;
    }else{
      $('actionTitle').textContent='Get ready to begin';$('actionDescription').textContent='Make your starting education and career choices.';
    }
    const display=p;
    $('careerBadge').textContent=display?.career?JOBS.find(j=>j.id===display.career)?.name||'Career':'No career yet';
    $('moneyDashboard').innerHTML=display?[
      {name:'Cash on hand',amount:money(display.cash)}, {name:'Savings',amount:money(display.savings)},
      {name:'Total debt',amount:money(display.debt),debt:true}, {name:'Net worth',amount:money(netWorth(display)),debt:netWorth(display)<0}
    ].map(o=>`<div class="money-cell ${o.debt?'debt':''}"><div class="money-label">${o.name}</div><div class="money-amount">${o.amount}</div></div>`).join(''):'<p class="history-empty">Your financial dashboard appears here when the journey starts.</p>';
    $('statMeters').innerHTML=display?[
      ['Wellbeing',display.happiness,100,'#ec8c63'],['Community impact',display.community,35,'#3d9e7a'],['Skills learned',display.skills,28,'#678ec9']
    ].map(([name,v,max,c])=>`<div class="meter"><div class="meter-top"><span>${name}</span><span>${v} / ${max}</span></div><div class="meter-track"><div class="meter-fill" style="width:${v/max*100}%;background:${c}"></div></div></div>`).join(''):'<p class="history-empty">Choices will change your wellbeing, community impact, and learning.</p>';
    $('dashNote').textContent=display?`Career payday: ${money(display.pay)} · Living costs: ${money(livingCost(display))} per turn · Home: ${display.home==='owner'?'owner':'renter'}`:'All costs and earnings are simplified and fictional.';
    $('historyList').innerHTML=display?.journal?.length?display.journal.slice(0,6).map(e=>`<div class="history-item"><strong>${htmlSafe(e.title)}</strong>${htmlSafe(e.description)}</div>`).join(''):'<p class="history-empty">Your choices and events will appear here.</p>';
  }

  function resultView(){
    if(!game||game.phase!=='final')return;
    overlayView='results';
    const ranking=[...game.players].sort((a,b)=>score(b)-score(a));const maxScore=Math.max(1,...ranking.map(score));
    const rows=ranking.map((p,i)=>`<div class="result-card ${i===0?'winner':''}"><div class="row"><strong>${i===0?'🏆 ':''}${i+1}. ${htmlSafe(p.name)}</strong><strong>${score(p)} pts</strong></div><div class="result-metrics"><span>Net worth: ${money(netWorth(p))}</span><span>Wellbeing: ${p.happiness}/100</span><span>Community: ${p.community}</span><span>Skills: ${p.skills}</span></div><div class="result-bar"><div style="width:${score(p)/maxScore*100}%;background:${p.color}"></div></div></div>`).join('');
    setModal('RETIREMENT · THE STORY YOU BUILT','Your journey, your choices',
      'There is no single correct way to live. The game rewards financial security, wellbeing, learning, and community—not just cash.',
      rows+`<div class="notice-box"><strong>Life-balance score:</strong> Net worth / 450 (minimum 0) + wellbeing × 2 + community × 9 + skills × 12. All figures and rules are fictional for classroom learning.</div>`,
      '<button class="primary-btn" id="resultExport" type="button">Download results CSV</button><button class="secondary-btn" id="resultClose" type="button">View board</button><button class="secondary-btn" id="againBtn" type="button">Play again</button>');
    $('resultExport').onclick=exportResults;
    $('resultClose').onclick=hideModal;
    $('againBtn').onclick=()=>setupView(game);
  }
  function exportBackup(){if(!game)return;download('valley-life-journey-backup.json',JSON.stringify(game,null,2),'application/json');}
  function exportResults(){if(!game)return;const cols=['Name','Career','Starting path','Cash','Savings','Debt','Home equity','Net worth','Wellbeing','Community','Skills','Turns','Life balance score'];
    const data=game.players.map(p=>[p.name,JOBS.find(j=>j.id===p.career)?.name||'',p.path,p.cash,p.savings,p.debt,p.equity,netWorth(p),p.happiness,p.community,p.skills,p.turns,score(p)]);
    const csv=[cols,...data].map(row=>row.map(v=>`"${String(v??'').replace(/"/g,'""')}"`).join(',')).join('\r\n');download('valley-life-journey-results.csv',csv,'text/csv;charset=utf-8');}
  function download(name,contents,mime){const b=new Blob([contents],{type:mime}),url=URL.createObjectURL(b),a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),2000);}
  function rulesView(){
    overlayView='rules';
    setModal('THE RULEBOOK · NO REAL MONEY INVOLVED','How to play Valley Life Journey',
      'An original educational board game for 1–4 local players.',
      `<div class="rules-list"><p><strong>1. Choose your starting path and career.</strong> Training adds learning and debt; beginning work adds cash. Careers offer fictional paydays.</p>
      <p><strong>2. Spin the wheel.</strong> Move 1–6 spaces. Each spin includes everyday living costs, and crossing a payday space pays your simulated salary.</p>
      <p><strong>3. Make choices.</strong> When you reach opportunity, money, community, wellness, or surprise spaces, choose how to respond. Major milestones happen to every player who passes them.</p>
      <p><strong>4. Manage trade-offs.</strong> Cash can become debt if you spend beyond your balance. Savings are separate from spending cash; buying a home adds equity and a mortgage.</p>
      <p><strong>5. Reach retirement.</strong> Everyone finishes at space 53. Scores combine net worth, wellbeing, community contribution, and skills. The strongest balance wins.</p>
      <p><strong>6. Save your progress.</strong> The game saves in this browser profile. Use Save backup to move to another device or protect your progress.</p>
      <div class="notice-box">Game concepts are simplified and fictional. Outcomes do not represent real salaries, lending rules, cost of living, or personal-finance advice. Different family and work paths are equally valid choices.</div></div>`,
      '<button type="button" class="primary-btn" id="rulesClose">Got it!</button>');
    $('rulesClose').onclick=()=>{hideModal();if(!game)setupView(null);else if(game.phase==='path')pathView();else if(game.phase==='career')careerView();else if(game.phase==='final')resultView();};
  }
  function init(){
    $('spinBtn').onclick=spin;
    $('newGameBtn').onclick=()=>setupView(game);
    $('exportBtn').onclick=exportBackup;
    $('rulesBtn').onclick=rulesView;
    game=readStore();
    if(game?.phase==='moving')game.phase='ready';
    render();
    setupView(game);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
