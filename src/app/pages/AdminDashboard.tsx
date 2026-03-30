import { Header } from '../components/Header';
import {
  Users,
  Activity,
  TrendingUp,
  MapPin,
  Bell,
  Download,
  Filter,
} from 'lucide-react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

export function AdminDashboard() {
  const stats = [
    {
      icon: <Users className="w-6 h-6" />,
      title: 'Total Farmers',
      value: '52,341',
      change: '+12.5%',
      trend: 'up',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      icon: <Activity className="w-6 h-6" />,
      title: 'Active Today',
      value: '8,429',
      change: '+8.2%',
      trend: 'up',
      color: 'from-green-500 to-emerald-500',
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: 'Predictions',
      value: '2.1M',
      change: '+15.3%',
      trend: 'up',
      color: 'from-purple-500 to-pink-500',
    },
    {
      icon: <MapPin className="w-6 h-6" />,
      title: 'Villages',
      value: '5,234',
      change: '+23',
      trend: 'up',
      color: 'from-orange-500 to-red-500',
    },
  ];

  const usageData = [
    { month: 'Jan', users: 4000, predictions: 2400 },
    { month: 'Feb', users: 3000, predictions: 1398 },
    { month: 'Mar', users: 2000, predictions: 9800 },
    { month: 'Apr', users: 2780, predictions: 3908 },
    { month: 'May', users: 1890, predictions: 4800 },
    { month: 'Jun', users: 2390, predictions: 3800 },
  ];

  const cropData = [
    { name: 'Wheat', value: 35 },
    { name: 'Rice', value: 28 },
    { name: 'Cotton', value: 18 },
    { name: 'Sugarcane', value: 12 },
    { name: 'Others', value: 7 },
  ];

  const diseaseData = [
    { disease: 'Leaf Blight', cases: 450 },
    { disease: 'Rust', cases: 320 },
    { disease: 'Powdery Mildew', cases: 280 },
    { disease: 'Wilt', cases: 190 },
    { disease: 'Root Rot', cases: 150 },
  ];

  const stateData = [
    { state: 'Punjab', farmers: 12500 },
    { state: 'Haryana', farmers: 9800 },
    { state: 'UP', farmers: 15200 },
    { state: 'MP', farmers: 8900 },
    { state: 'Rajasthan', farmers: 6500 },
  ];

  const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ec4899', '#6366f1'];

  const recentUsers = [
    { name: 'Rajesh Kumar', location: 'Punjab', joined: '2 mins ago', status: 'online' },
    { name: 'Suresh Patel', location: 'Gujarat', joined: '15 mins ago', status: 'online' },
    { name: 'Mahesh Singh', location: 'UP', joined: '1 hour ago', status: 'offline' },
    { name: 'Ramesh Yadav', location: 'Haryana', joined: '2 hours ago', status: 'offline' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Admin Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Real-time analytics and platform insights
            </p>
          </div>
          <div className="flex gap-3 mt-4 md:mt-0">
            <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
              <Filter className="w-4 h-4" />
              Filter
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:from-green-600 hover:to-emerald-700">
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => (
            <div
              key={stat.title}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700"
            >
              <div className="flex items-center justify-between mb-4">
                <div
                  className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-xl flex items-center justify-center text-white`}
                >
                  {stat.icon}
                </div>
                <span
                  className={`text-sm font-medium ${
                    stat.trend === 'up'
                      ? 'text-green-600 dark:text-green-400'
                      : 'text-red-600 dark:text-red-400'
                  }`}
                >
                  {stat.change}
                </span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                {stat.value}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">{stat.title}</p>
            </div>
          ))}
        </div>

        {/* Charts Row 1 */}
        <div className="grid lg:grid-cols-2 gap-6 mb-6">
          {/* Usage Trends */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Platform Usage Trends
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={usageData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="month" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1f2937',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#fff',
                  }}
                />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="users"
                  stackId="1"
                  stroke="#10b981"
                  fill="#10b981"
                  fillOpacity={0.6}
                />
                <Area
                  type="monotone"
                  dataKey="predictions"
                  stackId="2"
                  stroke="#3b82f6"
                  fill="#3b82f6"
                  fillOpacity={0.6}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Crop Distribution */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Crop Distribution
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={cropData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {cropData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1f2937',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#fff',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Charts Row 2 */}
        <div className="grid lg:grid-cols-2 gap-6 mb-6">
          {/* Disease Analytics */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Top Disease Detections
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={diseaseData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="disease" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1f2937',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#fff',
                  }}
                />
                <Bar dataKey="cases" fill="#f59e0b" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* State-wise Distribution */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              State-wise Farmers
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={stateData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis type="number" stroke="#9ca3af" />
                <YAxis dataKey="state" type="category" stroke="#9ca3af" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1f2937',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#fff',
                  }}
                />
                <Bar dataKey="farmers" fill="#10b981" radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Users */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Recent User Activity
            </h3>
            <button className="text-sm text-green-600 dark:text-green-400 hover:underline">
              View all
            </button>
          </div>
          <div className="space-y-3">
            {recentUsers.map((user, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-white font-semibold">
                    {user.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{user.name}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{user.location}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-500 dark:text-gray-400">{user.joined}</span>
                  <span
                    className={`w-2 h-2 rounded-full ${
                      user.status === 'online' ? 'bg-green-500' : 'bg-gray-400'
                    }`}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}