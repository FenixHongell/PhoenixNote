import * as React from "react";
import "../styles/main.css"
import ClassElement from "@/components/ClassElement";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import {CalendarIcon, Plus} from "lucide-react";
import {Button} from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {format} from "date-fns";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {cn} from "@/lib/utils";
import {Calendar} from "@/components/ui/calendar";
import colors from "../data/colors";
import supabase from "../supabase";
import Notebook from "@/components/Notebook";
const quotesEinstein = require("../data/quotes.json");
// @ts-ignore
export default function Main({session}): React.JSX.Element {
    const [greeting, setGreeting] = React.useState("Hello");
    const [time, setTime] = React.useState("00.00.00");
    const [classes, setClasses] = React.useState<any[]>([]);
    const [homework, setHomework] = React.useState<any[]>([]);
    const [tempDate, setTempDate] = React.useState<Date>();
    const [selectedColor, setSelectedColor] = React.useState(colors[0]);
    const [subject, setSubject] = React.useState("");
    const [description, setDescription] = React.useState("");
    const [name, setName] = React.useState("");
    const [teacher, setTeacher] = React.useState("");
    const [open, setOpen] = React.useState(false);
    const [done, setDone] = React.useState<any[]>([]);
    const [selectedClass, setSelectedClass] = React.useState<any>(null);

    async function CreateHomework() {
        setOpen(false);
        const {error} = await supabase.from("homework").insert([{
            subject: subject,
            due: tempDate,
            description: description,
            author: session.user.id
        }]);

        if (error) return alert(error.message);

        setTempDate(new Date());

        getHomework();
    }

    async function CreateClass() {
        setOpen(false);

        const {error} = await supabase.from("classes").insert([{
            name: name,
            teacher: teacher,
            color: selectedColor,
            author: session.user.id
        }]);

        if (error) return alert(error.message);

        getClasses();
    }

    async function getClasses() {
        const {data, error: err} = await supabase.from("classes").select("*").eq("author", session.user.id);

        if (err) return alert(err.message);

        setClasses(data);
    }

    async function getHomework() {
        const {data, error: err} = await supabase.from("homework").select("*").eq("author", session.user.id);

        if (err) return alert(err.message);

        setHomework(data);
    }

    async function GetAll() {
        await getHomework();
        await getClasses();
    }

    async function setClock() {
        const currentDateTime = new Date();
        const timeText = currentDateTime.toLocaleTimeString();
        setTime(timeText);
    }

    async function DeleteHomework() {
        const {error} = await supabase.from("homework").delete().in("id", done);

        if (error) return alert(error.message);

        getHomework();
    }

    React.useEffect(() => {
        const date = new Date();
        const hour = date.getHours()
        setGreeting(hour < 12 ? "Good Morning" : "Good evening");
    }, [])
    React.useEffect(() => {
        const timerId = setInterval(setClock, 1000);
    }, [])
    React.useEffect(() => {
        GetAll();
    }, [])
    const [quote, setQuote] = React.useState("");
    React.useEffect(() => {
        setQuote(quotesEinstein.quotesEinstein[Math.floor(Math.random()*quotesEinstein.quotesEinstein.length)]);
    },[])
    return (
        <main className="mainContainer">
            <Button onClick={async () => await supabase.auth.signOut()} className="md:absolute md:left-2 mt-5 bottom-2 md:mt-0 md:mb-0 mb-5 bg-red-600 hover:bg-red-500 max-w-[100px]">
                Log out
            </Button>
            <div
                className="scroll-m-20 border-b pb-2 font-semibold tracking-tight transition-colors first:mt-0 flex-row flex justify-between">
                <div className="flex flex-col justify-center">
                    <h2 className="text-3xl font-semibold tracking-tight transition-colors">
                        {greeting} {session.user.user_metadata.name}.
                    </h2>
                    <blockquote className="mt-6 border-l-2 pl-6 italic font-normal">
                        {
                            quote
                        } - Albert Einstein
                    </blockquote>
                </div>
                <div className="text-right">
                    <h3 className="text-2xl">{time}</h3>
                    <h4 className="text-xl">{new Date().getDate()}.{new Date().getMonth() + 1}</h4>
                </div>
            </div>
            <div className="flex w-full h-full md:flex-row flex-col mt-5">
                {
                    selectedClass === null && <div className="md:w-2/3 w-full flex-wrap inline-flex h-full md:justify-start md:content-start justify-center content-center">
                        {
                            classes.sort((a,b) => a.index - b.index).map((element) => (
                                <ClassElement id={element.id} refresh={() => {
                                    window.location.reload()
                                }} onClick={() => setSelectedClass(element)} name={element.name} teacher={element.teacher}
                                              color={element.color}/>
                            ))
                        }
                    </div>
                }
                <div className="md:w-1/3 w-full">
                    <Table>
                        <TableCaption>
                            {
                                homework.length !== 0 && (
                                    done.length === 0 ? <Label>No Changes</Label> : <Button onClick={() => DeleteHomework()}>
                                Save
                                </Button>
                                )

                            }
                            {
                                homework.length === 0 && <Label>No Homework</Label>
                            }
                        </TableCaption>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[100px]">Subject</TableHead>
                                <TableHead className="">Description</TableHead>
                                <TableHead className="text-right">Due</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {homework.sort(function (a, b) {
                                // @ts-ignore
                                return new Date(b.due) - new Date(a.due);
                            }).reverse().map((element) => {
                                const clicked = done.includes(element.id);

                                function isClicked(): string {
                                    if (clicked) {
                                        return "line-through text-red-600"
                                    }

                                    return "";
                                }

                                return (
                                    <TableRow className={"w-full"} onClick={() => {
                                        if (clicked) {
                                            let tempArray = [...done];
                                            let i = done.indexOf(element.id);
                                            tempArray.splice(i, 1);
                                            setDone(tempArray)
                                        } else {
                                            setDone([...done, element.id])
                                        }
                                    }} key={element.id}>
                                        <TableCell
                                            className={"font-medium " + isClicked()}>{element.subject}</TableCell>
                                        <TableCell className={"font-medium " + isClicked()}>
                                            {element.description}
                                        </TableCell>
                                        <TableCell
                                            className={"text-right " + isClicked()}>{new Date(element.due).getDate()}.{new Date(element.due).getMonth() + 1}</TableCell>
                                    </TableRow>
                                )
                            })}
                        </TableBody>
                    </Table>
                </div>
            </div>
            <Dialog onOpenChange={(_) => setOpen(_)} open={open}>
                <DialogTrigger>
                    <Button className="md:absolute md:right-2 md:bottom-2 mt-5 md:mt-0 md:mb-0 mb-5">
                        Add class or homework
                    </Button>
                </DialogTrigger>
                <DialogContent className="md:max-w-[500px] max-w-[300px]">
                    <Tabs defaultValue={"Class"} className="md:w-[400px] w-[250px]">
                        <TabsList className="grid w-full grid-cols-2 mb-5">
                            <TabsTrigger value={"Class"}>Class</TabsTrigger>
                            <TabsTrigger value={"Homework"}>Homework</TabsTrigger>
                        </TabsList>
                        <TabsContent value={"Class"}>
                            <DialogHeader>
                                <DialogTitle>Add class</DialogTitle>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="name" className="text-right">
                                        Name
                                    </Label>
                                    <Input onChange={(t) => setName(t.target.value)} placeholder="Ex. Math"
                                           className="col-span-3"/>
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="teacher" className="text-right">
                                        Teacher
                                    </Label>
                                    <Input onChange={(t) => setTeacher(t.target.value)} placeholder="Teacher"
                                           className="col-span-3"/>
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="teacher" className="text-right">
                                        Color
                                    </Label>
                                    <div className="col-span-3">
                                        <div className="w-full h-full">
                                            {
                                                colors.map((c) => {
                                                    if (c === selectedColor) {
                                                        return (
                                                            <div
                                                                className={"border-black border-2 inline-grid rounded-full w-[30px] h-[30px] ml-2.5 mr-2.5 " + c}></div>
                                                        )
                                                    } else {
                                                        return (
                                                            <div onClick={() => setSelectedColor(c)}
                                                                 className={"border-2 inline-grid rounded-full w-[30px] h-[30px] ml-2.5 mr-2.5 " + c}></div>
                                                        )
                                                    }
                                                })
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <DialogFooter>
                                <Button onClick={() => CreateClass()} type="submit">Add</Button>
                            </DialogFooter>
                        </TabsContent>
                        <TabsContent value={"Homework"}>
                            <DialogHeader>
                                <DialogTitle>Add Homework</DialogTitle>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="subject" className="text-right">
                                        Subject
                                    </Label>
                                    <Input onChange={(t) => setSubject(t.target.value)} placeholder="Subject"
                                           className="col-span-3"/>
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="subject" className="text-right">
                                        Description
                                    </Label>
                                    <Input onChange={(t) => setDescription(t.target.value)} placeholder="Description"
                                           className="col-span-3"/>
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="Due" className="text-right">
                                        Due
                                    </Label>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant={"outline"}
                                                className={cn(
                                                    "col-span-3 justify-start text-left font-normal",
                                                    !tempDate && "text-muted-foreground"
                                                )}
                                            >
                                                <CalendarIcon className="mr-2 h-4 w-4"/>
                                                {tempDate ? format(tempDate, "PPP") : <span>Pick a date</span>}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0">
                                            <Calendar
                                                mode="single"
                                                selected={tempDate}
                                                onSelect={setTempDate}
                                                initialFocus
                                            />
                                        </PopoverContent>
                                    </Popover>
                                </div>

                            </div>
                            <DialogFooter>
                                <Button type="submit" onClick={() => CreateHomework()}>Add</Button>
                            </DialogFooter>
                        </TabsContent>
                    </Tabs>
                </DialogContent>
            </Dialog>

            {
                selectedClass !== null && <Notebook close={() => setSelectedClass(null)} classInfo={selectedClass}/>
            }
        </main>
    )
}