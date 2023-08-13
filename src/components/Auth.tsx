import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "./ui/card";
import {Label} from "./ui/label";
import {Input} from "./ui/input";
import {Button} from "./ui/button";
import * as React from "react";
import supabase from "../supabase";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";

export default function Auth() {
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [name, setName] = React.useState("");
    async function SignUp() {
        if (!email.endsWith("edu.hel.fi")) return alert("You must use an edu.hel.fi email.");
        if (name.length < 2) return alert("Your name is too short.")
        const {data,error} = await supabase.auth.signUp({email: email, password: password, options: {
            data: {
                name: name,
            }
            }});
        if (error) return alert(error.message);
    }
    async function SignIn() {
        const {data,error} = await supabase.auth.signInWithPassword({email: email, password: password});
        if (error) return alert(error.message);
    }
    return (
        <main className="main" >
            <Tabs defaultValue="account" className="w-[400px]">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="in">Sign In</TabsTrigger>
                    <TabsTrigger value="up">Sign Up</TabsTrigger>
                </TabsList>
                <TabsContent value="in">
                    <Card>
                        <CardHeader>
                            <CardTitle>Sign In</CardTitle>
                            <CardDescription>
                                Sign in to your account
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <div className="space-y-1">
                                <Label htmlFor="email">Email</Label>
                                <Input onChange={(t) => setEmail(t.target.value)} id="email" type={"email"} defaultValue="" placeholder={"Email"} />
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor="password">Password</Label>
                                <Input onChange={(t) => setPassword(t.target.value)} id="password" type={"password"} defaultValue="" placeholder={"Password"} />
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button onClick={SignIn} >Sign In</Button>
                        </CardFooter>
                    </Card>
                </TabsContent>
                <TabsContent value="up">
                    <Card>
                        <CardHeader>
                            <CardTitle>Sign Up</CardTitle>
                            <CardDescription>
                                Create an account
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <div className="space-y-1">
                                <Label htmlFor="name">Name</Label>
                                <Input onChange={(t) => setName(t.target.value)} id="name" type="name" placeholder={"Name"} />
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor="email">Email</Label>
                                <Input onChange={(t) => setEmail(t.target.value)} id="email" type="email" placeholder={"Email"} />
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor="password">Password</Label>
                                <Input onChange={(t) => setPassword(t.target.value)} id="password" type="password" placeholder={"Password"} />
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button onClick={SignUp}>Sign Up</Button>
                        </CardFooter>
                    </Card>
                </TabsContent>
            </Tabs>
        </main>
    )
}