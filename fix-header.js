const fs = require('fs');

let html = fs.readFileSync('index4.html', 'utf8');

const targetStr = `      <p>The Department of Public Works and Highways is the primary government agency responsible for the planning, design, construction, and maintenance of public works infrastructure throughout the Philippines.</p>`;

const missingBlock = `  <div class="header-text">
    <div class="republic">Republic of the Philippines</div>
    <h1>Department of Public Works and Highways</h1>
    <div class="tagline">Tungo sa Makamasang Imprastraktura</div>
  </div>
  <div class="header-search">
    <svg width="14" height="14" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="9" cy="9" r="6" stroke="#C8D0E8" stroke-width="2"/><path d="M13.5 13.5L17 17" stroke="#C8D0E8" stroke-width="2" stroke-linecap="round"/></svg>
    <input type="text" placeholder="Search DPWH...">
    <button aria-label="Search">&#8594;</button>
  </div>
</header>

<!-- NAVBAR -->
<nav>
  <div class="nav-inner">
    <div class="nav-item">
      <div class="nav-link active" onclick="showPage('home')">Home</div>
    </div>
    <div class="nav-item">
      <div class="nav-link" onclick="showPage('transparency')">Transparency</div>
    </div>
    <div class="nav-item">
      <div class="nav-link" onclick="showPage('projects')">Projects <span class="caret">&#9662;</span></div>
      <div class="dropdown">
        <a onclick="showSubpage('projects','infrastructure')">Infrastructure</a>
        <a onclick="showSubpage('projects','infra-stats')">Infra Statistics</a>
        <a onclick="showSubpage('projects','gis')">GIS Web Application</a>
        <a onclick="showSubpage('projects','ppp')">Public-Private Partnership</a>
      </div>
    </div>
    <div class="nav-item">
      <div class="nav-link" onclick="showPage('announcements')">Announcements</div>
    </div>
    <div class="nav-item">
      <div class="nav-link" onclick="showPage('news')">News</div>
    </div>
    <div class="nav-item">
      <div class="nav-link" onclick="showPage('careers')">Careers <span class="caret">&#9662;</span></div>
      <div class="dropdown">
        <a onclick="showSubpage('careers','vacancies')">Vacancies</a>
        <a onclick="showSubpage('careers','how-to-apply')">How to Apply</a>
      </div>
    </div>
    <div class="nav-item">
      <div class="nav-link" onclick="showPage('references')">References <span class="caret">&#9662;</span></div>
      <div class="dropdown">
        <a onclick="showSubpage('references','atlas')">DPWH ATLAS</a>
        <a onclick="showSubpage('references','rbi')">Road and Bridge Inventory</a>
        <a onclick="showSubpage('references','streamms')">StreamMS</a>
        <a onclick="showSubpage('references','laws')">Laws, Codes, Orders</a>
        <a onclick="showSubpage('references','guidelines')">Guidelines and Manuals</a>
        <a onclick="showSubpage('references','standard-design')">Standard Design</a>
        <a onclick="showSubpage('references','reports')">Reports</a>
        <a onclick="showSubpage('references','issuances')">Issuances</a>
      </div>
    </div>
    <div class="nav-item" style="margin-left: auto;">
      <div class="nav-link" onclick="showPage('about')">About <span class="caret">&#9662;</span></div>
      <div class="dropdown">
        <a onclick="showSubpage('about','about-dpwh')">About DPWH</a>
        <a onclick="showSubpage('about','history')">History</a>
        <a onclick="showSubpage('about','former-secs')">Former Secretaries</a>
        <a onclick="showSubpage('about','logo')">About the Logo</a>
        <a onclick="showSubpage('about','budget')">Annual Budget</a>
        <a onclick="showSubpage('about','workforce')">Workforce Complement</a>
      </div>
    </div>
    <div class="nav-item">
      <div class="nav-link" onclick="showPage('contact')">Contact Us <span class="caret">&#9662;</span></div>
      <div class="dropdown">
        <a onclick="showSubpage('contact','feedback')">Feedback</a>
        <a onclick="showSubpage('contact','directory')">Directory</a>
      </div>
    </div>
  </div>
</nav>

<!-- MAIN -->
<main>

    <!-- HOME -->
  <div class="page active" id="page-home">
    <div class="hero" id="hero-carousel">
      <div class="hero-badge">Official Government Website</div>
      <h2>Building the Nation's <strong>Infrastructure</strong> for Every Filipino</h2>
`;

html = html.replace(targetStr, missingBlock + targetStr);
fs.writeFileSync('index4.html', html);
console.log('Restored header and nav!');
