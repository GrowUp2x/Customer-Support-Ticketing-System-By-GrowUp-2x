// Initialize tickets from local storage or create an empty array
let tickets = JSON.parse(localStorage.getItem('tickets')) || [];
let openTickets = tickets.filter(ticket => ticket.status === 'open');
let resolvedTickets = tickets.filter(ticket => ticket.status === 'resolved');
let chatMessages = JSON.parse(localStorage.getItem('chatMessages')) || [];

// Initial display
displayTickets();
renderChart();
displayChatMessages();

// Create new ticket
function createTicket() {
  const name = document.getElementById('ticketName').value;
  const email = document.getElementById('ticketEmail').value;
  const issue = document.getElementById('ticketIssue').value;
  const priority = document.getElementById('ticketPriority').value;

  if (!name || !email || !issue) return;

  const newTicket = {
    id: Date.now().toString(),
    name: name,
    email: email,
    issue: issue,
    priority: priority,
    status: 'open'
  };

  openTickets.push(newTicket);
  tickets = [...openTickets, ...resolvedTickets];
  localStorage.setItem('tickets', JSON.stringify(tickets));

  displayTickets();
  renderChart();
}

// Display tickets
function displayTickets() {
  const openTicketList = document.getElementById('openTicketList');
  const resolvedTicketList = document.getElementById('resolvedTicketList');
  openTicketList.innerHTML = '';
  resolvedTicketList.innerHTML = '';

  const filter = document.getElementById('ticketFilter').value;

  const filteredOpenTickets = openTickets.filter(ticket => !filter || ticket.priority === filter);
  const filteredResolvedTickets = resolvedTickets.filter(ticket => !filter || ticket.priority === filter);

  filteredOpenTickets.forEach(ticket => {
    const li = document.createElement('li');
    li.innerHTML = `
      <div class="ticket-id">Ticket ID: ${ticket.id}</div>
      <div class="ticket-details">Name: ${ticket.name} | Email: ${ticket.email} | Issue: ${ticket.issue}</div>
      <div class="ticket-priority ${ticket.priority}">${ticket.priority}</div>
      <div class="ticket-status">${ticket.status}</div>
      <div class="ticket-actions">
        <button class="resolve" onclick="resolveTicket('${ticket.id}')">Resolve</button>
        <button class="edit" onclick="editTicket('${ticket.id}')">Edit</button>
        <button class="delete" onclick="deleteTicket('${ticket.id}')">Delete</button>
      </div>`;
    openTicketList.appendChild(li);
  });

  filteredResolvedTickets.forEach(ticket => {
    const li = document.createElement('li');
    li.innerHTML = `
      <div class="ticket-id">Ticket ID: ${ticket.id}</div>
      <div class="ticket-details">Name: ${ticket.name} | Email: ${ticket.email} | Issue: ${ticket.issue}</div>
      <div class="ticket-priority ${ticket.priority}">${ticket.priority}</div>
      <div class="ticket-status">${ticket.status}</div>`;
    resolvedTicketList.appendChild(li);
  });
}

// Resolve ticket
function resolveTicket(ticketId) {
  const ticket = openTickets.find(t => t.id === ticketId);
  if (ticket) {
    ticket.status = 'resolved';
    openTickets = openTickets.filter(t => t.id !== ticketId);
    resolvedTickets.push(ticket);
    tickets = [...openTickets, ...resolvedTickets];
    localStorage.setItem('tickets', JSON.stringify(tickets));
    displayTickets();
    renderChart();
  }
}

// Edit ticket
function editTicket(ticketId) {
  const ticket = openTickets.find(t => t.id === ticketId);
  if (ticket) {
    document.getElementById('ticketName').value = ticket.name;
    document.getElementById('ticketEmail').value = ticket.email;
    document.getElementById('ticketIssue').value = ticket.issue;
    document.getElementById('ticketPriority').value = ticket.priority;
    deleteTicket(ticketId); // Remove the ticket from the list before editing
  }
}

// Delete ticket
function deleteTicket(ticketId) {
  openTickets = openTickets.filter(t => t.id !== ticketId);
  resolvedTickets = resolvedTickets.filter(t => t.id !== ticketId);
  tickets = [...openTickets, ...resolvedTickets];
  localStorage.setItem('tickets', JSON.stringify(tickets));
  displayTickets();
  renderChart();
}

// Filter tickets
function filterTickets() {
  displayTickets(); // Re-render tickets with the applied filter
}

// Resolve all open tickets
function resolveAllOpenTickets() {
  openTickets.forEach(ticket => {
    ticket.status = 'resolved';
  });
  resolvedTickets = [...resolvedTickets, ...openTickets];
  openTickets = [];
  tickets = [...openTickets, ...resolvedTickets];
  localStorage.setItem('tickets', JSON.stringify(tickets));
  displayTickets();
  renderChart();
}

// Delete all resolved tickets
function deleteAllResolvedTickets() {
  resolvedTickets = [];
  tickets = [...openTickets, ...resolvedTickets];
  localStorage.setItem('tickets', JSON.stringify(tickets));
  displayTickets();
  renderChart();
}

// Render the ticket statistics chart (Pie chart)
function renderChart() {
  const openTicketsCount = openTickets.length;
  const resolvedTicketsCount = resolvedTickets.length;

  const ctx = document.getElementById("ticketChart").getContext("2d");

  new Chart(ctx, {
    type: 'pie',
    data: {
      labels: ['Open Tickets', 'Resolved Tickets'],
      datasets: [{
        data: [openTicketsCount, resolvedTicketsCount],
        backgroundColor: ['#3498db', '#2ecc71'],
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'top',
        },
        tooltip: {
          enabled: true,
        },
      }
    }
  });
}

// Handle Chat messages
function sendChatMessage() {
  const message = document.getElementById('chatMessage').value;
  if (!message) return;

  chatMessages.push({ text: message, sender: 'Customer' });
  localStorage.setItem('chatMessages', JSON.stringify(chatMessages));
  displayChatMessages();
  document.getElementById('chatMessage').value = ''; // Clear message input
}

// Display Chat messages
function displayChatMessages() {
  const chatContainer = document.getElementById('chatContainer');
  chatContainer.innerHTML = ''; // Clear previous messages

  chatMessages.forEach(msg => {
    const div = document.createElement('div');
    div.textContent = `${msg.sender}: ${msg.text}`;
    chatContainer.appendChild(div);
  });

  chatContainer.scrollTop = chatContainer.scrollHeight; // Scroll to bottom
}
