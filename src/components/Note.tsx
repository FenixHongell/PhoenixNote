import * as React from "react";
import supabase from "../supabase";
import {Accordion, AccordionContent, AccordionItem, AccordionTrigger} from "@/components/ui/accordion";
import "../styles/Note.css";
import {Button} from "@/components/ui/button";
// @ts-ignore
import QuillWindow from "@/components/QuillWindow.jsx";
import {Dialog, DialogContent, DialogDescription, DialogHeader, DialogTrigger} from "@/components/ui/dialog";
// @ts-ignore
export default function Note({note, refresh}) {
    const [content, setContent] = React.useState<any>(note.content);
    const [saved, setSaved] = React.useState(true);
    const [lastSaved, setLastContent] = React.useState(note.content)
    const [open, setOpen] = React.useState(false);
    const [index, setIndex] = React.useState(0);

    async function saveNote() {
        const {error} = await supabase.from("note").update({content: content}).eq("id", note.id);
        if (error) return alert(error.message);
        setLastContent(content);
        setSaved(true);
    }
    async function deleteNote() {
        setOpen(false);
        const {error} = await supabase.from("note").delete().eq("id", note.id);
        if (error) return alert(error.message);
        refresh();
    }

    // @ts-ignore
    return (
        <Accordion type="single" collapsible className="w-full">
            <AccordionItem value={note.id} className={"bg-white"} >
                <AccordionTrigger>
                    {note.header} | {new Date(note.date).getDate()}.{new Date(note.date).getMonth() + 1}.{new Date(note.date).getFullYear()}
                </AccordionTrigger>
                <AccordionContent >
                    <p className={"text-sm text-muted-foreground"} >{saved ? "Saved" : "Not Saved"}</p>
                            <QuillWindow content={content} onChange={(val:string) => {
                                setContent(val.replace(/\t/g, '&nbsp;&nbsp;&nbsp;&nbsp;'));
                                setSaved(false);
                                if (index >= 10) {
                                    saveNote();
                                    setIndex(0);
                                } else {
                                    setIndex(index + 1);
                                }
                            }} />
                    <Button className={"mt-5 mr-5"} onClick={saveNote} >
                        Save
                    </Button>
                    <Dialog open={open} onOpenChange={(_) => setOpen(_)} >
                        <DialogTrigger>
                            <Button className={"mt-5 bg-red-600 hover:bg-red-500"} >
                                Delete note
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                Delete note?
                            </DialogHeader>
                            <DialogDescription>
                                You are about to delete {note.header}, created on {new Date(note.date).getDate()}.{new Date(note.date).getMonth() + 1}.{new Date(note.date).getFullYear()}
                            </DialogDescription>
                            <Button className={"mt-5 bg-red-600 hover:bg-red-500"} onClick={deleteNote} >
                                Confirm and delete note
                            </Button>
                        </DialogContent>
                    </Dialog>
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    )
}