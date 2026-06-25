// Component Architecture Trainer data.
//
// Each mockup is a set of labelled rectangles (a wireframe drawn from plain
// numbers, so the page can render + make them clickable generically). The user
// decides how to split components and where state lives; `model` is the reveal.
//
// region.suggested = the component name a strong candidate would assign.
// dataItems + model.ownership drill the "lifting state up" instinct.

export const architectureMockups = [
  {
    id: 'todo-list',
    title: 'Todo List',
    difficulty: 'Simple',
    description: 'A text input to add todos and a list of items below it.',
    viewBox: '0 0 360 240',
    regions: [
      { id: 'form', x: 16, y: 16, w: 328, h: 40, label: 'add form (input + button)', suggested: 'TodoForm' },
      { id: 'list', x: 16, y: 70, w: 328, h: 154, label: 'list area', suggested: 'TodoList' },
      { id: 'item', x: 28, y: 84, w: 304, h: 30, label: 'one row (checkbox + text + ✕)', suggested: 'TodoItem' },
    ],
    dataItems: ['the array of todos', 'the text currently being typed'],
    model: {
      tree: 'App\n├─ TodoForm\n└─ TodoList\n   └─ TodoItem (×N)',
      ownership: [
        { data: 'the array of todos', owner: 'App', why: 'Both TodoForm (adds) and TodoList (renders) need it, so it lives in their closest common parent.' },
        { data: 'the text being typed', owner: 'TodoForm', why: 'Only the form cares about the in-progress input; keep it local to avoid re-rendering the list on every keystroke.' },
      ],
      pitfall: 'If TodoList owned the todos array, TodoForm would have no way to add to it — adding would require lifting that state up to App anyway.',
    },
  },
  {
    id: 'product-grid',
    title: 'Navbar + Product Grid',
    difficulty: 'Simple',
    description: 'A top navbar with a search box, and a grid of product cards that filters by the search.',
    viewBox: '0 0 400 260',
    regions: [
      { id: 'nav', x: 12, y: 12, w: 376, h: 40, label: 'top navbar', suggested: 'Navbar' },
      { id: 'search', x: 230, y: 20, w: 150, h: 24, label: 'search box', suggested: 'SearchBar' },
      { id: 'grid', x: 12, y: 64, w: 376, h: 184, label: 'product grid', suggested: 'ProductGrid' },
      { id: 'card', x: 24, y: 76, w: 110, h: 80, label: 'one product card', suggested: 'ProductCard' },
    ],
    dataItems: ['the search query', 'the list of products'],
    model: {
      tree: 'App\n├─ Navbar\n│  └─ SearchBar\n└─ ProductGrid\n   └─ ProductCard (×N)',
      ownership: [
        { data: 'the search query', owner: 'App', why: 'SearchBar updates it but ProductGrid filters by it — it must live in their common parent (App).' },
        { data: 'the list of products', owner: 'App', why: 'Owned by App (or fetched there); ProductGrid receives the filtered list as a prop.' },
      ],
      pitfall: 'If SearchBar owned the query locally, ProductGrid (a sibling) could never read it to filter. Classic “lift state up”.',
    },
  },
  {
    id: 'comment-thread',
    title: 'Comment Thread',
    difficulty: 'Moderate',
    description: 'A list of comments, each of which can have nested replies and its own reply box.',
    viewBox: '0 0 380 260',
    regions: [
      { id: 'thread', x: 12, y: 12, w: 356, h: 236, label: 'whole thread', suggested: 'CommentThread' },
      { id: 'comment', x: 24, y: 28, w: 332, h: 70, label: 'a single comment', suggested: 'Comment' },
      { id: 'replies', x: 48, y: 70, w: 300, h: 24, label: 'nested replies', suggested: 'Comment (recursive)' },
      { id: 'replybox', x: 24, y: 200, w: 332, h: 36, label: 'reply input', suggested: 'ReplyForm' },
    ],
    dataItems: ['the comments tree (data)', 'the draft text of a reply'],
    model: {
      tree: 'App\n└─ CommentThread\n   └─ Comment (renders ReplyForm + a nested\n      list of Comment — recursion)',
      ownership: [
        { data: 'the comments tree', owner: 'CommentThread (or App)', why: 'A single source of truth at the top so adding a reply anywhere updates the whole tree.' },
        { data: 'a reply draft', owner: 'each Comment / ReplyForm', why: 'Drafts are local and independent per comment — no reason to lift them up.' },
      ],
      pitfall: 'Comments render other Comments (recursion). Trying to flatten this into one giant component makes nesting and replies far harder.',
    },
  },
  {
    id: 'tabs',
    title: 'Tabs',
    difficulty: 'Simple',
    description: 'A row of tab buttons and a panel that shows the active tab’s content.',
    viewBox: '0 0 360 220',
    regions: [
      { id: 'tablist', x: 16, y: 16, w: 328, h: 36, label: 'row of tab buttons', suggested: 'TabList' },
      { id: 'tab', x: 24, y: 22, w: 80, h: 24, label: 'one tab button', suggested: 'Tab' },
      { id: 'panel', x: 16, y: 64, w: 328, h: 140, label: 'active content panel', suggested: 'TabPanel' },
    ],
    dataItems: ['which tab is active'],
    model: {
      tree: 'Tabs\n├─ TabList\n│  └─ Tab (×N)\n└─ TabPanel',
      ownership: [
        { data: 'which tab is active', owner: 'Tabs (the container)', why: 'Both TabList (highlight) and TabPanel (content) depend on it, so it lives in their parent.' },
      ],
      pitfall: 'If each Tab kept its own “isActive” boolean, two tabs could be active at once — there’s no single source of truth.',
    },
  },
  {
    id: 'dashboard',
    title: 'Dashboard with Filters',
    difficulty: 'Moderate',
    description: 'Summary cards, a filter toolbar, and a data table — the cards and table both react to the filters.',
    viewBox: '0 0 420 280',
    regions: [
      { id: 'summary', x: 12, y: 12, w: 396, h: 56, label: 'summary cards row', suggested: 'SummaryCards' },
      { id: 'toolbar', x: 12, y: 80, w: 396, h: 32, label: 'filter toolbar', suggested: 'FilterBar' },
      { id: 'table', x: 12, y: 124, w: 396, h: 144, label: 'data table', suggested: 'DataTable' },
      { id: 'row', x: 24, y: 156, w: 372, h: 24, label: 'a table row', suggested: 'TableRow' },
    ],
    dataItems: ['the active filters', 'the raw dataset'],
    model: {
      tree: 'Dashboard\n├─ SummaryCards\n├─ FilterBar\n└─ DataTable\n   └─ TableRow (×N)',
      ownership: [
        { data: 'the active filters', owner: 'Dashboard', why: 'SummaryCards, FilterBar and DataTable all depend on the filters, so they live in the common parent.' },
        { data: 'the raw dataset', owner: 'Dashboard', why: 'Held/fetched once at the top; the filtered view is derived and passed down.' },
      ],
      pitfall: 'If DataTable owned the filters, the SummaryCards couldn’t recompute totals for the same filtered set — they’d show stale numbers.',
    },
  },
  {
    id: 'shopping-cart',
    title: 'Shop with Cart',
    difficulty: 'Complex',
    description: 'A navbar showing a cart count, a product grid with “add” buttons, and a cart sidebar with a running total.',
    viewBox: '0 0 440 280',
    regions: [
      { id: 'nav', x: 12, y: 12, w: 416, h: 36, label: 'navbar', suggested: 'Navbar' },
      { id: 'badge', x: 388, y: 18, w: 32, h: 24, label: 'cart count badge', suggested: 'CartBadge' },
      { id: 'grid', x: 12, y: 60, w: 280, h: 208, label: 'product grid', suggested: 'ProductGrid' },
      { id: 'card', x: 24, y: 72, w: 120, h: 90, label: 'product card + Add button', suggested: 'ProductCard' },
      { id: 'cart', x: 304, y: 60, w: 124, h: 208, label: 'cart sidebar + total', suggested: 'CartSidebar' },
    ],
    dataItems: ['the cart items', 'the product catalog'],
    model: {
      tree: 'App\n├─ Navbar → CartBadge\n├─ ProductGrid → ProductCard (Add)\n└─ CartSidebar (items + total)',
      ownership: [
        { data: 'the cart items', owner: 'App', why: 'Three separate subtrees read/update it: CartBadge (count), ProductCard (add), CartSidebar (list + total). Only App is their common ancestor.' },
        { data: 'the product catalog', owner: 'App', why: 'Owned/fetched once at the top and passed to ProductGrid.' },
      ],
      pitfall: 'If ProductCard owned the cart count locally, the navbar’s CartBadge and the CartSidebar total could never update — the exact reason to lift cart state to App (or Context).',
    },
  },
]
