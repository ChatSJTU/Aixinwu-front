import React from 'react';
import { LoadingOutlined } from '@ant-design/icons';
import Icon from '@ant-design/icons';
import AxwLogo from '../../assets/icons/axw-logo.svg';
import { Spin, Flex, Space } from 'antd';

interface SpinProps {
  size?: number; 
  style?: React.CSSProperties;
  logo?: boolean;
}

export const LoadingSpin: React.FC<SpinProps> = ({ 
    size = 48,
    style,
    logo = false,
}) => {

    const iconStyle = {
        ...style,
        color: style?.color || 'var(--ant-primary-color)', 
        fontSize: size,
    };

    if (logo) return (
        <Flex 
            style={{height: "100%", width: "100%", background: "#FFF"}}
            justify="center" 
            align="center">
            <Space size="middle" direction="vertical" align="center">
                <Space size="middle" direction="horizontal">
                    <Icon component={AxwLogo} style={iconStyle} ></Icon>
                    <span style={{color: style?.color || 'var(--ant-primary-color)', fontWeight: "bold", fontSize: "20px"}}>上海交通大学爱心屋</span>
                </Space>
                <Spin
                    indicator={
                    <LoadingOutlined
                        style={{ fontSize: size, ...style }}
                        spin
                    />
                    }
                />
            </Space>
            </Flex>
    )

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

