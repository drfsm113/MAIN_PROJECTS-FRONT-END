import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';

const CategoryItem = ({ category, selectedCategories, onCategoryChange, level = 0 }) => {
    const [isOpen, setIsOpen] = useState(false);
    const hasChildren = category.children && category.children.length > 0;

    const handleToggle = (e) => {
        e.stopPropagation();
        setIsOpen(!isOpen);
    };

    const handleCheck = (e) => {
        e.stopPropagation();
        onCategoryChange(category.id);
    };

    return (
        <div className="select-none">
            <div
                className="flex items-center py-2 px-2 hover:bg-gray-100 cursor-pointer"
                style={{ paddingLeft: `${level * 20}px` }}
                onClick={handleCheck}
            >
                {hasChildren && (
                    <span className="mr-2" onClick={handleToggle}>
            {isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </span>
                )}
                <input
                    type="checkbox"
                    checked={selectedCategories.includes(category.id)}
                    onChange={handleCheck}
                    className="mr-2"
                />
                <span>{category.name}</span>
            </div>
            {hasChildren && isOpen && (
                <div className="ml-4">
                    {category.children.map((child) => (
                        <CategoryItem
                            key={child.id}
                            category={child}
                            selectedCategories={selectedCategories}
                            onCategoryChange={onCategoryChange}
                            level={level + 1}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

const HierarchicalCategorySelector = ({ categories, selectedCategories, onCategoriesChange }) => {
    const [internalSelectedCategories, setInternalSelectedCategories] = useState(selectedCategories);

    useEffect(() => {
        setInternalSelectedCategories(selectedCategories);
    }, [selectedCategories]);

    const handleCategoryChange = (categoryId) => {
        const updatedCategories = new Set(internalSelectedCategories);

        const toggleCategory = (id) => {
            if (updatedCategories.has(id)) {
                updatedCategories.delete(id);
                // Deselect children
                const category = findCategory(categories, id);
                if (category && category.children) {
                    category.children.forEach(child => toggleCategory(child.id));
                }
            } else {
                updatedCategories.add(id);
                // Select parents
                let parent = findParentCategory(categories, id);
                while (parent) {
                    updatedCategories.add(parent.id);
                    parent = findParentCategory(categories, parent.id);
                }
            }
        };

        toggleCategory(categoryId);
        const newSelectedCategories = Array.from(updatedCategories);
        setInternalSelectedCategories(newSelectedCategories);
        onCategoriesChange(newSelectedCategories);
    };

    const findCategory = (cats, id) => {
        for (const cat of cats) {
            if (cat.id === id) return cat;
            if (cat.children) {
                const found = findCategory(cat.children, id);
                if (found) return found;
            }
        }
        return null;
    };

    const findParentCategory = (cats, childId, parent = null) => {
        for (const cat of cats) {
            if (cat.id === childId) return parent;
            if (cat.children) {
                const found = findParentCategory(cat.children, childId, cat);
                if (found) return found;
            }
        }
        return null;
    };

    return (
        <div className="max-h-60 overflow-y-auto border rounded-md p-2">
            {categories.map((category) => (
                <CategoryItem
                    key={category.id}
                    category={category}
                    selectedCategories={internalSelectedCategories}
                    onCategoryChange={handleCategoryChange}
                />
            ))}
        </div>
    );
};

export default HierarchicalCategorySelector;
// import React, { useState, useEffect } from 'react';
// import { ChevronDown, ChevronRight, Check } from 'lucide-react';
//
// const TreeNode = ({ category, level, selectedCategories, onCategoryChange }) => {
//     const [isExpanded, setIsExpanded] = useState(false);
//     const hasChildren = category.children && category.children.length > 0;
//
//     const handleToggle = (e) => {
//         e.stopPropagation();
//         setIsExpanded(!isExpanded);
//     };
//
//     const handleSelect = (e) => {
//         e.stopPropagation();
//         onCategoryChange(category.id);
//     };
//
//     return (
//         <div className="select-none">
//             <div
//                 className="flex items-center py-1 cursor-pointer hover:bg-gray-100"
//                 style={{ paddingLeft: `${level * 20}px` }}
//                 onClick={handleSelect}
//             >
//                 {hasChildren && (
//                     <span className="mr-1" onClick={handleToggle}>
//             {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
//           </span>
//                 )}
//                 {!hasChildren && <span className="w-4 mr-1"></span>}
//                 <div className={`w-4 h-4 border rounded mr-2 flex items-center justify-center ${
//                     selectedCategories[category.id] ? 'bg-blue-500 border-blue-500' : 'border-gray-300'
//                 }`}>
//                     {selectedCategories[category.id] && <Check size={12} color="white" />}
//                 </div>
//                 <span className="text-sm">{category.name}</span>
//             </div>
//             {hasChildren && isExpanded && (
//                 <div className="ml-4 pl-2 border-l border-gray-300">
//                     {category.children.map((child) => (
//                         <TreeNode
//                             key={child.id}
//                             category={child}
//                             level={level + 1}
//                             selectedCategories={selectedCategories}
//                             onCategoryChange={onCategoryChange}
//                         />
//                     ))}
//                 </div>
//             )}
//         </div>
//     );
// };
//
// const TreeLikeCategorySelection = ({ categories, formData, setFormData }) => {
//     const [selectedCategories, setSelectedCategories] = useState({});
//
//     useEffect(() => {
//         const initialSelection = {};
//         formData.category_ids.forEach((id) => {
//             initialSelection[id] = true;
//         });
//         setSelectedCategories(initialSelection);
//     }, [formData.category_ids]);
//
//     const handleCategoryChange = (categoryId) => {
//         const updatedSelection = { ...selectedCategories };
//
//         const toggleWithDescendants = (catId) => {
//             const category = findCategoryById(categories, catId);
//             if (!category) return;
//
//             updatedSelection[catId] = !updatedSelection[catId];
//             if (category.children) {
//                 category.children.forEach(child => toggleWithDescendants(child.id));
//             }
//         };
//
//         const selectParents = (catId) => {
//             const category = findCategoryById(categories, catId);
//             if (category && category.parent) {
//                 updatedSelection[category.parent] = true;
//                 selectParents(category.parent);
//             }
//         };
//
//         toggleWithDescendants(categoryId);
//         if (updatedSelection[categoryId]) {
//             selectParents(categoryId);
//         }
//
//         setSelectedCategories(updatedSelection);
//         const selectedIds = Object.keys(updatedSelection).filter(key => updatedSelection[key]);
//         setFormData({ ...formData, category_ids: selectedIds });
//     };
//
//     const findCategoryById = (cats, id) => {
//         for (const cat of cats) {
//             if (cat.id === id) return cat;
//             if (cat.children) {
//                 const found = findCategoryById(cat.children, id);
//                 if (found) return found;
//             }
//         }
//         return null;
//     };
//
//     return (
//         <div className="mb-4">
//             <label className="block text-gray-700 text-sm font-bold mb-2">Categories</label>
//             <div className="bg-white border rounded-md p-4 max-h-60 overflow-y-auto">
//                 {categories.map((category) => (
//                     <TreeNode
//                         key={category.id}
//                         category={category}
//                         level={0}
//                         selectedCategories={selectedCategories}
//                         onCategoryChange={handleCategoryChange}
//                     />
//                 ))}
//             </div>
//         </div>
//     );
// };

// import React, { useState, useEffect } from 'react';
// import { ChevronDown, ChevronRight, Check } from 'lucide-react';
//
// const CustomCheckbox = ({ id, checked, onChange, label }) => {
//     return (
//         <div className="flex items-center">
//             <div
//                 className={`w-5 h-5 border rounded mr-2 flex items-center justify-center cursor-pointer ${
//                     checked ? 'bg-blue-500 border-blue-500' : 'border-gray-300'
//                 }`}
//                 onClick={onChange}
//             >
//                 {checked && <Check size={16} color="white" />}
//             </div>
//             <label htmlFor={id} className="text-sm cursor-pointer" onClick={onChange}>
//                 {label}
//             </label>
//         </div>
//     );
// };
//
// const CategoryTree = ({ categories, selectedCategories, onCategoryChange }) => {
//     const [expandedCategories, setExpandedCategories] = useState({});
//
//     const toggleCategory = (categoryId) => {
//         setExpandedCategories((prev) => ({ ...prev, [categoryId]: !prev[categoryId] }));
//     };
//
//     const handleCategorySelect = (category) => {
//         const updatedSelection = { ...selectedCategories };
//         const selectWithParents = (cat) => {
//             updatedSelection[cat.id] = !updatedSelection[cat.id];
//             if (cat.parent) {
//                 const parentCategory = findCategoryById(categories, cat.parent);
//                 if (parentCategory) {
//                     updatedSelection[parentCategory.id] = true;
//                     selectWithParents(parentCategory);
//                 }
//             }
//         };
//         selectWithParents(category);
//         onCategoryChange(updatedSelection);
//     };
//
//     const findCategoryById = (cats, id) => {
//         for (const cat of cats) {
//             if (cat.id === id) return cat;
//             if (cat.children) {
//                 const found = findCategoryById(cat.children, id);
//                 if (found) return found;
//             }
//         }
//         return null;
//     };
//
//     const renderCategory = (category) => {
//         const isExpanded = expandedCategories[category.id];
//         const hasChildren = category.children && category.children.length > 0;
//
//         return (
//             <div key={category.id} className="mb-2">
//                 <div className="flex items-center">
//                     {hasChildren && (
//                         <button
//                             onClick={() => toggleCategory(category.id)}
//                             className="mr-2 text-gray-500 hover:text-gray-700"
//                         >
//                             {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
//                         </button>
//                     )}
//                     <CustomCheckbox
//                         id={`category-${category.id}`}
//                         checked={selectedCategories[category.id] || false}
//                         onChange={() => handleCategorySelect(category)}
//                         label={category.name}
//                     />
//                 </div>
//                 {hasChildren && isExpanded && (
//                     <div className="ml-6 mt-2">
//                         {category.children.map((child) => renderCategory(child))}
//                     </div>
//                 )}
//             </div>
//         );
//     };
//
//     return <div className="mt-2">{categories.map((category) => renderCategory(category))}</div>;
// };
//
// const HierarchicalCategorySelection = ({ categories, formData, setFormData }) => {
//     const [selectedCategories, setSelectedCategories] = useState({});
//
//     useEffect(() => {
//         const initialSelection = {};
//         formData.category_ids.forEach((id) => {
//             initialSelection[id] = true;
//         });
//         setSelectedCategories(initialSelection);
//     }, [formData.category_ids]);
//
//     const handleCategoryChange = (updatedSelection) => {
//         setSelectedCategories(updatedSelection);
//         const selectedIds = Object.keys(updatedSelection).filter(
//             (key) => updatedSelection[key]
//         );
//         setFormData({ ...formData, category_ids: selectedIds });
//     };
//
//     return (
//         <div className="mb-4">
//             <label className="block text-gray-700 text-sm font-bold mb-2">Categories</label>
//             <div className="bg-white border rounded-md p-4 max-h-60 overflow-y-auto">
//                 <CategoryTree
//                     categories={categories}
//                     selectedCategories={selectedCategories}
//                     onCategoryChange={handleCategoryChange}
//                 />
//             </div>
//         </div>
//     );
// };
//
// export default HierarchicalCategorySelection;