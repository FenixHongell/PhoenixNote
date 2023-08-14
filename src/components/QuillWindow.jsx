import * as React from "react";
import 'react-quill/dist/quill.snow.css';
import 'katex/dist/katex.min.css';
export default class QuillWindow extends React.Component {
   constructor(props) {
      super(props)
      if (document) {
         this.quill = require('react-quill')
         window.katex = require("katex");
      }
   }



   render() {
      const Quill = this.quill
      if (Quill) {
         return (
             <Quill
                 modules={{
                    toolbar: [
                        [{ header: [1, 2, 3, false] }], ["bold", "italic", "underline", "strike"],
                        ["formula"], [{ color: [] }, { background: [] }],  [{ align: [] }]
                    ]
                 }}
                 className={"min-h-[100px]"}
                 onChange={this.props.onChange}
                 theme="snow"
                 defaultValue={this.props.content}
             />
         )
      } else {
         return (
             <textarea />
         )
      }
   }
}