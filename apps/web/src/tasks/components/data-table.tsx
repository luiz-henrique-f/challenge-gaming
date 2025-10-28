import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
}

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  const badgeVariants = {
  // Prioridades
  URGENT: { variant: "destructive" as const, className: "" },
  HIGH: { variant: "high" as const, className: "" },
  MEDIUM: { variant: "medium" as const, className: "" },
  LOW: { variant: "low" as const, className: "" },
  
  // Status
  TODO: { variant: "todo" as const, className: "" },
  IN_PROGRESS: { variant: "in_progress" as const, className: "" },
  REVIEW: { variant: "review" as const, className: "" },
  DONE: { variant: "done" as const, className: "" },
};

  return (
    <div className="overflow-hidden rounded-md border">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id} className="text-center">
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                )
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
        {table.getRowModel().rows?.length ? (
          table.getRowModel().rows.map((row) => (
            <TableRow
              key={row.id}
              data-state={row.getIsSelected() && "selected"}
            >
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id} >
                  {cell.column.columnDef.id === 'priority' || cell.column.columnDef.id === 'status' ? (
                    (() => {
                      const cellContent = cell.getValue() as keyof typeof badgeVariants;
                      
                      if (!cellContent) return '';

                      const badgeConfig = badgeVariants[cellContent] || { variant: "outline" as const };
                      
                      return (
                        <Badge variant={badgeConfig.variant} className={badgeConfig.className}>
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </Badge>
                      );
                    })()
                  ) : (
                    flexRender(cell.column.columnDef.cell, cell.getContext())
                  )}
                </TableCell>
              ))}
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={columns.length} className="h-24 text-center">
              {data?.length === 0 ? "Nenhuma task encontrada." : "No results."}
            </TableCell>
          </TableRow>
        )}
      </TableBody>
      </Table>
    </div>
  )
}