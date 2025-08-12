import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function RoleSelect({ index, setInviteData }) {
  return (
    <Select
      onValueChange={(value) => {
        setInviteData((prev) => {
          const updated = [...prev]
          updated[index] = { ...updated[index], role: value }
          return updated
        })
      }}
    >
      <SelectTrigger className="w-[150px] bg-gray-800 border cursor-pointer border-gray-700 text-gray-100 placeholder-gray-500 focus:border-gray-600 focus:ring-gray-600">
        <SelectValue placeholder="Select role" />
      </SelectTrigger>
      <SelectContent className="bg-gray-800 border border-gray-700 text-gray-100">
        <SelectItem
          value="Owner"
          className="hover:bg-gray-700 cursor-pointer hover:text-white focus:bg-gray-700 focus:text-white"
        >
          Owner
        </SelectItem>
        <SelectItem
          value="Editor"
          className="hover:bg-gray-700 cursor-pointer hover:text-white focus:bg-gray-700 focus:text-white"
        >
          Editor
        </SelectItem>
        <SelectItem
          value="Check-in Staff"
          className="hover:bg-gray-700 cursor-pointer hover:text-white focus:bg-gray-700 focus:text-white"
        >
          Check-in Staff
        </SelectItem>
      </SelectContent>
    </Select>
  )
}
