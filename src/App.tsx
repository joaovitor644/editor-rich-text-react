import React, { useCallback, useMemo, useState } from 'react'
import { createEditor, Descendant , BaseEditor, Transforms, Editor } from 'slate'
import { Slate, Editable, withReact } from 'slate-react'
import { ReactEditor } from 'slate-react'

type CustomElement = { type: 'paragraph' | 'code'; children: CustomText[] }
type CustomText = { text: string }

declare module 'slate' {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor
    Element: CustomElement
    Text: CustomText
  }
}

const App = () => {
  const renderElement = useCallback((props: any) => {
  switch (props.element.type){
    case 'code':
      return <CodeElement {...props} />
    default:
      return <DefaultElement {...props} />
  }
},[])
const CodeElement = (props: any) => {
  return (
    <pre {...props.attributes}>
      <code>{props.children}</code>
    </pre>
  )
}
const DefaultElement = (props: any) => {
  return <p {...props.attibutes}>{props.children}</p>
}

  const initialValue: Descendant[] = [
    {
      type: 'paragraph',
      children: [{ text: 'A line of text in a paragraph.' }],
    },
  ]
  const editor = useMemo(() => withReact(createEditor()), [])
  const [value, setValue] = useState<Descendant[]>(initialValue)
  return (
    <Slate editor={editor} value={value} onChange={setValue}>
      <Editable 
      renderElement={renderElement}
        onKeyDown={event => {
          if(event.key){
            event.preventDefault()
            Transforms.setNodes(
              editor,
              { type: 'code' },
              {match: n => Editor.isBlock(editor,n)}
            )
          }
        }}
      />
    </Slate>
  )
}
export default App