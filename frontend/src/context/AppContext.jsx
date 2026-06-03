import { createContext, useContext, useReducer, useCallback } from 'react';
import { api } from '../services/api';

const AppContext = createContext(null);

const initialState = {
  employees: [],
  purchases: [],
  sales: [],
  categories: [],
  dashboard: null,
  loading: false,
  error: null,
  notification: null,
};

function reducer(state, action) {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload, error: null };
    case 'SET_ERROR':
      return { ...state, loading: false, error: action.payload };
    case 'SET_EMPLOYEES':
      return { ...state, employees: action.payload, loading: false };
    case 'ADD_EMPLOYEE':
      return { ...state, employees: [action.payload, ...state.employees] };
    case 'UPDATE_EMPLOYEE':
      return {
        ...state,
        employees: state.employees.map(e => e.id === action.payload.id ? action.payload : e),
      };
    case 'REMOVE_EMPLOYEE':
      return {
        ...state,
        employees: state.employees.filter(e => e.id !== action.payload),
      };
    case 'SET_PURCHASES':
      return { ...state, purchases: action.payload, loading: false };
    case 'ADD_PURCHASE':
      return { ...state, purchases: [action.payload, ...state.purchases] };
    case 'UPDATE_PURCHASE':
      return {
        ...state,
        purchases: state.purchases.map(p => p.id === action.payload.id ? action.payload : p),
      };
    case 'REMOVE_PURCHASE':
      return {
        ...state,
        purchases: state.purchases.filter(p => p.id !== action.payload),
      };
    case 'SET_SALES':
      return { ...state, sales: action.payload, loading: false };
    case 'ADD_SALE':
      return { ...state, sales: [action.payload, ...state.sales] };
    case 'UPDATE_SALE':
      return {
        ...state,
        sales: state.sales.map(s => s.id === action.payload.id ? action.payload : s),
      };
    case 'REMOVE_SALE':
      return {
        ...state,
        sales: state.sales.filter(s => s.id !== action.payload),
      };
    case 'SET_CATEGORIES':
      return { ...state, categories: action.payload };
    case 'SET_DASHBOARD':
      return { ...state, dashboard: action.payload, loading: false };
    case 'SET_NOTIFICATION':
      return { ...state, notification: action.payload };
    default:
      return state;
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const showNotification = useCallback((message, type = 'success') => {
    dispatch({ type: 'SET_NOTIFICATION', payload: { message, type } });
    setTimeout(() => dispatch({ type: 'SET_NOTIFICATION', payload: null }), 3000);
  }, []);

  const fetchEmployees = useCallback(async (params = {}) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const data = await api.getEmployees(params);
      dispatch({ type: 'SET_EMPLOYEES', payload: data });
    } catch (err) {
      dispatch({ type: 'SET_ERROR', payload: err.message });
    }
  }, []);

  const createEmployee = useCallback(async (data) => {
    try {
      const employee = await api.createEmployee(data);
      dispatch({ type: 'ADD_EMPLOYEE', payload: employee });
      showNotification('Employee created successfully');
      return employee;
    } catch (err) {
      showNotification(err.message, 'error');
      throw err;
    }
  }, [showNotification]);

  const updateEmployee = useCallback(async (id, data) => {
    try {
      const employee = await api.updateEmployee(id, data);
      dispatch({ type: 'UPDATE_EMPLOYEE', payload: employee });
      showNotification('Employee updated successfully');
      return employee;
    } catch (err) {
      showNotification(err.message, 'error');
      throw err;
    }
  }, [showNotification]);

  const deleteEmployee = useCallback(async (id) => {
    try {
      await api.deleteEmployee(id);
      dispatch({ type: 'REMOVE_EMPLOYEE', payload: id });
      showNotification('Employee deleted successfully');
    } catch (err) {
      showNotification(err.message, 'error');
      throw err;
    }
  }, [showNotification]);

  const fetchPurchases = useCallback(async (params = {}) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const data = await api.getPurchases(params);
      dispatch({ type: 'SET_PURCHASES', payload: data });
    } catch (err) {
      dispatch({ type: 'SET_ERROR', payload: err.message });
    }
  }, []);

  const createPurchase = useCallback(async (data) => {
    try {
      const purchase = await api.createPurchase(data);
      dispatch({ type: 'ADD_PURCHASE', payload: purchase });
      showNotification('Purchase recorded successfully');
      return purchase;
    } catch (err) {
      showNotification(err.message, 'error');
      throw err;
    }
  }, [showNotification]);

  const updatePurchase = useCallback(async (id, data) => {
    try {
      const purchase = await api.updatePurchase(id, data);
      dispatch({ type: 'UPDATE_PURCHASE', payload: purchase });
      showNotification('Purchase updated successfully');
      return purchase;
    } catch (err) {
      showNotification(err.message, 'error');
      throw err;
    }
  }, [showNotification]);

  const deletePurchase = useCallback(async (id) => {
    try {
      await api.deletePurchase(id);
      dispatch({ type: 'REMOVE_PURCHASE', payload: id });
      showNotification('Purchase deleted successfully');
    } catch (err) {
      showNotification(err.message, 'error');
      throw err;
    }
  }, [showNotification]);

  const fetchSales = useCallback(async (params = {}) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const data = await api.getSales(params);
      dispatch({ type: 'SET_SALES', payload: data });
    } catch (err) {
      dispatch({ type: 'SET_ERROR', payload: err.message });
    }
  }, []);

  const createSale = useCallback(async (data) => {
    try {
      const sale = await api.createSale(data);
      dispatch({ type: 'ADD_SALE', payload: sale });
      showNotification('Sale recorded successfully');
      return sale;
    } catch (err) {
      showNotification(err.message, 'error');
      throw err;
    }
  }, [showNotification]);

  const updateSale = useCallback(async (id, data) => {
    try {
      const sale = await api.updateSale(id, data);
      dispatch({ type: 'UPDATE_SALE', payload: sale });
      showNotification('Sale updated successfully');
      return sale;
    } catch (err) {
      showNotification(err.message, 'error');
      throw err;
    }
  }, [showNotification]);

  const deleteSale = useCallback(async (id) => {
    try {
      await api.deleteSale(id);
      dispatch({ type: 'REMOVE_SALE', payload: id });
      showNotification('Sale deleted successfully');
    } catch (err) {
      showNotification(err.message, 'error');
      throw err;
    }
  }, [showNotification]);

  const fetchCategories = useCallback(async () => {
    try {
      const data = await api.getCategories();
      dispatch({ type: 'SET_CATEGORIES', payload: data });
    } catch (err) {
      dispatch({ type: 'SET_ERROR', payload: err.message });
    }
  }, []);

  const fetchDashboard = useCallback(async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const data = await api.getDashboard();
      dispatch({ type: 'SET_DASHBOARD', payload: data });
    } catch (err) {
      dispatch({ type: 'SET_ERROR', payload: err.message });
    }
  }, []);

  const value = {
    state,
    dispatch,
    actions: {
      fetchEmployees,
      createEmployee,
      updateEmployee,
      deleteEmployee,
      fetchPurchases,
      createPurchase,
      updatePurchase,
      deletePurchase,
      fetchSales,
      createSale,
      updateSale,
      deleteSale,
      fetchCategories,
      fetchDashboard,
      showNotification,
    },
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}

export default AppContext;
