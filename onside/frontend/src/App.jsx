import React, { useState, useEffect, useMemo } from 'react';
import { 
  LayoutDashboard, 
  Wallet, 
  CreditCard, 
  Target, 
  Trophy, 
  Moon, 
  Sun, 
  Plus, 
  TrendingUp, 
  TrendingDown, 
  ArrowUpRight,
  ArrowDownRight,
  X,
  ChevronRight,
  Flame,
  CheckCircle,
  User,
  LogOut,
  Edit2,
  Trash2,
  Settings,
  Lock,
  Mail,
  Phone,
  Globe,
  DollarSign,
  Zap,
  Gift,
  PieChart,
  Calendar,
  Filter,
  BarChart3
} from 'lucide-react';

// --- API Configuration ---
// For local development and preview. 
// When deploying to Vercel with Vite, you would typically use: import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';
const API_URL = 'http://127.0.0.1:8000'; 

// --- Theme Constants ---
const THEME = {
  light: {
    bg: '#F8FAFC',
    card: '#FFFFFF',
    text: '#111827',
    muted: '#64748B',
    border: '#E2E8F0',
  },
  dark: {
    bg: '#0F1117',
    card: '#161A23',
    text: '#EAEAEA',
    muted: '#9AA0A6',
    border: '#2D3748',
  }
};

const COLORS = {
  primary: '#6C63FF',
  secondary: '#00E5A8',
  gold: '#FFD166',
  danger: '#FF6B6B',
  success: '#22C55E'
};

// Pastel colors for the pie chart
const CHART_COLORS = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEEAD', 
  '#D4A5A5', '#9B59B6', '#3498DB', '#E67E22', '#2ECC71'
];

const CURRENCY_SYMBOLS = {
  USD: '$',
  EUR: '€',
  GBP: '£',
  JPY: '¥',
  INR: '₹',
  CAD: 'C$',
  AUD: 'A$',
  CNY: '¥',
  CHF: 'Fr',
};

const LEVEL_NAMES = [
  "Fresh Wallet",
  "Cash Curious",
  "Money Mover",
  "Spend Smart",
  "Stack Builder",
  "Cash Controller",
  "Bag Secured",
  "Money Boss",
  "Wealth Plug",
  "Big Brain Finance"
];

// --- Empty Data Template for New Users ---
const EMPTY_USER_DATA = {
  user: {
    name: "",
    username: "",
    email: "",
    phone: "",
    country: "",
    currency: "USD",
    level: 1,
    xp: 350,
    nextLevelXp: 1000,
    streak: 3,
    badges: [],
    budgetLimit: 2000 // Added default budget limit
  },
  transactions: [],
  subscriptions: [],
  goals: []
};

// --- Reusable Components ---

const Card = ({ children, className = "", onClick }) => (
  <div onClick={onClick} className={`bg-card p-5 rounded-[20px] shadow-sm hover:scale-[1.02] transition-transform duration-300 ${className}`}>
    {children}
  </div>
);

const Button = ({ children, variant = "primary", className = "", onClick, type="button", disabled }) => {
  const baseStyle =
    "px-6 py-3 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed";

  let variantStyles = "";
  switch (variant) {
    case "primary":
      variantStyles = "bg-[#2b9348] text-white shadow-lg hover:opacity-90";
      break;
    case "danger":
      variantStyles = "bg-red-500 text-white hover:bg-red-600 shadow-lg shadow-red-500/30";
      break;
    case "secondary":
      variantStyles = "border-2 border-[#2b9348] text-[#2b9348] hover:bg-[#2b9348]/10";
      break;
    default:
      variantStyles = "text-muted hover:text-text hover:bg-gray-100 dark:hover:bg-gray-800";
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyle} ${variantStyles} ${className}`}
    >
      {children}
    </button>
  );
};

const Input = ({ label, type = "text", value, onChange, placeholder, readOnly, name, required, step, defaultValue, maxLength }) => (
  <div className="mb-4">
    <label className="block text-sm font-medium text-muted mb-1">{label}</label>
    <input 
      type={type} 
      name={name}
      value={value}
      defaultValue={defaultValue}
      onChange={onChange} 
      placeholder={placeholder} 
      readOnly={readOnly}
      required={required}
      step={step}
      maxLength={maxLength}
      className={`w-full bg-bg border border-border rounded-xl p-3 text-text focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all ${readOnly ? 'opacity-60 cursor-not-allowed' : ''}`}
    />
  </div>
);

const ProgressBar = ({ current, total, color = COLORS.primary }) => {
  const percent = Math.min((current / total) * 100, 100);
  return (
    <div className="h-3 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
      <div className="h-full rounded-full transition-all duration-500" style={{ width: `${percent}%`, background: `linear-gradient(90deg, ${color}, ${COLORS.secondary})` }} />
    </div>
  );
};

// --- Chart Modal (Bar for Balance, Pie for Income/Expense) ---
const ChartModal = ({ isOpen, onClose, transactions, currency, type }) => {
  if (!isOpen) return null;

  const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM
  const symbol = CURRENCY_SYMBOLS[currency] || '$';

  // Filter transactions for current month
  const monthlyTransactions = transactions.filter(t => t.date.startsWith(currentMonth));

  // --- BAR CHART (Balance) ---
  if (type === 'balance') {
    const income = monthlyTransactions.filter(t => t.type === 'income').reduce((acc, t) => acc + parseFloat(t.amount), 0);
    const expense = monthlyTransactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + parseFloat(t.amount), 0);
    
    // Add 10% buffer to max for visual spacing, default min 100
    const rawMax = Math.max(income, expense, 100);
    const max = Math.ceil(rawMax * 1.1); 
    
    // Y-axis ticks (5 steps)
    const ticks = [max, max * 0.75, max * 0.5, max * 0.25, 0];

    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
        <div className="bg-card w-full max-w-md rounded-2xl p-6 shadow-2xl animate-scale-in border border-border" onClick={e => e.stopPropagation()}>
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-text">Monthly Overview</h3>
            <button onClick={onClose} className="text-muted hover:text-text"><X size={24}/></button>
          </div>
          
          <div className="relative h-64 w-full pl-8 mb-4">
             {/* Y-Axis & Grid Lines */}
             <div className="absolute inset-0 flex flex-col justify-between text-xs text-muted pointer-events-none">
                {ticks.map((tick, i) => (
                   <div key={i} className="flex items-center w-full">
                      <span className="absolute -left-8 w-8 text-right pr-2 text-[10px]">{Math.round(tick)}</span>
                      <div className={`w-full border-t ${tick === 0 ? 'border-border' : 'border-dashed border-border/50'}`}></div>
                   </div>
                ))}
             </div>

             {/* Bars */}
             <div className="absolute inset-0 flex items-end justify-around px-4">
                 {/* Income Bar */}
                 <div className="flex flex-col items-center justify-end h-full w-20 group relative">
                    <div 
                        style={{ height: `${(income / max) * 100}%` }} 
                        className="w-full bg-green-500 rounded-t-lg relative transition-all duration-1000 ease-out hover:opacity-90 group-hover:scale-x-105"
                    >
                        <span className="absolute -top-6 left-1/2 -translate-x-1/2 font-bold text-green-500 text-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                            {symbol}{income.toFixed(0)}
                        </span>
                    </div>
                    <span className="text-xs font-bold text-muted mt-2">Income</span>
                 </div>

                 {/* Expense Bar */}
                 <div className="flex flex-col items-center justify-end h-full w-20 group relative">
                    <div 
                        style={{ height: `${(expense / max) * 100}%` }} 
                        className="w-full bg-red-500 rounded-t-lg relative transition-all duration-1000 ease-out hover:opacity-90 group-hover:scale-x-105"
                    >
                        <span className="absolute -top-6 left-1/2 -translate-x-1/2 font-bold text-red-500 text-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                            {symbol}{expense.toFixed(0)}
                        </span>
                    </div>
                    <span className="text-xs font-bold text-muted mt-2">Expense</span>
                 </div>
             </div>
          </div>

          <div className="text-center mt-6 pt-4 border-t border-border text-sm font-medium">
             Net Balance: <span className={income >= expense ? "text-green-500" : "text-red-500"}>{income >= expense ? '+' : '-'}{symbol}{Math.abs(income - expense).toFixed(2)}</span>
          </div>
        </div>
      </div>
    );
  }

  // --- PIE CHART (Income or Expense) ---
  const relevantTransactions = monthlyTransactions.filter(t => t.type === type);
  
  // Group by category
  const categories = relevantTransactions.reduce((acc, t) => {
    acc[t.category] = (acc[t.category] || 0) + parseFloat(t.amount);
    return acc;
  }, {});

  const total = Object.values(categories).reduce((a, b) => a + b, 0);
  
  // Calculate segments for conic-gradient
  let currentAngle = 0;
  const segments = Object.entries(categories).map(([name, amount], index) => {
    const percentage = (amount / total) * 100;
    const color = CHART_COLORS[index % CHART_COLORS.length];
    const start = currentAngle;
    currentAngle += percentage;
    return { name, amount, percentage, color, start, end: currentAngle };
  });

  const gradientString = segments.map(s => `${s.color} ${s.start}% ${s.end}%`).join(', ');
  const title = type === 'income' ? 'Income Breakdown' : 'Expense Breakdown';

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-card w-full max-w-md rounded-2xl p-6 shadow-2xl animate-scale-in border border-border" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-text">{title}</h3>
          <button onClick={onClose} className="text-muted hover:text-text"><X size={24}/></button>
        </div>
        
        {total === 0 ? (
          <div className="text-center py-10 text-muted">No {type} recorded for this month.</div>
        ) : (
          <>
            <div className="flex justify-center mb-8 relative">
               {/* Pie Chart */}
               <div 
                 className="w-48 h-48 rounded-full shadow-lg transition-all duration-500"
                 style={{ background: `conic-gradient(${gradientString})` }}
               ></div>
               {/* Center Hole for Donut effect */}
               <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-card rounded-full flex items-center justify-center flex-col shadow-inner">
                  <span className="text-xs text-muted">Total</span>
                  <span className="font-bold text-lg text-text">{symbol}{total.toFixed(2)}</span>
               </div>
            </div>

            <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
              {segments.map(s => (
                <div key={s.name} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-white/5">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: s.color }}></div>
                    <span className="text-sm font-medium text-text">{s.name}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-text">{symbol}{s.amount.toFixed(2)}</div>
                    <div className="text-xs text-muted">{s.percentage.toFixed(1)}%</div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

// --- New Gamification Component ---
const UserStats = ({ user }) => {
  const [showInfo, setShowInfo] = useState(false);
  const xpPercentage = Math.min((user.xp / user.nextLevelXp) * 100, 100);
  const levelName = LEVEL_NAMES[(user.level - 1) % LEVEL_NAMES.length] || LEVEL_NAMES[0];
  const currencySymbol = CURRENCY_SYMBOLS[user.currency] || user.currency;
  
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-2">
         {/* Level Card */}
         <Card 
            onClick={() => setShowInfo(true)}
            className="flex items-center gap-4 !p-4 relative overflow-hidden border-l-4 border-l-yellow-400 bg-gradient-to-br from-card to-yellow-50/50 dark:to-yellow-900/10 cursor-pointer hover:opacity-80 transition-opacity"
         >
            <div className="w-12 h-12 rounded-2xl bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center text-yellow-600 font-bold text-xl shadow-sm rotate-3">
               {user.level}
            </div>
            <div>
               <h4 className="font-bold text-text text-lg">Level {user.level}</h4>
               <p className="text-xs text-muted font-medium uppercase tracking-wider">{levelName}</p>
            </div>
         </Card>

         {/* XP & Streak Progress */}
         <Card className="md:col-span-2 flex flex-col justify-center !p-4 gap-3">
            <div className="flex justify-between items-center">
               <div className="flex items-center gap-2">
                  <span className="bg-orange-100 dark:bg-orange-900/20 text-orange-500 p-1.5 rounded-lg">
                    <Flame size={18} fill="currentColor" />
                  </span>
                  <span className="font-bold text-text text-sm">{user.streak} Day Streak</span>
               </div>
               <span className="text-xs font-bold text-primary bg-primary/10 px-3 py-1 rounded-full">{user.xp} / {user.nextLevelXp} XP</span>
            </div>
            
            <div className="relative pt-1">
              <div className="flex mb-2 items-center justify-between">
                <div className="text-right w-full">
                  <span className="text-xs font-semibold inline-block text-primary">
                    {Math.round(xpPercentage)}% to Level {user.level + 1}
                  </span>
                </div>
              </div>
              <div className="overflow-hidden h-3 mb-1 text-xs flex rounded-full bg-gray-200 dark:bg-gray-700">
                <div 
                  style={{ width: `${xpPercentage}%`, background: `linear-gradient(90deg, ${COLORS.primary}, #A78BFA)` }} 
                  className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center transition-all duration-1000 ease-out h-full"
                ></div>
              </div>
            </div>
         </Card>
      </div>

      {/* Level Info Modal */}
      {showInfo && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowInfo(false)}>
          <div className="bg-card p-6 rounded-2xl shadow-2xl max-w-sm w-full border border-border animate-scale-in" onClick={e => e.stopPropagation()}>
             <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-text">Level Rewards</h3>
                <button onClick={() => setShowInfo(false)} className="text-muted hover:text-text"><X size={24}/></button>
             </div>
             <div className="flex flex-col items-center text-center gap-4 mb-4">
                <div className="w-16 h-16 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center text-3xl">🎁</div>
                <p className="text-text">Hit <strong>Level 10</strong> and unlock an Amazon voucher worth <strong>100 {currencySymbol}</strong>.</p>
             </div>
             <Button className="w-full" onClick={() => setShowInfo(false)}>Let's Go!</Button>
          </div>
        </div>
      )}
    </>
  );
};

// --- Budget Card Component ---
const BudgetCard = ({ transactions, limit, onUpdateBudget, currency }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newLimit, setNewLimit] = useState(limit);

  const symbol = CURRENCY_SYMBOLS[currency] || '$';

  // Update local state if prop changes
  useEffect(() => {
    setNewLimit(limit);
  }, [limit]);

  // 1. Calculate total expenses
  const totalExpense = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, curr) => acc + parseFloat(curr.amount), 0);

  // 2. Calculate percentage
  const percent = Math.min((totalExpense / limit) * 100, 100);
  
  // 3. Determine status (Warning if over 85%)
  const isWarning = percent > 85;
  const barColor = isWarning ? '#EF4444' : '#22C55E'; // Red vs Green

  const handleSave = () => {
    if (newLimit && !isNaN(newLimit) && newLimit > 0) {
      onUpdateBudget(parseFloat(newLimit));
      setIsEditing(false);
    }
  };

  return (
    <div className="bg-card p-5 rounded-[20px] shadow-sm border border-border mt-4 mb-4">
      <div className="flex justify-between items-center mb-3">
        <div>
            <h3 className="font-bold text-text">Monthly Budget</h3>
            {isEditing ? (
              <div className="flex items-center gap-2 mt-1 animate-fade-in">
                <span className="text-xs text-muted">{symbol}</span>
                <input 
                  type="number" 
                  value={newLimit}
                  onChange={(e) => setNewLimit(e.target.value)}
                  className="w-20 p-1 text-sm border border-primary/50 rounded bg-bg text-text focus:outline-none focus:ring-1 focus:ring-primary"
                  autoFocus
                  onKeyDown={(e) => e.key === 'Enter' && handleSave()}
                />
                <button onClick={handleSave} className="text-green-500 hover:bg-green-100 dark:hover:bg-green-900/30 p-1 rounded transition-colors"><CheckCircle size={16} /></button>
                <button onClick={() => { setIsEditing(false); setNewLimit(limit); }} className="text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30 p-1 rounded transition-colors"><X size={16} /></button>
              </div>
            ) : (
              <div 
                className="flex items-center gap-2 group cursor-pointer mt-1" 
                onClick={() => setIsEditing(true)}
                title="Click to edit budget"
              >
                <p className="text-xs text-muted group-hover:text-primary transition-colors">Limit: {symbol}{parseFloat(limit).toLocaleString()}</p>
                <Edit2 size={12} className="text-muted opacity-0 group-hover:opacity-100 transition-opacity -ml-1" />
              </div>
            )}
        </div>
        <span className={`font-bold ${isWarning ? 'text-red-500' : 'text-green-500'}`}>
            {symbol}{totalExpense.toFixed(2)} / {symbol}{parseFloat(limit).toLocaleString()}
        </span>
      </div>
      
      {/* Progress Bar */}
      <div className="h-3 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <div 
            className="h-full rounded-full transition-all duration-500" 
            style={{ width: `${percent}%`, backgroundColor: barColor }} 
        />
      </div>

      {isWarning && (
          <p className="text-red-500 text-xs mt-2 font-semibold flex items-center gap-1">
              ⚠️ Warning: You've used {Math.round(percent)}% of your budget!
          </p>
      )}
    </div>
  );
};

// --- Sub-Pages ---

const AuthPage = ({ onLogin, onRegister, darkMode }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: '', password: '', name: '', email: '', phone: '', country: '', currency: 'USD'
  });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isLogin) {
      onLogin(formData.username, formData.password);
    } else {
      onRegister(formData);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-card w-full max-w-md p-8 rounded-3xl shadow-2xl border border-border">
        <div className="flex flex-col items-center mb-8">
          <div className="w-20 h-20 rounded-2xl flex items-center justify-center font-bold text-4xl shadow-lg mb-4" style={{ backgroundColor: '#2b9348', color: darkMode ? '#FFFFFF' : '#000000' }}>
            O
          </div>
          <h1 className="text-2xl font-bold font-heading text-text">Welcome to OnSide</h1>
          <p className="text-muted text-center mt-2">Simplify your finance game.</p>
        </div>

        <div className="flex gap-4 mb-6">
          <button 
            onClick={() => setIsLogin(true)} 
            className={`flex-1 py-2 font-medium rounded-xl transition-all ${isLogin ? 'text-white shadow-lg' : 'text-text hover:bg-gray-100 dark:hover:bg-gray-800'}`}
            style={{ backgroundColor: isLogin ? '#2b9348' : undefined }}
          >
            Login
          </button>
          <button 
            onClick={() => setIsLogin(false)} 
            className={`flex-1 py-2 font-medium rounded-xl transition-all ${!isLogin ? 'text-white shadow-lg' : 'text-text hover:bg-gray-100 dark:hover:bg-gray-800'}`}
            style={{ backgroundColor: !isLogin ? '#2b9348' : undefined }}
          >
            Register
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Username" name="username" value={formData.username} onChange={handleChange} required />
          <Input label="Password" type="password" name="password" value={formData.password} onChange={handleChange} required />
          
          {!isLogin && (
            <div className="space-y-4 animate-fade-in">
              <Input label="Full Name" name="name" value={formData.name} onChange={handleChange} required />
              <Input label="Email" type="email" name="email" value={formData.email} onChange={handleChange} required />
              <Input label="Phone" name="phone" value={formData.phone} onChange={handleChange} required />
              <div className="grid grid-cols-2 gap-4">
                <Input label="Country" name="country" value={formData.country} onChange={handleChange} required />
                <Input label="Currency" name="currency" value={formData.currency} onChange={handleChange} placeholder="USD, EUR, etc." required />
              </div>
            </div>
          )}

          <Button type="submit" className="w-full mt-6" darkMode={darkMode}>
            {isLogin ? 'Login' : 'Create Account'}
          </Button>
        </form>
      </div>
    </div>
  );
};

const Profile = ({ user, onUpdateProfile, onLogout, darkMode }) => {
  const [formData, setFormData] = useState({ ...user });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdateProfile(formData);
    alert("Profile updated successfully!");
  };

  const handleForgotPassword = () => {
    alert(`Reset link sent to ${user.email}`);
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold font-heading text-text">My Profile</h2>
      <div className="bg-card p-6 rounded-[24px] shadow-sm border border-border">
        <div className="flex items-center gap-4 mb-8">
           <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary text-2xl font-bold">
             {user.name ? user.name.charAt(0) : user.username.charAt(0)}
           </div>
           <div>
             <h3 className="text-xl font-bold text-text">{user.name || user.username}</h3>
             <p className="text-muted">@{user.username}</p>
           </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Username" value={user.username} readOnly />
          <Input label="Full Name" name="name" value={formData.name} onChange={handleChange} />
          <Input label="Email Address" name="email" value={formData.email} onChange={handleChange} />
          <Input label="Phone Number" name="phone" value={formData.phone} onChange={handleChange} />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Country" name="country" value={formData.country} onChange={handleChange} />
            <Input label="Currency" name="currency" value={formData.currency} onChange={handleChange} />
          </div>

          <div className="pt-4 border-t border-border flex justify-between items-center">
            <button type="button" onClick={handleForgotPassword} className="text-primary text-sm font-medium hover:underline">Forgot Password?</button>
            <Button type="submit" darkMode={darkMode}>Save Changes</Button>
          </div>
        </form>
      </div>

      <div className="flex justify-center">
        <Button variant="danger" onClick={onLogout} className="w-full md:w-auto">
          <LogOut size={20} /> Logout
        </Button>
      </div>
    </div>
  );
};

const Dashboard = ({ data, onNavigate, onEditTransaction, onDeleteTransaction, onAddGoal, onEditGoal, onDeleteGoal, onUpdateBudget, darkMode }) => {
  const [chartType, setChartType] = useState(null);
  const totalIncome = data.transactions.filter(t => t.type === 'income').reduce((acc, curr) => acc + parseFloat(curr.amount), 0);
  const totalExpense = data.transactions.filter(t => t.type === 'expense').reduce((acc, curr) => acc + parseFloat(curr.amount), 0);
  const savings = totalIncome - totalExpense;
  const symbol = CURRENCY_SYMBOLS[data.user.currency] || '$';

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold font-heading text-text">Hello, {data.user.name || data.user.username} 👋</h1>
          <p className="text-muted">Financial Overview</p>
        </div>
      </div>

      {/* NEW: Gamification Stats Bar */}
      <UserStats user={data.user} />
      
      {/* NEW: Budget Card */}
      <BudgetCard 
        transactions={data.transactions} 
        limit={data.user.budgetLimit || 2000} 
        onUpdateBudget={onUpdateBudget}
        currency={data.user.currency}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card 
          onClick={() => setChartType('balance')}
          className="border-l-4 border-l-[#6C63FF] cursor-pointer hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group"
        >
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-1 mb-1">
                <p className="text-muted text-sm font-medium">Total Balance</p>
                <BarChart3 size={14} className="text-muted opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <h2 className="text-2xl font-bold text-text">{symbol}{savings.toFixed(2)}</h2>
            </div>
            <div className="p-2 bg-primary/10 rounded-lg text-primary"><Wallet size={20} /></div>
          </div>
        </Card>
        <Card 
          onClick={() => setChartType('income')}
          className="border-l-4 border-l-[#22C55E] cursor-pointer hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group"
        >
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-1 mb-1">
                <p className="text-muted text-sm font-medium">Income</p>
                <PieChart size={14} className="text-muted opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <h2 className="text-2xl font-bold text-text">{symbol}{totalIncome.toFixed(2)}</h2>
            </div>
            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg text-green-600"><ArrowUpRight size={20} /></div>
          </div>
        </Card>
        <Card 
          onClick={() => setChartType('expense')}
          className="border-l-4 border-l-[#FF6B6B] cursor-pointer hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group"
        >
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-1 mb-1">
                <p className="text-muted text-sm font-medium">Expenses</p>
                <PieChart size={14} className="text-muted opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <h2 className="text-2xl font-bold text-text">{symbol}{totalExpense.toFixed(2)}</h2>
            </div>
            <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg text-red-600"><ArrowDownRight size={20} /></div>
          </div>
        </Card>
      </div>

      {/* Chart Modal Triggered by Dashboard Cards */}
      <ChartModal 
        isOpen={!!chartType} 
        onClose={() => setChartType(null)} 
        transactions={data.transactions}
        currency={data.user.currency}
        type={chartType}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Transactions */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold font-heading text-text">Recent Activity</h3>
            <button onClick={() => onNavigate('transactions')} className="text-sm text-primary font-medium hover:underline">View All</button>
          </div>
          <div className="space-y-3">
            {data.transactions.length === 0 ? <p className="text-muted text-center py-4">No transactions yet.</p> : data.transactions.slice(0, 4).map(t => (
              <Card key={t.id} onClick={() => onEditTransaction(t)} className="!p-4 flex items-center justify-between cursor-pointer hover:border-primary/50 border border-transparent">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-full ${t.type === 'income' ? 'bg-green-100 dark:bg-green-900/20 text-green-600' : 'bg-red-100 dark:bg-red-900/20 text-red-500'}`}>{t.type === 'income' ? <TrendingUp size={20}/> : <TrendingDown size={20}/>}</div>
                  <div><h4 className="font-semibold text-text">{t.title}</h4><p className="text-xs text-muted">{t.date} • {t.category}</p></div>
                </div>
                <span className={`font-bold ${t.type === 'income' ? 'text-green-500' : 'text-text'}`}>{t.type === 'income' ? '+' : '-'}{symbol}{parseFloat(t.amount).toFixed(2)}</span>
              </Card>
            ))}
          </div>
        </div>

        {/* Goals */}
        <div className="space-y-4">
          <h3 className="text-xl font-bold font-heading text-text">Saving Goals</h3>
          {data.goals.length === 0 ? <p className="text-muted text-sm">No goals set.</p> : data.goals.map(goal => (
             <div key={goal.id} className="relative group">
              <Card onClick={() => onEditGoal(goal)} className="!p-4 cursor-pointer">
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-2"><span className="text-xl">{goal.icon}</span><span className="font-semibold text-text">{goal.name}</span></div>
                  <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-1 rounded">{Math.round((goal.current / goal.target) * 100)}%</span>
                </div>
                <ProgressBar current={goal.current} total={goal.target} />
                <div className="flex justify-between mt-2 text-xs text-muted"><span>{symbol}{goal.current} saved</span><span>Goal: {symbol}{goal.target}</span></div>
              </Card>
            </div>
          ))}
          <Button variant="secondary" className="w-full text-sm py-2" onClick={onAddGoal} darkMode={darkMode}><Plus size={16} /> Add New Goal</Button>
        </div>
      </div>
    </div>
  );
};

const Transactions = ({ transactions, onAdd, onEdit, onDelete, darkMode, currency }) => {
  const [filterType, setFilterType] = useState('all'); // all, daily, monthly, yearly, range
  const [dateValue, setDateValue] = useState(new Date().toISOString().slice(0, 10)); // Default today
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  
  const symbol = CURRENCY_SYMBOLS[currency] || '$';

  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => {
      if (filterType === 'all') return true;
      
      const tDate = new Date(t.date);
      const selected = new Date(dateValue);

      if (filterType === 'daily') {
        return t.date === dateValue;
      }
      if (filterType === 'monthly') {
        return t.date.slice(0, 7) === dateValue.slice(0, 7);
      }
      if (filterType === 'yearly') {
        return t.date.slice(0, 4) === dateValue.slice(0, 4);
      }
      if (filterType === 'range') {
        if (!dateRange.start || !dateRange.end) return true;
        return t.date >= dateRange.start && t.date <= dateRange.end;
      }
      return true;
    });
  }, [transactions, filterType, dateValue, dateRange]);
  
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold font-heading text-text">Transactions</h2>
        <Button onClick={() => onAdd()} darkMode={darkMode}><Plus size={20} /> Add New</Button>
      </div>

      {/* --- Date Filter Toolbar --- */}
      <div className="bg-card p-4 rounded-xl border border-border flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
          {['all', 'daily', 'monthly', 'yearly', 'range'].map(ft => (
            <button 
              key={ft} 
              onClick={() => setFilterType(ft)} 
              className={`px-4 py-2 rounded-lg text-sm font-medium capitalize whitespace-nowrap transition-all ${filterType === ft ? 'bg-primary text-white shadow-md' : 'text-muted hover:text-text hover:bg-gray-100 dark:hover:bg-white/5'}`}
            >
              {ft}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          {filterType === 'daily' && (
            <input 
              type="date" 
              value={dateValue} 
              onChange={(e) => setDateValue(e.target.value)}
              className="p-2 rounded-lg border border-border bg-bg text-text text-sm w-full md:w-auto"
            />
          )}
          {filterType === 'monthly' && (
            <input 
              type="month" 
              value={dateValue.slice(0, 7)} 
              onChange={(e) => setDateValue(e.target.value)}
              className="p-2 rounded-lg border border-border bg-bg text-text text-sm w-full md:w-auto"
            />
          )}
          {filterType === 'yearly' && (
            <input 
              type="number" 
              placeholder="YYYY"
              min="2000"
              max="2100"
              value={dateValue.slice(0, 4)} 
              onChange={(e) => setDateValue(e.target.value)}
              className="p-2 rounded-lg border border-border bg-bg text-text text-sm w-full md:w-24"
            />
          )}
          {filterType === 'range' && (
            <div className="flex gap-2 items-center w-full md:w-auto">
              <input 
                type="date" 
                value={dateRange.start} 
                onChange={(e) => setDateRange({...dateRange, start: e.target.value})}
                className="p-2 rounded-lg border border-border bg-bg text-text text-sm w-full"
                placeholder="Start"
              />
              <span className="text-muted">-</span>
              <input 
                type="date" 
                value={dateRange.end} 
                onChange={(e) => setDateRange({...dateRange, end: e.target.value})}
                className="p-2 rounded-lg border border-border bg-bg text-text text-sm w-full"
                placeholder="End"
              />
            </div>
          )}
        </div>
      </div>

      <div className="grid gap-3">
        {filteredTransactions.length === 0 ? <div className="text-center py-10 text-muted">No transactions found for this period.</div> : filteredTransactions.map(t => (
          <Card key={t.id} onClick={() => onEdit(t)} className="flex items-center justify-between !p-4 group cursor-pointer hover:border-primary/50 border border-transparent">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl ${t.type === 'income' ? 'bg-green-100 dark:bg-green-900/20' : 'bg-red-100 dark:bg-red-900/20'}`}>{t.type === 'income' ? '💰' : '🛒'}</div>
              <div><h4 className="font-semibold text-text text-lg">{t.title}</h4><p className="text-sm text-muted">{t.date} • {t.category}</p></div>
            </div>
            <div className="text-right"><p className={`font-bold text-lg ${t.type === 'income' ? 'text-green-500' : 'text-text'}`}>{t.type === 'income' ? '+' : '-'}{symbol}{parseFloat(t.amount).toFixed(2)}</p></div>
          </Card>
        ))}
      </div>
    </div>
  );
};

const Subscriptions = ({ subscriptions, onAdd, onEdit, onDelete, darkMode, currency }) => {
  const symbol = CURRENCY_SYMBOLS[currency] || '$';
  return (
  <div className="space-y-6 animate-fade-in">
    <div className="flex justify-between items-center">
      <h2 className="text-2xl font-bold font-heading text-text">Subscriptions</h2>
      <Button onClick={onAdd} darkMode={darkMode}><Plus size={20} /> Add New</Button>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {subscriptions.length === 0 ? <p className="text-muted col-span-3 text-center py-8">No subscriptions yet.</p> : subscriptions.map(sub => (
        <Card key={sub.id} onClick={() => onEdit(sub)} className="relative overflow-hidden group cursor-pointer hover:ring-2 hover:ring-primary/50">
          <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full -mr-10 -mt-10 group-hover:bg-primary/10 transition-colors"></div>
          <div className="flex items-start justify-between mb-4 relative z-10">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 flex items-center justify-center text-2xl font-bold shadow-inner dark:text-black overflow-hidden">
              {sub.logo && sub.logo.includes('/') ? (
                <img src={sub.logo} alt={sub.name} className="w-full h-full object-cover" />
              ) : (
                sub.logo || (sub.name ? sub.name.charAt(0) : '?')
              )}
            </div>
            <span className="text-lg font-bold text-text">{symbol}{parseFloat(sub.amount)}</span>
          </div>
          <div className="relative z-10">
            <h3 className="font-bold text-lg text-text mb-1">{sub.name}</h3>
            <p className="text-sm text-muted mb-4">{sub.cycle}</p>
            <div className="flex items-center gap-2 text-xs font-medium text-orange-500 bg-orange-100 dark:bg-orange-900/20 w-fit px-2 py-1 rounded-md"><Target size={12} />Next: {sub.next_date}</div>
          </div>
        </Card>
      ))}
    </div>
  </div>
);
};

// --- Modals ---

const EditModal = ({ isOpen, onClose, title, children, onDelete, darkMode }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-card w-full max-w-md rounded-2xl p-6 shadow-2xl animate-scale-in border border-border">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-text">{title}</h3>
          <button onClick={onClose} className="text-muted hover:text-text"><X size={24}/></button>
        </div>
        {children}
        {onDelete && (
           <div className="mt-4 pt-4 border-t border-border flex justify-end">
             <button onClick={onDelete} className="text-red-500 text-sm font-medium hover:bg-red-50 dark:hover:bg-red-900/20 px-3 py-2 rounded-lg flex items-center gap-2">
               <Trash2 size={16} /> Delete Item
             </button>
           </div>
        )}
      </div>
    </div>
  );
};

// --- Main App Logic ---

const SidebarItem = ({ icon: Icon, label, active, onClick, collapsed, theme, darkMode }) => (
  <button 
    onClick={onClick} 
    className={`flex items-center gap-3 p-3 rounded-xl transition-all w-full group ${active ? 'bg-primary shadow-lg shadow-primary/25' : 'hover:bg-gray-100 dark:hover:bg-white dark:hover:!text-black'}`} 
    style={{ color: active ? (darkMode ? '#FFFFFF' : '#000000') : theme.text }}
  >
    <Icon size={22} className={!active ? "dark:group-hover:!text-black" : ""} style={{ color: active ? (darkMode ? '#FFFFFF' : '#000000') : theme.muted }} />
    {!collapsed && <span className="font-medium">{label}</span>}
  </button>
);

const OnSideApp = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [allUsers, setAllUsers] = useState({});
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  
  // Modal States
  const [editingItem, setEditingItem] = useState(null);
  const [modalType, setModalType] = useState(null); // 'transaction', 'goal', 'subscription'

  // --- API Functions ---
  const fetchUserData = async () => {
    try {
      const headers = { 'Authorization': `Token ${token}` };
      const [userRes, txRes, subRes, goalRes] = await Promise.all([
        fetch(`${API_URL}/api/users/me/`, { headers }),
        fetch(`${API_URL}/api/transactions/`, { headers }),
        fetch(`${API_URL}/api/subscriptions/`, { headers }),
        fetch(`${API_URL}/api/goals/`, { headers })
      ]);

      if (userRes.ok) {
        const userData = await userRes.json();
        const txs = await txRes.json();
        const subs = await subRes.json();
        const goals = await goalRes.json();
        
        setCurrentUser({
          user: { ...userData, ...userData.profile }, // Merge User and Profile
          transactions: txs,
          subscriptions: subs,
          goals: goals
        });
      }
    } catch (error) {
      console.error("Failed to fetch data", error);
    }
  };

  useEffect(() => {
    if (token) fetchUserData();
  }, [token]);

  const handleLogin = async (username, password) => {
    try {
      const res = await fetch(`${API_URL}/api-token-auth/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      if (data.token) {
        setToken(data.token);
        localStorage.setItem('token', data.token);
      } else {
        alert("Login failed");
      }
    } catch (e) { alert("Connection Error"); }
  };

  const handleLogout = () => {
    setToken(null);
    setCurrentUser(null);
    localStorage.removeItem('token');
    setActiveTab('dashboard');
  };

  const handleUpdateBudget = (newLimit) => {
    handleUpdateProfile({ profile: { budget_limit: newLimit } });
  };

  const handleUpdateProfile = async (data) => {
     // Update user profile via API
     try {
       await fetch(`${API_URL}/api/users/${currentUser.user.id}/`, {
         method: 'PATCH',
         headers: { 'Content-Type': 'application/json', 'Authorization': `Token ${token}` },
         body: JSON.stringify(data)
       });
       fetchUserData();
     } catch(e) {}
  };

  const handleUpdateData = async (type, action, item) => {
    // Determine Endpoint
    const method = action === 'add' ? 'POST' : action === 'edit' ? 'PUT' : 'DELETE';
    const url = action === 'delete' ? `${API_URL}/api/${type}/${item.id}/` : (action === 'edit' ? `${API_URL}/api/${type}/${item.id}/` : `${API_URL}/api/${type}/`);
    
    try {
      const res = await fetch(url, {
        method: method,
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Token ${token}`
        },
        body: action !== 'delete' ? JSON.stringify(item) : null
      });
      
      if (res.ok) {
        // --- GAMIFICATION LOGIC (Calculated Client-side, Saved to Server) ---
        if (action === 'add') {
          let earnedXp = 0;
          if (type === 'transactions' || type === 'subscriptions') {
            earnedXp = Math.floor(Math.abs(item.amount || 0));
          } else if (type === 'goals') {
            earnedXp = 150; 
          }

          if (earnedXp > 0) {
            let { xp, level, nextLevelXp } = currentUser.user;
            // Handle backend variable naming differences (snake_case vs camelCase) if needed
            // Assuming the serializer sends next_level_xp as nextLevelXp or we map it. 
            // In the fetchUserData I spread profile, so it depends on serializer.
            // Let's assume standardized keys for now or fallback.
            let currentXp = xp || 0;
            let currentLevel = level || 1;
            let currentNextXp = nextLevelXp || currentUser.user.next_level_xp || 1000;

            currentXp += earnedXp;
            let rewardVoucher = false;

            while (currentXp >= currentNextXp) {
              currentXp -= currentNextXp;
              currentLevel += 1;
              if (currentLevel > 10) {
                currentLevel = 1;
                currentNextXp = 1000;
                rewardVoucher = true;
              } else {
                currentNextXp = Math.floor(currentNextXp * 1.2);
              }
            }

            // Update Profile on Server
            await handleUpdateProfile({
                profile: {
                    xp: currentXp,
                    level: currentLevel,
                    next_level_xp: currentNextXp
                }
            });

            // If Voucher Triggered
            if (rewardVoucher) {
                await fetch(`${API_URL}/api/transactions/`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'Authorization': `Token ${token}` },
                    body: JSON.stringify({
                        title: "Amazon Voucher (Reward)",
                        amount: 100,
                        type: "income",
                        category: "Gift",
                        date: new Date().toISOString().split('T')[0]
                    })
                });
            }
          }
        }
        
        fetchUserData(); // Refresh all data
      }
    } catch (e) { console.error(e); }
    
    setEditingItem(null);
    setModalType(null);
  };

  const currentTheme = darkMode ? THEME.dark : THEME.light;

  // -- Render Modals --
  const renderModalContent = () => {
    if (!modalType) return null;
    
    const isEdit = !!editingItem;
    // Default form states
    let initialValues = {};
    if (modalType === 'transactions') initialValues = { title: '', amount: '', type: 'expense', category: 'General', date: new Date().toISOString().split('T')[0] };
    if (modalType === 'subscriptions') initialValues = { name: '', amount: '', cycle: 'Monthly', next_date: '', logo: '' };
    if (modalType === 'goals') initialValues = { name: '', current_amount: 0, target_amount: 0, icon: '🎯' };

    const values = isEdit ? editingItem : initialValues;
    
    const handleSubmit = (e) => {
      e.preventDefault();
      const formData = new FormData(e.target);
      const data = Object.fromEntries(formData.entries());
      // Convert numbers
      if (data.amount) data.amount = parseFloat(data.amount);
      if (data.current) data.current = parseFloat(data.current);
      if (data.target) data.target = parseFloat(data.target);
      
      const item = { ...values, ...data, id: values.id }; // remove Date.now() since backend handles ID
      handleUpdateData(
        modalType, 
        isEdit ? 'edit' : 'add', 
        item
      );
    };

    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        {modalType === 'transactions' && (
          <>
            <Input label="Title" name="title" defaultValue={values.title} required />
            <Input label="Amount" type="number" name="amount" defaultValue={values.amount} required step="0.01" />
            <Input label="Category" name="category" defaultValue={values.category} required />
            <div className="grid grid-cols-2 gap-3">
              <label className="flex items-center gap-2 p-3 border rounded-xl cursor-pointer">
                <input type="radio" name="type" value="income" defaultChecked={values.type === 'income'} /> Income
              </label>
              <label className="flex items-center gap-2 p-3 border rounded-xl cursor-pointer">
                <input type="radio" name="type" value="expense" defaultChecked={values.type === 'expense'} /> Expense
              </label>
            </div>
          </>
        )}
        {modalType === 'subscriptions' && (
          <>
              <Input label="Service Name" name="name" defaultValue={values.name} required />
              <Input label="Amount" type="number" name="amount" defaultValue={values.amount} required step="0.01" />
              <Input label="Billing Cycle" name="cycle" defaultValue={values.cycle} placeholder="Monthly" required />
              <Input label="Next Date" type="date" name="next_date" defaultValue={values.next_date || values.nextDate} required />
              <Input label="Logo URL" name="logo" defaultValue={values.logo} placeholder="https://example.com/logo.png" />
          </>
        )}
        {modalType === 'goals' && (
          <>
            <Input label="Goal Name" name="name" defaultValue={values.name} required />
            <Input label="Target Amount" type="number" name="target_amount" defaultValue={values.target_amount || values.targetAmount} required step="0.01" />
            <Input label="Current Savings" type="number" name="current_amount" defaultValue={values.current_amount || values.currentAmount} required step="0.01" />
            <Input label="Icon (Emoji)" name="icon" defaultValue={values.icon} maxLength={2} />
          </>
        )}
        <Button type="submit" className="w-full" darkMode={darkMode}>Save</Button>
      </form>
    );
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 font-sans flex overflow-hidden bg-[var(--bg-bg)] text-[var(--bg-text)]`} style={{ backgroundColor: currentTheme.bg, color: currentTheme.text }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Poppins:wght@500;600;700&display=swap');
        .font-heading { font-family: 'Poppins', sans-serif; }
        .font-sans { font-family: 'Inter', sans-serif; }
        .bg-card { background-color: ${currentTheme.card}; }
        .bg-bg { background-color: ${currentTheme.bg}; }
        .text-text { color: ${currentTheme.text}; }
        .text-muted { color: ${currentTheme.muted}; }
        .border-border { border-color: ${currentTheme.border}; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in { animation: fadeIn 0.4s ease-out forwards; }
        @keyframes scaleIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
        .animate-scale-in { animation: scaleIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1); }
      `}</style>

      {/* RENDER CONTENT BASED ON AUTH STATUS */}
      {!currentUser ? (
        <AuthPage onLogin={handleLogin} onRegister={handleRegister} darkMode={darkMode} />
      ) : (
        <div className="flex h-screen overflow-hidden w-full">
          {/* Sidebar */}
          <aside className={`hidden md:flex flex-col border-r border-border bg-card transition-all duration-300 z-20 ${sidebarCollapsed ? 'w-20' : 'w-72'}`}>
            <div className="p-6 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xl shadow-lg" style={{ backgroundColor: '#2b9348', color: darkMode ? '#FFFFFF' : '#000000' }}>O</div>
              {!sidebarCollapsed && (<span className="font-heading font-bold text-2xl tracking-tight"><span style={{ color: '#2b9348' }}>On</span><span style={{ color: currentTheme.text }}>Side</span></span>)}
            </div>
            <nav className="flex-1 px-4 space-y-2 py-4">
              <SidebarItem icon={LayoutDashboard} label="Dashboard" active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} collapsed={sidebarCollapsed} theme={currentTheme} darkMode={darkMode} />
              <SidebarItem icon={CreditCard} label="Transactions" active={activeTab === 'transactions'} onClick={() => setActiveTab('transactions')} collapsed={sidebarCollapsed} theme={currentTheme} darkMode={darkMode} />
              <SidebarItem icon={Wallet} label="Subscriptions" active={activeTab === 'subscriptions'} onClick={() => setActiveTab('subscriptions')} collapsed={sidebarCollapsed} theme={currentTheme} darkMode={darkMode} />
              <SidebarItem icon={User} label="Profile" active={activeTab === 'profile'} onClick={() => setActiveTab('profile')} collapsed={sidebarCollapsed} theme={currentTheme} darkMode={darkMode} />
            </nav>
            <div className="p-4 border-t border-border space-y-2">
               <button onClick={() => setDarkMode(!darkMode)} className={`flex items-center gap-3 p-3 rounded-xl w-full hover:bg-gray-100 dark:hover:bg-white/5 transition-colors ${sidebarCollapsed ? 'justify-center' : ''}`} style={{ color: currentTheme.muted }}>
                 {darkMode ? <Sun size={20} /> : <Moon size={20} />}
                 {!sidebarCollapsed && <span className="font-medium">{darkMode ? 'Light Mode' : 'Dark Mode'}</span>}
               </button>
               <button onClick={() => setSidebarCollapsed(!sidebarCollapsed)} className="hidden lg:flex w-full items-center justify-center p-2 hover:text-text" style={{ color: currentTheme.muted }}>
                 {sidebarCollapsed ? <ChevronRight size={20} /> : <div className="text-xs uppercase font-bold tracking-widest opacity-50">Collapse</div>}
               </button>
            </div>
          </aside>

          {/* Mobile Header & Content */}
          <div className="flex-1 flex flex-col h-screen overflow-hidden">
            <header className="md:hidden h-16 bg-card border-b border-border flex items-center justify-between px-4 z-20">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center font-bold" style={{ backgroundColor: '#2b9348', color: darkMode ? '#FFFFFF' : '#000000' }}>O</div>
                <span className="font-heading font-bold text-xl"><span style={{ color: '#2b9348' }}>On</span><span style={{ color: currentTheme.text }}>Side</span></span>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => setDarkMode(!darkMode)} className="p-2" style={{ color: currentTheme.text }}>{darkMode ? <Sun size={20} /> : <Moon size={20} />}</button>
                <button onClick={handleLogout} className="p-2 text-red-500"><LogOut size={20}/></button>
              </div>
            </header>

            {/* Dashboard Top Bar (Desktop) */}
            <div className="hidden md:flex justify-end p-4 fixed top-4 right-4 z-50">
              {activeTab === 'dashboard' && (
                 <Button variant="danger" onClick={handleLogout} className="!py-2 !px-4 text-sm shadow-lg">Logout</Button>
              )}
            </div>

            <main className="flex-1 overflow-y-auto p-4 md:p-8 pb-24 md:pb-8 relative">
              <div className="max-w-6xl mx-auto mt-4 md:mt-0">
                {activeTab === 'dashboard' && <Dashboard 
                  data={currentUser} 
                  onNavigate={setActiveTab} 
                  onEditTransaction={(t) => { setEditingItem(t); setModalType('transactions'); }}
                  onAddGoal={() => { setEditingItem(null); setModalType('goals'); }}
                  onEditGoal={(g) => { setEditingItem(g); setModalType('goals'); }}
                  onUpdateBudget={handleUpdateBudget}
                  darkMode={darkMode}
                />}
                {activeTab === 'transactions' && <Transactions 
                  transactions={currentUser.transactions} 
                  onAdd={() => { setEditingItem(null); setModalType('transactions'); }}
                  onEdit={(t) => { setEditingItem(t); setModalType('transactions'); }}
                  darkMode={darkMode}
                  currency={currentUser.user.currency}
                />}
                {activeTab === 'subscriptions' && <Subscriptions 
                  subscriptions={currentUser.subscriptions} 
                  onAdd={() => { setEditingItem(null); setModalType('subscriptions'); }}
                  onEdit={(s) => { setEditingItem(s); setModalType('subscriptions'); }}
                  darkMode={darkMode}
                  currency={currentUser.user.currency}
                />}
                {activeTab === 'profile' && <Profile 
                   user={currentUser.user} 
                   onUpdateProfile={(data) => handleUpdateProfile(data)}
                   onLogout={handleLogout}
                   darkMode={darkMode}
                />}
              </div>
            </main>

            <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border h-20 flex items-center justify-around px-2 z-30 pb-2">
              <button onClick={() => setActiveTab('dashboard')} className={`flex flex-col items-center gap-1 p-2 rounded-lg`} style={{ color: activeTab === 'dashboard' ? COLORS.primary : currentTheme.muted }}><LayoutDashboard size={24} /><span className="text-[10px] font-medium">Home</span></button>
              <button onClick={() => setActiveTab('transactions')} className={`flex flex-col items-center gap-1 p-2 rounded-lg`} style={{ color: activeTab === 'transactions' ? COLORS.primary : currentTheme.muted }}><CreditCard size={24} /><span className="text-[10px] font-medium">Txns</span></button>
              <button onClick={() => { setEditingItem(null); setModalType('transactions'); }} className="flex flex-col items-center justify-center -mt-6"><div className="w-14 h-14 bg-primary rounded-full flex items-center justify-center text-white shadow-lg shadow-primary/40"><Plus size={28} /></div></button>
              <button onClick={() => setActiveTab('subscriptions')} className={`flex flex-col items-center gap-1 p-2 rounded-lg`} style={{ color: activeTab === 'subscriptions' ? COLORS.primary : currentTheme.muted }}><Wallet size={24} /><span className="text-[10px] font-medium">Subs</span></button>
              <button onClick={() => setActiveTab('profile')} className={`flex flex-col items-center gap-1 p-2 rounded-lg`} style={{ color: activeTab === 'profile' ? COLORS.primary : currentTheme.muted }}><User size={24} /><span className="text-[10px] font-medium">Me</span></button>
            </nav>
          </div>
        </div>
      )}

      {/* Edit/Add Modal */}
      {currentUser && (
        <EditModal 
          isOpen={!!modalType} 
          onClose={() => { setModalType(null); setEditingItem(null); }}
          title={`${editingItem ? 'Edit' : 'Add New'} ${modalType ? modalType.charAt(0).toUpperCase() + modalType.slice(1) : ''}`}
          onDelete={editingItem ? () => handleUpdateData(modalType, 'delete', editingItem) : null}
          darkMode={darkMode}
        >
          {renderModalContent()}
        </EditModal>
      )}

    </div>
  );
};

export default OnSideApp;