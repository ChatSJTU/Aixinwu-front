import { LayoutProps } from '@/models/layout';
import { message } from 'antd';
import { createContext } from 'react';

export const MessageContext = createContext<any>(null);

export const MessageContextProvider = (props : LayoutProps) => {
    const [messageApi, contextHolder] = message.useMessage();
    return (
      <MessageContext.Provider value={messageApi}>
        {contextHolder}
        {props.children}
      </MessageContext.Provider>
    )
  }