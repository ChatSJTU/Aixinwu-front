import React from 'react';
import { Flex, Typography, Divider } from 'antd';

const { Title } = Typography;

interface BasicCardProps {
    children?: React.ReactNode;      
    title?: string;
    titleExtra?: React.ReactNode;
    divider?: boolean;
}

const BasicCard: React.FC<BasicCardProps> = ({ 
    children,
    title,
    titleExtra,
    divider = false
}) => {
    return (
        <div className="container basic-card">
            <Flex align="flex-start" justify="space-between">
                <Title level={5}>{title}</Title>
                {titleExtra}
            </Flex>
            {divider && <Divider style={{ marginTop: '-8px', marginBottom: '16px' }} />}
            {children}
        </div>
    )
}

export default BasicCard;