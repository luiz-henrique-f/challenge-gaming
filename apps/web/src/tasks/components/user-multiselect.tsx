import { useState } from 'react'
import { Check, ChevronsUpDown, X } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import type { User } from '@/hooks/useUsers'

interface UserMultiSelectProps {
  users: User[]
  value: string[]
  onChange: (value: string[]) => void
  disabled?: boolean
}

export function UserMultiSelect({ users, value = [], onChange, disabled }: UserMultiSelectProps) {
  const [open, setOpen] = useState(false)

  const selectedUsers = users.filter(user => value.includes(user.id))

  const handleSelect = (userId: string) => {
    const newValue = value.includes(userId)
      ? value.filter(id => id !== userId)
      : [...value, userId]
    onChange(newValue)
  }

  const removeUser = (userId: string, e: React.MouseEvent) => {
  e.preventDefault()
  e.stopPropagation()
  const newValue = value.filter(id => id !== userId)
  console.log('Removendo usuário:', userId, 'Nova lista:', newValue)
  onChange(newValue)
}

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <div className="space-y-3">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between bg-[#1a1f2e] border-blue-900/30 hover:bg-[#1f2435] hover:text-gray-50"
            disabled={disabled}
          >
            <span className="flex items-center gap-2">
              {selectedUsers.length > 0 ? (
                <div className="flex items-center gap-1 flex-wrap">
                  {selectedUsers.slice(0, 3).map(user => (
                    <Badge
                      key={user.id}
                      variant="secondary"
                      className="flex items-center gap-1 bg-blue-900/20 text-blue-300 border-blue-700/30"
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
                  {selectedUsers.length > 3 && (
                    <Badge variant="outline" className="bg-blue-900/20 text-blue-300">
                      +{selectedUsers.length - 3} mais
                    </Badge>
                  )}
                </div>
              ) : (
                'Selecione os responsáveis...'
              )}
            </span>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-full p-0 bg-[#1a1f2e] border-blue-900/30">
          <Command className="bg-[#1a1f2e]">
            <CommandInput placeholder="Buscar usuários..." className="text-white" />
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
                          <AvatarFallback className="text-sm group-hover:text-blue-900 transition-colors">
                            {getInitials(user.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-500 group-hover:text-blue-900 transition-colors">
                            {user.name}
                          </p>
                          <p className="text-xs text-gray-400 group-hover:text-blue-900 transition-colors">
                            {user.username}
                          </p>
                        </div>
                        <Check
                          className={cn(
                            "h-4 w-4",
                            isSelected ? "opacity-100 text-blue-400" : "opacity-0"
                          )}
                        />
                      </div>
                    </CommandItem>
                  )
                })}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {selectedUsers.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedUsers.map(user => (
            <Badge
              key={user.id}
              variant="secondary"
              className="flex items-center gap-2 bg-blue-900/20 text-blue-300 border-blue-700/30 py-1 px-3 transition-colors"
            >
              <Avatar className="h-4 w-4 ">
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
