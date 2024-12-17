import React from 'react';
import { motion } from 'framer-motion';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const JewelryAdminDashboard = () => {
    const stats = [
        { label: 'Total Sales', value: '$125,430', increase: '+12%' },
        { label: 'New Customers', value: '1,240', increase: '+5%' },
        { label: 'Avg. Order Value', value: '$1,180', increase: '+8%' },
        { label: 'Inventory Value', value: '$2,345,000', increase: '+3%' }
    ];

    const monthlySales = [
        { month: 'Jan', sales: 4000 },
        { month: 'Feb', sales: 3000 },
        { month: 'Mar', sales: 5000 },
        { month: 'Apr', sales: 4500 },
        { month: 'May', sales: 6000 },
        { month: 'Jun', sales: 5500 },
    ];

    const categoryBreakdown = [
        { name: 'Rings', value: 35 },
        { name: 'Necklaces', value: 25 },
        { name: 'Earrings', value: 20 },
        { name: 'Bracelets', value: 15 },
        { name: 'Watches', value: 5 },
    ];
    const recentOrders = [
        { id: '#12345', customer: 'Emma Johnson', product: 'Diamond Necklace', amount: '$3,500', status: 'Completed' },
        { id: '#12346', customer: 'Michael Chen', product: 'Gold Watch', amount: '$2,800', status: 'Processing' },
        { id: '#12347', customer: 'Sophia Patel', product: 'Emerald Earrings', amount: '$1,950', status: 'Shipped' },
        { id: '#12348', customer: 'Liam O\'Connor', product: 'Platinum Ring', amount: '$4,200', status: 'Completed' },
        { id: '#12349', customer: 'Zoe Rodriguez', product: 'Pearl Bracelet', amount: '$1,100', status: 'Processing' }
    ];
    const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#0088FE'];

    return (
        <div className="bg-gray-100 p-6 min-h-screen">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-4xl font-bold text-primary mb-8">Luxury Jewelry Dashboard</h1>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    {stats.map((stat, index) => (
                        <motion.div
                            key={index}
                            className="bg-white rounded-lg shadow-lg p-6"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <h2 className="text-lg font-semibold text-gray-600 mb-2">{stat.label}</h2>
                            <p className="text-3xl font-bold text-primary mb-1">{stat.value}</p>
                            <p className="text-sm font-medium text-green-500">{stat.increase}</p>
                        </motion.div>
                    ))}
                </div>

                {/* Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
                    {/* Monthly Sales Chart */}
                    <motion.div
                        className="bg-white rounded-lg shadow-lg p-6"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 }}
                    >
                        <h2 className="text-2xl font-semibold mb-4">Monthly Sales</h2>
                        <ResponsiveContainer width="100%" height={300}>
                            <AreaChart data={monthlySales}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="month" />
                                <YAxis />
                                <Tooltip />
                                <Area type="monotone" dataKey="sales" stroke="#8884d8" fill="#8884d8" fillOpacity={0.3} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </motion.div>

                    {/* Category Breakdown Chart */}
                    <motion.div
                        className="bg-white rounded-lg shadow-lg p-6"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3 }}
                    >
                        <h2 className="text-2xl font-semibold mb-4">Category Breakdown</h2>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={categoryBreakdown}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    outerRadius={100}
                                    fill="#8884d8"
                                    dataKey="value"
                                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                >
                                    {categoryBreakdown.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </motion.div>
                </div>

                {/* Top Selling Products */}
                <motion.div
                    className="bg-white rounded-lg shadow-lg p-6 mb-12"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4 }}
                >
                    <h2 className="text-2xl font-semibold mb-4">Top Selling Products</h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart
                            data={[
                                { name: 'Diamond Ring', sales: 120 },
                                { name: 'Gold Necklace', sales: 98 },
                                { name: 'Pearl Earrings', sales: 86 },
                                { name: 'Platinum Watch', sales: 75 },
                                { name: 'Sapphire Bracelet', sales: 62 },
                            ]}
                            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="sales" fill="#8884d8" />
                        </BarChart>
                    </ResponsiveContainer>
                </motion.div>
            </div>
            {/* Recent Orders */}
            <motion.div
                className="bg-white rounded-lg shadow-lg overflow-hidden"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 }}
            >
                <div className="p-6 bg-secondary text-white">
                    <h2 className="text-2xl font-semibold">Recent Orders</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                        {recentOrders.map((order, index) => (
                            <tr key={index}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{order.id}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.customer}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.product}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.amount}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          order.status === 'Completed' ? 'bg-green-100 text-green-800' :
                              order.status === 'Processing' ? 'bg-yellow-100 text-yellow-800' :
                                  'bg-blue-100 text-blue-800'
                      }`}>
                        {order.status}
                      </span>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </motion.div>
        
        </div>
    );
};

export default JewelryAdminDashboard;
// import React, { useState } from 'react';
// import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
// import { Card, CardContent, CardHeader, Typography, MenuItem, Select } from '@mui/material';
// import { DollarSign, ShoppingCart, TrendingUp, Package } from 'lucide-react';
//
// const salesData = [
//     { month: 'Jan', sales: 4000, revenue: 240000 },
//     { month: 'Feb', sales: 3000, revenue: 180000 },
//     { month: 'Mar', sales: 5000, revenue: 300000 },
//     { month: 'Apr', sales: 4500, revenue: 270000 },
//     { month: 'May', sales: 3500, revenue: 210000 },
//     { month: 'Jun', sales: 4200, revenue: 252000 },
// ];
//
// const categoryData = [
//     { name: 'Rings', value: 35 },
//     { name: 'Necklaces', value: 25 },
//     { name: 'Earrings', value: 20 },
//     { name: 'Bracelets', value: 15 },
//     { name: 'Watches', value: 5 },
// ];
//
// const inventoryData = [
//     { category: 'Rings', inStock: 500, lowStock: 50, outOfStock: 10 },
//     { category: 'Necklaces', inStock: 300, lowStock: 30, outOfStock: 5 },
//     { category: 'Earrings', inStock: 600, lowStock: 40, outOfStock: 15 },
//     { category: 'Bracelets', inStock: 200, lowStock: 20, outOfStock: 8 },
//     { category: 'Watches', inStock: 100, lowStock: 10, outOfStock: 2 },
// ];
//
// const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];
//
// const MetricCard = ({ title, value, trend, icon: Icon }) => (
//     <Card className="p-4 shadow-md">
//         <CardHeader className="flex items-center justify-between">
//             <Typography variant="h6">{title}</Typography>
//             <Icon className="h-6 w-6 text-gray-500" />
//         </CardHeader>
//         <CardContent>
//             <Typography variant="h4" className="font-bold">{value}</Typography>
//             <Typography variant="body2" className={`text-sm ${trend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
//                 {trend >= 0 ? '▲' : '▼'} {Math.abs(trend)}% from last month
//             </Typography>
//         </CardContent>
//     </Card>
// );
//
// const JewelryDashboard = () => {
//     const [selectedCategory, setSelectedCategory] = useState('Rings');
//
//     return (
//         <div className="p-4 space-y-4">
//             <Typography variant="h4" className="font-bold mb-6">Jewelry Dashboard</Typography>
//
//             <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
//                 <MetricCard title="Total Revenue" value="$1,452,000" trend={5.2} icon={DollarSign} />
//                 <MetricCard title="Total Sales" value="24,200" trend={3.8} icon={ShoppingCart} />
//                 <MetricCard title="Avg. Order Value" value="$600" trend={-1.5} icon={TrendingUp} />
//                 <MetricCard title="Inventory Value" value="$3,500,000" trend={2.1} icon={Package} />
//             </div>
//
//             <div className="grid gap-4 md:grid-cols-2">
//                 <Card className="p-4 shadow-md">
//                     <CardHeader>
//                         <Typography variant="h6">Sales and Revenue Trends</Typography>
//                     </CardHeader>
//                     <CardContent>
//                         <ResponsiveContainer width="100%" height={300}>
//                             <LineChart data={salesData}>
//                                 <CartesianGrid strokeDasharray="3 3" />
//                                 <XAxis dataKey="month" />
//                                 <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
//                                 <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
//                                 <Tooltip />
//                                 <Legend />
//                                 <Line yAxisId="left" type="monotone" dataKey="sales" stroke="#8884d8" name="Sales" />
//                                 <Line yAxisId="right" type="monotone" dataKey="revenue" stroke="#82ca9d" name="Revenue ($)" />
//                             </LineChart>
//                         </ResponsiveContainer>
//                     </CardContent>
//                 </Card>
//
//                 <Card className="p-4 shadow-md">
//                     <CardHeader>
//                         <Typography variant="h6">Sales by Category</Typography>
//                     </CardHeader>
//                     <CardContent>
//                         <ResponsiveContainer width="100%" height={300}>
//                             <PieChart>
//                                 <Pie
//                                     data={categoryData}
//                                     cx="50%"
//                                     cy="50%"
//                                     labelLine={false}
//                                     outerRadius={80}
//                                     fill="#8884d8"
//                                     dataKey="value"
//                                     label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
//                                 >
//                                     {categoryData.map((entry, index) => (
//                                         <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//                                     ))}
//                                 </Pie>
//                                 <Tooltip />
//                                 <Legend />
//                             </PieChart>
//                         </ResponsiveContainer>
//                     </CardContent>
//                 </Card>
//             </div>
//
//             <Card className="p-4 shadow-md">
//                 <CardHeader>
//                     <Typography variant="h6">Inventory Status</Typography>
//                     <Select
//                         value={selectedCategory}
//                         onChange={(e) => setSelectedCategory(e.target.value)}
//                         className="w-44"
//                     >
//                         {inventoryData.map(item => (
//                             <MenuItem key={item.category} value={item.category}>{item.category}</MenuItem>
//                         ))}
//                     </Select>
//                 </CardHeader>
//                 <CardContent>
//                     <ResponsiveContainer width="100%" height={300}>
//                         <BarChart data={inventoryData.filter(item => item.category === selectedCategory)}>
//                             <CartesianGrid strokeDasharray="3 3" />
//                             <XAxis dataKey="category" />
//                             <YAxis />
//                             <Tooltip />
//                             <Legend />
//                             <Bar dataKey="inStock" fill="#8884d8" name="In Stock" />
//                             <Bar dataKey="lowStock" fill="#82ca9d" name="Low Stock" />
//                             <Bar dataKey="outOfStock" fill="#ffc658" name="Out of Stock" />
//                         </BarChart>
//                     </ResponsiveContainer>
//                 </CardContent>
//             </Card>
//         </div>
//     );
// };
//
// export default JewelryDashboard;

// import React, { useState } from 'react';
// import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { Diamond, DollarSign, ShoppingCart, TrendingUp, Package } from 'lucide-react';
//
// const salesData = [
//     { month: 'Jan', sales: 4000, revenue: 240000 },
//     { month: 'Feb', sales: 3000, revenue: 180000 },
//     { month: 'Mar', sales: 5000, revenue: 300000 },
//     { month: 'Apr', sales: 4500, revenue: 270000 },
//     { month: 'May', sales: 3500, revenue: 210000 },
//     { month: 'Jun', sales: 4200, revenue: 252000 },
// ];
//
// const categoryData = [
//     { name: 'Rings', value: 35 },
//     { name: 'Necklaces', value: 25 },
//     { name: 'Earrings', value: 20 },
//     { name: 'Bracelets', value: 15 },
//     { name: 'Watches', value: 5 },
// ];
//
// const inventoryData = [
//     { category: 'Rings', inStock: 500, lowStock: 50, outOfStock: 10 },
//     { category: 'Necklaces', inStock: 300, lowStock: 30, outOfStock: 5 },
//     { category: 'Earrings', inStock: 600, lowStock: 40, outOfStock: 15 },
//     { category: 'Bracelets', inStock: 200, lowStock: 20, outOfStock: 8 },
//     { category: 'Watches', inStock: 100, lowStock: 10, outOfStock: 2 },
// ];
//
// const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];
//
// const MetricCard = ({ title, value, trend, icon: Icon }) => (
//     <Card>
//         <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium">{title}</CardTitle>
//             <Icon className="h-4 w-4 text-muted-foreground" />
//         </CardHeader>
//         <CardContent>
//             <div className="text-2xl font-bold">{value}</div>
//             <p className={`text-xs ${trend >= 0 ? 'text-green-500' : 'text-red-500'}`}>
//                 {trend >= 0 ? '▲' : '▼'} {Math.abs(trend)}% from last month
//             </p>
//         </CardContent>
//     </Card>
// );
//
// const JewelryDashboard = () => {
//     const [selectedCategory, setSelectedCategory] = useState('Rings');
//
//     return (
//         <div className="p-4 space-y-4">
//             <h1 className="text-3xl font-bold mb-6">Jewelry Dashboard</h1>
//
//             <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
//                 <MetricCard title="Total Revenue" value="$1,452,000" trend={5.2} icon={DollarSign} />
//                 <MetricCard title="Total Sales" value="24,200" trend={3.8} icon={ShoppingCart} />
//                 <MetricCard title="Avg. Order Value" value="$600" trend={-1.5} icon={TrendingUp} />
//                 <MetricCard title="Inventory Value" value="$3,500,000" trend={2.1} icon={Package} />
//             </div>
//
//             <div className="grid gap-4 md:grid-cols-2">
//                 <Card>
//                     <CardHeader>
//                         <CardTitle>Sales and Revenue Trends</CardTitle>
//                     </CardHeader>
//                     <CardContent>
//                         <ResponsiveContainer width="100%" height={300}>
//                             <LineChart data={salesData}>
//                                 <CartesianGrid strokeDasharray="3 3" />
//                                 <XAxis dataKey="month" />
//                                 <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
//                                 <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
//                                 <Tooltip />
//                                 <Legend />
//                                 <Line yAxisId="left" type="monotone" dataKey="sales" stroke="#8884d8" name="Sales" />
//                                 <Line yAxisId="right" type="monotone" dataKey="revenue" stroke="#82ca9d" name="Revenue ($)" />
//                             </LineChart>
//                         </ResponsiveContainer>
//                     </CardContent>
//                 </Card>
//
//                 <Card>
//                     <CardHeader>
//                         <CardTitle>Sales by Category</CardTitle>
//                     </CardHeader>
//                     <CardContent>
//                         <ResponsiveContainer width="100%" height={300}>
//                             <PieChart>
//                                 <Pie
//                                     data={categoryData}
//                                     cx="50%"
//                                     cy="50%"
//                                     labelLine={false}
//                                     outerRadius={80}
//                                     fill="#8884d8"
//                                     dataKey="value"
//                                     label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
//                                 >
//                                     {categoryData.map((entry, index) => (
//                                         <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//                                     ))}
//                                 </Pie>
//                                 <Tooltip />
//                                 <Legend />
//                             </PieChart>
//                         </ResponsiveContainer>
//                     </CardContent>
//                 </Card>
//             </div>
//
//             <Card>
//                 <CardHeader>
//                     <CardTitle>Inventory Status</CardTitle>
//                     <Select onValueChange={setSelectedCategory} defaultValue={selectedCategory}>
//                         <SelectTrigger className="w-[180px]">
//                             <SelectValue placeholder="Select category" />
//                         </SelectTrigger>
//                         <SelectContent>
//                             {inventoryData.map(item => (
//                                 <SelectItem key={item.category} value={item.category}>{item.category}</SelectItem>
//                             ))}
//                         </SelectContent>
//                     </Select>
//                 </CardHeader>
//                 <CardContent>
//                     <ResponsiveContainer width="100%" height={300}>
//                         <BarChart data={inventoryData.filter(item => item.category === selectedCategory)}>
//                             <CartesianGrid strokeDasharray="3 3" />
//                             <XAxis dataKey="category" />
//                             <YAxis />
//                             <Tooltip />
//                             <Legend />
//                             <Bar dataKey="inStock" fill="#8884d8" name="In Stock" />
//                             <Bar dataKey="lowStock" fill="#82ca9d" name="Low Stock" />
//                             <Bar dataKey="outOfStock" fill="#ffc658" name="Out of Stock" />
//                         </BarChart>
//                     </ResponsiveContainer>
//                 </CardContent>
//             </Card>
//         </div>
//     );
// };
//
// export default JewelryDashboard;
// // import React from 'react';
// //
// // const DashboardPage = () => (
// //     <div>
// //         <h1 className="text-primary text-4xl">Dashboard</h1>
// //         <p className="text-text-light mt-4">Overview of your store's performance.</p>
// //     </div>
// // );
// //
// // export default DashboardPage;