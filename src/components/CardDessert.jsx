import { useEffect, useState } from "react";
import { FaPlusCircle } from "react-icons/fa";
import { addItemToCart } from "../redux/keranjang/keranjangSlice";
import { useDispatch } from 'react-redux';

const CardDessert = ({ products, isFiltered }) => {
    const [dessertCount, setDessertCount] = useState([]);
    const dispatch = useDispatch();
    const [popupItem, setPopupItem] = useState(null);
    const [selectedJenis, setSelectedJenis] = useState('');
    const [selectedTipe, setSelectedTipe] = useState('');

    //mengambil data menu kategori dessert
    useEffect(() => {
        const getMenu = async () => {
            try {
                const res = await fetch("/api/post/getposts");
                const data = await res.json();
                const makananFilter = data.posts.filter(products => products.category === "Dessert");
                setDessertCount(makananFilter);
            } catch (err) {
                console.error("Gagal ambil data menu:", err);
            }
        };

        getMenu();
    }, []);

    //fungsi jika ada tipe dan jenis
    const handleAddToCart = async (product) => {
        const hasJenis = product.jenis?.panas || product.jenis?.dingin;
        const hasTipe = product.tipe?.houseBlend || product.tipe?.singelOrigin;

        if (hasJenis || hasTipe) {
            setPopupItem(product);
            setSelectedJenis('');
            setSelectedTipe('');
        } else {
            addProductToCart(product, product.harga, null, null);
        }
    };

    //jika ada jenis dan tipe, fungsi ini jalan
    const handleConfirmAdd = () => {
        if (!selectedJenis && popupItem?.jenis && (popupItem.jenis.panas || popupItem.jenis.dingin)) {
            alert("Pilih jenis terlebih dahulu!");
            return;
        }
        if (!selectedTipe && popupItem?.tipe && (popupItem.tipe.houseBlend || popupItem.tipe.singelOrigin)) {
            alert("Pilih tipe terlebih dahulu!");
            return;
        }

        const harga = popupItem.jenis?.[selectedJenis] || popupItem.tipe?.[selectedTipe] || popupItem.harga;
        addProductToCart(popupItem, harga, selectedJenis, selectedTipe);
        setPopupItem(null);
    };

    //mengirim data menu ke keranjang
    const addProductToCart = async (product, harga, jenis, tipe) => {
        try {
            const {_id, ...productTanpaId} = product; 
            const productToSend = {
                ...productTanpaId,
                harga,
                jenis,
                tipe,
                quantity: 1
            };

            const res = await fetch('/api/cart/keranjang', {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(productToSend),
            });

            const data = await res.json();
            if (res.ok) {
                dispatch(addItemToCart(data));
                console.log("Berhasil ditambah:", data);
            } else {
                console.log("Gagal ditambah:", data.message);
            }
        } catch (error) {
            console.log(error);
        }
    };

    //menampilkan menu sesuai dengan kategori
    const displayProducts = isFiltered ? products : dessertCount;

    //fungsi menghitung harga promo dalam bentuk %
    const getHargaDiskon = (harga, promo) => (
        Math.round(harga * (100 - promo) / 100)
    );

    return (
        <>
            <div className="grid grid-cols-3 gap-4 p-4">
                {displayProducts.map((product) => {
                    const baseHarga = product.harga;
                    const panas = product.jenis?.panas || null;
                    const dingin = product.jenis?.dingin || null;
                    const houseBlend = product.tipe?.houseBlend || null;
                    const singelOrigin = product.tipe?.singelOrigin || null;

                    return (
                        <div key={product._id} className="bg-white rounded-xl shadow-md p-2 flex flex-col justify-between">
                            <img
                                src={product.image}
                                alt={product.judul}
                                className="h-full w-full object-cover rounded-md mb-2"
                            />
                            <div className="flex justify-between items-center px-3">
                                <div className="text-sm w-full">
                                    <p className="font-medium line-clamp-1 mb-1">{product.judul}</p>

                                    {panas !== null && (
                                        <div className="mb-1">
                                            <span className="text-xs text-gray-500">Hot: </span><br />
                                            {product.promo > 0 ? (
                                                <div className="flex flex-col">
                                                    <span className="line-through text-xs text-gray-400">
                                                        Rp {panas.toLocaleString()}
                                                    </span>
                                                    <span className="text-red-500 font-bold">
                                                        Rp {getHargaDiskon(panas, product.promo).toLocaleString()}
                                                    </span>
                                                </div>
                                            ) : (
                                                <span className="font-bold text-gray-800">
                                                    Rp {panas.toLocaleString()}
                                                </span>
                                            )}
                                        </div>
                                    )}

                                    {dingin !== null && (
                                        <div className="mb-1">
                                            <span className="text-xs text-gray-500">Cold: </span><br />
                                            {product.promo > 0 ? (
                                                <div className="flex flex-col">
                                                    <span className="line-through text-xs text-gray-400">
                                                        Rp {dingin.toLocaleString()}
                                                    </span>
                                                    <span className="text-red-500 font-bold">
                                                        Rp {getHargaDiskon(dingin, product.promo).toLocaleString()}
                                                    </span>
                                                </div>
                                            ) : (
                                                <span className="font-bold text-gray-800">
                                                    Rp {dingin.toLocaleString()}
                                                </span>
                                            )}
                                        </div>
                                    )}

                                    {houseBlend !== null && (
                                        <div className="mb-1">
                                            <span className="text-xs text-gray-500">HB: </span>
                                            {product.promo > 0 ? (
                                                <div className="flex flex-col">
                                                    <span className="line-through text-xs text-gray-400">
                                                        Rp {houseBlend.toLocaleString()}
                                                    </span>
                                                    <span className="text-red-500 font-bold">
                                                        Rp {getHargaDiskon(houseBlend, product.promo).toLocaleString()}
                                                    </span>
                                                </div>
                                            ) : (
                                                <span className="font-bold text-gray-800">
                                                    Rp {houseBlend.toLocaleString()}
                                                </span>
                                            )}
                                        </div>
                                    )}

                                    {singelOrigin !== null && (
                                        <div className="mb-1">
                                            <span className="text-xs text-gray-500">SO: </span>
                                            {product.promo > 0 ? (
                                                <div className="flex flex-col">
                                                    <span className="line-through text-xs text-gray-400">
                                                        Rp {singelOrigin.toLocaleString()}
                                                    </span>
                                                    <span className="text-red-500 font-bold">
                                                        Rp {getHargaDiskon(singelOrigin, product.promo).toLocaleString()}
                                                    </span>
                                                </div>
                                            ) : (
                                                <span className="font-bold text-gray-800">
                                                    Rp {singelOrigin.toLocaleString()}
                                                </span>
                                            )}
                                        </div>
                                    )}

                                    {!panas && !dingin && !houseBlend && !singelOrigin && (
                                        <div className="mb-1">
                                            {product.promo > 0 ? (
                                                <div className="flex flex-col">
                                                    <span className="line-through text-xs text-gray-400">
                                                        Rp {baseHarga.toLocaleString()}
                                                    </span>
                                                    <span className="text-red-500 font-bold">
                                                        Rp {getHargaDiskon(baseHarga, product.promo).toLocaleString()}
                                                    </span>
                                                </div>
                                            ) : (
                                                <span className="font-bold text-gray-800">
                                                    Rp {baseHarga.toLocaleString()}
                                                </span>
                                            )}
                                        </div>
                                    )}
                                </div>

                                <button
                                    onClick={() => handleAddToCart(product)}
                                    className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-full ml-2"
                                >
                                    <FaPlusCircle className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>

            {popupItem && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-md shadow-lg w-[90%] max-w-md">
                        <h2 className="text-lg font-semibold mb-4">{popupItem.judul}</h2>

                        {/* Jenis section, will only show if jenis exists */}
                        {popupItem.jenis && (
                            (popupItem.jenis.panas > 0 || popupItem.jenis.dingin > 0) && (
                                <div className="mb-4">
                                    <p className="font-medium text-sm mb-2">Pilih Jenis:</p>
                                    <div className="flex gap-4">
                                        {popupItem.jenis.panas && (
                                            <button
                                                onClick={() => setSelectedJenis('panas')}
                                                className={`px-3 py-1 border rounded ${selectedJenis === 'panas' ? 'bg-red-500 text-white' : ''}`}
                                            >
                                                Panas
                                            </button>
                                        )}
                                        {popupItem.jenis.dingin && (
                                            <button
                                                onClick={() => setSelectedJenis('dingin')}
                                                className={`px-3 py-1 border rounded ${selectedJenis === 'dingin' ? 'bg-blue-500 text-white' : ''}`}
                                            >
                                                Dingin
                                            </button>
                                        )}
                                    </div>
                                </div>
                            )
                        )}

                        {/* Tipe section, will show regardless of jenis */}
                        {popupItem.tipe && (
                            (popupItem.tipe.houseBlend > 0 || popupItem.tipe.singelOrigin > 0) && (
                                <div className="mb-4">
                                    <p className="font-medium text-sm mb-2">Pilih Tipe:</p>
                                    <div className="flex gap-4">
                                        {popupItem.tipe.houseBlend && (
                                            <button
                                                onClick={() => setSelectedTipe('houseBlend')}
                                                className={`px-3 py-1 border rounded ${selectedTipe === 'houseBlend' ? 'bg-green-600 text-white' : ''}`}
                                            >
                                                House Blend
                                            </button>
                                        )}
                                        {popupItem.tipe.singelOrigin && (
                                            <button
                                                onClick={() => setSelectedTipe('singelOrigin')}
                                                className={`px-3 py-1 border rounded ${selectedTipe === 'singelOrigin' ? 'bg-yellow-600 text-white' : ''}`}
                                            >
                                                Single Origin
                                            </button>
                                        )}
                                    </div>
                                </div>
                            )
                        )}

                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setPopupItem(null)}
                                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                            >
                                Batal
                            </button>
                            <button
                                onClick={handleConfirmAdd}
                                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                            >
                                Tambah ke Keranjang
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default CardDessert;
