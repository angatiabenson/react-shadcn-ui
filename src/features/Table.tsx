import * as React from "react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
} from "@tanstack/react-table";
import {
  ArrowUpDown,
  Pencil,
  Trash2,
  Plus,
  Search,
  CalendarIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { type Car, cars } from "@/constants/cars";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { Popover, PopoverTrigger } from "@/components/ui/popover";
import { PopoverContent } from "@radix-ui/react-popover";
import { Calendar } from "@/components/ui/calendar";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

function formatDate(date: Date | undefined) {
  if (!date) {
    return "";
  }
  return date.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}
function isValidDate(date: Date | undefined) {
  if (!date) {
    return false;
  }
  return !isNaN(date.getTime());
}

export function CarsTable() {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [selectedCar, setSelectedCar] = React.useState<Car | null>(null);
  const [isEditOpen, setIsEditOpen] = React.useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = React.useState(false);

  //Datepicker
  const [open, setOpen] = React.useState(false);
  const [date, setDate] = React.useState<Date | undefined>(
    new Date("2025-06-01")
  );
  const [month, setMonth] = React.useState<Date | undefined>(date);
  const [value, setValue] = React.useState(formatDate(date));

  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 5,
  });

  const form = useForm();

  const columns = React.useMemo<ColumnDef<Car>[]>(
    () => [
      {
        accessorKey: "Name",
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              className="-ml-4"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
            >
              Name
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          );
        },
        cell: ({ row }) => (
          <div className="font-medium">
            {row.getValue<string>("Name").toUpperCase()}
          </div>
        ),
      },
      {
        accessorKey: "Miles_per_Gallon",
        header: "MPG",
        cell: ({ row }) => (
          <div className="text-gray-500">
            {row.getValue("Miles_per_Gallon")}
          </div>
        ),
      },
      {
        accessorKey: "Cylinders",
        header: "Cylinders",
      },
      {
        accessorKey: "Displacement",
        header: "Displacement",
      },
      {
        accessorKey: "Horsepower",
        header: "Horsepower",
      },
      {
        accessorKey: "Weight_in_lbs",
        header: "Weight in lbs",
      },
      {
        accessorKey: "Acceleration",
        header: "Acceleration",
      },
      {
        accessorKey: "Year",
        header: "Year",
      },
      {
        accessorKey: "Origin",
        header: "Origin",
        cell: ({ row }) => {
          const origin = row.getValue<string>("Origin");
          const color =
            origin === "USA"
              ? "blue"
              : origin === "Europe"
              ? "blue"
              : origin === "Japan"
              ? "red"
              : origin === "Asia"
              ? "green"
              : "";
          return (
            <Badge
              className={`bg-${color}-500 text-white text-sm dark:bg-${color}-600`}
            >
              {origin}
            </Badge>
          );
        },
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
          const mCar = row.original;
          return (
            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                onClick={() => {
                  setSelectedCar(mCar);
                  setIsEditOpen(true);
                }}
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                onClick={() => {
                  setSelectedCar(mCar);
                  setIsDeleteOpen(true);
                }}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          );
        },
      },
    ],
    []
  );

  const table = useReactTable({
    data: cars,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onPaginationChange: setPagination,
    state: {
      sorting,
      columnFilters,
      pagination,
    },
  });

  return (
    <>
      <Card className="w-full shadow-md border-gray-100">
        {/* --- Header Section --- */}
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div>
            <CardTitle className="text-xl font-bold">All Cars</CardTitle>
            <CardDescription>
              Manage details about all cars in your account.
            </CardDescription>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-black text-white hover:bg-gray-800">
                <Plus className="mr-2 h-4 w-4" /> Add New Car
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add New Car</DialogTitle>
                <DialogDescription>
                  Enter the details for the new car.
                </DialogDescription>
              </DialogHeader>
              <Form {...form}>
                <form className="grid w-full gap-4 py-4">
                  <div className="grid w-full items-center gap-2">
                    <Label htmlFor="name" className="text-sm">
                      Name
                    </Label>
                    <Input id="name" placeholder="Car Name" />
                  </div>
                  <div className="flex mt-2">
                    <div className="w-1/2 items-center">
                      <Label htmlFor="mpg" className="text-sm">
                        Miles per Gallon
                      </Label>
                      <Input
                        type="number"
                        id="mpg"
                        placeholder="Miles per Gallon"
                      />
                    </div>
                    <div className="w-1/2 items-center ml-2">
                      <Label htmlFor="cylinder" className="text-sm">
                        Cylinder
                      </Label>
                      <Input
                        type="number"
                        id="cylinder"
                        placeholder="Cylinder"
                      />
                    </div>
                  </div>
                  <div className="flex mt-2">
                    <div className="w-1/2 items-center">
                      <Label htmlFor="horsepower" className="text-sm">
                        Horsepower
                      </Label>
                      <Input
                        type="number"
                        id="horsepower"
                        placeholder="Horsepower"
                      />
                    </div>
                    <div className="w-1/2 items-center ml-2">
                      <Label htmlFor="weight" className="text-sm">
                        Weight in lbs
                      </Label>
                      <Input type="number" id="weight" placeholder="Cylinder" />
                    </div>
                  </div>
                  <div className="flex mt-2">
                    <div className="w-1/2 items-center">
                      <Label htmlFor="acceleration" className="text-sm">
                        Acceleration
                      </Label>
                      <Input
                        type="number"
                        id="acceleration"
                        placeholder="Acceleration"
                      />
                    </div>
                    <div className="w-1/2 items-center ml-2">
                      <Label htmlFor="weight" className="text-sm">
                        Model Year
                      </Label>
                      <div className="relative flex">
                        <Input
                          id="date"
                          value={value}
                          placeholder="June 01, 2025"
                          className="bg-background pr-10"
                          onChange={(e) => {
                            const date = new Date(e.target.value);
                            setValue(e.target.value);
                            if (isValidDate(date)) {
                              setDate(date);
                              setMonth(date);
                            }
                          }}
                          onKeyDown={(e) => {
                            if (e.key === "ArrowDown") {
                              e.preventDefault();
                              setOpen(true);
                            }
                          }}
                        />
                        <Popover open={open} onOpenChange={setOpen}>
                          <PopoverTrigger asChild>
                            <Button
                              id="date-picker"
                              variant="ghost"
                              className="absolute top-1/2 right-2 size-6 -translate-y-1/2"
                            >
                              <CalendarIcon className="size-3.5" />
                              <span className="sr-only">Select date</span>
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent
                            className="w-auto overflow-hidden p-0"
                            align="end"
                            alignOffset={-8}
                            sideOffset={10}
                          >
                            <Calendar
                              mode="single"
                              selected={date}
                              captionLayout="dropdown"
                              month={month}
                              onMonthChange={setMonth}
                              onSelect={(date) => {
                                setDate(date);
                                setValue(formatDate(date));
                                setOpen(false);
                              }}
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                    </div>
                  </div>
                  <div className="flex mt-2">
                    <div className="w-1/2 items-center">
                      <Label htmlFor="origin" className="text-sm">
                        Origin Country
                      </Label>
                      <Input
                        type="number"
                        id="origin"
                        placeholder="Origin Country"
                      />
                    </div>
                  </div>
                </form>
              </Form>
              <DialogFooter>
                <Button type="submit">Create Car</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardHeader>

        <CardContent>
          {/* --- Filter Section --- */}
          <div className="flex items-center py-4">
            <div className="relative max-w-sm w-full">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Filter cars..."
                value={
                  (table.getColumn("email")?.getFilterValue() as string) ?? ""
                }
                onChange={(event) =>
                  table.getColumn("email")?.setFilterValue(event.target.value)
                }
                className="pl-8"
              />
            </div>
          </div>

          {/* --- Table Section --- */}
          <div className="rounded-md border">
            <Table>
              <TableHeader className="bg-gray-50">
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      return (
                        <TableHead key={header.id}>
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                        </TableHead>
                      );
                    })}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    // ADD "group" className here to enable hover effects on children
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                      className="group h-16"
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      No results.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* --- Pagination Section --- */}
          <div className="flex items-center justify-end space-x-2 py-4">
            <div className="flex-1 text-sm text-muted-foreground">
              Page {table.getState().pagination.pageIndex + 1} of{" "}
              {table.getPageCount()}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Next
            </Button>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Car Details</DialogTitle>
            <DialogDescription>
              Update details for{" "}
              <span className="font-bold text-md">
                {selectedCar?.Name.toUpperCase()}
              </span>
              .
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form className="grid w-full gap-4 py-4">
              <div className="grid w-full items-center gap-2">
                <Label htmlFor="name" className="text-sm">
                  Name
                </Label>
                <Input
                  id="name"
                  placeholder="Car Name"
                  value={selectedCar?.Name}
                />
              </div>
              <div className="flex mt-2">
                <div className="w-1/2 items-center">
                  <Label htmlFor="mpg" className="text-sm">
                    Miles per Gallon
                  </Label>
                  <Input
                    type="number"
                    id="mpg"
                    placeholder="Miles per Gallon"
                    value={
                      selectedCar?.Miles_per_Gallon
                        ? selectedCar?.Miles_per_Gallon
                        : 0
                    }
                  />
                </div>
                <div className="w-1/2 items-center ml-2">
                  <Label htmlFor="cylinder" className="text-sm">
                    Cylinder
                  </Label>
                  <Input
                    type="number"
                    id="cylinder"
                    placeholder="Cylinder"
                    value={selectedCar?.Cylinders}
                  />
                </div>
              </div>
              <div className="flex mt-2">
                <div className="w-1/2 items-center">
                  <Label htmlFor="horsepower" className="text-sm">
                    Horsepower
                  </Label>
                  <Input
                    type="number"
                    id="horsepower"
                    placeholder="Horsepower"
                    value={
                      selectedCar?.Horsepower ? selectedCar?.Horsepower : 0
                    }
                  />
                </div>
                <div className="w-1/2 items-center ml-2">
                  <Label htmlFor="weight" className="text-sm">
                    Weight in lbs
                  </Label>
                  <Input
                    type="number"
                    id="weight"
                    placeholder="Cylinder"
                    value={selectedCar?.Weight_in_lbs}
                  />
                </div>
              </div>
              <div className="flex mt-2">
                <div className="w-1/2 items-center">
                  <Label htmlFor="acceleration" className="text-sm">
                    Acceleration
                  </Label>
                  <Input
                    type="number"
                    id="acceleration"
                    placeholder="Acceleration"
                    value={selectedCar?.Acceleration}
                  />
                </div>
                <div className="w-1/2 items-center ml-2">
                  <Label htmlFor="weight" className="text-sm">
                    Model Year
                  </Label>
                  <div className="relative flex">
                    <Input
                      id="date"
                      value={selectedCar?.Year}
                      placeholder="June 01, 2025"
                      className="bg-background pr-10"
                      onChange={(e) => {
                        const date = new Date(e.target.value);
                        setValue(e.target.value);
                        if (isValidDate(date)) {
                          setDate(date);
                          setMonth(date);
                        }
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "ArrowDown") {
                          e.preventDefault();
                          setOpen(true);
                        }
                      }}
                    />
                    <Popover open={open} onOpenChange={setOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          id="date-picker"
                          variant="ghost"
                          className="absolute top-1/2 right-2 size-6 -translate-y-1/2"
                        >
                          <CalendarIcon className="size-3.5" />
                          <span className="sr-only">Select date</span>
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent
                        className="w-auto overflow-hidden p-0"
                        align="end"
                        alignOffset={-8}
                        sideOffset={10}
                      >
                        <Calendar
                          mode="single"
                          selected={date}
                          captionLayout="dropdown"
                          month={month}
                          onMonthChange={setMonth}
                          onSelect={(date) => {
                            setDate(date);
                            setValue(formatDate(date));
                            setOpen(false);
                          }}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
              </div>
              <div className="flex mt-2">
                <div className="w-1/2 items-center">
                  <Label htmlFor="origin" className="text-sm">
                    Origin Country
                  </Label>
                  <Input
                    type="number"
                    id="origin"
                    placeholder="Origin Country"
                    value={selectedCar?.Origin}
                  />
                </div>
              </div>
            </form>
          </Form>
          <DialogFooter>
            <Button type="submit" onClick={() => setIsEditOpen(false)}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete
              <span className="font-bold"> {selectedCar?.Name}</span>'s account
              and remove their data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700"
              onClick={() => {
                // Add your delete logic here
                console.log("Deleting user:", selectedCar?.Name);
                setIsDeleteOpen(false);
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
