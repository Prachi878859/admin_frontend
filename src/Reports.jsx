import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../src/api/axiosInstance';

const Reports = () => {
  const [powerStations, setPowerStations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    totalStations: 0,
    plantTypeStats: {},
    criticalCount: 0,
    nonCriticalCount: 0,
    subcriticalCount: 0,
    supercriticalCount: 0,
    undefinedCount: 0
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredStations, setFilteredStations] = useState([]);
  const [activeTab, setActiveTab] = useState('all');
  const [selectedStation, setSelectedStation] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editFormData, setEditFormData] = useState(null);
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState(null);
  const [editSuccess, setEditSuccess] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPowerStations();
  }, []);

  useEffect(() => {
    filterStations();
  }, [powerStations, searchTerm, activeTab]);

  const fetchPowerStations = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await axiosInstance.get('/power-stations/');

      if (response.data && response.data.success) {
        const stationsData = response.data.data || [];
        setPowerStations(stationsData);
        setFilteredStations(stationsData);

        calculateStats(stationsData);
      } else {
        throw new Error(response.data?.message || 'Invalid API response');
      }
    } catch (err) {
      console.error('Error fetching power stations:', err);
      setError(err.response?.data?.message || 'Failed to load power station data. Please try again.');
      setPowerStations([]);
      setFilteredStations([]);
      setStats({
        totalStations: 0,
        plantTypeStats: {},
        criticalCount: 0,
        nonCriticalCount: 0,
        subcriticalCount: 0,
        supercriticalCount: 0,
        undefinedCount: 0
      });
    } finally {
      setLoading(false);
    }
  };

  const isStationCritical = useCallback((station) => {
    if (!station.critical_type) return false;

    const criticalType = station.critical_type.toLowerCase().trim();

    const criticalIndicators = ['critical', 'supercritical', 'subcritical'];
    const nonCriticalIndicators = ['non-critical', 'noncritical'];

    if (nonCriticalIndicators.includes(criticalType)) {
      return false;
    }

    if (criticalIndicators.includes(criticalType)) {
      return true;
    }

    return false;
  }, []);

  const calculateStats = useCallback((stations) => {
    const totalStations = stations.length;
    const plantTypeStats = {};
    let criticalCount = 0;
    let nonCriticalCount = 0;
    let subcriticalCount = 0;
    let supercriticalCount = 0;
    let undefinedCount = 0;

    stations.forEach(station => {
      const plantType = station.plant_type || 'Unknown';
      plantTypeStats[plantType] = (plantTypeStats[plantType] || 0) + 1;

      if (isStationCritical(station)) {
        criticalCount++;
      } else {
        nonCriticalCount++;
      }

      if (station.critical_type) {
        const critType = station.critical_type.toLowerCase().trim();
        if (critType === 'subcritical') {
          subcriticalCount++;
        } else if (critType === 'supercritical') {
          supercriticalCount++;
        }
      } else {
        undefinedCount++;
      }
    });

    nonCriticalCount = nonCriticalCount - undefinedCount;

    setStats({
      totalStations,
      plantTypeStats,
      criticalCount,
      nonCriticalCount,
      subcriticalCount,
      supercriticalCount,
      undefinedCount
    });
  }, [isStationCritical]);

  const filterStations = useCallback(() => {
    let filtered = [...powerStations];

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(station =>
        (station.power_station_name && station.power_station_name.toLowerCase().includes(term)) ||
        (station.plant_type && station.plant_type.toLowerCase().includes(term)) ||
        (station.critical_type && station.critical_type.toLowerCase().includes(term)) ||
        (station.pipe_dia_d2 && station.pipe_dia_d2.toString().includes(term)) ||
        (station.t2p && station.t2p.toString().includes(term))
      );
    }

    if (activeTab === 'critical') {
      filtered = filtered.filter(station => isStationCritical(station));
    } else if (activeTab === 'non-critical') {
      filtered = filtered.filter(station => !isStationCritical(station) && station.critical_type);
    } else if (activeTab === 'subcritical') {
      filtered = filtered.filter(station =>
        station.critical_type && station.critical_type.toLowerCase().trim() === 'subcritical'
      );
    } else if (activeTab === 'supercritical') {
      filtered = filtered.filter(station =>
        station.critical_type && station.critical_type.toLowerCase().trim() === 'supercritical'
      );
    }

    setFilteredStations(filtered);
  }, [powerStations, searchTerm, activeTab, isStationCritical]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const getCriticalTypeBadge = useCallback((station) => {
    if (!station.critical_type) {
      return {
        text: 'Not Defined',
        bgColor: 'bg-gray-100',
        textColor: 'text-gray-800',
        dotColor: 'bg-gray-400'
      };
    }

    const critType = station.critical_type.toLowerCase().trim();

    switch (critType) {
      case 'supercritical':
        return {
          text: 'Super Critical',
          bgColor: 'bg-red-100',
          textColor: 'text-red-800',
          dotColor: 'bg-red-500'
        };
      case 'subcritical':
        return {
          text: 'Sub Critical',
          bgColor: 'bg-orange-100',
          textColor: 'text-orange-800',
          dotColor: 'bg-orange-500'
        };
      case 'non-critical':
      case 'noncritical':
        return {
          text: 'Non-Critical',
          bgColor: 'bg-green-100',
          textColor: 'text-green-800',
          dotColor: 'bg-green-500'
        };
      case 'critical':
        return {
          text: 'Critical',
          bgColor: 'bg-red-100',
          textColor: 'text-red-800',
          dotColor: 'bg-red-500'
        };
      default:
        return {
          text: station.critical_type,
          bgColor: 'bg-blue-100',
          textColor: 'text-blue-800',
          dotColor: 'bg-blue-500'
        };
    }
  }, []);

  const formatCurrency = useCallback((value, currency) => {
    if (value === null || value === undefined || value === '') return 'N/A';

    const currencySymbols = {
      'USD': '$',
      'EUR': '€',
      'GBP': '£',
      'INR': '₹',
      'Euro': '€'
    };

    const symbol = currencySymbols[currency] || (currency === 'custom' ? '' : currency || '');

    const numValue = parseFloat(value);
    if (isNaN(numValue)) return 'N/A';

    return `${symbol}${numValue.toLocaleString('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}`;
  }, []);

  const formatNumber = useCallback((value) => {
    if (value === null || value === undefined || value === '') return 'N/A';

    const numValue = parseFloat(value);
    if (isNaN(numValue)) return 'N/A';

    return numValue.toLocaleString('en-IN');
  }, []);

  const formatPlantType = useCallback((type) => {
    if (!type) return 'N/A';

    const typeMap = {
      'coal_oil_fired': 'Coal/Oil Fired',
      'ccpp': 'Combined Cycle Power Plant',
      
    };

    return typeMap[type.toLowerCase()] || type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  }, []);

  const formatHeatRateUnit = useCallback((unit) => {
    if (!unit) return 'N/A';

    const unitMap = {
      'default': 'Default',
      'btu/kw-h': 'Btu/kW-h',
      'kj/kwh': 'kJ/kWh',
      
    };

    return unitMap[unit.toLowerCase()] || unit;
  }, []);

  const formatCurrencyName = useCallback((currency) => {
    if (!currency) return 'N/A';

    const currencyMap = {
      'USD': 'US Dollar',
      'EUR': 'Euro',
      
      'INR': 'Indian Rupee',
      'Euro': 'Euro',
      'custom': 'Custom Currency'
    };

    return currencyMap[currency] || currency;
  }, []);

  const handleRefresh = () => {
    fetchPowerStations();
  };

  const handleExport = () => {
    const csvContent = convertToCSV(powerStations);
    downloadCSV(csvContent, 'power-stations-report.csv');
  };

  const convertToCSV = useCallback((data) => {
    if (!data || !data.length) return '';

    const headers = Object.keys(data[0]).join(',');
    const rows = data.map(row =>
      Object.values(row).map(value =>
        value === null ? '' : `"${String(value).replace(/"/g, '""')}"`
      ).join(',')
    );

    return [headers, ...rows].join('\n');
  }, []);

  const downloadCSV = useCallback((content, filename) => {
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }, []);

  const handleViewDetails = (station) => {
    setSelectedStation(station);
    setShowDetailsModal(true);
  };

  const handleEditStation = (station) => {
    setSelectedStation(station);
    setEditFormData({
      power_station_name: station.power_station_name || '',
      plant_type: station.plant_type || '',
      critical_type: station.critical_type || '',
      plant_mcr: station.plant_mcr || '',
      t2p: station.t2p || '',
      pipe_dia_d2: station.pipe_dia_d2 || '',
      pipe_dia_unit: station.pipe_dia_unit || '',
      heat_rate_value: station.heat_rate_value || '',
      heat_rate_unit: station.heat_rate_unit || '',
      production_cost: station.production_cost || '',
      production_cost_currency: station.production_cost_currency || '',
      custom_currency: station.custom_currency || '',
      sell_price_per_mwh: station.sell_price_per_mwh || ''
    });
    setShowEditModal(true);
    setEditError(null);
    setEditSuccess(false);
  };

  const closeModal = () => {
    setShowDetailsModal(false);
    setSelectedStation(null);
  };

  const closeEditModal = () => {
    setShowEditModal(false);
    setEditFormData(null);
    setSelectedStation(null);
    setEditError(null);
    setEditSuccess(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedStation || !selectedStation.id) {
      setEditError('No station selected for editing');
      return;
    }

    try {
      setEditLoading(true);
      setEditError(null);
      
      // Prepare the data for submission
      const submitData = { ...editFormData };
      
      // Convert numeric fields to numbers if they exist
      const numericFields = ['plant_mcr', 't2p', 'pipe_dia_d2', 'heat_rate_value', 'production_cost', 'sell_price_per_mwh'];
      numericFields.forEach(field => {
        if (submitData[field]) {
          submitData[field] = parseFloat(submitData[field]);
        }
      });

      const response = await axiosInstance.put(
        `/power-stations/${selectedStation.id}`,
        submitData
      );

      if (response.data && response.data.success) {
        setEditSuccess(true);
        
        // Update the local state
        const updatedStations = powerStations.map(station =>
          station.id === selectedStation.id 
            ? { ...station, ...submitData }
            : station
        );
        
        setPowerStations(updatedStations);
        calculateStats(updatedStations);
        
        // Close modal after 2 seconds
        setTimeout(() => {
          closeEditModal();
        }, 2000);
      } else {
        throw new Error(response.data?.message || 'Failed to update power station');
      }
    } catch (err) {
      console.error('Error updating power station:', err);
      setEditError(err.response?.data?.message || 'Failed to update power station. Please try again.');
    } finally {
      setEditLoading(false);
    }
  };

  const getPercentage = (count) => {
    if (stats.totalStations === 0) return '0.0';
    return ((count / stats.totalStations) * 100).toFixed(1);
  };

  const statCards = [
    {
      title: 'Total Stations',
      value: stats.totalStations,
      color: 'bg-gradient-to-r from-blue-500 to-blue-600',
      icon: '🏭',
      description: 'All registered stations'
    },
    {
      title: 'Critical Stations',
      value: stats.criticalCount || 0,
      color: 'bg-gradient-to-r from-red-500 to-red-600',
      icon: '⚠️',
      description: 'Super/Sub Critical'
    },
    {
      title: 'Non-Critical',
      value: stats.nonCriticalCount || 0,
      color: 'bg-gradient-to-r from-green-500 to-green-600',
      icon: '✅',
      description: 'Normal operation'
    },
    {
      title: 'Super Critical',
      value: stats.supercriticalCount || 0,
      color: 'bg-gradient-to-r from-purple-500 to-purple-600',
      icon: '🔥',
      description: 'Super critical plants'
    }
  ];

  // Prevent background scroll when modals are open
  useEffect(() => {
    if (showDetailsModal || showEditModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showDetailsModal, showEditModal]);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Power Station Reports</h1>
            <p className="mt-2 text-gray-600">
              Overview and detailed analysis of all power stations
            </p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={handleExport}
              className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium flex items-center transition-colors duration-200"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Export CSV
            </button>
            <button
              onClick={handleRefresh}
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium flex items-center transition-colors duration-200"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Refresh
            </button>
          </div>
        </div>

        {error && (
          <div className="mt-4 px-4 py-3 text-sm text-red-600 bg-red-50 rounded-lg border border-red-100 flex items-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {error}
          </div>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {statCards.map((stat, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100"
          >
            <div className={`h-2 ${stat.color}`}></div>
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                  <div className="text-2xl font-bold text-gray-900 mt-1">
                    {loading ? (
                      <div className="h-8 w-16 bg-gray-200 rounded animate-pulse"></div>
                    ) : (
                      stat.value
                    )}
                  </div>
                  <p className="text-xs text-gray-400 mt-2">{stat.description}</p>
                </div>
                <div className={`p-3 rounded-full ${stat.color} bg-opacity-10`}>
                  <span className="text-2xl">{stat.icon}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleTabChange('all')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${activeTab === 'all'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
            >
              All Stations ({stats.totalStations || 0})
            </button>
            <button
              onClick={() => handleTabChange('critical')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${activeTab === 'critical'
                ? 'bg-red-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
            >
              Critical ({stats.criticalCount || 0})
            </button>
            <button
              onClick={() => handleTabChange('non-critical')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${activeTab === 'non-critical'
                ? 'bg-green-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
            >
              Non-Critical ({stats.nonCriticalCount || 0})
            </button>
            <button
              onClick={() => handleTabChange('subcritical')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${activeTab === 'subcritical'
                ? 'bg-orange-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
            >
              Sub Critical ({stats.subcriticalCount || 0})
            </button>
            <button
              onClick={() => handleTabChange('supercritical')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${activeTab === 'supercritical'
                ? 'bg-purple-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
            >
              Super Critical ({stats.supercriticalCount || 0})
            </button>
          </div>

          <div className="relative w-full md:w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearch}
              placeholder="Search stations, type, ID..."
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors duration-200"
            />
          </div>
        </div>
      </div>

      {/* Power Stations Table */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-xl font-bold text-gray-900">
            Power Stations List
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            {loading ? 'Loading...' : `Showing ${filteredStations.length} of ${powerStations.length} stations`}
          </p>
          {activeTab !== 'all' && (
            <p className="text-sm text-blue-600 mt-1">
              Filtered by: {activeTab.replace('-', ' ')}
            </p>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Power Station
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Plant Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Critical Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Plant MCR (MWh)
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  T2P
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Pipe Diameter
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                Array.from({ length: 5 }).map((_, index) => (
                  <tr key={index} className="animate-pulse">
                    <td className="px-6 py-4">
                      <div className="h-4 w-32 bg-gray-200 rounded"></div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="h-4 w-24 bg-gray-200 rounded"></div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="h-6 w-20 bg-gray-200 rounded-full"></div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="h-4 w-20 bg-gray-200 rounded"></div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="h-4 w-20 bg-gray-200 rounded"></div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="h-4 w-24 bg-gray-200 rounded"></div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="h-8 w-20 bg-gray-200 rounded"></div>
                    </td>
                  </tr>
                ))
              ) : filteredStations.length > 0 ? (
                filteredStations.map((station) => {
                  const badge = getCriticalTypeBadge(station);
                  return (
                    <tr
                      key={station.id}
                      className="hover:bg-gray-50 transition-colors duration-200"
                    >
                      <td className="px-6 py-4">
                        <div className="text-sm font-semibold text-gray-900">
                          {station.power_station_name || 'N/A'}
                        </div>
                        <div className="text-xs text-gray-500">
                          ID: {station.id}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-900">
                          {formatPlantType(station.plant_type)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${badge.bgColor} ${badge.textColor}`}>
                          <span className={`h-2 w-2 ${badge.dotColor} rounded-full mr-2`}></span>
                          {badge.text}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          {formatNumber(station.plant_mcr)}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          {formatNumber(station.t2p)}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          {station.pipe_dia_d2 || 'N/A'} {station.pipe_dia_unit || ''}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleViewDetails(station)}
                            className="text-blue-600 hover:text-blue-800 font-medium text-sm flex items-center transition-colors duration-200 hover:bg-blue-50 px-3 py-2 rounded-lg"
                          >
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                            View
                          </button>
                          <button
                            onClick={() => handleEditStation(station)}
                            className="text-green-600 hover:text-green-800 font-medium text-sm flex items-center transition-colors duration-200 hover:bg-green-50 px-3 py-2 rounded-lg"
                          >
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            Edit
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center">
                    <div className="text-gray-500">
                      <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                      <p className="text-lg font-medium">No power stations found</p>
                      <p className="mt-1">
                        {searchTerm || activeTab !== 'all'
                          ? 'Try changing your search or filter criteria'
                          : 'No power station data available'}
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer with summary */}
        {!loading && filteredStations.length > 0 && (
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2 text-sm text-gray-500">
              <div>
                Showing {filteredStations.length} stations
                {searchTerm && ` matching "${searchTerm}"`}
                {activeTab !== 'all' && ` (${activeTab.replace('-', ' ')})`}
              </div>
              <div className="text-right">
                <div className="font-medium text-gray-700">
                  Total Plant MCR: {formatNumber(
                    filteredStations.reduce((sum, station) =>
                      sum + (parseFloat(station.plant_mcr) || 0), 0
                    )
                  )} MWh
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  Average T2P: {formatNumber(
                    filteredStations.reduce((sum, station) =>
                      sum + (parseFloat(station.t2p) || 0), 0
                    ) / filteredStations.length
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Additional Statistics */}
      {!loading && powerStations.length > 0 && (
        <div className="bg-white rounded-xl shadow-lg mt-6 p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            Critical Type Distribution
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-red-50 rounded-lg p-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-red-700">Super Critical</span>
                <span className="text-lg font-bold text-red-600">{stats.supercriticalCount || 0}</span>
              </div>
              <div className="mt-2 text-xs text-red-500">
                {getPercentage(stats.supercriticalCount)}% of total
              </div>
            </div>

            <div className="bg-orange-50 rounded-lg p-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-orange-700">Sub Critical</span>
                <span className="text-lg font-bold text-orange-600">{stats.subcriticalCount || 0}</span>
              </div>
              <div className="mt-2 text-xs text-orange-500">
                {getPercentage(stats.subcriticalCount)}% of total
              </div>
            </div>

            <div className="bg-green-50 rounded-lg p-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-green-700">Non-Critical</span>
                <span className="text-lg font-bold text-green-600">{stats.nonCriticalCount || 0}</span>
              </div>
              <div className="mt-2 text-xs text-green-500">
                {getPercentage(stats.nonCriticalCount)}% of total
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">Not Defined</span>
                <span className="text-lg font-bold text-gray-600">{stats.undefinedCount || 0}</span>
              </div>
              <div className="mt-2 text-xs text-gray-500">
                {getPercentage(stats.undefinedCount)}% of total
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Station Details Modal */}
      {showDetailsModal && selectedStation && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 z-50" onClick={closeModal}>
          <div 
            className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden transform transition-all duration-300 scale-100 opacity-100"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="px-8 py-6 bg-gradient-to-r from-blue-500 to-blue-600">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-2xl font-bold text-white">
                    {selectedStation.power_station_name || 'Power Station Details'}
                  </h3>
                  <p className="text-blue-100 text-sm mt-1">
                    • Complete Details
                  </p>
                </div>
                <button
                  onClick={closeModal}
                  className="text-white hover:text-gray-200 transition-colors duration-200 p-2 rounded-full hover:bg-blue-600"
                  aria-label="Close"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="px-8 py-6 bg-gray-50 overflow-y-auto max-h-[calc(90vh-120px)]">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Column 1: Basic Information */}
                <div className="space-y-4">
                  {/* Station Information Card */}
                  <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
                    <h4 className="font-semibold text-gray-900 mb-4 pb-3 border-b border-gray-200 flex items-center">
                      <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                      Station Information
                    </h4>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Station Name:</span>
                        <span className="text-sm font-medium text-gray-900 bg-gray-50 px-3 py-1 rounded-lg">
                          {selectedStation.power_station_name || 'N/A'}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Plant Type:</span>
                        <span className="text-sm font-medium text-gray-900">
                          {formatPlantType(selectedStation.plant_type)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Critical Type:</span>
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getCriticalTypeBadge(selectedStation).bgColor} ${getCriticalTypeBadge(selectedStation).textColor}`}>
                          <span className={`h-2 w-2 ${getCriticalTypeBadge(selectedStation).dotColor} rounded-full mr-2`}></span>
                          {getCriticalTypeBadge(selectedStation).text}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Capacity Information Card */}
                  <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
                    <h4 className="font-semibold text-gray-900 mb-4 pb-3 border-b border-gray-200 flex items-center">
                      <svg className="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                      </svg>
                      Capacity Information
                    </h4>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Plant MCR:</span>
                        <span className="text-sm font-medium text-gray-900">
                          {formatNumber(selectedStation.plant_mcr)} MWh
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">T2P:</span>
                        <span className="text-sm font-medium text-gray-900">
                          {formatNumber(selectedStation.t2p)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Heat Rate Value:</span>
                        <span className="text-sm font-medium text-gray-900">
                          {formatNumber(selectedStation.heat_rate_value)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Heat Rate Unit:</span>
                        <span className="text-sm font-medium text-gray-900">
                          {formatHeatRateUnit(selectedStation.heat_rate_unit)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Column 2: Technical Specifications */}
                <div className="space-y-4">
                  {/* Pipe Information Card */}
                  <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
                    <h4 className="font-semibold text-gray-900 mb-4 pb-3 border-b border-gray-200 flex items-center">
                      <svg className="w-5 h-5 mr-2 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                      Technical Specifications
                    </h4>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Pipe Diameter (D2):</span>
                        <span className="text-sm font-medium text-gray-900 bg-gray-50 px-3 py-1 rounded-lg">
                          {selectedStation.pipe_dia_d2 || 'N/A'}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Pipe Diameter Unit:</span>
                        <span className="text-sm font-medium text-gray-900">
                          {selectedStation.pipe_dia_unit || 'N/A'}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">T2P:</span>
                        <span className="text-sm font-medium text-gray-900">
                          {formatNumber(selectedStation.t2p)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Heat Rate (Value):</span>
                        <span className="text-sm font-medium text-gray-900">
                          {formatNumber(selectedStation.heat_rate_value)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Currency Information Card */}
                  <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
                    <h4 className="font-semibold text-gray-900 mb-4 pb-3 border-b border-gray-200 flex items-center">
                      <svg className="w-5 h-5 mr-2 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Currency Information
                    </h4>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Production Currency:</span>
                        <span className="text-sm font-medium text-gray-900 bg-yellow-50 px-3 py-1 rounded-lg">
                          {formatCurrencyName(selectedStation.production_cost_currency)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Currency Code:</span>
                        <span className="text-sm font-medium text-gray-900">
                          {selectedStation.production_cost_currency || 'N/A'}
                        </span>
                      </div>
                      {selectedStation.custom_currency && selectedStation.production_cost_currency === 'custom' && (
                        <div className="bg-blue-50 p-3 rounded-lg">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-blue-700">Custom Currency:</span>
                            <span className="text-sm font-medium text-blue-800">
                              {selectedStation.custom_currency}
                            </span>
                          </div>
                        </div>
                      )}
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Currency Type:</span>
                        <span className="text-sm font-medium text-gray-900">
                          {selectedStation.production_cost_currency === 'custom' ? 'Custom' : 'Standard'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Column 3: Financial Information */}
                <div className="space-y-4">
                  {/* Production Cost Information */}
                  <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
                    <h4 className="font-semibold text-gray-900 mb-4 pb-3 border-b border-gray-200 flex items-center">
                      <svg className="w-5 h-5 mr-2 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                      Financial Information
                    </h4>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Production Cost:</span>
                        <span className="text-sm font-medium text-red-600 bg-red-50 px-3 py-1 rounded-lg">
                          {formatCurrency(selectedStation.production_cost, selectedStation.production_cost_currency)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Sell Price per MWh:</span>
                        <span className="text-sm font-medium text-green-600 bg-green-50 px-3 py-1 rounded-lg">
                          {formatCurrency(selectedStation.sell_price_per_mwh, selectedStation.production_cost_currency)}
                        </span>
                      </div>
                      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-100">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-blue-700">Margin per MWh:</span>
                          <span className={`text-sm font-bold ${parseFloat(selectedStation.sell_price_per_mwh || 0) > parseFloat(selectedStation.production_cost || 0)
                            ? 'text-green-600'
                            : 'text-red-600'
                            }`}>
                            {formatCurrency(
                              (parseFloat(selectedStation.sell_price_per_mwh || 0) - parseFloat(selectedStation.production_cost || 0)),
                              selectedStation.production_cost_currency
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Quick Stats Card */}
                  <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl shadow-sm p-5 border border-gray-200">
                    <h4 className="font-semibold text-gray-900 mb-4 pb-3 border-b border-gray-200">
                      Quick Summary
                    </h4>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-white p-3 rounded-lg shadow-sm">
                        <div className="text-xs text-gray-500">Plant Type</div>
                        <div className="text-sm font-medium text-gray-900 mt-1 truncate">
                          {formatPlantType(selectedStation.plant_type)}
                        </div>
                      </div>
                      <div className="bg-white p-3 rounded-lg shadow-sm">
                        <div className="text-xs text-gray-500">Critical Status</div>
                        <div className={`text-xs font-medium mt-1 ${getCriticalTypeBadge(selectedStation).textColor}`}>
                          {getCriticalTypeBadge(selectedStation).text}
                        </div>
                      </div>
                      <div className="bg-white p-3 rounded-lg shadow-sm">
                        <div className="text-xs text-gray-500">Capacity (MCR)</div>
                        <div className="text-sm font-medium text-gray-900 mt-1">
                          {formatNumber(selectedStation.plant_mcr)}
                        </div>
                      </div>
                      <div className="bg-white p-3 rounded-lg shadow-sm">
                        <div className="text-xs text-gray-500">Currency</div>
                        <div className="text-sm font-medium text-gray-900 mt-1 truncate">
                          {selectedStation.production_cost_currency === 'custom'
                            ? selectedStation.custom_currency || 'Custom'
                            : selectedStation.production_cost_currency || 'N/A'
                          }
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div className="text-sm text-gray-500 flex items-center">
                    <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Last updated: {new Date().toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={closeModal}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200 flex items-center"
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      Close
                    </button>
                    <button
                      onClick={() => handleEditStation(selectedStation)}
                      className="px-4 py-2 text-sm font-medium text-white bg-green-500 hover:bg-green-600 rounded-lg transition-colors duration-200 flex items-center"
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      Edit Station
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Station Modal */}
      {showEditModal && editFormData && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 z-50" onClick={closeEditModal}>
          <div 
            className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden transform transition-all duration-300 scale-100 opacity-100"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="px-8 py-6 bg-gradient-to-r from-green-500 to-green-600">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-2xl font-bold text-white">
                    Edit Power Station
                  </h3>
                  <p className="text-green-100 text-sm mt-1">
                    • Update station information • ID: {selectedStation?.id}
                  </p>
                </div>
                <button
                  onClick={closeEditModal}
                  className="text-white hover:text-gray-200 transition-colors duration-200 p-2 rounded-full hover:bg-green-600"
                  aria-label="Close"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Content */}
            <form onSubmit={handleEditSubmit}>
              <div className="px-8 py-6 bg-gray-50 overflow-y-auto max-h-[calc(90vh-120px)]">
                {editSuccess && (
                  <div className="mb-6 px-4 py-3 text-sm text-green-700 bg-green-50 rounded-lg border border-green-200 flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Power station updated successfully! Closing in 2 seconds...
                  </div>
                )}

                {editError && (
                  <div className="mb-6 px-4 py-3 text-sm text-red-700 bg-red-50 rounded-lg border border-red-200 flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {editError}
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Left Column */}
                  <div className="space-y-6">
                    {/* Station Information */}
                    <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
                      <h4 className="font-semibold text-gray-900 mb-4 pb-3 border-b border-gray-200 flex items-center">
                        <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                        Station Information
                      </h4>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Station Name *
                          </label>
                          <input
                            type="text"
                            name="power_station_name"
                            value={editFormData.power_station_name}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors duration-200"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Plant Type *
                          </label>
                          <select
                            name="plant_type"
                            value={editFormData.plant_type}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors duration-200"
                            required
                          >
                            <option value="">Select Plant Type</option>
                            <option value="coal_oil_fired">Coal/Oil Fired</option>
                            <option value="ccpp">Combined Cycle Power Plant</option>
                           
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Critical Type *
                          </label>
                          <select
                            name="critical_type"
                            value={editFormData.critical_type}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors duration-200"
                            required
                          >
                            <option value="">Select Critical Type</option>
                            <option value="supercritical">Super Critical</option>
                            <option value="subcritical">Sub Critical</option>
                            <option value="critical">Critical</option>
                            <option value="non-critical">Non-Critical</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* Capacity Information */}
                    <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
                      <h4 className="font-semibold text-gray-900 mb-4 pb-3 border-b border-gray-200 flex items-center">
                        <svg className="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                        </svg>
                        Capacity Information
                      </h4>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Plant MCR (MWh) *
                          </label>
                          <input
                            type="number"
                            step="0.01"
                            name="plant_mcr"
                            value={editFormData.plant_mcr}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors duration-200"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            T2P *
                          </label>
                          <input
                            type="number"
                            step="0.01"
                            name="t2p"
                            value={editFormData.t2p}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors duration-200"
                            required
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="space-y-6">
                    {/* Technical Specifications */}
                    <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
                      <h4 className="font-semibold text-gray-900 mb-4 pb-3 border-b border-gray-200 flex items-center">
                        <svg className="w-5 h-5 mr-2 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                        Technical Specifications
                      </h4>
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Pipe Diameter (D2)
                            </label>
                            <input
                              type="number"
                              step="0.01"
                              name="pipe_dia_d2"
                              value={editFormData.pipe_dia_d2}
                              onChange={handleInputChange}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors duration-200"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Pipe Unit
                            </label>
                            <input
                              type="text"
                              name="pipe_dia_unit"
                              value={editFormData.pipe_dia_unit}
                              onChange={handleInputChange}
                              placeholder="e.g., mm, inches"
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors duration-200"
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Heat Rate Value
                            </label>
                            <input
                              type="number"
                              step="0.01"
                              name="heat_rate_value"
                              value={editFormData.heat_rate_value}
                              onChange={handleInputChange}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors duration-200"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Heat Rate Unit
                            </label>
                            <select
                              name="heat_rate_unit"
                              value={editFormData.heat_rate_unit}
                              onChange={handleInputChange}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors duration-200"
                            >
                              <option value="">Select Unit</option>
                              <option value="btu/kw-h">Btu/kW-h</option>
                              <option value="kj/kwh">kJ/kWh</option>
                              
                              <option value="default">Default</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Financial Information */}
                    <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
                      <h4 className="font-semibold text-gray-900 mb-4 pb-3 border-b border-gray-200 flex items-center">
                        <svg className="w-5 h-5 mr-2 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Financial Information
                      </h4>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Production Cost *
                          </label>
                          <input
                            type="number"
                            step="0.01"
                            name="production_cost"
                            value={editFormData.production_cost}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors duration-200"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Production Cost Currency *
                          </label>
                          <select
                            name="production_cost_currency"
                            value={editFormData.production_cost_currency}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors duration-200"
                            required
                          >
                            <option value="">Select Currency</option>
                            <option value="USD">US Dollar (USD)</option>
                            <option value="EUR">Euro (EUR)</option>
                            
                            <option value="INR">Indian Rupee (INR)</option>
                            <option value="custom">Custom Currency</option>
                          </select>
                        </div>
                        {editFormData.production_cost_currency === 'custom' && (
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Custom Currency Name
                            </label>
                            <input
                              type="text"
                              name="custom_currency"
                              value={editFormData.custom_currency}
                              onChange={handleInputChange}
                              placeholder="Enter custom currency name"
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors duration-200"
                            />
                          </div>
                        )}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Sell Price per MWh *
                          </label>
                          <input
                            type="number"
                            step="0.01"
                            name="sell_price_per_mwh"
                            value={editFormData.sell_price_per_mwh}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors duration-200"
                            required
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="text-sm text-gray-500">
                      Fields marked with * are required
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={closeEditModal}
                        disabled={editLoading}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200 flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={editLoading}
                        className="px-4 py-2 text-sm font-medium text-white bg-green-500 hover:bg-green-600 rounded-lg transition-colors duration-200 flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {editLoading ? (
                          <>
                            <svg className="w-4 h-4 mr-2 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            Updating...
                          </>
                        ) : (
                          <>
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                            </svg>
                            Update Station
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reports;