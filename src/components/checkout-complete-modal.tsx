import AuthContext from "@/contexts/auth";
import CartContext from "@/contexts/cart";
import { MessageContext } from "@/contexts/message";
import { CheckoutDetail } from "@/models/checkout";
import { checkoutBillingAddressUpdate, checkoutComplete, checkoutEmailUpdate, checkoutShippingMethodUpdate } from "@/services/checkout";
import { Button, Flex, Modal, Progress } from "antd";
import React, { useContext } from "react";
import { useEffect } from "react";
import { Space, Typography } from 'antd';
import { useRouter } from "next/router";
const { Text, Link } = Typography;

interface CheckoutCompleteModalProps {
    isopen: boolean;
    checkout: CheckoutDetail;
    onClose: () => void;
}

export const CheckoutCompleteModal: React.FC<CheckoutCompleteModalProps> = (props) => {
    const authCtx = useContext(AuthContext);
    const cartCtx = useContext(CartContext);
    const client = authCtx.client;
    const message = useContext(MessageContext);
    const router = useRouter();
    
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
            if (!props.checkout.availableShippingMethods) {
                setProcessStatus("exception");
                setProcessInfo("未找到收货方式");
                return;
            }
            var res1 = await checkoutShippingMethodUpdate(client!, props.checkout.id, props.checkout.availableShippingMethods![0].id);
        }
        catch(err)
        {
            setProcessStatus("exception");
            setProcessInfo("设置收货方式失败");
            console.log(err)
            return;
        }
        setProcess(25);
        try
        {
            if (!props.checkout.shippingAddress) {
                setProcessStatus("exception");
                setProcessInfo("未设置收货方式");
                return;
            }
            var res2 = await checkoutBillingAddressUpdate(client!, props.checkout.id, props.checkout.shippingAddress);
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
            if (!authCtx.userInfo?.email) {
                setProcessStatus("exception");
                setProcessInfo("未找到用户邮箱地址");
                return;
            }
            var res3 = await checkoutEmailUpdate(client!, props.checkout.id, authCtx.userInfo?.email);
        }
        catch(err)
        {
            setProcessStatus("exception");
            setProcessInfo("设置邮箱地址失败");
            console.log(err)
            return;
        }
        setProcess(75);
        try
        {
            var res4 = await checkoutComplete(client!, props.checkout.id);
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
        router.push(`/order/detail?id=${res4}&autopay=true`)

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