import { LayoutProps } from '@/models/layout';
import { message } from 'antd';
import { MessageInstance } from 'antd/es/message/interface';
import { createContext, useCallback, useRef } from 'react';

export const MessageContext = createContext<MessageInstance>({} as MessageInstance);

export const MessageContextProvider = (props: LayoutProps) => {
    const [messageApi, contextHolder] = message.useMessage();
    const lastMessageTimeRef = useRef<number>(0);
    const errorCountRef = useRef<number>(0);

    const throttledError = useCallback((content: string) => {
        const now = Date.now();
        const timeSinceLastMessage = now - lastMessageTimeRef.current;

        if (timeSinceLastMessage > 2000) {
            messageApi.error({ content });
            lastMessageTimeRef.current = now;
            errorCountRef.current = 1;
        } else if (errorCountRef.current < 2) {
            messageApi.error({ content });
            errorCountRef.current += 1;
        }
    }, [messageApi]);

    return (
        <MessageContext.Provider value={{ ...messageApi, error: throttledError }}>
            {contextHolder}
            {props.children}
        </MessageContext.Provider>
    );
};
