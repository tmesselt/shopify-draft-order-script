document.addEventListener('DOMContentLoaded', function () {
    // Ensure this runs only on the draft orders page
    if (window.location.pathname.includes('/draft_orders/')) {
        // Create a new button
        var button = document.createElement('button');
        button.innerHTML = 'Sort Products by Tag';
        button.style.padding = '10px';
        button.style.backgroundColor = '#008CBA';
        button.style.color = 'white';
        button.style.border = 'none';
        button.style.cursor = 'pointer';
        button.style.marginTop = '20px';

        // Append the button to a suitable location on the draft order page
        var container = document.querySelector('.ui-title-bar__actions-group');
        if (container) {
            container.appendChild(button);
        }

        // Add an event listener to the button to trigger an alert for now
        button.addEventListener('click', function () {
            alert('Fetching and sorting products by tag...');
        });
    }
});
