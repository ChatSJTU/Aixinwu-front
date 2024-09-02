import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

export interface QuillRendererProps {
  HTMLContent?: string;
}

const QuillRenderer: React.FC<QuillRendererProps> = ({ HTMLContent }) => {
  return (
      <ReactQuill
        theme={'snow'}
        value={HTMLContent ?? ''}
        readOnly={true}
        modules={{
          toolbar: false,  // 禁用工具栏
        }}
      />
  )
}

export default QuillRenderer;