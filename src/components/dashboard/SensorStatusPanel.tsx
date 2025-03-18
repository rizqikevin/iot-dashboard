import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { AlertCircle, CheckCircle, AlertTriangle } from "lucide-react";

type SensorStatus = "normal" | "warning" | "critical";

interface SensorData {
  id: string;
  name: string;
  value: number;
  unit: string;
  status: SensorStatus;
  threshold: {
    warning: number;
    critical: number;
  };
  lastUpdated: string;
}

interface SensorStatusPanelProps {
  sensors?: SensorData[];
}

const getStatusColor = (status: SensorStatus) => {
  switch (status) {
    case "normal":
      return "bg-green-500";
    case "warning":
      return "bg-yellow-500";
    case "critical":
      return "bg-red-500";
    default:
      return "bg-gray-500";
  }
};

const getStatusIcon = (status: SensorStatus) => {
  switch (status) {
    case "normal":
      return <CheckCircle className="h-5 w-5 text-green-500" />;
    case "warning":
      return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
    case "critical":
      return <AlertCircle className="h-5 w-5 text-red-500" />;
    default:
      return null;
  }
};

const SensorStatusPanel: React.FC<SensorStatusPanelProps> = ({
  sensors = [
    {
      id: "1",
      name: "Temperature Sensor",
      value: 24.5,
      unit: "°C",
      status: "normal",
      threshold: { warning: 30, critical: 35 },
      lastUpdated: new Date().toISOString(),
    },
    {
      id: "2",
      name: "Humidity Sensor",
      value: 65,
      unit: "%",
      status: "warning",
      threshold: { warning: 60, critical: 80 },
      lastUpdated: new Date().toISOString(),
    },
    {
      id: "3",
      name: "Pressure Sensor",
      value: 1013,
      unit: "hPa",
      status: "normal",
      threshold: { warning: 1030, critical: 1050 },
      lastUpdated: new Date().toISOString(),
    },
    {
      id: "4",
      name: "Air Quality Sensor",
      value: 150,
      unit: "AQI",
      status: "critical",
      threshold: { warning: 100, critical: 150 },
      lastUpdated: new Date().toISOString(),
    },
  ],
}) => {
  return (
    <div className="w-full bg-background p-4 rounded-lg shadow-sm">
      <h2 className="text-xl font-semibold mb-4">Sensor Status</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {sensors.map((sensor) => (
          <Card
            key={sensor.id}
            className="overflow-hidden border-l-4"
            style={{
              borderLeftColor:
                sensor.status === "normal"
                  ? "#10b981"
                  : sensor.status === "warning"
                    ? "#f59e0b"
                    : "#ef4444",
            }}
          >
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium text-sm">{sensor.name}</h3>
                  <div className="flex items-baseline mt-1">
                    <span className="text-2xl font-bold">{sensor.value}</span>
                    <span className="text-sm ml-1 text-muted-foreground">
                      {sensor.unit}
                    </span>
                  </div>
                </div>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="mt-1">{getStatusIcon(sensor.status)}</div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>
                        {sensor.status === "normal"
                          ? "Normal"
                          : sensor.status === "warning"
                            ? "Warning"
                            : "Critical"}
                      </p>
                      <p className="text-xs">
                        Thresholds: Warning {sensor.threshold.warning}
                        {sensor.unit}, Critical {sensor.threshold.critical}
                        {sensor.unit}
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <div className="mt-3 flex justify-between items-center">
                <Badge
                  variant={
                    sensor.status === "normal"
                      ? "outline"
                      : sensor.status === "warning"
                        ? "secondary"
                        : "destructive"
                  }
                >
                  {sensor.status === "normal"
                    ? "Normal"
                    : sensor.status === "warning"
                      ? "Warning"
                      : "Critical"}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  {new Date(sensor.lastUpdated).toLocaleTimeString()}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default SensorStatusPanel;
