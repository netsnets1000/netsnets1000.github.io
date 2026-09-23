/* Tellera Agent Portal — shared data (connectors/agents, endpoints, plans, mock usage). */
window.TELLERA_API = (function () {
  var BUCKETS = [
    { key: 'people', label: 'People & identity', color: '#565C99' },
    { key: 'property', label: 'Property & assets', color: '#2B8A88' },
    { key: 'business', label: 'Business & legal', color: '#8B5E3C' },
    { key: 'web', label: 'Web & real-time', color: '#2E6BFF' }
  ];

  var GLOBE = '<svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="#2E6BFF" stroke-width="1.7"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 2.5 3.8 5.7 3.8 9S14.5 18.5 12 21c-2.5-2.5-3.8-5.7-3.8-9S9.5 5.5 12 3z"/></svg>';
  var FILTER = '<svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="#565C99" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M4 6h16M7 12h10M10 18h4"/></svg>';

  var AGENTS = [
    { code: 'PE', slug: 'people', app: 'Tellera People', bucket: 'people', icon: '/assets/pills/people.png', price: 0.04, desc: 'Backgrounds, relatives, and associations for a person.',
      prompts: ["What's known about Martin R. Decker in Austin, TX?", 'Find relatives and associates of Jane Doe in Ohio'],
      endpoints: [
        { m: 'POST', path: '/v1/people/lookup', name: 'people.lookup', price: 0.04, desc: 'Resolve a person to identity, addresses, relatives, and associates.',
          params: [{ n: 'name', t: 'string', req: true, d: 'Full name to resolve.' }, { n: 'state', t: 'string', req: false, d: 'Two-letter state to narrow results.' }, { n: 'age', t: 'integer', req: false, d: 'Approximate age.' }] },
        { m: 'GET', path: '/v1/people/relatives', name: 'people.relatives', price: 0.03, desc: 'Known relatives and associates for a resolved person.',
          params: [{ n: 'person_id', t: 'string', req: true, d: 'ID from a people.lookup result.' }] }
      ] },
    { code: 'PF', slug: 'person-filter', app: 'Person Search Filter', bucket: 'people', iconSvg: FILTER, price: 0.01, badge: 'Teaser', desc: 'Search a name and get a ranked list of possible matching people — a cheap first step before a full People lookup.',
      prompts: ['List possible matches for "John A. Smith"', 'Who could "M. Decker in TX" be?'],
      endpoints: [
        { m: 'POST', path: '/v1/people/match', name: 'people.match', price: 0.01, desc: 'Return a ranked list of candidate people for a name — names, rough locations, and ages only.',
          params: [{ n: 'name', t: 'string', req: true, d: 'Name to search for candidates.' }, { n: 'state', t: 'string', req: false, d: 'Two-letter state to narrow candidates.' }, { n: 'limit', t: 'integer', req: false, d: 'Max candidates to return (default 10).' }] }
      ] },
    { code: 'PH', slug: 'phone', app: 'Tellera Phone', bucket: 'people', icon: '/assets/pills/phone.png', price: 0.03, desc: 'Identify callers, numbers, carrier, and spam signal.',
      prompts: ['Who owns (512) 555-0142?', 'Is (212) 555-0100 a spam number?'],
      endpoints: [
        { m: 'POST', path: '/v1/phone/lookup', name: 'phone.lookup', price: 0.03, desc: 'Owner, carrier, line type, and spam signal for a number.',
          params: [{ n: 'number', t: 'string', req: true, d: 'Phone number in E.164 or national format.' }] }
      ] },
    { code: 'FA', slug: 'family', app: 'Tellera Family', bucket: 'people', icon: '/assets/agents/family.svg', price: 0.04, desc: 'Relatives, ancestry, marriages, and lineage.',
      prompts: ['Map the household at 13 Roland Dr', "Who are Martin Decker's relatives?"],
      endpoints: [
        { m: 'GET', path: '/v1/family/tree', name: 'family.tree', price: 0.04, desc: 'Household and lineage graph for a person.',
          params: [{ n: 'person_id', t: 'string', req: true, d: 'ID from a people.lookup result.' }] }
      ] },
    { code: 'PR', slug: 'property', app: 'Tellera Property', bucket: 'property', icon: '/assets/pills/property.png', price: 0.05, desc: 'Ownership, value, liens, taxes, and history.',
      prompts: ['Who owns 1234 Oakridge Dr, Austin TX?', 'Estimated value and equity of 13 Roland Dr'],
      endpoints: [
        { m: 'POST', path: '/v1/property/lookup', name: 'property.lookup', price: 0.05, desc: 'Owner of record, value, liens, taxes, and sale history for an address.',
          params: [{ n: 'address', t: 'string', req: true, d: 'Full street address.' }] },
        { m: 'GET', path: '/v1/property/valuation', name: 'property.valuation', price: 0.03, desc: 'Estimated value and equity for a property.',
          params: [{ n: 'address', t: 'string', req: true, d: 'Full street address.' }] }
      ] },
    { code: 'VE', slug: 'vehicle', app: 'Tellera Vehicle', bucket: 'property', icon: '/assets/pills/vehicle.png', price: 0.04, desc: 'VIN checks, title history, recalls, and more.',
      prompts: ['Is VIN 1FTFW1E5… salvage or clean?', 'Recalls for VIN 1G1ZE5…'],
      endpoints: [
        { m: 'GET', path: '/v1/vehicle/vin', name: 'vehicle.vin', price: 0.04, desc: 'Title, salvage, lien, and recall history by VIN.',
          params: [{ n: 'vin', t: 'string', req: true, d: '17-character VIN.' }] }
      ] },
    { code: 'MO', slug: 'assets', app: 'Tellera Assets', bucket: 'property', icon: '/assets/agents/assets.svg', price: 0.05, desc: 'Bankruptcies, liens, judgments, and assets.',
      prompts: ['Any liens or judgments for Oakridge LLC?', 'Unclaimed money for Jane Doe in NY'],
      endpoints: [
        { m: 'GET', path: '/v1/assets/liens', name: 'assets.liens', price: 0.05, desc: 'Liens, judgments, and bankruptcies for a person or entity.',
          params: [{ n: 'name', t: 'string', req: true, d: 'Person or entity name.' }, { n: 'state', t: 'string', req: false, d: 'Two-letter state.' }] },
        { m: 'GET', path: '/v1/assets/unclaimed', name: 'assets.unclaimed', price: 0.02, desc: 'Unclaimed money and property by name and state.',
          params: [{ n: 'name', t: 'string', req: true, d: 'Person or entity name.' }, { n: 'state', t: 'string', req: true, d: 'Two-letter state.' }] }
      ] },
    { code: 'LE', slug: 'court', app: 'Tellera Court', bucket: 'business', icon: '/assets/agents/legal.svg', price: 0.06, desc: 'Court records, lawsuits, and filings.',
      prompts: ['Court filings for M. Decker in Travis County', 'Any civil cases for John Smith in NY'],
      endpoints: [
        { m: 'GET', path: '/v1/court/records', name: 'court.records', price: 0.06, desc: 'Civil, criminal, and traffic records for a person. Permissible-purpose gated.',
          params: [{ n: 'name', t: 'string', req: true, d: 'Full name.' }, { n: 'county', t: 'string', req: false, d: 'County to search.' }, { n: 'state', t: 'string', req: false, d: 'Two-letter state.' }] }
      ] },
    { code: 'BU', slug: 'business', app: 'Tellera Business', bucket: 'business', icon: '/assets/agents/business.svg', price: 0.04, desc: 'Companies, licenses, and financial information.',
      prompts: ['Who owns Oakridge LLC?', 'Officers of Acme Inc in Delaware'],
      endpoints: [
        { m: 'POST', path: '/v1/business/lookup', name: 'business.lookup', price: 0.04, desc: 'Entity, officers, filings, and licenses for a company.',
          params: [{ n: 'name', t: 'string', req: true, d: 'Company name.' }, { n: 'state', t: 'string', req: false, d: 'State of registration.' }] }
      ] },
    { code: 'TS', slug: 'safety', app: 'Tellera Safety', bucket: 'business', icon: '/assets/agents/safety.svg', price: 0.05, desc: 'Risk signals, watchlists, and verifications.',
      prompts: ['Screen "John A. Smith" against watchlists', 'Risk signals for acme@domain.com'],
      endpoints: [
        { m: 'POST', path: '/v1/safety/screen', name: 'safety.screen', price: 0.05, desc: 'Watchlist, sanctions, and risk-signal screen for a person or entity.',
          params: [{ n: 'name', t: 'string', req: true, d: 'Person or entity to screen.' }, { n: 'type', t: 'string', req: false, d: 'person | business | email.' }] }
      ] },
    { code: 'WB', slug: 'web-search', app: 'Tellera Web Search', bucket: 'web', iconSvg: GLOBE, price: 0.01, badge: 'New', desc: 'Live web search across the open internet.',
      prompts: ['Latest news on Ramp', 'Find the official website for Linear'],
      endpoints: [
        { m: 'POST', path: '/v1/web/search', name: 'web.search', price: 0.01, desc: 'Real-time web search with ranked results and snippets.',
          params: [{ n: 'query', t: 'string', req: true, d: 'Search query.' }, { n: 'recency', t: 'string', req: false, d: 'day | week | month | year.' }] }
      ] }
  ];

  // Featured LTV data brand behind each agent (logos where we have them, else a mock wordmark)
  var PROVIDERS = {
    bv: { name: 'BeenVerified', logo: '/assets/logo-bv.svg' },
    rp: { name: 'ReversePhone.com', logo: null },
    ff: { name: 'FamFinder', logo: '/assets/logo-famfinder.svg' },
    bumper: { name: 'Bumper', logo: '/assets/logo-bumper.svg' },
    ownerly: { name: 'Ownerly', logo: '/assets/logo-ownerly.svg' },
    ps: { name: 'PeopleSmart', logo: null }
  };
  var PROV_MAP = { people: 'bv', 'person-filter': 'bv', phone: 'rp', family: 'ff', property: 'ownerly', vehicle: 'bumper', assets: 'bv', court: 'bv', business: 'bv', safety: 'bv', 'web-search': null };
  AGENTS.forEach(function (a) { var k = PROV_MAP[a.slug]; a.provider = k ? PROVIDERS[k] : null; });

  var COMING = [
    { app: 'Tellera Short-Term Rental', bucket: 'property', desc: 'Airbnb / VRBO listing, host, and revenue signals.' },
    { app: 'Tellera Homes for Sale', bucket: 'property', desc: 'For-sale listings, price history, and market comps.' },
    { app: 'Tellera Weather', bucket: 'web', desc: 'Historical and forecast weather by location.' }
  ];

  var PLANS = [
    { name: 'Sandbox', price: '$0', cadence: 'free', calls: '100 test calls / mo', overage: 'Sandbox only', badge: 'Free', cta: 'Start free', current: false, mon: null,
      features: ['All endpoints in sandbox', 'Sandbox API keys', 'MCP · REST · SDK', 'Community support'] },
    { name: 'Starter', price: '$49', cadence: '/mo', calls: '2,500 calls / mo', overage: '$0.03 / call over', cta: 'Choose Starter', current: false,
      mon: { add: 20, count: '25 active monitors', cadence: 'Daily checks' },
      features: ['Live API keys', 'All agents', 'REST · GraphQL · MCP', 'Email support'] },
    { name: 'Pro', price: '$199', cadence: '/mo', calls: '15,000 calls / mo', overage: '$0.02 / call over', badge: 'Popular', cta: 'Current plan', current: true,
      mon: { add: 49, count: '250 active monitors', cadence: 'Hourly checks' },
      features: ['Everything in Starter', 'Higher rate limits', 'Webhooks + logs export', 'Priority support'] },
    { name: 'Scale', price: '$749', cadence: '/mo', calls: '75,000 calls / mo', overage: '$0.015 / call over', cta: 'Choose Scale', current: false,
      mon: { add: 149, count: '2,500 active monitors', cadence: 'Real-time checks' },
      features: ['Everything in Pro', 'Multi-seat + roles', 'SSO', 'SLA + dedicated support'] },
    { name: 'Enterprise', price: 'Custom', cadence: '', calls: 'Custom volume + terms', overage: 'Volume pricing', cta: 'Contact sales', current: false,
      mon: { add: 'custom', count: 'Portfolio monitoring', cadence: 'Real-time + SLA' },
      features: ['On-prem / BAA options', 'Custom SLAs', 'Permissible-purpose review', 'Solutions engineer'] }
  ];

  var SPARK = '<svg viewBox="0 0 24 24" width="26" height="26"><path d="M12 3l1.6 5.2L19 10l-5.4 1.8L12 17l-1.6-5.2L5 10l5.4-1.8z" fill="#7B5BFF"/><path d="M18.6 3.4l.6 1.9 1.9.6-1.9.6-.6 1.9-.6-1.9-1.9-.6 1.9-.6z" fill="#2E7BFF"/></svg>';

  // #1 — the orchestrator "ask" endpoint (Tellera-only: routes across agents, one cited answer)
  var ASK = {
    slug: 'ask', app: 'Tellera Ask', bucket: 'web', iconSvg: SPARK, price: 0.06, badge: 'Orchestrator',
    desc: 'One endpoint for any real-world question. Tellera routes it to the right specialists, cross-checks the record, and returns a single synthesized answer with confidence and sources.',
    prompts: ['Who owns the house behind me at 13 Roland Dr, White Plains NY?', 'Is the seller of VIN 1FTFW1E5… the real registered owner?', 'What can you tell me about Martin R. Decker in Austin, TX?'],
    endpoints: [
      { m: 'POST', path: '/v1/ask', name: 'ask', price: 0.06, desc: 'Ask a natural-language question. Tellera orchestrates the right agents and returns a synthesized, source-cited answer with a confidence score.',
        params: [
          { n: 'question', t: 'string', req: true, d: 'The natural-language question to answer.' },
          { n: 'min_confidence', t: 'string', req: false, d: 'low | medium | high — drop fields below this confidence.' },
          { n: 'sources', t: 'string', req: false, d: 'official | all — restrict to official records only.' }
        ] }
    ]
  };

  // #5 — monitors / webhooks (standing watches on records)
  var MONITORS = [
    { subject: '13 Roland Dr, White Plains NY', agent: 'Tellera Property', trigger: 'Ownership or sale changes', delivery: 'Webhook', dest: 'hooks.acme.com/tellera', status: 'Active', last: '2d ago' },
    { subject: 'VIN 1FTFW1E5XKFA00000', agent: 'Tellera Vehicle', trigger: 'Title or lien status changes', delivery: 'Email', dest: 'alerts@acme.com', status: 'Active', last: '—' },
    { subject: '(512) 555-0142', agent: 'Tellera Phone', trigger: 'Carrier or owner reassignment', delivery: 'Webhook', dest: 'hooks.acme.com/tellera', status: 'Paused', last: '6d ago' },
    { subject: 'Martin R. Decker · Travis County', agent: 'Tellera Court', trigger: 'A new filing appears', delivery: 'Webhook', dest: 'hooks.acme.com/tellera', status: 'Active', last: '11h ago' }
  ];
  var WEBHOOKS = { url: 'https://hooks.acme.com/tellera', secret: 'whsec_····································9f2', events: ['record.changed', 'monitor.fired', 'call.completed'] };

  // one-off credit top-ups (replaces pay-as-you-go)
  var CREDITS = { balance: 42.50, presets: [25, 50, 100, 250] };

  var OVERVIEW = { requests: 12480, agents: 8, endpoints: 14, planCalls: 15000, planUsed: 12480, plan: 'Pro', overage: '$0.00' };

  var RECENT = [
    { agent: 'Tellera Property', m: 'POST', path: '/v1/property/lookup', src: 'MCP', status: 200, price: 0.05, time: '2m ago' },
    { agent: 'Tellera Phone', m: 'POST', path: '/v1/phone/lookup', src: 'API', status: 200, price: 0.03, time: '18m ago' },
    { agent: 'Person Search Filter', m: 'POST', path: '/v1/people/match', src: 'MCP', status: 200, price: 0.01, time: '26m ago' },
    { agent: 'Tellera Web Search', m: 'POST', path: '/v1/web/search', src: 'MCP', status: 200, price: 0.01, time: '32m ago' },
    { agent: 'Tellera Court', m: 'GET', path: '/v1/court/records', src: 'API', status: 200, price: 0.06, time: '1h ago' }
  ];

  var TOP = [
    { app: 'Tellera Property', calls: 3820, color: '#2B8A88' },
    { app: 'Tellera Phone', calls: 2940, color: '#565C99' },
    { app: 'Tellera People', calls: 2110, color: '#565C99' },
    { app: 'Tellera Web Search', calls: 1680, color: '#2E6BFF' },
    { app: 'Person Search Filter', calls: 1240, color: '#565C99' }
  ];

  var USAGE_ROWS = [
    { app: 'Tellera Property', color: '#2B8A88', calls: 3820, spend: 191.00 },
    { app: 'Tellera Phone', color: '#565C99', calls: 2940, spend: 88.20 },
    { app: 'Tellera People', color: '#565C99', calls: 2110, spend: 84.40 },
    { app: 'Tellera Web Search', color: '#2E6BFF', calls: 1680, spend: 16.80 },
    { app: 'Person Search Filter', color: '#565C99', calls: 1240, spend: 12.40 },
    { app: 'Tellera Vehicle', color: '#2B8A88', calls: 990, spend: 39.60 },
    { app: 'Tellera Court', color: '#8B5E3C', calls: 540, spend: 32.40 },
    { app: 'Tellera Business', color: '#8B5E3C', calls: 250, spend: 10.00 }
  ];

  var LOGS = RECENT.concat([
    { agent: 'Tellera People', m: 'POST', path: '/v1/people/lookup', src: 'API', status: 200, price: 0.04, time: 'Today 10:42' },
    { agent: 'Tellera Property', m: 'GET', path: '/v1/property/valuation', src: 'MCP', status: 200, price: 0.03, time: 'Today 10:41' },
    { agent: 'Tellera Assets', m: 'GET', path: '/v1/assets/unclaimed', src: 'API', status: 200, price: 0.02, time: 'Today 10:38' },
    { agent: 'Tellera Safety', m: 'POST', path: '/v1/safety/screen', src: 'MCP', status: 429, price: 0.00, time: 'Today 10:31' },
    { agent: 'Person Search Filter', m: 'POST', path: '/v1/people/match', src: 'API', status: 200, price: 0.01, time: 'Today 10:22' },
    { agent: 'Tellera Business', m: 'POST', path: '/v1/business/lookup', src: 'API', status: 200, price: 0.04, time: 'Today 10:20' },
    { agent: 'Tellera Phone', m: 'POST', path: '/v1/phone/lookup', src: 'MCP', status: 200, price: 0.03, time: 'Today 09:58' }
  ]);

  var KEYS = [
    { name: 'Production', key: 'tlr_live_9f2c····································7Ae1', created: 'Sep 12, 2026', last: '2m ago', status: 'Active', scope: 'All agents' },
    { name: 'Sandbox', key: 'tlr_test_3b81····································0Qz9', created: 'Sep 12, 2026', last: '1d ago', status: 'Active', scope: 'Sandbox' }
  ];

  var INTEGRATIONS = [
    { name: 'Claude', cat: 'AI assistant', desc: 'Add Tellera as an MCP connector in Claude.' },
    { name: 'ChatGPT', cat: 'AI assistant', desc: 'Connect Tellera tools to ChatGPT.' },
    { name: 'Cursor', cat: 'IDE', desc: 'Use Tellera endpoints from Cursor.' },
    { name: 'Zapier', cat: 'Automation', desc: 'Trigger Tellera lookups from Zaps.' },
    { name: 'Make', cat: 'Automation', desc: 'Call Tellera in Make scenarios.' },
    { name: 'Slack', cat: 'Messaging', desc: 'Run lookups from Slack.' },
    { name: 'HubSpot', cat: 'CRM', desc: 'Enrich records in HubSpot.' },
    { name: 'Salesforce', cat: 'CRM', desc: 'Enrich accounts and leads.' }
  ];

  return { BUCKETS: BUCKETS, AGENTS: AGENTS, ASK: ASK, COMING: COMING, PLANS: PLANS, CREDITS: CREDITS, OVERVIEW: OVERVIEW,
    RECENT: RECENT, TOP: TOP, USAGE_ROWS: USAGE_ROWS, LOGS: LOGS, KEYS: KEYS, INTEGRATIONS: INTEGRATIONS,
    MONITORS: MONITORS, WEBHOOKS: WEBHOOKS };
})();
