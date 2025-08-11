import React from "react";

import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

// Modal Content Component
const TransferCallModalContent = () => {
  return (
    <DialogContent className="sm:max-w-[425px] bg-white rounded-lg shadow-lg p-0">
      {/* {/ Remove default padding /} */}
      <DialogHeader className="p-6 pb-2">
        {/* {/ Add padding /} */}
        <DialogTitle className="text-lg font-bold">Transfer Call</DialogTitle>
        <DialogDescription className="text-sm text-gray-500">
          Enter a number or select from the directory
        </DialogDescription>
      </DialogHeader>

      {/* {/ Main content area /} */}
      <div className="px-6 py-4 grid gap-5">
        {/* {/ Adjusted padding/gap /} */}
        {/* {/ Transfer to Number /} */}
        <div className="space-y-2">
          <label
            htmlFor="transfer-number"
            className="text-sm font-semibold text-gray-700"
          >
            Transfer to Number
          </label>
          <div className="flex items-center space-x-2">
            <Input
              id="transfer-number"
              placeholder="Enter extension or number"
              className="flex-grow rounded-md"
            />
            <Button
              type="button"
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-md px-4 whitespace-nowrap cursor-pointer" 
            >
              Transfer
            </Button>
          </div>
        </div>

        {/* {/ Transfer to Queue /} */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700">
            Transfer to Queue
          </label>
          <div className="space-y-2">
            {["General Inquiries", "Technical Support", "Billing"].map(
              (queue) => (
                <Button
                  key={queue}
                  variant="outline"
                  className="w-full justify-start text-gray-700 rounded-md"
                >
                  {queue}
                </Button>
              )
            )}
          </div>
        </div>
      </div>

      <DialogFooter className="p-6 pt-4">
        {/* {/ Add padding /} */}
        <DialogClose asChild>
          <Button
            type="button"
            className="bg-gray-600 hover:bg-gray-700 text-white rounded-md px-4 cursor-pointer"
          >
            Cancel
          </Button>
        </DialogClose>
      </DialogFooter>
    </DialogContent>
  );
};

// Export the content component for use within a Dialog
export default TransferCallModalContent;

/*
// Example of how to use it elsewhere:
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import TransferCallModalContent from './TransferCallModalContent'; // Adjust import path

function MyComponent() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Transfer Call</Button>
      </DialogTrigger>
      <TransferCallModalContent />
    </Dialog>
  );
}
*/
