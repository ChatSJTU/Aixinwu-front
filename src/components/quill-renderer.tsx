import ReactQuill, { Quill } from 'react-quill';
import 'react-quill/dist/quill.snow.css';

export interface QuillRendererProps {
  HTMLContent: string;
}

const QuillRenderer: React.FC<QuillRendererProps> = ({ HTMLContent }) => {
  let fontArr = ['Microsoft-YaHei', 'SimSun', 'SimHei', 'KaiTi', 'FangSong'];
  let Font = Quill.import('formats/font');
  Font.whitelist = fontArr;
  Quill.register(Font, true);

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