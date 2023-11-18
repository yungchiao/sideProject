import { observer } from "mobx-react-lite";
import { appStore } from "../../AppStore";
const Cart: React.FC = observer(() => {
  const cartItems = appStore.getCart();

  return (
    <div>
      <h1>aa</h1>
      {cartItems.map((item, index) => (
        <div key={index}>
          <p>{item.name}</p>
          <p>數量: {item.quantity}</p>
          <p>價格: NT${item.price}元</p>
        </div>
      ))}
    </div>
  );
});

export default Cart;
