import {Col, Row, List, Divider, InputNumber, Typography, Image, Button, Input, Collapse, Menu, Dropdown, Space} from 'antd';
import { DownOutlined, EllipsisOutlined } from '@ant-design/icons';
import {AxCoin} from "@/components/axcoin";
import React from "react";
import { useState } from 'react';
import { useEffect } from 'react';
import {ProductSummary} from "@/models/products";
const { Title, Text, Link } = Typography;
const { Panel } = Collapse;
// import {product} from "@/pages/order"

export interface OrderPanelProps {
    totalCost: number;
}


// export const Ordering = () => {
//     const data = [
//         getProductSummary(1, 1),
//         getProductSummary(2, 4),
//     ];
    
//      const [selectedAddress, setSelectedAddress] = useState<{ name: string; phone: string; address: string; } | null>(null);
//      // 假设data是你的商品数据数组
//      const [totalCost, setTotalCost] = useState(0);

//      // 计算总价
//      const calculateTotalCost = () => {
//          const total = data.reduce((acc, item) => {
//              return acc + (item.cost * item.itemNumber);
//          }, 0);
//          setTotalCost(total);
//      };

//       // 在组件挂载时计算总价
//     useEffect(() => {
//         calculateTotalCost();
//         if (addresses.length > 0 && !selectedAddress) {
//             setSelectedAddress(addresses[0]);
//         }
//     }, [selectedAddress]);


//     const addresses = [
//         {
//           name: '谢委屈华',
export const OrderPanel: React.FC<OrderPanelProps> = ({totalCost}) => {
    // 下单界面右边的收货人信息、备注、总计、确认订单的面板
    const [selectedAddress, setSelectedAddress] = useState<{ name: string; phone: string; address: string; } | null>(null);
    const addresses = [
        {
          name: '李一',
          phone: ' 18845678910',
          address: '上海交通大学闵行校区思源湖'
        },
        {
          name: '李二',
          phone: ' 18845678910',
          address: '上海交通大学闵行校区思源湖'
        },
        {
          name: '李三',
          phone: ' 18845678910',
          address: '上海交通大学闵行校区思源湖'
        },
        {
          name: '李四',
          phone: ' 18845678910',
          address: '上海交通大学闵行校区思源湖'
        },
        {
          name: '李五',
          phone: ' 18845678910',
          address: '上海交通大学闵行校区思源湖'
        },
        // 添加更多地址
      ];

      const handleAddressClick = (address: { name: string, phone: string, address: string }) => {
        setSelectedAddress(address); // 更新选中的地址
    };
      

    const filteredAddresses = addresses.filter(address => address !== selectedAddress);
    
    const menu = (
       <Menu style={{ maxHeight: "220px", maxWidth: "200px", overflowY: "auto" }}>
         {filteredAddresses.map((address, index) => (
           <Menu.Item key={index} onClick={() => handleAddressClick(address)}>
             <p style={{ maxHeight: "300px", overflow: "auto" }}>
               <span>{address.name}</span>
               <span>{address.phone}</span>
               <br />
               <span style={{ fontSize: "12px", color: "#888", overflow: "hidden", textOverflow: "ellipsis" }}>{address.address}</span>
             </p>
           </Menu.Item>
         ))}
       </Menu>
     );

    // 在组件挂载时计算总价
    useEffect(() => {
      if (addresses.length > 0 && !selectedAddress) {
          setSelectedAddress(addresses[0]);
      }
  }, [selectedAddress]);
     
      
 
    
    return (
        <>
               <div className={"container"}>
                    <div> 
                        {/* 地址 */}
                        

                                <Collapse defaultActiveKey={["1"]} style={{ marginBottom: "13px" }} ghost size="small">
                                    <Panel header="收货人信息：" key="1" style={{ maxHeight: "300px", textOverflow: "ellipsis", fontWeight: "bold" }}>
                                    <Dropdown overlay={menu} trigger={["click"]}>
                                        {/* 点击选择更多地址 */}
                                        
                                        <Button type="text" style={{ maxWidth: "14vw", maxHeight: "300px", overflow: "auto", fontWeight: "lighter", height: "auto" }}>
                                        <Space>
                                            <Space direction="vertical" size="small" style={{ textAlign: "left" }}>
                                                <Space>
                                                    <span>{selectedAddress ? selectedAddress.name : "请选择地址"}</span>
                                                    <span>{selectedAddress ? selectedAddress.phone : ""}</span>
                                                </Space>
                                            <span style={{ fontSize: "12px", color: "#888", overflow: "hidden", textOverflow: "ellipsis" }}>{selectedAddress ? selectedAddress.address : ""}</span>
                                            
                                            </Space>                                                                                 
                                            <EllipsisOutlined />
                                        </Space>  
                                        </Button>
                                           
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


export default OrderPanel;