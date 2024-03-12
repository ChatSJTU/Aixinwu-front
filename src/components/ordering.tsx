import {Col, Row, List, Divider, InputNumber, Typography, Image, Button, Input, Collapse, Menu, Dropdown, Space} from 'antd';
import { DownOutlined, EllipsisOutlined } from '@ant-design/icons';
import {AxCoin} from "@/components/axcoin";
import React from "react";
import { useState } from 'react';
import { useEffect } from 'react';
const { Title, Text, Link } = Typography;
const { Panel } = Collapse;

function getProductSummary(id: number, itemNumber: number) {
    return ({
        id: id,
        itemNumber: itemNumber,
        image_url: ["https://aixinwu.sjtu.edu.cn/uploads/product/6395/202203_347.jpg",
            "https://aixinwu.sjtu.edu.cn/uploads/product/6394/202203_347.jpg",
            "https://aixinwu.sjtu.edu.cn/uploads/product/6457/202306_347.jpg"],
        product_name: "新航道2023考研政治900题",
        detailed_product_name: "新航道考研政治2023年徐之明思想政治理论金榜书900题新航道考",
        desc: "//此部分后续可更换为嵌入html代码，需注意DOM-based XSS\n\n商品名称：新航道2023考研政治900题\n出版社：世界知识出版社\n本书有以下特点：\n1.根据考试大纲、2021版新教材编写，考点覆盖，重点突出，讲解详实。\n2.中国人民大学教授、原考研政治命题专家主编。\n3.偶数页题目、奇数页答案对应编排，人性化设计方便考生刷题。",
        cost: 24,
        stock: 907,

    });
}

export const Ordering = () => {
    const data = [
        getProductSummary(1, 1),
        getProductSummary(2, 4),
    ];
    
     // 假设data是你的商品数据数组
     const [totalCost, setTotalCost] = useState(0);

     // 计算总价
     const calculateTotalCost = () => {
         const total = data.reduce((acc, item) => {
             return acc + (item.cost * item.itemNumber);
         }, 0);
         setTotalCost(total);
     };

      // 在组件挂载时计算总价
    useEffect(() => {
        calculateTotalCost();
    }, []);

    // 更多地址
    // const menu = (
    //     <Menu>
    //       <Menu.Item key="0">
    //         <a href="#">地址1</a>
    //       </Menu.Item>
    //       <Menu.Item key="1">
    //         <a href="#">地址2</a>
    //       </Menu.Item>
    //       <Menu.Item key="2">
    //         <a href="#">地址3</a>
    //       </Menu.Item>
    //       {/* 添加更多地址 */}
    //     </Menu>
    //   );

    const addresses = [
        {
          name: '李华',
          phone: ' 18845678910',
          address: '上海交通大学闵行校区思源湖'
        },
        {
          name: '李华',
          phone: ' 18845678910',
          address: '上海交通大学闵行校区思源湖'
        },
        {
          name: '李华',
          phone: ' 18845678910',
          address: '上海交通大学闵行校区思源湖'
        },
        {
          name: '李华',
          phone: ' 18845678910',
          address: '上海交通大学闵行校区思源湖'
        },
        {
          name: '李华',
          phone: ' 18845678910',
          address: '上海交通大学闵行校区思源湖'
        },
        // 添加更多地址
      ];
      

    const menu = (
        <Menu style={{ maxHeight: '220px',maxWidth:'200px', overflowY: 'auto' }}>
          {addresses.map((address, index) => (
            <Menu.Item key={index}>
              <p style={{ maxHeight: '300px', overflow: 'auto'}}>
                <span>{address.name}</span>
                <span>{address.phone}</span>
                <br />
                <span style={{ fontSize: '12px', color: '#888', overflow: 'hidden', textOverflow: 'ellipsis' }}>{address.address}</span>
              </p>
            </Menu.Item>
          ))}
        </Menu>
      );
      
 
    
    return (
        <>
                <div className={"container"}>
                    <div> 
                        <Collapse  defaultActiveKey={['1']} style={{marginBottom:'0px' }} ghost size="small">                           
                                <Panel header = "收货人信息：" key="1"  style={{ maxHeight: '300px', textOverflow: 'ellipsis', fontWeight: 'bold'}}>
                                <Dropdown overlay={menu}  trigger={['click']} >
                                    <Button  type='text'  style={{maxWidth:'14vw', maxHeight: '300px', overflow: 'auto',fontWeight: 'lighter', height:'auto' }} onClick={e => e.preventDefault()}>                           <Space>
                                        <Space direction="vertical" size='small' style={{textAlign: 'left'}}>
                                            <Space>
                                                <span>李华 </span>
                                                <span>18845678910</span>
                                            </Space>
                                        <span style={{ fontSize: '12px', color: '#888', overflow: 'hidden', textOverflow: 'ellipsis' }}>上海交通大学闵行校区思源湖</span>
                                        </Space>
                                        <EllipsisOutlined />
                                    </Space>  
                                    </Button>
                                
                                    
                                        {/* <a className="ant-dropdown-link" >
                                        更多地址 <DownOutlined />
                                        </a> */}
                                </Dropdown>
                                </Panel> 

                                <Panel header="订单备注" key="2" style={{ maxHeight: '150px', fontWeight: 'bold'}}>
                                    <Input.TextArea rows={4} style={{maxHeight: '100px', overflow: 'auto'}}/>
                                </Panel>  

                        </Collapse>

                        {/* <Divider style={{margin: '12px 0'}}/> */}
                    
                        <Space align='center' style={{width: '100%', display: 'flex', justifyContent: 'flex-end'}}>
                            
                            <Text style={{display: 'flex', alignItems: "center"}}>
                            总计： <AxCoin size={22}/> <span style={{color: '#eb2f96'}}>{totalCost}</span>
                            </Text>
                            <Button type="primary">提交订单</Button>
                        </Space>
                    </div>
                </div>
        </>
    );
}


export default Ordering;