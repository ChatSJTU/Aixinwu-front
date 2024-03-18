import { Typography, List, Divider, Flex } from "antd";
import { useState, useEffect } from "react";

const { Text, Link } = Typography;

export const HomeLeftContent = () => {

    return (
        <>
            <div className="container basic-card">
                <Flex align="center" justify="space-between">
                    <Text strong style={{ fontSize: '16px' }}>通知</Text>
                    <Link href="/articles">{"更多>>"}</Link>
                </Flex>
                <Divider style={{ marginTop: '-8px', marginBottom: '4px' }} />
                <List>

                </List>
            </div>
            <div className="container basic-card">
                <Flex align="center" justify="space-between">
                    <Text strong style={{ fontSize: '16px' }}>动态</Text>
                    <Link href="/articles">{"更多>>"}</Link>
                </Flex>
                <Divider style={{ marginTop: '-8px', marginBottom: '4px' }} />
                <List>
                    
                </List>
            </div>
        </>
    )
}