// --- JSON Data: 12 sample tickets ---
const ticketsData = [
  {
    id: "TCKT-001",
    title: "Login failing for multiple users",
    description: "Users unable to login after recent deploy. Error 500 returned.",
    customer: "Acme Corp",
    priority: "high",
    status: "open",
    createdAt: "2025-09-30T09:21:00Z"
  },
  {
    id: "TCKT-002",
    title: "Payment gateway timeout",
    description: "Payment API times out intermittently causing failed payments.",
    customer: "BetaShop",
    priority: "high",
    status: "open",
    createdAt: "2025-09-28T11:10:00Z"
  },
  {
    id: "TCKT-003",
    title: "UI overlap on mobile",
    description: "Header overlaps content on small devices.",
    customer: "Gamma Media",
    priority: "low",
    status: "open",
    createdAt: "2025-09-25T07:45:00Z"
  },
  {
    id: "TCKT-004",
    title: "Email notifications not sent",
    description: "Transaction emails not being delivered to some users.",
    customer: "Delta Inc",
    priority: "medium",
    status: "open",
    createdAt: "2025-09-20T14:02:00Z"
  },
  {
    id: "TCKT-005",
    title: "Slow search results",
    description: "Search queries taking >5s for large result sets.",
    customer: "Epsilon",
    priority: "medium",
    status: "open",
    createdAt: "2025-09-18T10:15:00Z"
  },
  {
    id: "TCKT-006",
    title: "Broken profile image uploader",
    description: "File upload return 413 for images above 1MB.",
    customer: "Zeta Studio",
    priority: "high",
    status: "open",
    createdAt: "2025-09-16T18:50:00Z"
  },
  {
    id: "TCKT-007",
    title: "Data export format incorrect",
    description: "CSV header order mismatch with spec.",
    customer: "Eta Logistics",
    priority: "low",
    status: "open",
    createdAt: "2025-09-14T08:30:00Z"
  },
  {
    id: "TCKT-008",
    title: "2FA phone numbers not saved",
    description: "Phone numbers are not persisted on save.",
    customer: "Theta Services",
    priority: "high",
    status: "open",
    createdAt: "2025-09-13T20:12:00Z"
  },
  {
    id: "TCKT-009",
    title: "Broken link in footer",
    description: "Privacy policy link 404s.",
    customer: "Iota Labs",
    priority: "low",
    status: "open",
    createdAt: "2025-09-10T12:02:00Z"
  },
  {
    id: "TCKT-010",
    title: "Admin dashboard metrics wrong",
    description: "Counts for active users are off by ~10%.",
    customer: "Kappa Co",
    priority: "medium",
    status: "open",
    createdAt: "2025-09-09T09:59:00Z"
  },
  {
    id: "TCKT-011",
    title: "Session cookie expiring early",
    description: "User sessions are ending 2 hours earlier than expected.",
    customer: "Lambda LLC",
    priority: "medium",
    status: "open",
    createdAt: "2025-09-05T16:42:00Z"
  },
  {
    id: "TCKT-012",
    title: "CSV import fails on Windows",
    description: "Line endings cause parser error on Windows machines.",
    customer: "Mu Partners",
    priority: "low",
    status: "open",
    createdAt: "2025-09-01T07:22:00Z"
  }
];

// --- State ---
const state = {
  tickets: [...ticketsData],
  inProgress: 0,
  resolved: 0,
  tasks: {} // keyed by ticket id
};

// --- DOM elements ---
const ticketsGrid = document.getElementById("ticketsGrid");
const taskList = document.getElementById("taskList");
const inProgressCountEl = document.getElementById("inProgressCount");
const resolvedCountEl = document.getElementById("resolvedCount");
const yearEl = document.getElementById("year");

yearEl.textContent = new Date().getFullYear();

// --- Helpers ---
function formatDate(iso){
  try {
    const d = new Date(iso);
    return d.toLocaleString();
  } catch(e){
    return iso;
  }
}

function priorityClass(p){
  if(p === "low") return "badge low";
  if(p === "medium") return "badge medium";
  return "badge high";
}

// --- Render tickets ---
function renderTickets(){
  ticketsGrid.innerHTML = "";
  state.tickets.forEach(ticket => {
    const card = document.createElement("div");
    card.className = "ticket-card";
    card.dataset.id = ticket.id;

    const html = `
      <div class="ticket-title">${ticket.title}</div>
      <div class="ticket-meta">${ticket.customer} • ${formatDate(ticket.createdAt)}</div>
      <p class="ticket-desc">${ticket.description}</p>
      <div style="display:flex; justify-content:space-between; align-items:center; gap:8px;">
        <div class="${priorityClass(ticket.priority)}">${ticket.priority.toUpperCase()}</div>
        <div style="font-size:12px;color:var(--muted)">${ticket.id}</div>
      </div>
    `;
    card.innerHTML = html;

    // click to add to task panel
    card.addEventListener("click", (e) => {
      const id = card.dataset.id;
      if(state.tasks[id]) {
        alert("This ticket is already in the Task Status section.");
        return;
      }
      addToTasks(id);
      // alert and update banner
      alert(`"${ticket.title}" added to Task Status`);
      state.inProgress++;
      updateCounts();
      // mark visually (optional)
      card.style.opacity = 0.7;
    });

    ticketsGrid.appendChild(card);
  });
}

// --- Task management ---
function addToTasks(ticketId){
  const ticket = state.tickets.find(t => t.id === ticketId);
  if(!ticket) return;
  // clear empty message
  const empty = taskList.querySelector(".empty");
  if(empty) empty.remove();

  const item = document.createElement("div");
  item.className = "task-item";
  item.dataset.id = ticket.id;

  const left = document.createElement("div");
  left.style.display = "flex";
  left.style.flexDirection = "column";
  left.style.gap = "4px";

  const title = document.createElement("div");
  title.className = "task-title";
  title.textContent = ticket.title;

  const meta = document.createElement("div");
  meta.style.fontSize = "12px";
  meta.style.color = "var(--muted)";
  meta.textContent = `${ticket.customer} • ${ticket.id}`;

  left.appendChild(title);
  left.appendChild(meta);

  const btn = document.createElement("button");
  btn.className = "complete-btn small success";
  btn.textContent = "Complete";

  btn.addEventListener("click", () => {
    // show alert
    alert(`"${ticket.title}" marked complete.`);
    // if it was in tasks, remove it
    removeTask(ticket.id, true);
  });

  item.appendChild(left);
  item.appendChild(btn);

  taskList.appendChild(item);
  state.tasks[ticket.id] = item;
}

function removeTask(ticketId, completed=false){
  const el = state.tasks[ticketId];
  if(!el) return;
  el.remove();
  delete state.tasks[ticketId];

  // Update counters
  if(state.inProgress > 0) state.inProgress--;
  if(completed) state.resolved++;

  updateCounts();

  // Un-dim the ticket card
  const card = ticketsGrid.querySelector(`.ticket-card[data-id="${ticketId}"]`);
  if(card) card.style.opacity = 1;

  // If no tasks remain, show empty hint
  if(Object.keys(state.tasks).length === 0){
    const p = document.createElement("p");
    p.className = "empty";
    p.textContent = "Click a ticket card to add it here.";
    taskList.appendChild(p);
  }
}

// --- Update banner counts ---
function updateCounts(){
  inProgressCountEl.textContent = state.inProgress;
  resolvedCountEl.textContent = state.resolved;
}

// --- Init ---
function init(){
  renderTickets();
  updateCounts();
  // New Ticket button demonstration
  document.getElementById("newTicketBtn").addEventListener("click", () => {
    alert("New Ticket flow placeholder (not implemented).");
  });
}

init();
