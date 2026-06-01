
    (function() {

      /* enable/disable download button when a select changes */
      window.tpEnableBtn = function(sel, btnId) {
        var btn = document.getElementById(btnId);
        if (btn) btn.disabled = !sel.value;
      };

      /* EAO: populate quarter dropdown after year chosen */
      window.tpEaoYear = function(sel) {
        var yr = sel.value;
        var qSel = document.getElementById('tp-eao-qtr');
        var btn  = document.getElementById('tp-btn-eao');
        btn.disabled = true;
        qSel.innerHTML = '<option value="">Quarter</option>';
        if (!yr) { qSel.disabled = true; return; }
        /* 2020 is missing Q1, so handle edge cases */
        var quarters = {
          '2019': ['Q1 — Mar 31','Q2 — Jun 30','Q3 — Sep 30','Q4 — Dec 31'],
          '2020': ['Q2 — Jun 30','Q3 — Sep 30','Q4 — Dec 31']
        };
        var opts = quarters[yr] || ['Q1 — Mar 31','Q2 — Jun 30','Q3 — Sep 30','Q4 — Dec 31'];
        opts.forEach(function(q) {
          var o = document.createElement('option');
          o.value = q + ', ' + yr;
          o.textContent = q + ', ' + yr;
          qSel.appendChild(o);
        });
        qSel.disabled = false;
        qSel.onchange = function() { btn.disabled = !this.value; };
      };

      /* filter/search */
      var activeFilter = 'all';

      window.tpSetFilter = function(filter, el) {
        activeFilter = filter;
        document.querySelectorAll('.tp-chip').forEach(function(c) { c.classList.remove('active'); });
        el.classList.add('active');
        tpApply();
      };

      window.tpFilter = function() { tpApply(); };

      function tpApply() {
        var query = (document.getElementById('tp-search').value || '').toLowerCase().trim();
        var cards = document.querySelectorAll('#page-transparency .acc-item[data-tp]');
        var visible = 0;
        cards.forEach(function(card) {
          var tag  = card.getAttribute('data-tp') || '';
          var text = card.textContent.toLowerCase();
          var tagMatch    = (activeFilter === 'all' || tag === activeFilter);
          var searchMatch = (!query || text.indexOf(query) !== -1);
          card.style.display = (tagMatch && searchMatch) ? '' : 'none';
          if (tagMatch && searchMatch) visible++;
        });
        var countEl = document.getElementById('tp-count');
        if (countEl) countEl.textContent = visible + (visible === 1 ? ' category' : ' categories');
      }

    })();
    


(function(){
  const TOTAL = 2;
  const INTERVAL = 4000;
  let current = 0, timer, progressTimer, progressVal = 0;
  const track = document.getElementById('heroTrack');
  const bar = document.getElementById('heroProgressBar');
  const dotsEl = document.getElementById('heroDots');

  for(let i=0;i<TOTAL;i++){
    const d = document.createElement('div');
    d.style.cssText=`width:6px;height:6px;border-radius:50%;background:${i===0?'#e8a020':'rgba(255,255,255,0.35)'};cursor:pointer;transition:background 0.2s,transform 0.2s;`;
    d.onclick=()=>goTo(i);
    dotsEl.appendChild(d);
  }

  function goTo(n){
    current=(n+TOTAL)%TOTAL;
    track.style.transform=`translateX(-${current*100}%)`;
    dotsEl.querySelectorAll('div').forEach((d,i)=>{
      d.style.background=i===current?'#e8a020':'rgba(255,255,255,0.35)';
      d.style.transform=i===current?'scale(1.3)':'scale(1)';
    });
    clearInterval(timer); clearInterval(progressTimer);
    progressVal=0; bar.style.width='0%';
    progressTimer=setInterval(()=>{
      progressVal+=100/(INTERVAL/100);
      bar.style.width=Math.min(progressVal,100)+'%';
    },100);
    timer=setInterval(()=>goTo(current+1),INTERVAL);
  }

  document.getElementById('heroPrev').onclick=()=>goTo(current-1);
  document.getElementById('heroNext').onclick=()=>goTo(current+1);
  goTo(0);
})();



const charts = {
  pie: [
    {label:'Primary', val:'7,567 km', pct:48, color:'#2438A6'},
    {label:'Secondary', val:'16,710 km', pct:70, color:'#4C6EF5'},
    {label:'Tertiary', val:'11,439 km', pct:38, color:'#C8D0E8'},
  ],
  cond: [
    {label:'Good', val:'18,200 km', pct:62, color:'#27AE60'},
    {label:'Fair', val:'10,500 km', pct:45, color:'#F39C12'},
    {label:'Poor', val:'7,016 km', pct:30, color:'#E74C3C'},
  ],
  surf: [
    {label:'Concrete', val:'20,400 km', pct:72, color:'#2438A6'},
    {label:'Asphalt', val:'9,800 km', pct:52, color:'#8E44AD'},
    {label:'Gravel', val:'5,516 km', pct:28, color:'#C8D0E8'},
  ]
};

function switchChart(btn, key) {
  document.querySelectorAll('.ctab').forEach(t=>t.classList.remove('active'));
  btn.classList.add('active');
  const area = document.getElementById('chartArea');
  area.innerHTML = charts[key].map(r=>`
    <div class="bar-row">
      <span class="bar-label">${r.label}</span>
      <div class="bar-track"><div class="bar-fill" style="width:0%;background:${r.color};transition:width 0.5s ease;" data-w="${r.pct}"></div></div>
      <span class="bar-val">${r.val}</span>
    </div>`).join('');
  setTimeout(()=>{
    area.querySelectorAll('.bar-fill').forEach(b=>b.style.width=b.dataset.w+'%');
  },30);
}

function setView(btn, view) {
  document.querySelectorAll('.filter-btn').forEach(b=>b.classList.remove('active'));
  btn.classList.add('active');
}

const allRoads = [
  {code:'S06055LZ',name:'Imus-Bacoor Link Rd'},
  {code:'N00001LZ',name:'MacArthur Highway'},
  {code:'N00032LZ',name:'Pan-Philippine Highway'},
  {code:'S04011LZ',name:'Plaridel Bypass Road'},
  {code:'B01756LZ',name:'10th Ave Bridge'},
  {code:'B01612LZ',name:'11th Ave Bridge'},
  {code:'N00055LZ',name:'Maharlika Highway'},
  {code:'S08022LZ',name:'Catangnan Bridge Rd'},
];

function filterRoads(q) {
  const list = document.getElementById('roadList');
  const filtered = q ? allRoads.filter(r=>r.name.toLowerCase().includes(q.toLowerCase())||r.code.toLowerCase().includes(q.toLowerCase())) : allRoads;
  list.innerHTML = filtered.map(r=>`<div class="road-item"><div class="rcode">${r.code}</div><div class="rname">${r.name}</div></div>`).join('');
}



  function filterPPP(status, btn) {
    document.querySelectorAll('#projects-ppp button[onclick]').forEach(b => {
      b.style.background = 'var(--white)';
      b.style.color = 'var(--textlt)';
      b.style.borderColor = 'var(--border)';
    });
    btn.style.background = 'var(--royal)';
    btn.style.color = '#fff';
    btn.style.borderColor = 'var(--royal)';
    document.querySelectorAll('.ppp-card').forEach(card => {
      card.style.display = (status === 'all' || card.dataset.status === status) ? 'flex' : 'none';
    });
  }
  


    (function(){
      const PER_PAGE = 8;
      let currentPage = 1;
      let activeFilter = 'all';
      let activeYear   = null;
      let activeMonth  = null;
      let calYear      = 2026;

      const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
      const MONTH_FULL = ['January','February','March','April','May','June','July','August','September','October','November','December'];

      const data = [
        { id:1,  cat:'advisory', title:'Celebration of the 2026 Ease of Doing Business Month',                                                               date:'2026-04-30', snippet:'DPWH joins nationwide activities in support of the Ease of Doing Business and Efficient Government Service Delivery Month.',                                                                    source:'Central Office',              isNew:true  },
        { id:2,  cat:'info',     title:'Issuance of Highway Travel Permit (HTP)',                                                                             date:'2026-04-30', snippet:'Guidelines on the issuance of highway travel permits for overloaded vehicles and special cargoes along national roads.',                                                                          source:'Central Office',              isNew:true  },
        { id:3,  cat:'info',     title:'List of Contractors\'/Consultants\' Project Engineers Whose Accreditation will Expire this CY 2026',                  date:'2026-04-15', snippet:'All concerned engineers are encouraged to apply for regular accreditation prior to the expiration of their current accreditation.',                                                                  source:'Central Office',              isNew:true  },
        { id:4,  cat:'advisory', title:'Road Closure Advisory along EDSA for Pavement Rehabilitation Works',                                                  date:'2026-04-22', snippet:'Temporary road closure along EDSA from 10PM to 5AM nightly for the duration of pavement rehabilitation works. Motorists are advised to take alternative routes.',                              source:'NCR Regional Office',         isNew:true  },
        { id:5,  cat:'general',  title:'Bidding Documents for Samar-Leyte Corridor Highway Expansion Project Now Available',                                  date:'2026-04-15', snippet:'Interested contractors may obtain the bidding documents at the DPWH Procurement Division during regular office hours.',                                                                          source:'Central Office',              isNew:true  },
        { id:6,  cat:'advisory', title:'North-South Commuter Railway Support Structure Construction Begins in Metro Manila',                                   date:'2026-04-28', snippet:'DPWH begins construction of support structures for the NSCR in Metro Manila. Motorists are advised of lane reductions in affected areas.',                                                      source:'NCR Regional Office',         isNew:true  },
        { id:7,  cat:'exam',     title:'116th Upgrading of Rank of Accredited DPWH Project Engineers and Inspectors',                                         date:'2026-04-20', snippet:'The 116th upgrading of rank of accredited DPWH Project Engineers and Inspectors is hereby announced per Department Order No. 57, s. 2026.',                                                   source:'Central Office',              isNew:true  },
        { id:8,  cat:'info',     title:'Updated Guidelines on the Use of Project Related Expenses under FY 2026 GAA',                                         date:'2026-03-10', snippet:'Department Order No. 40, s. 2026 prescribes updated guidelines on the use of project-related expenses under the FY 2026 General Appropriations Act.',                                         source:'Central Office',              isNew:false },
        { id:9,  cat:'general',  title:'Renaming of DPWH Regional Office IV-B to DPWH Regional Office MIMAROPA Region',                                      date:'2026-03-10', snippet:'In compliance with Republic Act No. 10879, DPWH Regional Office IV-B is officially renamed to DPWH Regional Office MIMAROPA Region.',                                                         source:'Central Office',              isNew:false },
        { id:10, cat:'info',     title:'Institutionalization of the DPWH Permit Issuance Application (PIA)',                                                  date:'2026-02-24', snippet:'The Permit Issuance Application is now institutionalized for processing permits on diggings/excavations and setback clearances along national roads.',                                          source:'Central Office',              isNew:false },
        { id:11, cat:'exam',     title:'Written Exam for DPWH & Contractors\' Materials Engineers Accreditation and DPWH Laboratory Technicians Certification on May 9, 2026', date:'2026-02-24', snippet:'The Bureau of Research and Standards announces a written examination scheduled on May 9, 2026 for accreditation and certification.',                                          source:'Bureau of Research and Standards', isNew:false },
        { id:12, cat:'urgent',   title:'Temporary Unavailability of BRS Materials Testing Services',                                                          date:'2026-03-06', snippet:'The DPWH Bureau of Research and Standards informs the public that its materials testing services are temporarily suspended as the BRS laboratories inside the main building remain non-operational.', source:'Bureau of Research and Standards', isNew:false },
        { id:13, cat:'info',     title:'Advisory on the Pilot Implementation of Field Engineers Accreditation Application (FEAA) System',                     date:'2025-12-17', snippet:'DPWH announces the pilot implementation of the online Field Engineers Accreditation Application system to streamline the accreditation process.',                                          source:'Central Office',              isNew:false },
        { id:14, cat:'exam',     title:'List of Passers of the Contractors\'/Consultants\' Project Engineers Accreditation Exam held on July 2025',            date:'2025-09-25', snippet:'The official list of passers of the contractors\' and consultants\' project engineers accreditation examination is hereby published.',                                                        source:'Central Office',              isNew:false },
        { id:15, cat:'warning',  title:'Beware of Bogus Callers Posing as DPWH Officials',                                                                    date:'2025-09-18', snippet:'We wish to caution all DPWH Offices, contractors, and the public not to fall prey to bogus callers posing as DPWH officials soliciting money or favors.',                                     source:'Public Affairs Office',       isNew:false },
        { id:16, cat:'warning',  title:'Public Advisory on the Misrepresentation of Director Vanessa G. Villanueva',                                           date:'2025-09-16', snippet:'DPWH issues an advisory regarding individuals misrepresenting themselves as Director Villanueva to solicit money or favors from contractors.',                                                 source:'Public Affairs Office',       isNew:false },
        { id:17, cat:'advisory', title:'Road Closure: Quirino Highway Pothole Patching Works',                                                                date:'2025-08-10', snippet:'One lane of Quirino Highway will be closed for pothole patching works from August 11 to August 20, 2025. Motorists are advised to use Mindanao Avenue as an alternate route.',              source:'NCR Regional Office',         isNew:false },
        { id:18, cat:'general',  title:'DPWH Completes Rehabilitation of 12 Flood-Control Pump Stations in NCR',                                             date:'2025-07-20', snippet:'The Department of Public Works and Highways has completed the rehabilitation of 12 flood-control pump stations in the National Capital Region ahead of the rainy season.',               source:'NCR Regional Office',         isNew:false },
        { id:19, cat:'info',     title:'Procurement Monitoring Report for FY 2025 Q2 Now Available',                                                          date:'2025-06-30', snippet:'The second quarter procurement monitoring report for FY 2025 is now available for download on the Transparency page.',                                                                          source:'Central Office',              isNew:false },
        { id:20, cat:'exam',     title:'115th Upgrading of Rank of Accredited DPWH Project Engineers and Inspectors',                                         date:'2025-05-12', snippet:'The 115th upgrading of rank of accredited DPWH Project Engineers and Inspectors is hereby announced.',                                                                                    source:'Central Office',              isNew:false },
      ];

      function parseDate(s) { return new Date(s + 'T00:00:00'); }
      function fmtDay(s)    { return parseDate(s).getDate(); }
      function fmtMon(s)    { return MONTHS[parseDate(s).getMonth()]; }
      function fmtYear(s)   { return parseDate(s).getFullYear(); }
      function fmtFull(s)   { return parseDate(s).toLocaleDateString('en-PH',{year:'numeric',month:'long',day:'numeric'}); }

      const catMeta = {
        all:      { label:'All Categories',        dot:'var(--navy)'   },
        urgent:   { label:'Urgent',                dot:'#E53E3E'       },
        advisory: { label:'Advisory',              dot:'var(--orange)' },
        exam:     { label:'Exam / Accreditation',  dot:'#8E44AD'       },
        warning:  { label:'Warning',               dot:'#E74C3C'       },
        info:     { label:'Information',           dot:'var(--blue)'   },
        general:  { label:'General',               dot:'var(--royal)'  },
      };
      const catLabel = { urgent:'Urgent', advisory:'Advisory', exam:'Exam / Accreditation', warning:'Warning', info:'Information', general:'General' };

      /*  build calendar month grid  */
      function buildCalGrid() {
        const grid = document.getElementById('ann-month-grid');
        document.getElementById('ann-cal-year').textContent = calYear;
        grid.innerHTML = '';
        const yearData = data.filter(r => parseDate(r.date).getFullYear() === calYear);
        // apply category filter for dot display
        MONTHS.forEach(function(m, idx) {
          const btn = document.createElement('button');
          btn.className = 'ann-month-btn';
          btn.textContent = m;
          const hasItems = yearData.some(r => parseDate(r.date).getMonth() === idx);
          if (hasItems) btn.classList.add('has-items');
          else btn.classList.add('empty');
          if (activeYear === calYear && activeMonth === idx) btn.classList.add('active');
          btn.onclick = function() {
            if (!hasItems) return;
            if (activeYear === calYear && activeMonth === idx) {
              annClearDate();
            } else {
              activeYear  = calYear;
              activeMonth = idx;
              currentPage = 1;
              annApply();
            }
          };
          grid.appendChild(btn);
        });
        // update nav arrows
        const years = [...new Set(data.map(r => parseDate(r.date).getFullYear()))].sort();
        document.getElementById('ann-yr-prev').disabled = calYear <= 2000;
        document.getElementById('ann-yr-next').disabled = calYear >= Math.max(...years);
      }

      /*  build category filter list  */
      function buildFilterList() {
        const list = document.getElementById('ann-filter-list');
        list.innerHTML = '';
        Object.keys(catMeta).forEach(function(cat) {
          const count = cat === 'all' ? data.length : data.filter(r => r.cat === cat).length;
          if (cat !== 'all' && count === 0) return;
          const row = document.createElement('div');
          row.className = 'ann-filter-row' + (activeFilter === cat ? ' active' : '');
          row.innerHTML =
            '<div class="ann-filter-left">' +
              '<span class="ann-filter-dot" style="background:' + catMeta[cat].dot + ';"></span>' +
              '<span class="ann-filter-label">' + catMeta[cat].label + '</span>' +
            '</div>' +
            '<span class="ann-filter-count">' + count + '</span>';
          row.onclick = function() {
            activeFilter = cat;
            currentPage  = 1;
            annApply();
          };
          list.appendChild(row);
        });
      }

      /*  filtered + sorted dataset  */
      function filtered() {
        const q    = (document.getElementById('ann-search').value || '').toLowerCase().trim();
        const sort = document.getElementById('ann-sort').value;
        let rows = data.filter(function(r) {
          const d = parseDate(r.date);
          const catMatch  = activeFilter === 'all' || r.cat === activeFilter;
          const dateMatch = (activeYear === null) || (d.getFullYear() === activeYear && d.getMonth() === activeMonth);
          const qMatch    = !q || r.title.toLowerCase().includes(q) || r.snippet.toLowerCase().includes(q) || r.source.toLowerCase().includes(q);
          return catMatch && dateMatch && qMatch;
        });
        rows.sort(function(a,b){
          return sort === 'newest'
            ? parseDate(b.date) - parseDate(a.date)
            : parseDate(a.date) - parseDate(b.date);
        });
        return rows;
      }

      /*  render  */
      function renderPage() {
        buildCalGrid();
        buildFilterList();

        // date pill
        const pill = document.getElementById('ann-date-pill');
        const pillLabel = document.getElementById('ann-date-pill-label');
        if (activeYear !== null) {
          pillLabel.textContent = MONTH_FULL[activeMonth] + ' ' + activeYear;
          pill.classList.add('show');
        } else {
          pill.classList.remove('show');
        }

        const rows  = filtered();
        const total = rows.length;
        const pages = Math.max(1, Math.ceil(total / PER_PAGE));
        if (currentPage > pages) currentPage = 1;
        const slice = rows.slice((currentPage-1)*PER_PAGE, currentPage*PER_PAGE);

        document.getElementById('ann-count').innerHTML =
          'Showing <strong>' + total + '</strong> announcement' + (total===1?'':'s');

        const listEl  = document.getElementById('ann-list');
        const emptyEl = document.getElementById('ann-empty');
        listEl.innerHTML = '';
        emptyEl.style.display = slice.length === 0 ? 'block' : 'none';

        slice.forEach(function(r) {
          const card = document.createElement('div');
          card.className = 'ann-card ' + r.cat;
          card.innerHTML =
            '<div class="ann-card-left">' +
              '<div class="ann-date-day">'  + fmtDay(r.date)  + '</div>' +
              '<div class="ann-date-mon">'  + fmtMon(r.date)  + '</div>' +
              '<div class="ann-date-year">' + fmtYear(r.date) + '</div>' +
            '</div>' +
            '<div style="flex:1;min-width:0;">' +
              '<div class="ann-card-body">' +
                '<div class="ann-card-top">' +
                  '<span class="ann-badge ' + r.cat + '">' + catLabel[r.cat] + '</span>' +
                  (r.isNew ? '<span class="ann-new-tag">New</span>' : '') +
                '</div>' +
                '<div class="ann-card-title">' + r.title + '</div>' +
                '<div class="ann-card-snippet">' + r.snippet + '</div>' +
                '<div class="ann-card-footer">' +
                  '<span class="ann-card-source">&#128205; ' + r.source + ' &middot; ' + fmtFull(r.date) + '</span>' +
                  '<span class="ann-read-more">Read more &#8594;</span>' +
                '</div>' +
              '</div>' +
              '<div class="ann-card-expanded">' +
                '<p style="margin-bottom:10px;">' + r.snippet + ' Further details will be published in the official gazette and distributed to all concerned offices.</p>' +
                '<p style="color:var(--textlt);font-size:12px;">Source: ' + r.source + ' &middot; ' + fmtFull(r.date) + '</p>' +
              '</div>' +
            '</div>';
          card.addEventListener('click', function(){
            card.classList.toggle('open');
            const rm = card.querySelector('.ann-read-more');
            if (rm) rm.textContent = card.classList.contains('open') ? 'Close \u2191' : 'Read more \u2192';
          });
          listEl.appendChild(card);
        });

        /* pagination */
        const pagEl = document.getElementById('ann-pagination');
        pagEl.innerHTML = '';
        if (pages <= 1) return;
        function mkBtn(label, pg, isActive, isDisabled) {
          const b = document.createElement('button');
          b.className = 'ann-page-btn' + (isActive ? ' active' : '');
          b.textContent = label;
          b.disabled = isDisabled;
          b.onclick = function(){
            currentPage = pg;
            renderPage();
            document.getElementById('page-announcements').scrollIntoView({behavior:'smooth'});
          };
          return b;
        }
        pagEl.appendChild(mkBtn('Prev', currentPage-1, false, currentPage===1));
        for (let i=1; i<=pages; i++) {
          if (i===1 || i===pages || (i>=currentPage-1 && i<=currentPage+1)) {
            pagEl.appendChild(mkBtn(String(i), i, i===currentPage, false));
          } else if (i===currentPage-2 || i===currentPage+2) {
            const d = document.createElement('span');
            d.textContent = '\u2026';
            d.style.cssText = 'display:flex;align-items:center;color:var(--textlt);font-size:14px;padding:0 4px;';
            pagEl.appendChild(d);
          }
        }
        pagEl.appendChild(mkBtn('Next', currentPage+1, false, currentPage===pages));
      }

      /*  public API  */
      window.annYearNav = function(dir) {
        const years = [...new Set(data.map(r => parseDate(r.date).getFullYear()))].sort();
        const newY = calYear + dir;
        if (newY < 2000 || newY > Math.max(...years)) return;
        calYear = newY;
        renderPage();
      };
      window.annClearDate = function() {
        activeYear  = null;
        activeMonth = null;
        currentPage = 1;
        renderPage();
      };
      window.annApply = function() {
        currentPage = 1;
        renderPage();
      };

      /* init: default calYear to latest year in data */
      calYear = Math.max(...data.map(r => parseDate(r.date).getFullYear()));
      renderPage();
    })();
    


(function() {
  const PER_PAGE = 6;
  let currentPage  = 1;
  let activeRegion = 'all';
  let activeYear   = 'all';
  let activeMonth  = 'all';
  let activeCat    = 'all';

  const MONTHS_SHORT = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const MONTHS_FULL  = ['January','February','March','April','May','June','July','August','September','October','November','December'];

  const REGION_LABELS = {
    all:   'All Regions',
    NAT:   'National',
    NCR:   'National Capital Region',
    CAR:   'Cordillera Administrative Region',
    I:     'Region I',
    II:    'Region II',
    III:   'Region III',
    'IV-A':'Region IV-A',
    V:     'Region V',
    VI:    'Region VI',
    NIR:   'Negros Island Region',
    VII:   'Region VII',
    VIII:  'Region VIII',
    IX:    'Region IX',
    X:     'Region X',
    XI:    'Region XI',
    XII:   'Region XII',
    XIII:  'Region XIII',
    'IV-B':'MIMAROPA Region',
    BARMM: 'BARMM',
  };

    const catMeta = {
      construction: { label: 'Construction',      cls: 'badge-construction' },
      flood:        { label: 'Flood Control',      cls: 'badge-flood' },
      roads:        { label: 'Roads & Bridges',    cls: 'badge-roads' },
      projects:     { label: 'Major Projects',     cls: 'badge-projects' },
      advisory:     { label: 'Advisory',           cls: 'badge-advisory' },
      schools:      { label: 'School Buildings',   cls: 'badge-schools' },
    };

    const articles = [
      { id:13, cat:'flood',        region:'NCR',   date:'2026-05-25', title:'PBBM: Flood Control Interventions sa G. Araneta Ave., Operational na Bago ang Tag-Ulan', excerpt:'Mas malaking drainage, paglalagay ng mobile pumps, at paglilinis sa ilog, mapapahupa ang lagpas-tao ng baha ...', source:'Central Office', thumb:'images/05-25_g_araneta.jpg' },
      { id:14, cat:'flood',        region:'NCR',   date:'2026-05-23', title:'PBBM, Iniutos ang Paglilinis, Dredging ng Baradong Villanueva Creek sa BF Homes, Paranaque', excerpt:'Clearing at dredging operations, maiibsan ang matinding baha sa lugar ...', source:'NCR Regional Office', thumb:'' },
      { id:15, cat:'flood',        region:'III',   date:'2026-05-20', title:'PBBM: ‘Ampaw’ na Dike sa Calumpit, Bulacan, Palitan ng Mas Mataas, Matibay na River Control', excerpt:'Proyektong ininspeksyon ng Pangulo noong naakaraang taon, matatapos sa 2027 ...', source:'Region III Office', thumb:'images/0520_-_brgy_calizon_calumpit.jpg' },
      { id:16, cat:'roads',        region:'I',     date:'2026-05-10', title:'PBBM: Mas Matibay na Kaliwet Bridge sa Ilocos Sur, Kailangang Matapos Ngayong Mayo', excerpt:'Mas matibay na tulay ang itinatayo bilang bahagi ng proyektong magdudugtong sa mga probinsya ...', source:'Region I Office', thumb:'images/05-10_kaliwet.jpg' },
      { id:17, cat:'roads',        region:'CAR',   date:'2026-05-09', title:'PBBM sa DPWH: Gumuhong Bahagi ng Marcos Highway sa Tuba, Benguet, Ayusin Agad', excerpt:'Agad na ipinag-utos ng Pangulo ang rehabilitasyon at pagsasaayos sa gumuhong bahagi ng Marcos Highway sa Tuba, Benguet para sa kaligtasan ng mga biyahero.', source:'CAR Regional Office', thumb:'images/05-09_brgy_taloy_sur_tuba_benguet.jpg' },
      { id:18, cat:'roads',        region:'V',     date:'2026-05-03', title:'Kahabaan ng Maharlika Highway sa Brgy. Morera, Albay, Maayos Nang Nadaraanan ng Motorista, Komyuter', excerpt:'Ganap nang nadaraanan ng lahat ng uri ng sasakyan ang bahagi ng Maharlika Highway sa Guinobatan, Albay matapos ang isinagawang clearing operations.', source:'Region V Office', thumb:'' },
      { id:1,  cat:'projects',     region:'NCR',   date:'2026-04-29', title:'Secretary Unveils New 5-Year Infrastructure Masterplan',                      excerpt:'Secretary presents the new infrastructure masterplan targeting all major island groups, covering roads, bridges, flood control, and building programs through 2031.',                                source:'Central Office',      thumb:'' },
      { id:2,  cat:'flood',        region:'NCR',   date:'2026-04-20', title:'DPWH Completes Rehabilitation of 12 Flood-Control Pump Stations in NCR',      excerpt:'The Department has completed ahead of schedule the rehabilitation of 12 flood-control pump stations across Metro Manila in preparation for the rainy season.',                                      source:'NCR Regional Office', thumb:'' },
      { id:3,  cat:'roads',        region:'XI',    date:'2026-04-11', title:'Davao Coastal Road Project Phase 2 Inaugurated',                               excerpt:'Phase 2 of the Davao Coastal Road has been inaugurated, expected to benefit around 200,000 residents daily.',                                                                                    source:'Region XI Office',    thumb:'' },
      { id:4,  cat:'construction', region:'NCR',   date:'2026-04-28', title:'DPWH Begins Construction of NSCR Support Structures in Metro Manila',          excerpt:'Construction of viaduct support structures for the North-South Commuter Railway has commenced at key points in Metro Manila.',                                                                        source:'NCR Regional Office', thumb:'' },
      { id:5,  cat:'advisory',     region:'NCR',   date:'2026-04-22', title:'Road Closure Advisory: EDSA Pavement Rehabilitation',                          excerpt:'Temporary nightly closures along EDSA are in effect for pavement rehabilitation works. Motorists are advised to use alternative routes from 10PM to 5AM.',                                      source:'NCR Regional Office', thumb:'' },
      { id:6,  cat:'roads',        region:'VIII',  date:'2026-04-15', title:'Bidding for Samar-Leyte Corridor Highway Expansion Now Open',                  excerpt:'Bidding documents for the Samar-Leyte corridor highway expansion project are now available at the DPWH Procurement Division.',                                                                    source:'Region VIII Office',  thumb:'' },
      { id:7,  cat:'schools',      region:'III',   date:'2026-03-18', title:'DPWH Turns Over 240 School Buildings Under BEFF Program in Central Luzon',    excerpt:'A total of 240 school buildings were turned over to DepEd in Central Luzon, improving learning conditions for thousands of students.',                                                                source:'Region III Office',   thumb:'' },
      { id:8,  cat:'flood',        region:'VI',    date:'2026-03-05', title:'Flood Mitigation Works Along Jalaur River Now 80% Complete',                   excerpt:'The Jalaur River flood mitigation project in Iloilo is now 80 percent complete, with final channel lining and embankment works ongoing.',                                                         source:'Region VI Office',    thumb:'' },
      { id:9,  cat:'construction', region:'VII',   date:'2026-02-20', title:'Cebu-Mactan 3rd Bridge: Superstructure Works Reach 60% Completion',           excerpt:'Superstructure works on the third bridge connecting Cebu and Mactan Island have reached 60 percent completion, with full opening targeted by end of 2027.',                                      source:'Region VII Office',   thumb:'' },
      { id:10, cat:'projects',     region:'XI',    date:'2026-02-10', title:'Mindanao Railway Project Track-Laying Begins in Davao Segment',               excerpt:'Track-laying for the Mindanao Railway Project Tagum-Davao-Digos segment has officially begun.',                                                                                                   source:'Region XI Office',    thumb:'' },
      { id:11, cat:'roads',        region:'I',     date:'2025-12-15', title:'La Union Coastal Road Extension Completed Ahead of Schedule',                  excerpt:'The La Union Coastal Road extension project was completed three months ahead of schedule, opening a new scenic route along the Ilocos coastline.',                                               source:'Region I Office',     thumb:'' },
      { id:12, cat:'schools',      region:'X',     date:'2025-11-28', title:'300 Classrooms Completed in Northern Mindanao Under School Building Program', excerpt:'DPWH Region X has completed 300 new classrooms across 45 public schools in Northern Mindanao.',                                                                                                   source:'Region X Office',     thumb:'' }
    ];

    function parseDate(s) { return new Date(s + 'T00:00:00'); }

    function buildFilterGroup(containerId, items, activeVal, onSelect) {
      const el = document.getElementById(containerId);
      if (!el) return;
      el.innerHTML = '';
      items.forEach(function(item) {
        const row = document.createElement('div');
        row.className = 'ns-filter-row' + (activeVal === item.value ? ' active' : '');
        row.innerHTML =
          '<span class="ns-filter-label">' + item.label + '</span>' +
          '<span class="ns-filter-count">' + item.count + '</span>';
        row.onclick = function() { onSelect(item.value); currentPage = 1; renderPage(); };
        el.appendChild(row);
      });
    }

    function buildSidebar() {
      const regionCounts = {};
      articles.forEach(function(a) { regionCounts[a.region] = (regionCounts[a.region] || 0) + 1; });
      const regionItems = [{ value:'all', label:'All Regions', count: articles.length }];
      Object.keys(REGION_LABELS).forEach(function(k) {
        if (k !== 'all') regionItems.push({ value:k, label:REGION_LABELS[k], count:regionCounts[k] || 0 });
      });
      buildFilterGroup('news-region-group', regionItems, activeRegion, function(v){ activeRegion = v; });

      const yearCounts = {};
      articles.forEach(function(a) { const y = String(parseDate(a.date).getFullYear()); yearCounts[y] = (yearCounts[y]||0)+1; });
      const yearItems = [{ value:'all', label:'All Years', count: articles.length }];
      var allYears = [2026, 2025, 2024, 2023, 2022];
      allYears.forEach(function(y) { yearItems.push({ value:String(y), label:String(y), count:yearCounts[String(y)] || 0 }); });
      buildFilterGroup('news-year-group', yearItems, activeYear, function(v){ activeYear = v; });

      const monthCounts = {};
      articles.forEach(function(a) { const m = String(parseDate(a.date).getMonth()); monthCounts[m] = (monthCounts[m]||0)+1; });
      const monthItems = [{ value:'all', label:'All Months', count: articles.length }];
      for (var i = 11; i >= 0; i--) { monthItems.push({ value:String(i), label:MONTHS_FULL[i], count:monthCounts[String(i)] || 0 }); }
      buildFilterGroup('news-month-group', monthItems, activeMonth, function(v){ activeMonth = v; });

      const catCounts = {};
      articles.forEach(function(a) { catCounts[a.cat] = (catCounts[a.cat]||0)+1; });
      const catItems = [{ value:'all', label:'All Categories', count: articles.length }];
      Object.keys(catMeta).forEach(function(k) { if (catCounts[k]) catItems.push({ value:k, label:catMeta[k].label, count:catCounts[k] }); });
      buildFilterGroup('news-cat-group', catItems, activeCat, function(v){ activeCat = v; });
    }

    function filtered() {
    const q    = (document.getElementById('news-search').value || '').toLowerCase().trim();
    const sort = document.getElementById('news-sort').value;
    let rows = articles.filter(function(a) {
      const d         = parseDate(a.date);
      const regionOk  = activeRegion === 'all' || a.region === activeRegion;
      const yearOk    = activeYear   === 'all' || String(d.getFullYear()) === activeYear;
      const monthOk   = activeMonth  === 'all' || String(d.getMonth())    === activeMonth;
      const catOk     = activeCat    === 'all' || a.cat === activeCat;
      const qOk       = !q || a.title.toLowerCase().includes(q) || a.excerpt.toLowerCase().includes(q) || a.source.toLowerCase().includes(q);
      return regionOk && yearOk && monthOk && catOk && qOk;
    });
    rows.sort(function(a, b) {
      return sort === 'newest'
        ? parseDate(b.date) - parseDate(a.date)
        : parseDate(a.date) - parseDate(b.date);
    });
    return rows;
  }

  function fmtDate(s) {
    return parseDate(s).toLocaleDateString('en-PH', { year:'numeric', month:'long', day:'numeric' });
  }

  function thumbHTML(a, large) {
    if (a.thumb) {
      return '<img class="' + (large ? 'news-featured-img' : 'news-card-thumb') + '" src="' + a.thumb + '" alt="" loading="lazy">';
    }
    var cls  = large ? 'news-featured-img-placeholder' : 'news-card-thumb-placeholder';
    var icon = a.cat === 'flood' ? '&#127754;' : a.cat === 'schools' ? '&#127968;' : a.cat === 'roads' ? '&#128739;&#65039;' : '&#127959;&#65039;';
    return '<div class="' + cls + '"><span>' + icon + '</span></div>';
  }

  function badgeHTML(a) {
    var m = catMeta[a.cat] || { label: a.cat, cls: 'badge-construction' };
    return '<span class="news-cat-badge ' + m.cls + '">' + m.label + '</span>';
  }

  function renderPage() {
    buildSidebar();

    // Active filter pill
    var pill      = document.getElementById('news-active-pill');
    var pillLabel = document.getElementById('news-pill-label');
    var pillText  = '';
    if      (activeRegion !== 'all') pillText = REGION_LABELS[activeRegion] || activeRegion;
    else if (activeYear   !== 'all') pillText = activeYear;
    else if (activeMonth  !== 'all') pillText = MONTHS_FULL[Number(activeMonth)];
    else if (activeCat    !== 'all') pillText = catMeta[activeCat] ? catMeta[activeCat].label : activeCat;

    if (pillText) { pillLabel.textContent = pillText; pill.classList.add('show'); }
    else          { pill.classList.remove('show'); }

    var rows  = filtered();
    var total = rows.length;
    document.getElementById('news-count').innerHTML =
      'Showing <strong>' + total + '</strong> article' + (total === 1 ? '' : 's');

    var featuredSlot = document.getElementById('news-featured-slot');
    var grid         = document.getElementById('news-grid');
    var empty        = document.getElementById('news-empty');

    if (total === 0) {
      featuredSlot.innerHTML = '';
      grid.innerHTML         = '';
      empty.style.display    = 'block';
      document.getElementById('news-pagination').innerHTML = '';
      return;
    }
    empty.style.display = 'none';

    // Page 1: first item as featured hero + up to 5 in grid
    // Other pages: up to 6 in grid
    var featured, gridItems;
    if (currentPage === 1) {
      featured  = rows[0];
      gridItems = rows.slice(1, PER_PAGE);
    } else {
      featured  = null;
      var start = (PER_PAGE - 1) + (currentPage - 2) * PER_PAGE + 1;
      gridItems = rows.slice(start, start + PER_PAGE);
    }

    var restAfterPage1 = Math.max(0, total - 1);
    var pages = Math.max(1, 1 + Math.ceil(restAfterPage1 / PER_PAGE));

    // Render featured
    if (featured) {
      featuredSlot.innerHTML =
        '<div class="news-featured" onclick="newsOpen(' + featured.id + ')">' +
          thumbHTML(featured, true) +
          '<div class="news-featured-body">' +
            '<div class="news-featured-top">' +
              '<span class="news-cat-badge badge-featured-tag">Featured</span>' +
              badgeHTML(featured) +
              '<span class="news-featured-date">&#128205; ' + (REGION_LABELS[featured.region] || featured.region) + ' &nbsp;&middot;&nbsp; ' + fmtDate(featured.date) + '</span>' +
            '</div>' +
            '<div class="news-featured-title">' + featured.title + '</div>' +
            '<div class="news-featured-excerpt">' + featured.excerpt + '</div>' +
            '<div class="news-featured-footer">' +
              '<span class="news-source-tag">Source: ' + featured.source + '</span>' +
              '<button class="news-read-btn">Read Full Article &#8594;</button>' +
            '</div>' +
          '</div>' +
        '</div>';
    } else {
      featuredSlot.innerHTML = '';
    }

    // Render grid
    grid.innerHTML = '';
    gridItems.forEach(function(a) {
      var card       = document.createElement('div');
      card.className = 'news-card';
      card.setAttribute('onclick', 'newsOpen(' + a.id + ')');
      card.innerHTML =
        thumbHTML(a, false) +
        '<div class="news-card-body">' +
          '<div class="news-card-top">' +
            badgeHTML(a) +
            '<span class="news-card-date">' + fmtDate(a.date) + '</span>' +
          '</div>' +
          '<div class="news-card-title">'   + a.title  + '</div>' +
          '<div class="news-card-excerpt">' + a.excerpt + '</div>' +
          '<div class="news-card-footer">' +
            '<span class="news-card-source">&#128205; ' + (REGION_LABELS[a.region] || a.region) + '</span>' +
            '<span class="news-card-link">Read more &#8594;</span>' +
          '</div>' +
        '</div>';
      grid.appendChild(card);
    });

    // Pagination
    var pagEl = document.getElementById('news-pagination');
    pagEl.innerHTML = '';
    if (pages <= 1) return;
    function mkBtn(label, pg, isActive, isDisabled) {
      var b       = document.createElement('button');
      b.className = 'news-page-btn' + (isActive ? ' active' : '');
      b.innerHTML = label;
      b.disabled  = isDisabled;
      b.onclick   = function() {
        currentPage = pg;
        renderPage();
        document.getElementById('page-news').scrollIntoView({ behavior: 'smooth' });
      };
      return b;
    }
    pagEl.appendChild(mkBtn('Prev', currentPage - 1, false, currentPage === 1));
    for (var i = 1; i <= pages; i++) {
      if (i === 1 || i === pages || (i >= currentPage - 1 && i <= currentPage + 1)) {
        pagEl.appendChild(mkBtn(String(i), i, i === currentPage, false));
      } else if (i === currentPage - 2 || i === currentPage + 2) {
        var dot = document.createElement('span');
        dot.textContent  = '\u2026';
        dot.style.cssText = 'display:flex;align-items:center;color:var(--textlt);font-size:14px;padding:0 4px;';
        pagEl.appendChild(dot);
      }
    }
    pagEl.appendChild(mkBtn('Next &#8594;', currentPage + 1, false, currentPage === pages));
  }

  // Public API
  window.newsApply = function() { currentPage = 1; renderPage(); };
  window.newsClearFilter = function() {
    activeRegion = 'all'; activeYear = 'all'; activeMonth = 'all'; activeCat = 'all';
    currentPage = 1;
    renderPage();
  };
  window.newsOpen = function(id) {
    const article = articles.find(function(a) { return a.id === id; });
    if (!article) return;

    // Create modal element
    const backdrop = document.createElement('div');
    backdrop.className = 'news-modal-backdrop';
    
    // Generate text paragraph based on category/title to make it look like a real full article
    let fullTextHTML = '<p>' + article.excerpt + '</p>';
    if (article.cat === 'flood') {
      fullTextHTML += '<p>Ang proyektong ito ay bahagi ng pinaigting na hakbang ng administrasyon at ng Department of Public Works and Highways (DPWH) upang tugunan ang mga suliranin sa pagbaha sa iba\'t ibang kritikal na lugar sa bansa, lalo na ngayong paparating na ang panahon ng tag-ulan.</p>' +
      '<p>Ayon sa pamunuan ng DPWH, patuloy ang pakikipagtulungan sa mga lokal na pamahalaan at iba pang ahensya upang masiguro na ang lahat ng flood mitigation structures ay operational at handa sa anumang banta ng kalamidad. Inaasahan na ang mga proyektong ito ay magbibigay ng pangmatagalang proteksyon sa libu-libong pamilya at ari-arian sa mga apektadong komunidad.</p>';
    } else if (article.cat === 'roads') {
      fullTextHTML += '<p>Layunin ng proyektong ito na mapabilis ang biyahe at mapabuti ang koneksyon ng mga karatig-bayan at lalawigan. Ito ay inaasahang magpapalago ng lokal na ekonomiya sa pamamagitan ng mas mabilis na transportasyon ng mga produkto at serbisyo.</p>' +
      '<p>Ipinahayag ng DPWH na mahigpit ang kanilang pagbabantay sa kalidad at timeline ng pagpapatayo ng imprastrukturang ito upang masigurong ligtas at matibay ang daan para sa lahat ng motorista at mamamayan.</p>';
    } else {
      fullTextHTML += '<p>Ito ay bahagi ng malawakang programa ng pamahalaan para sa modernisasyon at pagpapabuti ng mga pampublikong pasilidad sa bansa. Patuloy na makikipagtulungan ang ahensya sa mga stakeholders upang masigurong natutugunan ang mga pangangailangan ng mamamayan sa lalong madaling panahon.</p>';
    }

    const imgHTML = article.thumb 
      ? '<img class="news-modal-img" src="' + article.thumb + '" alt="' + article.title + '">'
      : '<div class="news-modal-img-placeholder"><span>' + (article.cat === 'flood' ? '&#127754;' : article.cat === 'schools' ? '&#127968;' : article.cat === 'roads' ? '&#128739;&#65039;' : '&#127959;&#65039;') + '</span></div>';

    backdrop.innerHTML =
      '<div class="news-modal">' +
        '<button class="news-modal-close" aria-label="Close modal">&#x2715;</button>' +
        '<div class="news-modal-body">' +
          imgHTML +
          '<div class="news-modal-content">' +
            '<div class="news-modal-meta">' +
              badgeHTML(article) +
              '<span class="news-modal-date">&#128205; ' + (REGION_LABELS[article.region] || article.region) + ' &nbsp;&middot;&nbsp; ' + fmtDate(article.date) + '</span>' +
            '</div>' +
            '<h2 class="news-modal-title">' + article.title + '</h2>' +
            '<div class="news-modal-text">' +
              fullTextHTML +
              '<div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid var(--border); font-size: 12.5px; color: var(--muted);">' +
                '<strong>Source:</strong> ' + article.source +
              '</div>' +
            '</div>' +
          '</div>' +
        '</div>' +
      '</div>';

    document.body.appendChild(backdrop);
    
    // Trigger animations
    setTimeout(function() {
      backdrop.classList.add('open');
    }, 10);

    // Close logic
    const closeModal = function() {
      backdrop.classList.remove('open');
      setTimeout(function() {
        backdrop.remove();
      }, 200);
    };

    backdrop.querySelector('.news-modal-close').onclick = closeModal;
    backdrop.onclick = function(e) {
      if (e.target === backdrop) closeModal();
    };
  };
  window.newsToggleGroup = function(btn) {
    btn.classList.toggle('open');
    btn.nextElementSibling.classList.toggle('open');
  };

renderPage();
})();



  // Array of image URLs (replace with your actual image paths)
  const carouselImages = [
    'images/pig1.png',
    'images/piga1.png',
    'images/piger2.jpeg',
    'images/pigerka.jpg',
    'images/pigrin.jpg',
    'images/pigtao.jpeg',

  ];

  let currentIndex = 0;
  const hero = document.getElementById('hero-carousel');

  function updateHeroBackground() {
    hero.style.setProperty('--hero-bg', `url('${carouselImages[currentIndex]}')`);
    currentIndex = (currentIndex + 1) % carouselImages.length;
  }

  // Initial background
  updateHeroBackground();

  setInterval(updateHeroBackground, 5000);

  // Set the background using a CSS variable for smooth transition
  hero.style.position = 'relative';
  hero.style.zIndex = 1;
  hero.style.setProperty('transition', 'background-image 0.8s ease');
  hero.style.setProperty('background-size', 'cover');
  hero.style.setProperty('background-position', 'center');
  hero.style.setProperty('background-repeat', 'no-repeat');

  // Listen for variable changes and apply as background
  const observer = new MutationObserver(() => {
    hero.style.backgroundImage = hero.style.getPropertyValue('--hero-bg');
  });
  observer.observe(hero, { attributes: true, attributeFilter: ['style'] });



/*  Modal helpers for References page  */
function openDeoModal()     { document.getElementById('modal-deo').classList.add('open'); }
function openRbsModal()     { document.getElementById('modal-rbs').classList.add('open'); }
function openRoadModal()    { document.getElementById('modal-road').classList.add('open'); }
function openBridgeModal()  { document.getElementById('modal-bridge').classList.add('open'); }
function openStreamsModal()  { document.getElementById('modal-streams').classList.add('open'); }

function closeRefModal(id) {
  document.getElementById(id).classList.remove('open');
}

/* Close modal on backdrop click */
document.querySelectorAll('.ref-modal-backdrop').forEach(function(backdrop) {
  backdrop.addEventListener('click', function(e) {
    if (e.target === backdrop) backdrop.classList.remove('open');
  });
});

/* Close modal on Escape key */
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') {
    document.querySelectorAll('.ref-modal-backdrop.open').forEach(function(m) {
      m.classList.remove('open');
    });
  }
});



          (function(){

            /*  DATA  */
            const doData = [
              { series:"2026", no:"60", title:"Blacklisting for One (1) Year of DYZ CONSTRUCTION SERVICES", date:"April 27, 2026", supersedes:"---", url:"https://www.dpwh.gov.ph/DPWH/sites/default/files/issuances/do_060_s2026.pdf" },
              { series:"2026", no:"59", title:"Blacklisting of YPR Gen. Contractor and Construction Supply, Inc.", date:"April 13, 2026", supersedes:"---", url:"https://www.dpwh.gov.ph/DPWH/sites/default/files/issuances/do_059_s2026.pdf" },
              { series:"2026", no:"58", title:"Policy Guidelines on the Implementation of the National Road Traffic Survey Program (NRTSP)", date:"April 20, 2026", supersedes:"DO_166_s2003, DO_028_s2006", url:"https://www.dpwh.gov.ph/DPWH/sites/default/files/issuances/do_058_s2026.pdf" },
              { series:"2026", no:"57", title:"116th Upgrading of Rank of Accredited DPWH Project Engineers and Inspectors", date:"April 20, 2026", supersedes:"---", url:"https://www.dpwh.gov.ph/DPWH/sites/default/files/issuances/do_057_s2026.pdf" },
              { series:"2026", no:"56", title:"116th Partial List of Initial Accreditation of DPWH Project Engineers and Inspectors", date:"April 20, 2026", supersedes:"---", url:"https://www.dpwh.gov.ph/DPWH/sites/default/files/issuances/do_056_s2026.pdf" },
              { series:"2026", no:"55", title:"Reconstitution of the DPWH Committee on Social Affairs and Professional/Corporate Standards", date:"April 21, 2026", supersedes:"DO_014_s2024", url:"https://www.dpwh.gov.ph/DPWH/sites/default/files/issuances/do_055_s2026.pdf" },
              { series:"2026", no:"54", title:"Designation of the Undersecretary for Information Management Service (IMS) as DPWH Chief Information Officer (CIO) and the Director for IMS as DPWH Alternate CIO", date:"April 16, 2026", supersedes:"---", url:"https://www.dpwh.gov.ph/DPWH/sites/default/files/issuances/do_054_s2026.pdf" },
              { series:"2026", no:"53", title:"Policy Guidelines on the Implementation of DPWH Anti-Truck Overloading Operations", date:"April 14, 2026", supersedes:"DO_045_s2025", url:"https://www.dpwh.gov.ph/DPWH/sites/default/files/issuances/do_053_s2026.pdf" },
              { series:"2026", no:"52", title:"Amending the Department Order (D.O) No. 79, Series of 2025, Reconfiguration of the Nomenclature of Roads Subject to Functional Reclassification Following the Review Conducted under the Road Network of Zamboanga del Norte 2nd, Zamboanga del Norte 3rd. Zamboanga del Sur 1st & 2nd and Zamboanga Sibugay 1st & 2nd District Engineering Offices (DEOs), Region IX", date:"April 14, 2026", supersedes:"---", url:"https://www.dpwh.gov.ph/DPWH/sites/default/files/issuances/do_052_s2026.pdf" },
              { series:"2026", no:"51", title:"68th Upgrading of Rank of Accredited DPWH Materials Engineers", date:"April 13, 2026", supersedes:"---", url:"https://www.dpwh.gov.ph/DPWH/sites/default/files/issuances/do_051_s2026.pdf" },
              { series:"2026", no:"50", title:"Composition of the Committee on the Grant of Hazard Allowance to Qualified DPWH Personnel Exposed to Hazardous Working Conditions", date:"April 7, 2026", supersedes:"SO_131_s2025", url:"https://www.dpwh.gov.ph/DPWH/sites/default/files/issuances/do_050_s2026.pdf" },
              { series:"2026", no:"49", title:"43rd Partial List on Change of Accreditation Status from DPWH Project Engineers to Contractors'/ Consultants' Project Engineers", date:"April 7, 2026", supersedes:"---", url:"https://www.dpwh.gov.ph/DPWH/sites/default/files/issuances/do_049_s2026.pdf" },
              { series:"2026", no:"47", title:"National Sewerage and Septage Management Program - Program Operations Manual (NSSMP-POM)", date:"March 25, 2026", supersedes:"---", url:"https://www.dpwh.gov.ph/DPWH/sites/default/files/issuances/do_047_s2026.pdf" },
              { series:"2026", no:"46", title:"35th Partial List of Accreditation of DPWH Provisional Materials Engineers", date:"March 17, 2026", supersedes:"---", url:"https://www.dpwh.gov.ph/DPWH/sites/default/files/issuances/do_046_s2026.pdf" },
              { series:"2026", no:"45", title:"30th Partial List of Accreditation of Contractors' and Consultants' Project Engineers", date:"March 17, 2026", supersedes:"---", url:"https://www.dpwh.gov.ph/DPWH/sites/default/files/issuances/do_045_s2026.pdf" },
              { series:"2026", no:"44", title:"146th Partial List of Initial Accreditation of DPWH Materials Engineers", date:"March 17, 2026", supersedes:"---", url:"https://www.dpwh.gov.ph/DPWH/sites/default/files/issuances/do_044_s2026.pdf" },
              { series:"2026", no:"43", title:"Interim Guidelines on the Utilization of Construction Material Prices and Equipment Rental Rates Amid Fuel Price Volatility and its Effect to Project Cost Estimates", date:"March 18, 2026", supersedes:"---", url:"https://www.dpwh.gov.ph/DPWH/sites/default/files/issuances/do_043_s2026.pdf" },
              { series:"2026", no:"42", title:"Renaming of DPWH Regional Office IV-B to DPWH Regional Office MIMAROPA Region in Compliance with Republic Act No. 10879", date:"March 10, 2026", supersedes:"---", url:"https://www.dpwh.gov.ph/DPWH/sites/default/files/issuances/do_042_s2026.pdf" },
              { series:"2026", no:"41", title:"Change of Accreditation Status from DPWH Materials Engineers to Contractors'/Consultants' Materials Engineers", date:"March 10, 2026", supersedes:"---", url:"https://www.dpwh.gov.ph/DPWH/sites/default/files/issuances/do_041_s2026.pdf" },
              { series:"2026", no:"40", title:"Guidelines on the Use of Project Related Expenses under FY 2026 GAA, DPWH Budget", date:"March 10, 2026", supersedes:"DO_007_s2025", url:"https://www.dpwh.gov.ph/DPWH/sites/default/files/issuances/do_040_s2026.pdf" },
              { series:"2026", no:"39", title:"Lifting of the Blacklisting of FREY-FIL CORPORATION", date:"March 10, 2026", supersedes:"DO_174_s2025", url:"https://www.dpwh.gov.ph/DPWH/sites/default/files/issuances/do_039_s2026.pdf" },
              { series:"2026", no:"38", title:"Authorities and Areas of Responsibilities of DPWH Key Officials", date:"March 10, 2026", supersedes:"DO_216_s2025", url:"https://www.dpwh.gov.ph/DPWH/sites/default/files/issuances/do_038_s2026.pdf" },
              { series:"2026", no:"37", title:"Guidelines and Criteria for the Assessment of the Implementation of National Hydrologic Data Collection Program (NHDCP) in DPWH Regional Offices", date:"February 24, 2026", supersedes:"---", url:"https://www.dpwh.gov.ph/DPWH/sites/default/files/issuances/do_037_s2026.pdf" },
              { series:"2026", no:"36", title:"8th Partial List of Accreditation of Contractors' and Consultants' Provisional Project Engineers", date:"March 3, 2026", supersedes:"---", url:"https://www.dpwh.gov.ph/DPWH/sites/default/files/issuances/do_036_s2026.pdf" },
              { series:"2026", no:"35", title:"Guidelines on Request for Authority to Travel Abroad for Personal Reasons", date:"March 5, 2026", supersedes:"DO_021_s2023", url:"https://www.dpwh.gov.ph/DPWH/sites/default/files/issuances/do_035_s2026.pdf" },
              { series:"2026", no:"34", title:"Reclassification of Zamboanga Del Norte 2nd District Engineering Office (DEO) from 2nd Class to 1st Class DEO, Region IX", date:"March 3, 2026", supersedes:"---", url:"https://www.dpwh.gov.ph/DPWH/sites/default/files/issuances/do_034_s2026.pdf" },
              { series:"2026", no:"33", title:"115th Upgrading of Rank of Accredited DPWH Project Engineers and Inspectors", date:"March 3, 2026", supersedes:"---", url:"https://www.dpwh.gov.ph/DPWH/sites/default/files/issuances/do_033_s2026.pdf" },
              { series:"2026", no:"32", title:"18th Partial List of Accreditation of DPWH Provisional Project Engineers and Inspectors", date:"March 3, 2026", supersedes:"---", url:"https://www.dpwh.gov.ph/DPWH/sites/default/files/issuances/do_032_s2026.pdf" },
              { series:"2026", no:"31", title:"42nd Partial List on Change of Accreditation Status from DPWH Project Engineers to Contractors'/ Consultants' Project Engineers", date:"March 3, 2026", supersedes:"---", url:"https://www.dpwh.gov.ph/DPWH/sites/default/files/issuances/do_031_s2026.pdf" },
              { series:"2026", no:"29", title:"Guidelines on the Rendition and Payment of Overtime Services by the Hour", date:"March 3, 2026", supersedes:"DO_003_s2024", url:"https://www.dpwh.gov.ph/DPWH/sites/default/files/issuances/do_029_s2026.pdf" },
              { series:"2026", no:"28", title:"Integration of the Improved Gap Portion of the Talisay-Laurel-Agoncillo Road under the Jurisdiction of the Batangas 3rd District Engineering Office (DEO), Region IV-A", date:"February 26, 2026", supersedes:"---", url:"https://www.dpwh.gov.ph/DPWH/sites/default/files/issuances/do_028_s2026.pdf" },
              { series:"2026", no:"27", title:"Institutionalization of the DPWH Permit Issuance Application (PIA) in the Processing of Permits on Diggings/Excavations and Issuance of Setback Clearance along National Roads", date:"February 24, 2026", supersedes:"---", url:"https://www.dpwh.gov.ph/DPWH/sites/default/files/issuances/do_027_s2026.pdf" },
              { series:"2026", no:"26", title:"Lifting of the Suspension of FFJJ Construction", date:"February 24, 2026", supersedes:"DO_154_s2025", url:"https://www.dpwh.gov.ph/DPWH/sites/default/files/issuances/do_026_s2026.pdf" },
              { series:"2026", no:"25", title:"34th Partial List of Accreditation of DPWH Provisional Materials Engineers", date:"February 23, 2026", supersedes:"---", url:"https://www.dpwh.gov.ph/DPWH/sites/default/files/issuances/do_025_s2026.pdf" },
              { series:"2026", no:"24", title:"Lifting of the Suspension of WELD POWERTOOLS AND CONSTRUCTION CORPORATION", date:"February 19, 2026", supersedes:"DO_212_s2024", url:"https://www.dpwh.gov.ph/DPWH/sites/default/files/issuances/do_024_s2026.pdf" },
              { series:"2026", no:"23", title:"Lifting of the Suspension of STEVEN CONSTRUCTION AND SUPPLY", date:"February 19, 2026", supersedes:"DO_087_s2025", url:"https://www.dpwh.gov.ph/DPWH/sites/default/files/issuances/do_023_s2026.pdf" },
              { series:"2026", no:"22", title:"Lifting of the Suspension of SHEAR CONSTRUCTION AND SUPPLY", date:"February 19, 2026", supersedes:"DO_126_s2025", url:"https://www.dpwh.gov.ph/DPWH/sites/default/files/issuances/do_022_s2026.pdf" },
              { series:"2026", no:"21", title:"Lifting of the Suspension of WERR CORPORATION INTERNATIONAL", date:"February 19, 2026", supersedes:"DO_047_s2025", url:"https://www.dpwh.gov.ph/DPWH/sites/default/files/issuances/do_021_s2026.pdf" },
              { series:"2026", no:"20", title:"Reclassification of National Roads Pursuant to the Functional Classification Review of the Road Network under Various District Engineering Offices (DEOs) in Cordillera Administrative Region (CAR), Region I, and Region II", date:"February 19, 2026", supersedes:"---", url:"https://www.dpwh.gov.ph/DPWH/sites/default/files/issuances/do_020_s2026.pdf" },
              { series:"2026", no:"19", title:"29th Partial List of Accreditation of Contractors' and Consultants' Project Engineers", date:"February 19, 2026", supersedes:"---", url:"https://www.dpwh.gov.ph/DPWH/sites/default/files/issuances/do_019_s2026.pdf" },
              { series:"2026", no:"18", title:"Merit and Performance-Based Reassignment of Regional Directors, Assistant Regional Directors, District Engineers, and Assistant District Engineers", date:"February 19, 2026", supersedes:"---", url:"https://www.dpwh.gov.ph/DPWH/sites/default/files/issuances/do_018_s2026.pdf" },
              { series:"2026", no:"17", title:"Guidelines on the Optimization of Funds for Infrastructure Projects Authorized Under RA 12314 General Appropriations Act of 2026", date:"February 16, 2026", supersedes:"---", url:"https://www.dpwh.gov.ph/DPWH/sites/default/files/issuances/do_017_s2026.pdf" },
              { series:"2026", no:"16", title:"Designation of Responsible Offices for Reportorial and Other Requirements Under the Special Provisions of Republic Act No. 12314 or the General Appropriations Act for Fiscal Year 2026", date:"February 13, 2026", supersedes:"---", url:"https://www.dpwh.gov.ph/DPWH/sites/default/files/issuances/do_016_s2026.pdf" },
              { series:"2026", no:"15", title:"Lifting of the Suspension of E. DAVE CONSTRUCTION", date:"February 11, 2026", supersedes:"DO_049_s2025", url:"https://www.dpwh.gov.ph/DPWH/sites/default/files/issuances/do_015_s2026.pdf" },
              { series:"2026", no:"14", title:"Lifting of the Suspension of E. GARCIA CONSTRUCTION CORPORATION", date:"February 11, 2026", supersedes:"DO_055_s2025", url:"https://www.dpwh.gov.ph/DPWH/sites/default/files/issuances/do_014_s2026.pdf" },
              { series:"2026", no:"13", title:"Wellness Leave Policy", date:"February 3, 2026", supersedes:"---", url:"https://www.dpwh.gov.ph/DPWH/sites/default/files/issuances/do_013_s2026.pdf" },
              { series:"2026", no:"12", title:"Guidelines and Procedures for the Preparation and Standardization of Detailed Unit Price Analysis (GPPSD)", date:"February 3, 2026", supersedes:"---", url:"https://www.dpwh.gov.ph/DPWH/sites/default/files/issuances/do_012_s2026.pdf" },
              { series:"2026", no:"11", title:"Blacklisting for One (1) Year of GABRIEL IMPORT AND EXPORT INC.", date:"January 27, 2026", supersedes:"---", url:"https://www.dpwh.gov.ph/DPWH/sites/default/files/issuances/do_011_s2026.pdf" },
              { series:"2026", no:"10", title:"33rd Partial List of Accreditation of DPWH Provisional Materials Engineers", date:"January 27, 2026", supersedes:"---", url:"https://www.dpwh.gov.ph/DPWH/sites/default/files/issuances/do_010_s2026.pdf" },
              { series:"2026", no:"9", title:"Change of Accreditation Status from DPWH Materials Engineers to Contractors'/Consultants' Materials Engineers", date:"January 27, 2026", supersedes:"---", url:"https://www.dpwh.gov.ph/DPWH/sites/default/files/issuances/do_009_s2026.pdf" },
            ];

            const soData = [
              { series:"2026", no:"175", title:"Designation of Engr. LESTER P. DAVID as Officer-in-Charge, Office of the Assistant District Engineer, Bulacan 3rd District Engineering Office, DPWH Regional Office No. III", date:"April 30, 2026", supersedes:"---", url:"https://www.dpwh.gov.ph/DPWH/sites/default/files/issuances/so_175_s2026.pdf" },
              { series:"2026", no:"174", title:"Designation of Engr. CYRONE KEVIN R. TOLENTINO, as Officer-in-Charge, Office of the District Engineer, Nueva Ecija 2nd District Engineering Office, DPWH Regional Office No. III", date:"April 30, 2026", supersedes:"---", url:"https://www.dpwh.gov.ph/DPWH/sites/default/files/issuances/so_174_s2026.pdf" },
              { series:"2026", no:"173", title:"Designation of Engr. NEILSEN T. CAMPIT as Officer-in-Charge, Office of the Division Chief, Technical Services Division, Bureau of Research and Standards (BRS)", date:"April 30, 2026", supersedes:"---", url:"https://www.dpwh.gov.ph/DPWH/sites/default/files/issuances/so_173_s2026.pdf" },
              { series:"2026", no:"172", title:"Designation of Engr. BRYAN T. THELMO as Officer-in-Charge, Office of the Assistant Bureau Director, DPWH Bureau of Maintenance, on a Concurrent Capacity", date:"April 30, 2026", supersedes:"---", url:"https://www.dpwh.gov.ph/DPWH/sites/default/files/issuances/so_172_s2026.pdf" },
              { series:"2026", no:"171", title:"Designation of Engr. MARIA ARRA PAZ G. SELLAR as Officer-in-Charge, Office of the Assistant District Engineer, Samar 1st District Engineering Office, DPWH Regional Office No. VIII", date:"April 29, 2026", supersedes:"---", url:"https://www.dpwh.gov.ph/DPWH/sites/default/files/issuances/so_171_s2026.pdf" },
              { series:"2026", no:"170", title:"Designation of Engr. GEMMA L. OLAN as Officer-in-Charge, Office of the Assistant District Engineer, Batangas 2nd District Engineering Office, DPWH Regional Office No. IV-A", date:"April 29, 2026", supersedes:"---", url:"https://www.dpwh.gov.ph/DPWH/sites/default/files/issuances/so_170_s2026.pdf" },
              { series:"2026", no:"169", title:"Designation of Engr. ARIEL V. ARMEDILLA as Officer-in-Charge, Office of the District Engineer, Batangas 2nd District Engineering Office, DPWH Regional Office No. IV-A", date:"April 29, 2026", supersedes:"---", url:"https://www.dpwh.gov.ph/DPWH/sites/default/files/issuances/so_169_s2026.pdf" },
              { series:"2026", no:"168", title:"Designation of Engr. NEIL C. FARALA as District Engineer, Ilocos Sur 2nd District Engineering Office, DPWH Regional Office No. I", date:"April 29, 2026", supersedes:"---", url:"https://www.dpwh.gov.ph/DPWH/sites/default/files/issuances/so_168_s2026.pdf" },
              { series:"2026", no:"167", title:"Designation of Engr. MA. FELOMINA D. CAC as Officer-in-Charge, Office of the Assistant District Engineer, Quezon 2nd District Engineering Office, DPWH Regional Office No. IV-A", date:"April 29, 2026", supersedes:"---", url:"https://www.dpwh.gov.ph/DPWH/sites/default/files/issuances/so_167_s2026.pdf" },
              { series:"2026", no:"166", title:"Designation of Engr. DWIGHT JOHN B. ASTOM as Officer-in-Charge, Office of the Assistant District Engineer, Laguna 1st District Engineering Office, DPWH Regional Office No. IV-A", date:"April 29, 2026", supersedes:"---", url:"https://www.dpwh.gov.ph/DPWH/sites/default/files/issuances/so_166_s2026.pdf" },
              { series:"2026", no:"165", title:"Designation of Engr. DANILO D. APUADA, JR. as Officer-in-Charge, Office of the Assistant District Engineer, Batangas 1st District Engineering Office, DPWH Regional Office No. IV-A", date:"April 29, 2026", supersedes:"---", url:"https://www.dpwh.gov.ph/DPWH/sites/default/files/issuances/so_165_s2026.pdf" },
              { series:"2026", no:"164", title:"Designation of Engr. ELMER M. ALFARAS as Officer-in-Charge, Office of the Assistant District Engineer, Pangasinan 2nd District Engineering Office, DPWH Regional Office No. I", date:"April 29, 2026", supersedes:"---", url:"https://www.dpwh.gov.ph/DPWH/sites/default/files/issuances/so_164_s2026.pdf" },
              { series:"2026", no:"163", title:"Designation of Engr. RAYMOND JAY R. PANLILIO as Officer-in-Charge, Office of the District Engineer, Samar 2nd District Engineering Office, DPWH Regional Office No. VIII", date:"April 29, 2026", supersedes:"---", url:"https://www.dpwh.gov.ph/DPWH/sites/default/files/issuances/so_163_s2026.pdf" },
              { series:"2026", no:"162", title:"Reassignment of Engr. Mario D. Villena as District Engineer, Batangas 1st District Engineering Office, DPWH Regional Office No. IV-A", date:"April 29, 2026", supersedes:"---", url:"https://www.dpwh.gov.ph/DPWH/sites/default/files/issuances/so_162_s2026.pdf" },
              { series:"2026", no:"161", title:"Designation of Engr. JAYSON R. MARGALLO as Officer-in-Charge, Office of the Assistant Director, Bureau of Research and Standards (BRS), in a Concurrent Capacity", date:"April 27, 2026", supersedes:"---", url:"https://www.dpwh.gov.ph/DPWH/sites/default/files/issuances/so_161_s2026.pdf" },
              { series:"2026", no:"160", title:"Reconstitution of the DPWH Task Force Baklas Billboards", date:"April 16, 2026", supersedes:"---", url:"https://www.dpwh.gov.ph/DPWH/sites/default/files/issuances/so_160_s2026.pdf" },
              { series:"2026", no:"159", title:"Designation of Engr. RICHARD A. RAGASA as Assistant Regional Director, MIMAROPA Region", date:"April 21, 2026", supersedes:"---", url:"https://www.dpwh.gov.ph/DPWH/sites/default/files/issuances/so_159_s2026.pdf" },
              { series:"2026", no:"158", title:"Designation of Engr. ROSITA A. TINAWIN as Officer-in-Charge, Office of the Regional Director, MIMAROPA Region", date:"April 21, 2026", supersedes:"---", url:"https://www.dpwh.gov.ph/DPWH/sites/default/files/issuances/so_158_s2026.pdf" },
              { series:"2026", no:"157", title:"Designation of Engr. FLORENDO R. PASCUA, JR. as Officer-in-Charge, Office of the Assistant District Engineer, Cagayan 2nd District Engineering Office, Regional Office No. II", date:"April 21, 2026", supersedes:"---", url:"https://www.dpwh.gov.ph/DPWH/sites/default/files/issuances/so_157_s2026.pdf" },
              { series:"2026", no:"156", title:"Designation of Engr. RODERICK V. HORNEDO as Officer-in-Charge, Office of the District Engineer, Cagayan 2nd District Engineering Office, Regional Office No. II", date:"April 21, 2026", supersedes:"---", url:"https://www.dpwh.gov.ph/DPWH/sites/default/files/issuances/so_156_s2026.pdf" },
              { series:"2026", no:"155", title:"Reconstitution of the National Building Code Review Committee (NBCRC)", date:"April 7, 2026", supersedes:"---", url:"https://www.dpwh.gov.ph/DPWH/sites/default/files/issuances/so_155_s2026.pdf" },
              { series:"2026", no:"154", title:"Reconstitution of the DPWH Central Bids and Awards Committee for Civil Works", date:"April 15, 2026", supersedes:"---", url:"https://www.dpwh.gov.ph/DPWH/sites/default/files/issuances/so_154_s2026.pdf" },
              { series:"2026", no:"153", title:"Designation of Engr. JOSE ANGELO S. KARAGDAG as Officer-in-Charge, Office of the District Engineer, Albay 2nd District Engineering Office, DPWH Regional Office No. V", date:"April 14, 2026", supersedes:"---", url:"https://www.dpwh.gov.ph/DPWH/sites/default/files/issuances/so_153_s2026.pdf" },
              { series:"2026", no:"152", title:"Designation of Offices and Officials Responsible for Senior Citizen Concerns, Data Management, Facility Development, and DPWH Representation", date:"April 14, 2026", supersedes:"---", url:"https://www.dpwh.gov.ph/DPWH/sites/default/files/issuances/so_152_s2026.pdf" },
              { series:"2026", no:"151", title:"Reconstitution of the Office Placement Committee for Regional Project Management Office for the Bangsamoro Autonomous Region in Muslim Mindanao (RPMO-BARMM)", date:"April 13, 2026", supersedes:"---", url:"https://www.dpwh.gov.ph/DPWH/sites/default/files/issuances/so_151_s2026.pdf" },
              { series:"2026", no:"150", title:"Designation of Engr. EILEEN I. DIYA as Acting Deputy Project Director, Regional Project Management Office - Bangsamoro Autonomous Region in Muslim Mindanao (RPMO-BARMM), DPWH", date:"April 7, 2026", supersedes:"---", url:"https://www.dpwh.gov.ph/DPWH/sites/default/files/issuances/so_150_s2026.pdf" },
              { series:"2026", no:"149", title:"Designation of Atty. RIO T. ESPIRITU as Officer-in-Charge, Office of the Undersecretary for Support Services", date:"March 31, 2026", supersedes:"---", url:"https://www.dpwh.gov.ph/DPWH/sites/default/files/issuances/so_149_s2026.pdf" },
              { series:"2026", no:"148", title:"Designation of Engr. ELVIN G. TACTAC as Concurrent, Surveys and Investigation Division, Bureau of Design (BOD)", date:"April 7, 2026", supersedes:"---", url:"https://www.dpwh.gov.ph/DPWH/sites/default/files/issuances/so_148_s2026.pdf" },
              { series:"2026", no:"147", title:"Designation of Engr. ADONIS B. ANGELIA as Officer-in-Charge, Office of the District Engineer, Cavite 3rd District Engineering Office, DPWH Regional Office No. IV-A", date:"April 7, 2026", supersedes:"---", url:"https://www.dpwh.gov.ph/DPWH/sites/default/files/issuances/so_147_s2026.pdf" },
              { series:"2026", no:"146", title:"Designation of Engr. LEVINA C. AMAR as Officer-in-Charge, Office of the District Engineer, Aklan District Engineering Office, DPWH Regional Office No. VI", date:"April 7, 2026", supersedes:"---", url:"https://www.dpwh.gov.ph/DPWH/sites/default/files/issuances/so_146_s2026.pdf" },
              { series:"2026", no:"145", title:"Replacement of Member of the DPWH Central Bids and Awards Committee for Civil Works", date:"April 7, 2026", supersedes:"---", url:"https://www.dpwh.gov.ph/DPWH/sites/default/files/issuances/so_145_s2026.pdf" },
              { series:"2026", no:"144", title:"Designation of Engr. PEDRITO R. BAUTISTA as Officer-in-Charge, Office of the District Engineer, Camiguin District Engineering Office, DPWH Regional Office No. X", date:"April 7, 2026", supersedes:"---", url:"https://www.dpwh.gov.ph/DPWH/sites/default/files/issuances/so_144_s2026.pdf" },
              { series:"2026", no:"143", title:"Designation of Engr. ALFREDO J. ENRIQUEZ as Officer-in-Charge, Office of the Assistant District Engineer, Mindoro Oriental District Engineering Office, DPWH Regional Office MIMAROPA Region", date:"April 7, 2026", supersedes:"---", url:"https://www.dpwh.gov.ph/DPWH/sites/default/files/issuances/so_143_s2026.pdf" },
              { series:"2026", no:"142", title:"Designation of Engr. JUPET A. GEMOTA as Officer-in-Charge, Office of the Assistant District Engineer, Cebu 4th District Engineering Office, DPWH Regional Office No. VII", date:"April 7, 2026", supersedes:"---", url:"https://www.dpwh.gov.ph/DPWH/sites/default/files/issuances/so_142_s2026.pdf" },
              { series:"2026", no:"141", title:"Reconstitution of the Data Privacy Committee Technical Working Group (TWG)", date:"March 31, 2026", supersedes:"---", url:"https://www.dpwh.gov.ph/DPWH/sites/default/files/issuances/so_141_s2026.pdf" },
              { series:"2026", no:"140", title:"Creation of a Technical Working Group for the Development of Guidelines for the Implementation of Ligtas Pinoy Centers (LPCs) Pursuant to Republic Act No. 12076 and its IRR", date:"March 27, 2026", supersedes:"---", url:"https://www.dpwh.gov.ph/DPWH/sites/default/files/issuances/so_140_s2026.pdf" },
              { series:"2026", no:"139", title:"Reconstitution of the Committee for Men Supporting Gender Equality (MSGE) Relative to Gender and Development (GAD)", date:"March 23, 2026", supersedes:"---", url:"https://www.dpwh.gov.ph/DPWH/sites/default/files/issuances/so_139_s2026.pdf" },
              { series:"2026", no:"138", title:"Designation of Engr. RAMON C. RAMON as Officer-in-Charge, Office of the Division Chief, National Building Services Division, Bureau of Maintenance (BOM)", date:"March 10, 2026", supersedes:"---", url:"https://www.dpwh.gov.ph/DPWH/sites/default/files/issuances/so_138_s2026.pdf" },
              { series:"2026", no:"137", title:"Designation of Energy Efficiency and Conservation Officer and Focal Persons", date:"March 17, 2026", supersedes:"---", url:"https://www.dpwh.gov.ph/DPWH/sites/default/files/issuances/so_137_s2026.pdf" },
              { series:"2026", no:"136", title:"DPWH Composition for Review and Approval of the Variation Proposal for NAIA Expressway (NAIAX) Phase II Westbound Off-Ramp to Terminal 3 Project", date:"March 17, 2026", supersedes:"---", url:"https://www.dpwh.gov.ph/DPWH/sites/default/files/issuances/so_136_s2026.pdf" },
              { series:"2026", no:"135", title:"Designation of Director RANDY R. DEL ROSARIO as Focal Person to the Comprehensive Social Benefits Program (CSBP)", date:"March 11, 2026", supersedes:"---", url:"https://www.dpwh.gov.ph/DPWH/sites/default/files/issuances/so_135_s2026.pdf" },
              { series:"2026", no:"131", title:"Designation of OIC-Undersecretary LARA MARISSE I. ESQUIBIL as DPWH Alternate Representative to the Philippine Fisheries Development Authority (PFDA)", date:"March 11, 2026", supersedes:"---", url:"https://www.dpwh.gov.ph/DPWH/sites/default/files/issuances/so_131_s2026.pdf" },
              { series:"2026", no:"130", title:"Designation of Ms. MARIA CRISTINA F. DE JESUS as Officer-in-Charge, Office of the Division Chief, Supply and Property Management Division, HRAS", date:"March 12, 2026", supersedes:"---", url:"https://www.dpwh.gov.ph/DPWH/sites/default/files/issuances/so_130_s2026.pdf" },
              { series:"2026", no:"129", title:"Designation of Engr. FE F. SUMANG as Officer-in-Charge, Office of the Assistant District Engineer, Nueva Ecija 1st District Engineering Office, DPWH Regional Office No. III", date:"March 11, 2026", supersedes:"---", url:"https://www.dpwh.gov.ph/DPWH/sites/default/files/issuances/so_129_s2026.pdf" },
              { series:"2026", no:"128", title:"Designation of Engr. RAUL N. TRAVILLA as Officer-in-Charge, Office of the Assistant District Engineer, Sultan Kudarat 1st District Engineering Office, DPWH Regional Office No. XII", date:"March 11, 2026", supersedes:"---", url:"https://www.dpwh.gov.ph/DPWH/sites/default/files/issuances/so_128_s2026.pdf" },
              { series:"2026", no:"127", title:"Designation of Engr. DELANO R. BALUYOT as Officer-in-Charge, Office of the Assistant District Engineer, Bataan 1st District Engineering Office, DPWH Regional Office No. III", date:"March 11, 2026", supersedes:"---", url:"https://www.dpwh.gov.ph/DPWH/sites/default/files/issuances/so_127_s2026.pdf" },
              { series:"2026", no:"126", title:"Designation of Engr. PRINCE DANIEL M. PELISCO as Officer-in-Charge, Office of the Assistant District Engineer, Southern Leyte 2nd District Engineering Office, DPWH Regional Office No. VIII", date:"March 11, 2026", supersedes:"---", url:"https://www.dpwh.gov.ph/DPWH/sites/default/files/issuances/so_126_s2026.pdf" },
              { series:"2026", no:"125", title:"Designation of Engr. KAREN R. RAMISO as Officer-in-Charge, Office of the Assistant District Engineer, Tacloban City District Engineering Office, DPWH Regional Office No. VIII", date:"March 11, 2026", supersedes:"---", url:"https://www.dpwh.gov.ph/DPWH/sites/default/files/issuances/so_125_s2026.pdf" },
              { series:"2026", no:"124", title:"Designation of Engr. LENIN C. CABALU as Officer-in-Charge, Office of the Assistant District Engineer, Tarlac 1st District Engineering Office, DPWH Regional Office No. III", date:"March 11, 2026", supersedes:"---", url:"https://www.dpwh.gov.ph/DPWH/sites/default/files/issuances/so_124_s2026.pdf" },
              { series:"2026", no:"123", title:"Designation of Engr. AGNES P. JACINTO as Officer-in-Charge, Office of the District Engineer, Bataan 1st District Engineering Office", date:"March 11, 2026", supersedes:"---", url:"https://www.dpwh.gov.ph/DPWH/sites/default/files/issuances/so_123_s2026.pdf" },
            ];

            const mcData = [
              { series:"2026", no:"24", title:"Certified Copy of Proclamation No. 1205 dated March 30, 2026, entitled 'Declaring the Period of 10 to 16 April of every Year as the Economy, Planning, and Development Week, and the 10th of April of every Year as the Department of Economy, Planning and Development Day'", date:"April 20, 2026", url:"https://www.dpwh.gov.ph/DPWH/sites/default/files/issuances/dmc_024_s2026.pdf" },
              { series:"2026", no:"23", title:"Copy of the letter dated March 17, 2026 from Assistant Secretary Marshall Louis M. Alferez, Office of Asian and Pacific Affairs, Department of Foreign Affairs (DFA), informing that the oversight of all Central Asian nations has been transferred to the Office of Asian and Pacific Affairs, Central Asia Division", date:"April 15, 2026", url:"https://www.dpwh.gov.ph/DPWH/sites/default/files/issuances/dmc_023_s2026.pdf" },
              { series:"2026", no:"22", title:"Certified Copy of Executive Order No. 111 dated March 26, 2026, entitled 'Adopting the Standard Set of Philippine Names for the 131 Features of the Kalayaan Island Group located in the Municipality of Kalayaan, Province of Palawan and the West Philippine Sea'", date:"April 15, 2026", url:"https://www.dpwh.gov.ph/DPWH/sites/default/files/issuances/dmc_022_s2026.pdf" },
              { series:"2026", no:"21", title:"Certified Copy of Executive Order No. 112 dated March 12, 2026, entitled 'Creating the Office of the Presidential Adviser for Sustainable and Resilient Communities under the Office of the President, defining its Mandate, Powers and Functions'", date:"April 15, 2026", url:"https://www.dpwh.gov.ph/DPWH/sites/default/files/issuances/dmc_021_s2026.pdf" },
              { series:"2026", no:"20", title:"Certified Copy of Office of the President Memorandum Circular No. 117 dated March 31, 2026, with the subject: Prescribing the Playing of the Official Music Videos of Lupang Hinirang and the ASEAN 2026 Song 'One Vision, One Ocean' during Flag Ceremonies and other Official Government Events", date:"April 15, 2026", url:"https://www.dpwh.gov.ph/DPWH/sites/default/files/issuances/dmc_020_s2026.pdf" },
              { series:"2026", no:"19", title:"Copy of Office of the President Memorandum Circular No. 115 dated March 31, 2026, with the subject: Directing All Government Agencies and Instrumentalities, and Encouraging Local Government Units and the Private Sector, to support the Celebration of the 2026 National Innovation Day", date:"April 14, 2026", url:"https://www.dpwh.gov.ph/DPWH/sites/default/files/issuances/dmc_019_s2026.pdf" },
              { series:"2026", no:"18", title:"Copy of Commission on Elections (COMELEC) Resolution No. 11203 dated March 06, 2026, entitled 'The 2026 Implementing Rules and Regulations of the Bangsamoro Autonomy Act (BAA) No. 35, as amended by BAA No. 88, otherwise known as the Bangsamoro Electoral Code of 2023'", date:"April 14, 2026", url:"https://www.dpwh.gov.ph/DPWH/sites/default/files/issuances/dmc_018_s2026.pdf" },
              { series:"2026", no:"17", title:"Copy of COMELEC Minute Resolution No. 26-0222 dated March 18, 2026, entitled 'In the matter of the extension of period for filing of petition of registration/accreditation of Regional Political Parties and Parliamentary Sectoral Organizations'", date:"April 14, 2026", url:"https://www.dpwh.gov.ph/DPWH/sites/default/files/issuances/dmc_017_s2026.pdf" },
              { series:"2026", no:"16", title:"Copy of COMELEC Resolution No. 11205 dated March 12, 2026, entitled 'In the matter of Prescribing the Calendar of Activities Implementing Comelec Resolution No. 11203 pursuant to Bangsamoro Autonomy Act (BAA) Nos. 86 and 88'", date:"April 14, 2026", url:"https://www.dpwh.gov.ph/DPWH/sites/default/files/issuances/dmc_016_s2026.pdf" },
              { series:"2026", no:"15", title:"Copy of Office of the President Memorandum Circular No. 116 dated March 31, 2026, regarding adoption of work-from-home arrangements on 01 April 2026 from 8:00 AM to 12:00 PM, and suspension of work in government offices from 12:00 PM onwards", date:"March 31, 2026", url:"https://www.dpwh.gov.ph/DPWH/sites/default/files/issuances/dmc_015_s2026.pdf" },
              { series:"2026", no:"14", title:"Copy of Proclamation No. 1189 dated March 12, 2026, entitled 'Declaring Friday, 20 March 2026, A Regular Holiday throughout the Country in Observance of EID'L FITR (Feast of Ramadhan)'", date:"March 17, 2026", url:"https://www.dpwh.gov.ph/DPWH/sites/default/files/issuances/dmc_014_s2026.pdf" },
              { series:"2026", no:"13", title:"Copy of Memorandum Circular No. 114 dated March 6, 2026, with the subject: Directing all Government Agencies and Instrumentalities to Strictly Adopt Energy Conservation Protocols", date:"March 12, 2026", url:"https://www.dpwh.gov.ph/DPWH/sites/default/files/issuances/dmc_013_s2026.pdf" },
              { series:"2026", no:"12", title:"Copy of Inter-Agency Energy Efficiency and Conservation Committee (IAEECC) Advisory dated March 3, 2026, entitled 'Enjoining All Government Entities to Reduce Fuel Consumption by at Least Ten Percent (10%)'", date:"March 10, 2026", url:"https://www.dpwh.gov.ph/DPWH/sites/default/files/issuances/dmc_012_s2026.pdf" },
              { series:"2026", no:"11", title:"Copy of Inter-Agency Energy Efficiency and Conservation Committee (IAEECC) Advisory dated March 4, 2026, entitled 'Strict Observance of the Government Energy Management Program (GEMP) Guidelines and IAEECC Resolutions'", date:"March 6, 2026", url:"https://www.dpwh.gov.ph/DPWH/sites/default/files/issuances/dmc_011_s2026.pdf" },
              { series:"2026", no:"10", title:"Copy of GPPB Circular No. 03-2025 dated September 25, 2025, entitled 'Guidelines for the Implementation of the Philippine Government Electronic Procurement System Electronic Marketplace'", date:"March 5, 2026", url:"https://www.dpwh.gov.ph/DPWH/sites/default/files/issuances/dmc_010_s2026.pdf" },
              { series:"2026", no:"9", title:"Copy of GPPB Circular No. 01-2025 dated September 18, 2025, entitled 'Policy Guidance on Section 113 (Transitory Provision) in relation to Section 115 (Repealing Clause) of Republic Act No. 12009 and its Implementing Rules and Regulations'", date:"March 5, 2026", url:"https://www.dpwh.gov.ph/DPWH/sites/default/files/issuances/dmc_009_s2026.pdf" },
              { series:"2026", no:"8", title:"Certified Copy of Office of the President Memorandum Circular No. 113 dated February 12, 2026, with the subject: Directing All Concerned Government Agencies and Instrumentalities to fully support and actively participate in the drafting of the National Anti-Money Laundering, Counter-Terrorism Financing, and Counter-Proliferation Financing Strategy 2026-2030", date:"March 3, 2026", url:"https://www.dpwh.gov.ph/DPWH/sites/default/files/issuances/dmc_008_s2026.pdf" },
              { series:"2026", no:"7", title:"Copy of Department of Budget and Management (DBM) National Budget Circular No. 156 dated January 5, 2026, with the subject: National Budget Call for FY 2027", date:"January 28, 2026", url:"https://www.dpwh.gov.ph/DPWH/sites/default/files/issuances/dmc_007_s2026.pdf" },
              { series:"2026", no:"6", title:"Copy of Department of Budget and Management (DBM) National Budget Circular No. 601 dated January 22, 2026, with the subject: Implementation of the Third Tranche of the Updated Salary Schedule for the Civilian Government Personnel under Executive Order (EO) No. 64, s.2024", date:"January 28, 2026", url:"https://www.dpwh.gov.ph/DPWH/sites/default/files/issuances/dmc_006_s2026.pdf" },
              { series:"2026", no:"5", title:"Certified Copy of Office of the President Memorandum Circular No. 112 dated January 15, 2026, with the subject: Directing All Government Agencies and Instrumentalities to support the call for nominations for the 2026 Presidential Awards for Filipino Individuals and Organizations Overseas (PAFIOO)", date:"January 26, 2026", url:"https://www.dpwh.gov.ph/DPWH/sites/default/files/issuances/dmc_005_s2026.pdf" },
              { series:"2026", no:"4", title:"Copy of GPPB Resolution No. 01-2026 dated January 7, 2026, entitled 'Approving the mode of Negotiated Procurement for International Events, Conferences, Summits or Activities hosted by the Philippine Government'", date:"January 20, 2026", url:"https://www.dpwh.gov.ph/DPWH/sites/default/files/issuances/dmc_004_s2026.pdf" },
              { series:"2026", no:"3", title:"Copy of Civil Service Commission (CSC) Memorandum Circular No. 01, s. 2026 dated January 12, 2026, with the subject: Wellness Leave Policy", date:"January 16, 2026", url:"https://www.dpwh.gov.ph/DPWH/sites/default/files/issuances/dmc_003_s2026.pdf" },
              { series:"2026", no:"2", title:"Proclamation No. 1126 dated January 6, 2026, entitled 'Declaring Friday, 09 January 2026, Special (Non-Working) Day in the City of Manila'", date:"January 12, 2026", url:"https://www.dpwh.gov.ph/DPWH/sites/default/files/issuances/dmc_002_s2026.pdf" },
              { series:"2026", no:"1", title:"Copy of GPPB Resolution No. 10-2025 dated September 25, 2025, entitled 'Approving the Updated Guidelines for the Implementation of the Philippine Government Electronic Procurement System Electronic Marketplace'", date:"January 12, 2026", url:"https://www.dpwh.gov.ph/DPWH/sites/default/files/issuances/dmc_001_s2026.pdf" },
              { series:"2025", no:"86", title:"Certified Copy of Memorandum Circular No. 110 dated December 15, 2025, with the subject: Directing all National Government Agencies and Instrumentalities, including GOCCs and SUCs, and encouraging All Local Government Units, to observe Austerity in the Celebration of the Christmas Season", date:"December 23, 2025", url:"https://www.dpwh.gov.ph/DPWH/sites/default/files/issuances/dmc_086_s2025.pdf" },
              { series:"2025", no:"85", title:"Certified Copy of Memorandum Circular No. 111 dated December 18, 2025, with the subject: Suspension of Work in Government Offices on 29 December 2025 (Monday) and 2 January 2026 (Friday) to provide government employees full opportunity to celebrate New Year's Day Activities and to allow them to travel to and from different regions", date:"December 23, 2025", url:"https://www.dpwh.gov.ph/DPWH/sites/default/files/issuances/dmc_085_s2025.pdf" },
              { series:"2025", no:"83", title:"Budget Circular No. 2025-4 dated December 16, 2025, with the subject: Guidelines on the Grant of the Gratuity Pay to the Contract of Service (COS) and Job Order (JO) Workers in Government for FY 2025", date:"December 22, 2025", url:"https://www.dpwh.gov.ph/DPWH/sites/default/files/issuances/dmc_083_s2025.pdf" },
              { series:"2025", no:"82", title:"Proclamation No. 1104 dated December 4, 2025, entitled 'Declaring the Third Wednesday of June of every Year as the National Pulmonary Rehabilitation Day'", date:"December 22, 2025", url:"https://www.dpwh.gov.ph/DPWH/sites/default/files/issuances/dmc_082_s2025.pdf" },
              { series:"2025", no:"81", title:"Budget Circular No. 2025-3 dated December 15, 2025, with the subject: Guidelines on the Grant of Service Recognition Incentive to Government Employees for FY 2025", date:"December 22, 2025", url:"https://www.dpwh.gov.ph/DPWH/sites/default/files/issuances/dmc_081_s2025.pdf" },
              { series:"2025", no:"80", title:"Memorandum Circular No. 111 dated December 18, 2025, with the subject: Work Suspension in all Government Offices on 29 December 2025 (Monday) and 2 January 2026 (Friday)", date:"December 22, 2025", url:"https://www.dpwh.gov.ph/DPWH/sites/default/files/issuances/dmc_080_s2025.pdf" },
              { series:"2025", no:"79", title:"Copy of GPPB Resolution No. 09-2025 dated September 25, 2025, entitled 'Approving the Recommendation of the Procurement Service - DBM for the Decommissioning of PHILGEPS 1.5 and the use of the Modernized PHILGEPS based on Prescribed Timelines'", date:"December 16, 2025", url:"https://www.dpwh.gov.ph/DPWH/sites/default/files/issuances/dmc_079_s2025.pdf" },
              { series:"2025", no:"78", title:"Certified true copy of Executive Order No. 103 dated November 6, 2025, entitled 'Amending Executive Order No. 138 (s.2021) to extend the Transition Period for the Full Implementation of Devolution of Certain functions of the Executive Branch to Local Governments'", date:"December 2, 2025", url:"https://www.dpwh.gov.ph/DPWH/sites/default/files/issuances/dmc_078_s2025.pdf" },
              { series:"2025", no:"76", title:"Certified Copy of Memorandum Circular No. 105 dated October 28, 2025, with the subject: Directing All Government Agencies and Instrumentalities to Support the Observance of the 2025 Drug Abuse Prevention and Control Week", date:"November 27, 2025", url:"https://www.dpwh.gov.ph/DPWH/sites/default/files/issuances/dmc_076_s2025.pdf" },
              { series:"2025", no:"75", title:"Copy of GPPB Advisory No. PMD-01-2025 dated October 28, 2025, entitled 'New Link for the Online Submission of Fiscal Year 2026 Early Procurement Activity Certification'", date:"November 25, 2025", url:"https://www.dpwh.gov.ph/DPWH/sites/default/files/issuances/dmc_075_s2025.pdf" },
              { series:"2025", no:"74", title:"Certified copy of Memorandum Circular No. 104 dated October 24, 2025, with the subject: Approving the Tatak Pinoy Strategy and Directing the Implementation Thereof", date:"November 18, 2025", url:"https://www.dpwh.gov.ph/DPWH/sites/default/files/issuances/dmc_074_s2025.pdf" },
              { series:"2025", no:"73", title:"Certified Copy of Republic Act No. 12303 dated September 12, 2025, granting Benguet Electric Cooperative (BENECO) a Franchise to Construct, Install, Establish, Operate, Own, Manage and Maintain a Distribution System for the Conveyance of Electric Power to End-Users in the Province of Benguet and Baguio City", date:"November 4, 2025", url:"https://www.dpwh.gov.ph/DPWH/sites/default/files/issuances/dmc_073_s2025.pdf" },
              { series:"2025", no:"72", title:"Certified Copy of Republic Act No. 12302 dated September 12, 2025, granting the Aklan Electric Cooperative (AKELCO), Inc. a Franchise to Construct, Install, Establish, Operate, Own, Manage and Maintain a Distribution System for the Conveyance of Electric Power to End-Users in the Province of Aklan and select municipalities", date:"November 4, 2025", url:"https://www.dpwh.gov.ph/DPWH/sites/default/files/issuances/dmc_072_s2025.pdf" },
              { series:"2025", no:"71", title:"Certified Copy of Republic Act No. 12278 dated September 7, 2025, granting a Franchise to First Laguna Electric Cooperative, Inc. (FLECO) to Construct, Install, Establish, Operate, Own, Manage and Maintain Power to End-Users in select Municipalities of the Province of Laguna", date:"November 4, 2025", url:"https://www.dpwh.gov.ph/DPWH/sites/default/files/issuances/dmc_071_s2025.pdf" },
              { series:"2025", no:"70", title:"Certified Copy of Republic Act No. 12277 dated September 7, 2025, granting the Camarines Sur IV Electric Cooperative, Inc. (CASURECO IV) a Franchise to Construct, Install, Establish, Operate, Own, Manage and Maintain Distribution System for the Conveyance of Electric Power to End-Users in select Municipalities in the Province of Camarines Sur", date:"November 4, 2025", url:"https://www.dpwh.gov.ph/DPWH/sites/default/files/issuances/dmc_070_s2025.pdf" },
              { series:"2025", no:"69", title:"Copy of GPPB Resolution No. 05-2025 dated September 18, 2025, entitled 'Approving the Circular Providing Policy Guidance on Section 113 (Transitory Provision) in relation to Section 115 (Repealing Clause) of Republic Act No. 12009 and its Implementing Rules and Regulations'", date:"November 4, 2025", url:"https://www.dpwh.gov.ph/DPWH/sites/default/files/issuances/dmc_069_s2025.pdf" },
              { series:"2025", no:"68", title:"Certified Copy of Memorandum Circular No. 103 dated October 07, 2025, with the subject: Approving and Adopting the Philippine Creative Industries Development Plan 2025-2034, and Directing the Implementation Thereof", date:"October 24, 2025", url:"https://www.dpwh.gov.ph/DPWH/sites/default/files/issuances/dmc_068_s2025.pdf" },
              { series:"2025", no:"67", title:"Certified Copy of Memorandum Circular No. 99 dated September 23, 2025, with the subject: Directing all Government Agencies and Instrumentalities to support the celebration of the 50th Anniversary of 'Thrilla in Manila'", date:"October 15, 2025", url:"https://www.dpwh.gov.ph/DPWH/sites/default/files/issuances/dmc_067_s2025.pdf" },
              { series:"2025", no:"66", title:"Certified Copy of Memorandum Circular No. 100 dated September 23, 2025, with the subject: Adopting the 2024 National Disaster Response Plan and Directing the Implementation Thereof", date:"October 15, 2025", url:"https://www.dpwh.gov.ph/DPWH/sites/default/files/issuances/dmc_066_s2025.pdf" },
              { series:"2025", no:"65", title:"Copy of Memorandum from Executive Secretary Lucas P. Bersamin dated September 29, 2025, with the subject: Directive to Extend Full Assistance and Cooperation to the Independent Commission for Infrastructure", date:"October 3, 2025", url:"https://www.dpwh.gov.ph/DPWH/sites/default/files/issuances/dmc_065_s2025.pdf" },
              { series:"2025", no:"64", title:"Certified Copy of Executive Order No. 94 dated September 11, 2025, with the subject: Creating the Independent Commission for Infrastructure", date:"October 2, 2025", url:"https://www.dpwh.gov.ph/DPWH/sites/default/files/issuances/dmc_064_s2025.pdf" },
              { series:"2025", no:"63", title:"Copy of Memorandum Circular No. 97 dated September 21, 2025, with the subject: Suspension of Work in Government Offices and Classes at All Levels in Metro Manila due to Forecasted Heavy Rainfall from Super Typhoon 'Nando' and the Southwest Monsoon on 22 September 2025", date:"September 29, 2025", url:"https://www.dpwh.gov.ph/DPWH/sites/default/files/issuances/dmc_063_s2025.pdf" },
              { series:"2025", no:"62", title:"Copy of Memorandum Circular No. 96 dated September 22, 2025, with the subject: Suspension of Work in Government Offices under the Executive Branch starting at 1:00 PM on 22 September 2025 in Observance of 'Kainang Pamilya Mahalaga Day'", date:"September 25, 2025", url:"https://www.dpwh.gov.ph/DPWH/sites/default/files/issuances/dmc_062_s2025.pdf" },
              { series:"2025", no:"61", title:"Certified Copy of Proclamation No. 1020 dated September 10, 2025, with the subject: Declaring the Second Week of September of every year as the National Pensioners' Week", date:"September 19, 2025", url:"https://www.dpwh.gov.ph/DPWH/sites/default/files/issuances/dmc_061_s2025.pdf" },
              { series:"2025", no:"60", title:"Copy of GPPB Resolution No. 04-2025 dated July 30, 2025, entitled 'Approving the Establishment of the Inter-Agency Technical Working Group of the Government Procurement Policy Board'", date:"September 19, 2025", url:"https://www.dpwh.gov.ph/DPWH/sites/default/files/issuances/dmc_060_s2025.pdf" },
            ];

            /*  HELPERS  */
            function hl(text, term) {
              if (!term) return text;
              const esc = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
              return text.replace(new RegExp('(' + esc + ')', 'gi'), '<span class="highlight">$1</span>');
            }

            function render(type, rows, terms) {
              const tbody = document.getElementById(type + '-tbody');
              const empty = document.getElementById(type + '-empty');
              const info  = document.getElementById(type + '-info');
              const total = (type === 'do' ? doData : type === 'so' ? soData : mcData).length;
              tbody.innerHTML = '';
              if (rows.length === 0) {
                empty.style.display = 'block';
                info.innerHTML = 'No results found.';
                return;
              }
              empty.style.display = 'none';
              info.innerHTML = 'Showing <span>' + rows.length + '</span> of <span>' + total + '</span> issuances';
              rows.forEach(function(r) {
                const tr = document.createElement('tr');
                tr.onclick = function() { if (r.url && r.url !== 'YOUR_PDF_LINK_HERE') window.open(r.url, '_blank'); };
                const supCol = (type !== 'mc')
                  ? '<td class="td-supersedes">' + (r.supersedes || '---') + '</td>'
                  : '';
                tr.innerHTML =
                  '<td class="td-no">'   + hl(r.no, terms.no)         + '</td>' +
                  '<td class="td-year">' + hl(r.series, terms.year)   + '</td>' +
                  '<td class="td-title">'+ hl(r.title, terms.title)   + '</td>' +
                  '<td class="td-date">' + r.date                      + '</td>' +
                  supCol +
                  '<td class="td-link"><a class="iss-link-icon" href="' + r.url + '" target="_blank" onclick="event.stopPropagation()">&#8594;</a></td>';
                tbody.appendChild(tr);
              });
            }

            function issSearch(type) {
              const fNo    = document.getElementById(type + '-f-no').value.trim().toLowerCase();
              const fYear  = document.getElementById(type + '-f-year').value.trim().toLowerCase();
              const fTitle = document.getElementById(type + '-f-title').value.trim().toLowerCase();
              const src    = type === 'do' ? doData : type === 'so' ? soData : mcData;
              const filtered = src.filter(function(r) {
                return (!fNo    || r.no.toLowerCase().includes(fNo))
                    && (!fYear  || r.series.toLowerCase().includes(fYear))
                    && (!fTitle || r.title.toLowerCase().includes(fTitle));
              });
              render(type, filtered, { no:fNo, year:fYear, title:fTitle });
            }

            function issClear(type) {
              document.getElementById(type + '-f-no').value    = '';
              document.getElementById(type + '-f-year').value  = '';
              document.getElementById(type + '-f-title').value = '';
              const src = type === 'do' ? doData : type === 'so' ? soData : mcData;
              render(type, src, { no:'', year:'', title:'' });
            }

            function issShowTab(type) {
              document.querySelectorAll('.iss-tab').forEach(function(t) { t.classList.remove('active'); });
              document.querySelectorAll('.iss-panel').forEach(function(p) { p.classList.remove('active'); });
              event.currentTarget.classList.add('active');
              document.getElementById('iss-panel-' + type).classList.add('active');
            }

            // Enter key
            ['do','so','mc'].forEach(function(type) {
              ['f-no','f-year','f-title'].forEach(function(field) {
                var el = document.getElementById(type + '-' + field);
                if (el) el.addEventListener('keydown', function(e) { if (e.key === 'Enter') issSearch(type); });
              });
            });

            // Expose globals
            window.issSearch  = issSearch;
            window.issClear   = issClear;
            window.issShowTab = issShowTab;

            // Initial render all three
            render('do', doData, { no:'', year:'', title:'' });
            render('so', soData, { no:'', year:'', title:'' });
            render('mc', mcData, { no:'', year:'', title:'' });

          })();
          


    /*  REFERENCES SIDEBAR NAV  */
    var refNavMeta = {
      'references-atlas':          { name: 'DPWH ATLAS',               tag: 'Infrastructure Data',   sub: 'Compiled by the Statistics Division · Planning Service' },
      'references-rbi':            { name: 'Road & Bridge Inventory',   tag: 'National Asset Registry', sub: 'DPWH Bureau of Design & Planning Service' },
      'references-streamms':       { name: 'StreaMS',                   tag: 'Streamflow Management', sub: 'Bureau of Design · Water Projects Division' },
      'references-laws':           { name: 'Laws, Codes & Orders',      tag: 'Legal Framework',       sub: 'Office of the Secretary' },
      'references-guidelines':     { name: 'Guidelines & Manuals',      tag: 'Engineering Standards', sub: 'Bureau of Design' },
      'references-standard-design':{ name: 'Standard Design',           tag: 'Design Templates',      sub: 'Office of the Secretary' },
      'references-reports':        { name: 'Reports',                   tag: 'Official Reports',      sub: 'Office of the Secretary' },
      'references-issuances':      { name: 'Issuances',                 tag: 'Department Orders & Circulars', sub: 'Office of the Secretary' },
    };

    function refNavSwitch(el, sectionId) {
      // Update sidebar active state
      document.querySelectorAll('#page-references .ref-nav-item').forEach(function(item) {
        item.classList.remove('active');
      });
      el.classList.add('active');

      // Hide all r-sections in the panel, show target
      document.querySelectorAll('#ref-content-panel .r-section').forEach(function(s) {
        s.classList.remove('active');
      });
      var target = document.getElementById(sectionId);
      if (target) target.classList.add('active');

      // Update dynamic topbar & section head
      var meta = refNavMeta[sectionId] || {};
      var bcEl = document.getElementById('ref-bc-section');
      if (bcEl) bcEl.textContent = meta.name || sectionId;
      var tagEl = document.getElementById('ref-section-tag');
      if (tagEl) tagEl.innerHTML = '<span style="width:16px;height:2px;background:#C9973D;border-radius:1px;display:inline-block;margin-right:6px;"></span>' + (meta.tag || '');
      var h3El = document.getElementById('ref-section-h3');
      if (h3El) h3El.textContent = meta.name || '';
      var subEl = document.getElementById('ref-section-sub');
      if (subEl) subEl.textContent = meta.sub || '';

      // Count docs in section
      var cards = target ? target.querySelectorAll('.doc-card, .law-card').length : 0;
      var countEl = document.getElementById('ref-panel-count');
      if (countEl) countEl.textContent = cards > 0 ? cards + ' document' + (cards !== 1 ? 's' : '') : '';

      // Scroll content panel to top
      var panel = document.getElementById('ref-content-panel');
      if (panel) panel.scrollTop = 0;
    }

    // Override activateSubTab for references to use sidebar system
    var _origActivateSubTab = window.activateSubTab;
    document.addEventListener('DOMContentLoaded', function() {
      // Count initial docs
      var initTarget = document.getElementById('references-atlas');
      var initCards = initTarget ? initTarget.querySelectorAll('.doc-card, .law-card').length : 0;
      var countEl = document.getElementById('ref-panel-count');
      if (countEl && initCards > 0) countEl.textContent = initCards + ' document' + (initCards !== 1 ? 's' : '');
    });
  


/*  REGION DATA  */
const regions = [
  { code: 'NCR',   name: 'National Capital Region' },
  { code: 'CAR',   name: 'Cordillera Administrative Region' },
  { code: 'I',     name: 'Ilocos Region' },
  { code: 'II',    name: 'Cagayan Valley' },
  { code: 'III',   name: 'Central Luzon' },
  { code: 'IV-A',  name: 'CALABARZON' },
  { code: 'IV-B',  name: 'MIMAROPA' },
  { code: 'V',     name: 'Bicol Region' },
  { code: 'VI',    name: 'Western Visayas' },
  { code: 'VII',   name: 'Central Visayas' },
  { code: 'VIII',  name: 'Eastern Visayas' },
  { code: 'IX',    name: 'Zamboanga Peninsula' },
  { code: 'X',     name: 'Northern Mindanao' },
  { code: 'XI',    name: 'Davao Region' },
  { code: 'XII',   name: 'SOCCSKSARGEN' },
  { code: 'XIII',  name: 'Caraga' },
  { code: 'BARMM', name: 'Bangsamoro Autonomous Region' },
];

const regionMapData = [
  { code: 'NCR',   name: 'National Capital Region',          color: '#3B4CC0' },
  { code: 'CAR',   name: 'Cordillera Administrative Region', color: '#27AE60' },
  { code: 'I',     name: 'Region I - Ilocos',           color: '#E67E22' },
  { code: 'II',    name: 'Region II - Cagayan Valley',  color: '#8E44AD' },
  { code: 'III',   name: 'Region III - Central Luzon',  color: '#9B59B6' },
  { code: 'IV-A',  name: 'Region IV-A - CALABARZON',    color: '#1ABC9C' },
  { code: 'IV-B',  name: 'MIMAROPA Region',                  color: '#E74C3C' },
  { code: 'V',     name: 'Region V - Bicol',            color: '#F39C12' },
  { code: 'VI',    name: 'Region VI - Western Visayas', color: '#16A085' },
  { code: 'NIR',   name: 'Negros Island Region',             color: '#2980B9' },
  { code: 'VII',   name: 'Region VII - Central Visayas',color: '#2C3E82' },
  { code: 'VIII',  name: 'Region VIII - Eastern Visayas',color:'#229954' },
  { code: 'IX',    name: 'Region IX - Zamboanga Peninsula', color: '#E67E22' },
  { code: 'X',     name: 'Region X - Northern Mindanao', color: '#7F8C8D' },
  { code: 'XI',    name: 'Region XI - Davao Region',    color: '#8E44AD' },
  { code: 'XII',   name: 'Region XII - SOCCSKSARGEN',   color: '#1ABC9C' },
  { code: 'XIII',  name: 'Region XIII - Caraga',        color: '#E74C3C' },
  { code: 'BARMM', name: 'BARMM - Bangsamoro',          color: '#D35400' },
];

const regionCards    = document.getElementById('region-cards');
const regionNavLinks = document.getElementById('region-nav-links');

regions.forEach(r => {
  const card = document.createElement('div');
  card.className = 'region-card';
  card.innerHTML = `<div class="region-code">Region ${r.code}</div><div class="region-name">${r.name}</div>`;
  card.onclick = () => openRegion(r);
  if (regionCards) regionCards.appendChild(card);

  const link = document.createElement('a');
  link.textContent = `Region ${r.code} - ${r.name}`;
  link.onclick = () => { showPage('regional'); openRegion(r); };
  if (regionNavLinks) regionNavLinks.appendChild(link);
});

const legendList = document.getElementById('map-legend-list');
if (legendList) {
  regionMapData.forEach(r => {
    const item = document.createElement('div');
    item.style.cssText = 'display:flex;align-items:center;gap:8px;font-size:12.5px;cursor:pointer;padding:3px 6px;border-radius:5px;transition:background 0.15s;';
    item.innerHTML = `<span style="width:12px;height:12px;border-radius:50%;background:${r.color};flex-shrink:0;border:1.5px solid rgba(0,0,0,0.1);"></span><span style="color:#1A2352;">${r.name}</span>`;
    item.addEventListener('mouseenter', () => item.style.background = 'rgba(36,56,166,0.08)');
    item.addEventListener('mouseleave', () => item.style.background = 'transparent');
    item.addEventListener('click', () => selectRegion(r.code, r.name));
    legendList.appendChild(item);
  });
}

const tooltip = document.getElementById('map-tooltip');
document.querySelectorAll('.ph-region').forEach(g => {
  const origColors = {};
  g.querySelectorAll('[fill]').forEach(el => { origColors[el] = el.getAttribute('fill'); });
  g.addEventListener('mouseenter', e => {
    g.querySelectorAll('[fill]').forEach(el => {
      const c = el.getAttribute('fill');
      if (c && c !== '#fff' && c !== 'none') el.setAttribute('fill', lightenColor(c, 40));
    });
    g.querySelectorAll('[stroke-width]').forEach(el => el.setAttribute('stroke-width', '2.5'));
    if (tooltip) { tooltip.textContent = g.dataset.name; tooltip.style.display = 'block'; }
  });
  g.addEventListener('mousemove', e => {
    if (tooltip) { tooltip.style.left = (e.clientX + 14) + 'px'; tooltip.style.top = (e.clientY - 10) + 'px'; }
  });
  g.addEventListener('mouseleave', () => {
    g.querySelectorAll('[fill]').forEach(el => { if (origColors[el]) el.setAttribute('fill', origColors[el]); });
    g.querySelectorAll('[stroke-width]').forEach(el => el.setAttribute('stroke-width', '1.5'));
    if (tooltip) tooltip.style.display = 'none';
  });
});

function lightenColor(hex, amount) {
  try {
    let r = parseInt(hex.slice(1,3),16);
    let g = parseInt(hex.slice(3,5),16);
    let b = parseInt(hex.slice(5,7),16);
    return `rgb(${Math.min(255,r+amount)},${Math.min(255,g+amount)},${Math.min(255,b+amount)})`;
  } catch(e) { return hex; }
}

function selectRegion(code, name) {
  const box = document.getElementById('region-info-box');
  document.getElementById('rinfo-code').textContent = 'Region ' + code;
  document.getElementById('rinfo-name').textContent = name;
  if (box) { box.style.display = 'block'; box.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); }
}

/*  PAGE NAVIGATION  */
function showPage(id) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById('page-' + id).classList.add('active');
  document.querySelectorAll('.nav-link').forEach(n => n.classList.remove('active'));
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function showSubpage(page, sub) {
  showPage(page);
  const tabId = page + '-' + sub;
  // For references page, use sidebar nav system
  if (page === 'references') {
    const navItem = document.querySelector('#page-references .ref-nav-item[data-section="' + tabId + '"]');
    if (navItem) {
      refNavSwitch(navItem, tabId);
    }
    return;
  }
  const parent = document.getElementById('page-' + page);
  if (!parent) return;
  parent.querySelectorAll('.subpage-tab').forEach(t => {
    t.classList.toggle('active', !!(t.getAttribute('onclick') && t.getAttribute('onclick').includes(tabId)));
  });
  parent.querySelectorAll('.r-section').forEach(s => s.classList.toggle('active', s.id === tabId));
}

function activateSubTab(el, targetId) {
  const parent = el.closest('.page');
  parent.querySelectorAll('.subpage-tab').forEach(t => t.classList.remove('active'));
  parent.querySelectorAll('.r-section').forEach(s => s.classList.remove('active'));
  el.classList.add('active');
  const target = document.getElementById(targetId);
  if (target) target.classList.add('active');
}

function activateRegionTab(el, targetId) {
  document.querySelectorAll('#regional-detail .subpage-tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('#regional-detail .r-section').forEach(s => s.classList.remove('active'));
  el.classList.add('active');
  const target = document.getElementById(targetId);
  if (target) target.classList.add('active');
}

const regionContacts = {
  'NCR':   { address: 'DPWH Building, Quezon Ave., Quezon City',         tel: '(02) 8925-7227', email: 'ncr@dpwh.gov.ph'   },
  'CAR':   { address: 'Magsaysay Ave., Baguio City',                     tel: '(074) 442-7071', email: 'car@dpwh.gov.ph'   },
  'I':     { address: 'Aguila Road, San Fernando City, La Union',        tel: '(072) 888-2576', email: 'r1@dpwh.gov.ph'    },
  'II':    { address: 'Carig, Tuguegarao City, Cagayan',                 tel: '(078) 844-1044', email: 'r2@dpwh.gov.ph'    },
  'III':   { address: 'Sindalan, City of San Fernando, Pampanga',        tel: '(045) 455-1612', email: 'r3@dpwh.gov.ph'    },
  'IV-A':  { address: 'Balagtas St., Lipa City, Batangas',               tel: '(043) 756-0540', email: 'r4a@dpwh.gov.ph'   },
  'IV-B':  { address: 'Calapan City, Oriental Mindoro',                  tel: '(043) 288-1046', email: 'r4b@dpwh.gov.ph'   },
  'V':     { address: 'Rawis, Legazpi City, Albay',                      tel: '(052) 480-5062', email: 'r5@dpwh.gov.ph'    },
  'VI':    { address: 'Bonifacio Drive, Iloilo City',                    tel: '(033) 337-7971', email: 'r6@dpwh.gov.ph'    },
  'VII':   { address: 'Sudlon, Lahug, Cebu City',                        tel: '(032) 232-3397', email: 'r7@dpwh.gov.ph'    },
  'VIII':  { address: 'Trece Martires St., Tacloban City',               tel: '(053) 321-2397', email: 'r8@dpwh.gov.ph'    },
  'IX':    { address: 'Zamboanga City',                                   tel: '(062) 991-1629', email: 'r9@dpwh.gov.ph'    },
  'X':     { address: 'Lapasan, Cagayan de Oro City',                    tel: '(088) 856-4180', email: 'r10@dpwh.gov.ph'   },
  'XI':    { address: 'Matina, Davao City',                              tel: '(082) 297-2532', email: 'r11@dpwh.gov.ph'   },
  'XII':   { address: 'Koronadal City, South Cotabato',                  tel: '(083) 228-2651', email: 'r12@dpwh.gov.ph'   },
  'XIII':  { address: 'Butuan City, Agusan del Norte',                   tel: '(085) 342-5619', email: 'r13@dpwh.gov.ph'   },
  'BARMM': { address: 'Cotabato City',                                   tel: '(064) 421-1173', email: 'barmm@dpwh.gov.ph' },
};

function openRegion(r) {
  document.getElementById('regional-list').style.display = 'none';
  document.getElementById('regional-detail').style.display = 'block';
  document.getElementById('region-breadcrumb').textContent = `Region ${r.code} — ${r.name}`;
  document.getElementById('region-detail-title').textContent = `DPWH Regional Office ${r.code}`;
  document.getElementById('region-detail-sub').textContent = r.name;

  const contact = regionContacts[r.code] || regionContacts['NCR'];
  document.getElementById('region-contact-address').textContent = contact.address;
  document.getElementById('region-contact-tel').textContent     = contact.tel;
  document.getElementById('region-contact-email').textContent   = contact.email;

  document.querySelectorAll('#regional-detail .subpage-tab').forEach((t,i) => t.classList.toggle('active', i === 0));
  document.querySelectorAll('#regional-detail .r-section').forEach((s,i) => s.classList.toggle('active', i === 0));
}

function backToRegions() {
  document.getElementById('regional-list').style.display = 'block';
  document.getElementById('regional-detail').style.display = 'none';
}

function toggleAcc(header) {
  header.closest('.acc-item').classList.toggle('open');
}

function switchYear(btn) {
  btn.closest('.year-tabs').querySelectorAll('.ytab').forEach(t => t.classList.remove('active'));
  btn.classList.add('active');

}



function activateRegionTab(el, targetId) {
  document.querySelectorAll('#regional-detail .subpage-tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('#regional-detail .r-section').forEach(s => s.classList.remove('active'));
  el.classList.add('active');
  const target = document.getElementById(targetId);
  if (target) target.classList.add('active');
}

//  FORMER SECRETARIES 
const secretaries = [

{ seq:1, name:"Baldomero B. Aguinaldo", photo:"images/secretaries/1.Aguinaldo.jpg",
    role:"Secretary, Department of War and Public Works",
    term:"1901–1904", termStart:1901, termEnd:1904, era:"American",
    president:"William H. Taft (Civil Governor)",
    contribution:"Served during the early American colonial period, helping organize public works functions alongside military administration and managing initial infrastructure priorities.",
    tags:["Early Administration","Colonial Era"] },

{ seq:2, name:"William Cameron Forbes", photo:"images/secretaries/2. William Cameron Forbes.jpg",
    role:"Secretary, Department of Commerce and Police",
    term:"1904–1909", termStart:1904, termEnd:1909, era:"American",
    president:"William H. Taft (Civil Governor)",
    contribution:"Strengthened public works administration and promoted development of transportation infrastructure to support governance and economic growth.",
    tags:["Colonial Administration","Infrastructure Development"] },

{ seq:3, name:"Antonio De Las Alas", photo:"images/secretaries/4. Antonio De Las Alas.jpg",
    role:"Secretary, Department of Public Works and Communications",
    term:"1933–1936", termStart:1933, termEnd:1936, era:"Commonwealth",
    president:"Manuel Quezon",
    contribution:"Oversaw expansion of road networks and infrastructure programs during the early Commonwealth period to improve regional connectivity.",
    tags:["Commonwealth Era","Road Development"] },

{ seq:4, name:"Mariano J. Cuenco", photo:"images/secretaries/3. Cuenco.jpg",
    role:"Secretary, Department of Public Works and Communications",
    term:"1936–1939", termStart:1936, termEnd:1939, era:"Commonwealth",
    president:"Manuel Quezon",
    contribution:"Promoted rural infrastructure development, focusing on improving access to communities through local road construction.",
    tags:["Rural Infrastructure"] },

{ seq:5, name:"Jose Avelino", photo:"images/secretaries/5. Jose Avelino.jpg",
    role:"Secretary, Department of Public Works and Communications",
    term:"1940–1941", termStart:1940, termEnd:1941, era:"Commonwealth",
    president:"Manuel Quezon",
    contribution:"Directed infrastructure programs during the late Commonwealth period, maintaining and expanding transportation and communication systems.",
    tags:["Infrastructure Maintenance"] },

{ seq:6, name:"Quintin B. Paredes", photo:"images/secretaries/6. Paredes.jpg",
    role:"Secretary, Department of Public Works and Communications",
    term:"1943", termStart:1943, termEnd:1943, era:"Japanese Occupation",
    president:"José P. Laurel",
    contribution:"Oversaw limited public works activities focused on maintaining essential infrastructure under wartime constraints.",
    tags:["Japanese Occupation","Wartime Administration"] },

{ seq:7, name:"Jose N. Paez", photo:"images/secretaries/7. Paez.jpg",
    role:"Secretary, Department of Public Works and Communications",
    term:"1944–1945", termStart:1944, termEnd:1945, era:"Japanese Occupation",
    president:"José P. Laurel",
    contribution:"Managed public works operations during wartime, focusing on sustaining basic infrastructure with limited resources.",
    tags:["Wartime Infrastructure"] },

{ seq:8, name:"Sotero Cabahug", photo:"images/secretaries/8. Sotero Cabahug.jpg",
    role:"Secretary, Department of Public Works and Communications",
    term:"1945–1946", termStart:1945, termEnd:1946, era:"Commonwealth",
    president:"Sergio Osmeña",
    contribution:"Led early post-liberation efforts to restore damaged infrastructure and reestablish essential services.",
    tags:["Post-War Recovery"] },

{ seq:9, name:"Ricardo Nepomuceno Sr.", photo:"images/secretaries/9. Ricardo Nepomuceno, Sr._.jpg",
    role:"Secretary, Department of Public Works and Communications",
    term:"1946–1949", termStart:1946, termEnd:1949, era:"Republic",
    president:"Manuel Roxas",
    contribution:"Directed post-independence reconstruction, focusing on rebuilding roads, bridges, and public facilities damaged during the war.",
    tags:["Post-War Reconstruction"] },

{ seq:10, name:"Prospero Sanidad", photo:"images/secretaries/10. Prospero Sanidad.jpg",
    role:"Secretary, Department of Public Works and Communications",
    term:"1949–1951", termStart:1949, termEnd:1951, era:"Republic",
    president:"Elpidio Quirino",
    contribution:"Supervised infrastructure expansion, including improvements to national roads, bridges, and flood control systems.",
    tags:["Infrastructure Expansion"] },

{ seq:11, name:"Sotero Baluyot", photo:"images/secretaries/11. Sotero Baluyot.jpg",
    role:"Secretary, Department of Public Works and Communications",
    term:"1951–1952", termStart:1951, termEnd:1952, era:"Republic",
    president:"Elpidio Quirino",
    contribution:"Oversaw continued development of transportation infrastructure and supported expansion of national road systems.",
    tags:["Road Development"] },

{ seq:12, name:"Pablo Lorenzo", photo:"images/secretaries/12. Pablo Lorenzo.jpg",
    role:"Secretary, Department of Public Works and Communications",
    term:"1952–1953", termStart:1952, termEnd:1953, era:"Republic",
    president:"Elpidio Quirino",
    contribution:"Directed infrastructure programs aimed at improving national connectivity through road and bridge construction.",
    tags:["Infrastructure Development"] },

{ seq:13, name:"Vicente Y. Orosa", photo:"images/secretaries/13. Orosa.jpg",
    role:"Secretary, Department of Public Works, Transportation and Communications",
    term:"1954–1955", termStart:1954, termEnd:1955, era:"Republic",
    president:"Ramon Magsaysay",
    contribution:"Promoted rural infrastructure programs, emphasizing road construction to connect remote communities.",
    tags:["Rural Infrastructure"] },

{ seq:14, name:"Florencio Moreno", photo:"images/secretaries/14. Florencio Moreno.jpg",
    role:"Secretary, Department of Public Works, Transportation and Communications",
    term:"1955–1961", termStart:1955, termEnd:1961, era:"Republic",
    president:"Ramon Magsaysay / Carlos P. Garcia",
    contribution:"Oversaw expansion of provincial road networks and supported infrastructure development in growing regions.",
    tags:["Road Expansion"] },

{ seq:15, name:"Marciano D. Bautista", photo:"images/secretaries/15. Bautista.jpg",
    role:"Secretary, Department of Public Works, Transportation and Communications",
    term:"1961–1962", termStart:1961, termEnd:1962, era:"Republic",
    president:"Diosdado Macapagal",
    contribution:"Directed ongoing public works and infrastructure programs during a period of administrative transition.",
    tags:["Infrastructure Continuity"] },

{ seq:16, name:"Paulino T. Cases", photo:"images/secretaries/16. Cases.jpg",
    role:"Secretary, Department of Public Works, Transportation and Communications",
    term:"Jan–May 1962", termStart:1962, termEnd:1962, era:"Republic",
    president:"Diosdado Macapagal",
    contribution:"Served briefly, maintaining continuity of infrastructure programs and departmental operations.",
    tags:["Transition Period"] },

{ seq:17, name:"Brigido R. Valencia", photo:"images/secretaries/17. Valencia.jpg",
    role:"Secretary, Department of Public Works, Transportation and Communications",
    term:"1962–1963", termStart:1962, termEnd:1963, era:"Republic",
    president:"Diosdado Macapagal",
    contribution:"Oversaw development of transportation and communication infrastructure linking rural and urban areas.",
    tags:["Connectivity"] },

{ seq:18, name:"Jorge A. Abad", photo:"images/secretaries/18. Abad.jpg",
    role:"Secretary, Department of Public Works, Transportation and Communications",
    term:"1963–1965", termStart:1963, termEnd:1965, era:"Republic",
    president:"Diosdado Macapagal",
    contribution:"Managed infrastructure programs supporting national development and coordination across sectors.",
    tags:["Infrastructure Management"] },

{ seq:19, name:"Antonio V. Raquiza", photo:"images/secretaries/19. Raquiza.jpg",
    role:"Secretary, Department of Public Works, Transportation and Communications",
    term:"1965–1966", termStart:1965, termEnd:1966, era:"Republic",
    president:"Ferdinand E. Marcos",
    contribution:"Oversaw early infrastructure programs under the Marcos administration, focusing on roads and bridges.",
    tags:["Road Development"] },

{ seq:20, name:"Rene Espina", photo:"images/secretaries/20. Rene Espina.jpg",
    role:"Secretary, Department of Public Works, Transportation and Communications",
    term:"1966–1970", termStart:1966, termEnd:1970, era:"Republic",
    president:"Ferdinand E. Marcos",
    contribution:"Directed expansion of national infrastructure, including roads and public works facilities.",
    tags:["Infrastructure Expansion"] },

{ seq:21, name:"Manuel B. Syquio", photo:"images/secretaries/21. Syquio.jpg",
    role:"Secretary, Department of Public Works, Transportation and Communications",
    term:"1970–1972", termStart:1970, termEnd:1972, era:"Martial",
    president:"Ferdinand E. Marcos",
    contribution:"Oversaw infrastructure programs during a period of political transition and administrative restructuring.",
    tags:["Transition Period"] },

{ seq:22, name:"David M. Consunji", photo:"images/secretaries/22. Consunji.jpg",
    role:"Secretary, Department of Public Works, Transportation and Communications",
    term:"1972–1975", termStart:1972, termEnd:1975, era:"Martial",
    president:"Ferdinand E. Marcos",
    contribution:"Led major infrastructure development programs, including expansion of road networks and public facilities.",
    tags:["Infrastructure Development"] },

{ seq:23, name:"Alfredo L. Juinio", photo:"images/secretaries/23. Juinio.jpg",
    role:"Minister, Ministry of Public Works, Transportation and Communications",
    term:"1975–1979, 1979–1981", termStart:1975, termEnd:1981, era:"Martial",
    president:"Ferdinand E. Marcos",
    contribution:"Directed infrastructure programs under the ministry system, focusing on transportation and public works development.",
    tags:["Ministry System"] },

{ seq:24, name:"Baltazar A. Aquino", photo:"images/secretaries/24. Aquino.jpg",
    role:"Secretary, Department of Public Highways",
    term:"1974–1979", termStart:1979, termEnd:1979, era:"Martial",
    president:"Ferdinand E. Marcos",
    contribution:"Oversaw public highways administration and contributed to development of national road infrastructure.",
    tags:["Public Highways"] },

{ seq:25, name:"Vicente T. Paterno", photo:"images/secretaries/25. Paterno.jpg",
    role:"Minister, Ministry of Public Highways",
    term:"1979–1980", termStart:1979, termEnd:1980, era:"Martial",
    president:"Ferdinand E. Marcos",
    contribution:"Led highway infrastructure programs and continued development of the national road network.",
    tags:["Highway Development"] },

{ seq:26, name:"Jesus S. Hipolito", photo:"images/secretaries/26. Hipolito.jpg",
    role:"Minister, Ministry of Public Highways / Ministry of Public Works and Highways",
    term:"1980–1982", termStart:1980, termEnd:1982, era:"Martial",
    president:"Ferdinand E. Marcos",
    contribution:"Managed public works and highways programs, including urban and regional infrastructure improvements.",
    tags:["Urban Infrastructure"] },

{ seq:27, name:"Rogaciano Mercado", photo:"images/secretaries/27. Rogaciano Mercado.jpg",
    role:"Secretary, Department of Public Works and Highways",
    term:"Mar–Nov 1986", termStart:1986, termEnd:1986, era:"Modern",
    president:"Corazon C. Aquino",
    contribution:"Oversaw early transition of the department following the restoration of democratic governance.",
    tags:["Post-EDSA Transition"] },

{ seq:28, name:"Vicente R. Jayme", photo:"images/secretaries/28. Jayme.jpg",
    role:"Secretary, Department of Public Works and Highways",
    term:"1986–1987", termStart:1986, termEnd:1987, era:"Modern",
    president:"Corazon C. Aquino",
    contribution:"Helped restore transparency and accountability in public works administration.",
    tags:["Reform"] },

{ seq:29, name:"Juanito N. Ferrer", photo:"images/secretaries/29. Ferrer.jpg",
    role:"Secretary, Department of Public Works and Highways",
    term:"1987–1988", termStart:1987, termEnd:1988, era:"Modern",
    president:"Corazon C. Aquino",
    contribution:"Oversaw infrastructure maintenance and recovery efforts during the early post-EDSA period.",
    tags:["Recovery"] },

{ seq:30, name:"Fiorello R. Estuar", photo:"images/secretaries/30. Estuar.jpg",
    role:"Secretary, Department of Public Works and Highways",
    term:"1988–1990", termStart:1988, termEnd:1990, era:"Modern",
    president:"Corazon C. Aquino",
    contribution:"Directed infrastructure rehabilitation and improvement of public works systems.",
    tags:["Rehabilitation"] },

{ seq:31, name:"Jose P. De Jesus", photo:"images/secretaries/31. De Jesus.jpg",
    role:"Secretary, Department of Public Works and Highways",
    term:"1991–1993", termStart:1991, termEnd:1993, era:"Modern",
    president:"Corazon C. Aquino",
    contribution:"Led infrastructure rebuilding efforts following major natural disasters.",
    tags:["Disaster Recovery"] },

{ seq:32, name:"Edmundo V. Mir", photo:"images/secretaries/32. Mir.jpg",
    role:"Acting Secretary, Department of Public Works and Highways",
    term:"Mar 1–Jun 1, 1993", termStart:1993, termEnd:1993, era:"Modern",
    president:"Fidel V. Ramos",
    contribution:"Ensured continuity of operations during a leadership transition.",
    tags:["Transition"] },

{ seq:33, name:"Gregorio R. Vigilar", photo:"images/secretaries/33. Vigilar.jpg",
    role:"Secretary, Department of Public Works and Highways",
    term:"1993–2001", termStart:1993, termEnd:2001, era:"Modern",
    president:"Fidel V. Ramos / Joseph Estrada",
    contribution:"Oversaw modernization of infrastructure systems and expansion of major road networks.",
    tags:["Modernization"] },

{ seq:34, name:"Simeon A. Datumanong", photo:"images/secretaries/34. Datumanong.jpg",
    role:"Secretary, Department of Public Works and Highways",
    term:"2001–2003", termStart:2001, termEnd:2003, era:"Modern",
    president:"Gloria Macapagal-Arroyo",
    contribution:"Directed infrastructure development programs with focus on regional connectivity.",
    tags:["Regional Development"] },

{ seq:35, name:"Bayani F. Fernando", photo:"images/secretaries/35. Fernando.jpg",
    role:"Secretary, Department of Public Works and Highways",
    term:"Jan 15–Apr 15, 2003", termStart:2003, termEnd:2003, era:"Modern",
    president:"Gloria Macapagal-Arroyo",
    contribution:"Focused on urban infrastructure improvements and traffic-related public works initiatives.",
    tags:["Urban Infrastructure"] },

{ seq:36, name:"Florante Soriquez", photo:"images/secretaries/36. Florante Soriquez.jpg",
    role:"Acting Secretary, Department of Public Works and Highways",
    term:"Apr 16, 2003–Feb 13, 2005", termStart:2003, termEnd:2005, era:"Modern",
    president:"Gloria Macapagal-Arroyo",
    contribution:"Maintained continuity of infrastructure programs and supported ongoing construction projects.",
    tags:["Continuity"] },

{ seq:37, name:"Manuel M. Bonoan", photo:"images/secretaries/37. 1MnuelBonoan.jpg",
    role:"Officer-in-Charge, Department of Public Works and Highways",
    term:"Feb 5–Jul 3, 2007", termStart:2007, termEnd:2007, era:"Modern",
    president:"Gloria Macapagal-Arroyo",
    contribution:"Managed departmental operations and ensured continuity of infrastructure programs during transition.",
    tags:["Transition"] },

{ seq:38, name:"Hermogenes E. Ebdane Jr.", photo:"images/secretaries/38. Ebdane Jr._.jpg",
    role:"Secretary, Department of Public Works and Highways",
    term:"Feb 14, 2005–Feb 5, 2007<br>Jul 3–Oct 26, 2008", termStart:2005, termEnd:2008, era:"Modern",
    president:"Gloria Macapagal-Arroyo",
    contribution:"Oversaw expansion of road networks and implementation of infrastructure development projects nationwide.",
    tags:["Road Expansion"] },

{ seq:39, name:"Victor A. Domingo", photo:"images/secretaries/39. Domingo.jpg",
    role:"Acting Secretary, Department of Public Works and Highways",
    term:"Oct 25, 2009–Jul 5, 2010", termStart:2009, termEnd:2010, era:"Modern",
    president:"Gloria Macapagal-Arroyo",
    contribution:"Directed infrastructure maintenance and completion of ongoing projects.",
    tags:["Maintenance"] },

{ seq:40, name:"Rogelio L. Singson", photo:"images/secretaries/40. Singson.jpg",
    role:"Secretary, Department of Public Works and Highways",
    term:"Jul 6, 2010–Jun 30, 2016", termStart:2010, termEnd:2016, era:"Modern",
    president:"Benigno Aquino III",
    contribution:"Led reforms in procurement and project management while expanding national infrastructure programs.",
    tags:["Reform","Infrastructure Expansion"] },

{ seq:41, name:"Rafael C. Yabut", photo:"images/secretaries/41. Yabut.jpg",
    role:"Acting Secretary, Department of Public Works and Highways",
    term:"Jul 1–Aug 2, 2016", termStart:2016, termEnd:2016, era:"Modern",
    president:"Rodrigo Duterte",
    contribution:"Ensured continuity of infrastructure programs during leadership transition.",
    tags:["Transition"] },

{ seq:42, name:"Mark A. Villar", photo:"images/secretaries/42. Villar.jpg",
    role:"Secretary, Department of Public Works and Highways",
    term:"Aug 1, 2016–Oct 6, 2021", termStart:2016, termEnd:2021, era:"Modern",
    president:"Rodrigo Duterte",
    contribution:"Led large-scale infrastructure expansion programs, significantly increasing investment in roads, bridges, and public works.",
    tags:["Infrastructure Expansion"] },

{ seq:43, name:"Roger G. Mercado", photo:"images/secretaries/43. Roger Mercado.jpg",
    role:"Acting Secretary, Department of Public Works and Highways",
    term:"Oct 13, 2021–Jun 30, 2022", termStart:2021, termEnd:2022, era:"Modern",
    president:"Rodrigo Duterte",
    contribution:"Oversaw ongoing infrastructure programs and ensured operational continuity during transition.",
    tags:["Transition"] },

{ seq:44, name:"Manuel M. Bonoan", photo:"images/secretaries/44. Manuel Bonoan.jpg",
    role:"Secretary, Department of Public Works and Highways",
    term:"Jul 1, 2022–Aug 31, 2025", termStart:2022, termEnd:2025, era:"Modern",
    president:"Ferdinand R. Marcos Jr.",
    contribution:"Supervised continuation of national infrastructure development programs, including road network expansion and public works projects.",
    tags:["Infrastructure Development"] },

];

let fsCurrentView = 'grid', fsCurrentEra = 'all', fsCurrentSort = 'asc';

function fsGetInitials(name) {
  return name.split(' ').filter(w => w.length > 2).slice(-2).map(w => w[0]).join('');
}
function fsCalcDuration(s, e) {
  const d = e - s; return d <= 1 ? `${d+1} yr` : `${d} yrs`;
}
 
function fsBuildCard(s) {
  const ini = fsGetInitials(s.name);
  const photoHTML = s.photo
    ? `<img src="${s.photo}" alt="${s.name}"
           style="width:100%;height:100%;object-fit:cover;object-position:top center;"
           onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">
       <div class="card-photo-placeholder" style="display:none;">
         <div class="avatar-initials">${ini}</div>
         <div class="photo-label">Photo unavailable</div>
       </div>`
    : `<div class="card-photo-placeholder">
         <div class="avatar-initials">${ini}</div>
         <div class="photo-label">No photo available</div>
       </div>`;
  return `<div class="sec-card" data-era="${s.era}">
    <div class="card-photo-wrap">
      ${photoHTML}
      <div class="seq-badge">${s.seq}</div>
    </div>
    <div class="card-body">
      <div class="card-title-prefix">${s.role}</div>
      <div class="card-name">${s.name}</div>
      <div class="card-term">
        <span class="term-pill">${s.term}</span>
        <span class="term-duration">${fsCalcDuration(s.termStart, s.termEnd)}</span>
      </div>
      <div class="card-divider"></div>
      <div class="card-contribution">${s.contribution}</div>
      <div class="card-tags">${s.tags.map(t=>`<span class="sec-tag">${t}</span>`).join('')}</div>
      <div class="card-president">
        <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor"><path d="M8 1a4 4 0 100 8A4 4 0 008 1zm0 10c-4 0-7 2-7 3v1h14v-1c0-1-3-3-7-3z"/></svg>
        Under: <span>${s.president}</span>
      </div>
    </div>
  </div>`;
}
 
function fsBuildRow(s) {
  const ini = fsGetInitials(s.name);
  return `<tr><td class="lt-num">${s.seq}</td>
    <td><div class="lt-photo-placeholder">${ini}</div></td>
    <td><div class="lt-name">${s.name}</div><div style="font-size:11px;color:var(--textlt);margin-top:2px;">Under ${s.president}</div></td>
    <td><span class="lt-term-pill">${s.term}</span><br><span style="font-size:11.5px;color:var(--textlt);">${fsCalcDuration(s.termStart,s.termEnd)}</span></td>
    <td class="lt-blurb">${s.contribution}</td>
    <td style="font-size:13px;color:var(--textlt);">${s.president}</td></tr>`;
}
function fsBuildTl(s) {
  const ini = fsGetInitials(s.name);
  return `<div class="tl-item" data-era="${s.era}">
    <div class="tl-dot"></div>
    <div class="tl-photo-placeholder">${ini}</div>
    <div class="tl-body">
      <div class="tl-name">${s.seq}. ${s.name}</div>
      <div class="tl-term"><strong>${s.term}</strong> · ${fsCalcDuration(s.termStart,s.termEnd)} · Under ${s.president}</div>
      <div class="tl-contrib">${s.contribution}</div>
      <div class="card-tags" style="margin-top:10px;">${s.tags.map(t=>`<span class="sec-tag">${t}</span>`).join('')}</div>
    </div>
  </div>`;
}
function fsRenderAll() {
  const q = document.getElementById('fsSearchInput').value.toLowerCase().trim();
  let data = secretaries.filter(s => {
    const eraOk = fsCurrentEra === 'all' || s.era === fsCurrentEra;
    const qOk = !q || s.name.toLowerCase().includes(q) || s.president.toLowerCase().includes(q) || s.contribution.toLowerCase().includes(q) || s.tags.some(t=>t.toLowerCase().includes(q));
    return eraOk && qOk;
  });
  if (fsCurrentSort === 'desc') data.sort((a,b) => b.termStart - a.termStart);
  else if (fsCurrentSort === 'alpha') data.sort((a,b) => a.name.localeCompare(b.name));
  else data.sort((a,b) => a.termStart - b.termStart);
  document.getElementById('fsResultCount').textContent = data.length;
  document.getElementById('fsTotalCount').textContent = secretaries.length;
  const eraMap = {American:'American Period',Commonwealth:'Commonwealth Era',Republic:'Third Republic',Martial:'Martial Law Era',Modern:'Modern Era'};
  document.getElementById('fsActiveEraLabel').textContent = fsCurrentEra === 'all' ? 'All eras displayed' : eraMap[fsCurrentEra] + ' selected';
  document.getElementById('fsGridView').innerHTML = data.map(fsBuildCard).join('');
  document.getElementById('fsListBody').innerHTML = data.map(fsBuildRow).join('');
  document.getElementById('fsTimelineTrack').innerHTML = data.map(fsBuildTl).join('');
  document.getElementById('fsEmptyState').classList.toggle('visible', data.length === 0);
}
function fsFilterEra(btn) {
  document.querySelectorAll('.fs-era-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  fsCurrentEra = btn.dataset.era;
  fsRenderAll();
}
function fsSortCards() {
  fsCurrentSort = document.getElementById('fsSortSelect').value;
  fsRenderAll();
}
function fsSetView(v) {
  fsCurrentView = v;
  document.getElementById('fsGridView').classList.toggle('active', v==='grid');
  document.getElementById('fsListView').classList.toggle('active', v==='list');
  document.getElementById('fsTimelineView').classList.toggle('active', v==='timeline');
  ['fsBtnGrid','fsBtnList','fsBtnTimeline'].forEach((id,i) => {
    document.getElementById(id).classList.toggle('active', ['grid','list','timeline'][i]===v);
  });
}
document.getElementById('fsSearchInput').addEventListener('input', fsRenderAll);
fsRenderAll();

/* 
   BUDGET REPORT LOGIC
   (all vars/fns prefixed bgt)
    */
   const BGT_SECTIONS = [
  'Budget Overview 2015–2021',
  'Infrastructure by Category',
  'FY 2021 Budget Summary',
  'Operations by Outcome',
  'Road System (OO-1) Detail',
  'Flood Control (OO-2) Budget',
  'Convergence & Special Programs',
  'Capital Outlays Breakdown',
  'Regional Budget Distribution'
];
 
const bgtTrendData = [
  { year:2015, val:303.16, pct:null,  color:'#4A7FEF' },
  { year:2016, val:397.11, pct:'+31%', color:'#4A7FEF' },
  { year:2017, val:467.66, pct:'+18%', color:'#4A7FEF' },
  { year:2018, val:650.87, pct:'+39%', color:'#4A7FEF' },
  { year:2019, val:454.79, pct:'−30%', color:'#4A7FEF' },
  { year:2020, val:581.67, pct:'+28%', color:'#4A7FEF' },
  { year:2021, val:667.32, pct:'+15%', color:'#E8620A', highlight:true }
];
 
let bgtCurrent = 0;
let bgtReady = false;
 
function bgtBuildTabs() {
  const tabsEl = document.getElementById('bgt-tabs');
  tabsEl.innerHTML = '';
  BGT_SECTIONS.forEach((name, i) => {
    const t = document.createElement('div');
    t.className = 'bgt-tab' + (i === bgtCurrent ? ' bgt-active' : '');
    t.innerHTML = `<span class="bgt-num">0${i+1}</span> ${name}`;
    t.onclick = () => bgtGoTo(i);
    tabsEl.appendChild(t);
  });
}
 
function bgtBuildTrend() {
  const chart = document.getElementById('bgt-trend-chart');
  if (!chart) return;
  const max = Math.max(...bgtTrendData.map(d => d.val));
  chart.innerHTML = '';
  bgtTrendData.forEach(d => {
    const hp = (d.val / max) * 100;
    const wrap = document.createElement('div');
    wrap.className = 'bgt-tbar-wrap';
    wrap.innerHTML = `
      <div class="bgt-tbar-amt">₱${d.val}B</div>
      <div class="bgt-tbar" style="height:${hp}%;background:${d.highlight ? '#E8620A' : '#2E5FD9'};"></div>
      <div class="bgt-tbar-label">${d.year}</div>
      ${d.pct ? `<div class="bgt-tbar-pct">${d.pct}</div>` : ''}
    `;
    chart.appendChild(wrap);
  });
}
 
function bgtGoTo(idx) {
  if (idx < 0 || idx >= BGT_SECTIONS.length) return;
  document.getElementById('bgt-sec-' + bgtCurrent).classList.remove('bgt-active');
  document.querySelectorAll('#bgt-tabs .bgt-tab')[bgtCurrent].classList.remove('bgt-active');
  bgtCurrent = idx;
  document.getElementById('bgt-sec-' + bgtCurrent).classList.add('bgt-active');
  document.querySelectorAll('#bgt-tabs .bgt-tab')[bgtCurrent].classList.add('bgt-active');
  document.getElementById('bgt-prev').disabled = bgtCurrent === 0;
  document.getElementById('bgt-next').disabled = bgtCurrent === BGT_SECTIONS.length - 1;
  document.getElementById('bgt-nav-label').textContent = `Section 0${bgtCurrent+1} of 0${BGT_SECTIONS.length}`;
  document.getElementById('bgt-progress').style.width = ((bgtCurrent + 1) / BGT_SECTIONS.length * 100) + '%';
}
 
function bgtNavigate(dir) { bgtGoTo(bgtCurrent + dir); }
 
function bgtInit() {
  if (bgtReady) return;
  bgtReady = true;
  bgtBuildTabs();
  bgtBuildTrend();
  bgtGoTo(0);
}
 
// Auto-init if budget tab is somehow already visible on load
document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('about-budget').classList.contains('active')) bgtInit();
});

function activateSubTab(el, targetId) {
  const parent = el.closest('.page');
  parent.querySelectorAll('.subpage-tab').forEach(t => t.classList.remove('active'));
  parent.querySelectorAll('.r-section').forEach(s => s.classList.remove('active'));
  el.classList.add('active');
  const target = document.getElementById(targetId);
  if (target) target.classList.add('active');
  if (targetId === 'about-budget') bgtInit();
}





/*  GOVERNMENT LINKS FILTER & SEARCH  */
function glFilter(cat, btn) {
  document.querySelectorAll('.gl-fpill').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  document.getElementById('gl-search').value = '';
  document.querySelectorAll('.gl-new-card').forEach(c => {
    c.style.display = (cat === 'all' || c.dataset.cat === cat) ? '' : 'none';
  });
  document.getElementById('gl-no-results').style.display = 'none';
}

function glSearch(q) {
  const lq = q.trim().toLowerCase();
  document.querySelectorAll('.gl-fpill').forEach(b => b.classList.remove('active'));
  document.querySelector('.gl-fpill').classList.add('active');
  let any = false;
  document.querySelectorAll('.gl-new-card').forEach(c => {
    const match = !lq || c.textContent.toLowerCase().includes(lq);
    c.style.display = match ? '' : 'none';
    if (match) any = true;
  });
  document.getElementById('gl-no-results').style.display = any ? 'none' : 'block';
}



/* ============================================================
   JOB DATA
   ============================================================ */
const jobs = [
  { id:1,  posted:"2026-04-30", itemNo:"ENG3-98-2014",     title:"Engineer III",                    region:"Central Office", office:"Buildings and Special Projects Management Cluster-UPMO",                         location:"2nd Street, Port Area, Manila",        sg:19, deadline:"2026-05-10", category:"Engineering",           req:{ edu:"Bachelor's degree in Engineering relevant to the job", exp:"2 years of relevant experience", trng:"8 hours of relevant training", elig:"R.A. 1080" }},
  { id:2,  posted:"2026-04-30", itemNo:"ENG3-76-2018",     title:"Engineer III",                    region:"Central Office", office:"UPMO - Project Manager's Pool",                                                  location:"2nd Street, Port Area, Manila",        sg:19, deadline:"2026-05-10", category:"Engineering",           req:{ edu:"Bachelor's degree in Engineering relevant to the job", exp:"2 years of relevant experience", trng:"8 hours of relevant training", elig:"R.A. 1080" }},
  { id:3,  posted:"2026-04-30", itemNo:"ENG4-350-1998",    title:"Engineer IV",                     region:"Central Office", office:"Bureau of Design, Highways Division",                                            location:"Bonifacio Drive, Port Area, Manila",   sg:22, deadline:"2026-05-10", category:"Engineering",           req:{ edu:"Bachelor's degree in Engineering relevant to the job", exp:"3 years of relevant experience", trng:"16 hours of relevant training", elig:"R.A. 1080" }},
  { id:4,  posted:"2026-04-30", itemNo:"ENG4-22-2014",     title:"Engineer IV",                     region:"Central Office", office:"Bureau of Design, Buildings Division",                                           location:"Bonifacio Drive, Port Area, Manila",   sg:22, deadline:"2026-05-10", category:"Engineering",           req:{ edu:"Bachelor's degree in Engineering relevant to the job", exp:"3 years of relevant experience", trng:"16 hours of relevant training", elig:"R.A. 1080" }},
  { id:5,  posted:"2026-04-30", itemNo:"ARC3-16-1998",     title:"Architect III",                   region:"Central Office", office:"Bureau of Design, Buildings Division",                                           location:"Bonifacio Drive, Port Area, Manila",   sg:19, deadline:"2026-05-10", category:"Architecture",          req:{ edu:"Bachelor's Degree in Architecture",                                                          exp:"2 years of relevant experience", trng:"8 hours of relevant training",  elig:"RA 1080" }},
  { id:6,  posted:"2026-04-30", itemNo:"ENGAS-68-2014",    title:"Engineering Assistant",           region:"Central Office", office:"Bureau of Design, Buildings Division",                                           location:"Bonifacio Drive, Port Area, Manila",   sg:8,  deadline:"2026-05-10", category:"Engineering",           req:{ edu:"Completion of 2-year college studies or Grade 12/Senior High School",                        exp:"1 year of relevant experience",  trng:"4 hours of relevant training",  elig:"Career Service (Sub-Professional) First Level Eligibility" }},
  { id:7,  posted:"2026-04-30", itemNo:"ENGAS-36-2018",    title:"Engineering Assistant",           region:"Central Office", office:"Bridges Management Cluster-UPMO",                                               location:"2nd Street, Port Area, Manila",        sg:8,  deadline:"2026-05-10", category:"Engineering",           req:{ edu:"Completion of 2-year college studies or Grade 12/Senior High School",                        exp:"1 year of relevant experience",  trng:"4 hours of relevant training",  elig:"Career Service (Sub-Professional) First Level Eligibility" }},
  { id:8,  posted:"2026-04-30", itemNo:"INFOSR2-6-2018",   title:"Information Systems Researcher II",region:"Central Office", office:"Information Management Service, Business Innovation Division",                  location:"Bonifacio Drive, Port Area, Manila",   sg:14, deadline:"2026-05-10", category:"Information Technology", req:{ edu:"Bachelor's degree relevant to the job",                                                       exp:"1 year of relevant experience",  trng:"4 hours of relevant training",  elig:"Career Service (Professional) / Second Level Eligibility" }},
  { id:9,  posted:"2026-04-29", itemNo:"COMPRO2-16-2014",  title:"Computer Programmer II",          region:"Central Office", office:"Information Management Service, Application Support Division",                   location:"Bonifacio Drive, Port Area, Manila",   sg:15, deadline:"2026-05-09", category:"Information Technology", req:{ edu:"Bachelor's degree relevant to the job",                                                       exp:"1 year of relevant experience",  trng:"4 hours of relevant training",  elig:"Career Service (Professional) / Second Level Eligibility" }},
  { id:10, posted:"2026-04-29", itemNo:"SADAS1-2-2015",    title:"Senior Administrative Assistant I",region:"Central Office", office:"Stakeholders Relations Service, Public Information Division",                  location:"Bonifacio Drive, Port Area, Manila",   sg:13, deadline:"2026-05-09", category:"Administration",         req:{ edu:"Completion of 2 years college or HS graduate with vocational/trade course",                  exp:"3 years of relevant experience", trng:"16 hours of relevant training", elig:"Career Service (Subprofessional) / First Level Eligibility" }},
  { id:11, posted:"2026-04-29", itemNo:"ENG5-26-1998",     title:"Engineer V",                      region:"Central Office", office:"Bureau of Research and Standards, Standards Development Division",               location:"EDSA Diliman, Quezon City",            sg:24, deadline:"2026-05-09", category:"Engineering",           req:{ edu:"Master's degree OR Certificate in Leadership and Management from the CSC",                   exp:"4 years supervisory/management experience", trng:"40 hours supervisory/management L&D intervention", elig:"R.A. 1080 (Board Passed Engineering Courses)" }},
  { id:12, posted:"2026-04-29", itemNo:"ENG4-377-1998",    title:"Engineer IV",                     region:"Central Office", office:"Bureau of Research and Standards, Standards Development Division",               location:"EDSA Diliman, Quezon City",            sg:22, deadline:"2026-05-09", category:"Engineering",           req:{ edu:"Bachelor's degree in Engineering relevant to the job", exp:"3 years of relevant experience", trng:"16 hours of relevant training", elig:"RA 1080" }},
  { id:13, posted:"2026-04-29", itemNo:"ENG4-381-1998",    title:"Engineer IV",                     region:"Central Office", office:"Bureau of Research and Standards, Technical Services Division",                 location:"EDSA Diliman, Quezon City",            sg:22, deadline:"2026-05-09", category:"Engineering",           req:{ edu:"Bachelor's degree in Engineering relevant to the job", exp:"3 years of relevant experience", trng:"16 hours of relevant training", elig:"RA 1080" }},
  { id:14, posted:"2026-04-29", itemNo:"ENG4-379-1998",    title:"Engineer IV",                     region:"Central Office", office:"Bureau of Research and Standards, Research and Development Division",            location:"EDSA Diliman, Quezon City",            sg:22, deadline:"2026-05-09", category:"Engineering",           req:{ edu:"Bachelor's degree in Engineering relevant to the job", exp:"3 years of relevant experience", trng:"16 hours of relevant training", elig:"RA 1080" }},
  { id:15, posted:"2026-04-29", itemNo:"ENG3-1075-1998",   title:"Engineer III",                    region:"Central Office", office:"Bureau of Research and Standards, Technical Services Division",                 location:"EDSA Diliman, Quezon City",            sg:19, deadline:"2026-05-09", category:"Engineering",           req:{ edu:"Bachelor's degree in Engineering relevant to the job", exp:"2 years of relevant experience", trng:"8 hours of relevant training",  elig:"R.A. 1080" }},
  { id:16, posted:"2026-04-29", itemNo:"ENG2-586-1998",    title:"Engineer II (Civil Engineer)",    region:"Central Office", office:"Bureau of Research and Standards, Research and Development Division",            location:"EDSA Diliman, Quezon City",            sg:16, deadline:"2026-05-09", category:"Engineering",           req:{ edu:"Bachelor's degree in Engineering relevant to the job", exp:"None required",                  trng:"None required",                  elig:"RA 1080 (Civil Engineer)" }},
  { id:17, posted:"2026-04-29", itemNo:"ENG2-719-1998",    title:"Engineer II (Civil Engineer)",    region:"Central Office", office:"Bureau of Research and Standards, Materials Testing Division",                  location:"EDSA Diliman, Quezon City",            sg:16, deadline:"2026-05-09", category:"Engineering",           req:{ edu:"Bachelor's degree in Engineering relevant to the job", exp:"None required",                  trng:"None required",                  elig:"RA 1080 (Civil Engineer)" }},
  { id:18, posted:"2026-04-29", itemNo:"ENG2-785-1998",    title:"Engineer II (Civil Engineer)",    region:"Central Office", office:"Bureau of Research and Standards, Materials Testing Division",                  location:"EDSA Diliman, Quezon City",            sg:16, deadline:"2026-05-09", category:"Engineering",           req:{ edu:"Bachelor's degree in Engineering relevant to the job", exp:"None required",                  trng:"None required",                  elig:"RA 1080 (Civil Engineer)" }},
  { id:19, posted:"2026-04-29", itemNo:"LABT2-1-1998",     title:"Laboratory Technician II",        region:"Central Office", office:"Bureau of Research and Standards, Materials Testing Division",                  location:"EDSA Diliman, Quezon City",            sg:8,  deadline:"2026-05-09", category:"Administration",         req:{ edu:"Completion of 2-year college studies or Grade 12/Senior High School",                        exp:"1 year of relevant experience",  trng:"4 hours of relevant training",  elig:"Laboratory Technician (MC 10, s. 2013-Category II)" }},
  { id:20, posted:"2026-04-29", itemNo:"LABT2-118-1998",   title:"Laboratory Technician II",        region:"Central Office", office:"Bureau of Research and Standards, Research and Development Division",            location:"EDSA Diliman, Quezon City",            sg:8,  deadline:"2026-05-09", category:"Administration",         req:{ edu:"Completion of 2-year college studies or Grade 12/Senior High School",                        exp:"1 year of relevant experience",  trng:"4 hours of relevant training",  elig:"Laboratory Technician (MC 10, s. 2013-Category II)" }},
  { id:21, posted:"2026-04-29", itemNo:"LABT2-13-2014",    title:"Laboratory Technician II",        region:"Central Office", office:"Bureau of Research and Standards, Research and Development Division",            location:"EDSA Diliman, Quezon City",            sg:8,  deadline:"2026-05-09", category:"Administration",         req:{ edu:"Completion of 2-year college studies or Grade 12/Senior High School",                        exp:"1 year of relevant experience",  trng:"4 hours of relevant training",  elig:"Laboratory Technician (MC 10, s. 2013-Category II)" }},
  { id:22, posted:"2026-04-22", itemNo:"ENG4-15-2014",     title:"Engineer IV",                     region:"Central Office", office:"Bureau of Maintenance, Safety and Disaster Management Coordination Division",    location:"2nd Street, Port Area, Manila",        sg:22, deadline:"2026-05-02", category:"Engineering",           req:{ edu:"Bachelor's degree in Engineering relevant to the job", exp:"3 years of relevant experience", trng:"16 hours of relevant training", elig:"R.A. 1080" }},
  { id:23, posted:"2026-04-22", itemNo:"ENG4-16-2014",     title:"Engineer IV",                     region:"Central Office", office:"Bureau of Maintenance, Safety and Disaster Management Coordination Division",    location:"2nd Street, Port Area, Manila",        sg:22, deadline:"2026-05-02", category:"Engineering",           req:{ edu:"Bachelor's degree in Engineering relevant to the job", exp:"3 years of relevant experience", trng:"16 hours of relevant training", elig:"R.A. 1080" }},
  { id:24, posted:"2026-04-22", itemNo:"PRAP2-10-1998",    title:"Property Appraiser II",           region:"Central Office", office:"Bureau of Maintenance, National Building Services Division",                      location:"2nd Street, Port Area, Manila",        sg:15, deadline:"2026-05-02", category:"Administration",         req:{ edu:"Bachelor's degree relevant to the job",                                                       exp:"1 year of relevant experience",  trng:"4 hours of relevant training",  elig:"RA 1080 (Real Estate Service)" }},
];

/*  CATEGORY STYLE MAP  */
const CAT = {
  "Engineering":            { accent:"#4C6EF5", bg:"#F0F3FF", fg:"#2438A6", border:"rgba(76,110,245,0.22)", icon:`<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 4px; display: inline-block; vertical-align: middle;"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>` },
  "Information Technology": { accent:"#8B5CF6", bg:"#F5F3FF", fg:"#6D28D9", border:"rgba(109,40,217,0.2)",  icon:`<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 4px; display: inline-block; vertical-align: middle;"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>` },
  "Administration":         { accent:"#10B981", bg:"#ECFDF5", fg:"#065F46", border:"rgba(5,95,70,0.2)",     icon:`<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 4px; display: inline-block; vertical-align: middle;"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>` },
  "Architecture":           { accent:"#FF8A5C", bg:"#FFF4EF", fg:"#C84B00", border:"rgba(200,75,0,0.2)",    icon:`<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 4px; display: inline-block; vertical-align: middle;"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>` },
};

/*  STATE  */
let currentPage = 1;
const perPage = 9;
let activeChip = "";
let filtered = [...jobs];

/*  DEADLINE URGENCY  */
function deadlineInfo(dateStr) {
  const today = new Date("2026-05-03");
  const dl = new Date(dateStr);
  const diff = Math.ceil((dl - today) / 86400000);
  const label = dl.toLocaleDateString("en-PH", { month:"short", day:"numeric", year:"numeric" });
  if (diff <= 0) return { label:"Closed",              cls:"urgent", dot:"" };
  if (diff <= 7) return { label:`${diff}d — ${label}`, cls:"urgent", dot:"" };
  if (diff <= 14) return { label:label,                cls:"soon",   dot:"" };
  return               { label:label,                  cls:"ok",     dot:"" };
}

/*  RENDER  */
function renderCards(list) {
  const grid    = document.getElementById("cardsGrid");
  const empty   = document.getElementById("emptyState");
  const countEl = document.getElementById("resultCount");
  const totalEl = document.getElementById("totalCount");

  totalEl.textContent = jobs.length;
  countEl.textContent = list.length;

  if (list.length === 0) {
    grid.innerHTML = "";
    empty.classList.add("visible");
    document.getElementById("paginationNav").style.display = "none";
    return;
  }
  empty.classList.remove("visible");
  document.getElementById("paginationNav").style.display = "";

  const start = (currentPage - 1) * perPage;
  const page  = list.slice(start, start + perPage);

  grid.innerHTML = page.map(job => {
    const cs  = CAT[job.category] || CAT["Administration"];
    const dl  = deadlineInfo(job.deadline);
    const r   = job.req;
    const posted = new Date(job.posted).toLocaleDateString("en-PH", { month:"short", day:"numeric", year:"numeric" });

    return `
    <article class="job-card"
      style="--cat-accent:${cs.accent}"
      role="article" aria-label="${job.title}, ${job.itemNo}">

      <div class="card-body">
        <div class="card-top">
          <span class="cat-tag" style="background:${cs.bg};color:${cs.fg};border-color:${cs.border}">
            ${cs.icon} ${job.category}
          </span>
          <button class="btn-save" onclick="toggleSave(this)" aria-label="Save job" title="Save this position">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path></svg>
          </button>
        </div>

        <h2 class="card-title">${job.title}</h2>
        <div class="card-item-no">Item No. ${job.itemNo} &nbsp;·&nbsp; Posted ${posted}</div>

        <div class="card-meta">
          <div class="meta-row">
            <span class="meta-icon">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: var(--royal);"><rect x="4" y="2" width="16" height="20" rx="2" ry="2"></rect><line x1="9" y1="22" x2="9" y2="16"></line><line x1="15" y1="22" x2="15" y2="16"></line><line x1="14" y1="16" x2="10" y2="16"></line><path d="M8 6h.01M16 6h.01M9 10h.01M15 10h.01M8 14h.01M16 14h.01"></path></svg>
            </span>
            <div class="meta-content">
              <span class="meta-label">Office / Bureau</span>
              <span class="meta-val">${job.office}</span>
            </div>
          </div>
          <div class="meta-row">
            <span class="meta-icon">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: var(--royal);"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
            </span>
            <div class="meta-content">
              <span class="meta-label">Location</span>
              <span class="meta-val">${job.location}</span>
            </div>
          </div>
          <div class="meta-row">
            <span class="meta-icon">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: var(--royal);"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
            </span>
            <div class="meta-content">
              <span class="meta-label">Salary Grade</span>
              <span class="meta-val"><span class="sg-badge">SG ${job.sg}</span></span>
            </div>
          </div>
          <div class="meta-row">
            <span class="meta-icon">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: var(--royal);"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
            </span>
            <div class="meta-content">
              <span class="meta-label">Application Deadline</span>
              <span class="meta-val">
                <span class="deadline-badge ${dl.cls}">${dl.dot} ${dl.label}</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      <button class="req-toggle" onclick="toggleReq(this)" aria-expanded="false">
         Qualification Requirements
        <svg class="req-arrow" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" style="transition: transform 0.2s;"><polyline points="6 9 12 15 18 9"></polyline></svg>
      </button>
      <div class="req-body">
        <div class="req-list">
          <div class="req-item">
            <span class="req-item-icon">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: var(--royal);"><path d="M22 10v6M2 10l10-5 10 5-10 5z"></path><path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5"></path></svg>
            </span>
            <div class="req-item-body">
              <span class="req-item-label">Education</span>
              ${r.edu}
            </div>
          </div>
          <div class="req-item">
            <span class="req-item-icon">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: var(--royal);"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>
            </span>
            <div class="req-item-body">
              <span class="req-item-label">Experience</span>
              ${r.exp}
            </div>
          </div>
          <div class="req-item">
            <span class="req-item-icon">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: var(--royal);"><circle cx="12" cy="8" r="7"></circle><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline></svg>
            </span>
            <div class="req-item-body">
              <span class="req-item-label">Training</span>
              ${r.trng}
            </div>
          </div>
          <div class="req-item">
            <span class="req-item-icon">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: var(--royal);"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
            </span>
            <div class="req-item-body">
              <span class="req-item-label">Eligibility</span>
              ${r.elig}
            </div>
          </div>
        </div>
      </div>

      <div class="card-footer">
        <button class="btn-apply" onclick="showPage('careers'); switchTab('how-to-apply')">
           Apply Now
        </button>
        <button class="btn-details"
          onclick="alert('Full details for ${job.itemNo} will open here.')">
          Details
        </button>
      </div>
    </article>`;
  }).join("");

  updatePagination(list.length);
}

/*  TOGGLE REQUIREMENTS  */
function toggleReq(btn) {
  const body  = btn.nextElementSibling;
  const arrow = btn.querySelector(".req-arrow");
  const open  = body.classList.toggle("open");
  arrow.classList.toggle("open", open);
  btn.setAttribute("aria-expanded", open);
}

/*  TOGGLE SAVE  */
function toggleSave(btn) {
  btn.classList.toggle("saved");
  btn.title = btn.classList.contains("saved") ? "Saved!" : "Save this position";
}

/*  FILTER & SORT  */
function applyFilters() {
  const q        = document.getElementById("searchInput").value.toLowerCase();
  const region   = document.getElementById("filterRegion").value;
  const cat = activeChip || document.getElementById("filterCategory").value;
  const sg       = document.getElementById("filterSG").value;
  const dlFilter = document.getElementById("filterDeadline").value;
  const sort     = document.getElementById("sortSelect").value;
  const today    = new Date("2026-05-03");

  filtered = jobs.filter(j => {
    if (q && !`${j.title} ${j.office} ${j.itemNo} ${j.category} ${j.location}`.toLowerCase().includes(q)) return false;
    if (region && !j.region.includes(region)) return false;
    if (cat && j.category !== cat) return false;
    if (sg && j.sg !== parseInt(sg)) return false;
    if (dlFilter === "urgent") { const d = Math.ceil((new Date(j.deadline) - today) / 86400000); if (d > 7) return false; }
    if (dlFilter === "soon")   { const d = Math.ceil((new Date(j.deadline) - today) / 86400000); if (d > 14) return false; }
    return true;
  });

  filtered.sort((a, b) => {
    if (sort === "deadline") return new Date(a.deadline) - new Date(b.deadline);
    if (sort === "sg-asc")   return a.sg - b.sg;
    if (sort === "sg-desc")  return b.sg - a.sg;
    return new Date(b.posted) - new Date(a.posted);
  });

  currentPage = 1;
  renderCards(filtered);
}

/*  CHIP FILTER  */
function chipFilter(el, cat) {
  document.querySelectorAll(".chip").forEach(c => c.classList.remove("active"));
  el.classList.add("active");
  activeChip = cat;
  document.getElementById("filterCategory").value = cat;
  applyFilters();
}

/*  RESET  */
function resetFilters() {
  document.getElementById("searchInput").value = "";
  document.getElementById("filterRegion").value = "";
  document.getElementById("filterCategory").value = "";
  document.getElementById("filterSG").value = "";
  document.getElementById("filterDeadline").value = "";
  document.getElementById("sortSelect").value = "latest";
  activeChip = "";
  document.querySelectorAll(".chip").forEach(c => c.classList.remove("active"));
  document.querySelector(".chip[data-cat='']").classList.add("active");
  applyFilters();
}

/*  PAGINATION  */
function updatePagination(total) {
  const pages = Math.max(1, Math.ceil(total / perPage));
  for (let i = 1; i <= 3; i++) {
    const btn = document.getElementById("pg" + i);
    if (btn) { btn.style.display = i <= pages ? "" : "none"; btn.classList.toggle("active", i === currentPage); }
  }
  document.getElementById("prevBtn").disabled = currentPage <= 1;
  document.getElementById("nextBtn").disabled = currentPage >= pages;
}
function goPage(n) {
  currentPage = n;
  renderCards(filtered);
  document.getElementById("section-vacancies").scrollIntoView({ behavior:"smooth" });
}
function changePage(dir) {
  const pages = Math.ceil(filtered.length / perPage);
  const next  = currentPage + dir;
  if (next >= 1 && next <= pages) goPage(next);
}

/*  TAB SWITCH (careers page)  */
function switchTab(tab) {
  document.querySelectorAll("#page-careers .subpage-tab").forEach(t => t.classList.remove("active"));
  document.querySelectorAll("#page-careers .r-section").forEach(s => s.classList.remove("active"));
  document.getElementById("tab-" + tab).classList.add("active");
  document.getElementById("section-" + tab).classList.add("active");
  window.scrollTo({ top: 0, behavior:"smooth" });
}

/*  SYNC HEADER SEARCH  */
function syncSearch() {
  const topSearch = document.getElementById("topSearch");
  if (topSearch) {
    document.getElementById("searchInput").value = topSearch.value;
    applyFilters();
  }
}

/*  INIT  */
applyFilters();

/* Contact form */
document.getElementById('contactForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const btn = this.querySelector('.btn-send');
  btn.textContent = 'Sending\u2026';
  btn.disabled = true;
  setTimeout(() => {
    document.getElementById('formSuccess').classList.add('show');
    btn.innerHTML = '&#10003; Sent';
    btn.style.background = '#166534';
  }, 1200);
});



/* ??? MAP ZOOM & PAN STATE ??? */
var _mapScale = 1;
var _mapTX    = 0;
var _mapTY    = 0;
var _mapMinScale = 0.5;
var _mapMaxScale = 4;

/* drag state */
var _drag = false;
var _dragStartX = 0, _dragStartY = 0;
var _dragOriginTX = 0, _dragOriginTY = 0;

/* pinch state */
var _lastPinchDist = null;

function _applyMapTransform(animate) {
  var svg = document.getElementById('ph-map');
  if (!svg) return;
  svg.style.transition = animate ? 'transform .2s ease' : 'none';
  svg.style.transform  = 'scale(' + _mapScale + ') translate(' + _mapTX + 'px,' + _mapTY + 'px)';
  svg.style.transformOrigin = '0 0';
  /* clamp pan so map never wanders too far */
  var vp = document.getElementById('map-viewport');
  if (vp) {
    var vw = vp.offsetWidth;
    var vh = vp.offsetHeight;
    var sw = vw * _mapScale;
    var sh = vh * _mapScale;
    var maxTX =  vw  * 0.4 / _mapScale;
    var minTX = (vw - sw) / _mapScale - vw * 0.4 / _mapScale;
    var maxTY =  vh  * 0.4 / _mapScale;
    var minTY = (vh - sh) / _mapScale - vh * 0.4 / _mapScale;
    _mapTX = Math.min(maxTX, Math.max(minTX, _mapTX));
    _mapTY = Math.min(maxTY, Math.max(minTY, _mapTY));
    svg.style.transform = 'scale(' + _mapScale + ') translate(' + _mapTX + 'px,' + _mapTY + 'px)';
  }
  /* update badge */
  var badge = document.getElementById('map-zoom-badge');
  if (badge) badge.textContent = Math.round(_mapScale * 100) + '%';
}

/* Button zoom (zooms toward center of viewport) */
function mapZoom(factor) {
  var vp = document.getElementById('map-viewport');
  if (!vp) return;
  var cx = vp.offsetWidth  / 2;
  var cy = vp.offsetHeight / 2;
  _zoomAround(cx, cy, factor);
  _applyMapTransform(true);
}

/* Reset */
function mapReset() {
  _mapScale = 1; _mapTX = 0; _mapTY = 0;
  _applyMapTransform(true);
}

/* Zoom around a point in viewport coords */
function _zoomAround(px, py, factor) {
  var newScale = Math.min(_mapMaxScale, Math.max(_mapMinScale, _mapScale * factor));
  var ratio    = newScale / _mapScale;
  /* adjust translation so the point under cursor stays fixed */
  _mapTX = px / newScale - (px / _mapScale - _mapTX) / ratio * ratio;
  /* simpler exact formula: */
  _mapTX = (_mapTX - px / _mapScale) * ratio + px / newScale;
  _mapTY = (_mapTY - py / _mapScale) * ratio + py / newScale;
  _mapScale = newScale;
}

/* Mouse wheel zoom */
function mapHandleWheel(e) {
  e.preventDefault();
  var vp    = document.getElementById('map-viewport');
  var rect  = vp.getBoundingClientRect();
  var px    = e.clientX - rect.left;
  var py    = e.clientY - rect.top;
  var delta = e.deltaY > 0 ? 0.85 : 1.18;
  _zoomAround(px, py, delta);
  _applyMapTransform(false);
}

/* Mouse drag */
function mapStartDrag(e) {
  if (e.button !== 0) return;
  _drag = true;
  _dragStartX   = e.clientX;
  _dragStartY   = e.clientY;
  _dragOriginTX = _mapTX;
  _dragOriginTY = _mapTY;
  document.getElementById('map-viewport').style.cursor = 'grabbing';
}
function mapDoDrag(e) {
  if (!_drag) return;
  var dx = (e.clientX - _dragStartX) / _mapScale;
  var dy = (e.clientY - _dragStartY) / _mapScale;
  _mapTX = _dragOriginTX + dx;
  _mapTY = _dragOriginTY + dy;
  _applyMapTransform(false);
}
function mapEndDrag() {
  _drag = false;
  var vp = document.getElementById('map-viewport');
  if (vp) vp.style.cursor = 'grab';
}

/* Touch pinch-to-zoom */
function mapTouchStart(e) {
  if (e.touches.length === 2) {
    _lastPinchDist = _pinchDist(e.touches);
  } else if (e.touches.length === 1) {
    _drag = true;
    _dragStartX   = e.touches[0].clientX;
    _dragStartY   = e.touches[0].clientY;
    _dragOriginTX = _mapTX;
    _dragOriginTY = _mapTY;
  }
}
function mapTouchMove(e) {
  e.preventDefault();
  if (e.touches.length === 2 && _lastPinchDist !== null) {
    var dist   = _pinchDist(e.touches);
    var factor = dist / _lastPinchDist;
    var midX   = (e.touches[0].clientX + e.touches[1].clientX) / 2;
    var midY   = (e.touches[0].clientY + e.touches[1].clientY) / 2;
    var vp     = document.getElementById('map-viewport');
    var rect   = vp.getBoundingClientRect();
    _zoomAround(midX - rect.left, midY - rect.top, factor);
    _applyMapTransform(false);
    _lastPinchDist = dist;
  } else if (e.touches.length === 1 && _drag) {
    var dx = (e.touches[0].clientX - _dragStartX) / _mapScale;
    var dy = (e.touches[0].clientY - _dragStartY) / _mapScale;
    _mapTX = _dragOriginTX + dx;
    _mapTY = _dragOriginTY + dy;
    _applyMapTransform(false);
  }
}
function _pinchDist(touches) {
  var dx = touches[0].clientX - touches[1].clientX;
  var dy = touches[0].clientY - touches[1].clientY;
  return Math.sqrt(dx*dx + dy*dy);
}

function toggleMobileNav() {
  document.getElementById('nav-inner').classList.toggle('active');
}

document.querySelectorAll('.nav-item').forEach(item => {
  item.addEventListener('click', (e) => {
    if (window.innerWidth <= 900) {
      if (item.querySelector('.dropdown')) {
        item.classList.toggle('open');
      }
    }
  });
});


