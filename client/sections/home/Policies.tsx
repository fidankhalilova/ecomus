import { Package, CreditCard, Headset, Repeat } from "lucide-react";

export default function Policies() {
  return (
    <div className="container mx-auto mt-15">
      <div className="grid grid-cols-4 gap-4">
        <div className="flex gap-4 items-center">
          <div className="border-2 rounded-full p-4">
            <Package size={45} />
          </div>
          <div className="flex flex-col gap-1">
            <h3 className="text-xl font-medium">Free Shipping</h3>
            <h4 className="text-md">Free shipping over order $120</h4>
          </div>
        </div>
        <div className="flex gap-4 items-center">
          <div className="border-2 rounded-full p-4">
            <CreditCard size={45} />
          </div>
          <div className="flex flex-col gap-1">
            <h3 className="text-xl font-medium">Flexible Payment</h3>
            <h4 className="text-md">Pay with Multiple Credit Cards</h4>
          </div>
        </div>
        <div className="flex gap-4 items-center">
          <div className="border-2 rounded-full p-4">
            <Repeat size={45} />
          </div>
          <div className="flex flex-col gap-1">
            <h3 className="text-xl font-medium">14 Day Returns</h3>
            <h4 className="text-md">Within 30 days for an exchange</h4>
          </div>
        </div>
        <div className="flex gap-4 items-center">
          <div className="border-2 rounded-full p-4">
            <Headset size={45} />
          </div>
          <div className="flex flex-col gap-1">
            <h3 className="text-xl font-medium">Premium Support</h3>
            <h4 className="text-md">Outstanding premium support</h4>
          </div>
        </div>
      </div>
    </div>
  );
}
