import * as React from "react";
import supabase from "../supabase";
import {Accordion, AccordionContent, AccordionItem, AccordionTrigger} from "@/components/ui/accordion";
import "../styles/Note.css";
import {useRef} from "react";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import {Button} from "@/components/ui/button";
// @ts-ignore
export default function Note({note, refresh}) {
    const [content, setContent] = React.useState<any>(note.content);
    const [saved, setSaved] = React.useState(true);

    async function saveNote() {
        const {error} = await supabase.from("note").update({content: content}).eq("id", note.id);
        if (error) return alert(error.message);
        setSaved(true);
    }
    async function deleteNote() {
        const {error} = await supabase.from("note").delete().eq("id", note.id);
        if (error) return alert(error.message);
        refresh();
    }
    // @ts-ignore
    const isSSR = typeof window === "undefined"
    return (
        <Accordion type="single" collapsible className="w-full">
            <AccordionItem value={note.id} className={"bg-white"} >
                <AccordionTrigger>
                    {note.header === "" ? "Add a header" : note.header} | {new Date(note.date).getDate()}.{new Date(note.date).getMonth() + 1}.{new Date(note.date).getFullYear()}
                </AccordionTrigger>
                <AccordionContent >
                    <p className={"text-sm text-muted-foreground"} >{saved ? "Saved" : "Not Saved"}</p>
                    {
                        !isSSR &&  <ReactQuill className={"min-h-[100px]"} theme="snow" value={content} onChange={(val) => {
                            setContent(val);
                            setSaved(false);
                        }} />
                    }
                    <Button className={"mt-5 mr-5"} onClick={saveNote} >
                        Save
                    </Button>
                    <Button className={"mt-5 bg-red-600"} onClick={deleteNote} >
                        Delete note
                    </Button>
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    )
}