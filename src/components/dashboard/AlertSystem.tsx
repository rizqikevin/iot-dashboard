import React, { useState, useEffect } from "react";
import { AlertCircle, Bell, BellOff, Info, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "../ui/button";
import { Switch } from "../ui/switch";
import { Badge } from "../ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";

interface Alert {
  id: string;
  sensorId: string;
  sensorName: string;
  message: string;
  timestamp: Date;
  priority: "low" | "medium" | "high";
  read: boolean;
}

interface AlertSystemProps {
  alerts?: Alert[];
  onDismissAlert?: (id: string) => void;
  onReadAlert?: (id: string) => void;
  onClearAllAlerts?: () => void;
  onToggleAlerts?: (enabled: boolean) => void;
}

const AlertSystem: React.FC<AlertSystemProps> = ({
  alerts = [
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
    {
      id: "3",
      sensorId: "sensor-3",
      sensorName: "Pressure Sensor",
      message: "Pressure level normal",
      timestamp: new Date(Date.now() - 1000 * 60 * 30),
      priority: "low",
      read: true,
    },
  ],
  onDismissAlert = () => {},
  onReadAlert = () => {},
  onClearAllAlerts = () => {},
  onToggleAlerts = () => {},
}) => {
  const [alertsEnabled, setAlertsEnabled] = useState(true);
  const [showToast, setShowToast] = useState(false);
  const [currentToast, setCurrentToast] = useState<Alert | null>(null);

  // Show toast notification for new high priority alerts
  useEffect(() => {
    const unreadHighPriorityAlerts = alerts.filter(
      (alert) => alert.priority === "high" && !alert.read,
    );

    if (unreadHighPriorityAlerts.length > 0 && alertsEnabled) {
      setCurrentToast(unreadHighPriorityAlerts[0]);
      setShowToast(true);

      // Auto-dismiss toast after 5 seconds
      const timer = setTimeout(() => {
        setShowToast(false);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [alerts, alertsEnabled]);

  const handleToggleAlerts = (enabled: boolean) => {
    setAlertsEnabled(enabled);
    onToggleAlerts(enabled);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-500";
      case "medium":
        return "bg-yellow-500";
      case "low":
        return "bg-green-500";
      default:
        return "bg-blue-500";
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const unreadCount = alerts.filter((alert) => !alert.read).length;

  return (
    <div className="bg-slate-900 p-4 rounded-lg shadow-lg w-full">
      {/* Alert System Header */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-2">
          <Bell className="h-5 w-5 text-yellow-500" />
          <h3 className="text-lg font-semibold text-white">Alert System</h3>
          {unreadCount > 0 && (
            <Badge variant="destructive" className="ml-2">
              {unreadCount}
            </Badge>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-300">
            {alertsEnabled ? "Alerts On" : "Alerts Off"}
          </span>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Switch
                  checked={alertsEnabled}
                  onCheckedChange={handleToggleAlerts}
                  className="data-[state=checked]:bg-green-500"
                />
              </TooltipTrigger>
              <TooltipContent>
                <p>{alertsEnabled ? "Disable alerts" : "Enable alerts"}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      {/* Toast Notification */}
      <AnimatePresence>
        {showToast && currentToast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`mb-4 p-3 rounded-md shadow-md flex items-start justify-between ${getPriorityColor(currentToast.priority)} text-white`}
          >
            <div className="flex items-start space-x-2">
              <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">{currentToast.sensorName}</p>
                <p className="text-sm">{currentToast.message}</p>
                <p className="text-xs opacity-80 mt-1">
                  {formatTime(currentToast.timestamp)}
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowToast(false)}
              className="text-white hover:text-gray-200"
            >
              <X className="h-4 w-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Alert List */}
      <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
        {alerts.length === 0 ? (
          <div className="text-center py-6 text-gray-400">
            <Info className="h-8 w-8 mx-auto mb-2" />
            <p>No alerts to display</p>
          </div>
        ) : (
          alerts.map((alert) => (
            <div
              key={alert.id}
              className={`p-3 rounded-md ${alert.read ? "bg-slate-800" : "bg-slate-700"} hover:bg-slate-700 transition-colors flex justify-between items-start`}
            >
              <div className="flex items-start space-x-3">
                <div
                  className={`h-3 w-3 rounded-full mt-1.5 ${getPriorityColor(alert.priority)}`}
                />
                <div>
                  <p className="font-medium text-white">{alert.sensorName}</p>
                  <p className="text-sm text-gray-300">{alert.message}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {formatTime(alert.timestamp)}
                  </p>
                </div>
              </div>
              <div className="flex space-x-1">
                {!alert.read && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 px-2 text-gray-400 hover:text-white"
                    onClick={() => onReadAlert(alert.id)}
                  >
                    <span className="sr-only">Mark as read</span>
                    <Info className="h-4 w-4" />
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 px-2 text-gray-400 hover:text-white"
                  onClick={() => onDismissAlert(alert.id)}
                >
                  <span className="sr-only">Dismiss</span>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Alert Actions */}
      {alerts.length > 0 && (
        <div className="mt-4 flex justify-between">
          <Button
            variant="outline"
            size="sm"
            className="text-xs"
            onClick={() => onClearAllAlerts()}
          >
            Clear All
          </Button>
          <div className="flex items-center space-x-2 text-xs text-gray-400">
            <span className="flex items-center">
              <div className="h-2 w-2 rounded-full bg-red-500 mr-1"></div> High
            </span>
            <span className="flex items-center">
              <div className="h-2 w-2 rounded-full bg-yellow-500 mr-1"></div>{" "}
              Medium
            </span>
            <span className="flex items-center">
              <div className="h-2 w-2 rounded-full bg-green-500 mr-1"></div> Low
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default AlertSystem;
