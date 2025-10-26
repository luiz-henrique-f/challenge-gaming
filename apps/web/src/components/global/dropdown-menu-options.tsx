import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/context/AuthContext";
import {
  List,
  LogIn,
  LogOut,
  Menu,
} from "lucide-react";
import { Link } from "@tanstack/react-router";

export function DropdownMenuOptions() {
  const { signOut, user } = useAuth();

  const handleClickSignOut = async () => {
    await signOut();
  };
  return (
    <div>
    {user ? (
      <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="cursor-pointer">
          <Menu />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuGroup>
          <DropdownMenuItem className="cursor-pointer">
            <Link to="/tasks">
              <button className="flex items-center gap-2 cursor-pointer">
                <List />
                <span>Tarefas</span>
              </button>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer">
              <button onClick={handleClickSignOut} className="flex items-center gap-2 cursor-pointer">
                <LogOut />
                <span>Log out</span>
              </button>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
    ) : (
      <Link to="/login">
        <Button className="rounded-2xl cursor-pointer">
          <LogIn />
          Log In 
        </Button>
      </Link>
    )}
    </div>
  );
}