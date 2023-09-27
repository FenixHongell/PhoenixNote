import * as React from "react";
import "../styles/main.css"
import supabase from "../supabase"
import {Button} from "@/components/ui/button";
import {Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger} from "@/components/ui/dialog";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import Note from "@/components/Note";

// @ts-ignore
export default function Notebook({classInfo, close}) {
    const [notes, setNotes] = React.useState<any[]>([]);
    const [open, setOpen] = React.useState(false);
    const [header, setHeader] = React.useState("");


    async function getNotes() {
        const {data, error} = await supabase.from("note").select("*").eq("parent", classInfo.id);

        if (error) return alert(error.message);

        setNotes(data);
    }

    async function CreateNote() {
        if (header === "") return alert("You need a header");
        setOpen(false);
        const {error} = await supabase.from("note").insert([{parent: classInfo.id, header: header, author: classInfo.author}]);

        if (error) alert(error.message);

        getNotes();
    }

    React.useEffect(() => {
        getNotes();
    }, [])

    return (
        <div className="absolute h-full w-full left-0 top-0 bg-white mainContainer">
            <Button className="absolute left-2 top-2" onClick={close} >
                Back
            </Button>
            <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors md:mt-5 mt-10">
                {classInfo.name}
            </h2>
            {
                notes.sort((a,b) => {
                    if (!a.header.contains(" ")) return a.header - b.header;

                    return parseFloat(a.header.split(" ")[1])-parseFloat(b.header.split(" ")[1]);
                }).map((note) => {
                    return (
                        <Note refresh={getNotes} note={note} />
                    )
                })
            }
            <Dialog onOpenChange={(_) => {
                setHeader("");
                setOpen(_);
            }} open={open} >
                <DialogTrigger>
                    <Button className="absolute right-2 top-2">
                        Create Note
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>Create Note</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name" className="text-right">
                                Header
                            </Label>
                            <Input onChange={(t) => setHeader(t.target.value)} placeholder="Ex. Math" className="col-span-3"/>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button onClick={() => CreateNote()} type="submit">Create</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}