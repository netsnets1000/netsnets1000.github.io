/* Tellera — Our Data page: source catalog (filterable by group) + brand wall. */
(function () {
  'use strict';
  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]; }); };
  var GLOBE = '<svg viewBox="0 0 24 24" fill="none" stroke="#2E6BFF" stroke-width="1.6"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 2.5 3.8 5.7 3.8 9S14.5 18.5 12 21c-2.5-2.5-3.8-5.7-3.8-9S9.5 5.5 12 3z" stroke-linecap="round"/></svg>';
  var MAP = '<svg viewBox="0 0 24 24" fill="none" stroke="#2B8A88" stroke-width="1.6" stroke-linejoin="round"><path d="M9 4L3 6v14l6-2 6 2 6-2V4l-6 2-6-2z"/><path d="M9 4v14M15 6v14"/></svg>';

  /* tier: official | partner | vendor | live */
  var CATS = [
    { t: 'People & identity', group: 'People & identity', agent: 'Tellera People', icon: '/assets/agents/people.svg', src: [
      ['BeenVerified · PeopleLooker · Intelius', 'partner', 'Consumer people-search indexes — names, aliases, address history, relatives, and contact info.'],
      ['USPS National Change of Address (NCOA)', 'official', 'Licensed change-of-address data that keeps current addresses current.'],
      ['Professional & occupational license boards', 'official', 'State boards for nurses, contractors, realtors, attorneys, and 100+ other professions.'],
      ['Voter registration files', 'official', 'Name, address, and registration status — only in states that permit this use.'],
      ['County marriage & divorce indexes', 'official', 'Vital-record indexes from county clerks where they are public.'],
      ['Obituary archives', 'vendor', 'Published obituaries linking people to relatives and places.']
    ] },
    { t: 'Phone', group: 'People & identity', agent: 'Tellera Phone', page: '/agents/phone', icon: '/assets/pills/phone.png', src: [
      ['ReversePhone.com', 'partner', 'Reverse-lookup index linking numbers to names, addresses, and history.'],
      ['Number portability & carrier routing (NPAC / LERG)', 'vendor', 'Current carrier, line type, rate center, and porting events.'],
      ['CNAM caller-name databases', 'vendor', 'The caller-ID name that carriers display on inbound calls.'],
      ['FCC consumer complaint data', 'official', 'Unwanted-call and robocall complaints filed with the FCC.'],
      ['Community spam reports', 'partner', 'User-submitted reports, categorized by call type (scam, telemarketer, collector).']
    ] },
    { t: 'Family & genealogy', group: 'People & identity', agent: 'Tellera Family', icon: '/assets/agents/family.svg', src: [
      ['FamFinder', 'partner', 'Family trees, relative graphs, and household connections.'],
      ['U.S. Census records (1790–1950)', 'official', 'Historic census schedules, released after the 72-year privacy period.'],
      ['State vital-record indexes', 'official', 'Birth, marriage, and death indexes from state archives.'],
      ['Historic Social Security death index', 'official', 'Historic death records used for genealogical research.']
    ] },
    { t: 'Property', group: 'Property & assets', agent: 'Tellera Property', icon: '/assets/pills/property.png', src: [
      ['County recorders & registers of deeds', 'official', 'Deeds, mortgages, releases, and every transfer of ownership.'],
      ['County assessors & tax rolls', 'official', 'Assessed value, tax bills, parcel details, and exemptions.'],
      ['Ownerly · NeighborWho', 'partner', 'Home valuations, equity estimates, and neighborhood context.'],
      ['Municipal building permits', 'official', 'Renovations, additions, and new construction.'],
      ['FEMA National Flood Hazard Layer', 'official', 'Flood-zone designation for any parcel.'],
      ['Listing & sale history', 'vendor', 'Historic listings and closed sales from licensed data providers.']
    ] },
    { t: 'Vehicles', group: 'Property & assets', agent: 'Tellera Vehicle', icon: '/assets/pills/vehicle.png', src: [
      ['NMVTIS — National Motor Vehicle Title Information System', 'official', 'Federal title, brand (salvage, flood, junk), and odometer history reported by state DMVs, insurers, and salvage yards.'],
      ['NHTSA recalls & complaints', 'official', 'Open safety recalls, investigations, and owner complaints by VIN.'],
      ['State DMV title & registration events', 'official', 'Used only for purposes permitted under the Driver\'s Privacy Protection Act (DPPA).'],
      ['Bumper', 'partner', 'Vehicle history, specs, and market value at consumer scale.'],
      ['Insurance total-loss & auction records', 'vendor', 'Theft, total-loss, and auction sales — with photos where available.']
    ] },
    { t: 'Money & assets', group: 'Property & assets', agent: 'Tellera Assets', icon: '/assets/agents/assets.svg', src: [
      ['State unclaimed-property offices', 'official', 'Dormant accounts, uncashed checks, and deposits held by all 50 states + DC (NAUPA / MissingMoney).'],
      ['Liens & civil judgments', 'official', 'Tax liens, judgments, and mechanic\'s liens from county records.'],
      ['Federal bankruptcy courts', 'official', 'Chapter 7, 11, and 13 filings and discharges.'],
      ['FAA Aircraft Registry', 'official', 'Registered owners of U.S. aircraft.'],
      ['U.S. Coast Guard vessel documentation', 'official', 'Documented vessels and their owners.']
    ] },
    { t: 'Neighborhoods & demographics', group: 'Property & assets', agent: 'Tellera Property', iconSvg: MAP, src: [
      ['U.S. Census Bureau — ACS & decennial', 'official', 'Demographics, income, housing, and commute data down to the census tract.'],
      ['FBI Crime Data Explorer (UCR / NIBRS)', 'official', 'Reported crime by agency and offense type.'],
      ['NCES school data', 'official', 'Public school locations, enrollment, and district boundaries.'],
      ['EPA environmental data', 'official', 'Superfund sites, air quality, and toxic-release facilities nearby.']
    ] },
    { t: 'Courts & legal', group: 'Business & legal', agent: 'Tellera Court', icon: '/assets/agents/legal.svg', src: [
      ['PACER — federal courts', 'official', 'Federal civil, criminal, appellate, and bankruptcy dockets.'],
      ['State & county court systems', 'official', 'Civil, small-claims, traffic, family, and criminal cases from court portals.'],
      ['Sheriff arrest & booking logs', 'official', 'Booking records published by county sheriffs\' offices.'],
      ['State departments of corrections', 'official', 'Inmate and custody records.'],
      ['National Sex Offender Public Website (NSOPW)', 'official', 'Registry data from state, tribal, and territorial registries.']
    ] },
    { t: 'Business & entities', group: 'Business & legal', agent: 'Tellera Business', icon: '/assets/agents/business.svg', src: [
      ['Secretaries of State (all 50)', 'official', 'Entity formations, officers, registered agents, and good-standing status.'],
      ['SEC EDGAR', 'official', 'Public-company filings, insiders, and beneficial owners.'],
      ['IRS tax-exempt organization data (Form 990)', 'official', 'Nonprofit status, financials, and key officers.'],
      ['UCC financing statements', 'official', 'Secured-lender filings against business and personal assets.'],
      ['OSHA & federal enforcement actions', 'official', 'Inspections, violations, and penalties.']
    ] },
    { t: 'Trust & safety', group: 'Business & legal', agent: 'Tellera Safety', icon: '/assets/agents/safety.svg', src: [
      ['OFAC Specially Designated Nationals (SDN)', 'official', 'U.S. Treasury sanctions and consolidated non-SDN lists.'],
      ['UN, EU & UK sanctions lists', 'official', 'International sanctions and asset-freeze lists.'],
      ['FINRA BrokerCheck', 'official', 'Registered broker and adviser history, including disclosures.'],
      ['State licensing discipline', 'official', 'Revocations, suspensions, and disciplinary actions.'],
      ['PEP & adverse-media screening', 'vendor', 'Politically exposed persons and negative news coverage.']
    ] },
    { t: 'Web & real-time', group: 'Web & real-time', agent: 'Tellera Web Search', iconSvg: GLOBE, src: [
      ['Live web index', 'live', 'Real-time search across the open web — not frozen at a training cutoff.'],
      ['News & press releases', 'live', 'Current coverage from news outlets and wire services.'],
      ['Company websites & public profiles', 'live', 'Publicly available pages, cited with the date retrieved.']
    ] }
  ];
  var TIER_LABEL = { official: 'Official', partner: 'Partner', vendor: 'Vendor', live: 'Live web' };

  var GROUPS = ['All', 'People & identity', 'Property & assets', 'Business & legal', 'Web & real-time'];
  var active = 'All';
  var filterEl = document.getElementById('dataFilter'), gridEl = document.getElementById('dataSources');

  function render() {
    if (filterEl) filterEl.innerHTML = GROUPS.map(function (g) {
      return '<button class="' + (g === active ? 'active' : '') + '" data-g="' + esc(g) + '">' + esc(g) + '</button>';
    }).join('');
    if (!gridEl) return;
    gridEl.innerHTML = CATS.filter(function (c) { return active === 'All' || c.group === active; }).map(function (c) {
      var ic = c.iconSvg ? c.iconSvg : '<img src="' + c.icon + '" alt="">';
      var agent = c.page ? '<a class="st-src__agent" href="' + c.page + '">' + esc(c.agent) + ' →</a>' : '<span class="st-src__agent" style="color:var(--muted)">Powers ' + esc(c.agent) + '</span>';
      return '<div class="st-src"><div class="st-src__head"><span class="st-src__ic">' + ic + '</span><div><div class="st-src__t">' + esc(c.t) + '</div>' + agent + '</div></div>' +
        '<div class="st-src__list">' + c.src.map(function (s) {
          return '<div class="st-src__item"><div><div class="st-src__n">' + esc(s[0]) + '</div><div class="st-src__d">' + esc(s[2]) + '</div></div><span class="st-tier st-tier--' + s[1] + '">' + TIER_LABEL[s[1]] + '</span></div>';
        }).join('') + '</div></div>';
    }).join('');
  }
  render();
  if (filterEl) filterEl.addEventListener('click', function (e) { var b = e.target.closest('button'); if (b) { active = b.getAttribute('data-g'); render(); } });

  /* LTV brand network */
  var BRANDS = [
    { n: 'BeenVerified', logo: '/assets/logo-bv.svg', cat: 'People & background', d: 'People search, contact data, and background reports.' },
    { n: 'PeopleLooker', cat: 'People search', d: 'Identity, address history, and relatives.' },
    { n: 'Intelius', cat: 'People search', d: 'Public-record profiles and contact info.' },
    { n: 'PeopleSmart', cat: 'Email & contact', d: 'Email, phone, and identity lookups.' },
    { n: 'ReversePhone.com', cat: 'Phone', d: 'Reverse phone lookup and caller ID.' },
    { n: 'Ownerly', logo: '/assets/logo-ownerly.svg', cat: 'Property & value', d: 'Ownership, valuations, taxes, and liens.' },
    { n: 'NeighborWho', cat: 'Neighborhoods', d: 'Who lives nearby and neighborhood context.' },
    { n: 'Bumper', logo: '/assets/logo-bumper.svg', cat: 'Vehicle history', d: 'VIN history, title brands, and market value.' },
    { n: 'FamFinder', logo: '/assets/logo-famfinder.svg', cat: 'Family & genealogy', d: 'Family trees and relative graphs.' }
  ];
  var brandEl = document.getElementById('dataBrands');
  if (brandEl) brandEl.innerHTML = BRANDS.map(function (b) {
    var logo = b.logo ? '<img src="' + b.logo + '" alt="' + esc(b.n) + '">' : '<span class="st-brand__word">' + esc(b.n) + '</span>';
    return '<div class="st-brand"><div class="st-brand__logo">' + logo + '</div><div class="st-brand__cat">' + esc(b.cat) + '</div><div class="st-brand__d">' + esc(b.d) + '</div></div>';
  }).join('') + '<div class="st-brand st-brand--more"><div class="st-brand__cat">+ more</div><div class="st-brand__d">B2B and API data brands across the LTV network.</div></div>';
})();
