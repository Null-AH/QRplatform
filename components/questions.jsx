import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const items = [
  {
    id: "1",
    title: "What is this platform used for?",
    content:
      "This platform helps you generate personalized event invitations with each guest’s name and a unique QR code for verification. It's perfect for weddings, conferences, or official events.",
  },
  {
    id: "2",
    title: "What file formats are supported?",
    content:
      "You can upload your guest list in Excel format (.xlsx) and your invitation design as a PNG or JPG image.",
  },
  {
    id: "3",
    title: "Can I choose where to place the guest name and QR code?",
    content:
      "Yes, during the setup process, you can draw boxes on your uploaded design to specify where each guest’s name and QR code should appear.",
  },
  {
    id: "4",
    title: "How does QR verification work during the event?",
    content:
      "The platform generates a unique QR for every guest. You can scan these QR codes using your device camera to check and verify attendance at the event.",
  },
  {
    id: "5",
    title: "Is there a limit on the number of invitations I can create?",
    content:
      "You can generate hundreds of invitations in one go. All the final images will be packed in a downloadable ZIP file for easy access.",
  },
]


export default function Component() {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Frequently Asked Questions</h2>
      <Accordion type="single" collapsible className="w-full" defaultValue="3">
        {items.map((item) => (
          <AccordionItem value={item.id} key={item.id} className="py-2">
            <AccordionTrigger
              className="justify-start gap-3 py-2 cursor-pointer text-[15px] leading-6 hover:no-underline [&>svg]:-order-1">
              {item.title}
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground ps-7 pb-2">
              {item.content}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
