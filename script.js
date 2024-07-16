$(document).ready(function() {
    let itemsCount = 1;

    // Add another item input group
    $('#addItemBtn').click(function() {
        itemsCount++;
        $('#itemsContainer').append(
            <div class="item-group mb-3">
                <input type="text" class="form-control mb-2" placeholder="Item Name" name="item_name">
                <input type="number" class="form-control mb-2" placeholder="Quantity" name="quantity">
                <input type="number" class="form-control mb-2" placeholder="Price" name="price">
                <input type="text" class="form-control" placeholder="Category" name="category">
            </div>
        );
    });

    // Handle form submission
    $('#receiptForm').submit(function(event) {
        event.preventDefault();

        let items = [];
        $('.item-group').each(function() {
            let item_name = $(this).find('[name="item_name"]').val();
            let quantity = parseFloat($(this).find('[name="quantity"]').val());
            let price = parseFloat($(this).find('[name="price"]').val());
            let category = $(this).find('[name="category"]').val();

            if (item_name && !isNaN(quantity) && !isNaN(price) && category) {
                items.push({ name: item_name, quantity: quantity, price: price, category: category });
            }
        });

        let discount = parseFloat($('#discount').val()) || 0;
        let payment_method = $('#paymentMethod').val();

        $.ajax({
            url: '/generate_receipt',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({
                items: items,
                discount: discount,
                payment_method: payment_method
            }),
            success: function(response) {
                let output = 
                    <h2 class="text-center">${response.supermarket_name}</h2>
                    <p>Date: ${response.date}</p>
                    <hr>
                ;
                for (let category in response.categories) {
                    output += <h4>${category}</h4><ul>;
                    response.categories[category].forEach(item => {
                        output += <li>${item.item} - Qty: ${item.quantity}, Price: $${item.price.toFixed(2)}</li>;
                    });
                    output += </ul>;
                }
                output += 
                    <hr>
                    <p>Discount: $${response.discount.toFixed(2)}</p>
                    <p><strong>Total: $${response.total_amount.toFixed(2)}</strong></p>
                    <p>Payment Method: ${response.payment_method}</p>
                    <hr>
                    <p>Thank you for shopping with us!</p>
                ;
                $('#receiptOutput').html(output);
            }
        });
    });
});