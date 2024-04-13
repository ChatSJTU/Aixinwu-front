import { LayoutProps } from '@/models/layout';
import { message } from 'antd';
import { MessageInstance } from 'antd/es/message/interface';
import { createContext } from 'react';

export const MessageContext = createContext<MessageInstance>({} as MessageInstance);

export const MessageContextProvider = (props : LayoutProps) => {
    const [messageApi, contextHolder] = message.useMessage();
    return (
      <MessageContext.Provider value={messageApi}>
        {contextHolder}
        {props.children}
      </MessageContext.Provider>
    )
  }