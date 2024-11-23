document.getElementById('smsForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const number = document.getElementById('number').value;
    const message = document.getElementById('message').value;
    const responseDiv = document.getElementById('response');

    const phoneRegex = /^(08|09)\d{9}$/;
    if (!phoneRegex.test(number)) {
        responseDiv.textContent = 'Invalid phone number. Use 08XXXXXXXXX or 09XXXXXXXXX format.';
        responseDiv.classList.add('visible');
        responseDiv.style.color = 'red';
        return;
    }

    responseDiv.textContent = 'Sending...';
    responseDiv.style.color = 'green';
    responseDiv.classList.add('visible');

    try {
        const res = await fetch('/send-sms', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ number, message }),
        });

        const data = await res.json();
        if (data.success) {
            responseDiv.textContent = 'SMS sent successfully!';
        } else {
            responseDiv.textContent = data.error || 'Failed to send SMS.';
        }
    } catch (err) {
        responseDiv.textContent = 'Error occurred. Please try again.';
    }
});
