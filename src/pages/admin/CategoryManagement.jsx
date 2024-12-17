// // App.js
// import React from 'react';
// import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
// import CategoriesList from './CategoryManagement/CategoriesList';
// import CategoryForm from './CategoryManagement/CategoryForm';
//
// function App() {
//     return (
//         <Router>
//             <div className="min-h-screen bg-gray-100">
//                 <nav className="bg-white shadow-lg">
//                     <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//                         <div className="flex justify-between h-16">
//                             <div className="flex">
//                                 <a href="/" className="text-gray-900">Home</a>
//                                 <a href="/about" className="ml-4 text-gray-900">About</a>
//                             </div>
//                         </div>
//                     </div>
//                 </nav>
//
//                 <main>
//                     <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
//                         <Routes>
//
//                             <Route exact path="/" element={<CategoriesList />} />
//                             <Route path="/category/:id" element={<CategoryForm />} />
//                         </Routes>
//                     </div>
//                 </main>
//             </div>
//         </Router>
//     );
// }
//
// export default App;



// import React, { useState, useEffect } from 'react';
// import { motion } from 'framer-motion';
// import axios from 'axios';
// import { PlusCircle, MoreVertical, ChevronDown, ChevronUp, Edit, Trash2, ArrowLeft } from 'lucide-react';
//
// // Sidebar component
// const Sidebar = ({ activeSection }) => (
//     <motion.div
//         className="bg-gray-800 text-white w-64 min-h-screen p-4"
//         initial={{ x: -300 }}
//         animate={{ x: 0 }}
//         transition={{ duration: 0.5 }}
//     >
//         <h2 className="text-2xl font-bold mb-6">Dashboard</h2>
//         <nav>
//             {['Categories', 'Products', 'Orders', 'Customers', 'Analytics', 'Settings'].map((item) => (
//                 <motion.div
//                     key={item}
//                     className={`p-2 mb-2 rounded cursor-pointer ${activeSection === item ? 'bg-blue-600' : 'hover:bg-gray-700'}`}
//                     whileHover={{ scale: 1.05 }}
//                     whileTap={{ scale: 0.95 }}
//                 >
//                     {item}
//                 </motion.div>
//             ))}
//         </nav>
//     </motion.div>
// );
//
// // Category Stats component
// const CategoryStats = ({ totalCategories, mainCategories, subCategories }) => (
//     <motion.div
//         className="bg-white p-4 rounded-lg shadow-md"
//         initial={{ opacity: 0, y: 50 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.5 }}
//     >
//         <h3 className="text-lg font-semibold mb-2">Category Stats</h3>
//         <p>Total: {totalCategories}</p>
//         <p>Main: {mainCategories}</p>
//         <p>Sub: {subCategories}</p>
//     </motion.div>
// );
//
// // Quick Actions component
// const QuickActions = ({ onAddCategory }) => (
//     <motion.div
//         className="bg-white p-4 rounded-lg shadow-md"
//         initial={{ opacity: 0, y: 50 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.5, delay: 0.2 }}
//     >
//         <h3 className="text-lg font-semibold mb-2">Quick Actions</h3>
//         <motion.button
//             className="bg-blue-500 text-white px-4 py-2 rounded-md flex items-center mb-2"
//             whileHover={{ scale: 1.05 }}
//             whileTap={{ scale: 0.95 }}
//             onClick={onAddCategory}
//         >
//             <PlusCircle className="mr-2" size={20} />
//             Add Category
//         </motion.button>
//         <motion.button
//             className="bg-gray-500 text-white px-4 py-2 rounded-md flex items-center"
//             whileHover={{ scale: 1.05 }}
//             whileTap={{ scale: 0.95 }}
//         >
//             Import/Export
//         </motion.button>
//     </motion.div>
// );
//
// // Category Card component
// const CategoryCard = ({ category, onSelect, onEdit, onDelete }) => (
//     <motion.div
//         className="bg-white p-4 rounded-lg shadow-md"
//         whileHover={{ scale: 1.05 }}
//         whileTap={{ scale: 0.95 }}
//     >
//         <div className="flex justify-between items-center mb-2">
//             <h3 className="text-lg font-semibold">{category.name}</h3>
//             <motion.div
//                 className="relative"
//                 whileHover={{ scale: 1.1 }}
//             >
//                 <MoreVertical size={20} className="cursor-pointer" onClick={() => {}} />
//                 {/* Dropdown menu for edit and delete actions */}
//             </motion.div>
//         </div>
//         {category.image && (
//             <img src={category.image} alt={category.name} className="w-full h-32 object-cover rounded-md mb-2" />
//         )}
//         <p>Sub: {category.subCategories.length}</p>
//         <motion.button
//             className="mt-2 bg-blue-500 text-white px-3 py-1 rounded-md"
//             whileHover={{ scale: 1.05 }}
//             whileTap={{ scale: 0.95 }}
//             onClick={() => onSelect(category)}
//         >
//             View Details
//         </motion.button>
//     </motion.div>
// );
//
// // Category Details component
// const CategoryDetails = ({ category, onClose, onEdit, onDelete, onAddSubcategory }) => (
//     <motion.div
//         className="bg-white p-6 rounded-lg shadow-lg"
//         initial={{ opacity: 0, scale: 0.9 }}
//         animate={{ opacity: 1, scale: 1 }}
//         transition={{ duration: 0.3 }}
//     >
//         <div className="flex justify-between items-center mb-4">
//             <h2 className="text-2xl font-bold">{category.name}</h2>
//             <div>
//                 <motion.button
//                     className="bg-blue-500 text-white px-3 py-1 rounded-md mr-2"
//                     whileHover={{ scale: 1.05 }}
//                     whileTap={{ scale: 0.95 }}
//                     onClick={() => onEdit(category)}
//                 >
//                     <Edit size={16} />
//                 </motion.button>
//                 <motion.button
//                     className="bg-red-500 text-white px-3 py-1 rounded-md"
//                     whileHover={{ scale: 1.05 }}
//                     whileTap={{ scale: 0.95 }}
//                     onClick={() => onDelete(category)}
//                 >
//                     <Trash2 size={16} />
//                 </motion.button>
//             </div>
//         </div>
//         <p className="mb-2"><strong>Description:</strong> {category.description}</p>
//         <p className="mb-2"><strong>Slug:</strong> {category.slug}</p>
//         <p className="mb-4">
//             <strong>Created:</strong> {new Date(category.createdAt).toLocaleDateString()} |
//             <strong>Updated:</strong> {new Date(category.updatedAt).toLocaleDateString()}
//         </p>
//         <h3 className="text-xl font-semibold mb-2">Subcategories</h3>
//         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-4">
//             {category.subCategories.map((sub) => (
//                 <motion.div
//                     key={sub.id}
//                     className="bg-gray-100 p-3 rounded-md"
//                     whileHover={{ scale: 1.05 }}
//                 >
//                     <h4 className="font-semibold">{sub.name}</h4>
//                     <p>Items: {sub.itemCount}</p>
//                     <button className="mt-2 text-blue-500">View</button>
//                 </motion.div>
//             ))}
//         </div>
//         <motion.button
//             className="bg-green-500 text-white px-4 py-2 rounded-md flex items-center"
//             whileHover={{ scale: 1.05 }}
//             whileTap={{ scale: 0.95 }}
//             onClick={onAddSubcategory}
//         >
//             <PlusCircle className="mr-2" size={20} />
//             Add Subcategory
//         </motion.button>
//         <motion.button
//             className="mt-4 text-gray-500 flex items-center"
//             whileHover={{ scale: 1.05 }}
//             whileTap={{ scale: 0.95 }}
//             onClick={onClose}
//         >
//             <ArrowLeft className="mr-2" size={20} />
//             Back to Categories
//         </motion.button>
//     </motion.div>
// );
//
// // Main App component
// const App = () => {
//     const [categories, setCategories] = useState([]);
//     const [selectedCategory, setSelectedCategory] = useState(null);
//     const [isAddModalOpen, setIsAddModalOpen] = useState(false);
//     const [isEditModalOpen, setIsEditModalOpen] = useState(false);
//     const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
//
//     useEffect(() => {
//         fetchCategories();
//     }, []);
//
//     const fetchCategories = async () => {
//         try {
//             const response = await axios.get('http://localhost:8000/categories/');
//             setCategories(response.data);
//         } catch (error) {
//             console.error('Error fetching categories:', error);
//         }
//     };
//
//     const handleAddCategory = async (data) => {
//         try {
//             const response = await axios.post('http://localhost:8000/categories/', data);
//             setCategories([...categories, response.data]);
//             setIsAddModalOpen(false);
//         } catch (error) {
//             console.error('Error adding category:', error);
//         }
//     };
//
//     const handleEditCategory = async (data) => {
//         try {
//             const response = await axios.put(`http://localhost:8000/categories/${data.id}/`, data);
//             setCategories(categories.map(cat => cat.id === data.id ? response.data : cat));
//             setIsEditModalOpen(false);
//         } catch (error) {
//             console.error('Error updating category:', error);
//         }
//     };
//
//     const handleDeleteCategory = async (id) => {
//         try {
//             await axios.delete(`http://localhost:8000/categories/${id}/`);
//             setCategories(categories.filter(cat => cat.id !== id));
//             setIsDeleteModalOpen(false);
//         } catch (error) {
//             console.error('Error deleting category:', error);
//         }
//     };
//
//     return (
//         <div className="flex min-h-screen bg-gray-100">
//             <Sidebar activeSection="Categories" />
//             <main className="flex-1 p-6">
//                 <h1 className="text-3xl font-bold mb-6">Category Management</h1>
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
//                     <CategoryStats
//                         totalCategories={categories.length}
//                         mainCategories={categories.filter(c => !c.parent).length}
//                         subCategories={categories.filter(c => c.parent).length}
//                     />
//                     <QuickActions onAddCategory={() => setIsAddModalOpen(true)} />
//                 </div>
//                 {selectedCategory ? (
//                     <CategoryDetails
//                         category={selectedCategory}
//                         onClose={() => setSelectedCategory(null)}
//                         onEdit={() => setIsEditModalOpen(true)}
//                         onDelete={() => setIsDeleteModalOpen(true)}
//                         onAddSubcategory={() => setIsAddModalOpen(true)}
//                     />
//                 ) : (
//                     <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
//                         {categories.map(category => (
//                             <CategoryCard
//                                 key={category.id}
//                                 category={category}
//                                 onSelect={setSelectedCategory}
//                                 onEdit={() => setIsEditModalOpen(true)}
//                                 onDelete={() => setIsDeleteModalOpen(true)}
//                             />
//                         ))}
//                         <motion.div
//                             className="bg-gray-200 p-4 rounded-lg shadow-md flex items-center justify-center cursor-pointer"
//                             whileHover={{ scale: 1.05 }}
//                             whileTap={{ scale: 0.95 }}
//                             onClick={() => setIsAddModalOpen(true)}
//                         >
//                             <PlusCircle size={40} className="text-gray-500" />
//                         </motion.div>
//                     </div>
//                 )}
//             </main>
//             {/* Add modals for Add, Edit, and Delete operations here */}
//         </div>
//     );
// };
//
// export default App;
// // //<editor-fold desc="layout 1">
// // import React, { useState, useEffect } from 'react';
// // import { motion } from 'framer-motion';
// // import { useForm } from 'react-hook-form';
// // import axios from 'axios';
// //
// // // Importing icons from lucide-react
// // import { PlusCircle, Edit, Trash2, ChevronRight, ChevronDown } from 'lucide-react';
// //
// // // Main App Component
// // const App = () => {
// //     const [categories, setCategories] = useState([]);
// //     const [selectedCategory, setSelectedCategory] = useState(null);
// //     const [isAddModalOpen, setIsAddModalOpen] = useState(false);
// //     const [isEditModalOpen, setIsEditModalOpen] = useState(false);
// //     const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
// //
// //     // Fetch categories on component mount
// //     useEffect(() => {
// //         fetchCategories();
// //     }, []);
// //
// //     const fetchCategories = async () => {
// //         try {
// //             const response = await axios.get('http://localhost:8000/categories/');
// //             setCategories(response.data);
// //         } catch (error) {
// //             console.error('Error fetching categories:', error);
// //         }
// //     };
// //
// //     const handleAddCategory = async (data) => {
// //         try {
// //             const response = await axios.post('http://localhost:8000/categories/', data);
// //             setCategories([...categories, response.data]);
// //             setIsAddModalOpen(false);
// //         } catch (error) {
// //             console.error('Error adding category:', error);
// //             // TODO: Show error message to user
// //         }
// //     };
// //
// //     const handleEditCategory = async (data) => {
// //         try {
// //             const response = await axios.put(`http://localhost:8000/categories/${selectedCategory.id}/`, data);
// //             setCategories(categories.map(cat => cat.id === selectedCategory.id ? response.data : cat));
// //             setIsEditModalOpen(false);
// //         } catch (error) {
// //             console.error('Error updating category:', error);
// //             // TODO: Show error message to user
// //         }
// //     };
// //
// //     const handleDeleteCategory = async (id) => {
// //         try {
// //             await axios.delete(`http://localhost:8000/categories/${id}/`);
// //             setCategories(categories.filter(cat => cat.id !== id));
// //             setIsDeleteModalOpen(false);
// //         } catch (error) {
// //             console.error('Error deleting category:', error);
// //             // TODO: Show error message to user
// //         }
// //     };
// //     // Render the main layout
// //     return (
// //         <div className="min-h-screen bg-gray-100">
// //             <Header />
// //             <div className="container mx-auto px-4 py-8">
// //                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
// //                     <CategoryList
// //                         categories={categories}
// //                         onAddCategory={() => setIsAddModalOpen(true)}
// //                         onEditCategory={(category) => {
// //                             setSelectedCategory(category);
// //                             setIsEditModalOpen(true);
// //                         }}
// //                         onDeleteCategory={(category) => {
// //                             setSelectedCategory(category);
// //                             setIsDeleteModalOpen(true);
// //                         }}
// //                     />
// //                     <CategoryDetails category={selectedCategory} />
// //                 </div>
// //             </div>
// //             {isAddModalOpen && (
// //                 <CategoryModal
// //                     mode="add"
// //                     onClose={() => setIsAddModalOpen(false)}
// //                     onSubmit={handleAddCategory}
// //                 />
// //             )}
// //             {isEditModalOpen && (
// //                 <CategoryModal
// //                     mode="edit"
// //                     category={selectedCategory}
// //                     onClose={() => setIsEditModalOpen(false)}
// //                     onSubmit={handleEditCategory}
// //                 />
// //             )}
// //             {isDeleteModalOpen && (
// //                 <DeleteConfirmationModal
// //                     category={selectedCategory}
// //                     onClose={() => setIsDeleteModalOpen(false)}
// //                     onConfirm={handleDeleteCategory}
// //                 />
// //             )}
// //         </div>
// //     );
// // };
// //
// // // Header Component
// // const Header = () => (
// //     <header className="bg-white shadow">
// //         <div className="container mx-auto px-4 py-6">
// //             <h1 className="text-3xl font-bold text-gray-800">Category Management</h1>
// //         </div>
// //     </header>
// // );
// //
// // // Category List Component
// // const CategoryList = ({ categories, onAddCategory, onEditCategory, onDeleteCategory }) => (
// //     <motion.div
// //         className="bg-white shadow rounded-lg p-6"
// //         initial={{ opacity: 0, y: 20 }}
// //         animate={{ opacity: 1, y: 0 }}
// //         transition={{ duration: 0.5 }}
// //     >
// //         <div className="flex justify-between items-center mb-4">
// //             <h2 className="text-xl font-semibold">Categories</h2>
// //             <button
// //                 onClick={onAddCategory}
// //                 className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center"
// //             >
// //                 <PlusCircle className="mr-2" size={20} />
// //                 Add Category
// //             </button>
// //         </div>
// //         <ul className="space-y-2">
// //             {categories.map((category) => (
// //                 <CategoryItem
// //                     key={category.id}
// //                     category={category}
// //                     onEdit={onEditCategory}
// //                     onDelete={onDeleteCategory}
// //                 />
// //             ))}
// //         </ul>
// //     </motion.div>
// // );
// //
// // // Individual Category Item Component
// // const CategoryItem = ({ category, onEdit, onDelete }) => {
// //     const [isExpanded, setIsExpanded] = useState(false);
// //
// //     return (
// //         <li className="border-b last:border-b-0 py-2">
// //             <div className="flex items-center justify-between">
// //                 <div className="flex items-center">
// //                     {category.children && category.children.length > 0 && (
// //                         <button
// //                             onClick={() => setIsExpanded(!isExpanded)}
// //                             className="mr-2 focus:outline-none"
// //                         >
// //                             {isExpanded ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
// //                         </button>
// //                     )}
// //                     <span>{category.name}</span>
// //                 </div>
// //                 <div>
// //                     <button
// //                         onClick={() => onEdit(category)}
// //                         className="text-blue-500 hover:text-blue-700 mr-2"
// //                     >
// //                         <Edit size={20} />
// //                     </button>
// //                     <button
// //                         onClick={() => onDelete(category)}
// //                         className="text-red-500 hover:text-red-700"
// //                     >
// //                         <Trash2 size={20} />
// //                     </button>
// //                 </div>
// //             </div>
// //             {isExpanded && category.children && (
// //                 <ul className="ml-6 mt-2 space-y-2">
// //                     {category.children.map((child) => (
// //                         <CategoryItem
// //                             key={child.id}
// //                             category={child}
// //                             onEdit={onEdit}
// //                             onDelete={onDelete}
// //                         />
// //                     ))}
// //                 </ul>
// //             )}
// //         </li>
// //     );
// // };
// //
// // // Category Details Component
// // const CategoryDetails = ({ category }) => (
// //     <motion.div
// //         className="bg-white shadow rounded-lg p-6 col-span-2"
// //         initial={{ opacity: 0, x: 20 }}
// //         animate={{ opacity: 1, x: 0 }}
// //         transition={{ duration: 0.5 }}
// //     >
// //         <h2 className="text-xl font-semibold mb-4">Category Details</h2>
// //         {category ? (
// //             <div>
// //                 <p><strong>Name:</strong> {category.name}</p>
// //                 <p><strong>Slug:</strong> {category.slug}</p>
// //                 <p><strong>Description:</strong> {category.description}</p>
// //                 <p><strong>Active:</strong> {category.is_active ? 'Yes' : 'No'}</p>
// //                 <p><strong>Created:</strong> {new Date(category.created_at).toLocaleString()}</p>
// //                 <p><strong>Updated:</strong> {new Date(category.updated_at).toLocaleString()}</p>
// //             </div>
// //         ) : (
// //             <p>Select a category to view details</p>
// //         )}
// //     </motion.div>
// // );
// //
// // // Category Modal Component (for Add and Edit)
// // const CategoryModal = ({ mode, category, onClose, onSubmit }) => {
// //     const { register, handleSubmit, formState: { errors } } = useForm({
// //         defaultValues: category || {}
// //     });
// //
// //     return (
// //         <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
// //             <motion.div
// //                 className="bg-white rounded-lg p-6 w-full max-w-md"
// //                 initial={{ opacity: 0, scale: 0.8 }}
// //                 animate={{ opacity: 1, scale: 1 }}
// //                 transition={{ duration: 0.3 }}
// //             >
// //                 <h2 className="text-2xl font-semibold mb-4">
// //                     {mode === 'add' ? 'Add Category' : 'Edit Category'}
// //                 </h2>
// //                 <form onSubmit={handleSubmit(onSubmit)}>
// //                     <div className="mb-4">
// //                         <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
// //                             Name
// //                         </label>
// //                         <input
// //                             {...register('name', { required: 'Name is required' })}
// //                             className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
// //                             id="name"
// //                             type="text"
// //                             placeholder="Category Name"
// //                         />
// //                         {errors.name && <p className="text-red-500 text-xs italic">{errors.name.message}</p>}
// //                     </div>
// //                     <div className="mb-4">
// //                         <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
// //                             Description
// //                         </label>
// //                         <textarea
// //                             {...register('description')}
// //                             className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
// //                             id="description"
// //                             placeholder="Category Description"
// //                         />
// //                     </div>
// //                     <div className="mb-4">
// //                         <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="parent">
// //                             Parent Category
// //                         </label>
// //                         <select
// //                             {...register('parent')}
// //                             className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
// //                             id="parent"
// //                         >
// //                             <option value="">Select Parent Category</option>
// //                             {/* Add options for parent categories here */}
// //                         </select>
// //                     </div>
// //                     <div className="flex items-center justify-between">
// //                         <button
// //                             className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
// //                             type="submit"
// //                         >
// //                             {mode === 'add' ? 'Add' : 'Update'}
// //                         </button>
// //                         <button
// //                             className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
// //                             type="button"
// //                             onClick={onClose}
// //                         >
// //                             Cancel
// //                         </button>
// //                     </div>
// //                 </form>
// //             </motion.div>
// //         </div>
// //     );
// // };
// //
// // // Delete Confirmation Modal
// // const DeleteConfirmationModal = ({ category, onClose, onConfirm }) => (
// //     <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
// //         <motion.div
// //             className="bg-white rounded-lg p-6 w-full max-w-md"
// //             initial={{ opacity: 0, scale: 0.8 }}
// //             animate={{ opacity: 1, scale: 1 }}
// //             transition={{ duration: 0.3 }}
// //         >
// //             <h2 className="text-2xl font-semibold mb-4">Delete Category</h2>
// //             <p>Are you sure you want to delete the category "{category.name}"?</p>
// //             <div className="flex justify-end mt-6">
// //                 <button
// //                     className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mr-2"
// //                     onClick={() => onConfirm(category.id)}
// //                 >
// //                     Delete
// //                 </button>
// //                 <button
// //                     className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
// //                     onClick={onClose}
// //                 >
// //                     Cancel
// //                 </button>
// //             </div>
// //         </motion.div>
// //     </div>
// // );
// //
// // export default App;
// // //</editor-fold>
// //
