import React from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import useToast from "../store/CustomHook/useToast";

const PasswordChangeSchema = Yup.object().shape({
    current_password: Yup.string().required('Current password is required'),
    new_password: Yup.string().min(8, 'Password must be at least 8 characters').required('New password is required'),
    confirm_password: Yup.string().oneOf([Yup.ref('new_password'), null], 'Passwords must match').required('Confirm password is required'),
});

const SecuritySettings = () => {
    const { showToastMessage } = useToast();

    const handlePasswordChange = async (values, { setSubmitting, resetForm }) => {
        try {
            const response = await axios.post('http://127.0.0.1:8000/accounts/api/change-password/', {
                old_password: values.current_password,
                new_password: values.new_password,
                confirm_password: values.confirm_password
            });
            showToastMessage('Password changed successfully', 'success');
            resetForm();
        } catch (error) {
            showToastMessage(error.response?.data?.message || 'Failed to change password', 'error');
        }
        setSubmitting(false);
    };

    return (
        <div>
            <h2 className="text-2xl font-semibold mb-4 text-text">Change Password</h2>
            <div className="mb-8">
                {/* <h3 className="text-lg font-medium mb-4">Change Password</h3> */}
                <Formik
                    initialValues={{ current_password: '', new_password: '', confirm_password: '' }}
                    validationSchema={PasswordChangeSchema}
                    onSubmit={handlePasswordChange}
                >
                    {({ errors, touched, isSubmitting }) => (
                        <Form className="space-y-4">
                            <div>
                                <label htmlFor="current_password" className="block text-gray-700 mb-2">Current Password</label>
                                <Field name="current_password" type="password" className="w-full px-3 py-2 border border-gray-300 rounded-md" />
                                {errors.current_password && touched.current_password && <div className="text-red-500">{errors.current_password}</div>}
                            </div>
                            <div>
                                <label htmlFor="new_password" className="block text-gray-700 mb-2">New Password</label>
                                <Field name="new_password" type="password" className="w-full px-3 py-2 border border-gray-300 rounded-md" />
                                {errors.new_password && touched.new_password && <div className="text-red-500">{errors.new_password}</div>}
                            </div>
                            <div>
                                <label htmlFor="confirm_password" className="block text-gray-700 mb-2">Confirm New Password</label>
                                <Field name="confirm_password" type="password" className="w-full px-3 py-2 border border-gray-300 rounded-md" />
                                {errors.confirm_password && touched.confirm_password && <div className="text-red-500">{errors.confirm_password}</div>}
                            </div>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="px-4 py-2 bg-primary text-white rounded-md hover:bg-blue-600 transition-colors duration-200"
                            >
                                {isSubmitting ? 'Changing Password...' : 'Change Password'}
                            </button>
                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    );
};

export default SecuritySettings;