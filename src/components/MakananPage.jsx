import { MdRestaurantMenu } from "react-icons/md";
import { RiDrinksFill } from "react-icons/ri";
import { PiBowlFoodFill } from "react-icons/pi";
import { LuDessert } from "react-icons/lu";
import Header from "../components/Header";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import CardMakanan from "./CardMakanan";
import Keranjang from "./Keranjang";
import FooterCom from "./Footer";

export default function MakananPage() {
    const [products, setProducts] = useState([]);
    const [productCount, setProductCount] = useState(0);
    const [makananCount, setMakananCount] = useState(0);
    const [minumanCount, setMinumanCount] = useState(0);
    const [dessertCount, setDessertCount] = useState(0);
    const location = useLocation();
    const currentLocation = location.pathname;

    const isActive = (path) => currentLocation === path;

    //mengambil data menu dan memfilter berdasarkan kategori
    useEffect(() => {
        const getMenu = async () => {
            try {
                const res = await fetch("/api/post/getposts"); 
                const data = await res.json();
                const kategorimakanan = data.posts.filter(products => products.category === "Makanan");
                const kategoriminuman = data.posts.filter(products => products.category === "Minuman");
                const kategoridessert = data.posts.filter(products => products.category === "Dessert");
                setProducts(data.posts); 
                setProductCount(data.posts.length);
                setMakananCount(kategorimakanan.length);
                setMinumanCount(kategoriminuman.length);
                setDessertCount(kategoridessert.length);

            } catch (err) {
                console.error("Gagal ambil data menu:", err);
            }
        };

        getMenu();
    }, []);
    return (
        <>
            <Header />
            <div className="min-h-screen bg-gray-100">
                <div className="w-full overflow-x-auto py-5 hide-scrollbar">
                    <div className="w-fit mx-auto">
                        <div className="flex gap-4 px-4">
                            {/* All Menu */}
                            <Link to="/">
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
                            <Link to="/minuman">
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
                            <Link to="/makanan">
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
                            <Link to="/dessert">
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

                <div className="fixed left-5 bottom-5 z-50">
                    <Keranjang />
                </div>

                <div className="w-full max-w-screen-lg mx-auto px-4 pb-10">
                    <CardMakanan products={products} />
                </div>
            </div>

            <FooterCom />
        </>
    )
}
