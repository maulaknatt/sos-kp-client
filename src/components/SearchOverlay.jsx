import { Button, Modal } from "flowbite-react";
import { AiOutlineSearch } from 'react-icons/ai';
import { useState, useEffect } from "react";
import SearchResultGrid from "./SearchResultGrid";

export default function SearchOverlay() {
    const [searchQuery, setSearchQuery] = useState("");
    const [showSearch, setShowSearch] = useState(false);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [isFiltered, setIsFiltered] = useState(false);

    //mengambil data menu berdasarkan query
    useEffect(() => {
        const fetchFilteredProducts = async () => {
            if (searchQuery.trim() === "") {
                setIsFiltered(false);
                setFilteredProducts([]);
                return;
            }

            try {
                const res = await fetch(`/api/post/getposts?searchTerm=${searchQuery}`);
                const data = await res.json();
                setFilteredProducts(data.posts);
                setIsFiltered(true);
            } catch (err) {
                console.error("Gagal fetch hasil pencarian:", err);
            }
        };

        fetchFilteredProducts();
    }, [searchQuery]);

    //handle close search state
    const handleClose = () => {
        setShowSearch(false);
        setSearchQuery("")
    };

    return (
        <>
            <Modal show={showSearch} onClose={handleClose} size="xl">
                <Modal.Header>Pencarian Menu</Modal.Header>
                <Modal.Body>
                    <input
                        type="text"
                        autoFocus
                        placeholder="Cari menu...."
                        className="w-full p-2 border border-gray-300 rounded-md mb-4"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />

                    {filteredProducts.length === 0 && (
                        <p className="text-center mt-5 text-gray-600">
                            Mohon maaf menu yang kamu cari tidak tersedia
                        </p>
                    )}

                    {filteredProducts.length > 0 && (
                        <SearchResultGrid products={filteredProducts} />
                    )}
                </Modal.Body>
            </Modal>

            <Button
                color="gray"
                size="sm"
                className="text-gray-500 shadow-lg w-full"
                onClick={() => setShowSearch(true)}
            >
                <AiOutlineSearch className="w-5 h-5 mr-2" />
                Search...
            </Button>
        </>
    );
}
