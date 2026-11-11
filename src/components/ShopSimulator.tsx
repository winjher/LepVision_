import React, { useState } from 'react';
import { ShoppingCart, Calendar, Check, AlertTriangle, ShieldCheck, MapPin, Users, HeartHandshake } from 'lucide-react';

const SPECIES = [
  { name: 'Butterfly-Batwing', common: 'Batwing', price: 65, colors: ['#7b2d26', '#e8b04a'] },
  { name: 'Butterfly-Clippers', common: 'Clippers', price: 55, colors: ['#8a6d3b', '#f2e3b3'] },
  { name: 'Butterfly-Common Jay', common: 'Common Jay', price: 45, colors: ['#2b2b2b', '#6fd3c6'] },
  { name: 'Butterfly-Common Lime', common: 'Common Lime', price: 40, colors: ['#7a6a3a', '#e7d85a'] },
  { name: 'Butterfly-Common Mime', common: 'Common Mime', price: 50, colors: ['#222222', '#ffffff'] },
  { name: 'Butterfly-Common Mormon', common: 'Common Mormon', price: 45, colors: ['#222222', '#ffffff'] },
  { name: 'Butterfly-Emerald Swallowtail', common: 'Emerald Swallowtail', price: 75, colors: ['#1b3a2a', '#3ddc84'] },
  { name: 'Butterfly-Giant Silk Moth', common: 'Giant Silk Moth', price: 90, colors: ['#8b5a2b', '#e3b778'] },
  { name: 'Butterfly-Golden Birdwing', common: 'Golden Birdwing', price: 110, colors: ['#111111', '#f5c518'] },
  { name: 'Butterfly-Great Eggfly', common: 'Great Eggfly', price: 55, colors: ['#2a2a55', '#ffffff'] },
  { name: 'Butterfly-Paper Kite', common: 'Paper Kite', price: 60, colors: ['#111111', '#ffffff'] },
  { name: 'Butterfly-Pink Rose', common: 'Pink Rose', price: 70, colors: ['#222222', '#e84a7f'] },
  { name: 'Butterfly-Plain Tiger', common: 'Plain Tiger', price: 40, colors: ['#c8641e', '#f1a24a'] },
  { name: 'Butterfly-Red Lacewing', common: 'Red Lacewing', price: 65, colors: ['#7a1010', '#e53935'] },
  { name: 'Butterfly-Scarlet Mormon', common: 'Scarlet Mormon', price: 60, colors: ['#111111', '#d62020'] },
  { name: 'Butterfly-Tailed Jay', common: 'Tailed Jay', price: 48, colors: ['#1f2a1f', '#9be37f'] }
];

const FARMS = [
  { name: 'JCM Butterfly Breeding Farm', loc: 'Cawit, Boac, Marinduque', price: 150, seats: 20 },
  { name: 'La Anton Insects & Butterfly Farm', loc: 'Cawit, Boac, Marinduque', price: 150, seats: 20 },
  { name: "Lorica's Butterfly Breeding Farm", loc: 'Bunganay, Boac, Marinduque', price: 150, seats: 20 },
  { name: 'Lyra-Ysabelle Butterfly', loc: 'Cawit, Boac, Marinduque', price: 150, seats: 20 },
  { name: 'Saluciana Integrated & Butterfly Farm', loc: 'Sta. Cruz, Marinduque', price: 150, seats: 20 }
];

export const ShopSimulator: React.FC = () => {
  const [cart, setCart] = useState<{ [key: string]: number }>({});
  const [selectedFarm, setSelectedFarm] = useState<string>(FARMS[0].name);
  const [visitPax, setVisitPax] = useState<number>(2);
  const [bookingSuccess, setBookingSuccess] = useState<boolean>(false);
  const [orderSuccess, setOrderSuccess] = useState<boolean>(false);

  const addToCart = (speciesName: string) => {
    setCart((prev) => ({
      ...prev,
      [speciesName]: (prev[speciesName] || 0) + 10
    }));
  };

  const removeFromCart = (speciesName: string) => {
    setCart((prev) => {
      const copy = { ...prev };
      delete copy[speciesName];
      return copy;
    });
  };

  const totalCartPrice = Object.entries(cart).reduce((sum, [spName, qty]) => {
    const item = SPECIES.find((s) => s.name === spName);
    return sum + (item ? item.price * qty : 0);
  }, 0);

  const totalCartCount = Object.values(cart).reduce((a, b) => a + b, 0);

  const farmObj = FARMS.find((f) => f.name === selectedFarm) || FARMS[0];
  const visitTotal = farmObj.price * visitPax;

  return (
    <div className="space-y-6">
      {/* Hero */}
      <div className="bg-gradient-to-r from-purple-700 via-indigo-600 to-pink-600 rounded-2xl p-6 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-purple-200">
            Export Grade Butterfly Pupae & Farm Tours
          </span>
          <h2 className="text-2xl font-black mt-1">Butterfly Pupae Marketplace & Park</h2>
          <p className="text-xs md:text-sm text-purple-100 max-w-xl mt-1">
            Browse registered Marinduque breeding farms, order verified fresh pupae (within 2 days of pupation), and reserve farm tours.
          </p>
        </div>

        <div className="bg-white/15 backdrop-blur-md px-4 py-3 rounded-2xl border border-white/20 flex items-center gap-3 w-fit">
          <ShoppingCart className="w-6 h-6 text-pink-300" />
          <div>
            <div className="text-xs text-purple-200 font-medium">Your Cart</div>
            <div className="text-lg font-extrabold text-white">
              {totalCartCount} pupae · ₱{totalCartPrice.toFixed(2)}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Marketplace Grid (2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-gray-900 text-base flex items-center gap-2">
              <span>🛍 Fresh Export Pupae Catalog</span>
              <span className="text-xs font-normal text-gray-500">(16 Philippine Species)</span>
            </h3>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> QA Passed
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {SPECIES.map((sp) => {
              const qtyInCart = cart[sp.name] || 0;
              return (
                <div
                  key={sp.name}
                  className="bg-white border border-gray-200 rounded-2xl p-3.5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    {/* Visual Wing Mockup */}
                    <div
                      className="h-16 rounded-xl flex items-center justify-center mb-2.5 relative overflow-hidden"
                      style={{
                        background: `linear-gradient(135deg, ${sp.colors[0]} 0%, #1e1b3a 100%)`
                      }}
                    >
                      <span className="text-2xl filter drop-shadow">🦋</span>
                      <span
                        className="absolute bottom-1 right-2 text-[9px] font-bold px-1.5 py-0.5 rounded text-black font-mono"
                        style={{ backgroundColor: sp.colors[1] }}
                      >
                        {sp.common}
                      </span>
                    </div>

                    <h4 className="font-bold text-gray-900 text-xs truncate">{sp.common}</h4>
                    <div className="text-purple-700 font-black text-sm mt-0.5">
                      ₱{sp.price.toFixed(2)}{' '}
                      <span className="text-[10px] text-gray-400 font-normal">/ pupa</span>
                    </div>
                  </div>

                  <div className="mt-3 pt-2 border-t border-gray-100 flex items-center justify-between gap-2">
                    {qtyInCart > 0 ? (
                      <div className="flex items-center justify-between w-full">
                        <span className="text-xs font-bold text-emerald-700">
                          {qtyInCart} in cart
                        </span>
                        <button
                          onClick={() => removeFromCart(sp.name)}
                          className="text-xs text-red-500 hover:text-red-700 font-semibold cursor-pointer"
                        >
                          Remove
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => addToCart(sp.name)}
                        className="w-full py-1.5 px-3 bg-purple-50 hover:bg-purple-100 text-purple-700 font-bold text-xs rounded-xl border border-purple-200 transition-all cursor-pointer"
                      >
                        + Add 10 Pupae
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Sidebar: Cart & Farm Tour Request */}
        <div className="space-y-6">
          {/* Order Checkout Box */}
          <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm space-y-3">
            <h3 className="font-bold text-gray-900 text-sm flex items-center gap-2">
              <ShoppingCart className="w-4 h-4 text-purple-600" /> Pupae Order Summary
            </h3>

            {totalCartCount > 0 ? (
              <div className="space-y-2">
                <div className="max-h-40 overflow-y-auto space-y-1.5 pr-1 text-xs">
                  {Object.entries(cart).map(([spName, qty]) => {
                    const item = SPECIES.find((s) => s.name === spName);
                    const linePrice = item ? item.price * qty : 0;
                    return (
                      <div key={spName} className="flex justify-between items-center text-gray-700">
                        <span>
                          {item?.common} × {qty}
                        </span>
                        <span className="font-bold">₱{linePrice.toFixed(2)}</span>
                      </div>
                    );
                  })}
                </div>

                <div className="pt-2 border-t border-gray-200 flex justify-between font-extrabold text-sm text-gray-900">
                  <span>Total Due:</span>
                  <span className="text-purple-700">₱{totalCartPrice.toFixed(2)}</span>
                </div>

                <button
                  onClick={() => {
                    setOrderSuccess(true);
                    setCart({});
                    setTimeout(() => setOrderSuccess(false), 4000);
                  }}
                  className="w-full py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold rounded-xl text-xs shadow transition-all cursor-pointer mt-2"
                >
                  Place Order (GCash Pipeline)
                </button>
              </div>
            ) : (
              <p className="text-xs text-gray-400 py-3 text-center">Your pupae cart is empty.</p>
            )}

            {orderSuccess && (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs p-2.5 rounded-xl flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>Order placed! Sellers notified via GCash reference pipeline.</span>
              </div>
            )}
          </div>

          {/* Farm Visit Booking */}
          <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm space-y-3">
            <h3 className="font-bold text-gray-900 text-sm flex items-center gap-2">
              <Calendar className="w-4 h-4 text-pink-600" /> Book a Butterfly Farm Visit
            </h3>

            <div className="space-y-2 text-xs">
              <div>
                <label className="text-gray-600 font-semibold block mb-1">Select Farm:</label>
                <select
                  value={selectedFarm}
                  onChange={(e) => setSelectedFarm(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-2.5 py-1.5 text-xs text-gray-800"
                >
                  {FARMS.map((f) => (
                    <option key={f.name} value={f.name}>
                      {f.name} (₱{f.price}/pax)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-gray-600 font-semibold block mb-1">Visitors (Pax):</label>
                <input
                  type="number"
                  min="1"
                  max={farmObj.seats}
                  value={visitPax}
                  onChange={(e) => setVisitPax(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-2.5 py-1.5 text-xs text-gray-800"
                />
              </div>

              <div className="bg-purple-50 p-2.5 rounded-xl flex justify-between font-bold text-purple-900">
                <span>Total Visit Fee:</span>
                <span>₱{visitTotal.toFixed(2)}</span>
              </div>

              <button
                onClick={() => {
                  setBookingSuccess(true);
                  setTimeout(() => setBookingSuccess(false), 4000);
                }}
                className="w-full py-2 bg-pink-600 hover:bg-pink-700 text-white font-bold rounded-xl text-xs transition-all cursor-pointer"
              >
                Send Visit Request
              </button>

              {bookingSuccess && (
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs p-2 rounded-xl flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>Request submitted to {farmObj.name}!</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
