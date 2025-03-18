import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/ui/tabs";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface SensorData {
  timestamp: string;
  value: number;
  sensorId: string;
}

interface SensorInfo {
  id: string;
  name: string;
  unit: string;
  color: string;
}

interface VisualizationPanelProps {
  sensorData?: Record<string, SensorData[]>;
  sensors?: SensorInfo[];
  timeRange?: string;
}

const generateMockData = (sensorId: string, count: number = 24) => {
  const now = new Date();
  const data: SensorData[] = [];

  for (let i = count - 1; i >= 0; i--) {
    const timestamp = new Date(now.getTime() - i * 3600000).toISOString();
    const value =
      Math.random() * 100 +
      (sensorId === "temp"
        ? 20
        : sensorId === "humidity"
          ? 40
          : sensorId === "pressure"
            ? 1000
            : 5);
    data.push({ timestamp, value, sensorId });
  }

  return data;
};

const defaultSensors: SensorInfo[] = [
  { id: "temp", name: "Temperature", unit: "°C", color: "#FF6384" },
  { id: "humidity", name: "Humidity", unit: "%", color: "#36A2EB" },
  { id: "pressure", name: "Pressure", unit: "hPa", color: "#FFCE56" },
  { id: "light", name: "Light", unit: "lux", color: "#4BC0C0" },
];

const VisualizationPanel: React.FC<VisualizationPanelProps> = ({
  sensorData = {},
  sensors = defaultSensors,
  timeRange = "24h",
}) => {
  const [activeTab, setActiveTab] = useState("all");
  const [chartData, setChartData] = useState<any[]>([]);

  // Generate mock data if no data is provided
  useEffect(() => {
    if (Object.keys(sensorData).length === 0) {
      const mockData: Record<string, SensorData[]> = {};
      sensors.forEach((sensor) => {
        mockData[sensor.id] = generateMockData(sensor.id);
      });

      // Combine data for the chart
      const combinedData: any[] = [];
      const timePoints = mockData[sensors[0].id].map((d) => d.timestamp);

      timePoints.forEach((time, index) => {
        const dataPoint: any = {
          timestamp: new Date(time).toLocaleTimeString(),
        };
        sensors.forEach((sensor) => {
          dataPoint[sensor.id] = mockData[sensor.id][index].value;
        });
        combinedData.push(dataPoint);
      });

      setChartData(combinedData);
    }
  }, [sensorData, sensors]);

  return (
    <Card className="w-full h-full bg-background border-border">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-semibold text-foreground">
          Real-time Sensor Data
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <Tabs
          defaultValue="all"
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="grid grid-cols-5 w-full max-w-md">
            <TabsTrigger value="all">All Sensors</TabsTrigger>
            {sensors.map((sensor) => (
              <TabsTrigger key={sensor.id} value={sensor.id}>
                {sensor.name}
              </TabsTrigger>
            ))}
          </TabsList>
          <div className="w-full h-[450px] bg-card rounded-md p-2 mt-4">
            <TabsContent value="all" className="h-full mt-0">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={chartData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#444"
                    opacity={0.2}
                  />
                  <XAxis dataKey="timestamp" stroke="#888" />
                  <YAxis stroke="#888" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(24, 24, 27, 0.9)",
                      borderColor: "#333",
                      color: "#fff",
                    }}
                    labelStyle={{ color: "#fff" }}
                  />
                  <Legend />
                  {sensors.map((sensor) => (
                    <Line
                      key={sensor.id}
                      type="monotone"
                      dataKey={sensor.id}
                      name={`${sensor.name} (${sensor.unit})`}
                      stroke={sensor.color}
                      activeDot={{ r: 8 }}
                      strokeWidth={2}
                      dot={false}
                      animationDuration={500}
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </TabsContent>

            {sensors.map((sensor) => (
              <TabsContent
                key={sensor.id}
                value={sensor.id}
                className="h-full mt-0"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={chartData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="#444"
                      opacity={0.2}
                    />
                    <XAxis dataKey="timestamp" stroke="#888" />
                    <YAxis stroke="#888" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "rgba(24, 24, 27, 0.9)",
                        borderColor: "#333",
                        color: "#fff",
                      }}
                      labelStyle={{ color: "#fff" }}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey={sensor.id}
                      name={`${sensor.name} (${sensor.unit})`}
                      stroke={sensor.color}
                      activeDot={{ r: 8 }}
                      strokeWidth={2}
                      animationDuration={500}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </TabsContent>
            ))}
          </div>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default VisualizationPanel;
