import React, { useCallback, useContext, useEffect, useState } from "react"
import useLocalStorage from "@/hooks/useLocalStorage"
import { LayoutProps } from "@/models/layout"
import AuthContext from "./auth"
import { checkoutAddLine, checkoutCreate, checkoutGetQuantity } from "@/services/checkout"
import { MessageContext } from "./message"
import { fetchUserCheckouts } from "@/services/user"
import useErrorMessage from "@/hooks/useErrorMessage";

interface CartContextType {
    totalQuantity: number,
    addLines: (variantId : string, quantity : number) => {},
    setTotalQuantity: (quantity: number) => void,
    setCheckoutId: (checkoutId: string | undefined) => void,
    checkoutId: string | undefined,
    incrCartError: () => void,
    doRefresh: () => void,
}

const CartContext = React.createContext<CartContextType>({
    totalQuantity: 0,
    addLines: (variantId : string, quantity : number) => false,
    setTotalQuantity: (quantity: number) => {},
    setCheckoutId: (checkoutId: string | undefined) => {},
    checkoutId: undefined,
    incrCartError: () => {},
    doRefresh: () => {},
})

export const CartContextProvider = (props : LayoutProps) => {
    const [totalQuantity, setTotalQuantity] = useState<number>(0);
    const [checkoutErrorCounter, setCheckoutErrorCounter] = useState<number>(0);
    const [checkoutId, setCheckoutId] = useLocalStorage<string | undefined>("checkoutId", undefined);
    const authCtx = useContext(AuthContext);
    const client = authCtx.client;
    const message = useContext(MessageContext);
    const { et } = useErrorMessage();

    const doRefresh = () => {
        if (checkoutId === undefined || checkoutId === "" || checkoutErrorCounter >= 3)
        {
            if (authCtx.isLoggedIn) {
                fetchUserCheckouts(client!, process.env.NEXT_PUBLIC_CHANNEL!)
                .then(data => {
                    setCheckoutErrorCounter(0);
                    if (!!data && data.length > 0) {
                        setCheckoutId(data[0]);
                        checkoutGetQuantity(client!, data[0])
                            .then(data => {
                                setTotalQuantity(data);
                            });
                    }
                    else {
                        checkoutCreate(client!, process.env.NEXT_PUBLIC_CHANNEL!)
                            .then(data => {
                                setCheckoutId(data.id);
                                setTotalQuantity(data.quantity)
                            });
                    }
                })
                .catch(err => {
                    if (checkoutErrorCounter < 3)
                        incrCartError();
                    else
                        console.log(err);
                });
            }
            // else {
            //     checkoutCreate(client!, process.env.NEXT_PUBLIC_CHANNEL!)
            //         .then(data => {
            //             setCheckoutId(data.id);
            //             setTotalQuantity(data.quantity)
            //         });
            // }
        }
        else
        {
            if (authCtx.isLoggedIn) {
                checkoutGetQuantity(client!, checkoutId)
                    .then(data => {
                        setCheckoutErrorCounter(0);
                        setTotalQuantity(data);
                    })
                    .catch(err => {
                        if (checkoutErrorCounter < 3)
                            incrCartError();
                        else
                            console.log(err);
                    });
            }
            else {
                setCheckoutId(undefined);
            }
        }
    }

    useEffect(()=>{
        doRefresh();
    }, [checkoutId, checkoutErrorCounter]);

    const incrCartError = () => {
        setCheckoutErrorCounter(prevValue => prevValue + 1);
    }
  
    const addLines = useCallback((variantId : string, quantity : number) => {
        if (checkoutId === undefined)
        {
            message.error("系统出故障啦~刷新网页试试吧！");
            return {};
        }

        checkoutAddLine(client!, checkoutId, variantId, quantity)
            .then(data => {
                setTotalQuantity(data.quantity)
            })
            .catch(err => message.error(et(`checkoutAddLine.${err.code}`)));

        return true;//留着，万一之后要把错误处理交给caller
    }, []);

    const setTotalQuantityOut = function(quantity: number) {
        setTotalQuantity(quantity);
    }

    const setCheckoutIdOut = function(checkoutId: string | undefined) {
        setCheckoutId(checkoutId);
    }

    const contextValue = {
        totalQuantity: totalQuantity,
        setTotalQuantity: setTotalQuantityOut,
        addLines: addLines,
        checkoutId: checkoutId,
        setCheckoutId: setCheckoutIdOut,
        incrCartError: incrCartError,
        doRefresh: doRefresh
    }

  return (
    <CartContext.Provider value={contextValue}>
      {props.children}
    </CartContext.Provider>
  )
}

export default CartContext