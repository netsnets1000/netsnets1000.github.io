/* Tellera Agent Portal — shared data (connectors/agents, endpoints, plans, mock usage). */
window.TELLERA_API = (function () {
  var BUCKETS = [
    { key: 'people', label: 'People & identity', color: '#565C99' },
    { key: 'property', label: 'Property & assets', color: '#2B8A88' },
    { key: 'business', label: 'Business & legal', color: '#8B5E3C' },
    { key: 'web', label: 'Web & real-time', color: '#2E6BFF' }
  ];

  // globe icon markup for agents without a raster icon
  var GLOBE = '<svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="#2E6BFF" stroke-width="1.7"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 2.5 3.8 5.7 3.8 9S14.5 18.5 12 21c-2.5-2.5-3.8-5.7-3.8-9S9.5 5.5 12 3z"/></svg>';

  var AGENTS = [
    { code: 'PE', slug: 'people', app: 'Tellera People', bucket: 'people', icon: '/assets/pills/people.png', price: 0.04, desc: 'Backgrounds, relatives, and associations.',
      endpoints: [
        { m: 'POST', path: '/v1/people/lookup', name: 'people.lookup', price: 0.04, desc: 'Resolve a person to identity, addresses, relatives, and associates.' },
        { m: 'GET', path: '/v1/people/relatives', name: 'people.relatives', price: 0.03, desc: 'Known relatives and associates for a person.' }
      ] },
    { code: 'PH', slug: 'phone', app: 'Tellera Phone', bucket: 'people', icon: '/assets/pills/phone.png', price: 0.03, desc: 'Identify callers, numbers, and carrier details.',
      endpoints: [
        { m: 'POST', path: '/v1/phone/lookup', name: 'phone.lookup', price: 0.03, desc: 'Owner, carrier, line type, and spam signal for a number.' }
      ] },
    { code: 'FA', slug: 'family', app: 'Tellera Family', bucket: 'people', icon: '/assets/agents/family.svg', price: 0.04, desc: 'Relatives, ancestry, marriages, and lineage.',
      endpoints: [
        { m: 'GET', path: '/v1/family/tree', name: 'family.tree', price: 0.04, desc: 'Household and lineage graph for a person.' }
      ] },
    { code: 'PR', slug: 'property', app: 'Tellera Property', bucket: 'property', icon: '/assets/pills/property.png', price: 0.05, desc: 'Ownership, value, liens, taxes, and history.',
      endpoints: [
        { m: 'POST', path: '/v1/property/lookup', name: 'property.lookup', price: 0.05, desc: 'Owner of record, value, liens, taxes, and sale history for an address.' },
        { m: 'GET', path: '/v1/property/valuation', name: 'property.valuation', price: 0.03, desc: 'Estimated value and equity for a property.' }
      ] },
    { code: 'VE', slug: 'vehicle', app: 'Tellera Vehicle', bucket: 'property', icon: '/assets/pills/vehicle.png', price: 0.04, desc: 'VIN checks, title history, recalls, and more.',
      endpoints: [
        { m: 'GET', path: '/v1/vehicle/vin', name: 'vehicle.vin', price: 0.04, desc: 'Title, salvage, lien, and recall history by VIN.' }
      ] },
    { code: 'MO', slug: 'assets', app: 'Tellera Assets', bucket: 'property', icon: '/assets/agents/assets.svg', price: 0.05, desc: 'Bankruptcies, liens, judgments, and assets.',
      endpoints: [
        { m: 'GET', path: '/v1/assets/liens', name: 'assets.liens', price: 0.05, desc: 'Liens, judgments, and bankruptcies for a person or entity.' },
        { m: 'GET', path: '/v1/assets/unclaimed', name: 'assets.unclaimed', price: 0.02, desc: 'Unclaimed money and property by name and state.' }
      ] },
    { code: 'LE', slug: 'court', app: 'Tellera Court', bucket: 'business', icon: '/assets/agents/legal.svg', price: 0.06, desc: 'Court records, lawsuits, and filings.',
      endpoints: [
        { m: 'GET', path: '/v1/court/records', name: 'court.records', price: 0.06, desc: 'Civil, criminal, and traffic records for a person. Permissible-purpose gated.' }
      ] },
    { code: 'BU', slug: 'business', app: 'Tellera Business', bucket: 'business', icon: '/assets/agents/business.svg', price: 0.04, desc: 'Companies, licenses, and financial information.',
      endpoints: [
        { m: 'POST', path: '/v1/business/lookup', name: 'business.lookup', price: 0.04, desc: 'Entity, officers, filings, and licenses for a company.' }
      ] },
    { code: 'TS', slug: 'safety', app: 'Tellera Safety', bucket: 'business', icon: '/assets/agents/safety.svg', price: 0.05, desc: 'Risk signals, watchlists, and verifications.',
      endpoints: [
        { m: 'POST', path: '/v1/safety/screen', name: 'safety.screen', price: 0.05, desc: 'Watchlist, sanctions, and risk-signal screen for a person or entity.' }
      ] },
    { code: 'WB', slug: 'web-search', app: 'Tellera Web Search', bucket: 'web', iconSvg: GLOBE, price: 0.01, badge: 'New', desc: 'Live web search across the open internet.',
      endpoints: [
        { m: 'POST', path: '/v1/web/search', name: 'web.search', price: 0.01, desc: 'Real-time web search with ranked results and snippets.' }
      ] }
  ];

  var COMING = [
    { app: 'Tellera Short-Term Rental', bucket: 'property', desc: 'Airbnb / VRBO listing, host, and revenue signals.' },
    { app: 'Tellera Homes for Sale', bucket: 'property', desc: 'For-sale listings, price history, and market comps.' },
    { app: 'Tellera Weather', bucket: 'web', desc: 'Historical and forecast weather by location.' }
  ];

  var PLANS = [
    { name: 'Sandbox', price: '$0', cadence: 'free', calls: '100 test calls / mo', overage: 'Sandbox only', badge: 'Free', cta: 'Start free', current: false,
      features: ['All endpoints in sandbox', 'Sandbox API keys', 'MCP · REST · SDK', 'Community support'] },
    { name: 'Starter', price: '$49', cadence: '/mo', calls: '2,500 calls / mo', overage: '$0.03 / call over', cta: 'Choose Starter', current: false,
      features: ['Live API keys', 'All 10 agents', 'REST · GraphQL · MCP', 'Email support'] },
    { name: 'Pro', price: '$199', cadence: '/mo', calls: '15,000 calls / mo', overage: '$0.02 / call over', badge: 'Popular', cta: 'Current plan', current: true,
      features: ['Everything in Starter', 'Higher rate limits', 'Webhooks + logs export', 'Priority support'] },
    { name: 'Scale', price: '$749', cadence: '/mo', calls: '75,000 calls / mo', overage: '$0.015 / call over', cta: 'Choose Scale', current: false,
      features: ['Everything in Pro', 'Multi-seat + roles', 'SSO', 'SLA + dedicated support'] },
    { name: 'Pay-as-you-go', price: '$0.05', cadence: '/call', calls: 'No monthly commitment', overage: 'Top up credits anytime', cta: 'Switch to PAYG', current: false,
      features: ['No subscription', 'Prepaid credit balance', 'All 10 agents', 'Usage caps + alerts'] },
    { name: 'Enterprise', price: 'Custom', cadence: '', calls: 'Custom volume + terms', overage: 'Volume pricing', cta: 'Contact sales', current: false,
      features: ['On-prem / BAA options', 'Custom SLAs', 'Permissible-purpose review', 'Solutions engineer'] }
  ];

  var OVERVIEW = { requests: 12480, agents: 8, endpoints: 14, planCalls: 15000, planUsed: 12480, plan: 'Pro', overage: '$0.00' };

  var RECENT = [
    { agent: 'Tellera Property', m: 'POST', path: '/v1/property/lookup', src: 'MCP', status: 200, price: 0.05, time: '2m ago' },
    { agent: 'Tellera Phone', m: 'POST', path: '/v1/phone/lookup', src: 'API', status: 200, price: 0.03, time: '18m ago' },
    { agent: 'Tellera Web Search', m: 'POST', path: '/v1/web/search', src: 'MCP', status: 200, price: 0.01, time: '32m ago' },
    { agent: 'Tellera Court', m: 'GET', path: '/v1/court/records', src: 'API', status: 200, price: 0.06, time: '1h ago' },
    { agent: 'Tellera Vehicle', m: 'GET', path: '/v1/vehicle/vin', src: 'MCP', status: 200, price: 0.04, time: '2h ago' }
  ];

  var TOP = [
    { app: 'Tellera Property', calls: 3820, color: '#2B8A88' },
    { app: 'Tellera Phone', calls: 2940, color: '#565C99' },
    { app: 'Tellera People', calls: 2110, color: '#565C99' },
    { app: 'Tellera Web Search', calls: 1680, color: '#2E6BFF' },
    { app: 'Tellera Vehicle', calls: 990, color: '#2B8A88' }
  ];

  var USAGE_ROWS = [
    { app: 'Tellera Property', color: '#2B8A88', calls: 3820, spend: 191.00 },
    { app: 'Tellera Phone', color: '#565C99', calls: 2940, spend: 88.20 },
    { app: 'Tellera People', color: '#565C99', calls: 2110, spend: 84.40 },
    { app: 'Tellera Web Search', color: '#2E6BFF', calls: 1680, spend: 16.80 },
    { app: 'Tellera Vehicle', color: '#2B8A88', calls: 990, spend: 39.60 },
    { app: 'Tellera Court', color: '#8B5E3C', calls: 540, spend: 32.40 },
    { app: 'Tellera Business', color: '#8B5E3C', calls: 250, spend: 10.00 },
    { app: 'Tellera Assets', color: '#2B8A88', calls: 150, spend: 7.50 }
  ];

  var LOGS = RECENT.concat([
    { agent: 'Tellera People', m: 'POST', path: '/v1/people/lookup', src: 'API', status: 200, price: 0.04, time: 'Today 10:42' },
    { agent: 'Tellera Property', m: 'GET', path: '/v1/property/valuation', src: 'MCP', status: 200, price: 0.03, time: 'Today 10:41' },
    { agent: 'Tellera Assets', m: 'GET', path: '/v1/assets/unclaimed', src: 'API', status: 200, price: 0.02, time: 'Today 10:38' },
    { agent: 'Tellera Safety', m: 'POST', path: '/v1/safety/screen', src: 'MCP', status: 429, price: 0.00, time: 'Today 10:31' },
    { agent: 'Tellera Business', m: 'POST', path: '/v1/business/lookup', src: 'API', status: 200, price: 0.04, time: 'Today 10:20' },
    { agent: 'Tellera Phone', m: 'POST', path: '/v1/phone/lookup', src: 'MCP', status: 200, price: 0.03, time: 'Today 09:58' },
    { agent: 'Tellera Family', m: 'GET', path: '/v1/family/tree', src: 'API', status: 200, price: 0.04, time: 'Today 09:44' }
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

  return { BUCKETS: BUCKETS, AGENTS: AGENTS, COMING: COMING, PLANS: PLANS, OVERVIEW: OVERVIEW,
    RECENT: RECENT, TOP: TOP, USAGE_ROWS: USAGE_ROWS, LOGS: LOGS, KEYS: KEYS, INTEGRATIONS: INTEGRATIONS };
})();
