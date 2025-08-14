"use client";
import { useEffect, useId, useMemo, useRef, useState } from "react"
import {
  flexRender,
  getCoreRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  ChevronDownIcon,
  ChevronFirstIcon,
  ChevronLastIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronUpIcon,
  CircleAlertIcon,
  CircleXIcon,
  Columns3Icon,
  EllipsisIcon,
  FilterIcon,
  ListFilterIcon,
  PlusIcon,
  TrashIcon,
} from "lucide-react"

import { cn } from "@/lib/utils"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "@/components/ui/pagination"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { auth } from "@/app/firebase/config";
import axios from "axios";
import ShinyText from "@/app/components/TextHomePAge";
import { LoaderOne } from "./loding";
import { useAuth } from "@/app/(dashboard)/context/authLogin";

// Custom filter function for multi-column searching
const multiColumnFilterFn = (row, columnId, filterValue) => {
  const searchableRowContent =
    `${row.original.name} ${row.original.email}`.toLowerCase()
  const searchTerm = (filterValue ?? "").toLowerCase()
  return searchableRowContent.includes(searchTerm);
}

const statusFilterFn = (
  row,
  columnId,
  filterValue
) => {
  if (!filterValue?.length) return true
  const status = row.getValue(columnId)
  return filterValue.includes(status);
}

const columns = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="border-gray-600 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600" />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="border-gray-600 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600" />
    ),
    size: 50,
    enableSorting: false,
    enableHiding: false,
  },
  {
    header: "Name",
    accessorKey: "name",
    cell: ({ row }) => (
      <div className="font-medium text-gray-100 min-w-0 truncate pr-2" title={row.getValue("name")}>
        {row.getValue("name")}
      </div>
    ),
    size: 200,
    filterFn: multiColumnFilterFn,
    enableHiding: false,
  },
  {
    header: "Email",
    accessorKey: "email",
    cell: ({ row }) => (
      <div className="text-gray-300 min-w-0 truncate pr-2" title={row.getValue("email")}>
        {row.getValue("email")}
      </div>
    ),
    size: 250,
  },
  {
    header: "Status",
    accessorKey: "chechkedIn",
    cell: ({ row }) => (
      <Badge
        className={cn(
          "bg-green-600 text-white border-green-500 whitespace-nowrap",
          !row.getValue("chechkedIn") &&
          "bg-red-600 text-white border-red-500"
        )}>
        {row.getValue("chechkedIn") ? "Checked In" : "Not Checked"}
      </Badge>
    ),
    size: 130,
    filterFn: statusFilterFn,
  },
  {
    header: "Check-in Time",
    accessorKey: "checkedInTimestamp",
    cell: ({ row }) => {
      const timestamp = row.getValue("checkedInTimestamp")
      if (!timestamp) return <span className="text-gray-500">-</span>
      
      const date = new Date(timestamp)
      const formatted = date.toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      })
      return <span className="text-gray-300 whitespace-nowrap">{formatted}</span>
    },
    size: 150,
  },
  {
    header: "ID",
    accessorKey: "id",
    cell: ({ row }) => (
      <div className="text-gray-400 font-mono text-sm whitespace-nowrap">#{row.getValue("id")}</div>
    ),
    size: 80,
  },
]

export default function TasbleEventDetails({url}) {
  const id = useId()
  const { isSyncedWithBackend } = useAuth();
  const [eventinfo,seteventinfo]=useState({});
  const [columnFilters, setColumnFilters] = useState([])
  const [columnVisibility, setColumnVisibility] = useState({})
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  })
  const inputRef = useRef(null)

  const [sorting, setSorting] = useState([
    {
      id: "name",
      desc: false,
    },
  ])

  const [data, setData] = useState([])
  useEffect(() => {
    const fetchdata=async()=>{
      console.log(url)
        
      if(!isSyncedWithBackend)
        return

      try{
        const response=await axios.get(url
              
      
      )
        
        setData(response.data.attendees || [])
        seteventinfo(response.data);
        console.log(response.data)
      }
      catch(error){
        console.log(error);
      }
    }

    if (url) {
      fetchdata();
    }
  }, [url,isSyncedWithBackend])

  const handleDeleteRows = () => {
    const selectedRows = table.getSelectedRowModel().rows
    const updatedData = data.filter((item) => !selectedRows.some((row) => row.original.id === item.id))
    setData(updatedData)
    table.resetRowSelection()
  }

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    enableSortingRemoval: false,
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPagination,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getFilteredRowModel: getFilteredRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    state: {
      sorting,
      pagination,
      columnFilters,
      columnVisibility,
    },
  })

  // Get unique status values
  const uniqueStatusValues = useMemo(() => {
    const statusColumn = table.getColumn("chechkedIn")
    if (!statusColumn) return []
    const values = Array.from(statusColumn.getFacetedUniqueValues().keys())
    return values.map(val => val ? "Checked In" : "Not Checked").sort();
  }, [table.getColumn("chechkedIn")?.getFacetedUniqueValues()])

  // Get counts for each status
  const statusCounts = useMemo(() => {
    const statusColumn = table.getColumn("chechkedIn")
    if (!statusColumn) return new Map();
    const originalCounts = statusColumn.getFacetedUniqueValues();
    const readableCounts = new Map();
    
    for (const [key, value] of originalCounts) {
      const readableKey = key ? "Checked In" : "Not Checked";
      readableCounts.set(readableKey, value);
    }
    
    return readableCounts;
  }, [table.getColumn("chechkedIn")?.getFacetedUniqueValues()])

  const selectedStatuses = useMemo(() => {
    const filterValue = table.getColumn("chechkedIn")?.getFilterValue()
    if (!filterValue) return []
    return filterValue.map(val => val ? "Checked In" : "Not Checked")
  }, [table.getColumn("chechkedIn")?.getFilterValue()])

  const handleStatusChange = (checked, value) => {
    const filterValue = table.getColumn("chechkedIn")?.getFilterValue()
    const newFilterValue = filterValue ? [...filterValue] : []
    
    const booleanValue = value === "Checked In"

    if (checked) {
      newFilterValue.push(booleanValue)
    } else {
      const index = newFilterValue.indexOf(booleanValue)
      if (index > -1) {
        newFilterValue.splice(index, 1)
      }
    }

    table
      .getColumn("chechkedIn")
      ?.setFilterValue(newFilterValue.length ? newFilterValue : undefined)
  }

  return (
    <div className="w-full p-4 md:p-6">
      <div className="space-y-6">
        
        {/* Event Header */}
        <div className="text-center space-y-2 pb-4 border-b border-gray-700">
          <ShinyText 
            text={eventinfo.name || "Event Details"} 
            disabled={false} 
            speed={30} 
            className='text-2xl md:text-3xl lg:text-4xl font-bold' 
          />
          {eventinfo.eventDate && (
            <p className="text-gray-400 text-lg">{eventinfo.eventDate}</p>
          )}
        </div>

        {/* Filters - Responsive Layout */}
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            
            {/* Search and Filter Controls */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-1">
              {/* Search Input */}
              <div className="relative flex-1 min-w-0">
                <Input
                  id={`${id}-input`}
                  ref={inputRef}
                  className={cn(
                    "w-full ps-9 bg-gray-800 border-gray-700 text-gray-100 placeholder:text-gray-400 focus:border-blue-500",
                    Boolean(table.getColumn("name")?.getFilterValue()) && "pe-9"
                  )}
                  value={
                    (table.getColumn("name")?.getFilterValue() ?? "")
                  }
                  onChange={(e) =>
                    table.getColumn("name")?.setFilterValue(e.target.value)
                  }
                  placeholder="Filter by name or email..."
                  type="text"
                  aria-label="Filter by name or email" />
                <div className="text-gray-400 pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3">
                  <ListFilterIcon size={16} aria-hidden="true" />
                </div>
                {Boolean(table.getColumn("name")?.getFilterValue()) && (
                  <button
                    className="text-gray-400 hover:text-gray-200 absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center"
                    aria-label="Clear filter"
                    onClick={() => {
                      table.getColumn("name")?.setFilterValue("")
                      if (inputRef.current) {
                        inputRef.current.focus()
                      }
                    }}>
                    <CircleXIcon size={16} aria-hidden="true" />
                  </button>
                )}
              </div>

              {/* Filter Buttons */}
              <div className="flex items-center gap-2 flex-shrink-0">
                {/* Status Filter */}
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="bg-gray-800 border-gray-700 text-gray-100 hover:bg-gray-700">
                      <FilterIcon className="-ms-1 opacity-60" size={16} aria-hidden="true" />
                      <span className="hidden sm:inline">Status</span>
                      {selectedStatuses.length > 0 && (
                        <span className="bg-gray-700 text-gray-300 -me-1 inline-flex h-5 items-center rounded border border-gray-600 px-1 text-xs">
                          {selectedStatuses.length}
                        </span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto min-w-36 p-3 bg-gray-800 border-gray-700" align="start">
                    <div className="space-y-3">
                      <div className="text-gray-400 text-xs font-medium">Filters</div>
                      <div className="space-y-3">
                        {uniqueStatusValues.map((value, i) => (
                          <div key={value} className="flex items-center gap-2">
                            <Checkbox
                              id={`${id}-${i}`}
                              checked={selectedStatuses.includes(value)}
                              onCheckedChange={(checked) =>
                                handleStatusChange(checked, value)
                              }
                              className="border-gray-600 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600" />
                            <Label
                              htmlFor={`${id}-${i}`}
                              className="flex grow justify-between gap-2 font-normal text-gray-200">
                              {value}
                              <span className="text-gray-400 text-xs">
                                {statusCounts.get(value)}
                              </span>
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>

                {/* Column Visibility */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="bg-gray-800 border-gray-700 text-gray-100 hover:bg-gray-700">
                      <Columns3Icon className="-ms-1 opacity-60" size={16} aria-hidden="true" />
                      <span className="hidden sm:inline">View</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-gray-800 border-gray-700">
                    <DropdownMenuLabel className="text-gray-200">Toggle columns</DropdownMenuLabel>
                    {table
                      .getAllColumns()
                      .filter((column) => column.getCanHide())
                      .map((column) => (
                        <DropdownMenuCheckboxItem
                          key={column.id}
                          className="capitalize text-gray-200 focus:bg-gray-700"
                          checked={column.getIsVisible()}
                          onCheckedChange={(value) =>
                            column.toggleVisibility(!!value)
                          }
                          onSelect={(event) => event.preventDefault()}>
                          {column.id}
                        </DropdownMenuCheckboxItem>
                      ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {/* Delete Button */}
            {table.getSelectedRowModel().rows.length > 0 && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button className="bg-red-600 hover:bg-red-700 border-red-600 text-white" variant="outline">
                    <TrashIcon className="-ms-1 opacity-60" size={16} aria-hidden="true" />
                    <span className="hidden sm:inline">Delete</span>
                    <span className="bg-red-700 text-red-100 -me-1 inline-flex h-5 items-center rounded border border-red-600 px-1 text-xs">
                      {table.getSelectedRowModel().rows.length}
                    </span>
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="bg-gray-800 border-gray-700">
                  <div className="flex flex-col gap-2 max-sm:items-center sm:flex-row sm:gap-4">
                    <div className="flex size-9 shrink-0 items-center justify-center rounded-full border border-orange-500 bg-orange-500/20">
                      <CircleAlertIcon className="opacity-80 text-orange-400" size={16} />
                    </div>
                    <AlertDialogHeader>
                      <AlertDialogTitle className="text-gray-100">
                        Are you absolutely sure?
                      </AlertDialogTitle>
                      <AlertDialogDescription className="text-gray-300">
                        This action cannot be undone. This will permanently delete{" "}
                        {table.getSelectedRowModel().rows.length} selected{" "}
                        {table.getSelectedRowModel().rows.length === 1 ? "row" : "rows"}.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                  </div>
                  <AlertDialogFooter>
                    <AlertDialogCancel className="bg-gray-700 border-gray-600 text-gray-200 hover:bg-gray-600">
                      Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction onClick={handleDeleteRows} className="bg-red-600 hover:bg-red-700 text-white">
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
        </div>

        {/* Table with horizontal scroll */}
        <div className="bg-gray-800 overflow-hidden rounded-lg border border-gray-700">
          <div className="overflow-x-auto">
            <Table className="min-w-[800px]">
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id} className="hover:bg-transparent border-b border-gray-700">
                    {headerGroup.headers.map((header) => (
                      <TableHead
                        key={header.id}
                        className="h-11 text-gray-200 bg-gray-750 whitespace-nowrap">
                        {header.isPlaceholder ? null : header.column.getCanSort() ? (
                          <div
                            className="flex h-full cursor-pointer items-center justify-between gap-2 select-none hover:text-gray-100"
                            onClick={header.column.getToggleSortingHandler()}
                            onKeyDown={(e) => {
                              if (
                                header.column.getCanSort() &&
                                (e.key === "Enter" || e.key === " ")
                              ) {
                                e.preventDefault()
                                header.column.getToggleSortingHandler()?.(e)
                              }
                            }}
                            tabIndex={0}>
                            {flexRender(header.column.columnDef.header, header.getContext())}
                            {{
                              asc: (
                                <ChevronUpIcon className="shrink-0 opacity-60 text-blue-400" size={16} />
                              ),
                              desc: (
                                <ChevronDownIcon className="shrink-0 opacity-60 text-blue-400" size={16} />
                              ),
                            }[header.column.getIsSorted()] ?? null}
                          </div>
                        ) : (
                          flexRender(header.column.columnDef.header, header.getContext())
                        )}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow key={row.id} 
                      data-state={row.getIsSelected() && "selected"}
                      className="border-b border-gray-700 hover:bg-gray-750 data-[state=selected]:bg-gray-700/50 text-gray-200">
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id} className="text-gray-200">
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={columns.length} className="w-full h-32 text-gray-400">
                      <div className="flex items-center justify-center w-full h-full">
                        <LoaderOne />
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Pagination - Responsive */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Results per page */}
          <div className="flex items-center gap-3">
            <Label htmlFor={id} className="text-gray-300 whitespace-nowrap">
              Rows per page
            </Label>
            <Select
              value={table.getState().pagination.pageSize.toString()}
              onValueChange={(value) => {
                table.setPageSize(Number(value))
              }}>
              <SelectTrigger id={id} className="w-20 bg-gray-800 border-gray-700 text-gray-200">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
                {[5, 10, 25, 50].map((pageSize) => (
                  <SelectItem key={pageSize} value={pageSize.toString()} className="text-gray-200 focus:bg-gray-700">
                    {pageSize}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Page info */}
          <div className="text-gray-400 text-sm whitespace-nowrap text-center">
            <span className="text-gray-200">
              {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1}
              -
              {Math.min(
                (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
                table.getRowCount()
              )}
            </span>{" "}
            of{" "}
            <span className="text-gray-200">{table.getRowCount()}</span>
          </div>

          {/* Pagination buttons */}
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <Button
                  size="icon"
                  variant="outline"
                  className="bg-gray-800 border-gray-700 text-gray-200 hover:bg-gray-700 disabled:opacity-50"
                  onClick={() => table.firstPage()}
                  disabled={!table.getCanPreviousPage()}>
                  <ChevronFirstIcon size={16} />
                </Button>
              </PaginationItem>
              <PaginationItem>
                <Button
                  size="icon"
                  variant="outline"
                  className="bg-gray-800 border-gray-700 text-gray-200 hover:bg-gray-700 disabled:opacity-50"
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}>
                  <ChevronLeftIcon size={16} />
                </Button>
              </PaginationItem>
              <PaginationItem>
                <Button
                  size="icon"
                  variant="outline"
                  className="bg-gray-800 border-gray-700 text-gray-200 hover:bg-gray-700 disabled:opacity-50"
                  onClick={() => table.nextPage()}
                  disabled={!table.getCanNextPage()}>
                  <ChevronRightIcon size={16} />
                </Button>
              </PaginationItem>
              <PaginationItem>
                <Button
                  size="icon"
                  variant="outline"
                  className="bg-gray-800 border-gray-700 text-gray-200 hover:bg-gray-700 disabled:opacity-50"
                  onClick={() => table.lastPage()}
                  disabled={!table.getCanNextPage()}>
                  <ChevronLastIcon size={16} />
                </Button>
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    </div>
  );
}

