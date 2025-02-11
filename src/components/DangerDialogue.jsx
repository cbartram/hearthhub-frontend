import React from "react";
import {
    AlertTriangle, XIcon
} from 'lucide-react';
import {
    Dialog, DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {Button} from "@/components/ui/button";


const DangerDialogue = ({ showDialog, setShowDialog, onDestructiveAction }) => {
    return (
        <Dialog open={showDialog} onOpenChange={setShowDialog}>
            <DialogContent className="sm:max-w-[625px]">
                <DialogClose className="absolute bg-white right-4 top-4 rounded-sm opacity-70">
                    <XIcon className="h-4 w-4 text-destructive" />
                    <span className="sr-only">Close</span>
                </DialogClose>
                <DialogHeader>
                    <div className="flex items-center gap-2 text-destructive">
                        <AlertTriangle className="h-6 w-6 " />
                        <DialogTitle>Destructive Action Warning</DialogTitle>
                    </div>
                    <DialogDescription className="pt-4">
                        This action cannot be undone. This will permanently delete your Valheim server
                        and remove all associated saved data from our servers.

                        Saves which are shown in the UI are already backed up and safe.
                    </DialogDescription>
                </DialogHeader>

                <div className="flex flex-col gap-4 py-4">
                    <p className="text-sm font-semibold text-destructive">
                        Are you absolutely sure you want to continue?
                    </p>
                </div>

                <DialogFooter className="flex gap-2">
                    <DialogTrigger asChild>
                        <Button variant="outline" onClick={() => setShowDialog(false)}>Cancel</Button>
                    </DialogTrigger>
                    <Button
                        variant="destructive"
                        className="hover:bg-destructive/90"
                        onClick={() => onDestructiveAction()}
                    >
                        Yes, Delete Item
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default DangerDialogue