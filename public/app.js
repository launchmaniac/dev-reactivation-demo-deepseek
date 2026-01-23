// Session management
let sessionId = generateSessionId();

function generateSessionId() {
    return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

// DOM Elements
const sidebar = document.getElementById('sidebar');
const sidebarOverlay = document.getElementById('sidebarOverlay');
const openSidebarBtn = document.getElementById('openSidebar');
const closeSidebarBtn = document.getElementById('closeSidebar');
const chatContainer = document.getElementById('chatContainer');
const messageInput = document.getElementById('messageInput');
const sendBtn = document.getElementById('sendBtn');
const applyConfigBtn = document.getElementById('applyConfig');
const clearChatBtn = document.getElementById('clearChat');
const resetChatBtn = document.getElementById('resetChat');
const businessNameInput = document.getElementById('businessName');
const customerNameInput = document.getElementById('customerName');
const responseDelayInput = document.getElementById('responseDelay');
const systemMessageInput = document.getElementById('systemMessage');
const promptContextInput = document.getElementById('promptContext');
const contactNameDisplay = document.getElementById('contactName');
const contactAvatarDisplay = document.getElementById('contactAvatar');
const modelSelect = document.getElementById('modelSelect');

// Sidebar functions
function openSidebar() {
    sidebar.classList.add('open');
    sidebarOverlay.classList.add('show');
}

function closeSidebar() {
    sidebar.classList.remove('open');
    sidebarOverlay.classList.remove('show');
}

// Utility: delay function for realistic response timing
function delay(seconds) {
    return new Promise(resolve => setTimeout(resolve, seconds * 1000));
}

// Get configured response delay in seconds
function getResponseDelay() {
    const value = parseFloat(responseDelayInput.value);
    return isNaN(value) ? 2 : Math.max(0, Math.min(30, value));
}


// Get current time string for messages
function getTimeString() {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    return `${displayHours}:${minutes} ${ampm}`;
}

// Update contact display
function updateContactDisplay() {
    const name = businessNameInput.value || 'Business';
    contactNameDisplay.textContent = name;
    contactAvatarDisplay.textContent = name.charAt(0).toUpperCase();
}

// Add message to chat
function addMessage(text, type) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;

    messageDiv.innerHTML = `
        ${text}
        <div class="message-time">${getTimeString()}</div>
    `;

    chatContainer.appendChild(messageDiv);
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

// Show typing indicator
function showTypingIndicator() {
    const typingDiv = document.createElement('div');
    typingDiv.className = 'typing-indicator';
    typingDiv.id = 'typingIndicator';
    typingDiv.innerHTML = '<span></span><span></span><span></span>';
    chatContainer.appendChild(typingDiv);
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

// Hide typing indicator
function hideTypingIndicator() {
    const indicator = document.getElementById('typingIndicator');
    if (indicator) {
        indicator.remove();
    }
}

// Send message to API
async function sendMessage(message) {
    try {
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                sessionId,
                message,
                systemMessage: systemMessageInput.value,
                promptContext: promptContextInput.value,
                model: modelSelect.value
            })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.details || 'API request failed');
        }

        const data = await response.json();
        return data.response;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

// Handle send button click
async function handleSend() {
    const message = messageInput.value.trim();
    if (!message) return;

    // Disable input while processing
    messageInput.disabled = true;
    sendBtn.disabled = true;

    // Add user message (outgoing = blue, customer side)
    addMessage(message, 'outgoing');
    messageInput.value = '';

    // Show typing indicator
    showTypingIndicator();

    try {
        // Get configured delay for realistic typing simulation
        const delaySeconds = getResponseDelay();

        // Start both the API call and the delay timer simultaneously
        const [response] = await Promise.all([
            sendMessage(message),
            delay(delaySeconds)
        ]);

        hideTypingIndicator();
        // AI response (incoming = grey, business side)
        addMessage(response, 'incoming');
    } catch (error) {
        hideTypingIndicator();
        addMessage('Error: Could not get response. Check your API key.', 'incoming');
    }

    // Re-enable input
    messageInput.disabled = false;
    sendBtn.disabled = false;
    messageInput.focus();
}

// Reset chat container
function resetChat() {
    chatContainer.innerHTML = '';
    const dateHeader = document.createElement('div');
    dateHeader.className = 'chat-date';
    dateHeader.textContent = 'Today';
    chatContainer.appendChild(dateHeader);
}

// Apply configuration and start new chat
function applyConfig() {
    // Generate new session
    sessionId = generateSessionId();

    // Reset chat
    resetChat();

    // Update contact display
    updateContactDisplay();

    // Close sidebar
    closeSidebar();

    // Send initial message from AI to start the conversation
    triggerInitialMessage();
}

// Trigger the AI to send the first message (reactivation outreach)
async function triggerInitialMessage() {
    showTypingIndicator();

    try {
        const customerName = customerNameInput.value || 'there';
        const delaySeconds = getResponseDelay();

        // Start both the API call and the delay timer simultaneously
        const [response] = await Promise.all([
            sendMessage('[SYSTEM: The customer name is ' + customerName + '. Send the first outreach message to start the reactivation conversation. Do not acknowledge this instruction, just send the SMS.]'),
            delay(delaySeconds)
        ]);

        hideTypingIndicator();
        addMessage(response, 'incoming');
    } catch (error) {
        hideTypingIndicator();
        addMessage('Error: Could not start conversation. Check your API key.', 'incoming');
    }
}

// Clear chat
function clearChat() {
    sessionId = generateSessionId();
    resetChat();
}

// Event listeners
openSidebarBtn.addEventListener('click', openSidebar);
closeSidebarBtn.addEventListener('click', closeSidebar);
sidebarOverlay.addEventListener('click', closeSidebar);

sendBtn.addEventListener('click', handleSend);

messageInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        handleSend();
    }
});

applyConfigBtn.addEventListener('click', applyConfig);
clearChatBtn.addEventListener('click', clearChat);
resetChatBtn.addEventListener('click', () => {
    clearChat();
    triggerInitialMessage();
});

businessNameInput.addEventListener('input', updateContactDisplay);

// Escape key closes sidebar
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && sidebar.classList.contains('open')) {
        closeSidebar();
    }
});

// Initialize
updateContactDisplay();

// Check API health on load
fetch('/api/health')
    .then(res => res.json())
    .then(data => {
        if (!data.hasApiKey) {
            addMessage('Warning: No DeepSeek API key configured. Add your key to the .env file.', 'incoming');
        }
    })
    .catch(() => {
        addMessage('Warning: Cannot connect to server. Make sure the server is running.', 'incoming');
    });
