'use client'
import React from 'react';

const cartContext = React.createContext();

function findItem(list, comparator) {
    let index = -1, item = null
    list.forEach((e, i) => {
        if (comparator(e)) {
            index = i
            item = e
        }
    })
    return [index, item]
}

export const updateCartEvent = (id, quantity) => {
    return new CustomEvent(`updateCart${id}`, { detail: quantity })
};

export const removeFromCartEvent = (item) => new CustomEvent("removeFromCart", { detail: item });

export const CartProvider = ({ children }) => {
    const [cart, setCart] = React.useState({});
    const cartList = React.useMemo(() => Object.values(cart), [cart])

    const get = (id) => { 
        return cart[id]
    }

    const setQuantity = React.useCallback((id, quantity) => {
        cart[id].quantity = quantity
    }, [cart])

    const removeItem = React.useCallback((item) => {
        //console.log('remove', cart, item.id)
        if (cart[item.id])
            setCart((prev) => {
                let temp = { ...prev }
                delete temp[item.id]
                return {...temp}
            })
    }, [cart])

    const addItem = React.useCallback((item) => {
        //console.log('add', cart, item.id)
        if (cart[item.id])
            return
        setCart((prev) => {
            return { ...prev, [item.id]: { product: item, quantity: 1 } }
        })

    }, [cart])

    return (
        <cartContext.Provider value={{ get, cart, cartList, addItem, removeItem, setCart, setQuantity }}>
            {children}
        </cartContext.Provider>
    );
};

export const useCart = () => {
    return React.useContext(cartContext);
};