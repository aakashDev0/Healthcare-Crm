import React from 'react';
import {
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogClose, 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

const NotReadyReasonModalContent = ({
    onReasonSelect = (reason) => { console.log("Reason selected:", reason); }, 
}) => {
    const reasons = ["Break", "Lunch", "Training", "Meeting", "Admin Work"];

    return (
        // DialogContent provides overlay, centering, base styles, and default close button
        <DialogContent className="sm:max-w-xs bg-white rounded-lg shadow-lg p-0"> 
        {/* {/ Adjusted max-width, removed padding /} */}
            <DialogHeader className="p-6 pb-3 text-center sm:text-left"> 
                {/* {/ Header padding, adjusted text align for consistency /} */}
                <DialogTitle className="text-lg font-semibold">Select Not Ready Reason</DialogTitle>
                <DialogDescription className="text-sm text-gray-500 mt-1">
                    Please select a reason for changing your status to Not Ready
                </DialogDescription>
            </DialogHeader>

            {/* {/ Main content area - Reason Buttons /} */}
            <div className="px-6 py-4 space-y-2"> 
                {/* {/ Padding and vertical button spacing /} */}
                {reasons.map((reason) => (
                    // Wrap each reason button in DialogClose to close the modal on selection
                    <DialogClose key={reason} asChild>
                        <Button
                            variant="outline"
                            className="w-full justify-center" // Center text within the button
                            onClick={() => onReasonSelect(reason)} // Call handler on click
                        >
                            {reason}
                        </Button>
                    </DialogClose>
                ))}
            </div>

            {/* {/ Footer Section /} */}
            <DialogFooter className="p-6 pt-3">
                 {/* {/ Footer padding /} */}
                 {/* {/ Wrap Cancel button in DialogClose /} */}
                 <DialogClose asChild>
                    <Button
                        type="button" 
                        className="bg-gray-500 hover:bg-gray-600 text-white rounded-md px-4 cursor-pointer" 
                    >
                        Cancel
                    </Button>
                </DialogClose>
            </DialogFooter>
        </DialogContent>
    );
};

// Export the content component
export default NotReadyReasonModalContent;

