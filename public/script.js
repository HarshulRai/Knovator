// public/scripts.js
// Fetch active and inactive post counts
fetch('/api/posts/count', {
    method: 'GET',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
})
.then(response => response.json())
.then(data => {
    document.getElementById('activePosts').innerText = `Active Posts: ${data.activeCount}`;
    document.getElementById('inactivePosts').innerText = `Inactive Posts: ${data.inactiveCount}`;
})
.catch(error => console.error('Error:', error));
