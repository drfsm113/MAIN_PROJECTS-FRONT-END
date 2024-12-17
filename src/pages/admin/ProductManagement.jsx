import React, { useState, useEffect } from 'react';
import { PlusCircle, MinusCircle, Image as ImageIcon, ChevronDown, ChevronRight } from 'lucide-react';
import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8000/api';

const ProductCreationForm = () => {
    const [formData, setFormData] = useState({
        name: '',
        // slug: '',
        description: '',
        brand: '',
        categories: [],
        tags: [],
        base_price: '',
        is_active: true,
        images: [],
        variants: [
            {
                name: '',
                // sku: '',
                price_adjustment: '',
                weight: '',
                dimensions: '',
                is_active: true,
                attribute_values: [{ attribute: '', value: '' }]
            }
        ]
    });

    const [categories, setCategories] = useState([]);
    const [brands, setBrands] = useState([]);
    const [tags, setTags] = useState([]);
    const [attributes, setAttributes] = useState([]);
    const [expandedCategories, setExpandedCategories] = useState({});

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [categoriesRes, brandsRes, tagsRes, attributesRes] = await Promise.all([
                    axios.get(`${API_BASE_URL}/categories/root_categories/`),
                    axios.get(`${API_BASE_URL}/brands/`),
                    axios.get(`${API_BASE_URL}/tags/`),
                    axios.get(`${API_BASE_URL}/attributes/`)
                ]);
                setCategories(categoriesRes.data);
                setBrands(brandsRes.data);
                setTags(tagsRes.data);
                setAttributes(attributesRes.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, []);

    const handleChange = (e, index = null, subIndex = null) => {
        const { name, value, type, checked } = e.target;
        setFormData(prevData => {
            if (index !== null) {
                const updatedVariants = [...prevData.variants];
                if (subIndex !== null) {
                    updatedVariants[index].attribute_values[subIndex][name] = value;
                } else {
                    updatedVariants[index][name] = type === 'checkbox' ? checked : value;
                }
                return { ...prevData, variants: updatedVariants };
            }
            if (name === 'categories') {
                const categoryId = parseInt(value);
                const updatedCategories = prevData.categories.includes(categoryId)
                    ? prevData.categories.filter(id => id !== categoryId)
                    : [...prevData.categories, categoryId];
                return { ...prevData, categories: updatedCategories };
            }
            if (name === 'tags') {
                const selectedOptions = Array.from(e.target.selectedOptions, option => parseInt(option.value));
                return { ...prevData, [name]: selectedOptions };
            }
            return { ...prevData, [name]: type === 'checkbox' ? checked : value };
        });
    };

    const toggleCategory = (categoryId) => {
        setExpandedCategories(prev => ({
            ...prev,
            [categoryId]: !prev[categoryId]
        }));
    };

    const fetchChildCategories = async (categoryId) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/categories/${categoryId}/children/`);
            setCategories(prevCategories => {
                return prevCategories.map(category => {
                    if (category.id === categoryId) {
                        return { ...category, children: response.data };
                    }
                    return category;
                });
            });
        } catch (error) {
            console.error('Error fetching child categories:', error);
        }
    };

    const renderCategoryTree = (categories, level = 0) => {
        return categories.map(category => (
            <div key={category.id} className={`ml-${level * 4}`}>
                <div className="flex items-center">
                    {category.children && category.children.length > 0 ? (
                        <button
                            type="button"
                            onClick={() => {
                                toggleCategory(category.id);
                                if (!expandedCategories[category.id]) {
                                    fetchChildCategories(category.id);
                                }
                            }}
                            className="mr-2 text-gray-500 hover:text-gray-700"
                        >
                            {expandedCategories[category.id] ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                        </button>
                    ) : (
                        <span className="mr-6"></span>
                    )}
                    <label className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            value={category.id}
                            checked={formData.categories.includes(category.id)}
                            onChange={handleChange}
                            name="categories"
                            className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-offset-0 focus:ring-indigo-200 focus:ring-opacity-50"
                        />
                        <span>{category.name}</span>
                    </label>
                </div>
                {expandedCategories[category.id] && category.children && (
                    <div className="ml-4">
                        {renderCategoryTree(category.children, level + 1)}
                    </div>
                )}
            </div>
        ));
    };

    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files);
        setFormData(prevData => ({
            ...prevData,
            images: [
                ...prevData.images,
                ...files.map((file, index) => ({
                    image: file,
                    alt_text: `Image ${prevData.images.length + index + 1}`,
                    is_primary: prevData.images.length === 0 && index === 0
                }))
            ]
        }));
    };

    const addVariant = () => {
        setFormData(prevData => ({
            ...prevData,
            variants: [
                ...prevData.variants,
                {
                    name: '',
                    // sku: '',
                    price_adjustment: '',
                    weight: '',
                    dimensions: '',
                    is_active: true,
                    attribute_values: [{ attribute: '', value: '' }]
                }
            ]
        }));
    };

    const removeVariant = (index) => {
        setFormData(prevData => ({
            ...prevData,
            variants: prevData.variants.filter((_, i) => i !== index)
        }));
    };

    const addAttributeValue = (variantIndex) => {
        setFormData(prevData => {
            const updatedVariants = [...prevData.variants];
            updatedVariants[variantIndex].attribute_values.push({ attribute: '', value: '' });
            return { ...prevData, variants: updatedVariants };
        });
    };

    const removeAttributeValue = (variantIndex, attrIndex) => {
        setFormData(prevData => {
            const updatedVariants = [...prevData.variants];
            updatedVariants[variantIndex].attribute_values = updatedVariants[variantIndex].attribute_values.filter((_, i) => i !== attrIndex);
            return { ...prevData, variants: updatedVariants };
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formDataToSend = new FormData();

        // Append basic fields
        formDataToSend.append('name', formData.name);
        // formDataToSend.append('slug', formData.slug);
        formDataToSend.append('description', formData.description);
        formDataToSend.append('brand', formData.brand);
        formDataToSend.append('base_price', formData.base_price);
        formDataToSend.append('is_active', formData.is_active);

        // Append categories and tags
        formData.categories.forEach(categoryId => formDataToSend.append('categories', categoryId));
        formData.tags.forEach(tagId => formDataToSend.append('tags', tagId));

        // Append images
        formData.images.forEach((image, index) => {
            formDataToSend.append(`images[${index}][image]`, image.image);
            formDataToSend.append(`images[${index}][alt_text]`, image.alt_text);
            formDataToSend.append(`images[${index}][is_primary]`, image.is_primary);
        });

        // Append variants
        formData.variants.forEach((variant, index) => {
            Object.keys(variant).forEach(key => {
                if (key !== 'attribute_values') {
                    formDataToSend.append(`variants[${index}][${key}]`, variant[key]);
                }
            });
            variant.attribute_values.forEach((attr, attrIndex) => {
                formDataToSend.append(`variants[${index}][attribute_values][${attrIndex}][attribute]`, attr.attribute);
                formDataToSend.append(`variants[${index}][attribute_values][${attrIndex}][value]`, attr.value);
            });
        });

        try {
            const response = await axios.post(`${API_BASE_URL}/products/`, formDataToSend, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            console.log('Product created:', response.data);
            // Handle success (e.g., show a success message, redirect to product list)
        } catch (error) {
            console.error('Error creating product:', error);
            // Handle error (e.g., show error message to user)
        }
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Create New Product</h2>

            {/* Basic Information */}
            <div className="space-y-6 mb-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                            required
                        />
                    </div>
                    {/*<div>*/}
                    {/*    <label htmlFor="slug" className="block text-sm font-medium text-gray-700">Slug</label>*/}
                    {/*    <input*/}
                    {/*        type="text"*/}
                    {/*        id="slug"*/}
                    {/*        name="slug"*/}
                    {/*        value={formData.slug}*/}
                    {/*        onChange={handleChange}*/}
                    {/*        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"*/}
                    {/*        required*/}
                    {/*    />*/}
                    {/*</div>*/}
                </div>
                <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                    <textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        rows="3"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                        required
                    ></textarea>
                </div>
            </div>

            {/* Brand and Price */}
            <div className="space-y-6 mb-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label htmlFor="brand" className="block text-sm font-medium text-gray-700">Brand</label>
                        <select
                            id="brand"
                            name="brand"
                            value={formData.brand}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                            required
                        >
                            <option value="">Select a brand</option>
                            {brands.map(brand => (
                                <option key={brand.id} value={brand.id}>{brand.name}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="base_price" className="block text-sm font-medium text-gray-700">Base Price</label>
                        <input
                            type="number"
                            id="base_price"
                            name="base_price"
                            value={formData.base_price}
                            onChange={handleChange}
                            step="0.01"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                            required
                        />
                    </div>
                </div>
            </div>

            {/* Categories */}
            <div className="mb-8">
                <h3 className="text-lg font-medium text-gray-700 mb-2">Categories</h3>
                <div className="max-h-60 overflow-y-auto border rounded-md p-4">
                    {renderCategoryTree(categories)}
                </div>
            </div>

            {/* Tags */}
            <div className="mb-8">
                <label htmlFor="tags" className="block text-sm font-medium text-gray-700">Tags</label>
                <select
                    id="tags"
                    name="tags"
                    multiple
                    value={formData.tags}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                >
                    {tags.map(tag => (
                        <option key={tag.id} value={tag.id}>{tag.name}</option>
                    ))}
                </select>
            </div>

            {/* Images */}
            <div className="mb-8">
                <h3 className="text-lg font-medium text-gray-700 mb-2">Images</h3>
                <div className="flex flex-wrap gap-4">
                    {formData.images.map((image, index) => (
                        <div key={index} className="relative">
                            <img src={URL.createObjectURL(image.image)} alt={image.alt_text} className="w-24 h-24 object-cover rounded" />
                            <input
                                type="text"
                                value={image.alt_text}
                                onChange={(e) => {
                                    const newImages = [...formData.images];
                                    newImages[index].alt_text = e.target.value;
                                    setFormData({ ...formData, images: newImages});
                                }}
                                className="mt-1 block w-full text-xs"
                                placeholder="Alt text"
                            />
                        </div>
                    ))}
                    <label className="w-24 h-24 flex items-center justify-center border-2 border-dashed border-gray-300 rounded cursor-pointer">
                        <input type="file" multiple onChange={handleImageUpload} className="hidden" accept="image/*" />
                        <ImageIcon className="text-gray-400" />
                    </label>
                </div>
            </div>

            {/* Variants */}
            <div className="mb-8">
                <h3 className="text-lg font-medium text-gray-700 mb-2">Variants</h3>
                {formData.variants.map((variant, index) => (
                    <div key={index} className="border rounded-md p-4 mb-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <input
                                type="text"
                                name="name"
                                value={variant.name}
                                onChange={(e) => handleChange(e, index)}
                                placeholder="Variant Name"
                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                            />
                            {/*<input*/}
                            {/*    type="text"*/}
                            {/*    name="sku"*/}
                            {/*    value={variant.sku}*/}
                            {/*    onChange={(e) => handleChange(e, index)}*/}
                            {/*    placeholder="SKU"*/}
                            {/*    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"*/}
                            {/*/>*/}
                            <input
                                type="number"
                                name="price_adjustment"
                                value={variant.price_adjustment}
                                onChange={(e) => handleChange(e, index)}
                                placeholder="Price Adjustment"
                                step="0.01"
                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                            />
                            <input
                                type="text"
                                name="weight"
                                value={variant.weight}
                                onChange={(e) => handleChange(e, index)}
                                placeholder="Weight"
                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                            />
                            <input
                                type="text"
                                name="dimensions"
                                value={variant.dimensions}
                                onChange={(e) => handleChange(e, index)}
                                placeholder="Dimensions"
                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                            />
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    name="is_active"
                                    checked={variant.is_active}
                                    onChange={(e) => handleChange(e, index)}
                                    className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-offset-0 focus:ring-indigo-200 focus:ring-opacity-50"
                                />
                                <label htmlFor="is_active" className="ml-2 block text-sm text-gray-900">
                                    Is Active
                                </label>
                            </div>
                        </div>
                        <div className="mb-2">
                            <h4 className="text-md font-medium text-gray-700 mb-2">Attribute Values</h4>
                            {variant.attribute_values.map((attr, attrIndex) => (
                                <div key={attrIndex} className="flex gap-2 mb-2">
                                    <select
                                        name="attribute"
                                        value={attr.attribute}
                                        onChange={(e) => handleChange(e, index, attrIndex)}
                                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                    >
                                        <option value="">Select Attribute</option>
                                        {attributes.map(attribute => (
                                            <option key={attribute.id} value={attribute.name}>{attribute.name}</option>
                                        ))}
                                    </select>
                                    <input
                                        type="text"
                                        name="value"
                                        value={attr.value}
                                        onChange={(e) => handleChange(e, index, attrIndex)}
                                        placeholder="Value"
                                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removeAttributeValue(index, attrIndex)}
                                        className="p-2 bg-red-100 text-red-600 rounded hover:bg-red-200 transition duration-200"
                                    >
                                        <MinusCircle size={20} />
                                    </button>
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={() => addAttributeValue(index)}
                                className="mt-2 p-2 bg-green-100 text-green-600 rounded hover:bg-green-200 transition duration-200 flex items-center"
                            >
                                <PlusCircle size={20} className="mr-2" />
                                Add Attribute
                            </button>
                        </div>
                        <button
                            type="button"
                            onClick={() => removeVariant(index)}
                            className="mt-2 p-2 bg-red-100 text-red-600 rounded hover:bg-red-200 transition duration-200 flex items-center"
                        >
                            <MinusCircle size={20} className="mr-2" />
                            Remove Variant
                        </button>
                    </div>
                ))}
                <button
                    type="button"
                    onClick={addVariant}
                    className="mt-2 p-2 bg-indigo-100 text-indigo-600 rounded hover:bg-indigo-200 transition duration-200 flex items-center"
                >
                    <PlusCircle size={20} className="mr-2" />
                    Add Variant
                </button>
            </div>

            {/* Submit Button */}
            <div className="mt-8">
                <button
                    type="submit"
                    className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-200"
                >
                    Create Product
                </button>
            </div>
        </form>
    );
};

export default ProductCreationForm;


// import React, { useState, useEffect } from 'react';
// import { PlusCircle, MinusCircle, Image as ImageIcon, ChevronDown, ChevronRight } from 'lucide-react';
// import axios from 'axios';
//
// const API_BASE_URL = 'http://127.0.0.1:8000/api';
//
// const ProductCreationForm = () => {
//     const [formData, setFormData] = useState({
//         name: '',
//         slug: '',
//         description: '',
//         brand: '',
//         categories: [],
//         tags: [],
//         base_price: '',
//         is_active: true,
//         images: [],
//         variants: [
//             {
//                 name: '',
//                 sku: '',
//                 price_adjustment: '',
//                 weight: '',
//                 dimensions: '',
//                 is_active: true,
//                 attribute_values: [{ attribute: '', value: '' }]
//             }
//         ]
//     });
//
//     const [categories, setCategories] = useState([]);
//     const [brands, setBrands] = useState([]);
//     const [tags, setTags] = useState([]);
//     const [expandedCategories, setExpandedCategories] = useState({});
//
//     useEffect(() => {
//         const fetchData = async () => {
//             try {
//                 const [categoriesRes, brandsRes, tagsRes] = await Promise.all([
//                     axios.get(`${API_BASE_URL}/categories/root_categories/`),
//                     axios.get(`${API_BASE_URL}/brands/`),
//                     axios.get(`${API_BASE_URL}/tags/`)
//                 ]);
//                 setCategories(categoriesRes.data);
//                 setBrands(brandsRes.data);
//                 setTags(tagsRes.data);
//             } catch (error) {
//                 console.error('Error fetching data:', error);
//             }
//         };
//         fetchData();
//     }, []);
//
//     const handleChange = (e, index = null, subIndex = null) => {
//         const { name, value, type, checked } = e.target;
//         setFormData(prevData => {
//             if (index !== null) {
//                 const updatedVariants = [...prevData.variants];
//                 if (subIndex !== null) {
//                     updatedVariants[index].attribute_values[subIndex][name] = value;
//                 } else {
//                     updatedVariants[index][name] = type === 'checkbox' ? checked : value;
//                 }
//                 return { ...prevData, variants: updatedVariants };
//             }
//             if (name === 'categories') {
//                 const categoryId = parseInt(value);
//                 const updatedCategories = prevData.categories.includes(categoryId)
//                     ? prevData.categories.filter(id => id !== categoryId)
//                     : [...prevData.categories, categoryId];
//                 return { ...prevData, categories: updatedCategories };
//             }
//             if (name === 'tags') {
//                 const selectedOptions = Array.from(e.target.selectedOptions, option => parseInt(option.value));
//                 return { ...prevData, [name]: selectedOptions };
//             }
//             return { ...prevData, [name]: type === 'checkbox' ? checked : value };
//         });
//     };
//
//     const toggleCategory = (categoryId) => {
//         setExpandedCategories(prev => ({
//             ...prev,
//             [categoryId]: !prev[categoryId]
//         }));
//     };
//
//     const fetchChildCategories = async (categoryId) => {
//         try {
//             const response = await axios.get(`${API_BASE_URL}/categories/${categoryId}/children/`);
//             setCategories(prevCategories => {
//                 return prevCategories.map(category => {
//                     if (category.id === categoryId) {
//                         return { ...category, children: response.data };
//                     }
//                     return category;
//                 });
//             });
//         } catch (error) {
//             console.error('Error fetching child categories:', error);
//         }
//     };
//
//     const renderCategoryTree = (categories, level = 0) => {
//         return categories.map(category => (
//             <div key={category.id} className={`ml-${level * 4}`}>
//                 <div className="flex items-center">
//                     {category.children && category.children.length > 0 ? (
//                         <button
//                             type="button"
//                             onClick={() => {
//                                 toggleCategory(category.id);
//                                 if (!expandedCategories[category.id]) {
//                                     fetchChildCategories(category.id);
//                                 }
//                             }}
//                             className="mr-2 text-gray-500 hover:text-gray-700"
//                         >
//                             {expandedCategories[category.id] ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
//                         </button>
//                     ) : (
//                         <span className="mr-6"></span>
//                     )}
//                     <label className="flex items-center space-x-2">
//                         <input
//                             type="checkbox"
//                             value={category.id}
//                             checked={formData.categories.includes(category.id)}
//                             onChange={handleChange}
//                             name="categories"
//                             className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-offset-0 focus:ring-indigo-200 focus:ring-opacity-50"
//                         />
//                         <span>{category.name}</span>
//                     </label>
//                 </div>
//                 {expandedCategories[category.id] && category.children && (
//                     <div className="ml-4">
//                         {renderCategoryTree(category.children, level + 1)}
//                     </div>
//                 )}
//             </div>
//         ));
//     };
//
//     const handleImageUpload = (e) => {
//         const files = Array.from(e.target.files);
//         setFormData(prevData => ({
//             ...prevData,
//             images: [
//                 ...prevData.images,
//                 ...files.map((file, index) => ({
//                     image: file,
//                     alt_text: `Image ${prevData.images.length + index + 1}`,
//                     is_primary: prevData.images.length === 0 && index === 0
//                 }))
//             ]
//         }));
//     };
//
//     const addVariant = () => {
//         setFormData(prevData => ({
//             ...prevData,
//             variants: [
//                 ...prevData.variants,
//                 {
//                     name: '',
//                     sku: '',
//                     price_adjustment: '',
//                     weight: '',
//                     dimensions: '',
//                     is_active: true,
//                     attribute_values: [{ attribute: '', value: '' }]
//                 }
//             ]
//         }));
//     };
//
//     const removeVariant = (index) => {
//         setFormData(prevData => ({
//             ...prevData,
//             variants: prevData.variants.filter((_, i) => i !== index)
//         }));
//     };
//
//     const addAttributeValue = (variantIndex) => {
//         setFormData(prevData => {
//             const updatedVariants = [...prevData.variants];
//             updatedVariants[variantIndex].attribute_values.push({ attribute: '', value: '' });
//             return { ...prevData, variants: updatedVariants };
//         });
//     };
//
//     const removeAttributeValue = (variantIndex, attrIndex) => {
//         setFormData(prevData => {
//             const updatedVariants = [...prevData.variants];
//             updatedVariants[variantIndex].attribute_values = updatedVariants[variantIndex].attribute_values.filter((_, i) => i !== attrIndex);
//             return { ...prevData, variants: updatedVariants };
//         });
//     };
//
//
//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         const formDataToSend = new FormData();
//
//         // Append basic fields
//         formDataToSend.append('name', formData.name);
//         formDataToSend.append('slug', formData.slug);
//         formDataToSend.append('description', formData.description);
//         formDataToSend.append('brand', formData.brand);
//         formDataToSend.append('base_price', formData.base_price);
//         formDataToSend.append('is_active', formData.is_active);
//
//         // Append categories and tags
//         formData.categories.forEach(categoryId => formDataToSend.append('categories', categoryId));
//         formData.tags.forEach(tagId => formDataToSend.append('tags', tagId));
//
//         // Append images
//         formData.images.forEach((image, index) => {
//             formDataToSend.append(`images[${index}][image]`, image.image);
//             formDataToSend.append(`images[${index}][alt_text]`, image.alt_text);
//             formDataToSend.append(`images[${index}][is_primary]`, image.is_primary);
//         });
//
//         // Append variants
//         formData.variants.forEach((variant, index) => {
//             Object.keys(variant).forEach(key => {
//                 if (key !== 'attribute_values') {
//                     formDataToSend.append(`variants[${index}][${key}]`, variant[key]);
//                 }
//             });
//             variant.attribute_values.forEach((attr, attrIndex) => {
//                 formDataToSend.append(`variants[${index}][attribute_values][${attrIndex}][attribute]`, attr.attribute);
//                 formDataToSend.append(`variants[${index}][attribute_values][${attrIndex}][value]`, attr.value);
//             });
//         });
//
//         try {
//             const response = await axios.post(`${API_BASE_URL}/products/`, formDataToSend, {
//                 headers: {
//                     'Content-Type': 'multipart/form-data',
//                 },
//             });
//             console.log('Product created:', response.data);
//             // Handle success (e.g., show a success message, redirect to product list)
//         } catch (error) {
//             console.error('Error creating product:', error);
//             // Handle error (e.g., show error message to user)
//         }
//     };
//
//     return (
//         <form onSubmit={handleSubmit} className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
//             <h2 className="text-2xl font-bold mb-6 text-gray-800">Create New Product</h2>
//
//             {/* Basic Information */}
//             <div className="space-y-6 mb-8">
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                     <div>
//                         <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
//                         <input
//                             type="text"
//                             id="name"
//                             name="name"
//                             value={formData.name}
//                             onChange={handleChange}
//                             className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
//                             required
//                         />
//                     </div>
//                     <div>
//                         <label htmlFor="slug" className="block text-sm font-medium text-gray-700">Slug</label>
//                         <input
//                             type="text"
//                             id="slug"
//                             name="slug"
//                             value={formData.slug}
//                             onChange={handleChange}
//                             className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
//                             required
//                         />
//                     </div>
//                 </div>
//                 <div>
//                     <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
//                     <textarea
//                         id="description"
//                         name="description"
//                         value={formData.description}
//                         onChange={handleChange}
//                         rows="3"
//                         className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
//                         required
//                     ></textarea>
//                 </div>
//             </div>
//
//             {/* Brand and Price */}
//             <div className="space-y-6 mb-8">
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                     <div>
//                         <label htmlFor="brand" className="block text-sm font-medium text-gray-700">Brand</label>
//                         <select
//                             id="brand"
//                             name="brand"
//                             value={formData.brand}
//                             onChange={handleChange}
//                             className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
//                             required
//                         >
//                             <option value="">Select a brand</option>
//                             {brands.map(brand => (
//                                 <option key={brand.id} value={brand.id}>{brand.name}</option>
//                             ))}
//                         </select>
//                     </div>
//                     <div>
//                         <label htmlFor="base_price" className="block text-sm font-medium text-gray-700">Base Price</label>
//                         <input
//                             type="number"
//                             id="base_price"
//                             name="base_price"
//                             value={formData.base_price}
//                             onChange={handleChange}
//                             step="0.01"
//                             className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
//                             required
//                         />
//                     </div>
//                 </div>
//             </div>
//
//             {/* Categories */}
//             <div className="mb-8">
//                 <h3 className="text-lg font-medium text-gray-700 mb-2">Categories</h3>
//                 <div className="max-h-60 overflow-y-auto border rounded-md p-4">
//                     {renderCategoryTree(categories)}
//                 </div>
//             </div>
//
//             {/* Tags */}
//             <div className="mb-8">
//                 <label htmlFor="tags" className="block text-sm font-medium text-gray-700">Tags</label>
//                 <select
//                     id="tags"
//                     name="tags"
//                     multiple
//                     value={formData.tags}
//                     onChange={handleChange}
//                     className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
//                 >
//                     {tags.map(tag => (
//                         <option key={tag.id} value={tag.id}>{tag.name}</option>
//                     ))}
//                 </select>
//             </div>
//
//             {/* Images */}
//             <div className="mb-8">
//                 <h3 className="text-lg font-medium text-gray-700 mb-2">Images</h3>
//                 <div className="flex flex-wrap gap-4">
//                     {formData.images.map((image, index) => (
//                         <div key={index} className="relative">
//                             <img src={URL.createObjectURL(image.image)} alt={image.alt_text} className="w-24 h-24 object-cover rounded" />
//                             <input
//                                 type="text"
//                                 value={image.alt_text}
//                                 onChange={(e) => {
//                                     const newImages = [...formData.images];
//                                     newImages[index].alt_text = e.target.value;
//                                     setFormData({ ...formData, images: newImages });
//                                 }}
//                                 className="mt-1 block w-full text-xs"
//                                 placeholder="Alt text"
//                             />
//                         </div>
//                     ))}
//                     <label className="w-24 h-24 flex items-center justify-center border-2 border-dashed border-gray-300 rounded cursor-pointer">
//                         <input type="file" multiple onChange={handleImageUpload} className="hidden" accept="image/*" />
//                         <ImageIcon className="text-gray-400" />
//                     </label>
//                 </div>
//             </div>
//
//             {/* Variants */}
//             <div className="mb-8">
//                 <h3 className="text-lg font-medium text-gray-700 mb-2">Variants</h3>
//                 {formData.variants.map((variant, index) => (
//                     <div key={index} className="border rounded-md p-4 mb-4">
//                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
//                             <input
//                                 type="text"
//                                 name="name"
//                                 value={variant.name}
//                                 onChange={(e) => handleChange(e, index)}
//                                 placeholder="Variant Name"
//                                 className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
//                             />
//                             <input
//                                 type="text"
//                                 name="sku"
//                                 value={variant.sku}
//                                 onChange={(e) => handleChange(e, index)}
//                                 placeholder="SKU"
//                                 className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
//                             />
//                             <input
//                                 type="number"
//                                 name="price_adjustment"
//                                 value={variant.price_adjustment}
//                                 onChange={(e) => handleChange(e, index)}
//                                 placeholder="PriceAdjustment"
//                                 step="0.01"
//                                 className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
//                             />
//                             <input
//                                 type="text"
//                                 name="weight"
//                                 value={variant.weight}
//                                 onChange={(e) => handleChange(e, index)}
//                                 placeholder="Weight"
//                                 className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
//                             />
//                             <input
//                                 type="text"
//                                 name="dimensions"
//                                 value={variant.dimensions}
//                                 onChange={(e) => handleChange(e, index)}
//                                 placeholder="Dimensions"
//                                 className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
//                             />
//                             <div className="flex items-center">
//                                 <input
//                                     type="checkbox"
//                                     name="is_active"
//                                     checked={variant.is_active}
//                                     onChange={(e) => handleChange(e, index)}
//                                     className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-offset-0 focus:ring-indigo-200 focus:ring-opacity-50"
//                                 />
//                                 <label htmlFor="is_active" className="ml-2 block text-sm text-gray-900">
//                                     Is Active
//                                 </label>
//                             </div>
//                         </div>
//                         <div className="mb-2">
//                             <h4 className="text-md font-medium text-gray-700 mb-2">Attribute Values</h4>
//                             {variant.attribute_values.map((attr, attrIndex) => (
//                                 <div key={attrIndex} className="flex gap-2 mb-2">
//                                     <input
//                                         type="text"
//                                         name="attribute"
//                                         value={attr.attribute}
//                                         onChange={(e) => handleChange(e, index, attrIndex)}
//                                         placeholder="Attribute"
//                                         className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
//                                     />
//                                     <input
//                                         type="text"
//                                         name="value"
//                                         value={attr.value}
//                                         onChange={(e) => handleChange(e, index, attrIndex)}
//                                         placeholder="Value"
//                                         className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
//                                     />
//                                     <button
//                                         type="button"
//                                         onClick={() => removeAttributeValue(index, attrIndex)}
//                                         className="p-2 bg-red-100 text-red-600 rounded hover:bg-red-200 transition duration-200"
//                                     >
//                                         <MinusCircle size={20} />
//                                     </button>
//                                 </div>
//                             ))}
//                             <button
//                                 type="button"
//                                 onClick={() => addAttributeValue(index)}
//                                 className="mt-2 p-2 bg-green-100 text-green-600 rounded hover:bg-green-200 transition duration-200 flex items-center"
//                             >
//                                 <PlusCircle size={20} className="mr-2" />
//                                 Add Attribute
//                             </button>
//                         </div>
//                         <button
//                             type="button"
//                             onClick={() => removeVariant(index)}
//                             className="mt-2 p-2 bg-red-100 text-red-600 rounded hover:bg-red-200 transition duration-200 flex items-center"
//                         >
//                             <MinusCircle size={20} className="mr-2" />
//                             Remove Variant
//                         </button>
//                     </div>
//                 ))}
//                 <button
//                     type="button"
//                     onClick={addVariant}
//                     className="mt-2 p-2 bg-indigo-100 text-indigo-600 rounded hover:bg-indigo-200 transition duration-200 flex items-center"
//                 >
//                     <PlusCircle size={20} className="mr-2" />
//                     Add Variant
//                 </button>
//             </div>
//
//             {/* Submit Button */}
//             <div className="mt-8">
//                 <button
//                     type="submit"
//                     className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-200"
//                 >
//                     Create Product
//                 </button>
//             </div>
//         </form>
//     );
// };
//
// export default ProductCreationForm;
// // import React, { useState, useEffect } from 'react';
// // import { PlusCircle, MinusCircle, Image as ImageIcon } from 'lucide-react';
// // import axios from 'axios';
// //
// // const API_BASE_URL = 'http://127.0.0.1:8000/api';
// //
// // const ProductCreationForm = () => {
// //     const [formData, setFormData] = useState({
// //         name: '',
// //         slug: '',
// //         description: '',
// //         brand: '',
// //         categories: [],
// //         tags: [],
// //         base_price: '',
// //         is_active: true,
// //         images: [],
// //         variants: [
// //             {
// //                 name: '',
// //                 sku: '',
// //                 price_adjustment: '',
// //                 weight: '',
// //                 dimensions: '',
// //                 is_active: true,
// //                 attribute_values: [{ attribute: '', value: '' }]
// //             }
// //         ]
// //     });
// //
// //     const [categories, setCategories] = useState([]);
// //     const [brands, setBrands] = useState([]);
// //     const [tags, setTags] = useState([]);
// //
// //     useEffect(() => {
// //         const fetchData = async () => {
// //             try {
// //                 const [categoriesRes, brandsRes, tagsRes] = await Promise.all([
// //                     axios.get(`${API_BASE_URL}/categories/root_categories/`),
// //                     axios.get(`${API_BASE_URL}/brands/`),
// //                     axios.get(`${API_BASE_URL}/tags/`)
// //                 ]);
// //                 setCategories(categoriesRes.data);
// //                 setBrands(brandsRes.data);
// //                 setTags(tagsRes.data);
// //             } catch (error) {
// //                 console.error('Error fetching data:', error);
// //             }
// //         };
// //         fetchData();
// //     }, []);
// //
// //     const handleChange = (e, index = null, subIndex = null) => {
// //         const { name, value, type, checked } = e.target;
// //         setFormData(prevData => {
// //             if (index !== null) {
// //                 const updatedVariants = [...prevData.variants];
// //                 if (subIndex !== null) {
// //                     updatedVariants[index].attribute_values[subIndex][name] = value;
// //                 } else {
// //                     updatedVariants[index][name] = type === 'checkbox' ? checked : value;
// //                 }
// //                 return { ...prevData, variants: updatedVariants };
// //             }
// //             if (name === 'categories' || name === 'tags') {
// //                 const selectedOptions = Array.from(e.target.selectedOptions, option => parseInt(option.value));
// //                 return { ...prevData, [name]: selectedOptions };
// //             }
// //             return { ...prevData, [name]: type === 'checkbox' ? checked : value };
// //         });
// //     };
// //
// //     const handleImageUpload = (e) => {
// //         const files = Array.from(e.target.files);
// //         setFormData(prevData => ({
// //             ...prevData,
// //             images: [
// //                 ...prevData.images,
// //                 ...files.map((file, index) => ({
// //                     image: file,
// //                     alt_text: `Image ${prevData.images.length + index + 1}`,
// //                     is_primary: prevData.images.length === 0 && index === 0
// //                 }))
// //             ]
// //         }));
// //     };
// //
// //     const addVariant = () => {
// //         setFormData(prevData => ({
// //             ...prevData,
// //             variants: [
// //                 ...prevData.variants,
// //                 {
// //                     name: '',
// //                     sku: '',
// //                     price_adjustment: '',
// //                     weight: '',
// //                     dimensions: '',
// //                     is_active: true,
// //                     attribute_values: [{ attribute: '', value: '' }]
// //                 }
// //             ]
// //         }));
// //     };
// //
// //     const removeVariant = (index) => {
// //         setFormData(prevData => ({
// //             ...prevData,
// //             variants: prevData.variants.filter((_, i) => i !== index)
// //         }));
// //     };
// //
// //     const addAttributeValue = (variantIndex) => {
// //         setFormData(prevData => {
// //             const updatedVariants = [...prevData.variants];
// //             updatedVariants[variantIndex].attribute_values.push({ attribute: '', value: '' });
// //             return { ...prevData, variants: updatedVariants };
// //         });
// //     };
// //
// //     const removeAttributeValue = (variantIndex, attrIndex) => {
// //         setFormData(prevData => {
// //             const updatedVariants = [...prevData.variants];
// //             updatedVariants[variantIndex].attribute_values = updatedVariants[variantIndex].attribute_values.filter((_, i) => i !== attrIndex);
// //             return { ...prevData, variants: updatedVariants };
// //         });
// //     };
// //
// //     const handleSubmit = async (e) => {
// //         e.preventDefault();
// //         const formDataToSend = new FormData();
// //
// //         // Append basic fields
// //         formDataToSend.append('name', formData.name);
// //         formDataToSend.append('slug', formData.slug);
// //         formDataToSend.append('description', formData.description);
// //         formDataToSend.append('brand', formData.brand);
// //         formDataToSend.append('base_price', formData.base_price);
// //         formDataToSend.append('is_active', formData.is_active);
// //
// //         // Append categories and tags
// //         formData.categories.forEach(categoryId => formDataToSend.append('categories', categoryId));
// //         formData.tags.forEach(tagId => formDataToSend.append('tags', tagId));
// //
// //         // Append images
// //         formData.images.forEach((image, index) => {
// //             formDataToSend.append(`images[${index}][image]`, image.image);
// //             formDataToSend.append(`images[${index}][alt_text]`, image.alt_text);
// //             formDataToSend.append(`images[${index}][is_primary]`, image.is_primary);
// //         });
// //
// //         // Append variants
// //         formData.variants.forEach((variant, index) => {
// //             Object.keys(variant).forEach(key => {
// //                 if (key !== 'attribute_values') {
// //                     formDataToSend.append(`variants[${index}][${key}]`, variant[key]);
// //                 }
// //             });
// //             variant.attribute_values.forEach((attr, attrIndex) => {
// //                 formDataToSend.append(`variants[${index}][attribute_values][${attrIndex}][attribute]`, attr.attribute);
// //                 formDataToSend.append(`variants[${index}][attribute_values][${attrIndex}][value]`, attr.value);
// //             });
// //         });
// //
// //         try {
// //             const response = await axios.post(`${API_BASE_URL}/products/`, formDataToSend, {
// //                 headers: {
// //                     'Content-Type': 'multipart/form-data',
// //                 },
// //             });
// //             console.log('Product created:', response.data);
// //             // Handle success (e.g., show a success message, redirect to product list)
// //         } catch (error) {
// //             console.error('Error creating product:', error);
// //             // Handle error (e.g., show error message to user)
// //         }
// //     };
// //
// //     return (
// //         <form onSubmit={handleSubmit} className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
// //             <h2 className="text-2xl font-bold mb-6 text-gray-800">Create New Product</h2>
// //
// //             <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
// //                 <div>
// //                     <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
// //                     <input
// //                         type="text"
// //                         id="name"
// //                         name="name"
// //                         value={formData.name}
// //                         onChange={handleChange}
// //                         className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
// //                         required
// //                     />
// //                 </div>
// //                 <div>
// //                     <label htmlFor="slug" className="block text-sm font-medium text-gray-700">Slug</label>
// //                     <input
// //                         type="text"
// //                         id="slug"
// //                         name="slug"
// //                         value={formData.slug}
// //                         onChange={handleChange}
// //                         className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
// //                         required
// //                     />
// //                 </div>
// //             </div>
// //
// //             <div className="mb-6">
// //                 <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
// //                 <textarea
// //                     id="description"
// //                     name="description"
// //                     value={formData.description}
// //                     onChange={handleChange}
// //                     rows="3"
// //                     className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
// //                     required
// //                 ></textarea>
// //             </div>
// //
// //             <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
// //                 <div>
// //                     <label htmlFor="brand" className="block text-sm font-medium text-gray-700">Brand</label>
// //                     <select
// //                         id="brand"
// //                         name="brand"
// //                         value={formData.brand}
// //                         onChange={handleChange}
// //                         className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
// //                         required
// //                     >
// //                         <option value="">Select a brand</option>
// //                         {brands.map(brand => (
// //                             <option key={brand.id} value={brand.id}>{brand.name}</option>
// //                         ))}
// //                     </select>
// //                 </div>
// //                 <div>
// //                     <label htmlFor="base_price" className="block text-sm font-medium text-gray-700">Base Price</label>
// //                     <input
// //                         type="number"
// //                         id="base_price"
// //                         name="base_price"
// //                         value={formData.base_price}
// //                         onChange={handleChange}
// //                         step="0.01"
// //                         className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
// //                         required
// //                     />
// //                 </div>
// //             </div>
// //
// //             <div className="mb-6">
// //                 <label htmlFor="categories" className="block text-sm font-medium text-gray-700">Categories</label>
// //                 <select
// //                     id="categories"
// //                     name="categories"
// //                     multiple
// //                     value={formData.categories}
// //                     onChange={handleChange}
// //                     className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
// //                     required
// //                 >
// //                     {categories.map(category => (
// //                         <option key={category.id} value={category.id}>{category.name}</option>
// //                     ))}
// //                 </select>
// //             </div>
// //
// //             <div className="mb-6">
// //                 <label htmlFor="tags" className="block text-sm font-medium text-gray-700">Tags</label>
// //                 <select
// //                     id="tags"
// //                     name="tags"
// //                     multiple
// //                     value={formData.tags}
// //                     onChange={handleChange}
// //                     className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
// //                 >
// //                     {tags.map(tag => (
// //                         <option key={tag.id} value={tag.id}>{tag.name}</option>
// //                     ))}
// //                 </select>
// //             </div>
// //
// //             <div className="mb-6">
// //                 <label className="block text-sm font-medium text-gray-700 mb-2">Images</label>
// //                 <div className="flex flex-wrap gap-4">
// //                     {formData.images.map((image, index) => (
// //                         <div key={index} className="relative">
// //                             <img src={URL.createObjectURL(image.image)} alt={image.alt_text} className="w-24 h-24 object-cover rounded" />
// //                             <input
// //                                 type="text"
// //                                 value={image.alt_text}
// //                                 onChange={(e) => {
// //                                     const newImages = [...formData.images];
// //                                     newImages[index].alt_text = e.target.value;
// //                                     setFormData({ ...formData, images: newImages });
// //                                 }}
// //                                 className="mt-1 block w-full text-xs"
// //                                 placeholder="Alt text"
// //                             />
// //                         </div>
// //                     ))}
// //                     <label className="w-24 h-24 flex items-center justify-center border-2 border-dashed border-gray-300 rounded cursor-pointer">
// //                         <input type="file" multiple onChange={handleImageUpload} className="hidden" accept="image/*" />
// //                         <ImageIcon className="text-gray-400" />
// //                     </label>
// //                 </div>
// //             </div>
// //
// //             <div className="mb-6">
// //                 <label className="block text-sm font-medium text-gray-700 mb-2">Variants</label>
// //                 {formData.variants.map((variant, index) => (
// //                     <div key={index} className="border rounded-md p-4 mb-4">
// //                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
// //                             <input
// //                                 type="text"
// //                                 name="name"
// //                                 value={variant.name}
// //                                 onChange={(e) => handleChange(e, index)}
// //                                 placeholder="Variant Name"
// //                                 className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
// //                             />
// //                             <input
// //                                 type="text"
// //                                 name="sku"
// //                                 value={variant.sku}
// //                                 onChange={(e) => handleChange(e, index)}
// //                                 placeholder="SKU"
// //                                 className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
// //                             />
// //                             <input
// //                                 type="number"
// //                                 name="price_adjustment"
// //                                 value={variant.price_adjustment}
// //                                 onChange={(e) => handleChange(e, index)}
// //                                 placeholder="Price Adjustment"
// //                                 step="0.01"
// //                                 className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
// //                             />
// //                             <input
// //                                 type="text"
// //                                 name="weight"
// //                                 value={variant.weight}
// //                                 onChange={(e) => handleChange(e, index)}
// //                                 placeholder="Weight"
// //                                 className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
// //                             />
// //                             <input
// //                                 type="text"
// //                                 name="dimensions"
// //                                 value={variant.dimensions}
// //                                 onChange={(e) => handleChange(e, index)}
// //                                 placeholder="Dimensions"
// //                                 className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity "/>
// //
// //                             <div className="flex items-center">
// //                                 <input
// //                                     type="checkbox"
// //                                     name="is_active"
// //                                     checked={variant.is_active}
// //                                     onChange={(e) => handleChange(e, index)}
// //                                     className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-offset-0 focus:ring-indigo-200 focus:ring-opacity-50"
// //                                 />
// //                                 <label htmlFor="is_active" className="ml-2 block text-sm text-gray-900">
// //                                     Is Active
// //                                 </label>
// //                             </div>
// //                         </div>
// //                         <div className="mb-2">
// //                             <label className="block text-sm font-medium text-gray-700 mb-2">Attribute Values</label>
// //                             {variant.attribute_values.map((attr, attrIndex) => (
// //                                 <div key={attrIndex} className="flex gap-2 mb-2">
// //                                     <input
// //                                         type="text"
// //                                         name="attribute"
// //                                         value={attr.attribute}
// //                                         onChange={(e) => handleChange(e, index, attrIndex)}
// //                                         placeholder="Attribute"
// //                                         className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
// //                                     />
// //                                     <input
// //                                         type="text"
// //                                         name="value"
// //                                         value={attr.value}
// //                                         onChange={(e) => handleChange(e, index, attrIndex)}
// //                                         placeholder="Value"
// //                                         className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
// //                                     />
// //                                     <button
// //                                         type="button"
// //                                         onClick={() => removeAttributeValue(index, attrIndex)}
// //                                         className="p-2 bg-red-100 text-red-600 rounded hover:bg-red-200"
// //                                     >
// //                                         <MinusCircle size={20} />
// //                                     </button>
// //                                 </div>
// //                             ))}
// //                             <button
// //                                 type="button"
// //                                 onClick={() => addAttributeValue(index)}
// //                                 className="mt-2 p-2 bg-green-100 text-green-600 rounded hover:bg-green-200"
// //                             >
// //                                 <PlusCircle size={20} />
// //                             </button>
// //                         </div>
// //                         <button
// //                             type="button"
// //                             onClick={() => removeVariant(index)}
// //                             className="mt-2 p-2 bg-red-100 text-red-600 rounded hover:bg-red-200"
// //                         >
// //                             Remove Variant
// //                         </button>
// //                     </div>
// //                 ))}
// //                 <button
// //                     type="button"
// //                     onClick={addVariant}
// //                     className="mt-2 p-2 bg-indigo-100 text-indigo-600 rounded hover:bg-indigo-200"
// //                 >
// //                     Add Variant
// //                 </button>
// //             </div>
// //
// //             <div className="mt-8">
// //                 <button
// //                     type="submit"
// //                     className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
// //                 >
// //                     Create Product
// //                 </button>
// //             </div>
// //         </form>
// //     );
// // };
// //
// // export default ProductCreationForm;
// // // import React, { useState, useEffect } from 'react';
// // // import { PlusCircle, Trash2, ArrowLeft, ArrowRight } from 'lucide-react';
// // //
// // // const MultiStepProductCreateForm = () => {
// // //     const [step, setStep] = useState(1);
// // //     const [formData, setFormData] = useState({
// // //         name: '',
// // //         slug: '',
// // //         description: '',
// // //         brand: '',
// // //         categories: [],
// // //         tags: [],
// // //         base_price: '',
// // //         is_active: true,
// // //         images: [],
// // //         variants: []
// // //     });
// // //
// // //     const [brands, setBrands] = useState([]);
// // //     const [categories, setCategories] = useState([]);
// // //     const [tags, setTags] = useState([]);
// // //
// // //     useEffect(() => {
// // //         // Fetch brands, categories, and tags from API
// // //         // Replace these with actual API calls
// // //         const fetchData = async () => {
// // //             try {
// // //                 const brandsResponse = await fetch('/api/brands/');
// // //                 const categoriesResponse = await fetch('/api/categories/');
// // //                 const tagsResponse = await fetch('/api/tags/');
// // //
// // //                 const brandsData = await brandsResponse.json();
// // //                 const categoriesData = await categoriesResponse.json();
// // //                 const tagsData = await tagsResponse.json();
// // //
// // //                 setBrands(brandsData);
// // //                 setCategories(categoriesData);
// // //                 setTags(tagsData);
// // //             } catch (error) {
// // //                 console.error('Error fetching data:', error);
// // //             }
// // //         };
// // //
// // //         fetchData();
// // //     }, []);
// // //
// // //     const handleInputChange = (e) => {
// // //         const { name, value, type, checked } = e.target;
// // //         setFormData(prevData => ({
// // //             ...prevData,
// // //             [name]: type === 'checkbox' ? checked : value
// // //         }));
// // //     };
// // //
// // //     const handleArrayInputChange = (e, index, field, subfield = null) => {
// // //         const { name, value } = e.target;
// // //         setFormData(prevData => {
// // //             const newArray = [...prevData[field]];
// // //             if (subfield) {
// // //                 newArray[index][subfield][name] = value;
// // //             } else {
// // //                 newArray[index][name] = value;
// // //             }
// // //             return { ...prevData, [field]: newArray };
// // //         });
// // //     };
// // //
// // //     const addArrayItem = (field, defaultItem) => {
// // //         setFormData(prevData => ({
// // //             ...prevData,
// // //             [field]: [...prevData[field], defaultItem]
// // //         }));
// // //     };
// // //
// // //     const removeArrayItem = (field, index) => {
// // //         setFormData(prevData => ({
// // //             ...prevData,
// // //             [field]: prevData[field].filter((_, i) => i !== index)
// // //         }));
// // //     };
// // //
// // //     const handleSubmit = async (e) => {
// // //         e.preventDefault();
// // //         try {
// // //             const response = await fetch('/api/products/', {
// // //                 method: 'POST',
// // //                 headers: {
// // //                     'Content-Type': 'application/json',
// // //                 },
// // //                 body: JSON.stringify(formData),
// // //             });
// // //             if (response.ok) {
// // //                 const result = await response.json();
// // //                 console.log('Product created:', result);
// // //                 // Handle successful creation (e.g., show success message, redirect)
// // //             } else {
// // //                 console.error('Failed to create product');
// // //                 // Handle error (e.g., show error message)
// // //             }
// // //         } catch (error) {
// // //             console.error('Error:', error);
// // //             // Handle error (e.g., show error message)
// // //         }
// // //     };
// // //
// // //     const renderStep = () => {
// // //         switch (step) {
// // //             case 1:
// // //                 return (
// // //                     <>
// // //                         <h3 className="text-xl font-semibold mb-4">Basic Information</h3>
// // //                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
// // //                             <div>
// // //                                 <label className="block mb-2">Name</label>
// // //                                 <input
// // //                                     type="text"
// // //                                     name="name"
// // //                                     value={formData.name}
// // //                                     onChange={handleInputChange}
// // //                                     className="w-full p-2 border rounded"
// // //                                     required
// // //                                 />
// // //                             </div>
// // //                             <div>
// // //                                 <label className="block mb-2">Slug</label>
// // //                                 <input
// // //                                     type="text"
// // //                                     name="slug"
// // //                                     value={formData.slug}
// // //                                     onChange={handleInputChange}
// // //                                     className="w-full p-2 border rounded"
// // //                                     required
// // //                                 />
// // //                             </div>
// // //                         </div>
// // //                         <div className="mt-4">
// // //                             <label className="block mb-2">Description</label>
// // //                             <textarea
// // //                                 name="description"
// // //                                 value={formData.description}
// // //                                 onChange={handleInputChange}
// // //                                 className="w-full p-2 border rounded"
// // //                                 rows="4"
// // //                                 required
// // //                             ></textarea>
// // //                         </div>
// // //                     </>
// // //                 );
// // //             case 2:
// // //                 return (
// // //                     <>
// // //                         <h3 className="text-xl font-semibold mb-4">Categories and Tags</h3>
// // //                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
// // //                             <div>
// // //                                 <label className="block mb-2">Categories</label>
// // //                                 <select
// // //                                     multiple
// // //                                     name="categories"
// // //                                     value={formData.categories}
// // //                                     onChange={(e) => setFormData(prev => ({ ...prev, categories: Array.from(e.target.selectedOptions, option => option.value) }))}
// // //                                     className="w-full p-2 border rounded"
// // //                                     required
// // //                                 >
// // //                                     {categories.map(category => (
// // //                                         <option key={category.id} value={category.id}>{category.name}</option>
// // //                                     ))}
// // //                                 </select>
// // //                             </div>
// // //                             <div>
// // //                                 <label className="block mb-2">Tags</label>
// // //                                 <select
// // //                                     multiple
// // //                                     name="tags"
// // //                                     value={formData.tags}
// // //                                     onChange={(e) => setFormData(prev => ({ ...prev, tags: Array.from(e.target.selectedOptions, option => option.value) }))}
// // //                                     className="w-full p-2 border rounded"
// // //                                 >
// // //                                     {tags.map(tag => (
// // //                                         <option key={tag.id} value={tag.id}>{tag.name}</option>
// // //                                     ))}
// // //                                 </select>
// // //                             </div>
// // //                         </div>
// // //                     </>
// // //                 );
// // //             case 3:
// // //                 return (
// // //                     <>
// // //                         <h3 className="text-xl font-semibold mb-4">Brand and Price</h3>
// // //                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
// // //                             <div>
// // //                                 <label className="block mb-2">Brand</label>
// // //                                 <select
// // //                                     name="brand"
// // //                                     value={formData.brand}
// // //                                     onChange={handleInputChange}
// // //                                     className="w-full p-2 border rounded"
// // //                                     required
// // //                                 >
// // //                                     <option value="">Select Brand</option>
// // //                                     {brands.map(brand => (
// // //                                         <option key={brand.id} value={brand.id}>{brand.name}</option>
// // //                                     ))}
// // //                                 </select>
// // //                             </div>
// // //                             <div>
// // //                                 <label className="block mb-2">Base Price</label>
// // //                                 <input
// // //                                     type="number"
// // //                                     name="base_price"
// // //                                     value={formData.base_price}
// // //                                     onChange={handleInputChange}
// // //                                     className="w-full p-2 border rounded"
// // //                                     step="0.01"
// // //                                     required
// // //                                 />
// // //                             </div>
// // //                         </div>
// // //                         <div className="mt-4">
// // //                             <label className="flex items-center">
// // //                                 <input
// // //                                     type="checkbox"
// // //                                     name="is_active"
// // //                                     checked={formData.is_active}
// // //                                     onChange={handleInputChange}
// // //                                     className="mr-2"
// // //                                 />
// // //                                 Active Product
// // //                             </label>
// // //                         </div>
// // //                     </>
// // //                 );
// // //             case 4:
// // //                 return (
// // //                     <>
// // //                         <h3 className="text-xl font-semibold mb-4">Images</h3>
// // //                         {formData.images.map((image, index) => (
// // //                             <div key={index} className="mb-4 p-4 border rounded">
// // //                                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
// // //                                     <div>
// // //                                         <label className="block mb-2">Image URL</label>
// // //                                         <input
// // //                                             type="text"
// // //                                             name="image"
// // //                                             value={image.image}
// // //                                             onChange={(e) => handleArrayInputChange(e, index, 'images')}
// // //                                             className="w-full p-2 border rounded"
// // //                                             required
// // //                                         />
// // //                                     </div>
// // //                                     <div>
// // //                                         <label className="block mb-2">Alt Text</label>
// // //                                         <input
// // //                                             type="text"
// // //                                             name="alt_text"
// // //                                             value={image.alt_text}
// // //                                             onChange={(e) => handleArrayInputChange(e, index, 'images')}
// // //                                             className="w-full p-2 border rounded"
// // //                                             required
// // //                                         />
// // //                                     </div>
// // //                                     <div className="flex items-center">
// // //                                         <label className="flex items-center">
// // //                                             <input
// // //                                                 type="checkbox"
// // //                                                 name="is_primary"
// // //                                                 checked={image.is_primary}
// // //                                                 onChange={(e) => handleArrayInputChange(e, index, 'images')}
// // //                                                 className="mr-2"
// // //                                             />
// // //                                             Primary Image
// // //                                         </label>
// // //                                         <button
// // //                                             type="button"
// // //                                             onClick={() => removeArrayItem('images', index)}
// // //                                             className="ml-auto text-red-600"
// // //                                         >
// // //                                             <Trash2 size={20} />
// // //                                         </button>
// // //                                     </div>
// // //                                 </div>
// // //                             </div>
// // //                         ))}
// // //                         <button
// // //                             type="button"
// // //                             onClick={() => addArrayItem('images', { image: '', alt_text: '', is_primary: false })}
// // //                             className="flex items-center text-blue-600"
// // //                         >
// // //                             <PlusCircle size={20} className="mr-2" />
// // //                             Add Image
// // //                         </button>
// // //                     </>
// // //                 );
// // //             case 5:
// // //                 return (
// // //                     <>
// // //                         <h3 className="text-xl font-semibold mb-4">Variants</h3>
// // //                         {formData.variants.map((variant, index) => (
// // //                             <div key={index} className="mb-6 p-4 border rounded">
// // //                                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
// // //                                     <div>
// // //                                         <label className="block mb-2">Name</label>
// // //                                         <input
// // //                                             type="text"
// // //                                             name="name"
// // //                                             value={variant.name}
// // //                                             onChange={(e) => handleArrayInputChange(e, index, 'variants')}
// // //                                             className="w-full p-2 border rounded"
// // //                                             required
// // //                                         />
// // //                                     </div>
// // //                                     <div>
// // //                                         <label className="block mb-2">SKU</label>
// // //                                         <input
// // //                                             type="text"
// // //                                             name="sku"
// // //                                             value={variant.sku}
// // //                                             onChange={(e) => handleArrayInputChange(e, index, 'variants')}
// // //                                             className="w-full p-2 border rounded"
// // //                                             required
// // //                                         />
// // //                                     </div>
// // //                                     <div>
// // //                                         <label className="block mb-2">Price Adjustment</label>
// // //                                         <input
// // //                                             type="number"
// // //                                             name="price_adjustment"
// // //                                             value={variant.price_adjustment}
// // //                                             onChange={(e) => handleArrayInputChange(e, index, 'variants')}
// // //                                             className="w-full p-2 border rounded"
// // //                                             step="0.01"
// // //                                             required
// // //                                         />
// // //                                     </div>
// // //                                     <div>
// // //                                         <label className="block mb-2">Weight (optional)</label>
// // //                                         <input
// // //                                             type="number"
// // //                                             name="weight"
// // //                                             value={variant.weight}
// // //                                             onChange={(e) => handleArrayInputChange(e, index, 'variants')}
// // //                                             className="w-full p-2 border rounded"
// // //                                             step="0.01"
// // //                                         />
// // //                                     </div>
// // //                                     <div>
// // //                                         <label className="block mb-2">Dimensions (optional)</label>
// // //                                         <input
// // //                                             type="text"
// // //                                             name="dimensions"
// // //                                             value={variant.dimensions}
// // //                                             onChange={(e) => handleArrayInputChange(e, index, 'variants')}
// // //                                             className="w-full p-2 border rounded"
// // //                                         />
// // //                                     </div>
// // //                                     <div className="flex items-center">
// // //                                         <label className="flex items-center">
// // //                                             <input
// // //                                                 type="checkbox"
// // //                                                 name="is_active"
// // //                                                 checked={variant.is_active}
// // //                                                 onChange={(e) => handleArrayInputChange(e, index, 'variants')}
// // //                                                 className="mr-2"
// // //                                             />
// // //                                             Active Variant
// // //                                         </label>
// // //                                         <button
// // //                                             type="button"
// // //                                             onClick={() => removeArrayItem('variants', index)}
// // //                                             className="ml-auto text-red-600"
// // //                                         >
// // //                                             <Trash2 size={20} />
// // //                                         </button>
// // //                                     </div>
// // //                                 </div>
// // //                                 <div className="mt-4">
// // //                                     <h4 className="font-semibold mb-2">Attribute Values</h4>
// // //                                     {variant.attribute_values.map((attr, attrIndex) => (
// // //                                         <div key={attrIndex} className="grid grid-cols-2 gap-4 mb-2">
// // //                                             <input
// // //                                                 type="text"
// // //                                                 name="attribute"
// // //                                                 value={attr.attribute}
// // //                                                 onChange={(e) => handleArrayInputChange(e, index, 'variants', 'attribute_values')}
// // //                                                 placeholder="Attribute"
// // //                                                 className="p-2 border rounded"
// // //                                             />
// // //                                             <input
// // //                                                 type="text"
// // //                                                 name="value"
// // //                                                 value={attr.value}
// // //                                                 onChange={(e) => handleArrayInputChange(e, index, 'variants', 'attribute_values')}
// // //                                                 placeholder="Value"
// // //                                                 className="p-2 border rounded"
// // //                                             />
// // //                                         </div>
// // //                                     ))}
// // //                                     <button
// // //                                         type="button"
// // //                                         onClick={() => {
// // //                                             const newVariants = [...formData.variants];
// // //                                             newVariants[index].attribute_values.push({ attribute: '', value: '' });
// // //                                             setFormData({ ...formData, variants: newVariants });
// // //                                         }}
// // //                                         className="flex items-center text-blue-600 mt-2"
// // //                                     >
// // //                                         <PlusCircle size={16} className="mr-2" />
// // //                                         Add Attribute
// // //                                     </button>
// // //                                 </div>
// // //                             </div>
// // //                         ))}
// // //                         <button
// // //                             type="button"
// // //                             onClick={() => addArrayItem('variants', { name: '', sku: '', price_adjustment: '0', weight: '', dimensions: '', is_active: true, attribute_values: [] })}
// // //                             className="flex items-center text-blue-600"
// // //                         >
// // //                             <PlusCircle size={20} className="mr-2" />
// // //                             Add Variant
// // //                         </button>
// // //                     </>
// // //                 );
// // //             default:
// // //                 return null;
// // //         }
// // //     };
// // //     return (
// // //         <form onSubmit={handleSubmit} className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg">
// // //             <h2 className="text-2xl font-bold mb-6">Create New Product</h2>
// // //
// // //             {renderStep()}
// // //
// // //             <div className="mt-8 flex justify-between">
// // //                 {step > 1 && (
// // //                     <button
// // //                         type="button"
// // //                         onClick={() => setStep(step - 1)}
// // //                         className="flex items-center px-4 py-2 bg-gray-200 rounded"
// // //                     >
// // //                         <ArrowLeft size={20} className="mr-2" />
// // //                         Previous
// // //                     </button>
// // //                 )}
// // //                 {step < 5 ? (
// // //                     <button
// // //                         type="button"
// // //                         onClick={() => setStep(step + 1)}
// // //                         className="flex items-center px-4 py-2 bg-blue-500 text-white rounded ml-auto"
// // //                     >
// // //                         Next
// // //                         <ArrowRight size={20} className="ml-2" />
// // //                     </button>
// // //                 ) : (
// // //                     <button
// // //                         type="submit"
// // //                         className="flex items-center px-4 py-2 bg-green-500 text-white rounded ml-auto"
// // //                     >
// // //                         Create Product
// // //                     </button>
// // //                 )}
// // //             </div>
// // //         </form>
// // //     );
// // // };
// // // //
// // // // export default MultiStepProductCreateForm;
// // // const ProductCreatePage = () => {
// // //     return (
// // //         <div className="container mx-auto py-8">
// // //             <h1 className="text-3xl font-bold mb-8">Create a New Product</h1>
// // //             <MultiStepProductCreateForm />
// // //         </div>
// // //     );
// // // };
// // //
// // // export default ProductCreatePage;
// // // // import React, { useState } from 'react';
// // // // import { Formik, Form, Field, FieldArray } from 'formik';
// // // // import { TextField, Button, Switch, FormControlLabel, Grid, Typography, Box } from '@mui/material';
// // // // import { motion } from 'framer-motion';
// // // // import * as Yup from 'yup';
// // // // import axios from 'axios';
// // // //
// // // // const validationSchema = Yup.object().shape({
// // // //     name: Yup.string().required('Required'),
// // // //     slug: Yup.string().required('Required'),
// // // //     description: Yup.string().required('Required'),
// // // //     brand: Yup.string().required('Required'),
// // // //     categories: Yup.array().of(Yup.string()).min(1, 'At least one category is required'),
// // // //     tags: Yup.array().of(Yup.string()),
// // // //     base_price: Yup.number().positive('Must be positive').required('Required'),
// // // //     is_active: Yup.boolean(),
// // // //     images: Yup.array().of(
// // // //         Yup.object().shape({
// // // //             image: Yup.string().required('Image is required'),
// // // //             alt_text: Yup.string().required('Alt text is required'),
// // // //             is_primary: Yup.boolean()
// // // //         })
// // // //     ),
// // // //     variants: Yup.array().of(
// // // //         Yup.object().shape({
// // // //             name: Yup.string().required('Required'),
// // // //             sku: Yup.string().required('Required'),
// // // //             price_adjustment: Yup.number().required('Required'),
// // // //             weight: Yup.number().positive('Must be positive'),
// // // //             dimensions: Yup.string(),
// // // //             is_active: Yup.boolean(),
// // // //             attribute_values: Yup.array().of(
// // // //                 Yup.object().shape({
// // // //                     attribute: Yup.string().required('Required'),
// // // //                     value: Yup.string().required('Required')
// // // //                 })
// // // //             )
// // // //         })
// // // //     )
// // // // });
// // // //
// // // // const initialValues = {
// // // //     name: '',
// // // //     slug: '',
// // // //     description: '',
// // // //     brand: '',
// // // //     categories: [''],
// // // //     tags: [''],
// // // //     base_price: '',
// // // //     is_active: true,
// // // //     images: [{ image: '', alt_text: '', is_primary: false }],
// // // //     variants: [{
// // // //         name: '',
// // // //         sku: '',
// // // //         price_adjustment: '0',
// // // //         weight: '',
// // // //         dimensions: '',
// // // //         is_active: true,
// // // //         attribute_values: [{ attribute: '', value: '' }]
// // // //     }]
// // // // };
// // // //
// // // // export default function ProductManagement() {
// // // //     const [isSubmitting, setIsSubmitting] = useState(false);
// // // //     const [submitError, setSubmitError] = useState(null);
// // // //
// // // //     const handleSubmit = async (values, { setSubmitting, resetForm }) => {
// // // //         setIsSubmitting(true);
// // // //         setSubmitError(null);
// // // //         try {
// // // //             const response = await axios.post('/api/products/', values);
// // // //             console.log('Product created:', response.data);
// // // //             resetForm();
// // // //             // Show success message or redirect
// // // //         } catch (error) {
// // // //             console.error('Error creating product:', error);
// // // //             setSubmitError('An error occurred while creating the product. Please try again.');
// // // //         } finally {
// // // //             setIsSubmitting(false);
// // // //             setSubmitting(false);
// // // //         }
// // // //     };
// // // //
// // // //     return (
// // // //         <motion.div
// // // //             initial={{ opacity: 0 }}
// // // //             animate={{ opacity: 1 }}
// // // //             transition={{ duration: 0.5 }}
// // // //             className="container mx-auto p-4"
// // // //         >
// // // //             <Typography variant="h4" component="h1" gutterBottom>
// // // //                 Create New Product
// // // //             </Typography>
// // // //             <Formik
// // // //                 initialValues={initialValues}
// // // //                 validationSchema={validationSchema}
// // // //                 onSubmit={handleSubmit}
// // // //             >
// // // //                 {({ errors, touched, values }) => (
// // // //                     <Form>
// // // //                         <Grid container spacing={3}>
// // // //                             <Grid item xs={12} md={6}>
// // // //                                 <Field
// // // //                                     as={TextField}
// // // //                                     fullWidth
// // // //                                     name="name"
// // // //                                     label="Product Name"
// // // //                                     error={touched.name && errors.name}
// // // //                                     helperText={touched.name && errors.name}
// // // //                                 />
// // // //                             </Grid>
// // // //                             <Grid item xs={12} md={6}>
// // // //                                 <Field
// // // //                                     as={TextField}
// // // //                                     fullWidth
// // // //                                     name="slug"
// // // //                                     label="Slug"
// // // //                                     error={touched.slug && errors.slug}
// // // //                                     helperText={touched.slug && errors.slug}
// // // //                                 />
// // // //                             </Grid>
// // // //                             <Grid item xs={12}>
// // // //                                 <Field
// // // //                                     as={TextField}
// // // //                                     fullWidth
// // // //                                     multiline
// // // //                                     rows={4}
// // // //                                     name="description"
// // // //                                     label="Description"
// // // //                                     error={touched.description && errors.description}
// // // //                                     helperText={touched.description && errors.description}
// // // //                                 />
// // // //                             </Grid>
// // // //                             <Grid item xs={12} md={6}>
// // // //                                 <Field
// // // //                                     as={TextField}
// // // //                                     fullWidth
// // // //                                     name="brand"
// // // //                                     label="Brand"
// // // //                                     error={touched.brand && errors.brand}
// // // //                                     helperText={touched.brand && errors.brand}
// // // //                                 />
// // // //                             </Grid>
// // // //                             <Grid item xs={12} md={6}>
// // // //                                 <Field
// // // //                                     as={TextField}
// // // //                                     fullWidth
// // // //                                     name="base_price"
// // // //                                     label="Base Price"
// // // //                                     type="number"
// // // //                                     error={touched.base_price && errors.base_price}
// // // //                                     helperText={touched.base_price && errors.base_price}
// // // //                                 />
// // // //                             </Grid>
// // // //                             <Grid item xs={12}>
// // // //                                 <FormControlLabel
// // // //                                     control={
// // // //                                         <Field as={Switch} name="is_active" color="primary" />
// // // //                                     }
// // // //                                     label="Active"
// // // //                                 />
// // // //                             </Grid>
// // // //
// // // //                             <Grid item xs={12}>
// // // //                                 <Typography variant="h6">Categories</Typography>
// // // //                                 <FieldArray name="categories">
// // // //                                     {(arrayHelpers) => (
// // // //                                         <div>
// // // //                                             {values.categories.map((category, index) => (
// // // //                                                 <Box key={index} className="flex items-center mb-2">
// // // //                                                     <Field
// // // //                                                         as={TextField}
// // // //                                                         name={`categories.${index}`}
// // // //                                                         label={`Category ${index + 1}`}
// // // //                                                         className="mr-2"
// // // //                                                     />
// // // //                                                     <Button
// // // //                                                         type="button"
// // // //                                                         onClick={() => arrayHelpers.remove(index)}
// // // //                                                         variant="outlined"
// // // //                                                         color="secondary"
// // // //                                                     >
// // // //                                                         Remove
// // // //                                                     </Button>
// // // //                                                 </Box>
// // // //                                             ))}
// // // //                                             <Button
// // // //                                                 type="button"
// // // //                                                 onClick={() => arrayHelpers.push('')}
// // // //                                                 variant="outlined"
// // // //                                             >
// // // //                                                 Add Category
// // // //                                             </Button>
// // // //                                         </div>
// // // //                                     )}
// // // //                                 </FieldArray>
// // // //                             </Grid>
// // // //
// // // //                             <Grid item xs={12}>
// // // //                                 <Typography variant="h6">Tags</Typography>
// // // //                                 <FieldArray name="tags">
// // // //                                     {(arrayHelpers) => (
// // // //                                         <div>
// // // //                                             {values.tags.map((tag, index) => (
// // // //                                                 <Box key={index} className="flex items-center mb-2">
// // // //                                                     <Field
// // // //                                                         as={TextField}
// // // //                                                         name={`tags.${index}`}
// // // //                                                         label={`Tag ${index + 1}`}
// // // //                                                         className="mr-2"
// // // //                                                     />
// // // //                                                     <Button
// // // //                                                         type="button"
// // // //                                                         onClick={() => arrayHelpers.remove(index)}
// // // //                                                         variant="outlined"
// // // //                                                         color="secondary"
// // // //                                                     >
// // // //                                                         Remove
// // // //                                                     </Button>
// // // //                                                 </Box>
// // // //                                             ))}
// // // //                                             <Button
// // // //                                                 type="button"
// // // //                                                 onClick={() => arrayHelpers.push('')}
// // // //                                                 variant="outlined"
// // // //                                             >
// // // //                                                 Add Tag
// // // //                                             </Button>
// // // //                                         </div>
// // // //                                     )}
// // // //                                 </FieldArray>
// // // //                             </Grid>
// // // //
// // // //                             <Grid item xs={12}>
// // // //                                 <Typography variant="h6">Images</Typography>
// // // //                                 <FieldArray name="images">
// // // //                                     {(arrayHelpers) => (
// // // //                                         <div>
// // // //                                             {values.images.map((image, index) => (
// // // //                                                 <Box key={index} className="mb-4 p-4 border rounded">
// // // //                                                     <Field
// // // //                                                         as={TextField}
// // // //                                                         fullWidth
// // // //                                                         name={`images.${index}.image`}
// // // //                                                         label="Image URL"
// // // //                                                         className="mb-2"
// // // //                                                     />
// // // //                                                     <Field
// // // //                                                         as={TextField}
// // // //                                                         fullWidth
// // // //                                                         name={`images.${index}.alt_text`}
// // // //                                                         label="Alt Text"
// // // //                                                         className="mb-2"
// // // //                                                     />
// // // //                                                     <FormControlLabel
// // // //                                                         control={
// // // //                                                             <Field
// // // //                                                                 as={Switch}
// // // //                                                                 name={`images.${index}.is_primary`}
// // // //                                                                 color="primary"
// // // //                                                             />
// // // //                                                         }
// // // //                                                         label="Primary Image"
// // // //                                                     />
// // // //                                                     <Button
// // // //                                                         type="button"
// // // //                                                         onClick={() => arrayHelpers.remove(index)}
// // // //                                                         variant="outlined"
// // // //                                                         color="secondary"
// // // //                                                     >
// // // //                                                         Remove Image
// // // //                                                     </Button>
// // // //                                                 </Box>
// // // //                                             ))}
// // // //                                             <Button
// // // //                                                 type="button"
// // // //                                                 onClick={() => arrayHelpers.push({ image: '', alt_text: '', is_primary: false })}
// // // //                                                 variant="outlined"
// // // //                                             >
// // // //                                                 Add Image
// // // //                                             </Button>
// // // //                                         </div>
// // // //                                     )}
// // // //                                 </FieldArray>
// // // //                             </Grid>
// // // //
// // // //                             <Grid item xs={12}>
// // // //                                 <Typography variant="h6">Variants</Typography>
// // // //                                 <FieldArray name="variants">
// // // //                                     {(arrayHelpers) => (
// // // //                                         <div>
// // // //                                             {values.variants.map((variant, index) => (
// // // //                                                 <Box key={index} className="mb-4 p-4 border rounded">
// // // //                                                     <Grid container spacing={2}>
// // // //                                                         <Grid item xs={12} sm={6}>
// // // //                                                             <Field
// // // //                                                                 as={TextField}
// // // //                                                                 fullWidth
// // // //                                                                 name={`variants.${index}.name`}
// // // //                                                                 label="Variant Name"
// // // //                                                             />
// // // //                                                         </Grid>
// // // //                                                         <Grid item xs={12} sm={6}>
// // // //                                                             <Field
// // // //                                                                 as={TextField}
// // // //                                                                 fullWidth
// // // //                                                                 name={`variants.${index}.sku`}
// // // //                                                                 label="SKU"
// // // //                                                             />
// // // //                                                         </Grid>
// // // //                                                         <Grid item xs={12} sm={6}>
// // // //                                                             <Field
// // // //                                                                 as={TextField}
// // // //                                                                 fullWidth
// // // //                                                                 name={`variants.${index}.price_adjustment`}
// // // //                                                                 label="Price Adjustment"
// // // //                                                                 type="number"
// // // //                                                             />
// // // //                                                         </Grid>
// // // //                                                         <Grid item xs={12} sm={6}>
// // // //                                                             <Field
// // // //                                                                 as={TextField}
// // // //                                                                 fullWidth
// // // //                                                                 name={`variants.${index}.weight`}
// // // //                                                                 label="Weight"
// // // //                                                                 type="number"
// // // //                                                             />
// // // //                                                         </Grid>
// // // //                                                         <Grid item xs={12}>
// // // //                                                             <Field
// // // //                                                                 as={TextField}
// // // //                                                                 fullWidth
// // // //                                                                 name={`variants.${index}.dimensions`}
// // // //                                                                 label="Dimensions"
// // // //                                                             />
// // // //                                                         </Grid>
// // // //                                                         <Grid item xs={12}>
// // // //                                                             <FormControlLabel
// // // //                                                                 control={
// // // //                                                                     <Field
// // // //                                                                         as={Switch}
// // // //                                                                         name={`variants.${index}.is_active`}
// // // //                                                                         color="primary"
// // // //                                                                     />
// // // //                                                                 }
// // // //                                                                 label="Active"
// // // //                                                             />
// // // //                                                         </Grid>
// // // //                                                     </Grid>
// // // //
// // // //                                                     <Typography variant="subtitle1" className="mt-4 mb-2">Attribute Values</Typography>
// // // //                                                     <FieldArray name={`variants.${index}.attribute_values`}>
// // // //                                                         {(attrArrayHelpers) => (
// // // //                                                             <div>
// // // //                                                                 {variant.attribute_values.map((attr, attrIndex) => (
// // // //                                                                     <Box key={attrIndex} className="flex items-center mb-2">
// // // //                                                                         <Field
// // // //                                                                             as={TextField}
// // // //                                                                             name={`variants.${index}.attribute_values.${attrIndex}.attribute`}
// // // //                                                                             label="Attribute"
// // // //                                                                             className="mr-2"
// // // //                                                                         />
// // // //                                                                         <Field
// // // //                                                                             as={TextField}
// // // //                                                                             name={`variants.${index}.attribute_values.${attrIndex}.value`}
// // // //                                                                             label="Value"
// // // //                                                                             className="mr-2"
// // // //                                                                         />
// // // //                                                                         <Button
// // // //                                                                             type="button"
// // // //                                                                             onClick={() => attrArrayHelpers.remove(attrIndex)}
// // // //                                                                             variant="outlined"
// // // //                                                                             color="secondary"
// // // //                                                                         >
// // // //                                                                             Remove
// // // //                                                                         </Button>
// // // //                                                                     </Box>
// // // //                                                                 ))}
// // // //                                                                 <Button
// // // //                                                                     type="button"
// // // //                                                                     onClick={() => attrArrayHelpers.push({ attribute: '', value: '' })}
// // // //                                                                     variant="outlined"
// // // //                                                                 >
// // // //                                                                     Add Attribute
// // // //                                                                 </Button>
// // // //                                                             </div>
// // // //                                                         )}
// // // //                                                     </FieldArray>
// // // //
// // // //                                                     <Button
// // // //                                                         type="button"
// // // //                                                         onClick={() => arrayHelpers.remove(index)}
// // // //                                                         variant="outlined"
// // // //                                                         color="secondary"
// // // //                                                         className="mt-4"
// // // //                                                     >
// // // //                                                         Remove Variant
// // // //                                                     </Button>
// // // //                                                 </Box>
// // // //                                             ))}
// // // //                                             <Button
// // // //                                                 type="button"
// // // //                                                 onClick={() => arrayHelpers.push({
// // // //                                                     name: '',
// // // //                                                     sku: '',
// // // //                                                     price_adjustment: '0',
// // // //                                                     weight: '',
// // // //                                                     dimensions: '',
// // // //                                                     is_active: true,
// // // //                                                     attribute_values: [{ attribute: '', value: '' }]
// // // //                                                 })}
// // // //                                                 variant="outlined"
// // // //                                             >
// // // //                                                 Add Variant
// // // //                                             </Button>
// // // //                                         </div>
// // // //                                     )}
// // // //                                 </FieldArray>
// // // //                             </Grid>
// // // //
// // // //                             <Grid item xs={12}>
// // // //                                 <Button type="submit" variant="contained" color="primary" disabled={isSubmitting}>
// // // //                                     Create Product
// // // //                                 </Button>
// // // //                             </Grid>
// // // //                         </Grid>
// // // //                     </Form>
// // // //                 )}
// // // //             </Formik>
// // // //             {submitError && (
// // // //                 <Typography color="error" className="mt-4">
// // // //                     {submitError}
// // // //                 </Typography>
// // // //             )}
// // // //         </motion.div>
// // // //     );
// // // // }