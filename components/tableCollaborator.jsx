import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import Addcollaborator from "./addcollaborator";

const items = [
  {
    id: "1",
    name: "Alex Thompson",
    username: "@alexthompson",
    image:
      "https://raw.githubusercontent.com/origin-space/origin-images/refs/heads/main/exp1/avatar-40-02_upqrxi.jpg",
    email: "alex.t@company.com",
    location: "San Francisco, US",
    status: "Active",
    balance: "$1,250.00",
  },
  {
    id: "2",
    name: "Sarah Chen",
    username: "@sarahchen",
    image:
      "https://raw.githubusercontent.com/origin-space/origin-images/refs/heads/main/exp1/avatar-40-01_ij9v7j.jpg",
    email: "sarah.c@company.com",
    location: "Singapore",
    status: "Active",
    balance: "$600.00",
  },
  {
    id: "4",
    name: "Maria Garcia",
    username: "@mariagarcia",
    image:
      "https://raw.githubusercontent.com/origin-space/origin-images/refs/heads/main/exp1/avatar-40-03_dkeufx.jpg",
    email: "m.garcia@company.com",
    location: "Madrid, Spain",
    status: "Active",
    balance: "$0.00",
  },
  {
    id: "5",
    name: "David Kim",
    username: "@davidkim",
    image:
      "https://raw.githubusercontent.com/origin-space/origin-images/refs/heads/main/exp1/avatar-40-05_cmz0mg.jpg",
    email: "d.kim@company.com",
    location: "Seoul, KR",
    status: "Active",
    balance: "-$1,000.00",
  },
]

export default function TableCollaborators({ id }) {
  return (
    <div className="w-full">
      {/* Header with Add Button */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Collaborators</h2>
        <div className="flex w-fit justify-end rounded-md p-1 cursor-pointer bg-[#1e2939]">
          <Addcollaborator />
        </div>
      </div>

      {/* Table Container with horizontal scroll on mobile */}
      <div className="overflow-x-auto rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="min-w-[200px]">Name</TableHead>
              <TableHead className="min-w-[180px]">Email</TableHead>
              <TableHead className="min-w-[120px]">Role</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.id} className="hover:bg-muted/50">
                <TableCell>
                  <div className="flex items-center gap-3">
                    <img
                      className="rounded-full flex-shrink-0"
                      src={item.image}
                      width={40}
                      height={40}
                      alt={item.name} 
                    />
                    <div className="min-w-0">
                      <div className="font-medium truncate">{item.name}</div>
                      {/* <span className="text-muted-foreground mt-0.5 text-xs truncate block">
                        {item.username}
                      </span> */}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="truncate" title={item.email}>
                    {item.email}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="truncate" title={item.location}>
                    {item.location}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      
      <p className="text-muted-foreground mt-4 text-center text-sm">
        Table of Staff
      </p>
    </div>
  );
}