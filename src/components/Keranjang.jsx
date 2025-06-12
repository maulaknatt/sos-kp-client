import { Button, Label, Modal, Select } from "flowbite-react";
import { useEffect, useState } from "react";
import { HiShoppingBag } from "react-icons/hi2";
import { useDispatch, useSelector } from "react-redux";
import { removeItemFromCart, selectCartCount, setCartItems } from "../redux/keranjang/keranjangSlice";
import { useNavigate } from "react-router-dom";
import { TextInput } from "flowbite-react";

export default function Keranjang() {
    const [showModal, setShowModal] = useState(false);
    const cartItems = useSelector((state) => state.cart.cartItems);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const cartCount = useSelector(selectCartCount);
    const [username, setUsername] = useState('');
    const [meja, setMeja] = useState('');
    const [email, setEmail] = useState('');
    const [paymentStatus, setPaymentStatus] = useState({ show: false, message: '' });

    const closePaymentStatusModal = () => {
        setPaymentStatus({ show: false, message: '' });
    };

    const handleList = () => {
        setShowModal(true);
    };

    //fungsi mengambil data item yang ada di keranjang
    useEffect(() => {
        const fetchCartItems = async () => {
            try {
                const res = await fetch('/api/cart/getItems');
                const data = await res.json();
                if (res.ok) {
                    dispatch(setCartItems(data));
                }
            } catch (error) {
                console.error("Gagal memuat keranjang", error);
            }
        };

        fetchCartItems();
    }, [dispatch]);

    //fungsi menurunkan quantity item
    const handleDecrease = (id) => {
        const updatedItems = cartItems.map((item) => {
            if (item._id === id) {
                if (item.quantity > 0) {
                    return {
                        ...item,
                        quantity: item.quantity - 1,
                        stock: item.stock + 1
                    };
                }
            }
            return item;
        });
        dispatch(setCartItems(updatedItems));
    };

    //fungsi menaikan quantity item
    const handleIncrease = (id) => {
        const updatedItems = cartItems.map((item) => {
            if (item._id === id) {
                if (item.stock > 0) {
                    return {
                        ...item,
                        quantity: item.quantity + 1,
                        stock: item.stock - 1, // Mengurangi stok
                    };
                } else {
                    alert("Stok tidak mencukupi");
                }
            }
            return item;
        });
        dispatch(setCartItems(updatedItems)); // Perbarui cartItems di Redux
    };

    //fungsi mendelete item berdasarkan id
    const handleDelete = async (id) => {
        try {
            const res = await fetch(`/api/cart/deletelist/${id}`, {
                method: "DELETE",
            });
            if (!res.ok) {
                throw new Error("Gagal menghapus item dari keranjang");
            }
            dispatch(removeItemFromCart(id));
        } catch (error) {
            console.error(error);
        }
    };

    //fungsi mengembalikan total item + total harga
    const getTotalKeranjang = () => {
        return cartItems.reduce((total, post) => {
            return total + getTotalHarga(post.harga, post.quantity, post.promo);
        }, 0);
    };

    //menghitung total harga
    const getTotalHarga = (harga, quantity, promo = 0) => {
        const hargaFinal = promo !== 0 ? harga * (100 - promo) / 100 : harga;
        return hargaFinal * quantity;
    };

    //handle update data menu
    const handleUpdate = async (itemId, stock, quantity) => {
        try {
            const res = await fetch(`/api/post/update/${itemId}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    stock: stock - quantity,
                }),
            });

            if (res.ok) {
                console.log("Data berhasil diperbarui");
            } else {
                console.error("Gagal memperbarui data");
            }
        } catch (error) {
            console.error("Error dalam proses update:", error);
        }
    };

    //mengirim data pesanan
    const handlePost = async (result) => {
        // Mengambil semua item dari keranjang
        if (!username.trim() || !meja || meja === 'uncategorized') {
            alert('Mohon isi nama dan pilih nomor meja terlebih dahulu.');
            return;
        }

        const itemsToPost = cartItems.map((item) => ({
            id: item._id,
            judul: item.judul,
            tipe: item.tipe,
            jenis: item.jenis,
            quantity: item.quantity,
            stock: item.stock,
            harga: item.promo !== 0 ? item.harga * (100 - item.promo) / 100 : item.harga,
            totalHargaItem: getTotalHarga(item.harga, item.quantity, item.promo), // Total harga untuk item ini
        }));

        // Menghitung total harga keseluruhan
        const totalHarga = getTotalKeranjang();

        try {
            const res = await fetch(`/api/report/laporan`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username,
                    meja,
                    email,
                    items: itemsToPost, // Semua item dalam satu array
                    totalHarga: totalHarga,
                    order_id: result.order_id,
                    status: result.transaction_status,
                }),
            });

            const data = await res.json();
            if (!res.ok) {
                console.log(data.message);
            }
            if (res.ok) {
                console.log("Sukses mengirim data:", data);
                setUsername('');
                setMeja('');
                setEmail('');
            }
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <>
            <Button
                onClick={handleList}
                className={`fixed bottom-5 left-5 z-10 p-3 rounded-full
                shadow-lg transition-opacity duration-300`}
                color="failure">
                <HiShoppingBag />
                {cartCount > 0 && (
                    <span className="absolute top-0 right-0 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-orange-400 rounded-full">
                        {cartCount}
                    </span>
                )}
            </Button>
            <Modal show={showModal} onClose={() => setShowModal(false)}>
                <Modal.Header>Keranjang Belanja</Modal.Header>
                <Modal.Body>
                    <form>
                        <Label htmlFor="konsumen" value="Nama Anda :" />
                        <TextInput required type="text" placeholder="Masukan Nama Anda"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}></TextInput>
                        <Label htmlFor="meja" value="Pilih Meja :" />
                        <Select required value={meja} onChange={(e) => setMeja(e.target.value)}>
                            <option value="uncategorized">Pilih Nomer Meja</option>
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                            <option value="5">5</option>
                        </Select>
                        <Label htmlFor="email" value="E-mail (untuk bukti transaksi)" />
                        <TextInput required type="email" placeholder="E-mail" value={email}
                            onChange={(e) => setEmail(e.target.value)}></TextInput>
                        <div className="text-center mt-5 bg-red-500 rounded-lg">
                            <h2 className="text-white font-semibold p-5">Jika Email tidak muncul di Inbox, Tolong cek di Spam</h2>
                        </div>
                    </form>
                    {cartItems.length > 0 ? (
                        <>
                            {cartItems.map((post) => (
                                <div key={`${post._id}-${post.tipe}-${post.jenis}`} className="flex items-center gap-4 p-3 border-b">
                                    <img
                                        src={post.image}
                                        alt="gambar"
                                        className="w-16 h-16 rounded-md object-cover"
                                    />
                                    <div className="flex-1">
                                        <p className="text-sm font-semibold text-gray-800">{post.judul}</p>
                                        <p className="text-sm text-gray-500">
                                            Tipe/Jenis: {post.tipe && post.jenis ? `${post.tipe} / ${post.jenis}` : post.tipe || post.jenis}
                                        </p>
                                        <p className="text-sm text-gray-500">Stok : {post.stock - 1}</p>
                                        <p className="text-sm text-gray-500">Rp {post.promo != 0 ? post.harga * (100 - post.promo) / 100 : post.harga}</p>
                                        <div className="flex items-center gap-2 mt-2">
                                            <Button
                                                onClick={() => handleDecrease(post._id)}
                                                disabled={post.quantity < 0}
                                                className="p-1 bg-gray-200 text-gray-600 rounded-full"
                                            >
                                                -
                                            </Button>
                                            <p className="text-sm">{post.quantity}</p>
                                            <Button
                                                onClick={() => handleIncrease(post._id)}
                                                className="px-2 p-1 bg-gray-200 text-gray-600 rounded-full"
                                            >
                                                +
                                            </Button>
                                            <span
                                                className="ml-5 text-red-600 cursor-pointer"
                                                onClick={() => handleDelete(post._id)}
                                            >
                                                Delete
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end">
                                        <p className="text-sm font-semibold">
                                            Total: Rp {getTotalHarga(post.harga, post.quantity, post.promo)}
                                        </p>
                                    </div>
                                </div>
                            ))}
                            <div className="flex justify-between items-center py-4">
                                <p className="font-semibold text-lg">Total: Rp {getTotalKeranjang()}</p>
                                <Button
                                    onClick={async () => {
                                        try {
                                            const res = await fetch('/api/payment/transaction', {
                                                method: 'POST',
                                                headers: {
                                                    'Content-Type': 'application/json',
                                                },
                                                body: JSON.stringify({
                                                    username,
                                                    meja,
                                                    items: cartItems.map((item) => ({
                                                        id: item._id,
                                                        judul: item.judul,
                                                        quantity: item.quantity,
                                                        harga: item.promo !== 0 ? item.harga * (100 - item.promo) / 100 : item.harga,
                                                    })),
                                                    totalHarga: getTotalKeranjang(),
                                                }),
                                            });

                                            const data = await res.json();
                                            if (!res.ok) return alert("Gagal membuat transaksi");

                                            window.snap.pay(data.token, {
                                                onSuccess: async function (result) {
                                                    await handlePost(result); // kirim data ke laporan
                                                    for (const item of cartItems) {
                                                        await handleUpdate(item._id, item.stock, item.quantity);
                                                        await handleDelete(item._id);
                                                    }
                                                    navigate('/');
                                                },
                                                onPending: function () {
                                                    setPaymentStatus({ show: true, message: "Menunggu pembayaran" });
                                                },
                                                onError: function () {
                                                    setPaymentStatus({ show: true, message: "Pembayaran gagal" });
                                                },
                                                onClose: function () {
                                                    setPaymentStatus({ show: true, message: "Kamu menutup popup tanpa menyelesaikan pembayaran" });
                                                }
                                            });

                                        } catch (error) {
                                            console.error("Terjadi kesalahan:", error);
                                        }
                                    }}
                                >
                                    Bayar
                                </Button>


                            </div>
                        </>
                    ) : (
                        <p className="mt-10 text-2xl text-center text-gray-500">Keranjang kosong</p>
                    )}
                </Modal.Body>
            </Modal>

            <Modal show={paymentStatus.show} onClose={closePaymentStatusModal} size="sm" popup>
                <Modal.Header />
                <Modal.Body>
                    <div className="text-center">
                        <h3 className="mb-5 text-lg font-normal text-gray-500">{paymentStatus.message}</h3>
                        <div className="flex justify-center">
                            <Button onClick={closePaymentStatusModal}>Tutup</Button>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        </>
    )
}
