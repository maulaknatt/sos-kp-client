import { Button, Modal, Navbar } from 'flowbite-react';
import { Link } from 'react-router-dom';
import { FaPowerOff } from "react-icons/fa";
import SearchOverlay from './SearchOverlay';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { setStoreStatus } from '../redux/storestatus/storeSlice';

export default function Header() {
    const currentUser = useSelector((state) => state.user.currentUser);
    const isAdminLogin = currentUser?.isAdmin === true;
    const dispatch = useDispatch();
    const { isOpen } = useSelector((state) => state.storeStatus);
    const [showClosedModal, setShowClosedModal] = useState(false);
    const [statusToko, setStatusToko] = useState(false);

    //mengambil data status toko
    useEffect(() => {
        const fetchStoreStatus = async () => {
            try {
                const res = await fetch('/api/store/status');
                const data = await res.json();
                if(res.ok){
                    dispatch(setStoreStatus(data.isOpen));
                }
            } catch (error) {
                console.log('error fetching data : ', error);
            } finally {
                setStatusToko(true);
            }
        };

        fetchStoreStatus();
    }, [dispatch]);

    //menambahkan efek jeda sebelum modal
    useEffect(() => {
        if(statusToko && !isOpen){
            const timeout = setTimeout(() => {
                setShowClosedModal(true);
            }, 300);
            return () => clearTimeout(timeout);
        }
    }, [isOpen, statusToko]);

    return (
        <header className='sticky top-0 z-50'>
            <Navbar className='border-b-2 flex 
            justify-between bg-gray-100'>

                <div className='flex flex-col w-full gap-3'>
                    <div className='flex flex-row justify-between 
                    w-full items-center'>
                        <Link to="/">
                        <div className="flex justify-center 
                        items-center text-lg font-bold gap-3
                        bg-white p-2 rounded-lg ">
                            <img src="/public/The kopi logo.jpeg" 
                            alt="logo"
                            className='w-11 h-11' />
                            THe Kopi
                        </div>
                        </Link>

                        <Link to={isAdminLogin ? '/menuAdmin' : '/AdminLogin'}>
                        <div className={`flex flex-row items-center
                        gap-2 bg-white px-5 py-2 rounded-full
                        ${isAdminLogin ? 'text-green-500' :  'text-red-500'}`}>
                            <h2>{isOpen ? 'Open' : 'Closed'}</h2>
                            <FaPowerOff 
                            color={isOpen? 'green' : 'red'}/>
                        </div>
                        </Link>
                    </div>
                    <div>
                        <SearchOverlay />
                    </div>
                </div>
            </Navbar>

            <Modal show={showClosedModal} onClose={() => setShowClosedModal(false)}>
                <Modal.Header>
                    <p className='text-red-600 font-bold'>CLOSED</p>
                </Modal.Header>
                <Modal.Body>
                <p className='text-xl'>
                    Maaf, toko masih tutup. 
                    Tolong akses web ini jika toko sudah buka dan pastikan lokasi Anda berada di sekitar toko.</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={() => setShowClosedModal(false)}
                        color='failure'>
                        Tutup
                    </Button>
                </Modal.Footer>
            </Modal>
        </header>
    )
}
