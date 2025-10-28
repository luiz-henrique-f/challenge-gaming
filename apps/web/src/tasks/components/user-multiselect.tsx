import { useState } from "react"
import { Check, ChevronsUpDown, X } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
// import { CommandDialog } from "@/components/ui/command-dialog"
import { cn } from "@/lib/utils"
import type { User } from "@/hooks/useUsers"
import { DialogClose } from "@/components/ui/dialog"

interface UserMultiSelectProps {
  users: User[]
  value: string[]
  onChange: (value: string[]) => void
  disabled?: boolean
}

export function UserMultiSelect({
  users,
  value = [],
  onChange,
  disabled,
}: UserMultiSelectProps) {
  const [open, setOpen] = useState(false)

  const selectedUsers = users.filter((user) => value.includes(user.id))

  const handleSelect = (userId: string) => {
    const newValue = value.includes(userId)
      ? value.filter((id) => id !== userId)
      : [...value, userId]
    onChange(newValue)
  }

  const removeUser = (userId: string, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    onChange(value.filter((id) => id !== userId))
  }

  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)

  return (
    <div className="space-y-3">
      <Button
        type="button"
        variant="outline"
        role="combobox"
        aria-expanded={open}
        onClick={() => setOpen(true)}
        className="w-full justify-between bg-[#1a1f2e] border-blue-900/30 hover:bg-[#1f2435] hover:text-gray-50 cursor-pointer"
        disabled={disabled}
      >
        <span className="flex items-center gap-2">
          {selectedUsers.length > 0
            ? `Selecionados (${selectedUsers.length})`
            : "Selecione os responsáveis..."}
        </span>
        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
      </Button>

      <CommandDialog open={open} onOpenChange={setOpen} showCloseButton={false}>
        <DialogClose asChild>
            <Button
              type="button"
              variant="outline"
              className="absolute top-3 right-3 bg-transparent hover:bg-transparent border-none text-red-500 hover:text-red-400 cursor-pointer"
            >
              <X className="h-5 w-5" />
            </Button>
        </DialogClose>
        <Command className="bg-[#0e1420] text-gray-100">
          <CommandInput
            placeholder="Buscar usuários..."
            className="text-white placeholder:text-gray-400"
          />
          <CommandList>
            <CommandEmpty>Nenhum usuário encontrado.</CommandEmpty>
            <CommandGroup>
              {users.map((user) => {
                const isSelected = value.includes(user.id)
                return (
                  <CommandItem
                    key={user.id}
                    onSelect={() => handleSelect(user.id)}
                    className="cursor-pointer hover:bg-blue-900/20 group"
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <Avatar className="h-8 w-8 border border-blue-900">
                        <AvatarImage src={user.avatar} />
                        <AvatarFallback>
                          {getInitials(user.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-500">
                          {user.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {user.username}
                        </p>
                      </div>
                      <Check
                        className={cn(
                          "h-4 w-4 transition-opacity",
                          isSelected
                            ? "opacity-100 text-blue-400"
                            : "opacity-0"
                        )}
                      />
                    </div>
                  </CommandItem>
                )
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </CommandDialog>

      {selectedUsers.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedUsers.map((user) => (
            <Badge
              key={user.id}
              variant="secondary"
              className="flex items-center gap-2 bg-blue-900/20 text-blue-300 border-blue-700/30 py-1 px-3"
            >
              <Avatar className="h-4 w-4">
                <AvatarImage src={user.avatar} />
                <AvatarFallback className="text-xs text-blue-900">
                  {getInitials(user.name)}
                </AvatarFallback>
              </Avatar>
              {user.name}
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-3 w-3 p-0 hover:bg-transparent text-red-400 hover:text-red-300"
                onClick={(e) => removeUser(user.id, e)}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  )
}
