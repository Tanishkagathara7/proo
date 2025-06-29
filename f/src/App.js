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

const API_BASE_URL = 'https://proo-dg52.onrender.com/api';
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
  'Hotel Amenities & Supplies',
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
  const [viewingBill, setViewingBill] = useState(null);

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

  // Event listener for viewing bills from customer section
  useEffect(() => {
    const handleViewBill = (event) => {
      setViewingBill(event.detail);
    };

    window.addEventListener('viewBill', handleViewBill);
    return () => window.removeEventListener('viewBill', handleViewBill);
  }, []);

  return (
    <div className={
      `min-h-screen ${darkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900'} font-sans transition-all duration-500 ease-in-out`
    }>
      {loading && <Spinner />}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      {/* Header */}
      <header className={`shadow-sm border-b transition-all duration-300 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'} sticky top-0 z-40 backdrop-blur-sm bg-opacity-95`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <Package className={`h-8 w-8 transition-all duration-300 ${darkMode ? 'text-blue-400' : 'text-blue-600'} hover:scale-110 hover:rotate-12`} />
              <h1 className="text-2xl font-bold transition-all duration-300 hover:scale-105">Provision Store</h1>
            </div>
            <nav className="flex flex-wrap gap-2 sm:space-x-8 items-center justify-center sm:justify-end">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 hover:scale-105 ${
                  activeTab === 'dashboard' 
                    ? 'bg-blue-100 text-blue-700 shadow-md' 
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                }`}
              >
                <TrendingUp className="h-4 w-4" />
                <span>Dashboard</span>
              </button>
              <button
                onClick={() => setActiveTab('products')}
                className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 hover:scale-105 ${
                  activeTab === 'products' 
                    ? 'bg-blue-100 text-blue-700 shadow-md' 
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Package className="h-4 w-4" />
                <span>Products</span>
              </button>
              <button
                onClick={() => setActiveTab('billing')}
                className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 hover:scale-105 ${
                  activeTab === 'billing' 
                    ? 'bg-blue-100 text-blue-700 shadow-md' 
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Receipt className="h-4 w-4" />
                <span>Billing</span>
              </button>
              <button
                onClick={() => setActiveTab('customers')}
                className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 hover:scale-105 ${
                  activeTab === 'customers'
                    ? 'bg-yellow-100 text-yellow-700 shadow-md'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                }`}
              >
                <span>👤 Customers</span>
              </button>
              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`ml-6 px-3 py-2 rounded-md text-sm font-medium border transition-all duration-300 hover:scale-105 hover:shadow-lg ${darkMode ? 'bg-gray-700 text-gray-200 border-gray-600' : 'bg-gray-100 text-gray-700 border-gray-300'}`}
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
        <div className="animate-fadeIn">
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
            <CustomersSection bills={bills} fetchBills={fetchBills} />
        )}
        </div>
      </main>

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

// Dashboard Component
const Dashboard = ({ stats, products, bills, darkMode, setActiveTab }) => {
  const recentBills = bills.slice(0, 5);
  const lowStockProducts = products.filter(p => p.units < 10);
  const totalRevenue = stats.totalRevenue || 0;
  const monthlyRevenue = bills
    .filter(bill => {
      const billDate = new Date(bill.createdAt);
      const currentDate = new Date();
      return billDate.getMonth() === currentDate.getMonth() && 
             billDate.getFullYear() === currentDate.getFullYear();
    })
    .reduce((sum, bill) => sum + bill.totalAmount, 0);

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-4xl font-bold text-gray-900 mb-2">Dashboard</h2>
          <p className="text-gray-600">Welcome to your provision store management system</p>
        </div>
        <div className="mt-4 sm:mt-0">
          <div className="text-sm text-gray-500">
            Last updated: {new Date().toLocaleString()}
          </div>
        </div>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Products"
          value={stats.totalProducts || 0}
          icon={<Package className="h-6 w-6" />}
          color="bg-gradient-to-br from-blue-500 to-blue-600"
          darkMode={darkMode}
          onClick={() => setActiveTab('products')}
          trend="+12%"
          trendUp={true}
        />
        <StatCard
          title="Total Bills"
          value={stats.totalBills || 0}
          icon={<Receipt className="h-6 w-6" />}
          color="bg-gradient-to-br from-green-500 to-green-600"
          darkMode={darkMode}
          onClick={() => setActiveTab('billing')}
          trend="+8%"
          trendUp={true}
        />
        <StatCard
          title="Total Revenue"
          value={`₹${totalRevenue.toLocaleString()}`}
          icon={<DollarSign className="h-6 w-6" />}
          color="bg-gradient-to-br from-purple-500 to-purple-600"
          darkMode={darkMode}
          onClick={() => setActiveTab('billing')}
          trend="+15%"
          trendUp={true}
        />
        <StatCard
          title="Low Stock Items"
          value={lowStockProducts.length}
          icon={<AlertTriangle className="h-6 w-6" />}
          color="bg-gradient-to-br from-red-500 to-red-600"
          darkMode={darkMode}
          onClick={() => setActiveTab('products')}
          trend=""
          trendUp={false}
        />
      </div>

      {/* Monthly Revenue Card */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl p-6 text-white shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold mb-2">Monthly Revenue</h3>
            <p className="text-3xl font-bold">₹{monthlyRevenue.toLocaleString()}</p>
            <p className="text-indigo-100 text-sm mt-1">
              {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl mb-1">📈</div>
            <div className="text-sm text-indigo-100">This Month</div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Bills */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Recent Bills</h3>
                <button
                  onClick={() => setActiveTab('billing')}
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors duration-200"
                >
                  View All →
                </button>
              </div>
            </div>
            <div className="p-6">
            {recentBills.length > 0 ? (
                <div className="space-y-4">
                  {recentBills.map((bill, index) => (
                    <div 
                      key={bill._id} 
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all duration-200 hover:scale-105 cursor-pointer border border-gray-200 hover:border-blue-300"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <Receipt className="h-5 w-5 text-blue-600" />
                        </div>
                  <div>
                          <p className="font-semibold text-gray-900 hover:text-blue-600 transition-colors duration-200">
                            {bill.billNumber}
                          </p>
                    <p className="text-sm text-gray-500">{bill.customerName}</p>
                  </div>
                </div>
                      <div className="text-right">
                        <p className="font-semibold text-green-600">₹{bill.totalAmount}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(bill.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="text-4xl mb-4">📄</div>
                  <p className="text-gray-500">No bills yet</p>
                  <button
                    onClick={() => setActiveTab('billing')}
                    className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
                  >
                    Create First Bill
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions & Alerts */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-green-50 to-green-100 px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
            </div>
            <div className="p-6 space-y-3">
              <button
                onClick={() => setActiveTab('billing')}
                className="w-full flex items-center space-x-3 p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-all duration-200 hover:scale-105 text-left"
              >
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <Plus className="h-4 w-4 text-white" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Create Bill</p>
                  <p className="text-sm text-gray-500">Generate new invoice</p>
                </div>
              </button>
              
              <button
                onClick={() => setActiveTab('products')}
                className="w-full flex items-center space-x-3 p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-all duration-200 hover:scale-105 text-left"
              >
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <Package className="h-4 w-4 text-white" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Add Product</p>
                  <p className="text-sm text-gray-500">Add new inventory</p>
                </div>
              </button>
              
              <button
                onClick={() => setActiveTab('customers')}
                className="w-full flex items-center space-x-3 p-3 bg-purple-50 rounded-lg hover:bg-purple-100 transition-all duration-200 hover:scale-105 text-left"
              >
                <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm">👤</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">View Customers</p>
                  <p className="text-sm text-gray-500">Manage customer data</p>
                </div>
              </button>
            </div>
          </div>

          {/* Low Stock Alerts */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-red-50 to-red-100 px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Low Stock Alerts</h3>
            </div>
            <div className="p-6">
              {lowStockProducts.length > 0 ? (
                <div className="space-y-3">
                  {lowStockProducts.slice(0, 5).map((product, index) => (
                    <div 
                      key={product._id}
                      className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200 animate-pulse"
                      style={{ animationDelay: `${index * 200}ms` }}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                          <AlertTriangle className="h-3 w-3 text-white" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{product.name}</p>
                          <p className="text-sm text-red-600">Only {product.units} left</p>
                        </div>
                      </div>
                    </div>
                  ))}
                  {lowStockProducts.length > 5 && (
                    <p className="text-sm text-gray-500 text-center">
                      +{lowStockProducts.length - 5} more items
                    </p>
                  )}
                </div>
              ) : (
                <div className="text-center py-4">
                  <div className="text-2xl mb-2">✅</div>
                  <p className="text-gray-500">All items in stock</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Top Products</h3>
            <span className="text-sm text-gray-500">This Month</span>
          </div>
          <div className="space-y-3">
            {products.slice(0, 3).map((product, index) => (
              <div key={product._id} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-semibold">{index + 1}</span>
                  </div>
                  <span className="font-medium text-gray-900">{product.name}</span>
                </div>
                <span className="text-sm text-gray-500">₹{product.price}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Payment Status</h3>
            <span className="text-sm text-gray-500">Overview</span>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Paid</span>
              <span className="font-semibold text-green-600">
                {bills.filter(b => b.paymentStatus === 'paid').length}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Pending</span>
              <span className="font-semibold text-yellow-600">
                {bills.filter(b => b.paymentStatus === 'pending').length}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Partial</span>
              <span className="font-semibold text-blue-600">
                {bills.filter(b => b.paymentStatus === 'partial').length}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">System Health</h3>
            <span className="text-sm text-green-500">● Online</span>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Database</span>
              <span className="text-green-500">● Connected</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">API Status</span>
              <span className="text-green-500">● Active</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Last Backup</span>
              <span className="text-sm text-gray-500">2 hours ago</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Stat Card Component
const StatCard = ({ title, value, icon, color, darkMode, onClick, trend, trendUp }) => (
  <button
    className={`rounded-lg shadow-lg p-6 w-full text-left transform transition-all duration-300 hover:scale-105 hover:shadow-xl animate-fadeIn focus:outline-none focus:ring-4 focus:ring-opacity-50 ${color} ${darkMode ? 'text-gray-100' : 'text-white'}`}
    style={{ minHeight: 120 }}
    onClick={onClick}
    tabIndex={0}
    aria-label={title}
  >
    <div className="flex items-center">
      <div className="rounded-lg p-3 bg-white bg-opacity-20 mr-4 transition-all duration-300 hover:scale-110 hover:rotate-3">
        {icon}
      </div>
      <div>
        <p className="text-sm font-medium transition-all duration-200">{title}</p>
        <p className="text-2xl font-semibold transition-all duration-200">{value}</p>
        {trend && (
          <p className={`text-xs ${trendUp ? 'text-green-600' : 'text-red-600'}`}>
            {trend}
          </p>
        )}
      </div>
    </div>
  </button>
);

// Product Section Component
const ProductSection = ({ products, setProducts, fetchProducts }) => {
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [formLoading, setFormLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === '' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    let aValue = a[sortBy];
    let bValue = b[sortBy];
    
    if (sortBy === 'price' || sortBy === 'units') {
      aValue = parseFloat(aValue);
      bValue = parseFloat(bValue);
    } else {
      aValue = aValue.toLowerCase();
      bValue = bValue.toLowerCase();
    }
    
    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  const handleCategoryClick = (category) => {
    if (selectedCategory === category) {
      setSelectedCategory(''); // Clear filter if same category clicked
    } else {
      setSelectedCategory(category);
    }
  };

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

  const getCategoryIcon = (category) => {
    const icons = {
      'Spices & Masalas': '🌶️',
      'Rice, Dal & Grains': '🌾',
      'Bakery & Dairy': '🥛',
      'Snacks & Biscuits': '🍪',
      'Packaged Foods': '📦',
      'Edible Oils & Ghee': '🫒',
      'Chocolates': '🍫',
      'Beverages': '🥤',
      'Personal Care': '🧴',
      'Household Items': '🏠',
      'Baby Products': '👶',
      'Hotel Amenities & Supplies': '🏨',
      'Miscellaneous Items': '📋'
    };
    return icons[category] || '📦';
  };

  const lowStockProducts = products.filter(p => p.units < 10);
  const outOfStockProducts = products.filter(p => p.units === 0);

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Enhanced Header */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div className="mb-4 lg:mb-0">
            <h2 className="text-4xl font-bold text-gray-900 mb-2 flex items-center">
              <Package className="h-8 w-8 text-blue-600 mr-3" />
              Product Inventory
            </h2>
            <p className="text-gray-600">Manage your store's product catalog and inventory</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span>In Stock: {products.filter(p => p.units > 10).length}</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span>Low Stock: {lowStockProducts.length}</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span>Out of Stock: {outOfStockProducts.length}</span>
              </div>
            </div>
            <button
              onClick={() => setShowForm(true)}
              className="bg-gradient-to-r from-blue-500 to-blue-700 text-white px-6 py-3 rounded-lg shadow-lg hover:shadow-xl hover:scale-105 transform transition-all duration-300 flex items-center space-x-2 font-semibold text-lg disabled:opacity-50 hover:from-blue-600 hover:to-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 focus:ring-opacity-50"
              disabled={formLoading}
            >
              <Plus className="h-5 w-5 transition-transform duration-200 group-hover:rotate-90" />
              <span>Add Product</span>
            </button>
          </div>
        </div>
      </div>

      {/* Enhanced Search and Filters */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search products by name or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-400"
            />
          </div>

          {/* Sort */}
          <div className="flex space-x-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            >
              <option value="name">Sort by Name</option>
              <option value="category">Sort by Category</option>
              <option value="price">Sort by Price</option>
              <option value="units">Sort by Stock</option>
            </select>
            <button
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all duration-200"
            >
              {sortOrder === 'asc' ? '↑' : '↓'}
            </button>
          </div>

          {/* Quick Stats */}
          <div className="flex items-center justify-end space-x-4 text-sm">
            <span className="text-gray-600">Total: <span className="font-semibold text-blue-600">{products.length}</span></span>
            <span className="text-gray-600">Showing: <span className="font-semibold text-green-600">{filteredProducts.length}</span></span>
          </div>
        </div>
      </div>

      {/* Enhanced Categories Display */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-sm font-semibold text-gray-700 mr-2 animate-fadeIn">Filter by Category:</span>
          {PRODUCT_CATEGORIES.map((category, index) => (
            <button
              key={category}
              onClick={() => handleCategoryClick(category)}
              className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium border transition-all duration-300 hover:scale-105 cursor-pointer animate-fadeIn ${
                selectedCategory === category 
                  ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white border-blue-500 shadow-lg transform scale-105' 
                  : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100 hover:shadow-md hover:border-gray-300'
              }`}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <span className="mr-2">{getCategoryIcon(category)}</span>
              {category}
            </button>
          ))}
          {selectedCategory && (
            <button
              onClick={() => setSelectedCategory('')}
              className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-red-100 text-red-700 border border-red-300 hover:bg-red-200 transition-all duration-300 hover:scale-105 cursor-pointer animate-fadeIn"
            >
              ✕ Clear Filter
            </button>
          )}
        </div>
      </div>

      {/* Enhanced Product Count and Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between bg-white rounded-xl shadow-lg border border-gray-100 p-4">
        <div className="text-sm text-gray-600 mb-2 sm:mb-0">
          {selectedCategory ? (
            <span>
              Showing <span className="font-semibold text-blue-600">{filteredProducts.length}</span> products in 
              <span className="font-semibold text-blue-600 ml-1">"{selectedCategory}"</span>
            </span>
          ) : (
            <span>
              Showing <span className="font-semibold text-blue-600">{filteredProducts.length}</span> of <span className="font-semibold text-gray-700">{products.length}</span> products
            </span>
          )}
        </div>
        <div className="flex space-x-2">
          {selectedCategory && (
            <button
              onClick={() => setSelectedCategory('')}
              className="text-sm text-blue-600 hover:text-blue-800 underline transition-colors duration-200"
            >
              View All Products
            </button>
          )}
          <button
            onClick={() => setShowForm(true)}
            className="text-sm text-green-600 hover:text-green-800 underline transition-colors duration-200"
          >
            + Add New Product
          </button>
        </div>
      </div>

      {/* Enhanced Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {sortedProducts.map((product, index) => (
          <ProductCard
            key={product._id}
            product={product}
            onEdit={(product) => {
              setEditingProduct(product);
              setShowForm(true);
            }}
            onDelete={() => handleDelete(product._id)}
            index={index}
          />
        ))}
      </div>

      {/* Empty State */}
      {sortedProducts.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl shadow-lg border border-gray-100">
          <div className="text-6xl mb-4">📦</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
          <p className="text-gray-600 mb-6">
            {searchTerm || selectedCategory 
              ? 'Try adjusting your search or filter criteria'
              : 'Get started by adding your first product'
            }
          </p>
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            Add Your First Product
          </button>
        </div>
      )}

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
              setToast({ message: editingProduct ? 'Product updated successfully!' : 'Product added successfully!', type: 'success' });
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
const ProductCard = ({ product, onEdit, onDelete, index }) => {
  const getStockStatus = (units) => {
    if (units === 0) return { status: 'Out of Stock', color: 'bg-red-500', textColor: 'text-red-600', bgColor: 'bg-red-50' };
    if (units < 10) return { status: 'Low Stock', color: 'bg-yellow-500', textColor: 'text-yellow-600', bgColor: 'bg-yellow-50' };
    return { status: 'In Stock', color: 'bg-green-500', textColor: 'text-green-600', bgColor: 'bg-green-50' };
  };

  const stockInfo = getStockStatus(product.units);

  return (
    <div 
      className="bg-white rounded-xl shadow-lg p-6 hover:shadow-2xl transition-all duration-300 hover:scale-105 hover:-translate-y-2 border border-gray-100 hover:border-blue-300 group relative overflow-hidden animate-fadeIn"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      {/* Stock Status Badge */}
      <div className="absolute top-4 right-4 flex items-center space-x-2">
        <div className={`w-2 h-2 rounded-full ${stockInfo.color}`}></div>
        <span className={`text-xs font-medium ${stockInfo.textColor}`}>
          {stockInfo.status}
        </span>
      </div>

      {/* Product Header */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-200 mb-1">
            {product.name}
          </h3>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500 group-hover:text-gray-700 transition-colors duration-200">
              {product.category}
            </span>
            <span className="text-xs text-gray-400">•</span>
            <span className="text-xs text-gray-400">
              {product.weight} {product.weightUnit || 'kg'}
            </span>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
          <button
            onClick={() => onEdit(product)}
            className="p-2 text-blue-600 hover:text-blue-700 rounded-full hover:bg-blue-50 transition-all duration-200 hover:scale-110 shadow-sm"
            title="Edit Product"
          >
            <Edit className="h-4 w-4" />
          </button>
          <button
            onClick={onDelete}
            className="p-2 text-red-600 hover:text-red-700 rounded-full hover:bg-red-50 transition-all duration-200 hover:scale-110 shadow-sm"
            title="Delete Product"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
      
      {/* Product Details */}
      <div className="space-y-3">
        {/* Price */}
        <div className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-green-50 to-emerald-50 border border-green-100 group-hover:border-green-200 transition-all duration-200">
          <span className="text-sm font-medium text-gray-700">Price</span>
          <span className="text-xl font-bold text-green-600 group-hover:text-green-700 transition-colors duration-200">
            ₹{product.price}
          </span>
        </div>

        {/* Stock Level */}
        <div className={`flex items-center justify-between p-3 rounded-lg ${stockInfo.bgColor} border transition-all duration-200 ${
          product.units === 0 ? 'border-red-200' : 
          product.units < 10 ? 'border-yellow-200' : 'border-green-200'
        }`}>
          <span className="text-sm font-medium text-gray-700">Stock Level</span>
          <div className="flex items-center space-x-2">
            <span className={`font-bold text-lg ${stockInfo.textColor}`}>
              {product.units}
            </span>
            {product.units < 10 && product.units > 0 && (
              <span className="text-xs text-yellow-600 animate-pulse">⚠️</span>
            )}
            {product.units === 0 && (
              <span className="text-xs text-red-600">🚫</span>
            )}
          </div>
        </div>

        {/* Stock Progress Bar */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs text-gray-500">
            <span>Stock Level</span>
            <span>{Math.round((product.units / Math.max(product.units, 1)) * 100)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all duration-500 ${
                product.units === 0 ? 'bg-red-500' :
                product.units < 10 ? 'bg-yellow-500' : 'bg-green-500'
              }`}
              style={{ width: `${Math.min((product.units / Math.max(product.units, 1)) * 100, 100)}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-4 pt-4 border-t border-gray-100 opacity-0 group-hover:opacity-100 transition-all duration-300">
        <div className="flex space-x-2">
          <button
            onClick={() => onEdit(product)}
            className="flex-1 bg-blue-50 text-blue-600 py-2 px-3 rounded-lg text-sm font-medium hover:bg-blue-100 transition-all duration-200 hover:scale-105"
          >
            Edit
          </button>
          <button
            onClick={onDelete}
            className="flex-1 bg-red-50 text-red-600 py-2 px-3 rounded-lg text-sm font-medium hover:bg-red-100 transition-all duration-200 hover:scale-105"
          >
            Delete
          </button>
        </div>
      </div>

      {/* Hover Effect Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
    </div>
  );
};

// Product Form Component
const ProductForm = ({ product, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: product?.name || '',
    units: product?.units || '',
    weight: product?.weight || '',
    weightUnit: product?.weightUnit || 'kg',
    price: product?.price || '',
    category: product?.category || '',
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

  const getCategoryIcon = (category) => {
    const icons = {
      'Spices & Masalas': '🌶️',
      'Rice, Dal & Grains': '🌾',
      'Bakery & Dairy': '🥛',
      'Snacks & Biscuits': '🍪',
      'Packaged Foods': '📦',
      'Edible Oils & Ghee': '🫒',
      'Chocolates': '🍫',
      'Beverages': '🥤',
      'Personal Care': '🧴',
      'Household Items': '🏠',
      'Baby Products': '👶',
      'Hotel Amenities & Supplies': '🏨',
      'Miscellaneous Items': '📋'
    };
    return icons[category] || '📦';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 sm:p-4 z-50 animate-fadeIn">
      <div className="bg-white rounded-xl max-w-lg sm:max-w-md w-full shadow-2xl animate-scaleIn">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 rounded-t-xl border-b border-gray-200">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <Package className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">
                  {product ? 'Edit Product' : 'Add New Product'}
                </h3>
                <p className="text-sm text-gray-600">
                  {product ? 'Update product information' : 'Create a new product entry'}
                </p>
              </div>
            </div>
            <button 
              onClick={onClose} 
              className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-2 rounded-full transition-all duration-200 hover:scale-110"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Form Content */}
        <div className="p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm animate-shake">
              ⚠️ {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Product Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Product Name *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-400 text-sm sm:text-base"
                placeholder="Enter product name..."
              />
            </div>
            
            {/* Category Selection */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Category *
              </label>
              <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto border border-gray-300 rounded-lg p-2">
                {PRODUCT_CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setFormData({ ...formData, category: cat })}
                    className={`flex items-center space-x-2 p-3 rounded-lg text-left transition-all duration-200 hover:scale-105 ${
                      formData.category === cat 
                        ? 'bg-blue-100 border-2 border-blue-300 text-blue-700' 
                        : 'bg-gray-50 border border-gray-200 text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <span className="text-lg">{getCategoryIcon(cat)}</span>
                    <span className="text-sm font-medium">{cat}</span>
                  </button>
                ))}
              </div>
            </div>
            
            {/* Stock and Weight */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Stock Units *
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  value={formData.units}
                  onChange={(e) => setFormData({ ...formData, units: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-400 text-sm sm:text-base"
                  placeholder="0"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Weight *
                </label>
                <div className="flex">
                  <input
                    type="number"
                    required
                    min="0"
                    step="0.01"
                    value={formData.weight}
                    onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-400 text-sm sm:text-base"
                    placeholder="0.00"
                  />
                  <select
                    value={formData.weightUnit}
                    onChange={(e) => setFormData({ ...formData, weightUnit: e.target.value })}
                    className="px-4 py-3 border border-gray-300 rounded-r-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-400 text-sm sm:text-base bg-white"
                  >
                    <option value="kg">kg</option>
                    <option value="gram">gram</option>
                  </select>
                </div>
              </div>
            </div>
            
            {/* Price */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Price (₹) *
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₹</span>
                <input
                  type="number"
                  required
                  min="0"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-400 text-sm sm:text-base"
                  placeholder="0.00"
                />
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-all duration-200 hover:scale-105 font-medium"
                disabled={submitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-lg hover:from-blue-600 hover:to-blue-800 disabled:opacity-50 transition-all duration-200 hover:scale-105 font-medium shadow-lg hover:shadow-xl"
                disabled={submitting}
              >
                {submitting ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Saving...</span>
                  </div>
                ) : (
                  <span>{product ? 'Update Product' : 'Create Product'}</span>
                )}
              </button>
            </div>
          </form>
        </div>
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
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');

  const filteredBills = bills.filter(bill => {
    const matchesSearch = bill.billNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         bill.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         bill.customerPhone?.includes(searchTerm);
    const matchesStatus = statusFilter === 'all' || bill.paymentStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Sort bills
  const sortedBills = [...filteredBills].sort((a, b) => {
    let aValue, bValue;
    
    switch (sortBy) {
      case 'amount':
        aValue = a.totalAmount;
        bValue = b.totalAmount;
        break;
      case 'customer':
        aValue = a.customerName.toLowerCase();
        bValue = b.customerName.toLowerCase();
        break;
      case 'status':
        aValue = a.paymentStatus;
        bValue = b.paymentStatus;
        break;
      default: // date
        aValue = new Date(a.createdAt);
        bValue = new Date(b.createdAt);
    }
    
    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

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

  const getStatusColor = (status) => {
    switch (status) {
      case 'paid': return { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-200' };
      case 'partial': return { bg: 'bg-yellow-100', text: 'text-yellow-800', border: 'border-yellow-200' };
      default: return { bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-200' };
    }
  };

  const totalRevenue = bills.reduce((sum, bill) => sum + bill.totalAmount, 0);
  const paidAmount = bills.filter(b => b.paymentStatus === 'paid').reduce((sum, bill) => sum + bill.totalAmount, 0);
  const pendingAmount = bills.filter(b => b.paymentStatus !== 'paid').reduce((sum, bill) => sum + bill.totalAmount, 0);

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Enhanced Header */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border border-green-100">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div className="mb-4 lg:mb-0">
            <h2 className="text-4xl font-bold text-gray-900 mb-2 flex items-center">
              <Receipt className="h-8 w-8 text-green-600 mr-3" />
              Billing Management
            </h2>
            <p className="text-gray-600">Create and manage customer invoices and payments</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span>Paid: ₹{paidAmount.toLocaleString()}</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span>Pending: ₹{pendingAmount.toLocaleString()}</span>
              </div>
            </div>
            <button
              onClick={() => setShowForm(true)}
              className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 flex items-center space-x-2 font-semibold text-lg hover:from-green-600 hover:to-green-700 focus:outline-none focus:ring-4 focus:ring-green-300 focus:ring-opacity-50"
            >
              <Plus className="h-5 w-5 transition-transform duration-200 group-hover:rotate-90" />
              <span>Create Bill</span>
            </button>
          </div>
        </div>
      </div>

      {/* Enhanced Search and Filters */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search bills, customers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 hover:border-gray-400"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
          >
            <option value="all">All Status</option>
            <option value="paid">Paid</option>
            <option value="pending">Pending</option>
            <option value="partial">Partial</option>
          </select>

          {/* Sort */}
          <div className="flex space-x-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
            >
              <option value="date">Sort by Date</option>
              <option value="amount">Sort by Amount</option>
              <option value="customer">Sort by Customer</option>
              <option value="status">Sort by Status</option>
            </select>
            <button
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all duration-200"
            >
              {sortOrder === 'asc' ? '↑' : '↓'}
            </button>
          </div>

          {/* Quick Stats */}
          <div className="flex items-center justify-end space-x-4 text-sm">
            <span className="text-gray-600">Total: <span className="font-semibold text-green-600">{bills.length}</span></span>
            <span className="text-gray-600">Showing: <span className="font-semibold text-blue-600">{filteredBills.length}</span></span>
          </div>
        </div>
      </div>

      {/* Enhanced Bills Table */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Bill Details
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Customer Info
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedBills.map((bill, index) => {
                const statusColors = getStatusColor(bill.paymentStatus);
                return (
                  <tr key={bill._id} className="hover:bg-gray-50 transition-all duration-200 hover:shadow-sm animate-fadeIn group" style={{ animationDelay: `${index * 50}ms` }}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-3">
                          <Receipt className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                          <div className="text-sm font-bold text-gray-900 group-hover:text-green-600 transition-colors duration-200">
                            {bill.billNumber}
                          </div>
                          <div className="text-xs text-gray-500">
                            {bill.items?.length || 0} items
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-200">
                          {bill.customerName}
                        </div>
                        <div className="text-sm text-gray-500 group-hover:text-gray-700 transition-colors duration-200">
                          📱 {bill.customerPhone || 'No phone'}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-lg font-bold text-green-600 group-hover:text-green-700 transition-colors duration-200">
                        ₹{bill.totalAmount.toLocaleString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full border transition-all duration-200 hover:scale-105 ${statusColors.bg} ${statusColors.text} ${statusColors.border}`}>
                        {bill.paymentStatus.charAt(0).toUpperCase() + bill.paymentStatus.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 group-hover:text-gray-700 transition-colors duration-200">
                      <div>
                        <div className="font-medium">
                          {new Date(bill.createdAt).toLocaleDateString()}
                        </div>
                        <div className="text-xs text-gray-500">
                          {new Date(bill.createdAt).toLocaleTimeString()}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => setViewingBill(bill)}
                          className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-blue-500 hover:bg-blue-600 hover:scale-110 transition-all duration-200 shadow-md text-white relative group"
                          title="View Bill Details"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        {bill.customerPhone && (
                          <a
                            href={`https://wa.me/91${bill.customerPhone.replace(/\D/g, '')}?text=${encodeURIComponent(
                              `Hello ${bill.customerName},\nHere are your bill details:\nBill No: ${bill.billNumber}\nAmount: ₹${bill.totalAmount}\nStatus: ${bill.paymentStatus}\nThank you for shopping with us!`
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-green-500 hover:bg-green-600 hover:scale-110 transition-all duration-200 shadow-md text-white"
                            title="Send bill via WhatsApp"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="w-5 h-5">
                              <path d="M20.52 3.48A11.94 11.94 0 0012 0C5.37 0 0 5.37 0 12c0 2.12.55 4.13 1.6 5.92L0 24l6.18-1.62A11.94 11.94 0 0012 24c6.63 0 12-5.37 12-12 0-3.19-1.24-6.19-3.48-8.52zM12 22c-1.85 0-3.63-.5-5.18-1.44l-.37-.22-3.67.96.98-3.58-.24-.37A9.94 9.94 0 012 12c0-5.52 4.48-10 10-10s10 4.48 10 10-4.48 10-10 10zm5.07-7.75c-.28-.14-1.65-.81-1.9-.9-.25-.09-.43-.14-.61.14-.18.28-.7.9-.86 1.08-.16.18-.32.2-.6.07-.28-.14-1.18-.44-2.25-1.4-.83-.74-1.39-1.65-1.55-1.93-.16-.28-.02-.43.12-.57.13-.13.28-.34.42-.51.14-.17.18-.29.28-.48.09-.19.05-.36-.02-.5-.07-.14-.61-1.47-.84-2.01-.22-.53-.45-.46-.62-.47-.16-.01-.36-.01-.56-.01-.19 0-.5.07-.76.34-.26.27-1 1-.97 2.43.03 1.43 1.03 2.81 1.18 3 .15.19 2.03 3.1 4.93 4.23.69.3 1.23.48 1.65.61.69.22 1.32.19 1.81.12.55-.08 1.65-.67 1.88-1.32.23-.65.23-1.2.16-1.32-.07-.12-.25-.19-.53-.33z" />
                            </svg>
                          </a>
                        )}
                        <button
                          onClick={() => {
                            setEditingBill(bill);
                            setShowForm(true);
                          }}
                          className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-yellow-500 hover:bg-yellow-600 hover:scale-110 transition-all duration-200 shadow-md text-white"
                          title="Edit Bill"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(bill._id)}
                          className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-red-500 hover:bg-red-600 hover:scale-110 transition-all duration-200 shadow-md text-white"
                          title="Delete Bill"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {sortedBills.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📄</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No bills found</h3>
            <p className="text-gray-600 mb-6">
              {searchTerm || statusFilter !== 'all' 
                ? 'Try adjusting your search or filter criteria'
                : 'Get started by creating your first bill'
              }
            </p>
            <button
              onClick={() => setShowForm(true)}
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors duration-200"
            >
              Create Your First Bill
            </button>
          </div>
        )}
      </div>

      {/* Bill Form Modal */}
      {showForm && (
        <BillForm
          bill={editingBill}
          products={products}
          bills={bills}
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
const BillForm = ({ bill, products, bills, onClose, onSave }) => {
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

  const [isNewCustomer, setIsNewCustomer] = useState(false);

  // Get unique customers from existing bills
  const existingCustomers = React.useMemo(() => {
    const customers = new Map();
    bills.forEach(bill => {
      if (bill.customerName && bill.customerPhone) {
        const key = `${bill.customerName}-${bill.customerPhone}`;
        if (!customers.has(key)) {
          customers.set(key, {
            name: bill.customerName,
            phone: bill.customerPhone
          });
        }
      }
    });
    return Array.from(customers.values()).sort((a, b) => a.name.localeCompare(b.name));
  }, [bills]);

  const handleCustomerSelect = (customerKey) => {
    if (customerKey === 'new') {
      setFormData({ ...formData, customerName: '', customerPhone: '' });
      setIsNewCustomer(true);
    } else {
      const [name, phone] = customerKey.split(' - ');
      setFormData({ ...formData, customerName: name, customerPhone: phone });
      setIsNewCustomer(false);
    }
  };

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
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-md font-medium text-blue-900">Customer Information</h4>
              <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
                {existingCustomers.length} existing customers
              </span>
            </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
                <label className="block text-sm font-medium text-blue-700 mb-1">
                  Select Customer
              </label>
                <select
                  value={formData.customerName && formData.customerPhone ? `${formData.customerName} - ${formData.customerPhone}` : ''}
                  onChange={(e) => {
                    const selectedValue = e.target.value;
                    if (selectedValue === 'new') {
                      setFormData({ ...formData, customerName: '', customerPhone: '' });
                      setIsNewCustomer(true);
                    } else if (selectedValue) {
                      const [name, phone] = selectedValue.split(' - ');
                      setFormData({ ...formData, customerName: name, customerPhone: phone });
                      setIsNewCustomer(false);
                    } else {
                      setFormData({ ...formData, customerName: '', customerPhone: '' });
                      setIsNewCustomer(false);
                    }
                  }}
                  className="w-full px-3 py-2 border border-blue-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base bg-white"
                >
                  <option value="">👤 Select existing customer...</option>
                  {existingCustomers.map((customer) => (
                    <option key={`${customer.name}-${customer.phone}`} value={`${customer.name} - ${customer.phone}`}>
                      📱 {customer.name} - {customer.phone}
                    </option>
                  ))}
                  <option value="new">➕ Add New Customer</option>
                </select>
            </div>
            
            <div>
                <label className="block text-sm font-medium text-blue-700 mb-1">
                  Phone Number
              </label>
              <input
                type="tel"
                value={formData.customerPhone}
                onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                  className="w-full px-3 py-2 border border-blue-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base bg-white"
                  placeholder="📱 Enter phone number"
              />
            </div>
            </div>

            {/* Manual Customer Name Input (shown when "Add New Customer" is selected) */}
            {isNewCustomer && (
              <div className="mt-3">
                <label className="block text-sm font-medium text-blue-700 mb-1">
                  New Customer Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.customerName}
                  onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                  className="w-full px-3 py-2 border border-blue-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base bg-white"
                  placeholder="👤 Enter customer name"
                />
              </div>
            )}

            {/* Selected Customer Display */}
            {formData.customerName && formData.customerPhone && (
              <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-md">
                <div className="flex items-center space-x-2">
                  <span className="text-green-600">✅</span>
                  <span className="text-sm font-medium text-green-800">
                    Selected: {formData.customerName} ({formData.customerPhone})
                  </span>
                </div>
              </div>
            )}
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
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Product
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Quantity
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Unit Price
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
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

// Customers Section Component
const CustomersSection = ({ bills, fetchBills }) => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');

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

  // Sort customers
  customerList.sort((a, b) => {
    let aValue, bValue;
    
    switch (sortBy) {
      case 'totalPaid':
        aValue = a.bills.filter(b => b.paymentStatus === 'paid').reduce((s, b) => s + b.totalAmount, 0);
        bValue = b.bills.filter(b => b.paymentStatus === 'paid').reduce((s, b) => s + b.totalAmount, 0);
        break;
      case 'totalPending':
        aValue = a.bills.filter(b => b.paymentStatus !== 'paid').reduce((s, b) => s + b.totalAmount, 0);
        bValue = b.bills.filter(b => b.paymentStatus !== 'paid').reduce((s, b) => s + b.totalAmount, 0);
        break;
      case 'billCount':
        aValue = a.bills.length;
        bValue = b.bills.length;
        break;
      default: // name
        aValue = a.name.toLowerCase();
        bValue = b.name.toLowerCase();
    }
    
    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  // Summary
  const totalPaid = customerList.reduce((sum, c) => sum + c.bills.filter(b => b.paymentStatus === 'paid').reduce((s, b) => s + b.totalAmount, 0), 0);
  const totalPending = customerList.reduce((sum, c) => sum + c.bills.filter(b => b.paymentStatus !== 'paid').reduce((s, b) => s + b.totalAmount, 0), 0);

  // Update payment status
  const updatePaymentStatus = async (billId, newStatus) => {
    setUpdatingStatus(true);
    try {
      const response = await fetch(`${API_BASE_URL}/bills/${billId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ paymentStatus: newStatus }),
      });
      
      if (response.ok) {
        await fetchBills(); // Refresh bills data
      } else {
        console.error('Failed to update payment status');
      }
    } catch (error) {
      console.error('Error updating payment status:', error);
    } finally {
      setUpdatingStatus(false);
    }
  };

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
    <div className="space-y-8 animate-fadeIn">
      {/* Enhanced Header */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-100">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div className="mb-4 lg:mb-0">
            <h2 className="text-4xl font-bold text-gray-900 mb-2 flex items-center">
              <span className="text-3xl mr-3">👥</span>
              Customer Management
            </h2>
            <p className="text-gray-600">Manage customer relationships and payment tracking</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span>Paid: ₹{totalPaid.toLocaleString()}</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span>Pending: ₹{totalPending.toLocaleString()}</span>
              </div>
            </div>
            <button
              onClick={exportCSV}
              className="bg-gradient-to-r from-purple-500 to-purple-600 text-white px-6 py-3 rounded-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 flex items-center space-x-2 font-semibold text-lg hover:from-purple-600 hover:to-purple-700 focus:outline-none focus:ring-4 focus:ring-purple-300 focus:ring-opacity-50"
            >
              <span>📊</span>
              <span>Export CSV</span>
            </button>
          </div>
        </div>
      </div>

      {/* Enhanced Search and Filters */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search by name or phone..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-10 pr-4 py-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 hover:border-gray-400"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
          >
            <option value="all">All Status</option>
            <option value="paid">Paid</option>
            <option value="pending">Pending</option>
            <option value="partial">Partial</option>
          </select>

          {/* Sort */}
          <div className="flex space-x-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
            >
              <option value="name">Sort by Name</option>
              <option value="totalPaid">Sort by Total Paid</option>
              <option value="totalPending">Sort by Total Pending</option>
              <option value="billCount">Sort by Bill Count</option>
            </select>
            <button
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all duration-200"
            >
              {sortOrder === 'asc' ? '↑' : '↓'}
            </button>
          </div>

          {/* Quick Stats */}
          <div className="flex items-center justify-end space-x-4 text-sm">
            <span className="text-gray-600">Total: <span className="font-semibold text-purple-600">{Object.keys(customers).length}</span></span>
            <span className="text-gray-600">Showing: <span className="font-semibold text-blue-600">{customerList.length}</span></span>
          </div>
        </div>
      </div>

      {/* Enhanced Customer Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {customerList.length === 0 && (
          <div className="col-span-full text-center py-12 bg-white rounded-xl shadow-lg border border-gray-100">
            <div className="text-6xl mb-4">👥</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No customers found</h3>
            <p className="text-gray-600 mb-6">
              {search || statusFilter !== 'all' 
                ? 'Try adjusting your search or filter criteria'
                : 'Customers will appear here once bills are created'
              }
            </p>
          </div>
        )}
        
        {customerList.map((customer, idx) => {
          const totalPaid = customer.bills.filter(b => b.paymentStatus === 'paid').reduce((s, b) => s + b.totalAmount, 0);
          const totalPending = customer.bills.filter(b => b.paymentStatus !== 'paid').reduce((s, b) => s + b.totalAmount, 0);
          const paidBills = customer.bills.filter(b => b.paymentStatus === 'paid').length;
          const pendingBills = customer.bills.filter(b => b.paymentStatus !== 'paid').length;
          
          return (
            <div
              key={idx}
              className="bg-white rounded-xl shadow-lg p-6 cursor-pointer hover:scale-105 hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-purple-300 group animate-fadeIn relative overflow-hidden"
              style={{ animationDelay: `${idx * 100}ms` }}
              onClick={() => { setSelectedCustomer(customer); setShowModal(true); }}
            >
              {/* Customer Avatar */}
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-lg mr-3">
                  {customer.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-bold text-lg text-gray-900 group-hover:text-purple-600 transition-colors duration-200">
                    {customer.name}
                  </h3>
                  {customer.phone && (
                    <p className="text-sm text-gray-500 group-hover:text-gray-700 transition-colors duration-200">
                      📱 {customer.phone}
                    </p>
                  )}
                </div>
              </div>

              {/* Payment Summary */}
              <div className="space-y-3 mb-4">
                <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg border border-green-200 group-hover:border-green-300 transition-all duration-200">
                  <span className="text-sm font-medium text-gray-700">Total Paid</span>
                  <div className="text-right">
                    <div className="text-lg font-bold text-green-600 group-hover:text-green-700 transition-colors duration-200">
                      ₹{totalPaid.toLocaleString()}
                    </div>
                    <div className="text-xs text-green-600">{paidBills} bills</div>
                  </div>
                </div>
                
                <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg border border-red-200 group-hover:border-red-300 transition-all duration-200">
                  <span className="text-sm font-medium text-gray-700">Total Pending</span>
                  <div className="text-right">
                    <div className="text-lg font-bold text-red-600 group-hover:text-red-700 transition-colors duration-200">
                      ₹{totalPending.toLocaleString()}
                    </div>
                    <div className="text-xs text-red-600">{pendingBills} bills</div>
                  </div>
                </div>
              </div>

              {/* Recent Bills */}
              <div className="space-y-2">
                <h4 className="font-semibold text-sm text-gray-700 mb-2 group-hover:text-gray-800 transition-colors duration-200">
                  Recent Bills ({customer.bills.length})
                </h4>
                <div className="space-y-1 max-h-24 overflow-y-auto">
                  {customer.bills.slice(0, 3).map((bill, billIndex) => (
                    <div key={bill._id} className="flex justify-between items-center text-xs p-2 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                      <span className="font-medium text-gray-900 hover:text-blue-600 transition-colors duration-200 truncate">
                        {bill.billNumber}
                      </span>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium transition-all duration-200 hover:scale-105 ${
                          bill.paymentStatus === 'paid' ? 'bg-green-100 text-green-700 hover:bg-green-200' :
                          bill.paymentStatus === 'partial' ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200' :
                          'bg-red-100 text-red-700 hover:bg-red-200'
                        }`}>
                          {bill.paymentStatus}
                        </span>
                        <span className="font-semibold text-green-600 hover:text-green-700 transition-colors duration-200">
                          ₹{bill.totalAmount}
                        </span>
                      </div>
                    </div>
                  ))}
                  {customer.bills.length > 3 && (
                    <div className="text-xs text-gray-500 text-center py-1">
                      +{customer.bills.length - 3} more bills
                    </div>
                  )}
                </div>
              </div>

              {/* Hover Effect Overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
            </div>
          );
        })}
      </div>

      {/* Enhanced Customer Details Modal */}
      {showModal && selectedCustomer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fadeIn p-4">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative">
            {/* Header */}
            <div className="sticky top-0 bg-gradient-to-r from-purple-50 to-pink-50 border-b border-gray-200 px-6 py-4 rounded-t-xl">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                    {selectedCustomer.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{selectedCustomer.name}</h3>
                    {selectedCustomer.phone && (
                      <p className="text-gray-600">📱 {selectedCustomer.phone}</p>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-2 rounded-full transition-all duration-200 hover:scale-110"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>

            {/* Customer Summary */}
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-green-50 rounded-xl p-4 border border-green-200">
                  <h4 className="text-sm font-medium text-green-700 mb-1">Total Paid</h4>
                  <p className="text-2xl font-bold text-green-900">
                    ₹{selectedCustomer.bills.filter(b => b.paymentStatus === 'paid').reduce((s, b) => s + b.totalAmount, 0).toLocaleString()}
                  </p>
                  <p className="text-xs text-green-600 mt-1">
                    {selectedCustomer.bills.filter(b => b.paymentStatus === 'paid').length} bills
                  </p>
                </div>
                <div className="bg-red-50 rounded-xl p-4 border border-red-200">
                  <h4 className="text-sm font-medium text-red-700 mb-1">Total Pending</h4>
                  <p className="text-2xl font-bold text-red-900">
                    ₹{selectedCustomer.bills.filter(b => b.paymentStatus !== 'paid').reduce((s, b) => s + b.totalAmount, 0).toLocaleString()}
                  </p>
                  <p className="text-xs text-red-600 mt-1">
                    {selectedCustomer.bills.filter(b => b.paymentStatus !== 'paid').length} bills
                  </p>
                </div>
                <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                  <h4 className="text-sm font-medium text-blue-700 mb-1">Total Bills</h4>
                  <p className="text-2xl font-bold text-blue-900">
                    {selectedCustomer.bills.length}
                  </p>
                  <p className="text-xs text-blue-600 mt-1">All time</p>
                </div>
              </div>

              {/* Bills List */}
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Bill History</h4>
                <div className="space-y-3">
                  {selectedCustomer.bills.map((bill, index) => (
                    <div key={bill._id} className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-all duration-200 border border-gray-200 hover:border-gray-300">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h5 className="font-semibold text-gray-900 hover:text-blue-600 transition-colors duration-200">
                            {bill.billNumber}
                          </h5>
                          <p className="text-sm text-gray-500">
                            {new Date(bill.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold border transition-all duration-200 hover:scale-105 ${
                            bill.paymentStatus === 'paid' ? 'bg-green-100 text-green-700 border-green-200 hover:bg-green-200' :
                            bill.paymentStatus === 'partial' ? 'bg-yellow-100 text-yellow-700 border-yellow-200 hover:bg-yellow-200' :
                            'bg-red-100 text-red-700 border-red-200 hover:bg-red-200'
                          }`}>
                            {bill.paymentStatus.charAt(0).toUpperCase() + bill.paymentStatus.slice(1)}
                          </span>
                          <span className="text-lg font-bold text-green-600">
                            ₹{bill.totalAmount.toLocaleString()}
                          </span>
                        </div>
                      </div>
                      
                      {/* Payment Status Update */}
                      <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-200">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-gray-600">Update Status:</span>
                          <select
                            value={bill.paymentStatus}
                            onChange={(e) => updatePaymentStatus(bill._id, e.target.value)}
                            className="px-2 py-1 text-xs border border-gray-300 rounded focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            disabled={updatingStatus}
                          >
                            <option value="pending">Pending</option>
                            <option value="partial">Partial</option>
                            <option value="paid">Paid</option>
                          </select>
                          {updatingStatus && (
                            <div className="w-4 h-4 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                          )}
                        </div>
                        
                        {/* Action Buttons */}
                        <div className="flex space-x-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              window.dispatchEvent(new CustomEvent('viewBill', { detail: bill }));
                            }}
                            className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-500 hover:bg-blue-600 hover:scale-110 transition-all duration-200 shadow-md text-white"
                            title="View Bill Details"
                          >
                            <Eye className="h-3 w-3" />
                          </button>
                          {selectedCustomer.phone && (
                            <a
                              href={`https://wa.me/91${selectedCustomer.phone.replace(/\D/g, '')}?text=${encodeURIComponent(buildWhatsAppMessage(selectedCustomer, bill))}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-green-500 hover:bg-green-600 hover:scale-110 transition-all duration-200 shadow-md text-white"
                              title="Send via WhatsApp"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="w-4 h-4">
                                <path d="M20.52 3.48A11.94 11.94 0 0012 0C5.37 0 0 5.37 0 12c0 2.12.55 4.13 1.6 5.92L0 24l6.18-1.62A11.94 11.94 0 0012 24c6.63 0 12-5.37 12-12 0-3.19-1.24-6.19-3.48-8.52zM12 22c-1.85 0-3.63-.5-5.18-1.44l-.37-.22-3.67.96.98-3.58-.24-.37A9.94 9.94 0 012 12c0-5.52 4.48-10 10-10s10 4.48 10 10-4.48 10-10 10zm5.07-7.75c-.28-.14-1.65-.81-1.9-.9-.25-.09-.43-.14-.61.14-.18.28-.7.9-.86 1.08-.16.18-.32.2-.6.07-.28-.14-1.18-.44-2.25-1.4-.83-.74-1.39-1.65-1.55-1.93-.16-.28-.02-.43.12-.57.13-.13.28-.34.42-.51.14-.17.18-.29.28-.48.09-.19.05-.36-.02-.5-.07-.14-.61-1.47-.84-2.01-.22-.53-.45-.46-.62-.47-.16-.01-.36-.01-.56-.01-.19 0-.5.07-.76.34-.26.27-1 1-.97 2.43.03 1.43 1.03 2.81 1.18 3 .15.19 2.03 3.1 4.93 4.23.69.3 1.23.48 1.65.61.69.22 1.32.19 1.81.12.55-.08 1.65-.67 1.88-1.32.23-.65.23-1.2.16-1.32-.07-.12-.25-.19-.53-.33z" />
                              </svg>
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;