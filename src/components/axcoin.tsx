import React from 'react';
import { HeartTwoTone } from '@ant-design/icons';

interface AxCoinProps {
  size?: number; 
  color?: string;
  style?: React.CSSProperties;
}

export const AxCoin: React.FC<AxCoinProps> = ({ 
    size = 22,
    color = "#eb2f96",
    style
}) => {
    const borderWidth = size / 16;

    return (
        <div 
            style={{ 
                fontSize: size / 1.8,
                backgroundColor: '#fff',
                width: size,
                height: size,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: `${borderWidth}px solid ${color}`, 
                ...style
            }}
        >
            <HeartTwoTone twoToneColor={color}/>
        </div>
    );
};

