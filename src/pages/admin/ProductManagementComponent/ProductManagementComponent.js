import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
    Button, TextField, Select, MenuItem, Checkbox,
    FormControlLabel, Grid, Paper, Typography, IconButton,
    Chip, ListItemText
} from '@mui/material';
import { styled } from '@mui/system';
import { FaPlus, FaMinus, FaUpload, FaTrash, FaEdit } from 'react-icons/fa';

const API_URL = 'http://127.0.0.1:8000';

const StyledPaper = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(3),
    marginBottom: theme.spacing(3),
}));

const StyledButton = styled(Button)(({ theme }) => ({
    margin: theme.spacing(1),
}));

const ImagePreview = styled('img')({
    width: '100px',
    height: '100px',
    objectFit: 'cover',
    margin: '10px',
});

const ProductForm = ({ product, onSubmit, categories, productTypes, brands, attributes }) => {
    const [formData, setFormData] = useState(product || {
        name: '',
        description: '',
        price: '',
        product_type_id: '',
        brand_id: '',
        category_ids: [],
        tags: [],
        variants: [{
            name: '',
            price_adjustment: 0,
            stock_quantity: 0,
            attribute_values: []
        }],
        images_data: [{
            image: null,
            alt_text: '',
            is_primary: false,
            order: 1
        }],
        related_products: []
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleCategoryChange = (e) => {
        const { value } = e.target;
        setFormData({ ...formData, category_ids: value });
    };

    const handleTagAdd = (tag) => {
        setFormData({
            ...formData,
            tags: [...formData.tags, { name: tag, description: '' }]
        });
    };

    const handleTagRemove = (index) => {
        const newTags = [...formData.tags];
        newTags.splice(index, 1);
        setFormData({ ...formData, tags: newTags });
    };

    const handleVariantChange = (index, field, value) => {
        const newVariants = [...formData.variants];
        newVariants[index] = { ...newVariants[index], [field]: value };
        setFormData({ ...formData, variants: newVariants });
    };

    const handleAttributeValueChange = (variantIndex, attributeId, value) => {
        const newVariants = [...formData.variants];
        const attributeValueIndex = newVariants[variantIndex].attribute_values.findIndex(av => av.attribute_id === attributeId);
        if (attributeValueIndex > -1) {
            newVariants[variantIndex].attribute_values[attributeValueIndex].value = value;
        } else {
            newVariants[variantIndex].attribute_values.push({ attribute_id: attributeId, value });
        }
        setFormData({ ...formData, variants: newVariants });
    };

    const handleImageChange = (e, index) => {
        const newImagesData = [...formData.images_data];
        newImagesData[index] = {
            ...newImagesData[index],
            image: e.target.files[0]
        };
        setFormData({ ...formData, images_data: newImagesData });
    };

    const handleImageInputChange = (index, field, value) => {
        const newImagesData = [...formData.images_data];
        newImagesData[index] = { ...newImagesData[index], [field]: value };
        setFormData({ ...formData, images_data: newImagesData });
    };

    const addVariant = () => {
        setFormData({
            ...formData,
            variants: [
                ...formData.variants,
                { name: '', price_adjustment: 0, stock_quantity: 0, attribute_values: [] }
            ]
        });
    };

    const removeVariant = (index) => {
        const newVariants = [...formData.variants];
        newVariants.splice(index, 1);
        setFormData({ ...formData, variants: newVariants });
    };

    const addImageField = () => {
        setFormData({
            ...formData,
            images_data: [
                ...formData.images_data,
                { image: null, alt_text: '', is_primary: false, order: formData.images_data.length + 1 }
            ]
        });
    };

    const removeImageField = (index) => {
        const newImagesData = [...formData.images_data];
        newImagesData.splice(index, 1);
        setFormData({ ...formData, images_data: newImagesData });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                    <TextField
                        fullWidth
                        label="Name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        fullWidth
                        label="Price"
                        name="price"
                        type="number"
                        value={formData.price}
                        onChange={handleChange}
                        required
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        multiline
                        rows={4}
                        label="Description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        required
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Select
                        fullWidth
                        label="Product Type"
                        name="product_type_id"
                        value={formData.product_type_id}
                        onChange={handleChange}
                        required
                    >
                        {productTypes.map((type) => (
                            <MenuItem key={type.id} value={type.id}>{type.name}</MenuItem>
                        ))}
                    </Select>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Select
                        fullWidth
                        label="Brand"
                        name="brand_id"
                        value={formData.brand_id}
                        onChange={handleChange}
                        required
                    >
                        {brands.map((brand) => (
                            <MenuItem key={brand.id} value={brand.id}>{brand.name}</MenuItem>
                        ))}
                    </Select>
                </Grid>
                <Grid item xs={12}>
                    <Select
                        multiple
                        fullWidth
                        label="Categories"
                        name="category_ids"
                        value={formData.category_ids}
                        onChange={handleCategoryChange}
                        renderValue={(selected) => (
                            <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                                {selected.map((value) => (
                                    <Chip key={value} label={categories.find(c => c.id === value)?.name} style={{ margin: 2 }} />
                                ))}
                            </div>
                        )}
                    >
                        {categories.map((category) => (
                            <MenuItem key={category.id} value={category.id}>
                                <Checkbox checked={formData.category_ids.indexOf(category.id) > -1} />
                                <ListItemText primary={category.name} />
                            </MenuItem>
                        ))}
                    </Select>
                </Grid>
                <Grid item xs={12}>
                    <Typography variant="h6">Tags</Typography>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                        {formData.tags.map((tag, index) => (
                            <Chip
                                key={index}
                                label={tag.name}
                                onDelete={() => handleTagRemove(index)}
                            />
                        ))}
                    </div>
                    <TextField
                        label="Add Tag"
                        onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                                handleTagAdd(e.target.value);
                                e.target.value = '';
                            }
                        }}
                    />
                </Grid>
                <Grid item xs={12}>
                    <Typography variant="h6">Variants</Typography>
                    {formData.variants.map((variant, index) => (
                        <Paper key={index} style={{ padding: '16px', marginBottom: '16px' }}>
                            <TextField
                                fullWidth
                                label="Variant Name"
                                value={variant.name}
                                onChange={(e) => handleVariantChange(index, 'name', e.target.value)}
                            />
                            <TextField
                                label="Price Adjustment"
                                type="number"
                                value={variant.price_adjustment}
                                onChange={(e) => handleVariantChange(index, 'price_adjustment', e.target.value)}
                            />
                            <TextField
                                label="Stock Quantity"
                                type="number"
                                value={variant.stock_quantity}
                                onChange={(e) => handleVariantChange(index, 'stock_quantity', e.target.value)}
                            />
                            {attributes.map((attribute) => (
                                <TextField
                                    key={attribute.id}
                                    label={attribute.name}
                                    value={variant.attribute_values.find(av => av.attribute_id === attribute.id)?.value || ''}
                                    onChange={(e) => handleAttributeValueChange(index, attribute.id, e.target.value)}
                                />
                            ))}
                            <IconButton onClick={() => removeVariant(index)}>
                                <FaMinus />
                            </IconButton>
                        </Paper>
                    ))}
                    <StyledButton
                        variant="contained"
                        color="primary"
                        onClick={addVariant}
                        startIcon={<FaPlus />}
                    >
                        Add Variant
                    </StyledButton>
                </Grid>
                <Grid item xs={12}>
                    <Typography variant="h6">Product Images</Typography>
                    {formData.images_data.map((imageData, index) => (
                        <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
                            {imageData.image && <ImagePreview src={URL.createObjectURL(imageData.image)} alt="Preview" />}
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleImageChange(e, index)}
                            />
                            <TextField
                                label="Alt Text"
                                value={imageData.alt_text}
                                onChange={(e) => handleImageInputChange(index, 'alt_text', e.target.value)}
                            />
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={imageData.is_primary}
                                        onChange={(e) => handleImageInputChange(index, 'is_primary', e.target.checked)}
                                    />
                                }
                                label="Primary Image"
                            />
                            <IconButton onClick={() => removeImageField(index)}>
                                <FaTrash />
                            </IconButton>
                        </div>
                    ))}
                    <StyledButton
                        variant="contained"
                        color="primary"
                        onClick={addImageField}
                        startIcon={<FaPlus />}
                    >
                        Add Image
                    </StyledButton>
                </Grid>
                <Grid item xs={12}>
                    <StyledButton
                        variant="contained"
                        color="primary"
                        type="submit"
                        startIcon={<FaUpload />}
                    >
                        Submit Product
                    </StyledButton>
                </Grid>
            </Grid>
        </form>
    );
};

const ProductManagement = () => {
    const [products, setProducts] = useState([]);
    const [productTypes, setProductTypes] = useState([]);
    const [brands, setBrands] = useState([]);
    const [categories, setCategories] = useState([]);
    const [attributes, setAttributes] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [productsRes, productTypesRes, brandsRes, categoriesRes, attributesRes] = await Promise.all([
                    axios.get(`${API_URL}/products/`),
                    axios.get(`${API_URL}/product-types/`),
                    axios.get(`${API_URL}/brands/`),
                    axios.get(`${API_URL}/categories/`),
                    axios.get(`${API_URL}/attributes/`)
                ]);
                console.log(productsRes.data.results,'----------------products')
                setProducts(productsRes.data.results);
                setProductTypes(productTypesRes.data.results);
                setBrands(brandsRes.data.results);
                setCategories(categoriesRes.data.results);
                setAttributes(attributesRes.data.results);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    const handleProductSubmit = async (formData) => {
        const formDataToSend = new FormData();
        Object.keys(formData).forEach(key => {
            if (key === 'images_data') {
                formData.images_data.forEach((imgData, index) => {
                    if (imgData.image) {
                        formDataToSend.append(`images_data[${index}][image]`, imgData.image);
                    }
                    formDataToSend.append(`images_data[${index}][alt_text]`, imgData.alt_text);
                    formDataToSend.append(`images_data[${index}][is_primary]`, imgData.is_primary);
                    formDataToSend.append(`images_data[${index}][order]`, imgData.order);
                });
            } else if (Array.isArray(formData[key])) {
                formData[key].forEach((item, index) => {
                    formDataToSend.append(`${key}[${index}]`, JSON.stringify(item));
                });
            } else {
                formDataToSend.append(key, JSON.stringify(formData[key]));
            }
        });

        try {
            if (formData.id) {
                await axios.put(`${API_URL}/products/${formData.id}/`, formDataToSend, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });
            } else {
                await axios.post(`${API_URL}/products/`, formDataToSend, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });
            }
            // Reload products list after successful submit
            const productsRes = await axios.get(`${API_URL}/products/`);
            setProducts(productsRes.data);
        } catch (error) {
            console.error('Failed to submit product', error);
        }
    };

    const handleDeleteProduct = async (productId) => {
        try {
            await axios.delete(`${API_URL}/products/${productId}/`);
            // Remove the deleted product from the state
            setProducts(products.filter(product => product.id !== productId));
        } catch (error) {
            console.error('Failed to delete product', error);
        }
    };

    return (
        <div style={{ padding: '24px' }}>
            <Typography variant="h4" gutterBottom>Manage Products</Typography>
            <ProductForm
                onSubmit={handleProductSubmit}
                categories={categories}
                productTypes={productTypes}
                brands={brands}
                attributes={attributes}
            />

            <Typography variant="h5" gutterBottom>Product List</Typography>
            {Array.isArray(products) && products.length > 0 ? (
            <Grid container spacing={3}>
                {products.map(product => (
                    <Grid item xs={12} sm={6} md={4} key={product.id}>
                        <StyledPaper elevation={3}>
                            <Typography variant="h6">{product.name}</Typography>
                            <Typography>Price: ${product.price}</Typography>
                            <Typography>Type: {product.product_type?.name}</Typography>
                            <Typography>Brand: {product.brand?.name}</Typography>
                            <div style={{ display: 'flex', gap: '8px' }}>
                                <StyledButton
                                    variant="contained"
                                    color="primary"
                                    startIcon={<FaEdit />}
                                    onClick={() => navigate(`/products/edit/${product.id}`)}
                                >
                                    Edit
                                </StyledButton>
                                <StyledButton
                                    variant="contained"
                                    color="secondary"
                                    startIcon={<FaTrash />}
                                    onClick={() => handleDeleteProduct(product.id)}
                                >
                                    Delete
                                </StyledButton>
                            </div>
                        </StyledPaper>
                    </Grid>
                ))}
            </Grid>) : (
                <Typography>No products available.</Typography>
            )}
        </div>
    );
};

export default ProductManagement;
// import React, { useState, useEffect } from 'react';
// import { useNavigate, useParams } from 'react-router-dom';
// import axios from 'axios';
// import {
//     Button, TextField, Select, MenuItem, Checkbox,
//     FormControlLabel, Grid, Paper, Typography, IconButton,
//     Chip, List, ListItem, ListItemText
// } from '@mui/material';
// import { styled } from '@mui/system';
// import { FaPlus, FaMinus, FaUpload, FaTrash, FaEdit } from 'react-icons/fa';
//
// const API_URL = 'http://127.0.0.1:8000';
//
// const StyledPaper = styled(Paper)(({ theme }) => ({
//     padding: theme.spacing(3),
//     marginBottom: theme.spacing(3),
// }));
//
// const StyledButton = styled(Button)(({ theme }) => ({
//     margin: theme.spacing(1),
// }));
//
// const ImagePreview = styled('img')({
//     width: '100px',
//     height: '100px',
//     objectFit: 'cover',
//     margin: '10px',
// });
//
// const ProductForm = ({ product, onSubmit, categories, productTypes, brands, attributes }) => {
//     const [formData, setFormData] = useState(product || {
//         name: '',
//         description: '',
//         price: '',
//         product_type_id: '',
//         brand_id: '',
//         category_ids: [],
//         tags: [],
//         variants: [{
//             name: '',
//             price_adjustment: 0,
//             stock_quantity: 0,
//             attribute_values: []
//         }],
//         images_data: [{
//             image: null,
//             alt_text: '',
//             is_primary: false,
//             order: 1
//         }],
//         related_products: []
//     });
//
//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         setFormData({ ...formData, [name]: value });
//     };
//
//     const handleCategoryChange = (e) => {
//         const { value } = e.target;
//         setFormData({ ...formData, category_ids: value });
//     };
//
//     const handleTagAdd = (tag) => {
//         setFormData({
//             ...formData,
//             tags: [...formData.tags, { name: tag, description: '' }]
//         });
//     };
//
//     const handleTagRemove = (index) => {
//         const newTags = [...formData.tags];
//         newTags.splice(index, 1);
//         setFormData({ ...formData, tags: newTags });
//     };
//
//     const handleVariantChange = (index, field, value) => {
//         const newVariants = [...formData.variants];
//         newVariants[index] = { ...newVariants[index], [field]: value };
//         setFormData({ ...formData, variants: newVariants });
//     };
//
//     const handleAttributeValueChange = (variantIndex, attributeId, value) => {
//         const newVariants = [...formData.variants];
//         const attributeValueIndex = newVariants[variantIndex].attribute_values.findIndex(av => av.attribute_id === attributeId);
//         if (attributeValueIndex > -1) {
//             newVariants[variantIndex].attribute_values[attributeValueIndex].value = value;
//         } else {
//             newVariants[variantIndex].attribute_values.push({ attribute_id: attributeId, value });
//         }
//         setFormData({ ...formData, variants: newVariants });
//     };
//
//     const handleImageChange = (e, index) => {
//         const newImagesData = [...formData.images_data];
//         newImagesData[index] = {
//             ...newImagesData[index],
//             image: e.target.files[0]
//         };
//         setFormData({ ...formData, images_data: newImagesData });
//     };
//
//     const handleImageInputChange = (index, field, value) => {
//         const newImagesData = [...formData.images_data];
//         newImagesData[index] = { ...newImagesData[index], [field]: value };
//         setFormData({ ...formData, images_data: newImagesData });
//     };
//
//     const addVariant = () => {
//         setFormData({
//             ...formData,
//             variants: [
//                 ...formData.variants,
//                 { name: '', price_adjustment: 0, stock_quantity: 0, attribute_values: [] }
//             ]
//         });
//     };
//
//     const removeVariant = (index) => {
//         const newVariants = [...formData.variants];
//         newVariants.splice(index, 1);
//         setFormData({ ...formData, variants: newVariants });
//     };
//
//     const addImageField = () => {
//         setFormData({
//             ...formData,
//             images_data: [
//                 ...formData.images_data,
//                 { image: null, alt_text: '', is_primary: false, order: formData.images_data.length + 1 }
//             ]
//         });
//     };
//
//     const removeImageField = (index) => {
//         const newImagesData = [...formData.images_data];
//         newImagesData.splice(index, 1);
//         setFormData({ ...formData, images_data: newImagesData });
//     };
//
//     const handleSubmit = (e) => {
//         e.preventDefault();
//         onSubmit(formData);
//     };
//
//     return (
//         <form onSubmit={handleSubmit} className="space-y-6">
//             <Grid container spacing={3}>
//                 <Grid item xs={12} sm={6}>
//                     <TextField
//                         fullWidth
//                         label="Name"
//                         name="name"
//                         value={formData.name}
//                         onChange={handleChange}
//                         required
//                     />
//                 </Grid>
//                 <Grid item xs={12} sm={6}>
//                     <TextField
//                         fullWidth
//                         label="Price"
//                         name="price"
//                         type="number"
//                         value={formData.price}
//                         onChange={handleChange}
//                         required
//                     />
//                 </Grid>
//                 <Grid item xs={12}>
//                     <TextField
//                         fullWidth
//                         multiline
//                         rows={4}
//                         label="Description"
//                         name="description"
//                         value={formData.description}
//                         onChange={handleChange}
//                         required
//                     />
//                 </Grid>
//                 <Grid item xs={12} sm={6}>
//                     <Select
//                         fullWidth
//                         label="Product Type"
//                         name="product_type_id"
//                         value={formData.product_type_id}
//                         onChange={handleChange}
//                         required
//                     >
//                         {productTypes.map((type) => (
//                             <MenuItem key={type.id} value={type.id}>{type.name}</MenuItem>
//                         ))}
//                     </Select>
//                 </Grid>
//                 <Grid item xs={12} sm={6}>
//                     <Select
//                         fullWidth
//                         label="Brand"
//                         name="brand_id"
//                         value={formData.brand_id}
//                         onChange={handleChange}
//                         required
//                     >
//                         {brands.map((brand) => (
//                             <MenuItem key={brand.id} value={brand.id}>{brand.name}</MenuItem>
//                         ))}
//                     </Select>
//                 </Grid>
//                 <Grid item xs={12}>
//                     <Select
//                         multiple
//                         fullWidth
//                         label="Categories"
//                         name="category_ids"
//                         value={formData.category_ids}
//                         onChange={handleCategoryChange}
//                         renderValue={(selected) => (
//                             <div className="flex flex-wrap">
//                                 {selected.map((value) => (
//                                     <Chip key={value} label={categories.find(c => c.id === value)?.name} />
//                                 ))}
//                             </div>
//                         )}
//                     >
//                         {categories.map((category) => (
//                             <MenuItem key={category.id} value={category.id}>
//                                 <Checkbox checked={formData.category_ids.indexOf(category.id) > -1} />
//                                 <ListItemText primary={category.name} />
//                             </MenuItem>
//                         ))}
//                     </Select>
//                 </Grid>
//                 <Grid item xs={12}>
//                     <Typography variant="h6">Tags</Typography>
//                     <div className="flex flex-wrap gap-2">
//                         {formData.tags.map((tag, index) => (
//                             <Chip
//                                 key={index}
//                                 label={tag.name}
//                                 onDelete={() => handleTagRemove(index)}
//                             />
//                         ))}
//                     </div>
//                     <TextField
//                         label="Add Tag"
//                         onKeyPress={(e) => {
//                             if (e.key === 'Enter') {
//                                 handleTagAdd(e.target.value);
//                                 e.target.value = '';
//                             }
//                         }}
//                     />
//                 </Grid>
//                 {/* Variants */}
//                 <Grid item xs={12}>
//                     <Typography variant="h6">Variants</Typography>
//                     {formData.variants.map((variant, index) => (
//                         <Paper key={index} className="p-4 mb-4">
//                             <TextField
//                                 fullWidth
//                                 label="Variant Name"
//                                 value={variant.name}
//                                 onChange={(e) => handleVariantChange(index, 'name', e.target.value)}
//                             />
//                             <TextField
//                                 label="Price Adjustment"
//                                 type="number"
//                                 value={variant.price_adjustment}
//                                 onChange={(e) => handleVariantChange(index, 'price_adjustment', e.target.value)}
//                             />
//                             <TextField
//                                 label="Stock Quantity"
//                                 type="number"
//                                 value={variant.stock_quantity}
//                                 onChange={(e) => handleVariantChange(index, 'stock_quantity', e.target.value)}
//                             />
//                             {attributes.map((attribute) => (
//                                 <TextField
//                                     key={attribute.id}
//                                     label={attribute.name}
//                                     value={variant.attribute_values.find(av => av.attribute_id === attribute.id)?.value || ''}
//                                     onChange={(e) => handleAttributeValueChange(index, attribute.id, e.target.value)}
//                                 />
//                             ))}
//                             <IconButton onClick={() => removeVariant(index)}>
//                                 <FaMinus />
//                             </IconButton>
//                         </Paper>
//                     ))}
//                     <StyledButton
//                         variant="contained"
//                         color="primary"
//                         onClick={addVariant}
//                         startIcon={<FaPlus />}
//                     >
//                         Add Variant
//                     </StyledButton>
//                 </Grid>
//
//                 {/* Images */}
//                 <Grid item xs={12}>
//                     <Typography variant="h6">Product Images</Typography>
//                     {formData.images_data.map((imageData, index) => (
//                         <div key={index} className="flex items-center gap-4 mb-4">
//                             {imageData.image && <ImagePreview src={URL.createObjectURL(imageData.image)} />}
//                             <input
//                                 type="file"
//                                 accept="image/*"
//                                 onChange={(e) => handleImageChange(e, index)}
//                             />
//                             <TextField
//                                 label="Alt Text"
//                                 value={imageData.alt_text}
//                                 onChange={(e) => handleImageInputChange(index, 'alt_text', e.target.value)}
//                             />
//                             <FormControlLabel
//                                 control={
//                                     <Checkbox
//                                         checked={imageData.is_primary}
//                                         onChange={(e) => handleImageInputChange(index, 'is_primary', e.target.checked)}
//                                     />
//                                 }
//                                 label="Primary Image"
//                             />
//                             <IconButton onClick={() => removeImageField(index)}>
//                                 <FaTrash />
//                             </IconButton>
//                         </div>
//                     ))}
//                     <StyledButton
//                         variant="contained"
//                         color="primary"
//                         onClick={addImageField}
//                         startIcon={<FaPlus />}
//                     >
//                         Add Image
//                     </StyledButton>
//                 </Grid>
//
//                 <Grid item xs={12}>
//                     <StyledButton
//                         variant="contained"
//                         color="primary"
//                         type="submit"
//                         startIcon={<FaUpload />}
//                     >
//                         Submit Product
//                     </StyledButton>
//                 </Grid>
//             </Grid>
//         </form>
//     );
// };
//
// const ProductManagement = () => {
//     const [products, setProducts] = useState([]);
//     const [productTypes, setProductTypes] = useState([]);
//     const [brands, setBrands] = useState([]);
//     const [categories, setCategories] = useState([]);
//     const [attributes, setAttributes] = useState([]);
//     const navigate = useNavigate();
//
//     useEffect(() => {
//         const fetchData = async () => {
//             const [productsRes, productTypesRes, brandsRes, categoriesRes, attributesRes] = await Promise.all([
//                 axios.get(`${API_URL}/products/`),
//                 axios.get(`${API_URL}/product-types/`),
//                 axios.get(`${API_URL}/brands/`),
//                 axios.get(`${API_URL}/categories/`),
//                 axios.get(`${API_URL}/attributes/`)
//             ]);
//
//             setProducts(productsRes.data);
//             setProductTypes(productTypesRes.data);
//             setBrands(brandsRes.data);
//             setCategories(categoriesRes.data);
//             setAttributes(attributesRes.data);
//         };
//
//         fetchData();
//     }, []);
//
//     const handleProductSubmit = async (formData) => {
//         const formDataToSend = new FormData();
//         Object.keys(formData).forEach(key => {
//             if (key === 'images_data') {
//                 formData.images_data.forEach((imgData, index) => {
//                     if (imgData.image) {
//                         formDataToSend.append(`images_data[${index}][image]`, imgData.image);
//                     }
//                     formDataToSend.append(`images_data[${index}][alt_text]`, imgData.alt_text);
//                     formDataToSend.append(`images_data[${index}][is_primary]`, imgData.is_primary);
//                     formDataToSend.append(`images_data[${index}][order]`, imgData.order);
//                 });
//             } else {
//                 formDataToSend.append(key, formData[key]);
//             }
//         });
//
//         try {
//             if (formData.id) {
//                 await axios.put(`${API_URL}/products/${formData.id}/`, formDataToSend, {
//                     headers: { 'Content-Type': 'multipart/form-data' },
//                 });
//             } else {
//                 await axios.post(`${API_URL}/products/`, formDataToSend, {
//                     headers: { 'Content-Type': 'multipart/form-data' },
//                 });
//             }
//             // Reload products list after successful submit
//             const productsRes = await axios.get(`${API_URL}/products/`);
//             setProducts(productsRes.data);
//         } catch (error) {
//             console.error('Failed to submit product', error);
//         }
//     };
//
//     return (
//         <div className="p-6">
//             <Typography variant="h4" gutterBottom>Manage Products</Typography>
//             <ProductForm
//                 onSubmit={handleProductSubmit}
//                 categories={categories}
//                 productTypes={productTypes}
//                 brands={brands}
//                 attributes={attributes}
//             />
//
//             <Typography variant="h5" gutterBottom>Product List</Typography>
//             <Grid container spacing={3}>
//                 {products.map(product => (
//                     <Grid item xs={12} sm={6} md={4} key={product.id}>
//                         <StyledPaper elevation={3}>
//                             <Typography variant="h6">{product.name}</Typography>
//                             <Typography>Price: ${product.price}</Typography>
//                             <Typography>Type: {product.product_type.name}</Typography>
//                             <Typography>Brand: {product.brand.name}</Typography>
//                             <div className="flex gap-2">
//                                 <StyledButton
//                                     variant="contained"
//                                     color="primary"
//                                     startIcon={<FaEdit />}
//                                     onClick={() => navigate(`/products/edit/${product.id}`)}
//                                 >
//                                     Edit
//                                 </StyledButton>
//                                 <StyledButton
//                                     variant="contained"
//                                     color="secondary"
//                                     startIcon={<FaTrash />}
//                                     onClick={() => console.log(`Delete product with id: ${product.id}`)}
//                                 >
//                                     Delete
//                                 </StyledButton>
//                             </div>
//                         </StyledPaper>
//                     </Grid>
//                 ))}
//             </Grid>
//         </div>
//     );
// };
//
// export default ProductManagement;

// import React, { useState, useEffect } from 'react';
// import { useNavigate, useParams } from 'react-router-dom';
// import axios from 'axios';
// import {
//     Button, TextField, Select, MenuItem, Checkbox,
//     FormControlLabel, Grid, Paper, Typography, IconButton,
//     Chip, List, ListItem, ListItemText, ListItemSecondaryAction
// } from '@mui/material';
// import { styled } from '@mui/system';
// import { FaPlus, FaMinus, FaUpload, FaTrash, FaEdit } from 'react-icons/fa';
//
// const API_URL = 'http://127.0.0.1:8000';
//
// const StyledPaper = styled(Paper)(({ theme }) => ({
//     padding: theme.spacing(3),
//     marginBottom: theme.spacing(3),
// }));
//
// const StyledButton = styled(Button)(({ theme }) => ({
//     margin: theme.spacing(1),
// }));
//
// const ImagePreview = styled('img')({
//     width: '100px',
//     height: '100px',
//     objectFit: 'cover',
//     margin: '10px',
// });
//
// const ProductForm = ({ product, onSubmit, categories, productTypes, brands, attributes }) => {
//     const [formData, setFormData] = useState(product || {
//         name: '',
//         description: '',
//         price: '',
//         product_type_id: '',
//         brand_id: '',
//         category_ids: [],
//         tags: [],
//         variants: [{
//             name: '',
//             price_adjustment: 0,
//             stock_quantity: 0,
//             attribute_values: []
//         }],
//         images_data: [{
//             image: null,
//             alt_text: '',
//             is_primary: false,
//             order: 1
//         }],
//         related_products: []
//     });
//
//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         setFormData({ ...formData, [name]: value });
//     };
//
//     const handleCategoryChange = (e) => {
//         const { value } = e.target;
//         setFormData({ ...formData, category_ids: value });
//     };
//
//     const handleTagAdd = (tag) => {
//         setFormData({
//             ...formData,
//             tags: [...formData.tags, { name: tag, description: '' }]
//         });
//     };
//
//     const handleTagRemove = (index) => {
//         const newTags = [...formData.tags];
//         newTags.splice(index, 1);
//         setFormData({ ...formData, tags: newTags });
//     };
//
//     const handleVariantChange = (index, field, value) => {
//         const newVariants = [...formData.variants];
//         newVariants[index] = { ...newVariants[index], [field]: value };
//         setFormData({ ...formData, variants: newVariants });
//     };
//
//     const handleAttributeValueChange = (variantIndex, attributeId, value) => {
//         const newVariants = [...formData.variants];
//         const attributeValueIndex = newVariants[variantIndex].attribute_values.findIndex(av => av.attribute_id === attributeId);
//         if (attributeValueIndex > -1) {
//             newVariants[variantIndex].attribute_values[attributeValueIndex].value = value;
//         } else {
//             newVariants[variantIndex].attribute_values.push({ attribute_id: attributeId, value });
//         }
//         setFormData({ ...formData, variants: newVariants });
//     };
//
//     const handleImageChange = (e, index) => {
//         const newImagesData = [...formData.images_data];
//         newImagesData[index] = {
//             ...newImagesData[index],
//             image: e.target.files[0]
//         };
//         setFormData({ ...formData, images_data: newImagesData });
//     };
//
//     const handleImageInputChange = (index, field, value) => {
//         const newImagesData = [...formData.images_data];
//         newImagesData[index] = { ...newImagesData[index], [field]: value };
//         setFormData({ ...formData, images_data: newImagesData });
//     };
//
//     const addVariant = () => {
//         setFormData({
//             ...formData,
//             variants: [
//                 ...formData.variants,
//                 { name: '', price_adjustment: 0, stock_quantity: 0, attribute_values: [] }
//             ]
//         });
//     };
//
//     const removeVariant = (index) => {
//         const newVariants = [...formData.variants];
//         newVariants.splice(index, 1);
//         setFormData({ ...formData, variants: newVariants });
//     };
//
//     const addImageField = () => {
//         setFormData({
//             ...formData,
//             images_data: [
//                 ...formData.images_data,
//                 { image: null, alt_text: '', is_primary: false, order: formData.images_data.length + 1 }
//             ]
//         });
//     };
//
//     const removeImageField = (index) => {
//         const newImagesData = [...formData.images_data];
//         newImagesData.splice(index, 1);
//         setFormData({ ...formData, images_data: newImagesData });
//     };
//
//     const handleSubmit = (e) => {
//         e.preventDefault();
//         onSubmit(formData);
//     };
//
//     return (
//         <form onSubmit={handleSubmit}>
//             <Grid container spacing={3}>
//                 <Grid item xs={12} sm={6}>
//                     <TextField
//                         fullWidth
//                         label="Name"
//                         name="name"
//                         value={formData.name}
//                         onChange={handleChange}
//                         required
//                     />
//                 </Grid>
//                 <Grid item xs={12} sm={6}>
//                     <TextField
//                         fullWidth
//                         label="Price"
//                         name="price"
//                         type="number"
//                         value={formData.price}
//                         onChange={handleChange}
//                         required
//                     />
//                 </Grid>
//                 <Grid item xs={12}>
//                     <TextField
//                         fullWidth
//                         multiline
//                         rows={4}
//                         label="Description"
//                         name="description"
//                         value={formData.description}
//                         onChange={handleChange}
//                         required
//                     />
//                 </Grid>
//                 <Grid item xs={12} sm={6}>
//                     <Select
//                         fullWidth
//                         label="Product Type"
//                         name="product_type_id"
//                         value={formData.product_type_id}
//                         onChange={handleChange}
//                         required
//                     >
//                         {productTypes.map((type) => (
//                             <MenuItem key={type.id} value={type.id}>{type.name}</MenuItem>
//                         ))}
//                     </Select>
//                 </Grid>
//                 <Grid item xs={12} sm={6}>
//                     <Select
//                         fullWidth
//                         label="Brand"
//                         name="brand_id"
//                         value={formData.brand_id}
//                         onChange={handleChange}
//                         required
//                     >
//                         {brands.map((brand) => (
//                             <MenuItem key={brand.id} value={brand.id}>{brand.name}</MenuItem>
//                         ))}
//                     </Select>
//                 </Grid>
//                 <Grid item xs={12}>
//                     <Select
//                         multiple
//                         fullWidth
//                         label="Categories"
//                         name="category_ids"
//                         value={formData.category_ids}
//                         onChange={handleCategoryChange}
//                         renderValue={(selected) => (
//                             <div>
//                                 {selected.map((value) => (
//                                     <Chip key={value} label={categories.find(c => c.id === value)?.name} />
//                                 ))}
//                             </div>
//                         )}
//                     >
//                         {categories.map((category) => (
//                             <MenuItem key={category.id} value={category.id}>
//                                 <Checkbox checked={formData.category_ids.indexOf(category.id) > -1} />
//                                 <ListItemText primary={category.name} />
//                             </MenuItem>
//                         ))}
//                     </Select>
//                 </Grid>
//                 <Grid item xs={12}>
//                     <Typography variant="h6">Tags</Typography>
//                     <div>
//                         {formData.tags.map((tag, index) => (
//                             <Chip
//                                 key={index}
//                                 label={tag.name}
//                                 onDelete={() => handleTagRemove(index)}
//                                 style={{ margin: '5px' }}
//                             />
//                         ))}
//                     </div>
//                     <TextField
//                         label="Add Tag"
//                         onKeyPress={(e) => {
//                             if (e.key === 'Enter') {
//                                 handleTagAdd(e.target.value);
//                                 e.target.value = '';
//                             }
//                         }}
//                     />
//                 </Grid>
//                 <Grid item xs={12}>
//                     <Typography variant="h6">Variants</Typography>
//                     {formData.variants.map((variant, index) => (
//                         <Paper key={index} style={{ padding: '10px', marginBottom: '10px' }}>
//                             <TextField
//                                 fullWidth
//                                 label="Variant Name"
//                                 value={variant.name}
//                                 onChange={(e) => handleVariantChange(index, 'name', e.target.value)}
//                             />
//                             <TextField
//                                 label="Price Adjustment"
//                                 type="number"
//                                 value={variant.price_adjustment}
//                                 onChange={(e) => handleVariantChange(index, 'price_adjustment', e.target.value)}
//                             />
//                             <TextField
//                                 label="Stock Quantity"
//                                 type="number"
//                                 value={variant.stock_quantity}
//                                 onChange={(e) => handleVariantChange(index, 'stock_quantity', e.target.value)}
//                             />
//                             {attributes.map((attribute) => (
//                                 <TextField
//                                     key={attribute.id}
//                                     label={attribute.name}
//                                     value={variant.attribute_values.find(av => av.attribute_id === attribute.id)?.value || ''}
//                                     onChange={(e) => handleAttributeValueChange(index, attribute.id, e.target.value)}
//                                 />
//                             ))}
//                             <IconButton onClick={() => removeVariant(index)}>
//                                 <FaTrash />
//                             </IconButton>
//                         </Paper>
//                     ))}
//                     <Button onClick={addVariant} startIcon={<FaPlus />}>
//                         Add Variant
//                     </Button>
//                 </Grid>
//                 <Grid item xs={12}>
//                     <Typography variant="h6">Images</Typography>
//                     {formData.images_data.map((imgData, index) => (
//                         <Paper key={index} style={{ padding: '10px', marginBottom: '10px' }}>
//                             <input
//                                 type="file"
//                                 onChange={(e) => handleImageChange(e, index)}
//                             />
//                             {imgData.image && <ImagePreview src={URL.createObjectURL(imgData.image)} alt="Preview" />}
//                             <TextField
//                                 label="Alt Text"
//                                 value={imgData.alt_text}
//                                 onChange={(e) => handleImageInputChange(index, 'alt_text', e.target.value)}
//                             />
//                             <FormControlLabel
//                                 control={
//                                     <Checkbox
//                                         checked={imgData.is_primary}
//                                         onChange={(e) => handleImageInputChange(index, 'is_primary', e.target.checked)}
//                                     />
//                                 }
//                                 label="Primary Image"
//                             />
//                             <TextField
//                                 label="Order"
//                                 type="number"
//                                 value={imgData.order}
//                                 onChange={(e) => handleImageInputChange(index, 'order', e.target.value)}
//                             />
//                             <IconButton onClick={() => removeImageField(index)}>
//                                 <FaTrash />
//                             </IconButton>
//                         </Paper>
//                     ))}
//                     <Button onClick={addImageField} startIcon={<FaPlus />}>
//                         Add Image
//                     </Button>
//                 </Grid>
//             </Grid>
//             <StyledButton type="submit" variant="contained" color="primary">
//                 {product ? 'Update Product' : 'Add Product'}
//             </StyledButton>
//         </form>
//     );
// };
//
// const ProductList = ({ products, onEdit, onDelete }) => (
//     <Grid container spacing={3}>
//         {products.map((product) => (
//             <Grid item xs={12} sm={6} md={4} key={product.id}>
//                 <StyledPaper>
//                     <Typography variant="h6">{product.name}</Typography>
//                     <Typography>${product.price}</Typography>
//                     <Typography variant="body2">{product.description}</Typography>
//                     {product.images_data && product.images_data.length > 0 && (
//                         <ImagePreview src={product.images_data[0].image} alt={product.images_data[0].alt_text} />
//                     )}
//                     <StyledButton onClick={() => onEdit(product.id)} startIcon={<FaEdit />}>
//                         Edit
//                     </StyledButton>
//                     <StyledButton onClick={() => onDelete(product.id)} startIcon={<FaTrash />} color="secondary">
//                         Delete
//                     </StyledButton>
//                 </StyledPaper>
//             </Grid>
//         ))}
//     </Grid>
// );
//
// const ProductManagement = () => {
//     const [products, setProducts] = useState([]);
//     const [categories, setCategories] = useState([]);
//     const [productTypes, setProductTypes] = useState([]);
//     const [brands, setBrands] = useState([]);
//     const [attributes, setAttributes] = useState([]);
//     const navigate = useNavigate();
//     const { id } = useParams();
//
//     useEffect(() => {
//         fetchProducts();
//         fetchFormData();
//     }, []);
//
//     const fetchProducts = async () => {
//         try {
//             const response = await axios.get(`${API_URL}/products/`);
//             setProducts(response.data.results);
//         } catch (error) {
//             console.error('Failed to fetch products', error);
//         }
//     };
//
//     const fetchFormData = async () => {
//         try {
//             const [categoriesData, productTypesData, brandsData, attributesData] = await Promise.all([
//                 axios.get(`${API_URL}/categories/root_categories/`),
//                 axios.get(`${API_URL}/product-types/`),
//                 axios.get(`${API_URL}/brands/`),
//                 axios.get(`${API_URL}/product-attributes/`),
//             ]);
//             setCategories(categoriesData.data.data);
//             setProductTypes(productTypesData.data.results);
//             setBrands(brandsData.data.results);
//             setAttributes(attributesData.data.results);
//         } catch (error) {
//             console.error('Failed to fetch form data', error);
//         }
//     };
//
//     const handleSubmit = async (formData) => {
//         const formDataToSend = new FormData();
//
//         Object.keys(formData).forEach(key => {
//             if (key !== 'images_data') {
//                 formDataToSend.append(key, JSON.stringify(formData[key]));
//             }
//         });
//
//         formData.images_data.forEach((imgData, index) => {
//             if (imgData.image) {
//                 formDataToSend.append(`images_data[${index}]image`, imgData.image);
//             }
//             formDataToSend.append(`images_data[${index}]alt_text`, imgData.alt_text);
//             formDataToSend.append(`images_data[${index}]is_primary`, imgData.is_primary);
//             formDataToSend.append(`images_data[${index}]order`, imgData.order);
//         });
//
//         try {
//             if (id) {
//                 await axios.put(`${API_URL}/products/${id}/`, formDataToSend, {
//                     headers: { 'Content-Type': 'multipart/form-data' }
//                 });
//             } else {
//                 await axios.post(`${API_URL}/products/`, formDataToSend, {
//                 headers: { 'Content-Type': 'multipart/form-data' }
//             });
//             }
//             fetchProducts();
//             navigate('/products');
//         } catch (error) {
//             console.error('Failed to save product', error);
//         }
//     };
//
//     const handleEdit = (productId) => {
//         navigate(`/products/${productId}/edit`);
//     };
//
//     const handleDelete = async (productId) => {
//         try {
//             await axios.delete(`${API_URL}/products/${productId}/`);
//             fetchProducts();
//         } catch (error) {
//             console.error('Failed to delete product', error);
//         }
//     };
//
//     return (
//         <div>
//             <Typography variant="h4" gutterBottom>
//                 Product Management
//             </Typography>
//             <ProductForm
//                 product={id ? products.find(p => p.id === parseInt(id)) : null}
//                 onSubmit={handleSubmit}
//                 categories={categories}
//                 productTypes={productTypes}
//                 brands={brands}
//                 attributes={attributes}
//             />
//             <ProductList products={products} onEdit={handleEdit} onDelete={handleDelete} />
//         </div>
//     );
// };
//
// export default ProductManagement;
// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { motion } from 'framer-motion';
// import { X, Upload, Plus, Minus } from 'lucide-react';
//
// const API_URL = 'http://127.0.0.1:8000';
//
// const HierarchicalCategorySelector = ({ categories, selectedCategories, onCategoriesChange }) => {
//     const renderCategory = (category, level = 0) => (
//         <div key={category.id} style={{ marginLeft: `${level * 20}px` }}>
//             <label className="flex items-center">
//                 <input
//                     type="checkbox"
//                     checked={selectedCategories.includes(category.id)}
//                     onChange={() => onCategoriesChange(category.id)}
//                     className="mr-2"
//                 />
//                 {category.name}
//             </label>
//             {category.children && category.children.map(child => renderCategory(child, level + 1))}
//         </div>
//     );
//
//     return <div className="max-h-60 overflow-y-auto">{categories.map(cat => renderCategory(cat))}</div>;
// };
//
// const ProductManagement = () => {
//     const [products, setProducts] = useState([]);
//     const [formData, setFormData] = useState({
//         name: '',
//         description: '',
//         price: '',
//         product_type_id: '',
//         brand_id: '',
//         category_ids: [],
//         tags: [],
//         variants: [{ name: '', price_adjustment: 0, stock_quantity: 0, attribute_values: [] }],
//         images_data: [{ image: null, alt_text: '', is_primary: false, order: 1 }],
//         related_products: [],
//     });
//     const [categories, setCategories] = useState([]);
//     const [productTypes, setProductTypes] = useState([]);
//     const [brands, setBrands] = useState([]);
//     const [attributes, setAttributes] = useState([]);
//     const [isEditing, setIsEditing] = useState(false);
//     const [editingProductId, setEditingProductId] = useState(null);
//
//     useEffect(() => {
//         fetchProducts();
//         fetchFormData();
//     }, []);
//
//     const fetchProducts = async () => {
//         try {
//             const response = await axios.get(`${API_URL}/products/`);
//             setProducts(response.data.results);
//         } catch (error) {
//             console.error('Failed to fetch products', error);
//         }
//     };
//
//     const fetchFormData = async () => {
//         try {
//             const [categoriesData, productTypesData, brandsData, attributesData] = await Promise.all([
//                 axios.get(`${API_URL}/categories/root_categories/`),
//                 axios.get(`${API_URL}/product-types/`),
//                 axios.get(`${API_URL}/brands/`),
//                 axios.get(`${API_URL}/product-attributes/`),
//             ]);
//             setCategories(categoriesData.data.data);
//             setProductTypes(productTypesData.data.results);
//             setBrands(brandsData.data.results);
//             setAttributes(attributesData.data.results);
//         } catch (error) {
//             console.error('Failed to fetch form data', error);
//         }
//     };
//
//     const handleInputChange = (e) => {
//         const { name, value } = e.target;
//         setFormData({ ...formData, [name]: value });
//     };
//
//     const handleCategoryChange = (categoryId) => {
//         const updatedCategories = formData.category_ids.includes(categoryId)
//             ? formData.category_ids.filter(id => id !== categoryId)
//             : [...formData.category_ids, categoryId];
//         setFormData({ ...formData, category_ids: updatedCategories });
//     };
//
//     const handleTagInput = (e) => {
//         if (e.key === 'Enter' && e.target.value) {
//             setFormData({
//                 ...formData,
//                 tags: [...formData.tags, { name: e.target.value, description: '' }],
//             });
//             e.target.value = '';
//         }
//     };
//
//     const removeTag = (index) => {
//         const newTags = [...formData.tags];
//         newTags.splice(index, 1);
//         setFormData({ ...formData, tags: newTags });
//     };
//
//     const handleVariantChange = (index, field, value) => {
//         const newVariants = [...formData.variants];
//         newVariants[index][field] = value;
//         setFormData({ ...formData, variants: newVariants });
//     };
//
//     const handleAttributeValueChange = (variantIndex, attributeId, value) => {
//         const newVariants = [...formData.variants];
//         const attributeValueIndex = newVariants[variantIndex].attribute_values.findIndex(av => av.attribute_id === attributeId);
//         if (attributeValueIndex > -1) {
//             newVariants[variantIndex].attribute_values[attributeValueIndex].value = value;
//         } else {
//             newVariants[variantIndex].attribute_values.push({ attribute_id: attributeId, value });
//         }
//         setFormData({ ...formData, variants: newVariants });
//     };
//
//     const addVariant = () => {
//         setFormData({
//             ...formData,
//             variants: [...formData.variants, { name: '', price_adjustment: 0, stock_quantity: 0, attribute_values: [] }],
//         });
//     };
//
//     const removeVariant = (index) => {
//         const newVariants = [...formData.variants];
//         newVariants.splice(index, 1);
//         setFormData({ ...formData, variants: newVariants });
//     };
//
//     const handleImageChange = (e, index) => {
//         const newImagesData = [...formData.images_data];
//         newImagesData[index] = {
//             ...newImagesData[index],
//             image: e.target.files[0]
//         };
//         setFormData({ ...formData, images_data: newImagesData });
//     };
//
//     const handleImageInputChange = (e, index, field) => {
//         const newImagesData = [...formData.images_data];
//         newImagesData[index][field] = field === 'is_primary' ? e.target.checked : e.target.value;
//         setFormData({ ...formData, images_data: newImagesData });
//     };
//
//     const addImageField = () => {
//         setFormData({
//             ...formData,
//             images_data: [
//                 ...formData.images_data,
//                 { image: null, alt_text: '', is_primary: false, order: formData.images_data.length + 1 }
//             ]
//         });
//     };
//
//     const removeImageField = (index) => {
//         const newImagesData = [...formData.images_data];
//         newImagesData.splice(index, 1);
//         setFormData({ ...formData, images_data: newImagesData });
//     };
//
//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         const formDataToSend = new FormData();
//
//         Object.keys(formData).forEach(key => {
//             if (key !== 'images_data') {
//                 formDataToSend.append(key, JSON.stringify(formData[key]));
//             }
//         });
//
//         formData.images_data.forEach((imgData, index) => {
//             if (imgData.image) {
//                 formDataToSend.append(`images_data[${index}]image`, imgData.image);
//             }
//             formDataToSend.append(`images_data[${index}]alt_text`, imgData.alt_text);
//             formDataToSend.append(`images_data[${index}]is_primary`, imgData.is_primary);
//             formDataToSend.append(`images_data[${index}]order`, imgData.order);
//         });
//
//         try {
//             if (isEditing) {
//                 await axios.put(`${API_URL}/products/${editingProductId}/`, formDataToSend, {
//                     headers: { 'Content-Type': 'multipart/form-data' }
//                 });
//             } else {
//                 await axios.post(`${API_URL}/products/`, JSON.stringify(formDataToSend), {
//                     headers: { 'Content-Type': 'multipart/form-data' }
//                 });
//             }
//             fetchProducts();
//             resetForm();
//         } catch (error) {
//             console.error('Failed to save product', error);
//         }
//     };
//
//     const handleEdit = async (productId) => {
//         try {
//             const response = await axios.get(`${API_URL}/products/${productId}/`);
//             setFormData(response.data);
//             setIsEditing(true);
//             setEditingProductId(productId);
//         } catch (error) {
//             console.error('Failed to fetch product details', error);
//         }
//     };
//
//     const handleDelete = async (id) => {
//         try {
//             await axios.delete(`${API_URL}/products/${id}/`);
//             fetchProducts();
//         } catch (error) {
//             console.error('Failed to delete product', error);
//         }
//     };
//
//     const resetForm = () => {
//         setFormData({
//             name: '',
//             description: '',
//             price: '',
//             product_type_id: '',
//             brand_id: '',
//             category_ids: [],
//             tags: [],
//             variants: [{ name: '', price_adjustment: 0, stock_quantity: 0, attribute_values: [] }],
//             images_data: [{ image: null, alt_text: '', is_primary: false, order: 1 }],
//             related_products: [],
//         });
//         setIsEditing(false);
//         setEditingProductId(null);
//     };
//
//     return (
//         <div className="container mx-auto p-4">
//             <h1 className="text-3xl font-bold mb-6">Product Management</h1>
//
//             <form onSubmit={handleSubmit} className="mb-8 bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     <div>
//                         <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
//                             Product Name
//                         </label>
//                         <input
//                             className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//                             id="name"
//                             type="text"
//                             name="name"
//                             value={formData.name}
//                             onChange={handleInputChange}
//                             required
//                         />
//                     </div>
//                     <div>
//                         <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="price">
//                             Price
//                         </label>
//                         <input
//                             className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//                             id="price"
//                             type="number"
//                             name="price"
//                             value={formData.price}
//                             onChange={handleInputChange}
//                             required
//                         />
//                     </div>
//                     <div className="md:col-span-2">
//                         <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
//                             Description
//                         </label>
//                         <textarea
//                             className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//                             id="description"
//                             name="description"
//                             value={formData.description}
//                             onChange={handleInputChange}
//                             required
//                         />
//                     </div>
//                     <div>
//                         <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="product_type_id">
//                             Product Type
//                         </label>
//                         <select
//                             className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//                             id="product_type_id"
//                             name="product_type_id"
//                             value={formData.product_type_id}
//                             onChange={handleInputChange}
//                             required
//                         >
//                             <option value="">Select Product Type</option>
//                             {productTypes.map((type) => (
//                                 <option key={type.id} value={type.id}>{type.name}</option>
//                             ))}
//                         </select>
//                     </div>
//                     <div>
//                         <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="brand_id">
//                             Brand
//                         </label>
//                         <select
//                             className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//                             id="brand_id"
//                             name="brand_id"
//                             value={formData.brand_id}
//                             onChange={handleInputChange}
//                             required
//                         >
//                             <option value="">Select Brand</option>
//                             {brands.map((brand) => (
//                                 <option key={brand.id} value={brand.id}>{brand.name}</option>
//                             ))}
//                         </select>
//                     </div>
//                 </div>
//
//                 <div className="mt-6">
//                     <label className="block text-gray-700 text-sm font-bold mb-2">Categories</label>
//                     <HierarchicalCategorySelector
//                         categories={categories}
//                         selectedCategories={formData.category_ids}
//                         onCategoriesChange={handleCategoryChange}
//                     />
//                 </div>
//
//                 <div className="mt-6">
//                     <label className="block text-gray-700 text-sm font-bold mb-2">Tags</label>
//                     <div className="flex flex-wrap gap-2 mb-2">
//                         {formData.tags.map((tag, index) => (
//                             <div key={index} className="bg-blue-100 px-2 py-1 rounded flex items-center">
//                                 <span>{tag.name}</span>
//                                 <button type="button" onClick={() => removeTag(index)} className="ml-2">
//                                     <X size={16} />
//                                 </button>
//                             </div>
//                         ))}
//                     </div>
//                     <input
//                         className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//                         type="text"
//                         placeholder="Add a tag and press Enter"
//                         onKeyPress={handleTagInput}
//                     />
//                 </div>
//
//                 <div className="mt-6">
//                     <h3 className="text-lg font-bold mb-2">Variants</h3>
//                     {formData.variants.map((variant, variantIndex) => (
//                         <div key={variantIndex} className="border p-4 rounded mb-4">
//                             <input
//                                 className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-2"
//                                 type="text"
//                                 value={variant.name}
//                                 onChange={(e) => handleVariantChange(variantIndex, 'name', e.target.value)}
//                                 placeholder="Variant Name"
//                             />
//                             <input
//                                 className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-2"
//                                 type="number"
//                                 value={variant.price_adjustment}
//                                 onChange={(e) => handleVariantChange(variantIndex, 'price_adjustment', parseFloat(e.target.value))}
//                                 placeholder="Price Adjustment"
//                             />
//                             <input
//                                 className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-2"
//                                 type="number"
//                                 value={variant.stock_quantity}
//                                 onChange={(e) => handleVariantChange(variantIndex, 'stock_quantity', parseInt(e.target.value))}
//                                 placeholder="Stock Quantity"
//                             />
//                             <h4 className="font-bold mb-2">Attributes</h4>
//                             {attributes.map((attribute) => (
//                                 <div key={attribute.id} className="mb-2">
//                                     <label className="block text-gray-700 text-sm font-bold mb-2">{attribute.name}</label>
//                                     <input
//                                         className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//                                         type="text"
//                                         value={variant.attribute_values.find(av => av.attribute_id === attribute.id)?.value || ''}
//                                         onChange={(e) => handleAttributeValueChange(variantIndex, attribute.id, e.target.value)}
//                                         placeholder={`Enter ${attribute.name}`}
//                                     />
//                                 </div>
//                             ))}
//                             <button
//                                 type="button"
//                                 onClick={() => removeVariant(variantIndex)}
//                                 className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-2"
//                             >
//                                 Remove Variant
//                             </button>
//                         </div>
//                     ))}
//                     <button
//                         type="button"
//                         onClick={addVariant}
//                         className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline flex items-center"
//                     >
//                         <Plus size={20} className="mr-2" />
//                         Add Variant
//                     </button>
//                 </div>
//
//                 <div className="mt-6">
//                     <h3 className="text-lg font-bold mb-2">Images</h3>
//                     {formData.images_data.map((imgData, index) => (
//                         <div key={index} className="border p-4 rounded mb-4">
//                             <input
//                                 type="file"
//                                 onChange={(e) => handleImageChange(e, index)}
//                                 className="mb-2"
//                             />
//                             <input
//                                 type="text"
//                                 placeholder="Alt Text"
//                                 value={imgData.alt_text}
//                                 onChange={(e) => handleImageInputChange(e, index, 'alt_text')}
//                                 className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-2"
//                             />
//                             <div className="flex items-center mb-2">
//                                 <input
//                                     type="checkbox"
//                                     checked={imgData.is_primary}
//                                     onChange={(e) => handleImageInputChange(e, index, 'is_primary')}
//                                     className="mr-2"
//                                 />
//                                 <label>Primary Image</label>
//                             </div>
//                             <input
//                                 type="number"
//                                 placeholder="Order"
//                                 value={imgData.order}
//                                 onChange={(e) => handleImageInputChange(e, index, 'order')}
//                                 className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-2"
//                             />
//                             <button
//                                 type="button"
//                                 onClick={() => removeImageField(index)}
//                                 className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
//                             >
//                                 Remove Image
//                             </button>
//                         </div>
//                     ))}
//                     <button
//                         type="button"
//                         onClick={addImageField}
//                         className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline flex items-center"
//                     >
//                         <Upload size={20} className="mr-2" />
//                         Add Image
//                     </button>
//                 </div>
//
//                 <div className="mt-6">
//                     <button
//                         type="submit"
//                         className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
//                     >
//                         {isEditing ? 'Update Product' : 'Add Product'}
//                     </button>
//                 </div>
//             </form>
//
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//                 {products.map((product) => (
//                     <motion.div
//                         key={product.id}
//                         className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
//                         whileHover={{ scale: 1.03 }}
//                         whileTap={{ scale: 0.98 }}
//                     >
//                         <h2 className="text-xl font-bold mb-2">{product.name}</h2>
//                         <p className="text-gray-700 text-base mb-2">{product.description}</p>
//                         <p className="text-gray-900 text-lg font-bold mb-2">${product.price}</p>
//                         {product.images_data && product.images_data.length > 0 && (
//                             <img
//                                 src={product.images_data[0].image}
//                                 alt={product.images_data[0].alt_text}
//                                 className="w-full h-48 object-cover mb-2"
//                             />
//                         )}
//                         <div className="flex justify-end space-x-2">
//                             <button
//                                 onClick={() => handleEdit(product.id)}
//                                 className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
//                             >
//                                 Edit
//                             </button>
//                             <button
//                                 onClick={() => handleDelete(product.id)}
//                                 className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
//                             >
//                                 Delete
//                             </button>
//                         </div>
//                     </motion.div>
//                 ))}
//             </div>
//         </div>
//     );
// };
//
// export default ProductManagement;
//
//

// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { motion } from 'framer-motion';
// import HierarchicalCategorySelector from './HierarchicalCategorySelector';
// import { X } from 'lucide-react';
//
// const API_URL = 'http://127.0.0.1:8000';
//
// const ProductManagement = () => {
//     const [products, setProducts] = useState([]);
//     const [formData, setFormData] = useState({
//         name: '',
//         description: '',
//         price: '',
//         product_type_id: '',
//         brand_id: '',
//         category_ids: [],
//         tags: [],
//         variants: [{ name: '', price_adjustment: 0, stock_quantity: 0, attribute_values: [] }],
//         images_data: [{ image: null, alt_text: '', is_primary: true, order: 1 }],
//         related_products: [],
//     });
//     const [categories, setCategories] = useState([]);
//     const [productTypes, setProductTypes] = useState([]);
//     const [brands, setBrands] = useState([]);
//     const [attributes, setAttributes] = useState([]);
//     const [isEditing, setIsEditing] = useState(false);
//     const [editingProductId, setEditingProductId] = useState(null);
//
//     useEffect(() => {
//         fetchProducts();
//         fetchFormData();
//     }, []);
//
//     const fetchProducts = async () => {
//         try {
//             const response = await axios.get(`${API_URL}/products/`);
//             setProducts(response.data.results);
//         } catch (error) {
//             console.error('Failed to fetch products', error);
//         }
//     };
//
//     const fetchFormData = async () => {
//         try {
//             const [categoriesData, productTypesData, brandsData, attributesData] = await Promise.all([
//                 axios.get(`${API_URL}/categories/root_categories/`),
//                 axios.get(`${API_URL}/product-types/`),
//                 axios.get(`${API_URL}/brands/`),
//                 axios.get(`${API_URL}/product-attributes/`),
//             ]);
//             setCategories(categoriesData.data.data);
//             setProductTypes(productTypesData.data.results);
//             setBrands(brandsData.data.results);
//             setAttributes(attributesData.data.results);
//         } catch (error) {
//             console.error('Failed to fetch form data', error);
//         }
//     };
//
//     const handleInputChange = (e) => {
//         const { name, value } = e.target;
//         setFormData({ ...formData, [name]: value });
//     };
//
//     const handleTagInput = (e) => {
//         if (e.key === 'Enter' && e.target.value) {
//             setFormData({
//                 ...formData,
//                 tags: [...formData.tags, { name: e.target.value, description: '' }],
//             });
//             e.target.value = '';
//         }
//     };
//
//     const removeTag = (index) => {
//         const newTags = [...formData.tags];
//         newTags.splice(index, 1);
//         setFormData({ ...formData, tags: newTags });
//     };
//
//     const handleVariantChange = (index, field, value) => {
//         const newVariants = [...formData.variants];
//         newVariants[index][field] = value;
//         setFormData({ ...formData, variants: newVariants });
//     };
//
//     const handleAttributeValueChange = (variantIndex, attributeId, value) => {
//         const newVariants = [...formData.variants];
//         const attributeValueIndex = newVariants[variantIndex].attribute_values.findIndex(av => av.attribute_id === attributeId);
//         if (attributeValueIndex > -1) {
//             newVariants[variantIndex].attribute_values[attributeValueIndex].value = value;
//         } else {
//             newVariants[variantIndex].attribute_values.push({ attribute_id: attributeId, value });
//         }
//         setFormData({ ...formData, variants: newVariants });
//     };
//
//     const addVariant = () => {
//         setFormData({
//             ...formData,
//             variants: [...formData.variants, { name: '', price_adjustment: 0, stock_quantity: 0, attribute_values: [] }],
//         });
//     };
//
//     const removeVariant = (index) => {
//         const newVariants = [...formData.variants];
//         newVariants.splice(index, 1);
//         setFormData({ ...formData, variants: newVariants });
//     };
//
//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         try {
//             if (isEditing) {
//                 await axios.put(`${API_URL}/products/${editingProductId}/`, formData);
//             } else {
//                 await axios.post(`${API_URL}/products/`, formData);
//             }
//             fetchProducts();
//             resetForm();
//         } catch (error) {
//             console.error('Failed to save product', error);
//         }
//     };
//
//     const handleEdit = async (productId) => {
//         try {
//             const response = await axios.get(`${API_URL}/products/${productId}/`);
//             setFormData(response.data);
//             setIsEditing(true);
//             setEditingProductId(productId);
//         } catch (error) {
//             console.error('Failed to fetch product details', error);
//         }
//     };
//
//     const handleDelete = async (id) => {
//         try {
//             await axios.delete(`${API_URL}/products/${id}/`);
//             fetchProducts();
//         } catch (error) {
//             console.error('Failed to delete product', error);
//         }
//     };
//
//     const resetForm = () => {
//         setFormData({
//             name: '',
//             description: '',
//             price: '',
//             product_type_id: '',
//             brand_id: '',
//             category_ids: [],
//             tags: [],
//             variants: [{ name: '', price_adjustment: 0, stock_quantity: 0, attribute_values: [] }],
//             images_data: [{ image: null, alt_text: '', is_primary: true, order: 1 }],
//             related_products: [],
//         });
//         setIsEditing(false);
//         setEditingProductId(null);
//     };
//
//     return (
//         <div className="container mx-auto p-4">
//             <h1 className="text-3xl font-bold mb-4">Product Management</h1>
//
//             <form onSubmit={handleSubmit} className="mb-8">
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     <input
//                         className="border p-2 rounded"
//                         type="text"
//                         name="name"
//                         value={formData.name}
//                         onChange={handleInputChange}
//                         placeholder="Product Name"
//                         required
//                     />
//                     <input
//                         className="border p-2 rounded"
//                         type="number"
//                         name="price"
//                         value={formData.price}
//                         onChange={handleInputChange}
//                         placeholder="Price"
//                         required
//                     />
//                     <textarea
//                         className="border p-2 rounded"
//                         name="description"
//                         value={formData.description}
//                         onChange={handleInputChange}
//                         placeholder="Description"
//                         required
//                     />
//                     <select
//                         className="border p-2 rounded"
//                         name="product_type_id"
//                         value={formData.product_type_id}
//                         onChange={handleInputChange}
//                         required
//                     >
//                         <option value="">Select Product Type</option>
//                         {productTypes.map((type) => (
//                             <option key={type.id} value={type.id}>{type.name}</option>
//                         ))}
//                     </select>
//                     <select
//                         className="border p-2 rounded"
//                         name="brand_id"
//                         value={formData.brand_id}
//                         onChange={handleInputChange}
//                         required
//                     >
//                         <option value="">Select Brand</option>
//                         {brands.map((brand) => (
//                             <option key={brand.id} value={brand.id}>{brand.name}</option>
//                         ))}
//                     </select>
//                     <div>
//                         <label className="block mb-2">Categories</label>
//                         <HierarchicalCategorySelector
//                             categories={categories}
//                             selectedCategories={formData.category_ids}
//                             onCategoriesChange={(newCategories) => setFormData({ ...formData, category_ids: newCategories })}
//                         />
//                     </div>
//                     <div>
//                         <label className="block mb-2">Tags</label>
//                         <div className="flex flex-wrap gap-2 mb-2">
//                             {formData.tags.map((tag, index) => (
//                                 <div key={index} className="bg-blue-100 px-2 py-1 rounded flex items-center">
//                                     <span>{tag.name}</span>
//                                     <button type="button" onClick={() => removeTag(index)} className="ml-2">
//                                         <X size={16} />
//                                     </button>
//                                 </div>
//                             ))}
//                         </div>
//                         <input
//                             className="border p-2 rounded w-full"
//                             type="text"
//                             placeholder="Add a tag and press Enter"
//                             onKeyPress={handleTagInput}
//                         />
//                     </div>
//                 </div>
//
//                 <div className="mt-4">
//                     <h3 className="text-xl font-bold mb-2">Variants</h3>
//                     {formData.variants.map((variant, variantIndex) => (
//                         <div key={variantIndex} className="border p-4 rounded mb-4">
//                             <input
//                                 className="border p-2 rounded w-full mb-2"
//                                 type="text"
//                                 value={variant.name}
//                                 onChange={(e) => handleVariantChange(variantIndex, 'name', e.target.value)}
//                                 placeholder="Variant Name"
//                             />
//                             <input
//                                 className="border p-2 rounded w-full mb-2"
//                                 type="number"
//                                 value={variant.price_adjustment}
//                                 onChange={(e) => handleVariantChange(variantIndex, 'price_adjustment', parseFloat(e.target.value))}
//                                 placeholder="Price Adjustment"
//                             />
//                             <input
//                                 className="border p-2 rounded w-full mb-2"
//                                 type="number"
//                                 value={variant.stock_quantity}
//                                 onChange={(e) => handleVariantChange(variantIndex, 'stock_quantity', parseInt(e.target.value))}
//                                 placeholder="Stock Quantity"
//                             />
//                             <h4 className="font-bold mb-2">Attributes</h4>
//                             {attributes.map((attribute) => (
//                                 <div key={attribute.id} className="mb-2">
//                                     <label className="block">{attribute.name}</label>
//                                     <input
//                                         className="border p-2 rounded w-full"
//                                         type="text"
//                                         value={variant.attribute_values.find(av => av.attribute_id === attribute.id)?.value || ''}
//                                         onChange={(e) => handleAttributeValueChange(variantIndex, attribute.id, e.target.value)}
//                                         placeholder={`Enter ${attribute.name}`}
//                                     />
//                                 </div>
//                             ))}
//                             <button
//                                 type="button"
//                                 onClick={() => removeVariant(variantIndex)}
//                                 className="bg-red-500 text-white px-3 py-1 rounded mt-2"
//                             >
//                                 Remove Variant
//                             </button>
//                         </div>
//                     ))}
//                     <button
//                         type="button"
//                         onClick={addVariant}
//                         className="bg-green-500 text-white px-3 py-1 rounded"
//                     >
//                         Add Variant
//                     </button>
//                 </div>
//
//                 <button type="submit" className="mt-4 bg-blue-500 text-white p-2 rounded">
//                     {isEditing ? 'Update Product' : 'Add Product'}
//                 </button>
//             </form>
//
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//                 {products.map((product) => (
//                     <motion.div
//                         key={product.id}
//                         className="border p-4 rounded shadow"
//                         whileHover={{ scale: 1.03 }}
//                         whileTap={{ scale: 0.98 }}
//                     >
//                         <h2 className="text-xl font-bold">{product.name}</h2>
//                         <p className="text-gray-600">{product.description}</p>
//                         <p className="text-lg font-semibold mt-2">${product.price}</p>
//                         <div className="mt-4 flex justify-end space-x-2">
//                             <button
//                                 onClick={() => handleEdit(product.id)}
//                                 className="bg-yellow-500 text-white px-3 py-1 rounded"
//                             >
//                                 Edit
//                             </button>
//                             <button
//                                 onClick={() => handleDelete(product.id)}
//                                 className="bg-red-500 text-white px-3 py-1 rounded"
//                             >
//                                 Delete
//                             </button>
//                         </div>
//                     </motion.div>
//                 ))}
//             </div>
//         </div>
//     );
// };
//
// export default ProductManagement;