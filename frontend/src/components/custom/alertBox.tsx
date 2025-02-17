import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  //AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface CustomAlertDialogProps {
  message: string;
  onConfirm: () => void;
  onCancel?: () => void;
  isOpen: boolean;
  close: () => void;
}

const CustomAlertDialog: React.FC<CustomAlertDialogProps> = ({
  message,
  onConfirm,
  onCancel,
  isOpen,
  close,
}) => {
  return (
    <AlertDialog open={isOpen} onOpenChange={close}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>{message}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onCancel}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default CustomAlertDialog;
