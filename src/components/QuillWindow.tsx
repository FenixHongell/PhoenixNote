import ReactQuill from "react-quill";
import * as React from "react";
import 'react-quill/dist/quill.snow.css';

// @ts-ignore
export default function QuillWindow({content, onChange}) {
   return (
       <ReactQuill className={"min-h-[100px]"} theme="snow" value={content} onChange={onChange} />
   )
}