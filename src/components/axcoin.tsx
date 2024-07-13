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
  shownFromSign?: boolean;      // 是否显示"起"（可选）
  shownRange?: boolean;         // 是否显示价格区间（可选，maxValue存在且shownFromSign为false时生效）
  maxValue?: number;            // 最大价格（可选）
}

export const AxCoin: React.FC<AxCoinProps> = ({ 
    size = 22,
    style,
    value = -Infinity,
    coloredValue = false,
    valueStyle,
    originValue,
    shownFromSign = false,
    shownRange = false,
    maxValue = -Infinity
}) => {

    const themeCtx = useContext(ThemeContext);

    const colorStyle = { color: style?.color || (themeCtx.userTheme == 'light' ? "#EB2F96" : "#CD2882") };

    const iconStyle = {
        ...style,
        ...colorStyle,
        fontSize: size,
    };

    return (
        <Space align="center" style={{ height: 'auto' }}>
            <Icon 
                component={themeCtx.userTheme == 'light' ? AxCoinLight : AxCoinDark} 
                style={iconStyle}
            />
            {value >= 0 &&             
                <div style={{ alignItems: 'baseline', display: 'inline-flex' }}>
                    <p
                        className={coloredValue ? '' : 'primary-text'}
                        style={{
                            fontSize: size,
                            fontWeight: '500',
                            lineHeight: 1,
                            margin: 0,
                            marginTop: -size*0.1,
                            ...coloredValue ? colorStyle : {},
                            ...valueStyle
                        }}
                    >
                        {(shownRange && !shownFromSign && maxValue >= 0)
                            ? `${value >= 1000 ? value.toFixed(1) : value.toFixed(2)} - ${maxValue >= 1000 ? maxValue.toFixed(1) : maxValue.toFixed(2)}`
                            : `${value >= 1000 ? value.toFixed(1) : value.toFixed(2)}`
                        }
                    </p>
                    {shownFromSign &&
                        <p
                            style={{
                                fontSize: size * 0.7,
                                lineHeight: 0,
                                marginLeft: '2px',
                                ...coloredValue ? colorStyle : {},
                            }}
                        >{"起"}</p>
                    }
                    {originValue &&
                        <del
                            className='secondary-text'
                            style={{
                                fontSize: size * 0.6,
                                lineHeight: 1,
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

