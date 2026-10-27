/* VALLEY LIFE JOURNEY · An original life-skills board adventure
   Fictional economics and scenarios for classroom play.
   No external libraries, logins, trackers, or network requests.
*/
(() => {
  'use strict';
  const SAVE_KEY = 'naches-valley-life-journey-v1';
  const BOARD_LENGTH = 90;
  const QUICK_LENGTH = 50;
  const CONFIGS = {
    full:{length:90,milestones:[10,26,45,64,82,87],paydays:[7,17,24,31,40,48,56,63,72,80,86],branches:[[14,22],[33,41],[55,63],[73,81]]},
    quick:{length:50,milestones:[6,16,26,36,47],paydays:[5,12,19,25,32,39,46],branches:[[9,14],[19,24],[30,35],[40,45]]}
  };
  const conf = () => CONFIGS[game?.mode==='quick'?'quick':'full'];
  const boardLength = () => conf().length;
  const mileSet = () => new Set(conf().milestones);
  const paySet = () => new Set(conf().paydays);
  const branchAt = n => conf().branches.find(([a,b])=>n>a&&n<b);
  const branchStart = n => conf().branches.find(([a])=>a===n);
  const BRANCH_DESCS = [
    {title:'Naches Crossroads',a:'Orchard Lane',b:'River Road',desc:'Take a working orchard road or explore the river corridor.',aKind:'money',bKind:'wellbeing'},
    {title:'Tieton Decisions',a:'Trade & Enterprise',b:'Learning & Community',desc:'Invest your time in business experience or in people and learning.',aKind:'opportunity',bKind:'learning'},
    {title:'Cascades Crossroads',a:'White Pass Adventure',b:'Oak Creek Wildlife',desc:'Choose a mountain outing or contribute to habitat stewardship.',aKind:'surprise',bKind:'community'},
    {title:'The Future Road',a:'Career & Savings',b:'Family & Community',desc:'Your priorities shape the experiences ahead.',aKind:'money',bKind:'community'}
  ];
  const COLORS = ['#f38a4f', '#36a8bd', '#a575c3', '#75ae57'];
  const NAMES = ['You', 'Player 2', 'Player 3', 'Player 4'];
  const AI_PROFILES = [
    {id:'careful',name:'Careful Casey',icon:'🛡️',short:'Careful',description:'Keeps cash reserves and avoids borrowing.',weights:{cash:1.25,savings:1.25,debt:1.65,equity:.85,happiness:.50,community:.75,skills:.75,pay:1.1},risk:-2.0,path:'earn',career:'electrician'},
    {id:'risky',name:'Risky Riley',icon:'🎲',short:'Bold',description:'Takes chances for potential wealth and excitement.',weights:{cash:1.25,savings:.42,debt:.38,equity:1.12,happiness:1.25,community:.40,skills:.65,pay:1.4},risk:1.9,path:'train',career:'coder'},
    {id:'balanced',name:'Balanced Bailey',icon:'⚖️',short:'Balanced',description:'Values money, relationships, and wellbeing.',weights:{cash:1,savings:1,debt:1,equity:1,happiness:1.25,community:1.25,skills:1.05,pay:.9},risk:0,path:'train',career:'nurse'},
    {id:'ambitious',name:'Ambitious Alex',icon:'🚀',short:'Ambitious',description:'Invests in education, income, and career development.',weights:{cash:1.05,savings:1.0,debt:.9,equity:1,happiness:.55,community:.50,skills:2.0,pay:2.1},risk:.5,path:'train',career:'coder'},
    {id:'adventure',name:'Adventurous Avery',icon:'🌎',short:'Adventurous',description:'Prioritizes experiences, friendships, and happiness.',weights:{cash:.45,savings:.35,debt:.75,equity:.40,happiness:2.1,community:1.5,skills:.9,pay:.35},risk:1.0,path:'earn',career:'ranger'}
  ];
  const getAIProfile = p => AI_PROFILES.find(a=>a.id===p?.botProfile) || AI_PROFILES[2];
  const isBot = p => !!p?.isBot;
  const AI_DELAYS = {slow:1700,normal:720,fast:140};
  const GARAGE = [{id:'car',name:'Compact Car',label:'🚗',unlock:0},{id:'truck',name:'Pickup Truck',label:'🛻',unlock:0},
    {id:'van',name:'Family Van',label:'🚐',unlock:0},{id:'sport',name:'Sporty Coupe',label:'🏎️',unlock:0},
    {id:'camper',name:'Adventure Camper',label:'🚙',unlock:2},{id:'electric',name:'Electric Explorer',label:'⚡',unlock:4}];
  const MONEY = new Intl.NumberFormat('en-US', { style:'currency', currency:'USD', maximumFractionDigits:0 });
  const $ = id => document.getElementById(id);
  const htmlSafe = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const clip = (v, min, max) => Math.max(min, Math.min(max, v));
  const money = n => MONEY.format(Math.round(n || 0));
  const rand = n => Math.floor(Math.random() * n);
  const PALETTE = {
    rest:'#bfd5c5', start:'#e9b24b', opportunity:'#25849e', money:'#df974c', surprise:'#a46aad',
    community:'#4d976e', wellbeing:'#e07f70', learning:'#537aab', payday:'#33aa83', milestone:'#efc452', end:'#f0b953'
  };
  const ICONS = {rest:'·',start:'GO', opportunity:'✧', money:'$', surprise:'?', community:'♥', wellbeing:'+', learning:'✎', payday:'PAY', milestone:'★', end:'END'};
  const KIND_NAMES = {rest:'Quiet stretch',route:'Choose a road',opportunity:'Opportunity', money:'Money decision', surprise:'Life surprise', community:'Community', wellbeing:'Wellbeing', learning:'Learning', payday:'Payday',milestone:'Major milestone'};
  const JOBS = [
    {id:'teacher',name:'Teacher',icon:'📚',pay:3900,detail:'Help people learn, lead, and grow.'},
    {id:'electrician',name:'Electrician',icon:'⚡',pay:4650,detail:'Install and maintain useful technology.'},
    {id:'nurse',name:'Nurse',icon:'🩺',pay:4900,detail:'Care for people in many settings.'},
    {id:'designer',name:'Graphic Designer',icon:'🎨',pay:4000,detail:'Solve problems using creative communication.'},
    {id:'coder',name:'Software Developer',icon:'💻',pay:5200,detail:'Build tools and applications.'},
    {id:'chef',name:'Chef',icon:'🍳',pay:3650,detail:'Plan and prepare food for others.'},
    {id:'ranger',name:'Park Ranger',icon:'🌲',pay:3850,detail:'Care for public lands and visitors.'},
    {id:'technician',name:'Medical Technician',icon:'🔬',pay:4400,detail:'Support medical testing and patient care.'},
    {id:'orchard',name:'Orchard Manager',icon:'🍎',pay:4100,detail:'Coordinate harvests, crews, and sustainable growing.'},
    {id:'mechanic',name:'Automotive Mechanic',icon:'🔧',pay:4250,detail:'Diagnose and repair vehicles and equipment.'},
    {id:'firefighter',name:'Firefighter',icon:'🚒',pay:4500,detail:'Protect and help communities during emergencies.'},
    {id:'carpenter',name:'Carpenter',icon:'🪚',pay:4200,detail:'Build and maintain structures.'},
    {id:'veterinarian',name:'Veterinary Technician',icon:'🐾',pay:3850,detail:'Help care for animals.'},
    {id:'business',name:'Small Business Owner',icon:'🏪',pay:4150,detail:'Manage customers, budgets, and a local venture.'},
    {id:'farmer',name:'Agriculture Specialist',icon:'🌾',pay:4350,detail:'Work with crops, water, and agricultural technology.'},
    {id:'emt',name:'Emergency Medical Responder',icon:'🚑',pay:3800,detail:'Support people in urgent situations.'},
    {id:'plumber',name:'Plumber',icon:'🚰',pay:4450,detail:'Build and maintain water and pipe systems.'},
    {id:'accountant',name:'Accountant',icon:'📊',pay:4600,detail:'Help people and businesses understand their finances.'}
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
  const LOCAL_SCENARIOS = [
    {id:'naches-depot',kind:'learning',title:'Naches Historic Depot',text:'The restored depot visitor center inspires a community-history project.',options:[opt('Document local stories','Create an interview and photo collection.',{skills:2,community:2}),opt('Visit and explore','Learn about the valley with friends.',{happiness:4,skills:1})]},
    {id:'sportsmans-day',kind:'community',title:'Sportsman’s Days Celebration',text:'The community festival needs helpers.',options:[opt('Help run an activity','Volunteer and meet neighbors.',{community:3,happiness:3}),opt('Try a small vendor booth','Practice budgeting for a local sale.',{cash:650,skills:1,happiness:1})]},
    {id:'naches-library',kind:'learning',title:'Naches Library Day',text:'A local event offers free learning resources.',options:[opt('Attend a workshop','Develop useful skills.',{skills:2,community:1}),opt('Organize a reading event','Bring people together.',{community:3,happiness:3})]},
    {id:'applewood-park',kind:'wellbeing',title:'Applewood Park Afternoon',text:'A quiet afternoon in town offers an opportunity to recharge.',options:[opt('Take a relaxing walk','A low-cost break improves wellbeing.',{happiness:6}),opt('Plan a group picnic','Bring friends together.',{cash:-180,happiness:7,community:1})]},
    {id:'clemans-view',kind:'wellbeing',title:'Cleman’s View Park',text:'A local park offers space for an outdoor gathering.',options:[opt('Explore on foot','Get outside for an inexpensive activity.',{happiness:6}),opt('Host a community activity','Bring neighbors together.',{cash:-250,community:3,happiness:3})]},
    {id:'orchard-harvest',kind:'opportunity',title:'Orchard Harvest Season',text:'A nearby fruit grower needs extra help during a busy season.',options:[opt('Take short-term work','Earn simulated extra money and practical experience.',{cash:1150,skills:1,happiness:-2}),opt('Help with a community gleaning event','Support food access.',{community:4,happiness:4})]},
    {id:'farm-market',kind:'money',title:'Farm Stand Budget',text:'A farm stand offers seasonal produce.',options:[opt('Plan a week of meals','Save with careful shopping.',{cash:350,skills:2}),opt('Support several vendors','Enjoy a community market.',{cash:-250,happiness:5,community:1})]},
    {id:'irrigation',kind:'surprise',title:'Irrigation Repair',text:'An unexpected plumbing repair affects a small property.',options:[opt('Do safe basic maintenance','Pay for parts and learn skills.',{cash:-430,skills:2}),opt('Hire a specialist','Handle the job professionally.',{cash:-1000,happiness:1})]},
    {id:'river-ride',kind:'wellbeing',title:'Naches River Greenway',text:'A bicycle outing is a good chance to recharge.',options:[opt('Take a free ride','Build a healthy habit.',{happiness:7}),opt('Organize a group ride','Share the experience.',{community:2,happiness:6})]},
    {id:'tieton-art',kind:'learning',title:'Tieton Art Project',text:'A local art project needs creative volunteers.',options:[opt('Design a poster','Build design skills.',{skills:3,community:1}),opt('Help organize supplies','Practice planning and budgeting.',{cash:-140,skills:2,community:2})]},
    {id:'tieton-river',kind:'surprise',title:'Tieton River Trail Day',text:'A scenic trail day requires planning for conditions and supplies.',options:[opt('Pack and plan ahead','Prepare responsibly for outdoor recreation.',{cash:-100,skills:2,happiness:5}),opt('Join a guided group','Spend more for shared expertise.',{cash:-400,happiness:7,community:1})]},
    {id:'yakima-commute',kind:'money',title:'Yakima Commute',text:'Travel costs affect your household budget.',options:[opt('Carpool and plan trips','Reduce simulated transportation costs.',{cash:400,community:1}),opt('Drive alone more often','More flexibility at a cost.',{cash:-600,happiness:1})]},
    {id:'yakima-training',kind:'learning',title:'Yakima Skills Workshop',text:'A nearby career workshop offers another pathway into skilled work.',options:[opt('Attend the workshop','Spend time building expertise.',{cash:-450,skills:3,pay:100}),opt('Learn from a mentor','Build knowledge and connections.',{skills:2,community:2})]},
    {id:'cowiche-trails',kind:'wellbeing',title:'Cowiche Canyon Walk',text:'An outdoor walk provides a break from work.',options:[opt('Enjoy a free outing','Spend time outside.',{happiness:7}),opt('Join a trail work day','Volunteer for local trails.',{community:3,skills:1,happiness:4})]},
    {id:'oak-elk',kind:'community',title:'Oak Creek Elk Viewing',text:'Learn about wildlife habitat and seasonal viewing etiquette.',options:[opt('Observe respectfully','Enjoy a low-cost day of learning.',{skills:1,happiness:6}),opt('Support habitat stewardship','Give time to a local conservation effort.',{community:3,happiness:3})]},
    {id:'oak-conditions',kind:'learning',title:'Wildlife Area Etiquette',text:'Seasonal restrictions help protect wintering wildlife.',options:[opt('Check conditions and plan access','Learn safe and respectful recreation.',{skills:3,happiness:2}),opt('Choose a different accessible trail','Make a flexible plan.',{skills:1,happiness:5})]},
    {id:'rimrock-trip',kind:'surprise',title:'Rimrock Lake Weekend',text:'A lake trip has transportation and supply costs.',options:[opt('Plan a low-cost picnic','Enjoy the day and stay on budget.',{cash:-240,happiness:7}),opt('Rent outdoor equipment','Spend more for a new experience.',{cash:-800,happiness:11})]},
    {id:'whitepass-snow',kind:'money',title:'White Pass Winter Plans',text:'A winter trip offers choices for spending and recreation.',options:[opt('Try an inexpensive snow outing','Plan for warm layers and simple fun.',{cash:-250,happiness:6}),opt('Budget for skiing','Spend more for an organized adventure.',{cash:-1150,happiness:12})]},
    {id:'trail-volunteer',kind:'community',title:'Cascades Trail Crew',text:'A volunteer group is caring for a public trail.',options:[opt('Volunteer a morning','Help keep trails in good shape.',{community:4,happiness:3}),opt('Contribute supplies','Support the work financially.',{cash:-450,community:3})]},
    {id:'winter-tires',kind:'surprise',title:'Mountain Road Preparation',text:'Cold-weather travel means checking your vehicle and routes.',options:[opt('Prepare before traveling','Spend on prevention and build knowledge.',{cash:-400,skills:2}),opt('Choose a closer activity','Save money and change plans.',{happiness:4})]},
    {id:'selah-event',kind:'community',title:'Nearby Community Event',text:'A nearby town organizes a community fundraiser.',options:[opt('Volunteer with friends','Meet others and contribute.',{community:3,happiness:4}),opt('Support the fundraiser','Give within your means.',{cash:-300,community:3})]},
    {id:'local-contract',kind:'opportunity',title:'Local Contract Opportunity',text:'A small valley business needs help on a project.',options:[opt('Take the project','Earn a short-term bonus.',{cash:1250,skills:1,happiness:-2}),opt('Recommend a neighbor','Build relationships and community trust.',{community:3,happiness:3})]},
    {id:'home-weather',kind:'money',title:'Weatherproofing Your Home',text:'A change in the season reminds you to reduce energy costs.',options:[opt('Invest in small improvements','Spend now to practice energy efficiency.',{cash:-450,skills:2}),opt('Start an emergency fund','Move money into savings.',{cash:-600,savings:600})]},
    {id:'school-mentor',kind:'community',title:'Naches Valley Mentoring',text:'A younger student benefits from a mentor.',options:[opt('Volunteer regularly','Support the next generation.',{community:4,happiness:3}),opt('Sponsor supplies','Help with essential materials.',{cash:-300,community:2})]},
    {id:'river-cleanup',kind:'community',title:'Naches River Cleanup',text:'A group organizes a litter cleanup near a public access area.',options:[opt('Join the cleanup','Give time to the community.',{community:4,skills:1}),opt('Provide refreshments','Offer support through the budget.',{cash:-180,community:3})]},
    {id:'rainy-festival',kind:'surprise',title:'Rain on Festival Weekend',text:'Outdoor plans change with the weather.',options:[opt('Adapt the event plan','Practice flexible problem-solving.',{skills:2,community:1}),opt('Plan an indoor activity','Find another way to enjoy the day.',{cash:-220,happiness:5})]}
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
  const DEFAULT_KINDS = ['opportunity','money','learning','community','surprise','wellbeing','rest','opportunity','money','rest'];
  function cells(){
    const c=conf(), milestones=mileSet(), paydays=paySet();
    return Array.from({length:c.length},(_,i)=>{
      const kind=i===0?'start':i===c.length-1?'end':milestones.has(i)?'milestone':paydays.has(i)?'payday':c.branches.some(([a])=>a===i)?'route':DEFAULT_KINDS[(i*11+Math.floor(i/5)*3)%DEFAULT_KINDS.length];
      const milestoneIndex=c.milestones.indexOf(i);
      return {index:i,kind,label:i===0?'START':i===c.length-1?'RETIRE':kind==='milestone'?(['HOME','PEOPLE','CAREER','FUTURE','LEGACY','FINISH'][milestoneIndex]):kind==='payday'?'PAY':kind==='route'?'FORK':String(i)};
    });
  }
  function routeId(p,start){return p?.routes?.[start]||'a';}
  function cellKind(i,p){
    const c=cells()[i];if(!c)return 'rest';
    const br=branchAt(i);
    if(br && !['milestone','payday','end'].includes(c.kind)){
      const info=BRANCH_DESCS[conf().branches.indexOf(br)];
      if(i===br[0]+1||i===br[1]-1)return routeId(p,br[0])==='b'?info.bKind:info.aKind;
    }
    return c.kind;
  }
  function milestoneEvent(i){
    const all=[MILESTONE_EVENTS[11],MILESTONE_EVENTS[22],MILESTONE_EVENTS[33],MILESTONE_EVENTS[44],
      {id:'legacy',kind:'milestone',title:'What legacy will you build?',text:'You are nearing the end of the journey. Consider the impact of the choices you have made.',options:[opt('Create a community project','Support people around you.',{cash:-850,community:5,happiness:5}),opt('Build a stronger nest egg','Set aside money for the future.',{cash:-1300,savings:1300,skills:1}),opt('Pass on your knowledge','Mentor and teach others.',{community:3,skills:2,happiness:3})]},
      {id:'finalplans',kind:'milestone',title:'Getting ready for retirement',text:'Make one more choice about the years ahead.',options:[opt('Simplify expenses','Spend on improvements that support a simpler lifestyle.',{cash:-500,happiness:5}),opt('Support a cause','Help something you value.',{cash:-800,community:5}),opt('Improve your finances','Put money toward remaining debt.',{cash:-1000,debt:-1000,skills:1})]}
    ];
    return structuredClone(all[Math.min(conf().milestones.indexOf(i),all.length-1)]);
  }
  function routeEvent(start){
    const idx=conf().branches.findIndex(x=>x[0]===start), info=BRANCH_DESCS[idx];
    return {id:'route'+start,kind:'route',routeStart:start,title:info.title,text:info.desc,options:[
      {...opt(info.a,`Take the ${info.a.toLowerCase()} path. You'll visit a different series of spaces.`,idx===0?{cash:350,skills:1}:idx===1?{skills:2}:idx===2?{happiness:4}:{savings:400,cash:-400}),route:'a'},
      {...opt(info.b,`Take the ${info.b.toLowerCase()} path. You'll experience other opportunities.`,idx===0?{happiness:4}:idx===1?{community:2}:idx===2?{community:2,skills:1}:{community:2,happiness:3}),route:'b'}]};
  }

  let game = null;
  let spinAngle = 0;
  let spinTimer = null;
  let toastTimer = null;
  let overlayView = null;
  let aiTimer = null;
  let aiSkip = false;
  let aiHeadline = 'Computer turns happen automatically.';
  let aiLastSummary = '';
  const clearAITimer = () => { if(aiTimer !== null){ clearTimeout(aiTimer);aiTimer=null; } };
  const aiDelay = () => AI_DELAYS[game?.aiSpeed] ?? AI_DELAYS.normal;

  function makePlayer(name, idx, botProfile=null) {
    return {id:`p${idx}`,name:name.trim().slice(0,25)||`Player ${idx+1}`,isBot:!!botProfile,botProfile:botProfile||null,color:COLORS[idx],vehicle:'car',routes:{},position:0,turns:0,
      cash:12000,savings:0,debt:0,equity:0,happiness:66,community:0,skills:0,
      pay:0,career:null,path:null,investNumber:null,home:'rent',dependents:0,retired:false,used:[],
      journal:[]};
  }
  const current = () => game?.players?.[game.current] || null;
  const netWorth = p => p.cash + p.savings + p.equity - p.debt;
  function score(p){return Math.max(0,Math.round(netWorth(p)/450)) + p.happiness*2 + p.community*9 + p.skills*12;}
  function store(){try{if(game)localStorage.setItem(SAVE_KEY,JSON.stringify(game));}catch(err){showToast('Browser storage is unavailable; export a backup.');}}
  function readStore(){try{const s=JSON.parse(localStorage.getItem(SAVE_KEY)||'null');return validGame(s)?s:null;}catch{return null;}}
  function validGame(s){return !!(s && s.version===1 && Array.isArray(s.players) && s.players.length>=1 && s.players.length<=4 &&
    s.players.every(p=>typeof p.name==='string'&&p.name.length<=25&&Number.isFinite(p.cash)&&Number.isFinite(p.position)&&p.position>=0&&p.position<(s.mode==='quick'?QUICK_LENGTH:BOARD_LENGTH))&&
    Number.isInteger(s.current)&&s.current>=0&&s.current<s.players.length&&typeof s.phase==='string'&&Array.isArray(s.pending));}
  function commit(){store();render();scheduleAI();}
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
  function hideModal(){overlayView=null;$('modal').hidden=true;scheduleAI();}

  function setupView(saved){
    clearAITimer();
    overlayView='setup';
    const choices=AI_PROFILES.map((a,i)=>`<option value="${a.id}">${a.icon} ${a.name} · ${a.short}</option>`).join('');
    const body=`<div class="setup-form">
      <div class="setup-intro"><strong>Recommended: You versus 3 computer rivals</strong><span>Play solo against personalities who make different life choices. Or invite friends for pass-and-play.</span></div>
      <div class="setup-columns"><label class="field-label">Human players
        <select id="playerCount"><option value="1" selected>1 person</option><option value="2">2 people</option><option value="3">3 people</option><option value="4">4 people</option></select></label>
        <label class="field-label">Computer opponents
        <select id="botCount"><option value="0">None</option><option value="1">1 computer</option><option value="2">2 computers</option><option value="3" selected>3 computers</option></select></label></div>
      <div class="setup-columns"><label class="field-label">Journey length<select id="journeyMode"><option value="full" selected>Full Journey · 90 spaces</option><option value="quick">Quick Journey · 50 spaces</option></select></label><label class="field-label">Your vehicle<select id="playerVehicle"><option value="car">Compact car</option><option value="truck">Pickup truck</option><option value="van">Family van</option><option value="sport">Sporty coupe</option></select></label></div>
      <div class="name-fields">${NAMES.map((n,i)=>`<label class="name-field" data-idx="${i}">${i===0?'Your name':`Player ${i+1}`}<input id="name${i}" maxlength="25" value="${htmlSafe(n)}" autocomplete="off"></label>`).join('')}</div>
      <div id="opponentSetup" class="opponent-setup"><strong>Meet your rivals</strong><span class="setup-muted">Choose personalities (4 total players maximum).</span><div class="bot-picker-grid">${[0,1,2].map((_,i)=>`<label class="field-label bot-field" data-bot-idx="${i}">Computer ${i+1}<select id="profile${i}">${choices}</select></label>`).join('')}</div></div>
      <label class="field-label">Computer turn speed
        <select id="aiSpeedSetup"><option value="normal" selected>Normal · Watch their decisions</option><option value="fast">Fast · Keep the game moving</option><option value="slow">Slow · See every decision</option></select></label>
      <div class="notice-box"><strong>How it works:</strong> Everyone chooses work or training, a career, and spins 1–6 spaces. Computer rivals make their own decisions. A score comparison appears at retirement. All progress stays in this browser unless you export a backup.</div>
      </div>`;
    const bottom=`<button class="primary-btn" id="beginBtn" type="button">Start my journey</button>
      ${saved?'<button class="secondary-btn" id="resumeBtn" type="button">Continue saved journey</button>':''}
      <button class="secondary-btn" id="importBtn" type="button">Import backup</button><input type="file" id="importFile" accept="application/json,.json" hidden>`;
    setModal('NACHES LEARNING HUB · COMPUTER RIVALS EDITION','Choose your competition',
      'Make real decisions about work, money, relationships, and the unexpected. Computer rivals have distinct styles.',body,bottom);
    const toggle=()=>{
      const n=+$('playerCount').value;
      const max=4-n, bSelect=$('botCount');
      if(+bSelect.value>max)bSelect.value=String(max);
      [...bSelect.options].forEach(o=>o.disabled=+o.value>max);
      const b=+$('botCount').value;
      document.querySelectorAll('.name-field').forEach((el,i)=>el.style.display=i<n?'grid':'none');
      $('opponentSetup').hidden=b===0;
      document.querySelectorAll('[data-bot-idx]').forEach((el,i)=>el.hidden=i>=b);
      $('beginBtn').textContent=b?'Start vs computers':'Start local journey';
    };
    $('playerCount').addEventListener('change',toggle);
    $('botCount').addEventListener('change',toggle);
    ['careful','balanced','risky'].forEach((profile,i)=>{ $('profile'+i).value=profile; });
    toggle();
    $('beginBtn').onclick=()=>{
      if(saved&&!confirm('Start a fresh journey? The current saved game will be replaced. Export a backup first if you want to keep it.'))return;
      clearAITimer();
      const n=+$('playerCount').value,b=+$('botCount').value;
      const players=Array.from({length:n},(_,i)=>makePlayer($(`name${i}`).value,i));
      players.forEach((p,i)=>{p.vehicle=i===0?$('playerVehicle').value:['van','car','truck','sport'][i%4];});
      const taken=new Set(players.map(p=>p.name.toLowerCase()));
      for(let i=0;i<b;i++){
        const profile=getAIProfile({botProfile:$('profile'+i).value});
        let name=profile.name;
        if(taken.has(name.toLowerCase()))name+=` ${i+1}`;
        taken.add(name.toLowerCase());
        const bot=makePlayer(name,n+i,profile.id);bot.vehicle=['car','truck','sport','van'][(i+n)%4];players.push(bot);
      }
      game={version:1,mode:$('journeyMode').value,phase:'path',current:0,players,pending:[],lastSpin:null,started:new Date().toISOString(),aiPaused:false,aiSpeed:$('aiSpeedSetup').value};
      aiLastSummary='New journey started. Computer rivals are ready.';
      commit();pathView();
    };
    if(saved)$('resumeBtn').onclick=()=>{
      clearAITimer();game=saved;
      if(game.phase==='moving')game.phase='ready';
      game.mode=game.mode||'full'; game.players.forEach(p=>{p.routes=p.routes||{};p.vehicle=p.vehicle||'car';if(p.investNumber===undefined)p.investNumber=null;});
      game.aiSpeed=game.aiSpeed||'normal';
      hideModal();commit();
      if(game.phase==='path')pathView();if(game.phase==='career')careerView();if(game.phase==='final')resultView();
    };
    $('importBtn').onclick=()=>$('importFile').click();
    $('importFile').onchange=async e=>{const f=e.target.files[0];if(!f)return;try{
      const s=JSON.parse(await f.text());
      if(!validGame(s))throw Error('Not a valid Valley Life Journey backup');
      if(!confirm('Load this backup? It replaces your current saved journey on this browser.'))return;
      clearAITimer();game=s;if(game.phase==='moving')game.phase='ready';game.mode=game.mode||'full';game.players.forEach(p=>{p.routes=p.routes||{};p.vehicle=p.vehicle||'car';if(p.investNumber===undefined)p.investNumber=null;});game.aiSpeed=game.aiSpeed||'normal';
      hideModal();commit();
      if(game.phase==='path')pathView();if(game.phase==='career')careerView();if(game.phase==='final')resultView();
      showToast('Journey restored.');
    }catch(err){alert(`Could not import: ${err.message}`);}};
  }
  function pathView(){
    if(isBot(current())){hideModal();commit();return;}
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
    if(isBot(current())){hideModal();commit();return;}
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

  function getCellKind(i,p=current()){return cellKind(i,p);}
  function boardCoordinates(){
    return cells().map((c,i)=>{const row=Math.floor(i/10), col=i%10;
      return {x:91+(row%2?9-col:col)*112,y:101+row*96+Math.sin(i*1.9)*2};
    });
  }
  const svgPoint=(i,branch=null)=>{
    const p=boardCoordinates()[i];if(!p)return {x:90,y:90};
    const b=branchAt(i);
    if(!b||!branch)return p;
    // Side-by-side roads. Branch A bends above the main road; branch B bends below.
    const progress=(i-b[0])/(b[1]-b[0]);
    const bend=Math.sin(progress*Math.PI);
    return {x:p.x+8*bend*(branch==='a'?1:-1),y:p.y+(branch==='a'?-29:29)*bend};
  };
  function pathCoords(pts){return pts.map((p,i)=>`${i?'L':'M'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ');}
  function sceneSvg(height){
    const mountains=Array.from({length:9},(_,i)=>{const x=i*145-40,y=68+(i%3)*12;return `<path d="M${x} ${y+72} l55 -88 63 88 Z" fill="${i%2?'#b8d7be':'#c9d9cd'}" opacity=".5"/><path d="M${x+44} ${y-1}l11 -15 12 16" fill="#fafaf0"/>`;}).join('');
    const orchards=Array.from({length:21},(_,i)=>{const x=48+(i%7)*43,y=191+Math.floor(i/7)*47;return `<g transform="translate(${x} ${y})"><rect x="-2" y="1" width="4" height="18" fill="#795f47"/><circle cy="-8" r="11" fill="#4f9870"/><circle cx="5" cy="-11" r="3" fill="#d96c4d"/></g>`;}).join('');
    const trees=Array.from({length:24},(_,i)=>{const x=720+(i%8)*54,y=250+Math.floor(i/8)*38;return `<path d="M${x} ${y}l-11 21h22Z" fill="#51896c" opacity=".7"/><path d="M${x} ${y+16}v9" stroke="#537258" stroke-width="3"/>`;}).join('');
    const clouds=`<g class="floating-cloud"><ellipse cx="250" cy="71" rx="39" ry="9" fill="#ffffffa6"/><ellipse cx="600" cy="93" rx="55" ry="12" fill="#ffffffa3"/></g>`;
    const parks=`<g font-size="16" font-weight="800" fill="#345e66"><text x="50" y="47">NACHES VALLEY</text><text x="575" y="47">CASCADE MOUNTAINS</text></g>`;
    const river=`<path d="M-25 ${height*.60} C160 ${height*.47},280 ${height*.83},475 ${height*.60} S820 ${height*.45},1220 ${height*.68}" fill="none" stroke="#91c8d5" opacity=".42" stroke-width="40"/><path d="M-25 ${height*.60} C160 ${height*.47},280 ${height*.83},475 ${height*.60} S820 ${height*.45},1220 ${height*.68}" fill="none" stroke="#b8e6ed" opacity=".7" stroke-width="14"/>`;
    const deco=`<g class="scene-art">
      <g transform="translate(120 226)"><path d="M-38 13v-35l39 -25 38 25v35Z" fill="#dcad74" stroke="#94694a" stroke-width="3"/><rect x="-12" y="-17" width="25" height="30" fill="#6f9fa3"/><text x="0" y="37" text-anchor="middle">HISTORIC DEPOT</text></g>
      <g transform="translate(892 265)"><path d="M-28 23v-42h56v42Z" fill="#bc7760"/><path d="M-36 -19l36 -33 36 33Z" fill="#6b8a6a"/><text x="0" y="44" text-anchor="middle">MOUNTAIN CABIN</text></g>
      <g transform="translate(360 ${Math.round(height*.79)})"><ellipse rx="65" ry="20" fill="#a9c9a4"/><path d="M-37 0l12 -23 18 23 15 -16 16 16" fill="none" stroke="#587e65" stroke-width="6"/><text y="40" text-anchor="middle">NACHES RIVER</text></g>
      <g transform="translate(770 ${Math.round(height*.77)})"><path d="M-28 10L0 -35 29 10Z" fill="#a5bcc5"/><path d="M-10 -19L0 -35 11 -18Z" fill="#fff"/><text y="33" text-anchor="middle">WHITE PASS</text></g>
      <g transform="translate(1010 ${Math.round(height*.54)})"><text text-anchor="middle" font-size="24">🦌</text><text y="18" text-anchor="middle">OAK CREEK</text></g>
    </g>`;
    return `<defs><linearGradient id="ground" x2=".3" y2="1"><stop stop-color="#e8f3df"/><stop offset=".55" stop-color="#ffefd0"/><stop offset="1" stop-color="#daead5"/></linearGradient><filter id="shadow"><feDropShadow dx="0" dy="3" stdDeviation="2" flood-opacity=".25"/></filter></defs><rect width="1200" height="${height}" fill="url(#ground)"/>${mountains}${river}${clouds}${orchards}${trees}${parks}${deco}`;
  }
  function roadStroke(path,style='main'){
    if(!path)return '';
    const edge=style==='a'?'#90a88c':style==='b'?'#c9a482':'#b6ad8e';
    const core=style==='a'?'#d3eacb':style==='b'?'#ffe2bc':'#f9ead2';
    return `<path d="${path}" stroke="${edge}" stroke-width="41" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="${path}" stroke="${core}" stroke-width="33" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="${path}" stroke="#ffffffbb" stroke-width="2.5" stroke-dasharray="6 14" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
  }
  function vehicleSVG(p,i){
    const v=p.vehicle||'car',c=htmlSafe(p.color||COLORS[i]);
    const body=v==='camper'?'<path d="M-22 -8H-9V-17H14L23 -7V10H-22Z"/>':v==='electric'?'<path d="M-21 0L-12 -12H12L21 0V10H-21Z"/>':v==='truck'?'<path d="M-17 -7H3V-13H12L20 -3V10H-17Z"/>':v==='van'?'<rect x="-20" y="-13" width="40" height="24" rx="8"/>':v==='sport'?'<path d="M-21 3L-12 -10H11L22 4L19 11H-19Z"/>':'<path d="M-20 3L-13 -11H11L20 3V11H-20Z"/>';
    const pegs=Array.from({length:Math.min(3,p.dependents||0)},(_,j)=>`<circle cx="${-4+j*8}" cy="-2" r="3.4" fill="#fff2ce" stroke="#1c4a54" stroke-width=".8"/>`).join('');
    return `<g class="${game.current===i&&!p.retired?'current-pawn':''}"><ellipse cy="15" rx="23" ry="6" fill="#1e495955"/><g stroke="#1b4655" stroke-width="2.2" fill="${c}">${body}</g><circle cx="-11" cy="11" r="4" fill="#233e46"/><circle cx="12" cy="11" r="4" fill="#233e46"/>${pegs}<text text-anchor="middle" y="3" font-size="9" font-weight="900" fill="#fff">${i+1}</text></g>`;
  }
  function drawBoard(){
    const root=$('boardSvg');if(!root)return;
    const total=boardLength(),points=boardCoordinates(),rows=Math.ceil(total/10),height=rows*96+120;
    root.setAttribute('viewBox',`0 0 1200 ${height}`);
    const inBranch=i=>conf().branches.some(([a,b])=>i>a&&i<b);
    const basic=[];let run=[];
    for(let i=0;i<total;i++){
      if(inBranch(i)){
        if(run.length>1)basic.push(roadStroke(pathCoords(run)));
        run=[];
      }else{
        if(!run.length && i>0 && inBranch(i-1))run.push(svgPoint(i));
        else run.push(svgPoint(i));
      }
    }
    if(run.length>1)basic.push(roadStroke(pathCoords(run)));
    const branches=conf().branches.map(([a,b],j)=>{
      const first=[svgPoint(a),...Array.from({length:b-a-1},(_,d)=>svgPoint(a+d+1,'a')),svgPoint(b)];
      const second=[svgPoint(a),...Array.from({length:b-a-1},(_,d)=>svgPoint(a+d+1,'b')),svgPoint(b)];
      return roadStroke(pathCoords(first),'a')+roadStroke(pathCoords(second),'b')+`<g><rect x="${points[a].x-41}" y="${points[a].y-62}" width="82" height="25" rx="9" fill="#123e4c"/><text x="${points[a].x}" y="${points[a].y-46}" fill="#fff5d5" font-size="12" font-weight="900" text-anchor="middle">CROSSROAD ${j+1}</text></g>`;
    }).join('');
    let tiles='';const addTile=(c,i,pt,branch)=>{
      const active=game?.players.some(p=>p.position===i&&(!branch||routeId(p,branch[0])===branch[1]));
      const optionInfo=branch?BRANCH_DESCS[conf().branches.findIndex(b=>b[0]===branch[0])]:null;
      const branchEnd=branch?conf().branches.find(b=>b[0]===branch[0])[1]:0;
      const kind=branch&&!['milestone','payday','end'].includes(c.kind)&&(i===branch[0]+1||i===branchEnd-1)?(branch[1]==='a'?optionInfo.aKind:optionInfo.bKind):c.kind;
      tiles+=`<g transform="translate(${pt.x} ${pt.y})"><circle r="${['milestone','route','end'].includes(kind)?24:17}" fill="${PALETTE[kind]||'#56968b'}" stroke="${active?'#fffc9e':'#fffaf0'}" stroke-width="${active?5:2.5}" filter="url(#shadow)"/><text y="4" fill="${kind==='milestone'?'#5e4b2a':'#fff'}" font-size="${kind==='payday'?9:kind==='route'?10:kind==='milestone'?16:12}" font-weight="900" text-anchor="middle">${kind==='route'?'↗↘':kind==='milestone'?'★':kind==='end'?'END':kind==='payday'?'PAY':i}</text>${['milestone','end'].includes(kind)?`<text text-anchor="middle" y="37" font-size="11" fill="#315e65" font-weight="900">${c.label}</text>`:''}<title>Space ${i}: ${KIND_NAMES[kind]||kind}${branch?` — ${branch[1]==='a'?'upper':'lower'} road`:''}</title></g>`;
    };
    cells().forEach((c,i)=>{
      const br=branchAt(i);
      if(br){addTile(c,i,svgPoint(i,'a'),[br[0],'a']);addTile(c,i,svgPoint(i,'b'),[br[0],'b']);}
      else addTile(c,i,points[i],null);
    });
    const cars=game?.players.map((p,i)=>{
      const br=branchAt(p.position),pt=br?svgPoint(p.position,routeId(p,br[0])):points[p.position],dx=[-12,14,-12,14][i],dy=[-26,-26,25,25][i];
      return `<g transform="translate(${pt.x+dx} ${pt.y+dy})">${vehicleSVG(p,i)}<title>${htmlSafe(p.name)} · space ${p.position}</title></g>`;
    }).join('')||'';
    root.innerHTML=sceneSvg(height)+basic.join('')+branches+tiles+cars;
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
    const candidates=(p?.position>0&&((p.position*7+p.turns*3)%5!==0))?LOCAL_SCENARIOS.filter(s=>s.kind===kind):[];
    const selection=candidates.length?candidates:SCENARIOS.filter(s=>s.kind===kind);
    const available=selection.filter(s=>!p.used.includes(s.id));
    const pool=available.length?available:selection.length?selection:SCENARIOS;
    const s=pool[rand(pool.length)];p.used.push(s.id);if(p.used.length>SCENARIOS.length+LOCAL_SCENARIOS.length)p.used=p.used.slice(-24);
    return JSON.parse(JSON.stringify(s));
  }
  function spin(automatic=false){
    if(!game||game.phase!=='ready'||!current()||current().retired||(isBot(current())&&!automatic))return;
    const spinValue=rand(6)+1;
    game.phase='moving';game.lastSpin=spinValue;
    // Each numbered wedge is 60 degrees, centered on 0, 60, 120... .
    // Rotate from the current orientation to the chosen number under the top pointer.
    // Using absolute targets avoids the cumulative drift that V1.1 had after several spins.
    const previous=((spinAngle%360)+360)%360;
    const target=(360-(spinValue-1)*60)%360;
    const offset=(target-previous+360)%360;
    spinAngle+=4*360+offset;
    $('wheelDisc').style.setProperty('--spin-duration',isBot(current())?Math.min(aiDelay(),720)+'ms':'900ms');
    $('wheelDisc').style.transform=`rotate(${spinAngle}deg)`;
    $('wheelHub').textContent='…';
    commit();
    clearTimeout(spinTimer);
    spinTimer=setTimeout(()=>{spinTimer=null;move(spinValue);},isBot(current())?Math.min(aiDelay(),720):900);
  }
  function awardInvestments(spinValue){
    game.players.forEach(owner=>{
      if(owner.investNumber===spinValue && !owner.retired){
        applyChange(owner,{cash:180});
        log(owner,'Number investment paid',`The wheel landed on ${spinValue}. You earned a fictional $180 investment payout.`);
      }
    });
  }
  function move(value){
    if(!game||game.phase!=='moving')return;
    const p=current(),from=p.position,to=Math.min(boardLength()-1,from+value);
    p.turns++;p.position=to;
    const expense=livingCost(p);
    awardInvestments(value);
    applyChange(p,{cash:-expense});
    log(p,'Everyday living',`Chapter ${p.turns}: ${money(expense)} in simulated living expenses.`);
    const crossed=Array.from({length:to-from},(_,i)=>from+i+1);
    const paydays=crossed.filter(i=>paySet().has(i)).length;
    if(paydays){applyChange(p,{cash:paydays*p.pay});log(p,'Payday!',`Earned ${money(paydays*p.pay)} in simulated wages.`);}
    // Only force consequential STOP/crossroads decisions; quiet/payday landings need no card.
    game.pending=[];
    crossed.forEach(i=>{
      if(mileSet().has(i))game.pending.push(milestoneEvent(i));
      if(branchStart(i))game.pending.push(routeEvent(i));
    });
    if(to!==boardLength()-1&&!mileSet().has(to)&&!branchStart(to))game.pending.push({id:'landing-'+to,landingIndex:to,kind:'landing'});
    game.phase='decision';
    normalizePending();
    if(!game.pending.length)finishTurn();else commit();
    $('wheelHub').textContent=String(value);
  }
  function normalizePending(){
    if(!game||!game.pending)return;
    while(game.pending.length && game.pending[0].kind==='landing'){
      const task=game.pending.shift(),p=current(),kind=getCellKind(task.landingIndex,p);
      if(kind==='payday'||kind==='rest'||kind==='start'||kind==='end'||kind==='milestone'||kind==='route'){
        if(kind==='rest')log(p,'A peaceful stretch','No surprise expenses this time—enjoy the drive through the valley.');
        continue;
      }
      game.pending.unshift(makeScenario(p,kind));
    }
  }
  function chooseOption(index){
    if(!game||game.phase!=='decision'||!game.pending.length)return;
    const p=current(),event=game.pending[0],choice=event.options[index];if(!choice)return;
    if(event.routeStart!==undefined){p.routes=p.routes||{};p.routes[event.routeStart]=choice.route;}
    applyChange(p,choice.changes);log(p,event.title,choice.title+': '+choice.desc);
    game.pending.shift();normalizePending();
    if(!game.pending.length)finishTurn();else commit();
  }
  function finishTurn(){
    const p=current();
    if(p.position===boardLength()-1){p.retired=true;log(p,'Retirement reached',`Finished with net worth ${money(netWorth(p))} and life-balance score ${score(p)}.`);}
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
  function aiChoice(p,event){
    const profile=getAIProfile(p),w=profile.weights;
    const remainingPaydays=[...paySet()].filter(i=>i>p.position).length;
    const v=event.options.map((o,i)=>{
      const c=o.changes||{};
      const moneyValue=(c.cash||0)/450*w.cash+(c.savings||0)/450*w.savings-(c.debt||0)/450*w.debt+(c.equity||0)/450*w.equity;
      const meaningful=moneyValue+(c.happiness||0)*2*w.happiness+(c.community||0)*9*w.community+(c.skills||0)*12*w.skills
        +(c.pay||0)*remainingPaydays/450*w.pay;
      const liquidity=c.cash<0&&p.cash+c.cash<1500&&p.savings<1500 ? (profile.id==='risky'?8:22):0;
      const routePref=event.kind==='route' ? (profile.id==='careful'&&i===0?6:profile.id==='adventure'&&i===1?7:profile.id==='balanced'&&i===1?2:profile.id==='ambitious'&&i===0?5:0):0;
      const excitement=profile.risk*Math.min(12,Math.max(0,-(c.cash||0)/220))+(profile.id==='adventure'?(c.happiness||0)*2:0);
      const saveBonus=profile.id==='careful'?(c.savings||0)/300:0;
      return {i,value:meaningful-liquidity+excitement+saveBonus+routePref+Math.random()*3};
    });
    return v.sort((a,b)=>b.value-a.value)[0]?.i??0;
  }
  function aiStep(instant=false){
    if(!game||!isBot(current())||game.aiPaused||['final'].includes(game.phase))return;
    if(!instant&&['setup','rules','results','garage','investment'].includes(overlayView))return;
    const p=current(),profile=getAIProfile(p);
    if(game.phase==='path'){
      const path=profile.path;
      p.path=path;
      if(path==='earn'){applyChange(p,{cash:1800,skills:1});log(p,'Starting path','Began earning and gaining experience.');}
      else{applyChange(p,{debt:9000,skills:3});log(p,'Starting path','Started a study or training program.');}
      aiLastSummary=`${p.name} chose to ${path==='train'?'study or train':'start earning'}.`;
      game.phase='career';commit();return;
    }
    if(game.phase==='career'){
      const job=JOBS.find(j=>j.id===profile.career)||JOBS[0];
      p.career=job.id;p.pay=Math.round(job.pay*(p.path==='train'?1.12:1));
      log(p,'Career selected',`${job.name} · simulated payday ${money(p.pay)}.`);
      aiLastSummary=`${p.name} chose the ${job.name} career.`;
      if(game.current+1<game.players.length){game.current++;game.phase='path';commit();pathView();}
      else{game.current=0;game.phase='ready';commit();hideModal();showToast('All players are ready to start!');}
      return;
    }
    if(game.phase==='ready'){
      aiLastSummary=`${p.name} is spinning the wheel…`;
      if(instant){game.phase='moving';const value=rand(6)+1;game.lastSpin=value;move(value);}
      else spin(true);
      return;
    }
    if(game.phase==='decision'){
      normalizePending();if(!game.pending.length){finishTurn();return;}
      const e=game.pending[0],choice=aiChoice(p,e);
      aiLastSummary=`${p.name}: ${e.options[choice].title}`;
      chooseOption(choice);return;
    }
    if(game.phase==='handoff'){
      nextTurn();return;
    }
  }
  function scheduleAI(){
    clearAITimer();
    if(aiSkip||!game||game.aiPaused||!isBot(current())||game.phase==='final'||game.phase==='moving')return;
    if(['setup','rules','results','garage','investment'].includes(overlayView))return;
    aiTimer=setTimeout(()=>{aiTimer=null;aiStep();},aiDelay());
  }
  function fastForwardAI(){
    if(!game||game.aiPaused||!isBot(current()))return;
    clearAITimer();if(spinTimer!==null){clearTimeout(spinTimer);spinTimer=null;}
    if(game.phase==='moving')game.phase='ready';
    aiSkip=true;
    let counter=0;
    while(game&&isBot(current())&&game.phase!=='final'&&counter++<800)aiStep(true);
    aiSkip=false;
    commit();
    if(game.phase==='final'&&overlayView!=='results')resultView();
    if(counter>=800)showToast('Fast-forward stopped at the safety limit.');
  }
  function effectBadges(e){
    return Object.entries(e||{}).filter(([k,v])=>v!==0&&k!=='home').map(([k,v])=>{
      const desc=({cash:'cash',savings:'saved',debt:'debt',equity:'home value',happiness:'wellbeing',community:'community',skills:'skills',pay:'payday',dependents:'responsibility'}[k]||k);
      const val=(['cash','savings','debt','equity','pay'].includes(k)?money(Math.abs(v)):Math.abs(v));
      const isBad=(k==='debt'&&v>0)||(k==='cash'&&v<0)||(k==='pay'&&v<0)||(k==='happiness'&&v<0);
      return `<span class="effect-tag ${isBad?'neg':''}">${v>=0?'+':'−'}${val} ${desc}</span>`;
    }).join('');
  }
  function playerForSettings(){return game?.players.find(p=>!isBot(p))||current();}
  function garageView(){
    if(!game)return;
    overlayView='garage';clearAITimer();
    const p=playerForSettings(),milestoneCount=conf().milestones.filter(n=>n<=p.position).length;
    const body=`<div class="garage-grid">${GARAGE.map(v=>{
      const unlocked=milestoneCount>=v.unlock;
      return `<button type="button" data-vehicle-choice="${v.id}" class="option-card ${p.vehicle===v.id?'selected-vehicle':''}" ${unlocked?'':'disabled'}><span class="option-icon">${v.label}</span><span class="option-name">${v.name}</span><span class="option-detail">${p.vehicle===v.id?'CURRENT VEHICLE':unlocked?'AVAILABLE':`UNLOCK AFTER ${v.unlock} MILESTONES`}</span></button>`;
    }).join('')}</div><p class="notice-box">Vehicle types are visual only. The game rewards life choices, not expensive-looking cars. Passenger pegs show care or family responsibilities.</p>`;
    setModal('THE GARAGE · PERSONALIZE','Choose your ride',`${p.name}, personalize the vehicle traveling across Naches Valley.`,body,'<button class="secondary-btn" id="garageClose">Back to journey</button>');
    document.querySelectorAll('[data-vehicle-choice]').forEach(b=>b.onclick=()=>{p.vehicle=b.dataset.vehicleChoice;commit();garageView();});
    $('garageClose').onclick=hideModal;
  }
  function investmentView(){
    if(!game)return;const p=playerForSettings();
    overlayView='investment';clearAITimer();
    if(p.investNumber!==null&&p.investNumber!==undefined){
      setModal('FINANCIAL LITERACY · CHANCE','Your investment is active',`${p.name} invested in wheel number ${p.investNumber}. Each spin by any player that lands on it adds a fictional $180 to your cash.`,`<div class="notice-box">The initial investment cost $650. It may or may not pay for itself. This is a game of chance, not real investing.</div>`,'<button class="secondary-btn" id="investClose">Back to journey</button>');
      $('investClose').onclick=hideModal;return;
    }
    setModal('FINANCIAL LITERACY · CHANCE','Invest in a wheel number','For $650, choose one wheel number. Whenever any player spins that number, you receive $180. Returns are not guaranteed.',
      `<div class="invest-grid">${[1,2,3,4,5,6].map(n=>`<button type="button" class="option-card" data-invest="${n}"><span class="option-icon">${n}</span><span class="option-name">Choose ${n}</span></button>`).join('')}</div><p class="notice-box">This is a simplified classroom probability activity—not a realistic financial investment. Your money is at risk.</p>`,
      '<button class="secondary-btn" id="investClose">Cancel</button>');
    document.querySelectorAll('[data-invest]').forEach(b=>b.onclick=()=>{
      if(p.cash<650){showToast('Save $650 cash before purchasing this game investment.');return;}
      applyChange(p,{cash:-650});p.investNumber=Number(b.dataset.invest);
      log(p,'Number investment purchased',`Invested $650 on wheel number ${p.investNumber}.`);commit();hideModal();
    });
    $('investClose').onclick=hideModal;
  }
  function render(){
    drawBoard();
    const p=current();
    const playable=!!game;
    $('exportBtn').disabled=!playable;
    $('garageBtn').disabled=!playable;
    $('investmentBtn').disabled=!playable;
    $('spinBtn').disabled=!playable||game.phase!=='ready'||isBot(current());
    $('spinBtn').textContent=game?.phase==='moving'?'Spinning…':'Spin & move';
    $('playerStrip').innerHTML=playable?game.players.map((q,i)=>`<div class="player-tile ${game.current===i?'active':''} ${q.retired?'retired':''}" title="${htmlSafe(q.name)}"><div class="pawn-swatch" style="--pawn:${q.color}"></div><div class="player-details"><div class="player-name">${isBot(q)?'🤖 ':''}${htmlSafe(q.name)} ${q.retired?'✓':''}</div><div class="player-sub">Space ${q.position}/${boardLength()-1} · ${money(q.cash)}</div></div></div>`).join(''):'<div class="player-tile"><div class="player-details"><div class="player-name">Start a new journey</div><div class="player-sub">1–4 players</div></div></div>';
    const botCount=playable?game.players.filter(isBot).length:0;
    $('aiControlPanel').hidden=!botCount;
    $('aiPauseBtn').textContent=game?.aiPaused?'▶ Resume computers':'⏸ Pause computers';
    $('aiSpeedSelect').value=game?.aiSpeed||'normal';
    $('aiSkipBtn').disabled=!playable||!isBot(p)||game.aiPaused||game.phase==='moving';
    $('aiStatusText').textContent=!playable?'':game.aiPaused?'Computer opponents paused.':isBot(p)?`${htmlSafe(p.name)} (${getAIProfile(p).short}) · ${aiLastSummary}`:`Your turn. ${botCount} computer rival${botCount===1?'':'s'} ready.`;
    $('aiStatusText').setAttribute('aria-live','polite');
    $('phaseBadge').textContent=!playable?'Ready for adventure':game.phase==='final'?'Journey complete':`${game.players.filter(q=>q.retired).length} retired · ${game.players.length} total`;
    $('mapProgress').textContent=p?`SPACE ${p.position} / ${boardLength()-1}`:`0 / ${boardLength()-1} SPACES`;
    const boardCells=cells();const upcoming=p?boardCells.findIndex((c,i)=>i>p.position&&(c.kind==='milestone'||c.kind==='end')):-1;
    const teaser=$('milestoneTeaser');
    if(teaser){
      teaser.textContent=!p?'Your adventure begins at the first space.':p.retired?'You reached retirement!':upcoming<0?'Next chapter: Retirement':`COMING UP · ${boardCells[upcoming].label} · ${upcoming-p.position} space${upcoming-p.position===1?'':'s'} away`;
    }
    $('turnChip').textContent=!playable?'SETUP':game.phase==='final'?'COMPLETE':isBot(p)?'CPU TURN':game.phase==='ready'?'READY':game.phase==='decision'?'CHOOSE':game.phase==='handoff'?'NEXT PLAYER':game.phase==='moving'?'MOVING':game.phase==='final'?'COMPLETE':'SETUP';
    $('turnLabel').textContent=p?`${htmlSafe(p.name).toUpperCase()} · CHAPTER ${p.turns+1}`:'YOUR NEXT CHAPTER';
    $('decisionArea').innerHTML='';
    $('handoffArea').hidden=true;
    const wheelShown=playable&&['ready','moving'].includes(game.phase);
    $('wheelArea').style.display=wheelShown?'flex':'none';
    $('wheelArea').classList.toggle('ai-working',!!(wheelShown&&isBot(p)));
    if(!playable){$('actionTitle').textContent='Your story begins here';$('actionDescription').textContent='Choose players to begin. Each choice changes your future.';}
    else if(wheelShown){$('actionTitle').textContent=game.phase==='moving'?'Moving along the trail…':p.name==='You'?'Your turn!':`It's ${p.name}'s turn!`;
      $('actionDescription').textContent=isBot(p)?`${getAIProfile(p).icon} ${getAIProfile(p).description} Their turns are automatic.`:'Spin 1–6 spaces, handle expenses and paydays, then decide what to do with the opportunities ahead.';
      $('wheelHint').textContent=isBot(p)?(game.aiPaused?'Computer paused.':'Computer opponent is thinking…'):game.phase==='moving'?'Finding your next chapter…':`Simulated living cost this turn: ${money(livingCost(p))}.`;}
    else if(game.phase==='decision'){
      const e=game.pending[0];
      $('actionTitle').textContent=e?.title||'Make a decision';$('actionDescription').textContent='Every choice has trade-offs. What works for your goals?';
      $('decisionArea').innerHTML=`<div class="decision-label">${KIND_NAMES[e.kind]||'Life decision'} · Space ${p.position}</div><p class="decision-description">${htmlSafe(e.text)}</p>${e.options.map((o,i)=>`<button type="button" class="choice-card" data-option="${i}"><span class="choice-title">${htmlSafe(o.title)}</span><span class="choice-sub">${htmlSafe(o.desc)}</span><span class="effect-tags">${effectBadges(o.changes)}</span></button>`).join('')}`;
      document.querySelectorAll('[data-option]').forEach(b=>{b.disabled=isBot(p);b.onclick=()=>{if(!isBot(current()))chooseOption(+b.dataset.option);};});
    }else if(game.phase==='handoff'){
      $('actionTitle').textContent=p.retired?'Journey complete!':'Chapter complete!';
      $('actionDescription').textContent=p.retired?`${p.name} has reached retirement. Other players can finish their journeys.`:'Your decisions are saved. Pass the device to the next player when ready.';
      const next=[...game.players.slice(game.current+1),...game.players.slice(0,game.current)].find(q=>!q.retired)||p;
      $('handoffArea').hidden=false;
      $('handoffArea').innerHTML=`<p>${game.players.length>1?`Next up: <strong>${htmlSafe(next.name)}</strong>`:'Ready for another spin?'}</p><button type="button" class="primary-btn" id="nextTurnBtn" ${isBot(p)?'disabled':''}>${isBot(p)?'Computer is continuing…':game.players.length>1?'Next player':'Continue journey'}</button>`;
      $('nextTurnBtn').onclick=()=>{if(!isBot(current()))nextTurn();};
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
    const rows=ranking.map((p,i)=>`<div class="result-card ${i===0?'winner':''}"><div class="row"><strong>${i===0?'🏆 ':''}${i+1}. ${isBot(p)?'🤖 ':''}${htmlSafe(p.name)}</strong><strong>${score(p)} pts</strong></div><div class="result-metrics"><span>Net worth: ${money(netWorth(p))}</span><span>Wellbeing: ${p.happiness}/100</span><span>Community: ${p.community}</span><span>Skills: ${p.skills}</span></div><div class="result-bar"><div style="width:${score(p)/maxScore*100}%;background:${p.color}"></div></div></div>`).join('');
    const comparisons=['Financial security','Wellbeing','Community','Learning'].map((metric,i)=>{
      const v=p=>[Math.max(0,Math.round(netWorth(p)/450)),p.happiness*2,p.community*9,p.skills*12][i];
      const max=Math.max(1,...ranking.map(v));
      return `<div class="comparison-row"><strong>${metric}</strong><div class="comparison-bars">${ranking.map(p=>`<div class="comparison-entry"><span>${htmlSafe(p.name)}</span><div class="comparison-track"><i style="background:${p.color};width:${Math.round(v(p)/max*100)}%"></i></div><b>${v(p)}</b></div>`).join('')}</div></div>`;
    }).join('');
    setModal('RETIREMENT · THE STORY YOU BUILT','Your journey, your choices',
      'There is no single correct way to live. The game rewards financial security, wellbeing, learning, and community—not just cash.',
      rows+`<h3 class="comparison-heading">How everyone's choices compared</h3>${comparisons}<div class="notice-box"><strong>Life-balance score:</strong> Net worth / 450 (minimum 0) + wellbeing × 2 + community × 9 + skills × 12. All figures and rules are fictional for classroom learning.</div>`,
      '<button class="primary-btn" id="resultExport" type="button">Download results CSV</button><button class="secondary-btn" id="resultClose" type="button">View board</button><button class="secondary-btn" id="againBtn" type="button">Play again</button>');
    $('resultExport').onclick=exportResults;
    $('resultClose').onclick=hideModal;
    $('againBtn').onclick=()=>setupView(game);
  }
  function exportBackup(){if(!game)return;download('valley-life-journey-backup.json',JSON.stringify(game,null,2),'application/json');}
  function exportResults(){if(!game)return;const cols=['Name','Player type','Decision style','Career','Starting path','Cash','Savings','Debt','Home equity','Net worth','Wellbeing','Community','Skills','Turns','Life balance score','Journey length','Crossroad choices'];
    const data=game.players.map(p=>[p.name,isBot(p)?'Computer':'Human',isBot(p)?getAIProfile(p).name:'',JOBS.find(j=>j.id===p.career)?.name||'',p.path,p.cash,p.savings,p.debt,p.equity,netWorth(p),p.happiness,p.community,p.skills,p.turns,score(p),game.mode||'full',JSON.stringify(p.routes||{})]);
    const csv=[cols,...data].map(row=>row.map(v=>`"${String(v??'').replace(/"/g,'""')}"`).join(',')).join('\r\n');download('valley-life-journey-results.csv',csv,'text/csv;charset=utf-8');}
  function download(name,contents,mime){const b=new Blob([contents],{type:mime}),url=URL.createObjectURL(b),a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),2000);}
  function rulesView(){
    overlayView='rules';
    setModal('THE RULEBOOK · NO REAL MONEY INVOLVED','How to play Valley Life Journey',
      'An original Naches Valley-inspired educational board game for 1–4 players, with optional computer rivals.',
      `<div class="rules-list"><p><strong>1. Choose your rivals.</strong> Solo play defaults to you and three computer players with different decision styles. You can also play with humans on one device, or mix humans and computers.</p>
      <p><strong>2. Choose your starting path and career.</strong> Training adds learning and debt; beginning work adds cash. Careers offer fictional paydays.</p>
      <p><strong>3. Choose a road at the crossroads.</strong> Four actual alternative routes connect back to the main road. Your route determines which branch spaces you land on.</p><p><strong>4. Spin the wheel.</strong> Move 1–6 spaces. Each spin includes everyday living costs, and crossing a payday space pays your simulated salary.</p>
      <p><strong>5. Make choices.</strong> When you reach opportunity, money, community, wellness, or surprise spaces, choose how to respond. Major milestones happen to every player who passes them.</p>
      <p><strong>6. Personalize your vehicle and optionally invest in a number.</strong> Vehicle choices are cosmetic. A $650 investment pays $180 when any player spins your selected number, but returns are uncertain.</p><p><strong>7. Manage trade-offs.</strong> Cash can become debt if you spend beyond your balance. Savings are separate from spending cash; buying a home adds equity and a mortgage.</p>
      <p><strong>8. Reach retirement.</strong> In a full journey, retirement is space 89 (quick: 49). Scores combine net worth, wellbeing, community contribution, and skills. The strongest balance wins.</p>
      <p><strong>9. Control computer speed.</strong> Use Fast, Normal, or Slow. Pause computer turns or fast-forward to the next human turn at any time.</p>
      <p><strong>10. Save your progress.</strong> The game saves in this browser profile. Use Save backup to move to another device or protect your progress.</p>
      <div class="notice-box">Game concepts are simplified and fictional. Outcomes do not represent real salaries, lending rules, cost of living, or personal-finance advice. Different family and work paths are equally valid choices.</div></div>`,
      '<button type="button" class="primary-btn" id="rulesClose">Got it!</button>');
    $('rulesClose').onclick=()=>{hideModal();if(!game)setupView(null);else if(game.phase==='path')pathView();else if(game.phase==='career')careerView();else if(game.phase==='final')resultView();else scheduleAI();};
  }
  function init(){
    $('spinBtn').onclick=()=>spin(false);
    $('garageBtn').onclick=garageView;
    $('investmentBtn').onclick=investmentView;
    $('aiPauseBtn').onclick=()=>{if(!game)return;game.aiPaused=!game.aiPaused;aiLastSummary=game.aiPaused?'Computers are paused.':'Computers resumed.';commit();};
    $('aiSpeedSelect').onchange=e=>{if(!game)return;game.aiSpeed=e.target.value;commit();};
    $('aiSkipBtn').onclick=fastForwardAI;
    $('newGameBtn').onclick=()=>setupView(game);
    $('exportBtn').onclick=exportBackup;
    $('rulesBtn').onclick=rulesView;
    game=readStore();
    if(game?.phase==='moving')game.phase='ready';
    if(game){game.aiSpeed=game.aiSpeed||'normal';game.mode=game.mode||'full';game.players.forEach(p=>{p.routes=p.routes||{};p.vehicle=p.vehicle||'car';if(p.investNumber===undefined)p.investNumber=null;});normalizePending();}
    render();
    setupView(game);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
