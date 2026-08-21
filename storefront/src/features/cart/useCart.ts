import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
    addCartItem,
    applyCoupon,
    extractErrorMessage,
    getCart,
    removeCartItem,
    removeCoupon,
    updateCartItem,
} from "./cartApi";
import { useUIStore } from "../../lib/uiStore";

const CART_QUERY_KEY = ["cart"];

export function useCart() {
    const queryClient = useQueryClient();
    const showToast = useUIStore((s) => s.showToast);
    const openCart = useUIStore((s) => s.openCart);

    const cartQuery = useQuery({
        queryKey: CART_QUERY_KEY,
        queryFn: getCart,
    });

    function invalidate() {
        queryClient.invalidateQueries({ queryKey: CART_QUERY_KEY });
    }

    const addItem = useMutation({
        mutationFn: ({
            productId,
            quantity,
            productVariantId,
        }: {
            productId: number;
            quantity: number;
            productVariantId?: number;
        }) => addCartItem(productId, quantity, productVariantId),
        onSuccess: (cart) => {
            queryClient.setQueryData(CART_QUERY_KEY, cart);
            showToast("Se agregó al carrito.");
            openCart();
        },
        onError: (error) => {
            showToast(extractErrorMessage(error, "No se pudo agregar el producto."), "error");
        },
    });

    const updateItem = useMutation({
        mutationFn: ({ itemId, quantity }: { itemId: number; quantity: number }) =>
            updateCartItem(itemId, quantity),
        onSuccess: (cart) => queryClient.setQueryData(CART_QUERY_KEY, cart),
        onError: (error) => {
            showToast(extractErrorMessage(error, "No se pudo actualizar la cantidad."), "error");
            invalidate();
        },
    });

    const removeItem = useMutation({
        mutationFn: (itemId: number) => removeCartItem(itemId),
        onSuccess: (cart) => queryClient.setQueryData(CART_QUERY_KEY, cart),
    });

    const applyCouponCode = useMutation({
        mutationFn: (code: string) => applyCoupon(code),
        onSuccess: (cart) => {
            queryClient.setQueryData(CART_QUERY_KEY, cart);
            showToast("Cupón aplicado.");
        },
        onError: (error) => {
            showToast(extractErrorMessage(error, "Ese cupón no es válido."), "error");
        },
    });

    const removeCouponCode = useMutation({
        mutationFn: removeCoupon,
        onSuccess: (cart) => queryClient.setQueryData(CART_QUERY_KEY, cart),
    });

    return {
        cart: cartQuery.data,
        isLoading: cartQuery.isLoading,
        refetch: cartQuery.refetch,
        addItem,
        updateItem,
        removeItem,
        applyCouponCode,
        removeCouponCode,
    };
}
