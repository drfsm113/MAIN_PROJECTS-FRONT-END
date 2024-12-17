import React from 'react';
import { FiCreditCard } from 'react-icons/fi';
import useToast from "../store/CustomHook/useToast";
const PaymentMethods = () => {
    const { showToastMessage } = useToast();

    // Dummy data for demonstration
    const paymentMethods = [
        { id: 1, type: 'Visa', last4: '1234', expiry: '12/2024' },
        { id: 2, type: 'MasterCard', last4: '5678', expiry: '06/2025' },
    ];

    const handleRemovePaymentMethod = (id) => {
        // Implement remove payment method logic here
        showToastMessage('Payment method removed successfully', 'success');
    };

    const handleAddPaymentMethod = () => {
        // Implement add payment method logic here
        showToastMessage('Add payment method functionality not implemented yet', 'info');
    };

    return (
        <div>
            <h2 className="text-2xl font-semibold mb-4 text-text">Payment Methods</h2>
            <div className="space-y-4">
                {paymentMethods.map((method) => (
                    <div key={method.id} className="flex items-center justify-between p-4 border border-gray-300 rounded-md">
                        <div className="flex items-center">
                            <FiCreditCard className="text-2xl mr-4" />
                            <div>
                                <p className="font-medium">{method.type} ending in {method.last4}</p>
                                <p className="text-sm text-gray-600">Expires {method.expiry}</p>
                            </div>
                        </div>
                        <button
                            onClick={() => handleRemovePaymentMethod(method.id)}
                            className="text-red-500 hover:text-red-600"
                        >
                            Remove
                        </button>
                    </div>
                ))}
                <button
                    onClick={handleAddPaymentMethod}
                    className="w-full px-4 py-2 bg-primary text-white rounded-md hover:bg-blue-600 transition-colors duration-200"
                >
                    Add New Payment Method
                </button>
            </div>
        </div>
    );
};

export default PaymentMethods;