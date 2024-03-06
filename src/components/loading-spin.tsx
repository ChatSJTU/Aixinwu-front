import React from 'react';
import { LoadingOutlined } from '@ant-design/icons';
import { AxwLogo } from '@/components/axw-logo';
import { Spin, Flex, Space } from 'antd';

interface SpinProps {
  size?: number; 
  style?: React.CSSProperties;
  logo?: boolean;
}

export const LoadingSpin: React.FC<SpinProps> = ({ 
    size = 48,
    style,
    logo = false
}) => {

    if (logo) return (
        <Flex 
            style={{height: "100vh", width: "100vw", background: "#FFF"}}
            justify="center" 
            align="center">
            <Space size="middle" direction="vertical">
                <Space size="middle" direction="horizontal">
                    <AxwLogo fill="#cbcdd1" size={size}></AxwLogo>
                    <span style={{color: "#cbcdd1", fontWeight: "bold", fontSize: "20px"}}>上海交通大学爱心屋</span>
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

