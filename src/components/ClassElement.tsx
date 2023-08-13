import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import * as React from "react";
import "../styles/main.css"
import {Button} from "@/components/ui/button";
import {ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger} from "@/components/ui/context-menu";
import {Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger} from "@/components/ui/dialog";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import colors from "../data/colors";
import supabase from "../supabase";
// @ts-ignore
export default function ClassElement({name, teacher, color, onClick, refresh, id}) {
    const [dialogOpen, setDialogOpen] = React.useState(false);
    const [selectedColor, setSelectedColor] = React.useState(color);
    const [newTeacher, setTeacher] = React.useState(teacher);
    const [newName, setName] = React.useState(name);

    async function saveData() {
        setDialogOpen(false);
        const {error} = await supabase.from("classes").update({name: newName, teacher: newTeacher, color: selectedColor}).eq("id", id);

        if (error) alert(error.message);

        refresh();
    }

    async function deleteClass() {
        setDialogOpen(false);

        const {error:noteError} = await supabase.from("note").delete().eq("parent", id);

        if (noteError) {
            alert(noteError.message);
            return refresh();
        }

        const {error} = await supabase.from("classes").delete().eq("id", id);

        if (error) alert(error.message);

        refresh();
    }

    return (
      <ContextMenu>
          <ContextMenuTrigger>
              <Card onClick={onClick} className={"ml-2.5 mt-2.5 border-0 mr-2.5 md:w-[400px] w-[300px] hover:shadow-[rgba(17,_17,_26,_0.1)_0px_0px_16px] scale-100 hover:scale-105 "+color} >
                  <CardHeader>
                      <CardTitle>
                          {name}
                      </CardTitle>
                      <CardDescription className={"text-black"} >
                          {teacher}
                      </CardDescription>
                  </CardHeader>
              </Card>
          </ContextMenuTrigger>
          <ContextMenuContent>
              <ContextMenuItem onClick={() => setDialogOpen(true)} >
                  Edit class
              </ContextMenuItem>
          </ContextMenuContent>
          <Dialog open={dialogOpen} onOpenChange={(_) => setDialogOpen(_)}>
             <DialogTrigger/>
              <DialogContent>
                  <DialogHeader>
                      <DialogTitle>Edit Class</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 py-4 w-[80%]">
                      <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="name" className="text-right">
                              Name
                          </Label>
                          <Input value={newName} onChange={(t) => setName(t.target.value)} placeholder="Ex. Math" className="col-span-3"/>
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="teacher" className="text-right">
                              Teacher
                          </Label>
                          <Input value={newTeacher} onChange={(t) => setTeacher(t.target.value)} placeholder="Teacher" className="col-span-3"/>
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
                      <Button onClick={deleteClass} className={"bg-red-600 hover:bg-red-500"} type="submit">Delete</Button>
                      <Button onClick={saveData} type="submit">Save</Button>
                  </DialogFooter>
              </DialogContent>
          </Dialog>
      </ContextMenu>
    )
}