// 178 colleges for browsing and fit estimates.
// id|name|short|city|state|tier(0 open admission - 5 most selective)|known-for majors (c cs, e eng, b bus, h health, a arts, d edu)|public|color|monogram
export const COLLEGE_DATA=`mit|Massachusetts Institute of Technology|MIT|Cambridge|MA|5|ce|0|#A31F34
stanford|Stanford University|Stanford|Stanford|CA|5|ceb|0|#8C1515|SU
harvard|Harvard University|Harvard|Cambridge|MA|5|bh|0|#A51C30
yale|Yale University|Yale|New Haven|CT|5|ah|0|#00356B
princeton|Princeton University|Princeton|Princeton|NJ|5|ce|0|#A85200
caltech|California Institute of Technology|Caltech|Pasadena|CA|5|ce|0|#B43C0C|CIT
columbia|Columbia University|Columbia|New York|NY|5|beh|0|#1D4F91|CU
upenn|University of Pennsylvania|Penn|Philadelphia|PA|5|bh|0|#011F5B
brown|Brown University|Brown|Providence|RI|5|h|0|#4E3629
dartmouth|Dartmouth College|Dartmouth|Hanover|NH|5|e|0|#00693E
duke|Duke University|Duke|Durham|NC|5|hb|0|#012169
uchicago|University of Chicago|UChicago|Chicago|IL|5|b|0|#800000|UC
cornell|Cornell University|Cornell|Ithaca|NY|5|ceb|0|#B31B1B
cmu|Carnegie Mellon University|Carnegie Mellon|Pittsburgh|PA|5|cea|0|#C41230|CMU
northwestern|Northwestern University|Northwestern|Evanston|IL|5|ba|0|#4E2A84|NU
jhu|Johns Hopkins University|Johns Hopkins|Baltimore|MD|5|he|0|#002D72|JHU
rice|Rice University|Rice|Houston|TX|5|ec|0|#00205B
vanderbilt|Vanderbilt University|Vanderbilt|Nashville|TN|5|dh|0|#6F5A3B|VU
notredame|University of Notre Dame|Notre Dame|Notre Dame|IN|5|b|0|#0C2340|ND
georgetown|Georgetown University|Georgetown|Washington|DC|5|bh|0|#041E42|GU
ucla|University of California, Los Angeles|UCLA|Los Angeles|CA|5|ceha|1|#2774AE
cal|University of California, Berkeley|UC Berkeley|Berkeley|CA|5|ceb|1|#003262|Cal
tufts|Tufts University|Tufts|Medford|MA|5|e|0|#2B6CB0
washu|Washington University in St. Louis|WashU|St. Louis|MO|5|h|0|#A51417
usc|University of Southern California|USC|Los Angeles|CA|5|cba|0|#990000
nyu|New York University|NYU|New York|NY|5|ba|0|#57068C
northeastern|Northeastern University|Northeastern|Boston|MA|5|cb|0|#C8102E|NEU
harveymudd|Harvey Mudd College|Harvey Mudd|Claremont|CA|5|ce|0|#333333|HMC
pomona|Pomona College|Pomona|Claremont|CA|5||0|#0057B8
williams|Williams College|Williams|Williamstown|MA|5||0|#500082
amherst|Amherst College|Amherst|Amherst|MA|5||0|#3F1F69
swarthmore|Swarthmore College|Swarthmore|Swarthmore|PA|5|e|0|#A41E35
bowdoin|Bowdoin College|Bowdoin|Brunswick|ME|5||0|#222222
juilliard|The Juilliard School|Juilliard|New York|NY|5|a|0|#1A1A1A
westpoint|U.S. Military Academy|West Point|West Point|NY|5|e|1|#2B2B2B|USMA
navy|U.S. Naval Academy|Naval Academy|Annapolis|MD|5|e|1|#00205B|USNA
umich|University of Michigan|Michigan|Ann Arbor|MI|4|cebhd|1|#00274C|UM
uva|University of Virginia|UVA|Charlottesville|VA|4|b|1|#232D4B
unc|University of North Carolina at Chapel Hill|UNC|Chapel Hill|NC|4|hdb|1|#13294B
gatech|Georgia Institute of Technology|Georgia Tech|Atlanta|GA|4|ce|1|#003057
utaustin|University of Texas at Austin|UT Austin|Austin|TX|4|cebd|1|#A34700|UT
ufl|University of Florida|UF|Gainesville|FL|4|bh|1|#0021A5
ucsd|University of California San Diego|UC San Diego|La Jolla|CA|4|ce|1|#182B49|UCSD
uci|University of California, Irvine|UC Irvine|Irvine|CA|4|ch|1|#0064A4|UCI
ucsb|University of California, Santa Barbara|UCSB|Santa Barbara|CA|4|e|1|#003660
bu|Boston University|BU|Boston|MA|4|hb|0|#CC0000
bc|Boston College|Boston College|Chestnut Hill|MA|4|bd|0|#8A100B
emory|Emory University|Emory|Atlanta|GA|4|bh|0|#012169
wm|William & Mary|William & Mary|Williamsburg|VA|4|d|1|#115740|W&M
wakeforest|Wake Forest University|Wake Forest|Winston-Salem|NC|4|b|0|#3D3529
casewestern|Case Western Reserve University|Case Western|Cleveland|OH|4|eh|0|#0A304E
lehigh|Lehigh University|Lehigh|Bethlehem|PA|4|eb|0|#653600
tulane|Tulane University|Tulane|New Orleans|LA|4|b|0|#006747
miami|University of Miami|Miami|Coral Gables|FL|4|bh|0|#005030|UM
wellesley|Wellesley College|Wellesley|Wellesley|MA|4||0|#001C5A
middlebury|Middlebury College|Middlebury|Middlebury|VT|4||0|#0D395F
uw|University of Washington|UW|Seattle|WA|3|ch|1|#4B2E83
uiuc|University of Illinois Urbana-Champaign|UIUC|Champaign|IL|3|ceb|1|#13294B
purdue|Purdue University|Purdue|West Lafayette|IN|3|ce|1|#6B5530
wisc|University of Wisconsin–Madison|UW–Madison|Madison|WI|3|ced|1|#C5050C|UW
osu|Ohio State University|Ohio State|Columbus|OH|3|bdh|1|#BB0000|OSU
tamu|Texas A&M University|Texas A&M|College Station|TX|3|ebd|1|#500000|A&M
ucdavis|University of California, Davis|UC Davis|Davis|CA|3|h|1|#022851|UCD
vt|Virginia Tech|Virginia Tech|Blacksburg|VA|3|e|1|#861F41|VT
umd|University of Maryland|Maryland|College Park|MD|3|cb|1|#E21833|UMD
rutgers|Rutgers University|Rutgers|New Brunswick|NJ|3|h|1|#CC0033|RU
psu|Penn State University|Penn State|University Park|PA|3|eb|1|#041E42|PSU
umn|University of Minnesota|Minnesota|Minneapolis|MN|3|c|1|#7A0019|UMN
pitt|University of Pittsburgh|Pitt|Pittsburgh|PA|3|h|1|#003594
rpi|Rensselaer Polytechnic Institute|RPI|Troy|NY|3|e|0|#D6001C
wpi|Worcester Polytechnic Institute|WPI|Worcester|MA|3|e|0|#AC2B37
risd|Rhode Island School of Design|RISD|Providence|RI|3|a|0|#1A1A1A
calpoly|Cal Poly San Luis Obispo|Cal Poly|San Luis Obispo|CA|3|eb|1|#154734|CP
mines|Colorado School of Mines|Mines|Golden|CO|3|e|1|#21314D
clemson|Clemson University|Clemson|Clemson|SC|3|e|1|#C2500A
uga|University of Georgia|UGA|Athens|GA|3|bd|1|#BA0C2F
fsu|Florida State University|Florida State|Tallahassee|FL|3|b|1|#782F40|FSU
smu|Southern Methodist University|SMU|Dallas|TX|3|b|0|#0033A0
tcu|Texas Christian University|TCU|Fort Worth|TX|3|bh|0|#4D1979
howard|Howard University|Howard|Washington|DC|3|hb|0|#003A63
spelman|Spelman College|Spelman|Atlanta|GA|3||0|#002D72
syracuse|Syracuse University|Syracuse|Syracuse|NY|3|ba|0|#B83C00|SU
fordham|Fordham University|Fordham|New York|NY|3|b|0|#860038
binghamton|Binghamton University|Binghamton|Binghamton|NY|3|b|1|#005A43
stonybrook|Stony Brook University|Stony Brook|Stony Brook|NY|3|ch|1|#990000|SBU
umass|University of Massachusetts Amherst|UMass Amherst|Amherst|MA|3|c|1|#881C1C|UMA
uconn|University of Connecticut|UConn|Storrs|CT|3|h|1|#000E2F
byu|Brigham Young University|BYU|Provo|UT|3|b|0|#002E5D
utd|University of Texas at Dallas|UT Dallas|Richardson|TX|2|ce|1|#C75B12|UTD
uh|University of Houston|UH|Houston|TX|2|eb|1|#C8102E
baylor|Baylor University|Baylor|Waco|TX|2|hb|0|#154734|BU
indiana|Indiana University|Indiana|Bloomington|IN|2|bda|1|#990000|IU
msu|Michigan State University|Michigan State|East Lansing|MI|2|db|1|#18453B|MSU
colorado|University of Colorado Boulder|CU Boulder|Boulder|CO|2|e|1|#565A5C|CU
utah|University of Utah|Utah|Salt Lake City|UT|2|ch|1|#CC0000|U
auburn|Auburn University|Auburn|Auburn|AL|2|e|1|#0C2340|AU
tennessee|University of Tennessee|Tennessee|Knoxville|TN|2|e|1|#C26200|UT
sc|University of South Carolina|South Carolina|Columbia|SC|2|b|1|#73000A|USC
ucf|University of Central Florida|UCF|Orlando|FL|2|ec|1|#2B2B2B
usf|University of South Florida|USF|Tampa|FL|2|h|1|#006747
oklahoma|University of Oklahoma|Oklahoma|Norman|OK|2|e|1|#841617|OU
miamioh|Miami University|Miami (OH)|Oxford|OH|2|bd|1|#C3142D|MU
cincinnati|University of Cincinnati|Cincinnati|Cincinnati|OH|2|ed|1|#E00122|UC
mtu|Michigan Technological University|Michigan Tech|Houghton|MI|2|e|1|#2B2B2B|MTU
rit|Rochester Institute of Technology|RIT|Rochester|NY|2|ca|0|#C25200
drexel|Drexel University|Drexel|Philadelphia|PA|2|eh|0|#07294D
temple|Temple University|Temple|Philadelphia|PA|2|a|1|#9D2235|TU
jmu|James Madison University|James Madison|Harrisonburg|VA|2|d|1|#450084|JMU
delaware|University of Delaware|Delaware|Newark|DE|2|e|1|#00539F|UD
buffalo|University at Buffalo|Buffalo|Buffalo|NY|2|e|1|#005BBB|UB
loyola|Loyola University Chicago|Loyola Chicago|Chicago|IL|2|h|0|#7C2529|LUC
marquette|Marquette University|Marquette|Milwaukee|WI|2|h|0|#003366|MU
morehouse|Morehouse College|Morehouse|Atlanta|GA|2|b|0|#7A0019
hampton|Hampton University|Hampton|Hampton|VA|2|h|0|#0067B1|HU
famu|Florida A&M University|FAMU|Tallahassee|FL|2|h|1|#B85500
ncat|North Carolina A&T State University|NC A&T|Greensboro|NC|2|e|1|#004684|A&T
rosehulman|Rose-Hulman Institute of Technology|Rose-Hulman|Terre Haute|IN|2|e|0|#800000|RH
embry|Embry-Riddle Aeronautical University|Embry-Riddle|Daytona Beach|FL|2|e|0|#00257A|ERAU
pratt|Pratt Institute|Pratt|Brooklyn|NY|2|a|0|#1A1A1A
calarts|California Institute of the Arts|CalArts|Valencia|CA|2|a|0|#1A1A1A
parsons|Parsons School of Design|Parsons|New York|NY|2|a|0|#C21E14
scad|Savannah College of Art and Design|SCAD|Savannah|GA|2|a|0|#1A1A1A
berklee|Berklee College of Music|Berklee|Boston|MA|2|a|0|#1A1A1A
ttu|Texas Tech University|Texas Tech|Lubbock|TX|1|e|1|#CC0000|TTU
unt|University of North Texas|UNT|Denton|TX|1|da|1|#00853E
txst|Texas State University|Texas State|San Marcos|TX|1|d|1|#501214|TXST
utsa|University of Texas at San Antonio|UTSA|San Antonio|TX|1|c|1|#0C2340
uta|University of Texas at Arlington|UT Arlington|Arlington|TX|1|eh|1|#0064B1|UTA
utep|University of Texas at El Paso|UTEP|El Paso|TX|1|e|1|#041E42
twu|Texas Woman's University|TWU|Denton|TX|1|h|1|#722F37
shsu|Sam Houston State University|Sam Houston|Huntsville|TX|1|d|1|#B85A12|SHSU
sfa|Stephen F. Austin State University|SFA|Nacogdoches|TX|1|d|1|#3F2A56
pvamu|Prairie View A&M University|Prairie View A&M|Prairie View|TX|1|e|1|#4F2D7F|PV
tsu|Texas Southern University|Texas Southern|Houston|TX|1|b|1|#7A0019|TSU
tarleton|Tarleton State University|Tarleton|Stephenville|TX|1|d|1|#4F2D7F|TSU
utrgv|University of Texas Rio Grande Valley|UTRGV|Edinburg|TX|1|h|1|#C23A12|RGV
asu|Arizona State University|Arizona State|Tempe|AZ|1|cb|1|#8C1D40|ASU
arizona|University of Arizona|Arizona|Tucson|AZ|1|b|1|#AB0520|UA
oregon|University of Oregon|Oregon|Eugene|OR|1|b|1|#154733|UO
oregonst|Oregon State University|Oregon State|Corvallis|OR|1|e|1|#B03205|OSU
wsu|Washington State University|Washington State|Pullman|WA|1|e|1|#981E32|WSU
iastate|Iowa State University|Iowa State|Ames|IA|1|e|1|#C8102E|ISU
kstate|Kansas State University|K-State|Manhattan|KS|1|e|1|#512888|KSU
ku|University of Kansas|Kansas|Lawrence|KS|1|d|1|#0051BA|KU
mizzou|University of Missouri|Mizzou|Columbia|MO|1|d|1|#4A4A4A|MU
nebraska|University of Nebraska–Lincoln|Nebraska|Lincoln|NE|1|e|1|#D00000|N
okstate|Oklahoma State University|Oklahoma State|Stillwater|OK|1|e|1|#C25500|OSU
arkansas|University of Arkansas|Arkansas|Fayetteville|AR|1|b|1|#9D2235|UA
lsu|Louisiana State University|LSU|Baton Rouge|LA|1|e|1|#461D7C
alabama|University of Alabama|Alabama|Tuscaloosa|AL|1|b|1|#9E1B32|UA
kentucky|University of Kentucky|Kentucky|Lexington|KY|1|h|1|#0033A0|UK
wvu|West Virginia University|West Virginia|Morgantown|WV|1|e|1|#002855|WVU
gmu|George Mason University|George Mason|Fairfax|VA|1|c|1|#006633|GMU
vcu|Virginia Commonwealth University|VCU|Richmond|VA|1|ah|1|#4A4A4A
gsu|Georgia State University|Georgia State|Atlanta|GA|1|b|1|#0039A6|GSU
kennesaw|Kennesaw State University|Kennesaw State|Kennesaw|GA|1|c|1|#2B2B2B|KSU
ohiou|Ohio University|Ohio University|Athens|OH|1|d|1|#00694E|OU
kent|Kent State University|Kent State|Kent|OH|1|ad|1|#002664|KSU
ballstate|Ball State University|Ball State|Muncie|IN|1|d|1|#BA0C2F|BSU
wmich|Western Michigan University|Western Michigan|Kalamazoo|MI|1|e|1|#6C4023|WMU
wayne|Wayne State University|Wayne State|Detroit|MI|1|h|1|#0C5449|WSU
uic|University of Illinois Chicago|UIC|Chicago|IL|1|ch|1|#001E62
ilstate|Illinois State University|Illinois State|Normal|IL|1|d|1|#CE1126|ISU
depaul|DePaul University|DePaul|Chicago|IL|1|ba|0|#005EB8|DPU
unm|University of New Mexico|New Mexico|Albuquerque|NM|1|h|1|#BA0C2F|UNM
unr|University of Nevada, Reno|Nevada|Reno|NV|1|e|1|#003366|UNR
saic|School of the Art Institute of Chicago|SAIC|Chicago|IL|1|a|0|#1A1A1A
tstc|Texas State Technical College|TSTC|Waco|TX|0|e|1|#003B71
dallas|Dallas College|Dallas College|Dallas|TX|0|cbh|1|#1F4E8C|DC
acc|Austin Community College|Austin CC|Austin|TX|0|cbh|1|#00447C|ACC
hcc|Houston Community College|Houston CC|Houston|TX|0|hb|1|#C8102E|HCC
lonestar|Lone Star College|Lone Star|The Woodlands|TX|0|hb|1|#004B87|LSC
tcc|Tarrant County College|Tarrant County|Fort Worth|TX|0|h|1|#00539B|TCC
collin|Collin College|Collin College|McKinney|TX|0|c|1|#004B8D|CC
alamo|Alamo Colleges|Alamo Colleges|San Antonio|TX|0|h|1|#0D3C6E|AC
sanjac|San Jacinto College|San Jac|Pasadena|TX|0|e|1|#002F6C|SJC
epcc|El Paso Community College|EPCC|El Paso|TX|0|h|1|#5B2C86
smc|Santa Monica College|Santa Monica|Santa Monica|CA|0|ab|1|#00467F|SMC
mdc|Miami Dade College|Miami Dade|Miami|FL|0|bh|1|#005DAA|MDC`;

export const COLLEGE_LIST = COLLEGE_DATA.trim().split('\n').map((l) => {
  const [id, full, name, city, st, tier, maj, pub, color, mono] = l.split('|');
  const auto = name.length <= 4 && !name.includes(' ')
    ? name
    : name.split(/[\s–-]+/).filter((w) => !/^(of|the|at|and|&)$/i.test(w)).map((w) => w[0]).join('').toUpperCase().slice(0, 3);
  return { id, full, name, city: `${city}, ${st}`, st, tier: +tier, maj, pub: pub === '1', color, mono: mono || auto, hay: `${full} ${name} ${city} ${st} ${mono || ''}`.toLowerCase() };
});
export const COLLEGES = Object.fromEntries(COLLEGE_LIST.map((c) => [c.id, c]));

// Real University of Washington numbers (Fall 2025), used as the deep-dive example.
COLLEGES.uw.rates = [['All applicants', 41.7], ['Out-of-state applicants', 42.2], ['CS major, in-state', 37], ['CS major, out-of-state', 5]];
COLLEGES.uw.visitUrl = 'https://admit.washington.edu/visit/';
COLLEGES.uw.special = true;

export const CS_HARD = new Set(['uw', 'uiuc', 'utaustin', 'purdue', 'umd', 'ucsd', 'ucla', 'cal', 'umich', 'gatech']);
export const TIER = {
  5: { label: 'Most selective', sat: 1500, gpa: 3.95, satTxt: '1500+', gpaTxt: '3.9+' },
  4: { label: 'Highly selective', sat: 1400, gpa: 3.85, satTxt: 'about 1400', gpaTxt: 'about 3.85' },
  3: { label: 'Selective', sat: 1270, gpa: 3.7, satTxt: 'about 1250–1300', gpaTxt: 'about 3.7' },
  2: { label: 'Moderately selective', sat: 1150, gpa: 3.5, satTxt: 'about 1150', gpaTxt: 'about 3.5' },
  1: { label: 'Accessible', sat: 1050, gpa: 3.2, satTxt: 'about 1050', gpaTxt: 'about 3.2' },
  0: { label: 'Open admission', sat: 0, gpa: 0, satTxt: 'not required', gpaTxt: 'high school diploma' },
};
export const MAJOR_CODE = { cs: 'c', eng: 'e', bus: 'b', health: 'h', arts: 'a', edu: 'd' };
export const MAJOR_NAME = { cs: 'Computer science', eng: 'Engineering', bus: 'Business', health: 'Health and nursing', arts: 'Arts and design', edu: 'Education', undecided: 'Not sure yet' };
export const MAJOR_BY_CODE = { c: 'Computer science', e: 'Engineering', b: 'Business', h: 'Health and nursing', a: 'Arts and design', d: 'Education' };

// College Board, Trends in College Pricing 2025: average published tuition and fees, 2025-26.
export const COST = {
  cc: { amt: 4150, label: 'public 2-year (in-district)' },
  instate: { amt: 11950, label: 'public 4-year (in-state)' },
  oos: { amt: 31880, label: 'public 4-year (out-of-state)' },
  priv: { amt: 45000, label: 'private nonprofit 4-year' },
};
export function costOf(c, homeState) {
  const k = c.tier === 0 ? 'cc' : !c.pub ? 'priv' : c.st === homeState ? 'instate' : 'oos';
  return { k, ...COST[k] };
}
export const fmtK = (n) => '$' + (n >= 10000 ? Math.round(n / 1000) + 'k' : (n / 1000).toFixed(1).replace('.0', '') + 'k');
export const dollarSigns = (n) => (n < 6000 ? '$' : n < 20000 ? '$$' : n < 40000 ? '$$$' : '$$$$');

const ACT2SAT = { 36: 1590, 35: 1540, 34: 1500, 33: 1460, 32: 1430, 31: 1400, 30: 1370, 29: 1340, 28: 1310, 27: 1280, 26: 1240, 25: 1210, 24: 1180, 23: 1140, 22: 1110, 21: 1080, 20: 1040, 19: 1010, 18: 970, 17: 930, 16: 890, 15: 850, 14: 800, 13: 760, 12: 710, 11: 670 };
export function satEq(p) {
  if (p.scoreType === 'sat') return p.sat;
  if (p.scoreType === 'act') return ACT2SAT[p.act] || 600;
  return null;
}
export function fitFor(c, p, gpaOverride) {
  if (c.tier === 0) return 'Likely';
  const T = TIER[c.tier];
  const gpa = gpaOverride ?? (p.gpaUnsure ? 3.3 : p.gpa);
  const sat = satEq(p);
  let d = sat != null ? 0.6 * (sat - T.sat) + 0.4 * ((gpa - T.gpa) * 400) : (gpa - T.gpa) * 400 - 30;
  if (c.pub && c.st === p.state) d += 40; else if (c.pub && c.tier >= 3) d -= 20;
  if (p.major === 'cs' && CS_HARD.has(c.id)) d -= 100;
  if (c.tier === 5) return d >= 0 ? 'Reach' : 'Far reach';
  return d >= 60 ? 'Likely' : d >= -40 ? 'Target' : d >= -150 ? 'Reach' : 'Far reach';
}
export const okFit = (f) => f === 'Target' || f === 'Likely';
