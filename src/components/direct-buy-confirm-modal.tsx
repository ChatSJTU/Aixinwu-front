import AuthContext from "@/contexts/auth";
import CartContext from "@/contexts/cart";
import { MessageContext } from "@/contexts/message";
import { CheckoutCreateResult, CheckoutDetail } from "@/models/checkout";
import { checkoutAddLine, checkoutAddressUpdate, checkoutBillingAddressUpdate, checkoutComplete, checkoutCreate, checkoutShippingMethodUpdate } from "@/services/checkout";
import { Button, Dropdown, Flex, Menu, Modal, Progress } from "antd";
import React, { useContext, useState } from "react";
import { useEffect } from "react";
import { Space, Typography } from 'antd';
import { useRouter } from "next/router";
import { ProductDetail, VarientDetail } from "@/models/products";
import useErrorMessage from "@/hooks/useErrorMessage";
import { fetchUserAddresses } from "@/services/user";
import { AddressInfo } from "@/models/address";
import { EllipsisOutlined } from '@ant-design/icons';
import { AxCoin } from "./axcoin";
const { Title, Text, Link, Paragraph } = Typography;

interface DirectBuyConfirmModalProps {
    isopen: boolean;
    product: ProductDetail;
    varient: VarientDetail;
    count: number;
    onCancel: () => void;
    onOk: (checkoutId: string) => void;
}

export const DirectBuyConfirmModal: React.FC<DirectBuyConfirmModalProps> = (props) => {
    const authCtx = useContext(AuthContext);
    const cartCtx = useContext(CartContext);
    const client = authCtx.client;
    const message = useContext(MessageContext);
    const router = useRouter();
    const { et } = useErrorMessage();

    const [selectedAddress, setSelectedAddress] = useState<AddressInfo | undefined>(undefined);
    const [addresses, setAddresses] = useState<AddressInfo[]>([]);

    const [checkout, setCheckout] = useState<CheckoutCreateResult | undefined>(undefined);
    
    const useAsyncEffect = (effectFunction: { (): Promise<void>; (): void; }, cleanupFunction: any, dependencies: React.DependencyList | undefined) => {
      useEffect(() => {
        effectFunction();
        return cleanupFunction;
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, dependencies);
    };

    useEffect(() => {
        if (!props.isopen) return;
        fetchUserAddresses(client!)
            .then(data => setAddresses(data))
            .catch(err => message.error(err));
    }, [props.isopen]);

    useEffect(() => {
        if (!addresses || addresses.length == 0)
            return;
        if (checkout == undefined || !checkout.isShippingRequired)
            return;
        if (selectedAddress == undefined) {
            if (checkout?.shippingAddress == undefined)
            {
                updateSelectedAddress(addresses.find(x=>x.isDefaultShippingAddress)!);
            }
            else
            {
                setSelectedAddress(checkout?.shippingAddress);
            }
        }
    }, [checkout, addresses]);

    useAsyncEffect(async () => {
        if (!props.isopen) return;
        try
        {
            var checkout = await checkoutCreate(
                client!, 
                props.product.channel
            );
        }
        catch(err)
        {
            message.error("创建购物车失败");
            console.log(err)
            return;
        }
        try
        {
            var res2 = await checkoutAddLine(
                client!, 
                checkout.id,
                props.varient.id,
                props.count
            );
        }
        catch(err: any)
        {
            message.error(et(`checkoutAddLine.${err.code}`));
            console.log(err.code)
            return;
        }
        setCheckout(res2);
    }, () => {}, [props.isopen]);

    const updateSelectedAddress = (addr: AddressInfo) => {
        if (checkout == undefined)
        {
            return;
        }
        checkoutAddressUpdate(client!, checkout.id, addr)
            .then(data => { setSelectedAddress(addr); setCheckout(data); })
            .catch(err => message.error(err));
    }

    const handleAddressClick = (addr: AddressInfo) => {
        updateSelectedAddress(addr);
    };

    const handleOkClick = () => {
        if (checkout == undefined)
        {
            message.error("订单准备中……")
            return;
        }
        if (checkout.shippingAddress == undefined)
        {
            message.error("请先选择收货地址")
            return;
        }
        props.onOk(checkout.id);
    }

    const addressMenu = (
        <Menu style={{ maxHeight: "240px", overflowY: "auto" }}>
          {addresses.map((address, index) => (
            <Menu.Item key={index} onClick={() => handleAddressClick(address)}>
              <p style={{ maxHeight: "300px", overflow: "auto" }}>
                <span>{address.firstName}</span>
                <span>{address.phone}</span>
                <br />
                <span style={{ fontSize: "12px", color: "#888", overflow: "hidden", textOverflow: "ellipsis" }}>{address.streetAddress1}</span>
              </p>
            </Menu.Item>
          ))}
        </Menu>
    );

    return (
        <Modal
            open={props.isopen}
            title="订单创建确认"
            okText="继续"
            cancelText="取消"
            keyboard={false}
            maskClosable={false}
            onCancel={props.onCancel}
            onOk={handleOkClick}
            okButtonProps={{ disabled: (checkout == undefined) }}
            width={320}
        >
            <div style={{marginTop: '12px'}}>
                <Typography>
                    <Paragraph>
                        {'即将购买 '}
                        <Text strong>
                        {props.product?.name}
                        {props.varient && `（${props.varient.name}）`}
                        {'×'}
                        {props.count}
                        </Text>
                    </Paragraph>
                    {
                        checkout && 
                        <Paragraph>
                            <span>
                            {'总金额：'}
                            <AxCoin coloredValue value={checkout.totalPrice.gross.amount}></AxCoin>
                            </span>
                        </Paragraph>
                    }
                    <Paragraph>收货地址：</Paragraph>
                </Typography>
                <Dropdown
                    overlay={addressMenu}
                    trigger={["click"]}
                    >
                    <Button
                        type="text"
                        style={{ 
                            width: '100%', 
                            height: "auto", 
                            overflow:'hidden', 
                            textOverflow: "ellipsis"
                        }}
                    >
                        <Flex justify='space-between' style={{width: '100%'}}>
                            <Space direction="vertical" size="small" style={{ textAlign: "left", textOverflow:'ellipsis' }}>
                                {
                                    selectedAddress ?
                                        <Space>
                                            <span>{selectedAddress.firstName}</span>
                                            <span>{selectedAddress.phone}</span>
                                        </Space> : <span>{"请选择地址"}</span>
                                }
                            {
                                selectedAddress && (
                                    <Paragraph style={{ 
                                        fontSize: "12px", 
                                        color: "gray", 
                                        whiteSpace:'pre-wrap',
                                        marginBottom:'4px'
                                        }}
                                        ellipsis={{rows:2, expandable:false}}>
                                        {selectedAddress.streetAddress1}
                                    </Paragraph>
                                )
                            }
                            </Space>                                                                                 
                            <EllipsisOutlined/>
                        </Flex>  
                        </Button>
                    </Dropdown>
            </div>
        </Modal>
    );
}