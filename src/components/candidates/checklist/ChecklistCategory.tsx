import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface ChecklistItem {
  id: number;
  item: string;
  completed: boolean;
}

interface ChecklistCategoryProps {
  category: string;
  items: ChecklistItem[];
  onToggleItem: (itemId: number, completed: boolean) => void;
}

export function ChecklistCategory({ category, items, onToggleItem }: ChecklistCategoryProps) {
  return (
    <AccordionItem value={category}>
      <AccordionTrigger className="text-lg font-semibold">
        {category}
      </AccordionTrigger>
      <AccordionContent>
        <div className="space-y-4">
          {items.map((item) => (
            <div key={item.id} className="flex items-center space-x-2">
              <Checkbox
                id={`item-${item.id}`}
                checked={item.completed}
                onCheckedChange={(checked) => onToggleItem(item.id, checked as boolean)}
              />
              <Label
                htmlFor={`item-${item.id}`}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {item.item}
              </Label>
            </div>
          ))}
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}