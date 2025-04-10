import React from "react";
import { Moon, Sun, Bell, User, Settings } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Switch } from "../../components/ui/switch";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../../components/ui/tooltip";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../components/ui/avatar";

interface HeaderProps {
  title?: string;
  isDarkMode?: boolean;
  onDarkModeToggle?: () => void;
  userName?: string;
  userAvatar?: string;
}

const Header = ({
  title = "Sensor Dashboard",
  isDarkMode = false,
  onDarkModeToggle = () => {},
  userName = "Rizqi Kevin",
  userAvatar = "",
}: HeaderProps) => {
  return (
    <header className="w-full h-20 px-6 bg-background border-b flex items-center justify-between sticky top-0 z-10">
      <div className="flex items-center">
        <h1 className="text-2xl font-bold text-foreground">{title}</h1>
      </div>

      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <Sun className="h-4 w-4 text-muted-foreground" />
          <Switch
            checked={isDarkMode}
            onCheckedChange={onDarkModeToggle}
            aria-label="Toggle dark mode"
          />
          <Moon className="h-4 w-4 text-muted-foreground" />
        </div>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon">
                <Settings className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Settings</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <div className="flex items-center space-x-2">
          <Avatar>
            <AvatarImage
              src={
                userAvatar ||
                `https://api.dicebear.com/7.x/avataaars/svg?seed=${userName}`
              }
              alt={userName}
            />
            <AvatarFallback>
              {userName
                .split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <span className="text-sm font-medium hidden md:inline-block">
            {userName}
          </span>
        </div>
      </div>
    </header>
  );
};

export default Header;
