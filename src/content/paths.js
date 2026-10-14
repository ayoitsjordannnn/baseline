// Military, trades, careers, FAFSA and SAT content. General information only;
// every screen points students to official sites and their counselor for specifics.

export const BRANCHES = {
  army: { name: 'Army', icon: 'star', color: '#3D4B2A', about: 'The largest branch. Land operations, with hundreds of jobs from medic to mechanic to cyber.', url: 'https://www.goarmy.com',
    jobs: ['Combat medic', 'Cyber operations', 'Mechanic', 'Military police', 'Intelligence analyst'] },
  navy: { name: 'Navy', icon: 'anchor', color: '#0B2D5B', about: 'Ships, submarines and aircraft at sea, with jobs in nuclear power, aviation and medicine.', url: 'https://www.navy.com',
    jobs: ['Nuclear technician', 'Aviation mechanic', 'Hospital corpsman', 'IT specialist', 'Electrician\'s mate'] },
  airforce: { name: 'Air Force', icon: 'wings', color: '#00308F', about: 'Air operations, aircraft maintenance, cyber and intelligence.', url: 'https://www.airforce.com',
    jobs: ['Aircraft maintenance', 'Cyber defense', 'Air traffic control', 'Medical technician', 'Intelligence'] },
  marines: { name: 'Marine Corps', icon: 'shield', color: '#7A1F1F', about: 'A smaller, quick-response force known for tough training and strong teamwork.', url: 'https://www.marines.com',
    jobs: ['Infantry', 'Aviation mechanic', 'Logistics', 'Communications', 'Military police'] },
  coast: { name: 'Coast Guard', icon: 'lifebuoy', color: '#B22222', about: 'Search and rescue, law enforcement at sea, and protecting U.S. waters.', url: 'https://www.gocoastguard.com',
    jobs: ['Rescue swimmer', 'Boatswain\'s mate', 'Machinery technician', 'Aviation', 'Maritime enforcement'] },
  space: { name: 'Space Force', icon: 'orbit', color: '#1C2541', about: 'The newest branch. Satellites, space operations and cyber.', url: 'https://www.spaceforce.com',
    jobs: ['Space operations', 'Cyber', 'Intelligence', 'Engineering', 'Satellite systems'] },
  unsure: { name: 'Not sure yet', icon: 'compass', color: '#4A5568', about: 'Talk to recruiters from a few branches. Asking questions doesn\'t commit you to anything.', url: '', jobs: [] },
};
export const MIL_STEPS = [
  ['Talk to a recruiter', 'You can talk to recruiters from several branches. Asking questions doesn\'t commit you to anything.'],
  ['Take the ASVAB', 'Many high schools offer it free. Your scores decide which jobs you qualify for.'],
  ['Get physically ready', 'Every branch has a fitness test. Start running and doing push-ups and sit-ups now.'],
  ['Graduate and keep a clean record', 'Most branches require a high school diploma. You can enlist at 17 with a parent\'s consent, or at 18 on your own.'],
  ['Go to MEPS', 'A day of medical, aptitude and background checks to confirm you qualify.'],
  ['Pick your job and sign', 'You choose a job based on your scores and openings, then sign your contract.'],
];
export const MIL_PAY = [
  ['rotc', 'ROTC in college', 'ROTC scholarships can pay for college tuition. You train during college and serve as an officer after you graduate. Apply junior year or early senior year.'],
  ['academy', 'Service academies', 'West Point, the Naval Academy, the Air Force Academy and others offer a free college education, and you serve after graduation. Most require a nomination, often from a member of Congress. Start junior year.'],
  ['gi', 'GI Bill after you serve', 'After you serve, the GI Bill helps pay for college or trade school.'],
  ['ta', 'Tuition Assistance while serving', 'Many service members take college classes while on active duty, with help paying for them.'],
];

export const TRADES = {
  hvac: { name: 'HVAC technician', icon: 'flame', does: 'Install and fix heating, air conditioning and refrigeration.', train: 'Certificate programs often take 6 months to 2 years. Many techs also do an apprenticeship.', cert: 'Handling refrigerants requires EPA Section 608 certification.', day: 'Visit homes and businesses, diagnose systems, swap parts, and keep people cool in July.' },
  elec: { name: 'Electrician', icon: 'bolt', does: 'Wire homes and businesses, and install and repair electrical systems.', train: 'Usually a 4–5 year paid apprenticeship with classes.', cert: 'Most states require a license.', day: 'Read blueprints, run wire, install panels and troubleshoot circuits.' },
  plumb: { name: 'Plumber', icon: 'pipe', does: 'Install and repair water, gas and drain systems.', train: 'Usually a 4–5 year paid apprenticeship.', cert: 'Most states require a license.', day: 'Fix leaks, install water heaters and plan pipe layouts in new buildings.' },
  weld: { name: 'Welder', icon: 'spark', does: 'Join metal for buildings, pipelines, ships and cars.', train: 'Programs often take a few months to a year.', cert: 'Welding certifications help you get hired.', day: 'Cut, fit and weld metal parts, often on job sites or in shops.' },
  auto: { name: 'Automotive technician', icon: 'wrench', does: 'Diagnose and repair cars and trucks.', train: 'Certificate or associate degree, often 1–2 years.', cert: 'ASE certifications show your skills.', day: 'Use diagnostic tools, fix engines and brakes, and explain repairs to customers.' },
  cosmo: { name: 'Cosmetologist', icon: 'scissors', does: 'Hair, skin and nail care.', train: 'A state-approved program, often about 1,000–1,600 hours depending on your state.', cert: 'Then a state license exam.', day: 'Cut, color and style hair, build a client list, and maybe run your own chair.' },
  med: { name: 'Medical (CNA, medical assistant)', icon: 'cross', does: 'Care for patients in hospitals, clinics and nursing homes.', train: 'CNA programs can take a few weeks to a few months. Medical assistant certificates often take about a year.', cert: 'CNAs take a state exam.', day: 'Take vital signs, help patients and support nurses and doctors.' },
  build: { name: 'Construction and carpentry', icon: 'hammer', does: 'Build and repair homes and buildings.', train: 'On-the-job training or an apprenticeship, often 3–4 years for carpentry.', cert: 'Safety certifications like OSHA training help.', day: 'Frame walls, set forms, install trim and work as part of a crew.' },
  unsure: { name: 'Not sure yet', icon: 'compass', does: 'Try a few before you pick.', train: 'Take a CTE class, shadow someone for a day, or visit a technical college open house.', cert: '', day: '' },
};
export const TRAIN_WAYS = [
  ['$', 'Community or technical college', 'Usually the lowest cost. Certificates and associate degrees, and the FAFSA can help pay.'],
  ['Paid', 'Apprenticeship', 'Earn a paycheck while you learn on the job. Many electricians, plumbers and carpenters train this way.'],
  ['$$$', 'Private trade school', 'Can be fast, but often costs much more. Compare total cost and job-placement rates before you sign.'],
];
export const CAREER_CARDS = [
  ['briefcase', 'Jobs that train you', 'Many employers train you on the job: warehouses, retail management, banks, utilities and hospitals. Ask about paid training and raises.'],
  ['badge', 'Certifications that pay off', 'Short programs can boost your pay: CNA, CDL (commercial driving), IT certifications, forklift and EMT.'],
  ['hammer', 'Apprenticeships', 'Get paid while you learn a skilled trade. See Trades for details.'],
  ['door', 'Keep doors open', 'Many companies help pay for college later. Keep your grades up and file the FAFSA if there\'s any chance you\'ll take classes.'],
];

export const FAFSA_STEPS = [
  ['Make your StudentAid.gov account', 'You and one parent or guardian each need your own account (FSA ID). It can take a few days to verify, so do this first.'],
  ['Gather your info', 'Tax info from two years ago (the FAFSA uses "prior-prior" year), Social Security numbers and bank balances. A parent helps with this part.'],
  ['Fill out your part', 'Log in at StudentAid.gov and start the FAFSA. Most of the tax info can be pulled in automatically.'],
  ['Invite your parent to add their part', 'Your parent or guardian logs in with their own account, gives consent and adds their info.'],
  ['List your colleges', 'Add every school you might apply to, even if you haven\'t applied yet. You can list up to 20.'],
  ['Submit and save your confirmation', 'Screenshot it. Then watch your email for your FAFSA Submission Summary.'],
  ['Check state and college aid', 'Many states and colleges hand out money first come, first served, and some need extra forms. Ask your counselor about your state\'s deadline.'],
];
export const FAFSA_URL = 'https://studentaid.gov/h/apply-for-aid/fafsa';

// Official, free SAT prep from College Board's "Studying and Practicing" page.
export const SAT_RESOURCES = [
  { k: 'bluebook', name: 'Bluebook practice tests', by: 'College Board', icon: 'book', what: 'Full-length practice tests in the same app you use on test day. Your scores show up in My Practice.', how: 'Download the Bluebook app on a laptop or tablet and pick Practice and Prepare.', url: 'https://satsuite.collegeboard.org/sat/practice-preparation/practice-tests/bluebook', best: 'Take one first to get your starting score.' },
  { k: 'khan', name: 'Official SAT Prep on Khan Academy', by: 'Khan Academy', icon: 'play', what: 'Short lessons, videos and example problems for every skill, plus a Course Challenge to find your weak spots.', how: 'Sign up at khanacademy.org and link your College Board account.', url: 'https://www.khanacademy.org/test-prep/v2-sat-math', best: 'Use it for your weekly study sessions.' },
  { k: 'bank', name: 'Student Question Bank', by: 'College Board', icon: 'list', what: 'Build custom quizzes by skill and difficulty. Great for drilling one weak area.', how: 'Search "SAT Student Question Bank" on College Board.', url: 'https://satsuite.collegeboard.org/sat/practice-preparation', best: 'Drill your lowest section 15 minutes at a time.' },
  { k: 'schoolhouse', name: 'Schoolhouse.world tutoring', by: 'Official SAT tutoring', icon: 'people', what: 'Free small-group sessions with trained peer tutors. Sessions run for 4 weeks.', how: 'Sign up at schoolhouse.world for an SAT bootcamp.', url: 'https://schoolhouse.world', best: 'Good if you study better with other people.' },
  { k: 'qotd', name: 'Question of the Day', by: 'College Board', icon: 'sun', what: 'One SAT question a day. Takes two minutes.', how: 'Visit qotd.collegeboard.org or turn on daily questions.', url: 'https://qotd.collegeboard.org', best: 'Do it on your phone between classes.' },
];
export const SAT_SECTIONS = [
  ['rw', 'Reading and Writing', 'Short passages, vocabulary in context, grammar and editing.'],
  ['math', 'Math', 'Algebra, advanced math, problem solving and some geometry. A calculator is allowed for the whole section.'],
];
