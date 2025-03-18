import React, { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  AlertCircle,
  Info,
} from "lucide-react";

interface LogEntry {
  id: string;
  timestamp: Date;
  sensorId: string;
  message: string;
  type: "info" | "warning" | "error";
}

interface NotificationEntry {
  id: string;
  timestamp: Date;
  title: string;
  description: string;
  priority: "low" | "medium" | "high";
  read: boolean;
}

interface InfoSidebarProps {
  logs?: LogEntry[];
  notifications?: NotificationEntry[];
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

const InfoSidebar = ({
  logs = [
    {
      id: "1",
      timestamp: new Date(Date.now() - 1000 * 60 * 5),
      sensorId: "sensor-1",
      message: "Temperature reading normal",
      type: "info",
    },
    {
      id: "2",
      timestamp: new Date(Date.now() - 1000 * 60 * 10),
      sensorId: "sensor-2",
      message: "Humidity above threshold",
      type: "warning",
    },
    {
      id: "3",
      timestamp: new Date(Date.now() - 1000 * 60 * 15),
      sensorId: "sensor-3",
      message: "Pressure sensor offline",
      type: "error",
    },
    {
      id: "4",
      timestamp: new Date(Date.now() - 1000 * 60 * 20),
      sensorId: "sensor-4",
      message: "CO2 levels normal",
      type: "info",
    },
    {
      id: "5",
      timestamp: new Date(Date.now() - 1000 * 60 * 25),
      sensorId: "sensor-1",
      message: "Temperature reading stable",
      type: "info",
    },
  ],
  notifications = [
    {
      id: "1",
      timestamp: new Date(Date.now() - 1000 * 60 * 3),
      title: "System Alert",
      description: "Sensor 2 humidity levels require attention",
      priority: "medium",
      read: false,
    },
    {
      id: "2",
      timestamp: new Date(Date.now() - 1000 * 60 * 12),
      title: "Critical Alert",
      description: "Sensor 3 connection lost",
      priority: "high",
      read: false,
    },
    {
      id: "3",
      timestamp: new Date(Date.now() - 1000 * 60 * 30),
      title: "Maintenance",
      description: "Scheduled system update in 2 hours",
      priority: "low",
      read: true,
    },
    {
      id: "4",
      timestamp: new Date(Date.now() - 1000 * 60 * 45),
      title: "Information",
      description: "Daily report generated successfully",
      priority: "low",
      read: true,
    },
  ],
  isCollapsed = false,
  onToggleCollapse = () => {},
}: InfoSidebarProps) => {
  const [activeTab, setActiveTab] = useState("logs");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString([], { month: "short", day: "numeric" });
  };

  const sortedLogs = [...logs].sort((a, b) => {
    return sortOrder === "desc"
      ? b.timestamp.getTime() - a.timestamp.getTime()
      : a.timestamp.getTime() - b.timestamp.getTime();
  });

  const sortedNotifications = [...notifications].sort((a, b) => {
    return sortOrder === "desc"
      ? b.timestamp.getTime() - a.timestamp.getTime()
      : a.timestamp.getTime() - b.timestamp.getTime();
  });

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === "desc" ? "asc" : "desc");
  };

  const getLogTypeColor = (type: string) => {
    switch (type) {
      case "info":
        return "bg-blue-500";
      case "warning":
        return "bg-yellow-500";
      case "error":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "low":
        return (
          <Badge
            variant="outline"
            className="bg-blue-100 text-blue-800 border-blue-200"
          >
            Low
          </Badge>
        );
      case "medium":
        return (
          <Badge
            variant="outline"
            className="bg-yellow-100 text-yellow-800 border-yellow-200"
          >
            Medium
          </Badge>
        );
      case "high":
        return (
          <Badge
            variant="outline"
            className="bg-red-100 text-red-800 border-red-200"
          >
            High
          </Badge>
        );
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  if (isCollapsed) {
    return (
      <div className="h-full bg-background border-l border-border flex flex-col items-center py-4 px-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleCollapse}
          className="mb-4"
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <div className="flex flex-col gap-4">
          <Button variant="ghost" size="icon">
            <Clock className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <AlertCircle className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <Info className="h-5 w-5" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full bg-background border-l border-border flex flex-col w-[350px]">
      <div className="flex items-center justify-between p-4 border-b border-border">
        <h3 className="font-semibold text-lg">Information Panel</h3>
        <Button variant="ghost" size="icon" onClick={onToggleCollapse}>
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="flex-1 flex flex-col"
      >
        <div className="border-b border-border">
          <TabsList className="w-full">
            <TabsTrigger value="logs" className="flex-1">
              Data Logs
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex-1">
              Notifications
            </TabsTrigger>
          </TabsList>
        </div>

        <div className="flex items-center justify-between p-2 border-b border-border">
          <span className="text-sm text-muted-foreground">Sort by time</span>
          <Button variant="ghost" size="sm" onClick={toggleSortOrder}>
            {sortOrder === "desc" ? "Newest first" : "Oldest first"}
          </Button>
        </div>

        <TabsContent value="logs" className="flex-1 p-0 m-0">
          <ScrollArea className="h-full">
            <div className="p-4 space-y-4">
              {sortedLogs.map((log) => (
                <div key={log.id} className="flex flex-col space-y-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-2 h-2 rounded-full ${getLogTypeColor(log.type)}`}
                      />
                      <span className="font-medium">{log.sensorId}</span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {formatTime(log.timestamp)} - {formatDate(log.timestamp)}
                    </div>
                  </div>
                  <p className="text-sm pl-4">{log.message}</p>
                  <Separator className="mt-2" />
                </div>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="notifications" className="flex-1 p-0 m-0">
          <ScrollArea className="h-full">
            <div className="p-4 space-y-4">
              {sortedNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`flex flex-col space-y-2 p-3 rounded-md ${notification.read ? "bg-background" : "bg-muted"}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{notification.title}</span>
                      {getPriorityBadge(notification.priority)}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {formatTime(notification.timestamp)}
                    </div>
                  </div>
                  <p className="text-sm">{notification.description}</p>
                  <div className="text-xs text-muted-foreground">
                    {formatDate(notification.timestamp)}
                  </div>
                  <Separator />
                </div>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default InfoSidebar;
