import NewPlanForm from "@/components/NewPlanForm";
import {Button} from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function GeneratePlanDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="default">Create Travel Plan</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Travel Plan</DialogTitle>
        </DialogHeader>
        <NewPlanForm />
      </DialogContent>
    </Dialog>
  );
}
