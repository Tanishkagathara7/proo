import React, { useState, useEffect, useCallback } from 'react';
import { 
  Package, 
  Receipt, 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  DollarSign,
  AlertTriangle,
  TrendingUp,
  Eye,
  X
} from 'lucide-react';
import ViewBillModal from './ViewBillModal';

const API_BASE_URL = 'http://localhost:5000/api';
const MAX_RETRIES = 3;

const PRODUCT_CATEGORIES = [
  'Spices & Masalas',
  'Rice, Dal & Grains',
  'Bakery & Dairy',
  'Snacks & Biscuits',
  'Packaged Foods',
  'Edible Oils & Ghee',
  'Chocolates',
  'Beverages',
  'Personal Care',
  'Household Items',
  'Baby Products',
  'Miscellaneous Items',
];

const App = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [products, setProducts] = useState([]);
  const [bills, setBills] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [productRetries, setProductRetries] = useState(0);
  const [billRetries, setBillRetries] = useState(0);
  const [statsRetries, setStatsRetries] = useState(0);

  // Enhanced fetchProducts with error details and retry
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/products`);
      if (!response.ok) {
        const text = await response.text();
        throw new Error(`Status ${response.status}: ${text}`);
      }
      const data = await response.json();
      setProducts(data);
      setToast(null);
      setProductRetries(0);
    } catch (error) {
      if (productRetries < MAX_RETRIES) {
        setProductRetries(productRetries + 1);
        setTimeout(fetchProducts, 1500);
      } else {
        setToast({ message: `Error fetching products: ${error.message}`, type: 'error' });
      }
    } finally {
      setLoading(false);
    }
  }, [productRetries]);

  const fetchBills = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/bills`);
      if (!response.ok) {
        const text = await response.text();
        throw new Error(`Status ${response.status}: ${text}`);
      }
      const data = await response.json();
      setBills(data);
      setToast(null);
      setBillRetries(0);
    } catch (error) {
      if (billRetries < MAX_RETRIES) {
        setBillRetries(billRetries + 1);
        setTimeout(fetchBills, 1500);
      } else {
        setToast({ message: `Error fetching bills: ${error.message}`, type: 'error' });
    }
    }
  }, [billRetries]);

  const fetchStats = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/dashboard/stats`);
      if (!response.ok) {
        const text = await response.text();
        throw new Error(`Status ${response.status}: ${text}`);
      }
      const data = await response.json();
      setStats(data);
      setToast(null);
      setStatsRetries(0);
    } catch (error) {
      if (statsRetries < MAX_RETRIES) {
        setStatsRetries(statsRetries + 1);
        setTimeout(fetchStats, 1500);
      } else {
        setToast({ message: `Error fetching stats: ${error.message}`, type: 'error' });
    }
    }
  }, [statsRetries]);

  useEffect(() => {
    fetchProducts();
    fetchBills();
    fetchStats();
  }, []);

  return (
    <div className={
      `min-h-screen ${darkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900'} font-sans transition-colors duration-300`
    }>
      {loading && <Spinner />}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      {/* Header */}
      <header className={`shadow-sm border-b ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <Package className={`h-8 w-8 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
              <h1 className="text-2xl font-bold">Provision Store</h1>
            </div>
            <nav className="flex flex-wrap gap-2 sm:space-x-8 items-center justify-center sm:justify-end">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium ${
                  activeTab === 'dashboard' 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <TrendingUp className="h-4 w-4" />
                <span>Dashboard</span>
              </button>
              <button
                onClick={() => setActiveTab('products')}
                className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium ${
                  activeTab === 'products' 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <Package className="h-4 w-4" />
                <span>Products</span>
              </button>
              <button
                onClick={() => setActiveTab('billing')}
                className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium ${
                  activeTab === 'billing' 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <Receipt className="h-4 w-4" />
                <span>Billing</span>
              </button>
              <button
                onClick={() => setActiveTab('customers')}
                className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium ${
                  activeTab === 'customers'
                    ? 'bg-yellow-100 text-yellow-700'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <span>👤 Customers</span>
              </button>
              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`ml-6 px-3 py-2 rounded-md text-sm font-medium border ${darkMode ? 'bg-gray-700 text-gray-200 border-gray-600' : 'bg-gray-100 text-gray-700 border-gray-300'} hover:scale-105 transition-transform`}
                title="Toggle dark mode"
              >
                {darkMode ? '🌙 Dark' : '☀️ Light'}
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-4 sm:py-8">
        {activeTab === 'dashboard' && (
          <Dashboard stats={stats} products={products} bills={bills} darkMode={darkMode} setActiveTab={setActiveTab} />
        )}
        {activeTab === 'products' && (
          <ProductSection 
            products={products} 
            setProducts={setProducts}
            fetchProducts={fetchProducts}
          />
        )}
        {activeTab === 'billing' && (
          <BillingSection 
            bills={bills} 
            setBills={setBills}
            products={products}
            fetchBills={fetchBills}
          />
        )}
        {activeTab === 'customers' && (
          <CustomersSection bills={bills} />
        )}
      </main>
    </div>
  );
};

// Dashboard Component
const Dashboard = ({ stats, products, bills, darkMode, setActiveTab }) => {
  const recentBills = bills.slice(0, 5);

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold mb-2">Dashboard</h2>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <StatCard
          title="Total Products"
          value={stats.totalProducts || 0}
          icon={<Package className="h-6 w-6" />}
          color="bg-gradient-to-r from-blue-500 to-blue-700"
          darkMode={darkMode}
          onClick={() => setActiveTab('products')}
        />
        <StatCard
          title="Total Bills"
          value={stats.totalBills || 0}
          icon={<Receipt className="h-6 w-6" />}
          color="bg-gradient-to-r from-green-400 to-green-600"
          darkMode={darkMode}
          onClick={() => setActiveTab('billing')}
        />
        <StatCard
          title="Total Revenue"
          value={`₹${(stats.totalRevenue || 0).toLocaleString()}`}
          icon={<DollarSign className="h-6 w-6" />}
          color="bg-gradient-to-r from-purple-500 to-pink-500"
          darkMode={darkMode}
          onClick={() => setActiveTab('billing')}
        />
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Bills</h3>
          <div className="space-y-3">
            {recentBills.length > 0 ? (
              recentBills.map(bill => (
                <div key={bill._id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{bill.billNumber}</p>
                    <p className="text-sm text-gray-500">{bill.customerName}</p>
                  </div>
                  <span className="text-green-600 font-semibold">₹{bill.totalAmount}</span>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">No bills yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Stat Card Component
const StatCard = ({ title, value, icon, color, darkMode, onClick }) => (
  <button
    className={`rounded-lg shadow p-6 w-full text-left transform transition-transform duration-200 hover:scale-105 animate-fadeIn focus:outline-none ${color} ${darkMode ? 'text-gray-100' : 'text-white'}`}
    style={{ minHeight: 120 }}
    onClick={onClick}
    tabIndex={0}
    aria-label={title}
  >
    <div className="flex items-center">
      <div className="rounded-lg p-3 bg-white bg-opacity-20 mr-4">
        {icon}
      </div>
      <div>
        <p className="text-sm font-medium">{title}</p>
        <p className="text-2xl font-semibold">{value}</p>
      </div>
    </div>
  </button>
);

// Product Section Component
const ProductSection = ({ products, setProducts, fetchProducts }) => {
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formLoading, setFormLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await fetch(`${API_BASE_URL}/products/${id}`, {
          method: 'DELETE',
        });
        fetchProducts();
      } catch (error) {
        console.error('Error deleting product:', error);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-gray-900">Products</h2>
        <button
          onClick={() => setShowForm(true)}
          className="bg-gradient-to-r from-blue-500 to-blue-700 text-white px-6 py-2 rounded-lg shadow hover:scale-105 transform transition-transform duration-150 flex items-center space-x-2 font-semibold text-lg disabled:opacity-50"
          disabled={formLoading}
        >
          <Plus className="h-5 w-5" />
          <span>Add Product</span>
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map(product => (
          <ProductCard
            key={product._id}
            product={product}
            onEdit={(product) => {
              setEditingProduct(product);
              setShowForm(true);
            }}
            onDelete={() => handleDelete(product._id)}
          />
        ))}
      </div>

      {/* Product Form Modal */}
      {showForm && (
        <ProductForm
          product={editingProduct}
          onClose={() => {
            setShowForm(false);
            setEditingProduct(null);
          }}
          onSave={async () => {
            setFormLoading(true);
            try {
              await fetchProducts();
              setToast({ message: editingProduct ? 'Product updated!' : 'Product added!', type: 'success' });
            } catch {
              setToast({ message: 'Error saving product', type: 'error' });
            } finally {
              setFormLoading(false);
            }
          }}
        />
      )}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
};

// Product Card Component
const ProductCard = ({ product, onEdit, onDelete }) => (
  <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
    <div className="flex justify-between items-start mb-4">
      <div>
        <h3 className="text-lg font-semibold text-gray-900">{product.name}</h3>
        <p className="text-sm text-gray-500">{product.category}</p>
      </div>
      <div className="flex space-x-2">
        <button
          onClick={() => onEdit(product)}
          className="text-blue-600 hover:text-blue-700"
        >
          <Edit className="h-4 w-4" />
        </button>
        <button
          onClick={onDelete}
          className="text-red-600 hover:text-red-700"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
    
    <div className="space-y-2">
      <div className="flex justify-between">
        <span className="text-gray-600">Units:</span>
        <span className={`font-semibold ${product.units < 10 ? 'text-red-600' : 'text-gray-900'}`}>{product.units}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-gray-600">Weight:</span>
        <span className="font-semibold text-gray-900">{product.weight} {product.weightUnit || 'kg'}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-gray-600">Price:</span>
        <span className="font-semibold text-green-600">₹{product.price}</span>
      </div>
    </div>
  </div>
);

// Product Form Component
const ProductForm = ({ product, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: product?.name || '',
    units: product?.units || '',
    weight: product?.weight || '',
    weightUnit: product?.weightUnit || 'kg',
    price: product?.price || '',
    category: product?.category || 'Grains',
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const url = product 
        ? `${API_BASE_URL}/products/${product._id}`
        : `${API_BASE_URL}/products`;
      const method = product ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error('Failed to save product');
      await onSave();
      onClose();
    } catch (err) {
      setError('Error saving product');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 sm:p-4 z-50">
      <div className="bg-white rounded-lg max-w-lg sm:max-w-md w-full p-4 sm:p-6 shadow-lg animate-fadeIn">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            {product ? 'Edit Product' : 'Add New Product'}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
        </div>
        {error && <div className="text-red-600 mb-2">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Product Name
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Units
              </label>
              <input
                type="number"
                required
                min="0"
                value={formData.units}
                onChange={(e) => setFormData({ ...formData, units: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Weight
              </label>
              <div className="flex">
              <input
                type="number"
                required
                min="0"
                step="0.01"
                value={formData.weight}
                onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-l-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
              />
                <select
                  value={formData.weightUnit}
                  onChange={(e) => setFormData({ ...formData, weightUnit: e.target.value })}
                  className="px-2 py-2 border border-gray-300 rounded-r-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                >
                  <option value="kg">kg</option>
                  <option value="gram">gram</option>
                </select>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price (₹)
              </label>
              <input
                type="number"
                required
                min="0"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                required
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
              >
                <option value="">Select Category</option>
                {PRODUCT_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
              disabled={submitting}
            >
              {submitting ? 'Saving...' : (product ? 'Update' : 'Create')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Billing Section Component
const BillingSection = ({ bills, setBills, products, fetchBills }) => {
  const [showForm, setShowForm] = useState(false);
  const [editingBill, setEditingBill] = useState(null);
  const [viewingBill, setViewingBill] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredBills = bills.filter(bill =>
    bill.billNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    bill.customerName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this bill?')) {
      try {
        await fetch(`${API_BASE_URL}/bills/${id}`, {
          method: 'DELETE',
        });
        fetchBills();
      } catch (error) {
        console.error('Error deleting bill:', error);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-gray-900">Billing</h2>
        <button
          onClick={() => setShowForm(true)}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Create Bill</span>
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <input
          type="text"
          placeholder="Search bills..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Bills Table */}
      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 text-xs sm:text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Bill Number
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Customer
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Amount
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredBills.map((bill) => (
              <tr key={bill._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {bill.billNumber}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <div>
                    <div className="font-medium">{bill.customerName}</div>
                    <div className="text-gray-500">{bill.customerPhone}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  ₹{bill.totalAmount.toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    bill.paymentStatus === 'paid' 
                      ? 'bg-green-100 text-green-800'
                      : bill.paymentStatus === 'partial'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {bill.paymentStatus}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {new Date(bill.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    {bill.customerPhone && (
                      <div className="relative group">
                        <a
                          href={`https://wa.me/91${bill.customerPhone.replace(/\D/g, '')}?text=${encodeURIComponent(
                            `Hello ${bill.customerName},\nHere are your bill details:\nBill No: ${bill.billNumber}\nAmount: ₹${bill.totalAmount}\nStatus: ${bill.paymentStatus}\nThank you for shopping with us!`
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-green-500 hover:bg-green-600 hover:scale-110 transition-all duration-150 shadow-md"
                          title="Send bill via WhatsApp"
                    >
                          <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="w-5 h-5 text-white">
                            <path d="M20.52 3.48A11.94 11.94 0 0012 0C5.37 0 0 5.37 0 12c0 2.12.55 4.13 1.6 5.92L0 24l6.18-1.62A11.94 11.94 0 0012 24c6.63 0 12-5.37 12-12 0-3.19-1.24-6.19-3.48-8.52zM12 22c-1.85 0-3.63-.5-5.18-1.44l-.37-.22-3.67.96.98-3.58-.24-.37A9.94 9.94 0 012 12c0-5.52 4.48-10 10-10s10 4.48 10 10-4.48 10-10 10zm5.07-7.75c-.28-.14-1.65-.81-1.9-.9-.25-.09-.43-.14-.61.14-.18.28-.7.9-.86 1.08-.16.18-.32.2-.6.07-.28-.14-1.18-.44-2.25-1.4-.83-.74-1.39-1.65-1.55-1.93-.16-.28-.02-.43.12-.57.13-.13.28-.34.42-.51.14-.17.18-.29.28-.48.09-.19.05-.36-.02-.5-.07-.14-.61-1.47-.84-2.01-.22-.53-.45-.46-.62-.47-.16-.01-.36-.01-.56-.01-.19 0-.5.07-.76.34-.26.27-1 1-.97 2.43.03 1.43 1.03 2.81 1.18 3 .15.19 2.03 3.1 4.93 4.23.69.3 1.23.48 1.65.61.69.22 1.32.19 1.81.12.55-.08 1.65-.67 1.88-1.32.23-.65.23-1.2.16-1.32-.07-.12-.25-.19-.53-.33z" />
                          </svg>
                        </a>
                      </div>
                    )}
                    <button
                      onClick={() => {
                        setEditingBill(bill);
                        setShowForm(true);
                      }}
                      className="text-green-600 hover:text-green-700"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(bill._id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Bill Form Modal */}
      {showForm && (
        <BillForm
          bill={editingBill}
          products={products}
          onClose={() => {
            setShowForm(false);
            setEditingBill(null);
          }}
          onSave={fetchBills}
        />
      )}

      {/* View Bill Modal */}
      {viewingBill && (
        <ViewBillModal
          bill={viewingBill}
          onClose={() => setViewingBill(null)}
        />
      )}
    </div>
  );
};

// Bill Form Component
const BillForm = ({ bill, products, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    customerName: bill?.customerName || '',
    customerPhone: bill?.customerPhone || '',
    paymentMethod: bill?.paymentMethod || 'cash',
    paymentStatus: bill?.paymentStatus || 'pending',
    items: bill?.items || []
  });

  const [newItem, setNewItem] = useState({
    productId: '',
    quantity: 1
  });

  const addItem = () => {
    if (!newItem.productId) return;
    
    const product = products.find(p => p._id === newItem.productId);
    if (!product) return;

    const item = {
      productId: product._id,
      productName: product.name,
      quantity: newItem.quantity,
      unitPrice: product.price,
      totalPrice: product.price * newItem.quantity
    };

    setFormData({
      ...formData,
      items: [...formData.items, item]
    });

    setNewItem({ productId: '', quantity: 1 });
  };

  const removeItem = (index) => {
    const newItems = formData.items.filter((_, i) => i !== index);
    setFormData({ ...formData, items: newItems });
  };

  const totalAmount = formData.items.reduce((sum, item) => sum + item.totalPrice, 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const billData = {
        ...formData,
        totalAmount
      };

      const url = bill 
        ? `${API_BASE_URL}/bills/${bill._id}`
        : `${API_BASE_URL}/bills`;
      
      const method = bill ? 'PUT' : 'POST';
      
      await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(billData),
      });
      
      onSave();
      onClose();
    } catch (error) {
      console.error('Error saving bill:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 sm:p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-lg sm:max-w-md p-4 sm:p-6 shadow-lg relative max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            {bill ? 'Edit Bill' : 'Create New Bill'}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Customer Info */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Customer Name
              </label>
              <input
                type="text"
                required
                value={formData.customerName}
                onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Customer Phone
              </label>
              <input
                type="tel"
                value={formData.customerPhone}
                onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
              />
            </div>
          </div>

          {/* Add Items */}
          <div className="border-t pt-4">
            <h4 className="text-md font-medium text-gray-900 mb-3">Add Items</h4>
            <div className="flex space-x-4 items-end">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Product
                </label>
                <select
                  value={newItem.productId}
                  onChange={(e) => setNewItem({ ...newItem, productId: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                >
                  <option value="">Select Product</option>
                  {products.map(product => (
                    <option key={product._id} value={product._id}>
                      {product.name} - ₹{product.price}
                    </option>
                  ))}
                </select>
              </div>
              <div className="w-24">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Quantity
                </label>
                <input
                  type="number"
                  min="1"
                  value={newItem.quantity}
                  onChange={(e) => setNewItem({ ...newItem, quantity: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                />
              </div>
              <button
                type="button"
                onClick={addItem}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                Add Item
              </button>
            </div>
          </div>
          {/* Items List */}
          <div className="mt-4">
            <h4 className="text-md font-medium text-gray-900 mb-3">
              Items List
            </h4>
            <div className="bg-gray-50 rounded-lg p-4">
              {formData.items.length > 0 ? (
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text
                        -gray-500 uppercase tracking-wider">
                        Product
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Quantity
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text
                        -gray-500 uppercase tracking-wider">
                        Unit Price
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text
                        -gray-500 uppercase tracking-wider">
                        Total Price
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {formData.items.map((item, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {item.productName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {item.quantity}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          ₹{item.unitPrice.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          ₹{item.totalPrice.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => removeItem(index)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="text-gray-500 text-center py-4">No items added yet</p>
              )}
            </div>
          </div>
          {/* Total Amount */}
          <div className="flex justify-between items-center mt-4">
            <span className="text-lg font-semibold text-gray-900">Total Amount:</span>
            <span className="text-lg font-semibold text-green-600">
              ₹{totalAmount.toFixed(2)}
            </span>
          </div>
          {/* Payment Info */}
          <div className="border-t pt-4">
            <h4 className="text-md font-medium text-gray-900 mb-3">
              Payment Information
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Payment Method
                </label>
                <select
                  value={formData.paymentMethod}
                  onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                >
                  <option value="cash">Cash</option>
                  <option value="card">Card</option>
                  <option value="upi">UPI</option>
                  <option value="credit">Credit</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Payment Status
                </label>
                <select
                  value={formData.paymentStatus}
                  onChange={(e) => setFormData({ ...formData, paymentStatus: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                >
                  <option value="paid">Paid</option>
                  <option value="pending">Pending</option>
                  <option value="partial">Partial</option>
                </select>
              </div>
            </div>
          </div>
          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              {bill ? 'Update Bill' : 'Create Bill'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Toast Component
const Toast = ({ message, type, onClose }) => (
  <div className={`fixed top-6 right-6 z-50 px-6 py-3 rounded shadow-lg text-white ${type === 'success' ? 'bg-green-600' : 'bg-red-600'}`}
    style={{ minWidth: 200 }}>
    <div className="flex items-center justify-between">
      <span>{message}</span>
      <button onClick={onClose} className="ml-4 font-bold">&times;</button>
    </div>
  </div>
);

// Spinner Component
const Spinner = () => (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-20 z-50">
    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-600 border-solid"></div>
  </div>
);

// Customers Section
const CustomersSection = ({ bills }) => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Group bills by customerName + customerPhone
  const customers = {};
  bills.forEach(bill => {
    const key = bill.customerName + '|' + (bill.customerPhone || '');
    if (!customers[key]) {
      customers[key] = {
        name: bill.customerName,
        phone: bill.customerPhone,
        bills: [],
      };
    }
    customers[key].bills.push(bill);
  });
  let customerList = Object.values(customers);

  // Search/filter
  customerList = customerList.filter(c =>
    (c.name?.toLowerCase().includes(search.toLowerCase()) ||
     (c.phone || '').includes(search)) &&
    (statusFilter === 'all' || c.bills.some(b => b.paymentStatus === statusFilter))
  );

  // Summary
  const totalPaid = customerList.reduce((sum, c) => sum + c.bills.filter(b => b.paymentStatus === 'paid').reduce((s, b) => s + b.totalAmount, 0), 0);
  const totalPending = customerList.reduce((sum, c) => sum + c.bills.filter(b => b.paymentStatus !== 'paid').reduce((s, b) => s + b.totalAmount, 0), 0);

  // Export to CSV
  const exportCSV = () => {
    let csv = 'Customer Name,Phone,Bill Number,Status,Amount\n';
    customerList.forEach(c => {
      c.bills.forEach(bill => {
        csv += `${c.name},${c.phone || ''},${bill.billNumber},${bill.paymentStatus},${bill.totalAmount}\n`;
      });
    });
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'customers.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  // Helper to validate Indian mobile number
  function isValidIndianMobile(number) {
    return /^\d{10}$/.test(number);
  }

  // Helper to build WhatsApp message
  function buildWhatsAppMessage(customer, bill) {
    return [
      `Hello ${customer.name},`,
      'Here are your bill details:',
      `Bill No: ${bill.billNumber}`,
      `Amount: ₹${bill.totalAmount}`,
      `Status: ${bill.paymentStatus}`,
      '',
      'Thank you for shopping with us!'
    ].join('%0A');
  }

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold mb-4">Customers</h2>
      <div className="flex flex-wrap gap-4 items-center mb-4">
        <input
          type="text"
          placeholder="Search by name or phone..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md"
        >
          <option value="all">All</option>
          <option value="paid">Paid</option>
          <option value="pending">Pending</option>
          <option value="partial">Partial</option>
        </select>
        <button
          onClick={exportCSV}
          className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
        >
          Export to CSV
        </button>
        <div className="ml-auto font-semibold">
          <span className="text-green-600">Total Paid: ₹{totalPaid}</span>
          <span className="ml-4 text-red-600">Total Pending: ₹{totalPending}</span>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {customerList.length === 0 && <div>No customers found.</div>}
        {customerList.map((customer, idx) => {
          return (
            <div
              key={idx}
              className="bg-white rounded-lg shadow p-6 cursor-pointer hover:scale-105 transition-transform"
              onClick={() => { setSelectedCustomer(customer); setShowModal(true); }}
            >
              <div className="mb-2">
                <span className="font-semibold text-lg">{customer.name}</span>
                {customer.phone && <span className="ml-2 text-gray-500">({customer.phone})</span>}
              </div>
              <div className="mb-2">
                <span className="text-green-600 font-semibold">Paid: ₹{customer.bills.filter(b => b.paymentStatus === 'paid').reduce((s, b) => s + b.totalAmount, 0)}</span>
                <span className="ml-4 text-red-600 font-semibold">Pending: ₹{customer.bills.filter(b => b.paymentStatus !== 'paid').reduce((s, b) => s + b.totalAmount, 0)}</span>
              </div>
              <div className="mt-2">
                <div className="font-semibold mb-1">Bills:</div>
                <ul className="space-y-1">
                  {customer.bills.map(bill => (
                    <li key={bill._id} className="flex justify-between items-center text-sm">
                      <span>{bill.billNumber}</span>
                      <span className={
                        bill.paymentStatus === 'paid' ? 'bg-green-100 text-green-700 px-2 py-1 rounded-full' :
                        bill.paymentStatus === 'partial' ? 'bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full' :
                        'bg-red-100 text-red-700 px-2 py-1 rounded-full'
                      }>
                        {bill.paymentStatus}
                      </span>
                      <span>₹{bill.totalAmount}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          );
        })}
      </div>
      {/* Customer Details Modal */}
      {showModal && selectedCustomer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fadeIn">
          <div className="bg-white rounded-lg max-w-lg w-full p-6 shadow-lg relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 text-2xl"
            >
              &times;
            </button>
            <h3 className="text-xl font-bold mb-2">{selectedCustomer.name}</h3>
            {selectedCustomer.phone && <div className="mb-2 text-gray-500">Phone: {selectedCustomer.phone}</div>}
            <div className="mb-2">
              <span className="text-green-600 font-semibold">Paid: ₹{selectedCustomer.bills.filter(b => b.paymentStatus === 'paid').reduce((s, b) => s + b.totalAmount, 0)}</span>
              <span className="ml-4 text-red-600 font-semibold">Pending: ₹{selectedCustomer.bills.filter(b => b.paymentStatus !== 'paid').reduce((s, b) => s + b.totalAmount, 0)}</span>
            </div>
            <div className="font-semibold mb-1">Bills:</div>
            <ul className="space-y-1 max-h-60 overflow-y-auto">
              {selectedCustomer.bills.map(bill => {
                const phone = (selectedCustomer.phone || '').replace(/\D/g, '');
                const valid = isValidIndianMobile(phone);
                const waMessage = buildWhatsAppMessage(selectedCustomer, bill);
                const waLink = valid
                  ? `https://wa.me/91${phone}?text=${waMessage}`
                  : undefined;
                return (
                  <li key={bill._id} className="flex justify-between items-center text-sm gap-2">
                    <span>{bill.billNumber}</span>
                    <span className={
                      bill.paymentStatus === 'paid' ? 'bg-green-100 text-green-700 px-2 py-1 rounded-full' :
                      bill.paymentStatus === 'partial' ? 'bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full' :
                      'bg-red-100 text-red-700 px-2 py-1 rounded-full'
                    }>
                      {bill.paymentStatus}
                    </span>
                    <span>₹{bill.totalAmount}</span>
                    <div className="relative group ml-2">
                      <a
                        href={waLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`inline-flex items-center justify-center w-8 h-8 rounded-full transition-all duration-150 shadow-md ${valid ? 'bg-green-500 hover:bg-green-600 hover:scale-110' : 'bg-gray-300 cursor-not-allowed'}`}
                        style={{ pointerEvents: valid ? 'auto' : 'none' }}
                        title={valid ? 'Send bill via WhatsApp' : 'Enter a valid 10-digit mobile number'}
                        tabIndex={valid ? 0 : -1}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="w-5 h-5 text-white">
                          <path d="M20.52 3.48A11.94 11.94 0 0012 0C5.37 0 0 5.37 0 12c0 2.12.55 4.13 1.6 5.92L0 24l6.18-1.62A11.94 11.94 0 0012 24c6.63 0 12-5.37 12-12 0-3.19-1.24-6.19-3.48-8.52zM12 22c-1.85 0-3.63-.5-5.18-1.44l-.37-.22-3.67.96.98-3.58-.24-.37A9.94 9.94 0 012 12c0-5.52 4.48-10 10-10s10 4.48 10 10-4.48 10-10 10zm5.07-7.75c-.28-.14-1.65-.81-1.9-.9-.25-.09-.43-.14-.61.14-.18.28-.7.9-.86 1.08-.16.18-.32.2-.6.07-.28-.14-1.18-.44-2.25-1.4-.83-.74-1.39-1.65-1.55-1.93-.16-.28-.02-.43.12-.57.13-.13.28-.34.42-.51.14-.17.18-.29.28-.48.09-.19.05-.36-.02-.5-.07-.14-.61-1.47-.84-2.01-.22-.53-.45-.46-.62-.47-.16-.01-.36-.01-.56-.01-.19 0-.5.07-.76.34-.26.27-1 1-.97 2.43.03 1.43 1.03 2.81 1.18 3 .15.19 2.03 3.1 4.93 4.23.69.3 1.23.48 1.65.61.69.22 1.32.19 1.81.12.55-.08 1.65-.67 1.88-1.32.23-.65.23-1.2.16-1.32-.07-.12-.25-.19-.53-.33z" />
                        </svg>
                      </a>
                      {!valid && (
                        <span className="absolute left-1/2 -translate-x-1/2 mt-2 w-40 bg-gray-700 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none">
                          Enter a valid 10-digit mobile number to enable WhatsApp
                        </span>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;