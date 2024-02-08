import React, {useContext} from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkHtml from 'remark-html';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';
import { UserContext } from "@/contexts/UserContext";

const MarkdownRenderer = ({content} : any) =>{

    const { userTheme } = useContext(UserContext);

    return(
        <div style={{ wordWrap: 'break-word', overflowWrap: 'break-word'}} className={userTheme}>
        <ReactMarkdown
            className={'markdown-body-' + (userTheme === 'dark' ? 'dark' : 'light')}
                children={content}
                remarkPlugins={[remarkGfm, remarkHtml]}
                rehypePlugins={[rehypeRaw, rehypeSanitize]}
                skipHtml={false}
            />
        </div>
    )
}

export default MarkdownRenderer;