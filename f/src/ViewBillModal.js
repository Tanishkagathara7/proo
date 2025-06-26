import React from 'react';

const getWhatsAppLink = (bill) => {
  if (!bill.customerPhone) return '#';
  // Format phone for WhatsApp (assume India country code if not present)
  let phone = bill.customerPhone.trim();
  if (!phone.startsWith('+')) {
    phone = '+91' + phone;
  }
  // Format bill message
  let message = `Bill Number: ${bill.billNumber}%0A`;
  message += `Customer Name: ${bill.customerName}%0A`;
  message += `Total Amount: ₹${bill.totalAmount}%0A`;
  if (bill.items && bill.items.length > 0) {
    message += 'Items:%0A';
    bill.items.forEach((item, idx) => {
      message += `${idx + 1}. ${item.productName} x${item.quantity} - ₹${item.totalPrice}%0A`;
    });
  }
  return `https://wa.me/${phone.replace(/[^\d]/g, '')}?text=${message}`;
};

const ViewBillModal = ({ bill, onClose }) => {
  if (!bill) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Bill Details</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">&times;</button>
        </div>
        <div>
          <p><strong>Bill Number:</strong> {bill.billNumber}</p>
          <p><strong>Customer Name:</strong> {bill.customerName}</p>
          <p><strong>Total Amount:</strong> ₹{bill.totalAmount}</p>
          {/* Add more bill details as needed */}
        </div>
        <div className="flex justify-end mt-4 space-x-2">
          {bill.customerPhone && (
            <a
              href={getWhatsAppLink(bill)}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
            >
              Send via WhatsApp
            </a>
          )}
          <button onClick={onClose} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Close</button>
        </div>
      </div>
    </div>
  );
};

export default ViewBillModal; 