import * as React from "react";
import 'react-quill/dist/quill.snow.css';
export default class QuillWindow extends React.Component {
   constructor(props) {
      super(props)
      if (document) {
         this.quill = require('react-quill')
         this.focused = false;
      }
   }



   render() {
      const Quill = this.quill
      if (Quill) {
         return (
             <Quill
                 onFocus={() => this.focused = true}
                 onBlur={() => this.focused = false}
                 className={"min-h-[100px]"}
                 onChange={this.props.onChange}
                 theme="snow"
                 value={this.props.content}
             />
         )
      } else {
         return (
             <textarea />
         )
      }
   }
}