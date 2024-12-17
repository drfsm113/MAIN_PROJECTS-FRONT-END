import React, { useState, useEffect, useCallback } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { motion, AnimatePresence } from 'framer-motion';
import { Edit, Save, X, Camera, CheckCircle, XCircle } from 'lucide-react';
import userService from '../Services/UserService';
import useToast from "../store/CustomHook/useToast";

const PersonalInfoSchema = Yup.object().shape({
  first_name: Yup.string().required('Required'),
  last_name: Yup.string().required('Required'),
  email: Yup.string().email('Invalid email').required('Required'),
  phone_number: Yup.string(),
  bio: Yup.string(),
  birthday: Yup.date(),
  is_active: Yup.boolean(),
});

const PersonalInfo = () => {
  const [userData, setUserData] = useState({
    user: {},
    userSlug: '',
    isLoading: true,
    error: null
  });
  const [isEditing, setIsEditing] = useState(false);
  const [newProfilePicture, setNewProfilePicture] = useState(null);
  const { showToastMessage } = useToast();

  const fetchUserDetails = useCallback(async () => {
    try {
      const response = await userService.getUserDetails();
      setUserData({
        user: response,
        userSlug: response.slug,
        isLoading: false,
        error: null
      });
    } catch (error) {
      console.error("Error fetching user details:", error);
      setUserData(prevState => ({
        ...prevState,
        isLoading: false,
        error: "Failed to fetch user details"
      }));
      showToastMessage("Failed to fetch user details", "error");
    }
  }, [showToastMessage]); // Add any dependencies that showToastMessage might have

  useEffect(() => {
    fetchUserDetails();
  }, []);

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const formData = new FormData();

      Object.keys(values).forEach(key => {
        if (key === 'bio' || key === 'birthday') {
          formData.append(`profile.${key}`, values[key]);
        } else if (key === 'is_active') {
          formData.append(key, values[key].toString());
        } else {
          formData.append(key, values[key]);
        }
      });

      if (newProfilePicture) {
        formData.append('profile.profile_picture', newProfilePicture);
      }

      const response = await userService.updateProfile(userData.userSlug, formData);

      setUserData(prevState => ({
        ...prevState,
        user: {
          ...prevState.user,
          ...response,
        },
      }));
      await fetchUserDetails();
      setIsEditing(false);
      setNewProfilePicture(null);
      showToastMessage("Profile updated successfully", "success");
    } catch (error) {
      console.error('Error updating profile:', error);
      showToastMessage("Failed to update profile", "error");
    }
    setSubmitting(false);
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setNewProfilePicture(file);
    }
  };

  const ProfilePicture = ({ src, alt }) => (
      <div className="relative mb-6 md:mb-0">
        <motion.img
            src={src || '/default-avatar.png'}
            alt={alt}
            className="w-24 h-24 rounded-full object-cover shadow-lg mx-auto md:mx-0"
            whileHover={{ scale: 1.05 }}
        />
        {isEditing && (
            <motion.label
                className="absolute bottom-0 right-1/2 md:right-0 transform translate-x-1/2 md:translate-x-0 translate-y-1/4 bg-primary text-white p-2 rounded-full cursor-pointer hover:bg-blue-700 transition-colors duration-200"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
            >
              <Camera size={16} />
              <input
                  type="file"
                  onChange={handleImageChange}
                  accept="image/*"
                  className="hidden"
              />
            </motion.label>
        )}
      </div>
  );

  const FormField = ({ name, placeholder, type = 'text', as }) => (
      <div className="mb-4">
        <Field
            name={name}
            placeholder={placeholder}
            type={type}
            as={as}
            className="w-full p-3 border rounded-lg border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 transition duration-200 bg-white"
        />
        <ErrorMessage name={name} component="div" className="text-red-500 text-sm mt-1" />
      </div>
  );

  const ToggleField = ({ name, label }) => (
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-medium text-gray-700">{label}</span>
        <Field name={name}>
          {({ field, form }) => (
              <motion.button
                  type="button"
                  onClick={() => form.setFieldValue(name, !field.value)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                      field.value ? 'bg-primary' : 'bg-gray-200'
                  }`}
                  whileTap={{ scale: 0.95 }}
              >
                <motion.span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                    initial={false}
                    animate={{
                      translateX: field.value ? '1.25rem' : '0.25rem',
                    }}
                />
              </motion.button>
          )}
        </Field>
      </div>
  );

  const InfoField = ({ label, value, icon }) => (
      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
        <div>
          <p className="text-sm font-medium text-gray-500">{label}</p>
          <p className="mt-1 text-base text-gray-900">{value}</p>
        </div>
        {icon && <div className="ml-2">{icon}</div>}
      </div>
  );

  if (userData.isLoading) {
    return (
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-primary"></div>
        </div>
    );
  }

  if (userData.error) {
    return <div className="text-red-500 text-center p-4">{userData.error}</div>;
  }

  return (
      <div className="w-full p-6 sm:p-8">
        <div className="md:flex md:items-start">
          <div className="md:mr-8 mb-6 md:mb-0">
            <ProfilePicture
                src={newProfilePicture ? URL.createObjectURL(newProfilePicture) : userData.user.profile?.profile_picture}
                alt="Profile"
            />
          </div>
          <div className="flex-grow">
            <h2 className="text-2xl font-bold mb-6 text-center md:text-left text-gray-800">Personal Information</h2>
            <AnimatePresence mode="wait">
              {isEditing ? (
                  <motion.div
                      key="edit"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                  >
                    <Formik
                        initialValues={{
                          first_name: userData.user.first_name || '',
                          last_name: userData.user.last_name || '',
                          email: userData.user.email || '',
                          phone_number: userData.user.phone_number || '',
                          bio: userData.user.profile?.bio || '',
                          birthday: userData.user.profile?.birthday || '',
                          is_active: userData.user.is_active || false,
                        }}
                        validationSchema={PersonalInfoSchema}
                        onSubmit={handleSubmit}
                    >
                      {({ isSubmitting }) => (
                          <Form className="space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <FormField name="first_name" placeholder="First Name" />
                              <FormField name="last_name" placeholder="Last Name" />
                              <FormField name="email" placeholder="Email" type="email" />
                              <FormField name="phone_number" placeholder="Phone Number" />
                              <FormField name="birthday" placeholder="Birthday" type="date" />
                            </div>
                            <div className="col-span-full">
                              <FormField name="bio" placeholder="Bio" as="textarea" />
                            </div>
                            <ToggleField name="is_active" label="Activate Account" />
                            <div className="flex justify-end space-x-4 mt-6">
                              <motion.button
                                  type="button"
                                  onClick={() => setIsEditing(false)}
                                  className="p-2 bg-secondary text-gray-800 rounded-full hover:bg-gray-300 transition-colors duration-200"
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  title="Cancel"
                              >
                                <X size={24} />
                              </motion.button>
                              <motion.button
                                  type="submit"
                                  className={`p-2 bg-primary text-white rounded-full ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'} transition-colors duration-200`}
                                  disabled={isSubmitting}
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  title={isSubmitting ? 'Saving...' : 'Save Changes'}
                              >
                                <Save size={24} />
                              </motion.button>
                            </div>
                          </Form>
                      )}
                    </Formik>
                  </motion.div>
              ) : (
                  <motion.div
                      key="view"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-6"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <InfoField label="Name" value={`${userData.user.first_name} ${userData.user.last_name}`} />
                      <InfoField label="Email" value={userData.user.email} />
                      <InfoField label="Phone" value={userData.user.phone_number || 'N/A'} />
                      <InfoField label="Birthday" value={userData.user.profile?.birthday || 'N/A'} />
                      <InfoField
                          label="Account Status"
                          value={userData.user.is_active ? 'Active' : 'Inactive'}
                          icon={userData.user.is_active ? <CheckCircle className="text-green-500" /> : <XCircle className="text-red-500" />}
                      />
                    </div>
                    <div className="col-span-full">
                      <InfoField label="Bio" value={userData.user.profile?.bio || 'N/A'} />
                    </div>
                    <div className="text-center md:text-right mt-6">
                      <motion.button
                          onClick={() => setIsEditing(true)}
                          className="p-2 bg-primary text-white rounded-full hover:bg-blue-700 transition-colors duration-200"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          title="Edit Profile"
                      >
                        <Edit size={24} />
                      </motion.button>
                    </div>
                  </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
  );
};

export default PersonalInfo;