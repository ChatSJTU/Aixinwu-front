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

  const Parchment = Quill.import('parchment');
  const lineHeightStyle = new Parchment.Attributor.Style('lineheight', 'line-height', {
    scope: Parchment.Scope.INLINE,
    whitelist: ["1", "1.5", "1.75", "2", "3", "4", "5"],
  });
  Quill.register({ 'formats/lineHeight': lineHeightStyle }, true);

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