// Run this in browser console (F12 > Console)

console.log('=== REGISTRATION TEST ===');
console.log('Page URL:', window.location.href);

// Check if form exists
const form = document.querySelector('form');
console.log('Form exists:', form !== null);

// Check submit button
const submitBtn = document.querySelector('button[type="submit"]');
console.log('Submit button exists:', submitBtn !== null);
console.log('Submit button text:', submitBtn?.innerText);
console.log('Submit button disabled:', submitBtn?.disabled);

// Test if we can trigger alert
alert('Console test successful! If you see this, JavaScript is working.');

console.log('✅ If you see this message, console is working!');
console.log('Now fill the form and click "Initialize Uplink" button');
