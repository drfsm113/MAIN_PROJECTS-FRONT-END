import React from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import useToast from "../store/CustomHook/useToast"
import userService from "../Services/UserService";
const AccountSettingsSchema = Yup.object().shape({
    email_notifications: Yup.boolean(),
    sms_notifications: Yup.boolean(),
    language: Yup.string().required('Language is required'),
});

const AccountSettings = ({ user }) => {
    const { showToastMessage } = useToast();

    const handleSubmit = async (values, { setSubmitting }) => {
        try {
            await userService.updateProfile(user.slug, values);
            showToastMessage('Account settings updated successfully', 'success');
        } catch (error) {
            showToastMessage('Failed to update account settings', 'error');
        }
        setSubmitting(false);
    };

    const handleDeactivateAccount = async () => {
        if (window.confirm('Are you sure you want to deactivate your account? This action cannot be undone.')) {
            try {
                await userService.deactivateAccount(user.slug);
                showToastMessage('Account deactivated successfully', 'success');
                // Implement logout and redirect logic here
            } catch (error) {
                showToastMessage('Failed to deactivate account', 'error');
            }
        }
    };

    const handleDeleteAccount = async () => {
        if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
            try {
                await userService.deleteAccount(user.slug);
                showToastMessage('Account deleted successfully', 'success');
                // Implement logout and redirect logic here
            } catch (error) {
                showToastMessage('Failed to delete account', 'error');
            }
        }
    };

    return (
        <div>
            <h2 className="text-2xl font-semibold mb-4 text-text">Account Settings</h2>
            <Formik
                initialValues={{
                    email_notifications: user.email_notifications || false,
                    sms_notifications: user.sms_notifications || false,
                    language: user.language || 'en',
                }}
                validationSchema={AccountSettingsSchema}
                onSubmit={handleSubmit}
            >
                {({ errors, touched, isSubmitting }) => (
                    <Form className="space-y-4">
                        <div>
                            <label className="flex items-center">
                                <Field type="checkbox" name="email_notifications" className="mr-2" />
                                Receive email notifications
                            </label>
                        </div>
                        <div>
                            <label className="flex items-center">
                                <Field type="checkbox" name="sms_notifications" className="mr-2" />
                                Receive SMS notifications
                            </label>
                        </div>
                        <div>
                            <label htmlFor="language" className="block text-gray-700 mb-2">Language</label>
                            <Field as="select" name="language" className="w-full px-3 py-2 border border-gray-300 rounded-md">
                                <option value="en">English</option>
                                <option value="es">Español</option>
                                <option value="fr">Français</option>
                            </Field>
                            {errors.language && touched.language && <div className="text-red-500">{errors.language}</div>}
                        </div>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-blue-600 transition-colors duration-200"
                        >
                            {isSubmitting ? 'Updating...' : 'Update Settings'}
                        </button>
                    </Form>
                )}
            </Formik>
            <div className="mt-8 space-y-4">
                <button
                    onClick={handleDeactivateAccount}
                    className="w-full px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition-colors duration-200"
                >
                    Deactivate Account
                </button>
                <button
                    onClick={handleDeleteAccount}
                    className="w-full px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors duration-200"
                >
                    Delete Account
                </button>
            </div>
        </div>
    );
};

export default AccountSettings;