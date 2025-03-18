import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon, RefreshCw } from "lucide-react";

interface ControlPanelProps {
  onTimeRangeChange?: (range: string) => void;
  onSensorFilterChange?: (sensors: string[]) => void;
  onViewToggleChange?: (view: string) => void;
  onRefresh?: () => void;
}

const ControlPanel = ({
  onTimeRangeChange = () => {},
  onSensorFilterChange = () => {},
  onViewToggleChange = () => {},
  onRefresh = () => {},
}: ControlPanelProps) => {
  const [timeRange, setTimeRange] = useState("1h");
  const [selectedSensors, setSelectedSensors] = useState([
    "sensor1",
    "sensor2",
    "sensor3",
    "sensor4",
  ]);
  const [view, setView] = useState("line");
  const [date, setDate] = useState<Date | undefined>(new Date());

  const handleTimeRangeChange = (value: string) => {
    setTimeRange(value);
    onTimeRangeChange(value);
  };

  const handleSensorToggle = (sensor: string) => {
    const updatedSensors = selectedSensors.includes(sensor)
      ? selectedSensors.filter((s) => s !== sensor)
      : [...selectedSensors, sensor];

    setSelectedSensors(updatedSensors);
    onSensorFilterChange(updatedSensors);
  };

  const handleViewChange = (value: string) => {
    setView(value);
    onViewToggleChange(value);
  };

  return (
    <Card className="w-full p-4 bg-background border shadow-sm">
      <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-6 md:items-center">
        {/* Time Range Selector */}
        <div className="flex-1 space-y-2">
          <h3 className="text-sm font-medium">Time Range</h3>
          <Tabs defaultValue="preset" className="w-full">
            <TabsList className="grid grid-cols-2 w-full">
              <TabsTrigger value="preset">Preset</TabsTrigger>
              <TabsTrigger value="custom">Custom</TabsTrigger>
            </TabsList>
            <TabsContent value="preset" className="space-y-2">
              <div className="grid grid-cols-4 gap-2 mt-2">
                {["15m", "1h", "6h", "24h"].map((range) => (
                  <Button
                    key={range}
                    variant={timeRange === range ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleTimeRangeChange(range)}
                  >
                    {range}
                  </Button>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="custom">
              <div className="flex items-center space-x-2 mt-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sensor Filter */}
        <div className="flex-1 space-y-2">
          <h3 className="text-sm font-medium">Sensors</h3>
          <div className="grid grid-cols-2 gap-2">
            {["sensor1", "sensor2", "sensor3", "sensor4"].map((sensor) => (
              <Button
                key={sensor}
                variant={
                  selectedSensors.includes(sensor) ? "default" : "outline"
                }
                size="sm"
                onClick={() => handleSensorToggle(sensor)}
              >
                {sensor.charAt(0).toUpperCase() + sensor.slice(1)}
              </Button>
            ))}
          </div>
        </div>

        {/* View Toggle */}
        <div className="flex-1 space-y-2">
          <h3 className="text-sm font-medium">Chart Type</h3>
          <Select value={view} onValueChange={handleViewChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select view" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="line">Line Chart</SelectItem>
              <SelectItem value="area">Area Chart</SelectItem>
              <SelectItem value="bar">Bar Chart</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Refresh Button */}
        <div className="flex items-end justify-end md:justify-center">
          <Button variant="outline" size="icon" onClick={onRefresh}>
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default ControlPanel;
