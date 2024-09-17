// This script adds a button to the Shopify Draft Order page
window.onload = function() {
  // Wait for the Draft Order page to load
  if (window.location.pathname.includes('/draft_orders')) {
    // Create the button
    const button = document.createElement('button');
    button.innerText = 'Generate Vendor List';
    button.id = 'generate-vendor-list';
    button.style.cssText = 'padding: 10px; background-color: #008060; color: white; border: none; margin-top: 10px;';
    
    // Add the button to the page
    const header = document.querySelector('.ui-title-bar__main-group');
    if (header) {
      header.appendChild(button);
    }

    // Add click event to trigger the script
    button.addEventListener('click', function() {
      const draftOrderId = window.location.pathname.split('/').pop(); // Get draft order ID from URL

      // Call the Shopify Admin API to fetch and process the draft order
      fetch(`/admin/api/2023-01/draft_orders/${draftOrderId}.json`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Access-Token': 'YOUR_API_PASSWORD'  // Replace with your API password
        }
      })
        .then(response => response.json())
        .then(data => {
          const draftOrder = data.draft_order;
          const itemsByVendor = {};

          // Process each line item
          draftOrder.line_items.forEach(item => {
            const vendorTag = item.vendor || 'Unknown Vendor'; // Replace with logic to find vendor from tags
            if (!itemsByVendor[vendorTag]) {
              itemsByVendor[vendorTag] = [];
            }
            itemsByVendor[vendorTag].push({
              name: item.title,
              quantity: item.quantity
            });
          });

          // Display the grouped items by vendor in the admin panel
          const resultsDiv = document.createElement('div');
          resultsDiv.id = 'vendor-list-results';
          resultsDiv.style.cssText = 'margin-top: 20px; padding: 10px; border: 1px solid #ddd;';

          let outputHtml = '<h3>Vendor-Sorted List</h3>';
          for (let vendor in itemsByVendor) {
            outputHtml += `<h4>Vendor: ${vendor}</h4>`;
            outputHtml += '<table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">';
            outputHtml += '<tr><th style="border: 1px solid #ddd; padding: 8px;">Product Name</th><th style="border: 1px solid #ddd; padding: 8px;">Quantity</th></tr>';
            
            itemsByVendor[vendor].forEach(item => {
              outputHtml += `<tr><td style="border: 1px solid #ddd; padding: 8px;">${item.name}</td><td style="border: 1px solid #ddd; padding: 8px;">${item.quantity}</td></tr>`;
            });
            
            outputHtml += '</table>';
          }

          resultsDiv.innerHTML = outputHtml;

          // Add the results div to the page
          const mainContent = document.querySelector('.ui-layout__section');
          if (mainContent) {
            // Remove previous results if they exist
            const previousResults = document.getElementById('vendor-list-results');
            if (previousResults) {
              previousResults.remove();
            }

            mainContent.appendChild(resultsDiv);
          }
        })
        .catch(error => console.error('Error fetching draft order:', error));
    });
  }
};
