async function sendChat() {
    const input = document.getElementById("chat-input").value;
    if (!input) return;

    const chatBox = document.getElementById("chat-box");
    const userMessage = `<div class="user-message"><strong>You:</strong> ${input}</div>`;
    chatBox.innerHTML += userMessage;

    document.getElementById("chat-input").value = ''; // Clear input

    try {
        const response = await fetch('http://localhost:5000/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: input })
        });

        const data = await response.json();
        const botMessage = `<div class="bot-message"><strong>NoraBot:</strong> ${data.reply}</div>`;
        chatBox.innerHTML += botMessage;
    } catch (error) {
        chatBox.innerHTML += `<div class="bot-message error">Error connecting to server.</div>`;
    }
}
