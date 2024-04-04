import React, { useCallback, useContext, useEffect, useState } from "react"
import useLocalStorage from "@/hooks/useLocalStorage"
import { LayoutProps } from "@/models/layout"
import AuthContext from "./auth"
import { checkoutAddLine, checkoutCreate, checkoutGetQuantity } from "@/services/checkout"
import { MessageContext } from "./message"

interface CartContextType {
    totalQuantity: number,
    addLines: (variantId : string, quantity : number) => {}
}

const CartContext = React.createContext<CartContextType>({
    totalQuantity: 0,
    addLines: (variantId : string, quantity : number) => false,
})

export const CartContextProvider = (props : LayoutProps) => {
    const [totalQuantity, setTotalQuantity] = useState<number>(0);
    const [checkoutId, setCheckoutId] = useLocalStorage<string | null>("checkoutId", null);
    const authCtx = useContext(AuthContext);
    const client = authCtx.client;
    const message = useContext(MessageContext);

    useEffect(()=>{
        if (checkoutId === null)
        {
            console.log("购物车 checkoutId 为空，新建 checkout！");
            checkoutCreate(client!, process.env.NEXT_PUBLIC_CHANNEL!)
                .then(data => {
                    setCheckoutId(data.id);
                    setTotalQuantity(data.quantity)
                })
                .catch(err => message.error(err));
        }
        else
        {
            checkoutGetQuantity(client!, checkoutId)
                .then(data => {
                    setTotalQuantity(data);
                })
                .catch(err => message.error(err));
        }
    });
  
    const addLines = useCallback((variantId : string, quantity : number) => {
        if (checkoutId === null)
        {
            message.error("系统出故障啦~刷新网页试试吧！");
            return {};
        }

        checkoutAddLine(client!, checkoutId, variantId, quantity)
            .then(data => {
                setTotalQuantity(data.quantity)
            })
            .catch(err => message.error(err));

        return true;//留着，万一之后要把错误处理交给caller
    }, []);

    const contextValue = {
        totalQuantity: totalQuantity,
        addLines: addLines,
    }

  return (
    <CartContext.Provider value={contextValue}>
      {props.children}
    </CartContext.Provider>
  )
}

export default CartContext