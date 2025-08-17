import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useDispatch } from "react-redux";
import {
  addToCart,
  decrementQuantity,
  removeFromCart,
} from "@/lib/features/cartSlice";

function CartItem({ item }) {
  const dispatch = useDispatch();

  return (
    <Card className="p-4">
      <div className="flex items-center space-x-4">
        <img
          src={item.product.image || "/placeholder.svg"}
          alt={item.product.name}
          className="w-16 h-16 object-cover rounded"
        />
        <div className="flex-1">
          <p className="font-medium">{item.product.name}</p>
          <p className="text-muted-foreground">${item.product.price}</p>
          <div className="flex items-center space-x-2 mt-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => dispatch(decrementQuantity(item.product._id))}
            >
              -
            </Button>
            <span className="text-sm">{item.quantity}</span>
            <Button
              variant="outline"
              size="icon"
              onClick={() => dispatch(addToCart(item.product))}
            >
              +
            </Button>
            <Button
              variant="ghost"
              onClick={() => dispatch(removeFromCart(item.product._id))}
            >
              Remove
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}

export default CartItem;
