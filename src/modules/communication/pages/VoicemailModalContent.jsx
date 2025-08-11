import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Phone } from "lucide-react";

const VoicemailModalContent = ({
  callerNumber = "+1 555-222-3333",
  receivedDate = "2023-04-11 09:15",
  duration = "0:45",
  onClose,
}) => {
  return (
    <Dialog open onOpenChange={(isOpen) => !isOpen && onClose?.()}>
      <DialogContent className="sm:max-w-md bg-white rounded-lg shadow-lg p-0">
        <DialogHeader className="p-6 pb-4">
          <DialogTitle className="text-lg font-semibold">
            Voicemail from {callerNumber}
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-500 mt-1">
            Received on {receivedDate} &bull; Duration: {duration}
          </DialogDescription>
        </DialogHeader>

        <div className="px-6 py-4 space-y-4">
          <div className="text-center text-gray-500 text-sm bg-gray-50 border border-gray-200 rounded-md p-6 my-2">
            Audio Player Placeholder
          </div>

          <div className="flex justify-center items-center space-x-2">
            <Button variant="outline" size="sm">Play</Button>
            <Button variant="outline" size="sm">Pause</Button>
          </div>
        </div>

        <DialogFooter className="p-6 pt-4 flex justify-end space-x-3">
          <Button variant="outline">
            <Phone className="mr-2 h-4 w-4" /> Call Back
          </Button>
          <DialogClose asChild>
            <Button variant="destructive">Delete</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default VoicemailModalContent;
