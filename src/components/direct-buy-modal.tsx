import AuthContext from "@/contexts/auth";
import CartContext from "@/contexts/cart";
import { MessageContext } from "@/contexts/message";
import { CheckoutDetail } from "@/models/checkout";
import { checkoutAddLine, checkoutAddressUpdate, checkoutBillingAddressUpdate, checkoutComplete, checkoutCreate, checkoutFind, checkoutShippingMethodUpdate } from "@/services/checkout";
import { Button, Flex, Modal, Progress } from "antd";
import React, { useContext } from "react";
import { useEffect } from "react";
import { Space, Typography } from 'antd';
import { useRouter } from "next/router";
import { ProductDetail, VarientDetail } from "@/models/products";
import useErrorMessage from "@/hooks/useErrorMessage";
import { fetchUserAddresses } from "@/services/user";
const { Text, Link } = Typography;

interface DirectBuyModalProps {
    checkoutId: string;
    isopen: boolean;
    onClose: () => void;
}

export const DirectBuyModal: React.FC<DirectBuyModalProps> = (props) => {
    const authCtx = useContext(AuthContext);
    const cartCtx = useContext(CartContext);
    const client = authCtx.client;
    const message = useContext(MessageContext);
    const router = useRouter();
    const { et } = useErrorMessage();

    const [process, setProcess] = React.useState<number>(0);
    const [processStatus, setProcessStatus] = React.useState<"exception" | undefined>(undefined);
    const [processInfo, setProcessInfo] = React.useState<string>("");
    
    const useAsyncEffect = (effectFunction: { (): Promise<void>; (): void; }, cleanupFunction: any, dependencies: React.DependencyList | undefined) => {
      useEffect(() => {
        effectFunction();
        return cleanupFunction;
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, dependencies);
    };

    useAsyncEffect(async () => {
        if (!props.isopen) return;
        setProcess(0);
        setProcessStatus(undefined);
        setProcessInfo("正在处理中……");
        try
        {
            var checkoutDetail = await checkoutFind(
                client!,
                props.checkoutId
            );
        }
        catch(err)
        {
            setProcessStatus("exception");
            setProcessInfo("订单不存在");
            console.log(err)
            return;
        }
        setProcess(25);
        try
        {
            if (!checkoutDetail.availableShippingMethods) {
                setProcessStatus("exception");
                setProcessInfo("未找到收货方式");
                return;
            }
            var res5 = await checkoutShippingMethodUpdate(
                client!, 
                checkoutDetail.id, 
                checkoutDetail.availableShippingMethods![0].id
            );
        }
        catch(err)
        {
            setProcessStatus("exception");
            setProcessInfo("设置收货方式失败");
            console.log(err)
            return;
        }
        setProcess(50);
        try
        {
            if (!checkoutDetail.shippingAddress) {
                setProcessStatus("exception");
                setProcessInfo("未设置收货方式");
                return;
            }
            var res6 = await checkoutBillingAddressUpdate(
                client!, 
                checkoutDetail.id, 
                checkoutDetail.shippingAddress
            );
        }
        catch(err)
        {
            setProcessStatus("exception");
            setProcessInfo("设置收货方式失败");
            console.log(err)
            return;
        }
        setProcess(75);
        try
        {
            var res7 = await checkoutComplete(
                client!, 
                checkoutDetail.id
            );
            cartCtx.setCheckoutId(undefined);
        }
        catch(err)
        {
            setProcessStatus("exception");
            setProcessInfo("下单失败");
            console.log(err)
            return;
        }
        setProcess(100);
        setProcessInfo("下单成功，正在跳转……");
        router.push(`/order/detail?id=${res7}&autopay=true`)

    }, () => {}, [props.isopen]);

    return (
        <Modal
            open={props.isopen}
            title="正在处理订单"
            footer={null}
            keyboard={false}
            maskClosable={false}
            onCancel={props.onClose}
            width={240}
        >
            <Flex align="center" justify="center" vertical={true} style={{
                marginTop: "24px"
            }}>
                <Progress type="circle" percent={process} status={processStatus}/>
                <Text style={{
                    marginTop: "12px"
                }}>{processInfo}</Text>
            </Flex>
        </Modal>
    );
}