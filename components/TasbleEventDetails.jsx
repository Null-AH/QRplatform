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
    size: 28,
    enableSorting: false,
    enableHiding: false,
  },
  {
    header: "Name",
    accessorKey: "name",
    cell: ({ row }) => (
      <div className="font-medium text-gray-100">{row.getValue("name")}</div>
    ),
    size: 180,
    filterFn: multiColumnFilterFn,
    enableHiding: false,
  },
  {
    header: "Email",
    accessorKey: "email",
    cell: ({ row }) => (
      <div className="text-gray-300">{row.getValue("email")}</div>
    ),
    size: 220,
  },
  {
    header: "Check-in Status",
    accessorKey: "chechkedIn",
    cell: ({ row }) => (
      <Badge
        className={cn(
          "bg-green-600 text-white border-green-500",
          !row.getValue("chechkedIn") &&
          "bg-red-600 text-white border-red-500"
        )}>
        {row.getValue("chechkedIn") ? "Checked In" : "Not Checked"}
      </Badge>
    ),
    size: 120,
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
      return <span className="text-gray-300">{formatted}</span>
    },
    size: 140,
  },
  {
    header: "ID",
    accessorKey: "id",
    cell: ({ row }) => (
      <div className="text-gray-400 font-mono text-sm">#{row.getValue("id")}</div>
    ),
    size: 80,
  },
  // {
  //   id: "actions",
  //   header: () => <span className="sr-only">Actions</span>,
  //   // cell: ({ row }) => <RowActions row={row} />,
  //   size: 60,
  //   enableHiding: false,
  // },
]

export default function TasbleEventDetails({url}) {
  const id = useId()
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
    // const fetchdata = async() => {
    //   try {
    //     const response = await fetch(url)
    //     if (response.ok) {
    //       const eventData = await response.json()
    //       console.log(eventData);
    //       // Extract attendees array from the event data
    //       if (eventData && eventData.attendees) {
    //         setData(eventData.attendees)
    //       } else {
    //         setData([])
    //       }
    //     } else {
    //       console.error('Failed to fetch data:', response.status)
    //       setData([])
    //     }
    //   } catch (error) {
    //     console.log(error);
    //     setData([])
    //   }
    // }

    // if (url) {
    //   fetchdata();
    // }



    const fetchdata=async()=>{



      console.log(url)
    const currentUser = auth.currentUser;
      if (!currentUser) {
        alert("You must be logged in to create an event.");
     
        return;
      }

      const idToken = await currentUser.getIdToken();

      try{
     const response=await axios.get(url,{

      
        headers:{
          'Authorization': `Bearer ${idToken}`      
          
      
      }
    })
    
    setData(response.data.attendees)
    seteventinfo(response.data);

    console.log(response.data)
  }
  catch(error){
    console.log(error);
  }

    }


    fetchdata();


  }, [url])

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
    // Convert boolean values to readable strings
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
    // Convert boolean values to readable strings for display
    return filterValue.map(val => val ? "Checked In" : "Not Checked")
  }, [table.getColumn("chechkedIn")?.getFilterValue()])

  const handleStatusChange = (checked, value) => {
    const filterValue = table.getColumn("chechkedIn")?.getFilterValue()
    const newFilterValue = filterValue ? [...filterValue] : []
    
    // Convert readable string back to boolean
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
    <div className="min-h-screen p-6">
      <div className="space-y-4">
        {/* Filters */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            {/* Filter by name or email */}
            <div className="relative">
              <Input
                id={`${id}-input`}
                ref={inputRef}
                className={cn(
                  "peer min-w-60 ps-9 bg-gray-800 border-gray-700 text-gray-100 placeholder:text-gray-400 focus:border-blue-500",
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
              <div
                className="text-gray-400 pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 peer-disabled:opacity-50">
                <ListFilterIcon size={16} aria-hidden="true" />
              </div>
              {Boolean(table.getColumn("name")?.getFilterValue()) && (
                <button
                  className="text-gray-400 hover:text-gray-200 focus-visible:border-blue-500 focus-visible:ring-blue-500/50 absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-md transition-[color,box-shadow] outline-none focus:z-10 focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
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
            {/* Filter by status */}
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="bg-gray-800 border-gray-700 text-gray-100 hover:bg-gray-700">
                  <FilterIcon className="-ms-1 opacity-60" size={16} aria-hidden="true" />
                  Check-in Status
                  {selectedStatuses.length > 0 && (
                    <span
                      className="bg-gray-700 text-gray-300 -me-1 inline-flex h-5 max-h-full items-center rounded border border-gray-600 px-1 font-[inherit] text-[0.625rem] font-medium">
                      {selectedStatuses.length}
                    </span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto min-w-36 p-3 bg-gray-800 border-gray-700" align="start">
                <div className="space-y-3">
                  <div className="text-gray-400 text-xs font-medium">
                    Filters
                  </div>
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
                          {value}{" "}
                          <span className="text-gray-400 ms-2 text-xs">
                            {statusCounts.get(value)}
                          </span>
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </PopoverContent>
            </Popover>
            {/* Toggle columns visibility */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="bg-gray-800 border-gray-700 text-gray-100 hover:bg-gray-700">
                  <Columns3Icon className="-ms-1 opacity-60" size={16} aria-hidden="true" />
                  View
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-gray-800 border-gray-700">
                <DropdownMenuLabel className="text-gray-200">Toggle columns</DropdownMenuLabel>
                {table
                  .getAllColumns()
                  .filter((column) => column.getCanHide())
                  .map((column) => {
                    return (
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
                    );
                  })}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="flex items-center gap-3">
            {/* Delete button */}
            {table.getSelectedRowModel().rows.length > 0 && (
              <AlertDialog>
                <AlertDialogTrigger asChild>

                 
                  <Button className="ml-auto bg-red-600 hover:bg-red-700 border-red-600 text-white" variant="outline">
                    <TrashIcon className="-ms-1 opacity-60" size={16} aria-hidden="true" />
                    Delete
                    <span
                      className="bg-red-700 text-red-100 -me-1 inline-flex h-5 max-h-full items-center rounded border border-red-600 px-1 font-[inherit] text-[0.625rem] font-medium">
                      {table.getSelectedRowModel().rows.length}
                    </span>
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="bg-gray-800 border-gray-700">
                  <div className="flex flex-col gap-2 max-sm:items-center sm:flex-row sm:gap-4">
                    <div
                      className="flex size-9 shrink-0 items-center justify-center rounded-full border border-orange-500 bg-orange-500/20"
                      aria-hidden="true">
                      <CircleAlertIcon className="opacity-80 text-orange-400" size={16} />
                    </div>
                    <AlertDialogHeader>
                      <AlertDialogTitle className="text-gray-100">
                        Are you absolutely sure?
                      </AlertDialogTitle>
                      <AlertDialogDescription className="text-gray-300">
                        This action cannot be undone. This will permanently delete{" "}
                        {table.getSelectedRowModel().rows.length} selected{" "}
                        {table.getSelectedRowModel().rows.length === 1
                          ? "row"
                          : "rows"}
                        .
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                  </div>
                  <AlertDialogFooter>
                    <AlertDialogCancel className="bg-gray-700 border-gray-600 text-gray-200 hover:bg-gray-600">Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDeleteRows} className="bg-red-600 hover:bg-red-700 text-white">
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>

              
            )}
            <div className="flex flex-col items-end mr-2 gap-4">
                   <ShinyText text={eventinfo.name} disabled={false} speed={30} className='custom-class text-2xl  md:text-5xl lg:text-5xl ' />
              {eventinfo.eventDate}
            </div>
          </div>
        </div>
        {/* Table */}
        <div className="bg-gray-800 overflow-hidden rounded-md border border-gray-700">
          <Table className="table-fixed">
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id} className="hover:bg-transparent border-b border-gray-700">
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead
                        key={header.id}
                        style={{ width: `${header.getSize()}px` }}
                        className="h-11 text-gray-200 bg-gray-750">
                        {header.isPlaceholder ? null : header.column.getCanSort() ? (
                          <div
                            className={cn(header.column.getCanSort() &&
                              "flex h-full cursor-pointer items-center justify-between gap-2 select-none hover:text-gray-100")}
                            onClick={header.column.getToggleSortingHandler()}
                            onKeyDown={(e) => {
                              // Enhanced keyboard handling for sorting
                              if (
                                header.column.getCanSort() &&
                                (e.key === "Enter" || e.key === " ")
                              ) {
                                e.preventDefault()
                                header.column.getToggleSortingHandler()?.(e)
                              }
                            }}
                            tabIndex={header.column.getCanSort() ? 0 : undefined}>
                            {flexRender(header.column.columnDef.header, header.getContext())}
                            {{
                              asc: (
                                <ChevronUpIcon className="shrink-0 opacity-60 text-blue-400" size={16} aria-hidden="true" />
                              ),
                              desc: (
                                <ChevronDownIcon className="shrink-0 opacity-60 text-blue-400" size={16} aria-hidden="true" />
                              ),
                            }[header.column.getIsSorted()] ?? null}
                          </div>
                        ) : (
                          flexRender(header.column.columnDef.header, header.getContext())
                        )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody >
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id} 
                    data-state={row.getIsSelected() && "selected"}
                    className="border-b border-gray-700 hover:bg-gray-750 data-[state=selected]:bg-gray-700/50 text-gray-200">
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="last:py-0 text-gray-200">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
       <TableRow>
          <TableCell
            colSpan={columns.length}
            className="w-full h-30 text-gray-400"
          >
            <div className="flex items-center justify-center w-full h-full">
              <LoaderOne />
            </div>
          </TableCell>
        </TableRow>



              )}
            </TableBody>
          </Table>
        </div>
        {/* Pagination */}
        <div className="flex items-center justify-between gap-8">
          {/* Results per page */}
          <div className="flex items-center gap-3">
            <Label htmlFor={id} className="max-sm:sr-only text-gray-300">
              Rows per page
            </Label>
            <Select
              value={table.getState().pagination.pageSize.toString()}
              onValueChange={(value) => {
                table.setPageSize(Number(value))
              }}>
              <SelectTrigger id={id} className="w-fit whitespace-nowrap bg-gray-800 border-gray-700 text-gray-200">
                <SelectValue placeholder="Select number of results" />
              </SelectTrigger>
              <SelectContent
                className="bg-gray-800 border-gray-700 [&_*[role=option]]:ps-2 [&_*[role=option]]:pe-8 [&_*[role=option]>span]:start-auto [&_*[role=option]>span]:end-2">
                {[5, 10, 25, 50].map((pageSize) => (
                  <SelectItem key={pageSize} value={pageSize.toString()} className="text-gray-200 focus:bg-gray-700">
                    {pageSize}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {/* Page number information */}
          <div
            className="text-gray-400 flex grow justify-end text-sm whitespace-nowrap">
            <p
              className="text-gray-400 text-sm whitespace-nowrap"
              aria-live="polite">
              <span className="text-gray-200">
                {table.getState().pagination.pageIndex *
                  table.getState().pagination.pageSize +
                  1}
                -
                {Math.min(Math.max(table.getState().pagination.pageIndex *
                  table.getState().pagination.pageSize +
                  table.getState().pagination.pageSize, 0), table.getRowCount())}
              </span>{" "}
              of{" "}
              <span className="text-gray-200">
                {table.getRowCount().toString()}
              </span>
            </p>
          </div>

          {/* Pagination buttons */}
          <div>
            <Pagination>
              <PaginationContent>
                {/* First page button */}
                <PaginationItem>
                  <Button
                    size="icon"
                    variant="outline"
                    className="disabled:pointer-events-none disabled:opacity-50 bg-gray-800 border-gray-700 text-gray-200 hover:bg-gray-700"
                    onClick={() => table.firstPage()}
                    disabled={!table.getCanPreviousPage()}
                    aria-label="Go to first page">
                    <ChevronFirstIcon size={16} aria-hidden="true" />
                  </Button>
                </PaginationItem>
                {/* Previous page button */}
                <PaginationItem>
                  <Button
                    size="icon"
                    variant="outline"
                    className="disabled:pointer-events-none disabled:opacity-50 bg-gray-800 border-gray-700 text-gray-200 hover:bg-gray-700"
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                    aria-label="Go to previous page">
                    <ChevronLeftIcon size={16} aria-hidden="true" />
                  </Button>
                </PaginationItem>
                {/* Next page button */}
                <PaginationItem>
                  <Button
                    size="icon"
                    variant="outline"
                    className="disabled:pointer-events-none disabled:opacity-50 bg-gray-800 border-gray-700 text-gray-200 hover:bg-gray-700"
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                    aria-label="Go to next page">
                    <ChevronRightIcon size={16} aria-hidden="true" />
                  </Button>
                </PaginationItem>
                {/* Last page button */}
                <PaginationItem>
                  <Button
                    size="icon"
                    variant="outline"
                    className="disabled:pointer-events-none disabled:opacity-50 bg-gray-800 border-gray-700 text-gray-200 hover:bg-gray-700"
                    onClick={() => table.lastPage()}
                    disabled={!table.getCanNextPage()}
                    aria-label="Go to last page">
                    <ChevronLastIcon size={16} aria-hidden="true" />
                  </Button>
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </div>
      
      </div>
    </div>
  );
}

// function RowActions({
//   row
// }) {
//   return (
//     <DropdownMenu>
//       <DropdownMenuTrigger asChild>
//         <div className="flex justify-end">
//           <Button
//             size="icon"
//             variant="ghost"
//             className="shadow-none text-gray-400 hover:text-gray-200 hover:bg-gray-700"
//             aria-label="Edit item">
//             <EllipsisIcon size={16} aria-hidden="true" />
//           </Button>
//         </div>
//       </DropdownMenuTrigger>
//       <DropdownMenuContent align="end" className="bg-gray-800 border-gray-700">
//         <DropdownMenuGroup>
//           <DropdownMenuItem className="text-gray-200 focus:bg-gray-700">
//             <span>Edit</span>
//             <DropdownMenuShortcut className="text-gray-400">⌘E</DropdownMenuShortcut>
//           </DropdownMenuItem>
//           <DropdownMenuItem className="text-gray-200 focus:bg-gray-700">
//             <span>Duplicate</span>
//             <DropdownMenuShortcut className="text-gray-400">⌘D</DropdownMenuShortcut>
//           </DropdownMenuItem>
//         </DropdownMenuGroup>
//         <DropdownMenuSeparator className="bg-gray-600" />
//         <DropdownMenuGroup>
//           <DropdownMenuItem className="text-gray-200 focus:bg-gray-700">
//             <span>Archive</span>
//             <DropdownMenuShortcut className="text-gray-400">⌘A</DropdownMenuShortcut>
//           </DropdownMenuItem>
//           <DropdownMenuSub>
//             <DropdownMenuSubTrigger className="text-gray-200 focus:bg-gray-700">More</DropdownMenuSubTrigger>
//             <DropdownMenuPortal>
//               <DropdownMenuSubContent className="bg-gray-800 border-gray-700">
//                 <DropdownMenuItem className="text-gray-200 focus:bg-gray-700">Move to project</DropdownMenuItem>
//                 <DropdownMenuItem className="text-gray-200 focus:bg-gray-700">Move to folder</DropdownMenuItem>
//                 <DropdownMenuSeparator className="bg-gray-600" />
//                 <DropdownMenuItem className="text-gray-200 focus:bg-gray-700">Advanced options</DropdownMenuItem>
//               </DropdownMenuSubContent>
//             </DropdownMenuPortal>
//           </DropdownMenuSub>
//         </DropdownMenuGroup>
//         <DropdownMenuSeparator className="bg-gray-600" />
//         <DropdownMenuGroup>
//           <DropdownMenuItem className="text-gray-200 focus:bg-gray-700">Share</DropdownMenuItem>
//           <DropdownMenuItem className="text-gray-200 focus:bg-gray-700">Add to favorites</DropdownMenuItem>
//         </DropdownMenuGroup>
//         <DropdownMenuSeparator className="bg-gray-600" />
//         <DropdownMenuItem className="text-red-400 focus:text-red-300 focus:bg-red-900/20">
//           <span>Delete</span>
//           <DropdownMenuShortcut className="text-red-400">⌘⌫</DropdownMenuShortcut>
//         </DropdownMenuItem>
//       </DropdownMenuContent>
//     </DropdownMenu>
//   );
// }