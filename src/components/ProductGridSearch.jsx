const ProductGridSearch = ({ products, onAddToCart }) => {
    if (!products || products.length === 0) {
        return (
            <p className="text-center text-gray-500">Pesanan tidak ditemukan 😕</p>
        );
    }

    return (
        <div className="space-y-4">
            {products.map((product) => {
                const isFinishedTab = product.isDone === true;

                return (
                    <div
                        key={product._id}
                        className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4"
                    >
                        <div className="mb-2">
                            <p><span className="font-semibold">Order ID:</span> {product.order_id}</p>
                            <p><span className="font-semibold">Nama:</span> {product.username}</p>
                            <p><span className="font-semibold">Meja:</span> {product.meja}</p>
                            <p><span className="font-semibold">Status Pembayaran:</span> {product.status}</p>
                        </div>

                        <div className="mb-2">
                            <p className="font-semibold mb-1">Items:</p>
                            <ul className="list-disc list-inside text-sm">
                                {product.items?.map((item, idx) => (
                                    <li key={idx}>
                                        {item.judul} x {item.quantity}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="mb-2">
                            <p className="font-semibold">Total: Rp {product.totalHarga}</p>
                        </div>

                        <button
                            onClick={() => onAddToCart(product)}
                            disable={isFinishedTab}
                            className={`mt-2 px-3 py-1 rounded-lg text-sm
                                ${isFinishedTab ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                    : 'bg-green-500 hover:bg-green-600 text-white'
                                }`}
                        >
                            Done
                        </button>
                    </div>
                );
            })}
        </div>
    );
};

export default ProductGridSearch;
