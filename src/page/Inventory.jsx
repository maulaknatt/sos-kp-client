import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Modal, Table, Button } from 'flowbite-react';
import { Link } from 'react-router-dom';
import { HiOutlineExclamationCircle } from 'react-icons/hi';

export default function Inventory() {
    const { currentUser } = useSelector((state) => state.user);
    const [userPosts, setUserPosts] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [postIdToDelete, setPostIdToDelete] = useState('');
    const [showMore, setShowMore] = useState(true);

    //mengambil semua data menu di DB
    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const res = await fetch(`/api/post/getposts?userId=${currentUser._id}`);
                const data = await res.json();
                if (res.ok) {
                    setUserPosts(data.posts)
                    if (data.posts.length < 9) {
                        setShowMore(false);
                    }
                }
            } catch (error) {
                console.log(error);
            }
        };

        if (currentUser.isAdmin) {
            fetchPosts();
        }

    }, [currentUser._id]);

    //fungsi dari tombol "show more"
    const handleShowMore = async () => {
        const startIndex = userPosts.length;
        try {
            const res = await fetch(`/api/post/getposts?userId=${currentUser._id}&startIndex=${startIndex}`);
            const data = await res.json();
            if (res.ok) {
                setUserPosts((prev) => [...prev, ...data.posts]);
                if (data.posts.length < 9) {
                    setShowMore(false);
                }
            }
        } catch (error) {
            console.log(error.message);
        }
    };

    //fungsi delete menu
    const handleDeletePost = async () => {
        setShowModal(false);
        try {
            const res = await fetch(`/api/post/deleteposts/${postIdToDelete}/${currentUser._id}`,
                {
                    method: 'DELETE',
                }
            );
            const data = await res.json();
            if (!res.ok) {
                console.log(data.message);
            } else {
                setUserPosts((prev) => prev.filter((post) => post._id !== postIdToDelete));
            }
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <>
            <div className='mt-10 ml-10 flex flex-col gap-5'>
                <div className='flex flex-row justify-between'>
                    <h2 className="text-2xl font-bold">Inventory</h2>
                    <Link to='/menuAdmin'>
                        <p className='text-lg mr-5'>Back</p>
                    </Link>
                </div>
                <Link to='/tambah-menu'>
                    <Button gradientDuoTone='purpleToBlue' className='mb-5' outline>
                        Tambah Menu Baru
                    </Button>
                </Link>
            </div>
            <div className='hidden md:block table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300
        dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500'>
                {currentUser.isAdmin && userPosts.length > 0 ? (
                    <>
                        <Table hoverable className='shadow-md'>
                            <Table.Head>
                                <Table.HeadCell>Date Updated</Table.HeadCell>
                                <Table.HeadCell>Gambar</Table.HeadCell>
                                <Table.HeadCell>Nama</Table.HeadCell>
                                <Table.HeadCell>Kategori</Table.HeadCell>
                                <Table.HeadCell>Harga</Table.HeadCell>
                                <Table.HeadCell>Stock</Table.HeadCell>
                                <Table.HeadCell>Promo</Table.HeadCell>
                                <Table.HeadCell>Panas</Table.HeadCell>
                                <Table.HeadCell>Dingin</Table.HeadCell>
                                <Table.HeadCell>House Blend</Table.HeadCell>
                                <Table.HeadCell>Single Origin</Table.HeadCell>
                                <Table.HeadCell>Delete</Table.HeadCell>
                                <Table.HeadCell>
                                    <span>Edit</span>
                                </Table.HeadCell>
                            </Table.Head>
                            {userPosts.map((post, index) => (
                                <Table.Body key={index} className='divide-y'>
                                    <Table.Row className='bg-white dark:border-gray-700 dark:bg-gray-800'>

                                        <Table.Cell>{new Date(post.updatedAt).toLocaleDateString()}</Table.Cell>

                                        <Table.Cell>
                                            <img src={post.image} alt={post.judul} className='w-20 h-10 object-cover bg-gray-500' />
                                        </Table.Cell>

                                        <Table.Cell>
                                            {post.judul}
                                        </Table.Cell>

                                        <Table.Cell>{post.category}</Table.Cell>

                                        <Table.Cell>
                                            {typeof post.harga === "number"
                                                ? (post.promo && typeof post.promo === "number" && post.promo > 0
                                                    ? ((post.harga * (100 - post.promo)) / 100) : post.harga
                                                ).toLocaleString() : "0"
                                            }
                                        </Table.Cell>


                                        <Table.Cell>{post.stock}</Table.Cell>

                                        <Table.Cell>{(post.promo ?? 0) + "%"}</Table.Cell>

                                        <Table.Cell>
                                        {typeof post.jenis.panas === "number" && typeof post.promo === "number"
                                                ? post.promo > 0
                                                    ? ((post.jenis.panas * (100 - post.promo)) / 100).toLocaleString()
                                                    : post.jenis.panas.toLocaleString()
                                                : "0"}
                                        </Table.Cell>

                                        <Table.Cell>
                                        {typeof post.jenis.dingin === "number" && typeof post.promo === "number"
                                                ? post.promo > 0
                                                    ? ((post.jenis.dingin * (100 - post.promo)) / 100).toLocaleString()
                                                    : post.jenis.dingin.toLocaleString()
                                                : "0"}
                                        </Table.Cell>

                                        <Table.Cell>
                                        {typeof post.tipe.houseBlend === "number" && typeof post.promo === "number"
                                                ? post.promo > 0
                                                    ? ((post.tipe.houseBlend * (100 - post.promo)) / 100).toLocaleString()
                                                    : post.tipe.houseBlend.toLocaleString()
                                                : "0"}
                                        </Table.Cell>

                                        <Table.Cell>
                                        {typeof post.tipe.singelOrigin === "number" && typeof post.promo === "number"
                                                ? post.promo > 0
                                                    ? ((post.tipe.singelOrigin * (100 - post.promo)) / 100).toLocaleString()
                                                    : post.tipe.singelOrigin.toLocaleString()
                                                : "0"}
                                        </Table.Cell>

                                        <Table.Cell>
                                            <span onClick={() => {
                                                setShowModal(true);
                                                setPostIdToDelete(post._id);
                                            }} className='font-medium text-red-500 hover:underline cursor-pointer'>
                                                Delete
                                            </span>
                                        </Table.Cell>
                                        <Table.Cell>
                                            <Link className='text-teal-500 hover:underline' to={`/update-post/${post._id}`}>
                                                <span>Edit</span>
                                            </Link>
                                        </Table.Cell>
                                    </Table.Row>
                                </Table.Body>
                            ))}
                        </Table>
                        {showMore && (
                            <button className='w-full text-teal-500 self-center text-sm py-7' onClick={handleShowMore}>Show more</button>
                        )}
                    </>
                ) : (
                    <p>Kamu belum memposting apapun</p>
                )}
                <Modal show={showModal} onClose={() => setShowModal(false)} popup size='md'>
                    <Modal.Header />
                    <Modal.Body>
                        <div className="text-center">
                            <HiOutlineExclamationCircle className='h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto' />
                            <h3 className='mb-5 text-lg text-gray-500 dark:text-gray-400'>
                                Yakin mau menghapus Menu ini ?
                            </h3>
                            <div className="flex justify-center gap-5">
                                <Button color='failure' onClick={handleDeletePost}>
                                    Ya, Saya yakin.
                                </Button>
                                <Button color='gray' onClick={() => setShowModal(false)}>
                                    Tidak jadi.
                                </Button>
                            </div>
                        </div>
                    </Modal.Body>
                </Modal>
            </div>

            <div className="md:hidden space-y-4">
                {userPosts.map((post) => (
                    <div key={post._id} className="border m-5 rounded-lg p-4 shadow-md bg-white dark:bg-gray-800">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-sm text-gray-500">{new Date(post.updatedAt).toLocaleDateString()}</span>
                            <img src={post.image} alt={post.judul} className="w-20 h-15 object-cover bg-gray-300 rounded" />
                        </div>
                        <h2 className="font-semibold text-lg">{post.judul}</h2>
                        <p className="text-sm text-gray-600 dark:text-gray-300">Kategori: {post.category}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                            Harga: Rp{' '}
                            {post.jenis && post.jenis.panas && post.jenis.dingin
                                ? `${((post.jenis.panas * (100 - post.promo)) / 100).toLocaleString()} (Panas) / ${((post.jenis.dingin * (100 - post.promo)) / 100).toLocaleString()} (Dingin)`
                                : post.tipe && post.tipe.houseBlend && post.tipe.singelOrigin
                                    ? `${((post.tipe.houseBlend * (100 - post.promo)) / 100).toLocaleString()} (House Blend) / ${((post.tipe.singelOrigin * (100 - post.promo)) / 100).toLocaleString()} (Single Origin)`
                                    : typeof post.harga === "number" && typeof post.promo === "number"
                                        ? post.promo > 0
                                            ? ((post.harga * (100 - post.promo)) / 100).toLocaleString()
                                            : post.harga.toLocaleString()
                                        : "0"
                            }
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-300">Stok: {post.stock}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-300">Promo: {post.promo}%</p>
                        <div className="flex justify-end gap-4 mt-3">
                            <Link to={`/update-post/${post._id}`} className="text-blue-500 text-sm hover:underline">Edit</Link>
                            <span
                                onClick={() => {
                                    setShowModal(true);
                                    setPostIdToDelete(post._id);
                                }}
                                className="text-red-500 text-sm cursor-pointer hover:underline"
                            >
                                Hapus
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </>

    )
}
