/* Shared Tellera data — the nine agents, example records, comparisons, brands.
   Lifted from the Claude Design handoff data arrays. */
window.TELLERA = (function () {
  // [code, color, gradient, app, category, example, description]
  const AGENTS = [
    ['PR', '#7C6BFF', 'linear-gradient(140deg,#9A8CFF,#5B45E0)', 'Tellera Property', 'PROPERTY RECORDS',    'who owns 1234 Oakridge Dr?', 'Ownership, value, liens, taxes, and history.'],
    ['PH', '#4C8DFF', 'linear-gradient(140deg,#5AA0FF,#2E6BFF)', 'Tellera Phone',    'PHONE INTELLIGENCE',  'who owns (512) 555-0142?',   'Identify callers, numbers, and carrier details.'],
    ['VE', '#37B6A6', 'linear-gradient(140deg,#4FCBBB,#1E9488)', 'VIN Pro',          'VEHICLE HISTORY',     'is VIN 1FTFW1E5… clean?',    'VIN checks, title history, recalls, and more.'],
    ['PE', '#5A9CFF', 'linear-gradient(140deg,#74B0FF,#3A78E6)', 'People AI',        'PEOPLE SEARCH',       'what’s known about M. Decker?', 'Backgrounds, relatives, and associations.'],
    ['LE', '#E0A33E', 'linear-gradient(140deg,#F0B858,#C8862A)', 'Docket Pro',       'COURT & LEGAL',       'any filings in Travis County?', 'Court records, lawsuits, and filings.'],
    ['FA', '#E06B9C', 'linear-gradient(140deg,#F084AF,#C64E80)', 'Tellera Family',   'FAMILY & KIN',        'who are Decker’s relatives?', 'Relatives, marriages, and lineage.'],
    ['TS', '#4CC38A', 'linear-gradient(140deg,#63D69E,#2E9E6B)', 'Safety AI',        'TRUST & SAFETY',      'any watchlist hits?',        'Risk signals, watchlists, and verifications.'],
    ['BU', '#5FB0E6', 'linear-gradient(140deg,#7AC4F0,#3E92CC)', 'Tellera Business', 'BUSINESS & ENTITIES', 'who owns Oakridge LLC?',     'Companies, licenses, and financials.'],
    ['MO', '#E0B44C', 'linear-gradient(140deg,#F0C866,#C89A2E)', 'Assets AI',        'MONEY & ASSETS',      'any liens or judgments?',    'Bankruptcies, liens, judgments, and assets.']
  ].map((r, i) => ({ code: r[0], color: r[1], grad: r[2], app: r[3], cat: r[4], ex: r[5], desc: r[6], n: i + 1 }));

  // Deep Search seed strings, keyed by agent code
  const SEED = {
    PR: 'Who owns the property at ', PH: 'Who owns the number ', VE: 'Run a VIN check on ',
    PE: 'Tell me everything about ', LE: 'Find court filings for ', FA: 'Who are the relatives of ',
    TS: 'Run a safety check on ', BU: 'What’s known about the company ', MO: 'Any liens or judgments for '
  };
  const SEED_CAT = {
    PR: 'Property', PH: 'Phone', VE: 'Vehicle', PE: 'People', LE: 'Court & legal',
    FA: 'Family', TS: 'Trust & safety', BU: 'Business', MO: 'Money & assets'
  };

  const RECORDS = [
    { agent: 'Property findings', time: 'Answered in 12s', question: 'Who owns the house behind me?',
      label: 'Owner of record', value: 'Martin R. Decker', sub: '1234 Oakridge Dr, Austin, TX 78704', conf: 'HIGH',
      sources: [['Travis County Appraisal District', 1], ['Travis County Clerk — Warranty Deed', 1], ['USPS NCOA — Address History', 1], ['Google Street View — May 2023', 0]] },
    { agent: 'Vehicle findings', time: 'Answered in 9s', question: 'Is this used truck’s VIN clean?',
      label: 'Title status', value: 'Clean — no salvage', sub: '2019 Ford F-150 · VIN 1FTFW1E5…', conf: 'HIGH',
      sources: [['NMVTIS — National Title Registry', 1], ['TX DMV — Title & Lien', 1], ['NHTSA — Recall Database', 1]] },
    { agent: 'Phone findings', time: 'Answered in 7s', question: 'Who keeps calling from this number?',
      label: 'Listed to', value: 'J. Rivera Logistics LLC', sub: 'Dallas, TX · landline', conf: 'MEDIUM',
      sources: [['Carrier CNAM Registry', 1], ['TX Business Registry', 1], ['Spam-report aggregate', 0]] },
    { agent: 'Court record', time: 'Answered in 14s', question: 'What’s in this court file?',
      label: 'Case', value: 'Cause No. D-1-GN-24-00…', sub: 'Civil · Travis County · disposed', conf: 'HIGH',
      sources: [['Travis County District Clerk', 1], ['Public docket — re:SearchTX', 1]] }
  ];

  const COMPARE = [
    { q: 'Who owns the house behind me?',        generic: 'I can’t access property ownership records.', tellera: 'Martin R. Decker — Travis County warranty deed. Confidence: High.' },
    { q: 'Is this used truck’s VIN clean?',       generic: 'I don’t have vehicle history data.',         tellera: 'No salvage or lien on record — NMVTIS + 2 title sources.' },
    { q: 'Who keeps calling from this number?',   generic: 'I can’t look up phone subscribers.',          tellera: 'Listed to a Dallas, TX landline — carrier and CNAM verified.' }
  ];

  const BRANDS = [
    { name: 'BeenVerified', cat: 'People & background', desc: 'A decade-plus of people search, background reports, and contact data at consumer scale.', color: '#357A46' },
    { name: 'Bumper.com',   cat: 'Vehicle history',     desc: 'VIN checks, title and lien history, recalls, and market value on used vehicles.',        color: '#2E6BFF' },
    { name: 'Ownerly',      cat: 'Property & value',    desc: 'Home ownership, valuations, tax and lien records across residential property.',           color: '#7C6BFF' },
    { name: 'FamFinder',    cat: 'Family & kin',        desc: 'Relatives, lineage, and household connections mapped from public records.',               color: '#B0402F' }
  ];

  return { AGENTS, SEED, SEED_CAT, RECORDS, COMPARE, BRANDS };
})();
