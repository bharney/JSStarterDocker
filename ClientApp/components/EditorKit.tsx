import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { convertFromRaw, EditorState } from 'draft-js';
import Editor, { composeDecorators } from 'draft-js-plugins-editor';
import createImagePlugin from 'draft-js-image-plugin';
import createAlignmentPlugin from 'draft-js-alignment-plugin';
import createFocusPlugin from 'draft-js-focus-plugin';
import createResizeablePlugin from 'draft-js-resizeable-plugin';
import createBlockDndPlugin from 'draft-js-drag-n-drop-plugin';
const focusPlugin = createFocusPlugin();
const resizeablePlugin = createResizeablePlugin();
const blockDndPlugin = createBlockDndPlugin();
const alignmentPlugin = createAlignmentPlugin();
const { AlignmentTool } = alignmentPlugin;

const decorator = composeDecorators(
  resizeablePlugin.decorator,
  alignmentPlugin.decorator,
  focusPlugin.decorator,
  blockDndPlugin.decorator
);
const imagePlugin = createImagePlugin({ decorator });

import createLinkPlugin from 'draft-js-anchor-plugin';
import createInlineToolbarPlugin, { Separator } from 'draft-js-inline-toolbar-plugin';
import {
  ItalicButton,
  BoldButton,
  UnderlineButton,
  CodeButton,
  HeadlineOneButton,
  HeadlineTwoButton,
  HeadlineThreeButton,
  UnorderedListButton,
  OrderedListButton,
  BlockquoteButton,
  CodeBlockButton,
} from 'draft-js-buttons';
const linkPlugin = createLinkPlugin();
const inlineToolbarPlugin = createInlineToolbarPlugin({
  structure: [
    BoldButton,
    ItalicButton,
    UnderlineButton,
    HeadlineTwoButton,
    HeadlineThreeButton,
    UnorderedListButton,
    OrderedListButton,
    BlockquoteButton,
    linkPlugin.LinkButton
  ]
});
const plugins = [
    blockDndPlugin,
    focusPlugin,
    alignmentPlugin,
    resizeablePlugin,
    imagePlugin,
    inlineToolbarPlugin, 
    linkPlugin,
];

const { InlineToolbar } = inlineToolbarPlugin;


interface Props {
    history: any;
}

interface State {
    editorState: any;
    editor: any;
}


export default class EditorKit extends React.Component<RouteComponentProps<{}>, {}> {
    constructor(props, context) {
    super(props, context);
}
public img: any = require("../images/4876542043_4d94fced5c_o.jpg");


state: State = {
    editorState: EditorState.createWithContent(convertFromRaw({
    "entityMap": {
        "0": {
            "type": "image",
            "mutability": "IMMUTABLE",
            "data": {
                "src": this.img,
            }
        }
    },
    "blocks": [{
        "key": "9gm3s",
        "text": "You can have images in your text field. This is a very rudimentary example, but you can enhance the image plugin with resizing, focus or alignment plugins.",
        "type": "unstyled",
        "depth": 0,
        "inlineStyleRanges": [],
        "entityRanges": [],
        "data": {}
    }, {
        "key": "ov7r",
        "text": " ",
        "type": "atomic",
        "depth": 0,
        "inlineStyleRanges": [],
        "entityRanges": [{
            "offset": 0,
            "length": 1,
            "key": 0
        }],
        "data": {}
    }, {
        "key": "e23a8",
        "text": "See advanced examples further down",
        "type": "unstyled",
        "depth": 0,
        "inlineStyleRanges": [],
        "entityRanges": [],
        "data": {}
    }]
})),
    editor: {}
  };

  onChange = (editorState) => {
    this.setState({
      editorState,
    });
  };

  focus = () => {
    this.state.editor.focus();
  };

    public render() {
        return <div id="editor" className="editor" onClick={this.focus}>
        <Editor
          editorState={this.state.editorState}
          onChange={this.onChange}
          plugins={plugins}
          ref={(element) => { this.state.editor = element; }}
        />
        <InlineToolbar />
        <AlignmentTool />
      </div>;
    }
}