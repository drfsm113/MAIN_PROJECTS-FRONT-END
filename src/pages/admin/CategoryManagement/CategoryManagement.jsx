// import React, { useState, useEffect, useMemo } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import { FiChevronRight, FiImage, FiPlus, FiEdit, FiTrash2, FiUpload, FiSearch, FiFilter } from 'react-icons/fi';

// const CategoryItem = ({ category, level = 0, onEdit, onDelete }) => {
//     const [isOpen, setIsOpen] = useState(false);

//     const toggleOpen = () => setIsOpen(!isOpen);

//     return (
//         <div className="border-b border-gray-200 last:border-b-0">
//             <div
//                 className={`flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 ${level > 0 ? 'pl-' + (level * 8) : ''}`}
//                 onClick={toggleOpen}
//             >
//                 <div className="flex items-center space-x-4">
//                     {category.children && category.children.length > 0 && (
//                         <motion.div
//                             initial={false}
//                             animate={{ rotate: isOpen ? 90 : 0 }}
//                         >
//                             <FiChevronRight />
//                         </motion.div>
//                     )}
//                     {category.image ? (
//                         <img src={category.image} alt={category.name} className="w-10 h-10 rounded-full object-cover" />
//                     ) : (
//                         <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
//                             <FiImage className="text-gray-400" />
//                         </div>
//                     )}
//                     <span className="font-medium">{category.name}</span>
//                 </div>
//                 <div className="flex items-center space-x-2">
//           <span className={`px-2 py-1 rounded-full text-xs ${category.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
//             {category.is_active ? 'Active' : 'Inactive'}
//           </span>
//                     <button onClick={(e) => { e.stopPropagation(); onEdit(category); }} className="p-1 text-blue-500 hover:text-blue-700">
//                         <FiEdit />
//                     </button>
//                     <button onClick={(e) => { e.stopPropagation(); onDelete(category); }} className="p-1 text-red-500 hover:text-red-700">
//                         <FiTrash2 />
//                     </button>
//                 </div>
//             </div>
//             <AnimatePresence>
//                 {isOpen && category.children && category.children.length > 0 && (
//                     <motion.div
//                         initial={{ opacity: 0, height: 0 }}
//                         animate={{ opacity: 1, height: 'auto' }}
//                         exit={{ opacity: 0, height: 0 }}
//                         transition={{ duration: 0.3 }}
//                     >
//                         {category.children.map(child => (
//                             <CategoryItem
//                                 key={child.id}
//                                 category={child}
//                                 level={level + 1}
//                                 onEdit={onEdit}
//                                 onDelete={onDelete}
//                             />
//                         ))}
//                     </motion.div>
//                 )}
//             </AnimatePresence>
//         </div>
//     );
// };

// const CategoryList = () => {
//     const [categories, setCategories] = useState([]);
//     const [isModalOpen, setIsModalOpen] = useState(false);
//     const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
//     const [categoryToDelete, setCategoryToDelete] = useState(null);
//     const [editingCategory, setEditingCategory] = useState(null);
//     const [categoryForm, setCategoryForm] = useState({
//         name: '',
//         description: '',
//         is_active: true,
//         image: null,
//         parent: null
//     });
//     const [previewImage, setPreviewImage] = useState(null);
//     const [searchTerm, setSearchTerm] = useState('');
//     const [statusFilter, setStatusFilter] = useState('all');

//     useEffect(() => {
//         fetchCategories();
//     }, []);

//     const fetchCategories = async () => {
//         try {
//             const response = await fetch('http://127.0.0.1:8000/categories/root_categories/');
//             const data = await response.json();
//             setCategories(data);
//         } catch (error) {
//             console.error('Error fetching categories:', error);
//         }
//     };

//     const handleInputChange = (e) => {
//         const { name, value, type, checked, files } = e.target;
//         if (type === 'file') {
//             setCategoryForm(prev => ({ ...prev, [name]: files[0] }));
//             setPreviewImage(URL.createObjectURL(files[0]));
//         } else {
//             setCategoryForm(prev => ({
//                 ...prev,
//                 [name]: type === 'checkbox' ? checked : value
//             }));
//         }
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         const formData = new FormData();
//         formData.append('name', categoryForm.name);
//         formData.append('description', categoryForm.description);
//         formData.append('is_active', categoryForm.is_active);
//         if (categoryForm.parent) {
//             formData.append('parent', categoryForm.parent);
//         }
//         if (categoryForm.image instanceof File) {
//             formData.append('image', categoryForm.image);
//         } else if (editingCategory && !categoryForm.image) {
//             formData.append('image', '');
//         }

//         try {
//             const url = editingCategory
//                 ? `http://127.0.0.1:8000/categories/${editingCategory.id}/`
//                 : 'http://127.0.0.1:8000/categories/';
//             const method = editingCategory ? 'PUT' : 'POST';
//             const response = await fetch(url, {
//                 method: method,
//                 body: formData,
//             });
//             if (response.ok) {
//                 fetchCategories();
//                 setIsModalOpen(false);
//                 resetForm();
//             } else {
//                 console.error('Failed to add/update category');
//             }
//         } catch (error) {
//             console.error('Error adding/updating category:', error);
//         }
//     };

//     const handleEdit = (category) => {
//         setEditingCategory(category);
//         setCategoryForm({
//             name: category.name,
//             description: category.description,
//             is_active: category.is_active,
//             image: category.image,
//             parent: category.parent
//         });
//         setPreviewImage(category.image);
//         setIsModalOpen(true);
//     };

//     const handleDelete = (category) => {
//         setCategoryToDelete(category);
//         setIsDeleteModalOpen(true);
//     };

//     const confirmDelete = async () => {
//         try {
//             const response = await fetch(`http://127.0.0.1:8000/categories/${categoryToDelete.id}/`, {
//                 method: 'DELETE',
//             });
//             if (response.ok) {
//                 fetchCategories();
//                 setIsDeleteModalOpen(false);
//                 setCategoryToDelete(null);
//             } else {
//                 console.error('Failed to delete category');
//             }
//         } catch (error) {
//             console.error('Error deleting category:', error);
//         }
//     };

//     const resetForm = () => {
//         setCategoryForm({ name: '', description: '', is_active: true, image: null, parent: null });
//         setEditingCategory(null);
//         setPreviewImage(null);
//     };

//     const filterCategories = (categories, searchTerm, statusFilter) => {
//         return categories.filter(category => {
//             const matchesSearch = category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//                 category.description.toLowerCase().includes(searchTerm.toLowerCase());
//             const matchesStatus = statusFilter === 'all' ||
//                 (statusFilter === 'active' && category.is_active) ||
//                 (statusFilter === 'inactive' && !category.is_active);

//             if (matchesSearch && matchesStatus) {
//                 if (category.children && category.children.length > 0) {
//                     category.children = filterCategories(category.children, searchTerm, statusFilter);
//                 }
//                 return true;
//             }

//             return false;
//         });
//     };

//     const filteredCategories = useMemo(() => {
//         return filterCategories(categories, searchTerm, statusFilter);
//     }, [categories, searchTerm, statusFilter]);

//     return (
//         <div className="container mx-auto p-4 bg-gray-100 min-h-screen">
//             <div className="flex justify-between items-center mb-6">
//                 <h1 className="text-3xl font-bold text-gray-800">Categories</h1>
//                 <button
//                     onClick={() => {
//                         resetForm();
//                         setIsModalOpen(true);
//                     }}
//                     className="flex items-center px-4 py-2 bg-green-500 text-white rounded-md transition duration-300 ease-in-out hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
//                 >
//                     <FiPlus className="mr-2" /> Add Category
//                 </button>
//             </div>

//             <div className="mb-6 flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
//                 <div className="relative flex-grow">
//                     <input
//                         type="text"
//                         placeholder="Search categories..."
//                         value={searchTerm}
//                         onChange={(e) => setSearchTerm(e.target.value)}
//                         className="w-full pl-10 pr-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500"
//                     />
//                     <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
//                 </div>
//                 <div className="relative">
//                     <select
//                         value={statusFilter}
//                         onChange={(e) => setStatusFilter(e.target.value)}
//                         className="w-full sm:w-40 pl-10 pr-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
//                     >
//                         <option value="all">All Status</option>
//                         <option value="active">Active</option>
//                         <option value="inactive">Inactive</option>
//                     </select>
//                     <FiFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
//                 </div>
//             </div>

//             <div className="bg-white rounded-xl shadow-lg overflow-hidden">
//                 {filteredCategories.map(category => (
//                     <CategoryItem
//                         key={category.id}
//                         category={category}
//                         onEdit={handleEdit}
//                         onDelete={handleDelete}
//                     />
//                 ))}
//             </div>

//             <AnimatePresence>
//                 {isModalOpen && (
//                     <motion.div
//                         className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4"
//                         initial={{ opacity: 0 }}
//                         animate={{ opacity: 1 }}
//                         exit={{ opacity: 0 }}
//                     >
//                         <motion.div
//                             className="bg-white rounded-lg p-8 w-full max-w-md"
//                             initial={{ scale: 0.9, opacity: 0 }}
//                             animate={{ scale: 1, opacity: 1 }}
//                             exit={{ scale: 0.9, opacity: 0 }}
//                         >
//                             <h2 className="text-2xl font-bold mb-4">
//                                 {editingCategory ? 'Edit Category' : 'Add New Category'}
//                             </h2>
//                             <form onSubmit={handleSubmit}>
//                                 <div className="mb-4">
//                                     <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
//                                         Name
//                                     </label>
//                                     <input
//                                         type="text"
//                                         id="name"
//                                         name="name"
//                                         value={categoryForm.name}
//                                         onChange={handleInputChange}
//                                         className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//                                         required
//                                     />
//                                 </div>
//                                 <div className="mb-4">
//                                     <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
//                                         Description
//                                     </label>
//                                     <textarea
//                                         id="description"
//                                         name="description"
//                                         value={categoryForm.description}
//                                         onChange={handleInputChange}
//                                         className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//                                         rows="3"
//                                     />
//                                 </div>
//                                 <div className="mb-4">
//                                     <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="parent">
//                                         Parent Category
//                                     </label>
//                                     <select
//                                         id="parent"
//                                         name="parent"
//                                         value={categoryForm.parent || ''}
//                                         onChange={handleInputChange}
//                                         className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//                                     >
//                                         <option value="">None (Top Level Category)</option>
//                                         {categories.map(category => (
//                                             <option key={category.id} value={category.id}>{category.name}</option>
//                                         ))}
//                                     </select>
//                                 </div>
//                                 <div className="mb-4">
//                                     <label className="flex items-center">
//                                         <input
//                                             type="checkbox"
//                                             name="is_active"
//                                             checked={categoryForm.is_active}
//                                             onChange={handleInputChange}
//                                             className="mr-2"
//                                         />
//                                         <span className="text-gray-700 text-sm font-bold">Active</span>
//                                     </label>
//                                 </div>
//                                 <div className="mb-4">
//                                     <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="image">
//                                         Image
//                                     </label>
//                                     <div className="flex items-center justify-center w-full">
//                                         <label
//                                             htmlFor="image"
//                                             className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
//                                         >
//                                             {previewImage ? (
//                                                 <img src={previewImage} alt="Preview" className="w-full h-full object-cover rounded-lg" />
//                                             ) : (
//                                                 <div className="flex flex-col items-center justify-center pt-5 pb-6">
//                                                     <FiUpload className="w-10 h-10 mb-3 text-gray-400" />
//                                                     <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Click to upload</span> or drag and drop</p>
//                                                     <p className="text-xs text-gray-500">PNG, JPG or GIF (MAX. 800x400px)</p>
//                                                 </div>
//                                             )}
//                                             <input
//                                                 id="image"
//                                                 type="file"
//                                                 name="image"
//                                                 className="hidden"
//                                                 onChange={handleInputChange}
//                                                 accept="image/*"
//                                             />
//                                         </label>
//                                     </div>
//                                 </div>
//                                 <div className="flex justify-end">
//                                     <button
//                                         type="button"
//                                         onClick={() => {
//                                             setIsModalOpen(false);
//                                             resetForm();
//                                         }}
//                                         className="mr-2 px-4 py-2 text-gray-600 bg-gray-200 rounded hover:bg-gray-300 focus:outline-none focus:shadow-outline"
//                                     >
//                                         Cancel
//                                     </button>
//                                     <button
//                                         type="submit"
//                                         className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:shadow-outline"
//                                     >
//                                         {editingCategory ? 'Update' : 'Add'} Category
//                                     </button>
//                                 </div>
//                             </form>
//                         </motion.div>
//                     </motion.div>
//                 )}

//                 {isDeleteModalOpen && (
//                     <motion.div
//                         className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4"
//                         initial={{ opacity: 0 }}
//                         animate={{ opacity: 1 }}
//                         exit={{ opacity: 0 }}
//                     >
//                         <motion.div
//                             className="bg-white rounded-lg p-8 w-full max-w-md"
//                             initial={{ scale: 0.9, opacity: 0 }}
//                             animate={{ scale: 1, opacity: 1 }}
//                             exit={{ scale: 0.9, opacity: 0 }}
//                         >
//                             <h2 className="text-2xl font-bold mb-4">Confirm Deletion</h2>
//                             <p className="mb-4">Are you sure you want to delete the category "{categoryToDelete?.name}"?</p>
//                             <div className="flex justify-end">
//                                 <button
//                                     onClick={() => setIsDeleteModalOpen(false)}
//                                     className="mr-2 px-4 py-2 text-gray-600 bg-gray-200 rounded hover:bg-gray-300 focus:outline-none focus:shadow-outline"
//                                 >
//                                     Cancel
//                                 </button>
//                                 <button
//                                     onClick={confirmDelete}
//                                     className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 focus:outline-none focus:shadow-outline"
//                                 >
//                                     Delete
//                                 </button>
//                             </div>
//                         </motion.div>
//                     </motion.div>
//                 )}
//             </AnimatePresence>
//         </div>
//     );
// };

// export default CategoryList;
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronRight, FiChevronDown, FiImage, FiPlus, FiEdit, FiTrash2, FiUpload } from 'react-icons/fi';

const CategoryItem = ({ category, level = 0, onEdit, onDelete }) => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleOpen = () => setIsOpen(!isOpen);

    return (
        <div className="border-b border-gray-200 last:border-b-0">
            <div
                className={`flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 ${level > 0 ? 'pl-' + (level * 8) : ''}`}
                onClick={toggleOpen}
            >
                <div className="flex items-center space-x-4">
                    {category.children && category.children.length > 0 && (
                        <motion.div
                            initial={false}
                            animate={{ rotate: isOpen ? 90 : 0 }}
                        >
                            <FiChevronRight />
                        </motion.div>
                    )}
                    {category.image ? (
                        <img src={category.image} alt={category.name} className="w-10 h-10 rounded-full object-cover" />
                    ) : (
                        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                            <FiImage className="text-gray-400" />
                        </div>
                    )}
                    <span className="font-medium">{category.name}</span>
                </div>
                <div className="flex items-center space-x-2">
                    <button onClick={(e) => { e.stopPropagation(); onEdit(category); }} className="p-1 text-blue-500 hover:text-blue-700">
                        <FiEdit />
                    </button>
                    <button onClick={(e) => { e.stopPropagation(); onDelete(category); }} className="p-1 text-red-500 hover:text-red-700">
                        <FiTrash2 />
                    </button>
                </div>
            </div>
            <AnimatePresence>
                {isOpen && category.children && category.children.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        {category.children.map(child => (
                            <CategoryItem
                                key={child.id}
                                category={child}
                                level={level + 1}
                                onEdit={onEdit}
                                onDelete={onDelete}
                            />
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const CategoryList = () => {
    const [categories, setCategories] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [categoryToDelete, setCategoryToDelete] = useState(null);
    const [editingCategory, setEditingCategory] = useState(null);
    const [categoryForm, setCategoryForm] = useState({
        name: '',
        description: '',
        is_active: true,
        image: null,
        parent: null
    });
    const [previewImage, setPreviewImage] = useState(null);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await fetch('http://127.0.0.1:8000/categories/root_categories/');
            const data = await response.json();
            setCategories(data);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked, files } = e.target;
        if (type === 'file') {
            setCategoryForm(prev => ({ ...prev, [name]: files[0] }));
            setPreviewImage(URL.createObjectURL(files[0]));
        } else {
            setCategoryForm(prev => ({
                ...prev,
                [name]: type === 'checkbox' ? checked : value
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('name', categoryForm.name);
        formData.append('description', categoryForm.description);
        formData.append('is_active', categoryForm.is_active);
        if (categoryForm.parent) {
            formData.append('parent', categoryForm.parent);
        }
        if (categoryForm.image instanceof File) {
            formData.append('image', categoryForm.image);
        } else if (editingCategory && !categoryForm.image) {
            formData.append('image', '');
        }

        try {
            const url = editingCategory
                ? `http://127.0.0.1:8000/categories/${editingCategory.id}/`
                : 'http://127.0.0.1:8000/categories/';
            const method = editingCategory ? 'PUT' : 'POST';
            const response = await fetch(url, {
                method: method,
                body: formData,
            });
            if (response.ok) {
                fetchCategories();
                setIsModalOpen(false);
                resetForm();
            } else {
                console.error('Failed to add/update category');
            }
        } catch (error) {
            console.error('Error adding/updating category:', error);
        }
    };

    const handleEdit = (category) => {
        setEditingCategory(category);
        setCategoryForm({
            name: category.name,
            description: category.description,
            is_active: category.is_active,
            image: category.image,
            parent: category.parent
        });
        setPreviewImage(category.image);
        setIsModalOpen(true);
    };

    const handleDelete = (category) => {
        setCategoryToDelete(category);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        try {
            const response = await fetch(`http://127.0.0.1:8000/categories/${categoryToDelete.id}/`, {
                method: 'DELETE',
            });
            if (response.ok) {
                fetchCategories();
                setIsDeleteModalOpen(false);
                setCategoryToDelete(null);
            } else {
                console.error('Failed to delete category');
            }
        } catch (error) {
            console.error('Error deleting category:', error);
        }
    };

    const resetForm = () => {
        setCategoryForm({ name: '', description: '', is_active: true, image: null, parent: null });
        setEditingCategory(null);
        setPreviewImage(null);
    };

    return (
        <div className="container mx-auto p-4 bg-gray-100 min-h-screen">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Categories</h1>
                <button
                    onClick={() => {
                        resetForm();
                        setIsModalOpen(true);
                    }}
                    className="flex items-center px-4 py-2 bg-green-500 text-white rounded-md transition duration-300 ease-in-out hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
                >
                    <FiPlus className="mr-2" /> Add Category
                </button>
            </div>
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                {categories.map(category => (
                    <CategoryItem
                        key={category.id}
                        category={category}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                    />
                ))}
            </div>

            <AnimatePresence>
                {isModalOpen && (
                    <motion.div
                        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <motion.div
                            className="bg-white rounded-lg p-8 w-full max-w-md"
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                        >
                            <h2 className="text-2xl font-bold mb-4">
                                {editingCategory ? 'Edit Category' : 'Add New Category'}
                            </h2>
                            <form onSubmit={handleSubmit}>
                                <div className="mb-4">
                                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                                        Name
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={categoryForm.name}
                                        onChange={handleInputChange}
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        required
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
                                        Description
                                    </label>
                                    <textarea
                                        id="description"
                                        name="description"
                                        value={categoryForm.description}
                                        onChange={handleInputChange}
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        rows="3"
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="parent">
                                        Parent Category
                                    </label>
                                    <select
                                        id="parent"
                                        name="parent"
                                        value={categoryForm.parent || ''}
                                        onChange={handleInputChange}
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    >
                                        <option value="">None (Top Level Category)</option>
                                        {categories.map(category => (
                                            <option key={category.id} value={category.id}>{category.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="mb-4">
                                    <label className="flex items-center">
                                        <input
                                            type="checkbox"
                                            name="is_active"
                                            checked={categoryForm.is_active}
                                            onChange={handleInputChange}
                                            className="mr-2"
                                        />
                                        <span className="text-gray-700 text-sm font-bold">Active</span>
                                    </label>
                                </div>
                                <div className="mb-4">
                                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="image">
                                        Image
                                    </label>
                                    <div className="flex items-center justify-center w-full">
                                        <label
                                            htmlFor="image"
                                            className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
                                        >
                                            {previewImage ? (
                                                <img src={previewImage} alt="Preview" className="w-full h-full object-cover rounded-lg" />
                                            ) : (
                                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                    <FiUpload className="w-10 h-10 mb-3 text-gray-400" />
                                                    <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                                                    <p className="text-xs text-gray-500">PNG, JPG or GIF (MAX. 800x400px)</p>
                                                </div>
                                            )}
                                            <input
                                                id="image"
                                                type="file"
                                                name="image"
                                                className="hidden"
                                                onChange={handleInputChange}
                                                accept="image/*"
                                            />
                                        </label>
                                    </div>
                                </div>
                                <div className="flex justify-end">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setIsModalOpen(false);
                                            resetForm();
                                        }}
                                        className="mr-2 px-4 py-2 text-gray-600 bg-gray-200 rounded hover:bg-gray-300 focus:outline-none focus:shadow-outline"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:shadow-outline"
                                    >
                                        {editingCategory ? 'Update' : 'Add'} Category
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}

                {isDeleteModalOpen && (
                    <motion.div
                        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <motion.div
                            className="bg-white rounded-lg p-8 w-full max-w-md"
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                        >
                            <h2 className="text-2xl font-bold mb-4">Confirm Deletion</h2>
                            <p className="mb-4">Are you sure you want to delete the category "{categoryToDelete?.name}"?</p>
                            <div className="flex justify-end">
                                <button
                                    onClick={() => setIsDeleteModalOpen(false)}
                                    className="mr-2 px-4 py-2 text-gray-600 bg-gray-200 rounded hover:bg-gray-300 focus:outline-none focus:shadow-outline"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={confirmDelete}
                                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 focus:outline-none focus:shadow-outline"
                                >
                                    Delete
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default CategoryList
// // import React, { useState, useEffect } from 'react';
// // import { motion, AnimatePresence } from 'framer-motion';
// // import { FiChevronLeft, FiChevronRight, FiImage, FiCheck, FiX, FiPlus, FiUpload, FiEdit, FiTrash2 } from 'react-icons/fi';
// //
// // const CategoryList = () => {
// //     const [categories, setCategories] = useState([]);
// //     const [currentPage, setCurrentPage] = useState(1);
// //     const [totalPages, setTotalPages] = useState(1);
// //     const [isModalOpen, setIsModalOpen] = useState(false);
// //     const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
// //     const [categoryToDelete, setCategoryToDelete] = useState(null);
// //     const [editingCategory, setEditingCategory] = useState(null);
// //     const [categoryForm, setCategoryForm] = useState({
// //         name: '',
// //         description: '',
// //         is_active: true,
// //         image: null
// //     });
// //     const [previewImage, setPreviewImage] = useState(null);
// //
// //     useEffect(() => {
// //         fetchCategories(currentPage);
// //     }, [currentPage]);
// //
// //     const fetchCategories = async (page) => {
// //         try {
// //             const response = await fetch(`http://localhost:8000/categories/?page=${page}`);
// //             const data = await response.json();
// //             setCategories(data.results);
// //             setTotalPages(Math.ceil(data.count / data.results.length));
// //         } catch (error) {
// //             console.error('Error fetching categories:', error);
// //         }
// //     };
// //
// //     const handlePrevPage = () => {
// //         if (currentPage > 1) {
// //             setCurrentPage(currentPage - 1);
// //         }
// //     };
// //
// //     const handleNextPage = () => {
// //         if (currentPage < totalPages) {
// //             setCurrentPage(currentPage + 1);
// //         }
// //     };
// //
// //     const handleInputChange = (e) => {
// //         const { name, value, type, checked, files } = e.target;
// //         if (type === 'file') {
// //             setCategoryForm(prev => ({ ...prev, [name]: files[0] }));
// //             setPreviewImage(URL.createObjectURL(files[0]));
// //         } else {
// //             setCategoryForm(prev => ({
// //                 ...prev,
// //                 [name]: type === 'checkbox' ? checked : value
// //             }));
// //         }
// //     };
// //
// //     const handleSubmit = async (e) => {
// //         e.preventDefault();
// //         const formData = new FormData();
// //         formData.append('name', categoryForm.name);
// //         formData.append('description', categoryForm.description);
// //         formData.append('is_active', categoryForm.is_active);
// //
// //         if (categoryForm.image instanceof File) {
// //             formData.append('image', categoryForm.image);
// //         } else if (editingCategory && !categoryForm.image) {
// //             formData.append('image', '');  // Send empty string to remove existing image
// //         }
// //
// //         try {
// //             const url = editingCategory
// //                 ? `http://localhost:8000/categories/${editingCategory.id}/`
// //                 : 'http://localhost:8000/categories/';
// //             const method = editingCategory ? 'PUT' : 'POST';
// //             const response = await fetch(url, {
// //                 method: method,
// //                 body: formData,
// //             });
// //             if (response.ok) {
// //                 fetchCategories(currentPage);
// //                 setIsModalOpen(false);
// //                 resetForm();
// //             } else {
// //                 console.error('Failed to add/update category');
// //             }
// //         } catch (error) {
// //             console.error('Error adding/updating category:', error);
// //         }
// //     };
// //
// //     const handleEdit = (category) => {
// //         setEditingCategory(category);
// //         setCategoryForm({
// //             name: category.name,
// //             description: category.description,
// //             is_active: category.is_active,
// //             image: category.image
// //         });
// //         setPreviewImage(category.image);
// //         setIsModalOpen(true);
// //     };
// //
// //     const handleDelete = (category) => {
// //         setCategoryToDelete(category);
// //         setIsDeleteModalOpen(true);
// //     };
// //
// //     const confirmDelete = async () => {
// //         try {
// //             const response = await fetch(`http://localhost:8000/categories/${categoryToDelete.id}/`, {
// //                 method: 'DELETE',
// //             });
// //             if (response.ok) {
// //                 fetchCategories(currentPage);
// //                 setIsDeleteModalOpen(false);
// //                 setCategoryToDelete(null);
// //             } else {
// //                 console.error('Failed to delete category');
// //             }
// //         } catch (error) {
// //             console.error('Error deleting category:', error);
// //         }
// //     };
// //
// //     const resetForm = () => {
// //         setCategoryForm({ name: '', description: '', is_active: true, image: null });
// //         setEditingCategory(null);
// //         setPreviewImage(null);
// //     };
// //
// //     return (
// //         <div className="container mx-auto p-4 bg-gray-100 min-h-screen">
// //             <div className="flex justify-between items-center mb-6">
// //                 <h1 className="text-3xl font-bold text-gray-800">Categories</h1>
// //                 <button
// //                     onClick={() => {
// //                         resetForm();
// //                         setIsModalOpen(true);
// //                     }}
// //                     className="flex items-center px-4 py-2 bg-green-500 text-white rounded-md transition duration-300 ease-in-out hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
// //                 >
// //                     <FiPlus className="mr-2" /> Add Category
// //                 </button>
// //             </div>
// //             <div className="bg-white rounded-xl shadow-lg overflow-hidden">
// //                 <div className="overflow-x-auto">
// //                     <table className="w-full">
// //                         <thead>
// //                         <tr className="bg-gray-200 text-gray-700">
// //                             <th className="py-3 px-4 text-left">Image</th>
// //                             <th className="py-3 px-4 text-left">Name</th>
// //                             <th className="py-3 px-4 text-left">Description</th>
// //                             <th className="py-3 px-4 text-left">Active</th>
// //                             <th className="py-3 px-4 text-left">Actions</th>
// //                         </tr>
// //                         </thead>
// //                         <tbody>
// //                         {categories.map((category, index) => (
// //                             <motion.tr
// //                                 key={category.id}
// //                                 className="border-b border-gray-200 hover:bg-gray-50"
// //                                 initial={{ opacity: 0, y: 20 }}
// //                                 animate={{ opacity: 1, y: 0 }}
// //                                 transition={{ duration: 0.3, delay: index * 0.1 }}
// //                             >
// //                                 <td className="py-3 px-4">
// //                                     {category.image ? (
// //                                         <img
// //                                             src={category.image}
// //                                             alt={category.name}
// //                                             className="w-10 h-10 rounded-full object-cover"
// //                                         />
// //                                     ) : (
// //                                         <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
// //                                             <FiImage className="text-gray-400" />
// //                                         </div>
// //                                     )}
// //                                 </td>
// //                                 <td className="py-3 px-4 font-medium">{category.name}</td>
// //                                 <td className="py-3 px-4 text-sm text-gray-600">{category.description}</td>
// //                                 <td className="py-3 px-4">
// //                                     {category.is_active ? (
// //                                         <FiCheck className="text-green-500" />
// //                                     ) : (
// //                                         <FiX className="text-red-500" />
// //                                     )}
// //                                 </td>
// //                                 <td className="py-3 px-4">
// //                                     <button
// //                                         onClick={() => handleEdit(category)}
// //                                         className="text-blue-500 hover:text-blue-700 mr-2"
// //                                     >
// //                                         <FiEdit />
// //                                     </button>
// //                                     <button
// //                                         onClick={() => handleDelete(category)}
// //                                         className="text-red-500 hover:text-red-700"
// //                                     >
// //                                         <FiTrash2 />
// //                                     </button>
// //                                 </td>
// //                             </motion.tr>
// //                         ))}
// //                         </tbody>
// //                     </table>
// //                 </div>
// //             </div>
// //             <div className="flex justify-between items-center mt-6">
// //                 <button
// //                     onClick={handlePrevPage}
// //                     disabled={currentPage === 1}
// //                     className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-md disabled:bg-gray-300 transition duration-300 ease-in-out hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
// //                 >
// //                     <FiChevronLeft className="mr-2" /> Previous
// //                 </button>
// //                 <span className="text-gray-700 font-medium">
// //           Page {currentPage} of {totalPages}
// //         </span>
// //                 <button
// //                     onClick={handleNextPage}
// //                     disabled={currentPage === totalPages}
// //                     className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-md disabled:bg-gray-300 transition duration-300 ease-in-out hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
// //                 >
// //                     Next <FiChevronRight className="ml-2" />
// //                 </button>
// //             </div>
// //
// //             <AnimatePresence>
// //                 {isModalOpen && (
// //                     <motion.div
// //                         className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
// //                         initial={{ opacity: 0 }}
// //                         animate={{ opacity: 1 }}
// //                         exit={{ opacity: 0 }}
// //                     >
// //                         <motion.div
// //                             className="bg-white rounded-lg p-8 w-96"
// //                             initial={{ scale: 0.9, opacity: 0 }}
// //                             animate={{ scale: 1, opacity: 1 }}
// //                             exit={{ scale: 0.9, opacity: 0 }}
// //                         >
// //                             <h2 className="text-2xl font-bold mb-4">
// //                                 {editingCategory ? 'Edit Category' : 'Add New Category'}
// //                             </h2>
// //                             <form onSubmit={handleSubmit}>
// //                                 <div className="mb-4">
// //                                     <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
// //                                         Name
// //                                     </label>
// //                                     <input
// //                                         type="text"
// //                                         id="name"
// //                                         name="name"
// //                                         value={categoryForm.name}
// //                                         onChange={handleInputChange}
// //                                         className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
// //                                         required
// //                                     />
// //                                 </div>
// //                                 <div className="mb-4">
// //                                     <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
// //                                         Description
// //                                     </label>
// //                                     <textarea
// //                                         id="description"
// //                                         name="description"
// //                                         value={categoryForm.description}
// //                                         onChange={handleInputChange}
// //                                         className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
// //                                         rows="3"
// //                                     />
// //                                 </div>
// //                                 <div className="mb-4">
// //                                     <label className="flex items-center">
// //                                         <input
// //                                             type="checkbox"
// //                                             name="is_active"
// //                                             checked={categoryForm.is_active}
// //                                             onChange={handleInputChange}
// //                                             className="mr-2"
// //                                         />
// //                                         <span className="text-gray-700 text-sm font-bold">Active</span>
// //                                     </label>
// //                                 </div>
// //                                 <div className="mb-4">
// //                                     <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="image">
// //                                         Image
// //                                     </label>
// //                                     <div className="flex items-center justify-center w-full">
// //                                         <label
// //                                             htmlFor="image"
// //                                             className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
// //                                         >
// //                                             {previewImage ? (
// //                                                 <img src={previewImage} alt="Preview" className="w-full h-full object-cover rounded-lg" />
// //                                             ) : (
// //                                                 <div className="flex flex-col items-center justify-center pt-5 pb-6">
// //                                                     <FiUpload className="w-10 h-10 mb-3 text-gray-400" />
// //                                                     <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Click to upload</span> or drag and drop</p>
// //                                                     <p className="text-xs text-gray-500">PNG, JPG or GIF (MAX. 800x400px)</p>
// //                                                 </div>
// //                                             )}
// //                                             <input
// //                                                 id="image"
// //                                                 type="file"
// //                                                 name="image"
// //                                                 className="hidden"
// //                                                 onChange={handleInputChange}
// //                                                 accept="image/*"
// //                                             />
// //                                         </label>
// //                                     </div>
// //                                 </div>
// //                                 <div className="flex justify-end">
// //                                     <button
// //                                         type="button"
// //                                         onClick={() => {
// //                                             setIsModalOpen(false);
// //                                             resetForm();
// //                                         }}
// //                                         className="mr-2 px-4 py-2 text-gray-600 bg-gray-200 rounded hover:bg-gray-300 focus:outline-none focus:shadow-outline"
// //                                     >
// //                                         Cancel
// //                                     </button>
// //                                     <button
// //                                         type="submit"
// //                                         className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:shadow-outline"
// //                                     >
// //                                         {editingCategory ? 'Update' : 'Add'} Category
// //                                     </button>
// //                                 </div>
// //                             </form>
// //                         </motion.div>
// //                     </motion.div>
// //                 )}
// //
// //                 {isDeleteModalOpen && (
// //                     <motion.div
// //                         className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
// //                         initial={{ opacity: 0 }}
// //                         animate={{ opacity: 1 }}
// //                         exit={{ opacity: 0 }}
// //                     >
// //                         <motion.div
// //                             className="bg-white rounded-lg p-8 w-96"
// //                             initial={{ scale: 0.9, opacity: 0 }}
// //                             animate={{ scale: 1, opacity: 1 }}
// //                             exit={{ scale: 0.9, opacity: 0 }}
// //                         >
// //                             <h2 className="text-2xl font-bold mb-4">Confirm Deletion</h2>
// //                             <p className="mb-4">Are you sure you want to delete the category "{categoryToDelete?.name}"?</p>
// //                             <div className="flex justify-end">
// //                                 <button
// //                                     onClick={() => setIsDeleteModalOpen(false)}
// //                                     className="mr-2 px-4 py-2 text-gray-600 bg-gray-200 rounded hover:bg-gray-300 focus:outline-none focus:shadow-outline"
// //                                 >
// //                                     Cancel
// //                                 </button>
// //                                 <button
// //                                     onClick={confirmDelete}
// //                                     className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 focus:outline-none focus:shadow-outline"
// //                                 >
// //                                     Delete
// //                                 </button>
// //                             </div>
// //                         </motion.div>
// //                     </motion.div>
// //                 )}
// //             </AnimatePresence>
// //         </div>
// //     );
// // };
// //
// // export default CategoryList;