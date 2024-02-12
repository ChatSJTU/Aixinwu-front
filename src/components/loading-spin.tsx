import React from 'react';
import { LoadingOutlined } from '@ant-design/icons';
import { Spin } from 'antd';

interface SpinProps {
  size?: number; 
  style?: React.CSSProperties;
}

export const LoadingSpin: React.FC<SpinProps> = ({ 
    size = 48,
    style
}) => {

    return (
        <Spin
            indicator={
            <LoadingOutlined
                style={{ fontSize: size, ...style }}
                spin
            />
            }
        />
    );
};

