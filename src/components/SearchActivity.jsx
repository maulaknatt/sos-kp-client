import { Button, Modal } from "flowbite-react";
import { AiOutlineSearch } from 'react-icons/ai';
import { useEffect, useState } from "react";
import ProductGridSearch from "./ProductGridSearch";

export default function SearchActivity({tab}) {
    const [searchQuery, setSearchQuery] = useState("");
    const [showSearch, setShowSearch] = useState(false);
    const [allProducts, setAllProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);

    //mengambil data pesanan
    useEffect(() => {
        const fetchAllProducts = async () => {
            try {
                const res = await fetch("/api/report/getreport");
                const data = await res.json();
                setAllProducts(data);
            } catch (error) {
                console.error("Gagal fetch:", error.message);
            }
        };
        fetchAllProducts();
    }, []);

    //query search menu
    useEffect(() => {
        if (searchQuery.trim() === "") {
            setFilteredProducts([]);
            return;
        }

        const filtered = allProducts.filter(product =>
            product.order_id.toLowerCase().includes(searchQuery.toLowerCase())
        );

        setFilteredProducts(filtered);
    }, [searchQuery, allProducts]);

    //menambahkan menu
    const handleAddToCart = (product) => {
        console.log("Tambah ke keranjang:", product.judul);
    };

    return (
        <>
            <Modal show={showSearch} onClose={() => {setShowSearch(false); setSearchQuery("");}} size="xl">
                <Modal.Header>
                    Pencarian Menu
                </Modal.Header>
                <Modal.Body>
                    <input
                        autoFocus
                        type="text"
                        placeholder="Cari menu..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md mb-4"
                    />

                    <ProductGridSearch
                        products={filteredProducts}
                        onAddToCart={handleAddToCart}
                        tab={tab}
                    />
                </Modal.Body>
            </Modal>

            <Button
                color="gray"
                size="sm"
                className="text-gray-500 shadow-lg w-full"
                onClick={() => setShowSearch(true)}
            >
                <AiOutlineSearch className="w-5 h-5 mr-2" /> Search...
            </Button>
        </>
    );
}
