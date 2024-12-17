import React from 'react';
import useToast from "../store/CustomHook/useToast"
const OrderHistory = () => {
    const { showToastMessage } = useToast();

    // Dummy data for demonstration
    const orders = [
        { id: 1, orderNumber: '12345', date: '2023-01-01', total: 99.99, status: 'Delivered' },
        { id: 2, orderNumber: '67890', date: '2023-02-15', total: 149.99, status: 'Shipped' },
        { id: 3, orderNumber: '24680', date: '2023-03-30', total: 79.99, status: 'Processing' },
    ];

    const handleViewOrder = (orderId) => {
        // Implement view order details logic here
        showToastMessage('View order details functionality not implemented yet', 'info');
    };

    return (
        <div>
            <h2 className="text-2xl font-semibold mb-4 text-text">Order History</h2>
            <div className="space-y-4">
                {orders.map((order) => (
                    <div key={order.id} className="p-4 border border-gray-300 rounded-md">
                        <div className="flex justify-between items-center mb-2">
                            <p className="font-medium">Order #{order.orderNumber}</p>
                            <p className="text-sm text-gray-600">Placed on: {order.date}</p>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">Total: ${order.total.toFixed(2)}</p>
                        <p className="text-sm text-gray-600 mb-2">Status: {order.status}</p>
                        <button
                            onClick={() => handleViewOrder(order.id)}
                            className="text-blue-500 hover:text-blue-600"
                        >
                            View Order Details
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default OrderHistory;