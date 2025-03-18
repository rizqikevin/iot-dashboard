import React, { useState, useEffect } from "react";
import Header from "./dashboard/Header";
import SensorStatusPanel from "./dashboard/SensorStatusPanel";
import VisualizationPanel from "./dashboard/VisualizationPanel";
import ControlPanel from "./dashboard/ControlPanel";
import InfoSidebar from "./dashboard/InfoSidebar";
import AlertSystem from "./dashboard/AlertSystem";
import { useToast } from "../components/ui/use-toast";

const Home = () => {
  const { toast } = useToast();
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [timeRange, setTimeRange] = useState("24h");
  const [selectedSensors, setSelectedSensors] = useState([
    "sensor1",
    "sensor2",
    "sensor3",
    "sensor4",
  ]);
  const [viewType, setViewType] = useState("line");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [alertsEnabled, setAlertsEnabled] = useState(true);

  // Mock data for sensors
  const [sensors] = useState([
    { id: "temp", name: "Temperature", unit: "°C", color: "#FF6384" },
    { id: "humidity", name: "Humidity", unit: "%", color: "#36A2EB" },
    { id: "pressure", name: "Pressure", unit: "hPa", color: "#FFCE56" },
    { id: "air", name: "Air Quality", unit: "AQI", color: "#4BC0C0" },
  ]);

  // Mock alerts
  const [alerts, setAlerts] = useState([
    {
      id: "1",
      sensorId: "sensor-1",
      sensorName: "Temperature Sensor",
      message: "Temperature exceeds threshold (28°C)",
      timestamp: new Date(Date.now() - 1000 * 60 * 5),
      priority: "high",
      read: false,
    },
    {
      id: "2",
      sensorId: "sensor-2",
      sensorName: "Humidity Sensor",
      message: "Humidity level warning (85%)",
      timestamp: new Date(Date.now() - 1000 * 60 * 15),
      priority: "medium",
      read: false,
    },
  ]);

  // Toggle dark mode
  const handleDarkModeToggle = () => {
    setIsDarkMode(!isDarkMode);
    // In a real app, you would apply the theme change to the document here
    document.documentElement.classList.toggle("dark");
  };

  // Handle time range change
  const handleTimeRangeChange = (range) => {
    setTimeRange(range);
    toast({
      title: "Time Range Updated",
      description: `Displaying data for the last ${range}`,
    });
  };

  // Handle sensor filter change
  const handleSensorFilterChange = (sensors) => {
    setSelectedSensors(sensors);
  };

  // Handle view toggle change
  const handleViewToggleChange = (view) => {
    setViewType(view);
  };

  // Handle refresh
  const handleRefresh = () => {
    toast({
      title: "Refreshing Data",
      description: "Fetching latest sensor readings...",
    });
    // In a real app, you would fetch new data here
  };

  // Handle sidebar collapse toggle
  const handleSidebarToggle = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  // Handle alert dismissal
  const handleDismissAlert = (id) => {
    setAlerts(alerts.filter((alert) => alert.id !== id));
  };

  // Handle marking alert as read
  const handleReadAlert = (id) => {
    setAlerts(
      alerts.map((alert) =>
        alert.id === id ? { ...alert, read: true } : alert,
      ),
    );
  };

  // Handle clearing all alerts
  const handleClearAllAlerts = () => {
    setAlerts([]);
  };

  // Handle toggling alerts
  const handleToggleAlerts = (enabled) => {
    setAlertsEnabled(enabled);
  };

  // Apply dark mode on initial load
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Header */}
      <Header isDarkMode={isDarkMode} onDarkModeToggle={handleDarkModeToggle} />

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Main Dashboard Area */}
        <div className="flex-1 flex flex-col overflow-y-auto p-4 space-y-4">
          {/* Sensor Status Panel */}
          <SensorStatusPanel />

          {/* Control Panel */}
          <ControlPanel
            onTimeRangeChange={handleTimeRangeChange}
            onSensorFilterChange={handleSensorFilterChange}
            onViewToggleChange={handleViewToggleChange}
            onRefresh={handleRefresh}
          />

          {/* Visualization Panel */}
          <VisualizationPanel sensors={sensors} timeRange={timeRange} />

          {/* Alert System */}
          <div className="mt-4">
            <AlertSystem
              alerts={alerts}
              onDismissAlert={handleDismissAlert}
              onReadAlert={handleReadAlert}
              onClearAllAlerts={handleClearAllAlerts}
              onToggleAlerts={handleToggleAlerts}
            />
          </div>
        </div>

        {/* Info Sidebar */}
        <InfoSidebar
          isCollapsed={sidebarCollapsed}
          onToggleCollapse={handleSidebarToggle}
        />
      </div>
    </div>
  );
};

export default Home;
