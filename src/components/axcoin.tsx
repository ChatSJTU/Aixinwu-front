import React, { useContext } from 'react';
import { Space, Typography } from "antd";
import Icon from '@ant-design/icons';
import AxCoinLight from '../../assets/icons/axcoin-light.svg'
import AxCoinDark from '../../assets/icons/axcoin-dark.svg'
import ThemeContext from "@/contexts/theme";

interface AxCoinProps {
  size?: number;                // 图标大小（可选，后续字体自适应调整）
  style?: React.CSSProperties;  // 图标style（可选，若在此定义color将覆盖主题色）
  value?: number;               // 价格（可选）
  coloredValue?: boolean;       // 是否使用主题色绘制价格（可选）
  valueStyle?: React.CSSProperties; // 价格style（可选）
  originValue?: number          // 原价（可选，value存在时生效）
}

export const AxCoin: React.FC<AxCoinProps> = ({ 
    size = 22,
    style,
    value,
    coloredValue = false,
    valueStyle,
    originValue
}) => {

    const themeCtx = useContext(ThemeContext);

    const iconStyle = {
        ...style,
        color: style?.color || (themeCtx.userTheme == 'light' ? "#EB2F96" : "#CD2882"),
        fontSize: size,
    };

    return (
        <Space align="center" style={{ height: 'auto' }}>
            <Icon 
                component={themeCtx.userTheme == 'light' ? AxCoinLight : AxCoinDark} 
                style={iconStyle}
            />
            {value && 
                <div style={{alignItems: 'baseline', display: 'inline-flex'}}>
                    <p
                        className = {coloredValue ? '' : 'primary-text'}
                        style={{
                            fontSize: size * 0.8,
                            fontWeight: '500',
                            lineHeight: `${size}px`,
                            ...(coloredValue==true
                                ? {color : (style?.color || (themeCtx.userTheme == 'light' ? "#EB2F96" : "#CD2882"))}
                                : {}),
                            ...valueStyle
                        }}
                    >
                        {`${value.toFixed(2)}`}
                    </p>
                    {originValue && 
                        <del
                            className='secondary-text'
                            style={{
                                fontSize: size * 0.6,
                                lineHeight: `${size}px`,
                                marginLeft: '6px'
                            }}
                        >
                            {`${originValue.toFixed(2)}`}
                        </del>
                    }
                </div>
            }
        </Space>
    );
};

