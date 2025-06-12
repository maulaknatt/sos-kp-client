import { MdRestaurantMenu } from "react-icons/md";
import { RiDrinksFill } from "react-icons/ri";
import { PiBowlFoodFill } from "react-icons/pi";
import { LuDessert } from "react-icons/lu";
import Header from "../components/Header";
import ProductGrid from "../components/CardProduk";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Keranjang from "../components/Keranjang";
import FooterCom from "../components/Footer";

export default function Home() {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [productCount, setProductCount] = useState(0);
    const [makananCount, setMakananCount] = useState(0);
    const [minumanCount, setMinumanCount] = useState(0);
    const [dessertCount, setDessertCount] = useState(0);
    const location = useLocation();

    //mengambil lokasi user saat ini
    const isActive = (path) => location.pathname === path;

    //mengambil semua data makanan + memfilter berdasarkan kategori
    useEffect(() => {
        const getMenu = async () => {
            try {
                const res = await fetch("/api/post/getposts");
                const data = await res.json();

                const kategorimakanan = data.posts.filter(
                    (product) => product.category === "Makanan"
                );
                const kategoriminuman = data.posts.filter(
                    (product) => product.category === "Minuman"
                );
                const kategoridessert = data.posts.filter(
                    (product) => product.category === "Dessert"
                );

                setProducts(data.posts);
                setFilteredProducts(data.posts);
                setProductCount(data.totalPosts);
                setMakananCount(kategorimakanan.length);
                setMinumanCount(kategoriminuman.length);
                setDessertCount(kategoridessert.length);
            } catch (err) {
                console.error("Gagal ambil data menu:", err);
            }
        };
        getMenu();
    }, []);

    //menampilkan makanan sesuai kategori
    const filterByCategory = (category) => {
        if (category === "All") {
            setFilteredProducts(products); 
        } else {
            setFilteredProducts(products.filter(product => product.category === category));
        }
    };

    return (
        <>
            <Header />
            <div className="min-h-screen bg-gray-100">

                {/* Kategori Navigasi */}
                <div className="w-full overflow-x-auto py-5 hide-scrollbar">
                    <div className="w-fit mx-auto">
                        <div className="flex gap-4 px-4">
                            {/* All Menu */}
                            <Link to="/" onClick={() => filterByCategory("All")}>
                                <div
                                    className={`flex flex-col items-center gap-2 p-4 border rounded-xl min-w-[140px] cursor-pointer 
                                    ${isActive("/") ? "bg-red-500 text-white" : "bg-white text-gray-800"}`}
                                >
                                    <MdRestaurantMenu size="28" />
                                    <p className="text-sm font-medium">All Menu</p>
                                    <span className={`${isActive("/") ? "text-white" : "text-gray-600"}`}>
                                        {productCount} items
                                    </span>
                                </div>
                            </Link>

                            {/* Drinks */}
                            <Link to="/minuman" onClick={() => filterByCategory("Minuman")}>
                                <div
                                    className={`flex flex-col items-center gap-2 p-4 border rounded-xl min-w-[140px] cursor-pointer 
                                    ${isActive("/minuman") ? "bg-red-500 text-white" : "bg-white text-gray-800"}`}
                                >
                                    <RiDrinksFill size="28" />
                                    <p className="text-sm font-medium">Drinks</p>
                                    <span className={`${isActive("/minuman") ? "text-white" : "text-gray-600"}`}>
                                        {minumanCount} items
                                    </span>
                                </div>
                            </Link>

                            {/* Foods */}
                            <Link to="/makanan" onClick={() => filterByCategory("Makanan")}>
                                <div
                                    className={`flex flex-col items-center gap-2 p-4 border rounded-xl min-w-[140px] cursor-pointer 
                                    ${isActive("/makanan") ? "bg-red-500 text-white" : "bg-white text-gray-800"}`}
                                >
                                    <PiBowlFoodFill size="28" />
                                    <p className="text-sm font-medium">Foods</p>
                                    <span className={`${isActive("/makanan") ? "text-white" : "text-gray-600"}`}>
                                        {makananCount} items
                                    </span>
                                </div>
                            </Link>

                            {/* Dessert */}
                            <Link to="/dessert" onClick={() => filterByCategory("Dessert")}>
                                <div
                                    className={`flex flex-col items-center gap-2 p-4 border rounded-xl min-w-[140px] cursor-pointer 
                                    ${isActive("/dessert") ? "bg-red-500 text-white" : "bg-white text-gray-800"}`}
                                >
                                    <LuDessert size="28" />
                                    <p className="text-sm font-medium">Dessert</p>
                                    <span className={`${isActive("/dessert") ? "text-white" : "text-gray-600"}`}>
                                        {dessertCount} items
                                    </span>
                                </div>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Keranjang */}
                <div className="fixed left-5 bottom-5 z-50">
                    <Keranjang />
                </div>

                {/* Produk */}
                <div className="w-full max-w-screen-lg mx-auto px-4 pb-10">
                    <ProductGrid products={filteredProducts} isFiltered={true} />
                </div>
            </div>

            <FooterCom />

        </>
    );
}
