import { Button, Alert } from 'flowbite-react';
import { useDispatch, useSelector } from 'react-redux';
import { MdPointOfSale, MdInventory } from "react-icons/md";
import { LuSquareActivity } from "react-icons/lu";
import { TbReportAnalytics } from "react-icons/tb";
import { useEffect, useRef, useState } from 'react';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { app } from '../firebase';
import {
    updateStart,
    updateSuccess,
    updateFailure,
    signoutSuccess,
} from '../redux/user/userSlice';
import { Link, useNavigate } from 'react-router-dom';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';


export default function MenuAdmin() {
    const { currentUser, error, loading } = useSelector((state) => state.user);
    const [imageFile, setImageFile] = useState(null);
    const [imageFileUrl, setImageFileUrl] = useState(null);
    const filePickerRef = useRef();
    const [imageUploading, setImageUploading] = useState(false);
    const [imageFileUploadError, setImageFileUploadError] = useState(null);
    const [imageFileUploadProgress, setImageFileUploadProgress] = useState(null);
    const [formData, setFormData] = useState({});
    const [updateUserError, setUpdateUserError] = useState(null);
    const [updateUserSuccess, setUpdateUserSuccess] = useState(null);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    //fungsi handle perubahan gambar admin
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setImageFileUrl(URL.createObjectURL(file));
        }
    };

    //fungsi upload image
    useEffect(() => {
        if (imageFile) {
            uploadImage();
        }
    }, [imageFile]);

    const uploadImage = async () => {
        // service firebase.storage {
        //     match /b/{bucket}/o {
        //       match /{allPaths=**} {
        //         allow read;
        //         allow write: if
        //         request.resource.size < 2 * 1024 * 1024 &&
        //         request.resource.contentType.matches('image/.*')
        //       }
        //     }
        //  }
        setImageUploading(true);
        setImageFileUploadError(null);
        const storage = getStorage(app);
        const fileName = new Date().getTime() + imageFile.name;
        const storageRef = ref(storage, fileName);
        const uploadTask = uploadBytesResumable(storageRef, imageFile);
        uploadTask.on(
            'state_changed',
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                setImageFileUploadProgress(progress.toFixed(0));
            },
            () => {
                setImageFileUploadError("Gambar tidak bisa diupload (File harus dibawah 2MB)");
                setImageFileUploadProgress(null);
                setImageFile(null);
                setImageFileUrl(null);
                setImageUploading(false);
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    setImageFileUrl(downloadURL);
                    setFormData({ ...formData, profilePicture: downloadURL });
                    setImageUploading(false);
                });
            }
        );
    };

    //handle submit perubahan
    const handleSubmit = async (e) => {
        e.preventDefault();
        setUpdateUserError(null);
        setUpdateUserSuccess(null);
        if (Object.keys(formData).length === 0) {
            setUpdateUserError("Tidak ada perubahan");
            return;
        }
        if (imageUploading) {
            setUpdateUserError("Tunggu gambar diupload");
            return;
        }
        try {
            dispatch(updateStart());
            const res = await fetch(`/api/user/update/${currentUser._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${currentUser.token}`,
                },
                body: JSON.stringify(formData),
            });
            const data = await res.json();
            if (!res.ok) {
                dispatch(updateFailure(data.message));
                setUpdateUserError(data.message);
            } else {
                dispatch(updateSuccess(data));
                setUpdateUserSuccess("User profile berhasil di update");
            }
        } catch (error) {
            dispatch(updateFailure(error.message));
            setUpdateUserError(error.message);
        }
    };

    //fungsi logout
    const handleSignout = async () => {
        try {
            // Logout user
            const res = await fetch('/api/user/signout', {
                method: 'POST'
            });
    
            if (res.ok) {
                // Jika logout berhasil, ubah status toko menjadi 'closed'
                const storeRes = await fetch('/api/store/logout', {
                    method: 'PATCH',
                });
    
                if (storeRes.ok) {
                    console.log('Status toko berhasil diubah menjadi closed');
                } else {
                    console.log('Gagal merubah status toko');
                }
    
                // Menangani state redux untuk signout
                dispatch(signoutSuccess());
                navigate('/');
            } else {
                const data = await res.json();
                console.log(data.message || 'Gagal melakukan logout');
            }
        } catch (error) {
            console.log('Terjadi kesalahan:', error);
        }
    };
    
    //menyimpan perubahan field ke state
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };
    return (
        <div className="min-h-screen bg-gray-200 flex justify-center items-center">
            <div className="p-10 w-full max-w-md bg-white rounded-xl shadow flex flex-col items-center gap-6">

                {/* Form Profile */}
                <form className="flex flex-col items-center w-full gap-4" onSubmit={handleSubmit}>
                    <input type="file" accept='image/*' onChange={handleImageChange} ref={filePickerRef} hidden />
                    <div
                        className="relative w-28 h-28 cursor-pointer"
                        onClick={() => filePickerRef.current.click()}
                    >
                        {/* Progress Bar */}
                        {imageFileUploadProgress !== null && (
                            <div className="absolute top-0 left-0 w-full h-full z-10">
                                <CircularProgressbar
                                    value={imageFileUploadProgress}
                                    text={`${imageFileUploadProgress}%`}
                                    strokeWidth={5}
                                    styles={{
                                        path: {
                                            stroke: `rgba(62, 152, 199, ${imageFileUploadProgress / 100})`,
                                        },
                                        text: {
                                            fill: '#333',
                                            fontSize: '18px',
                                            dominantBaseline: 'middle',
                                            textAnchor: 'middle',
                                        },
                                    }}
                                />
                            </div>
                        )}

                        {/* Foto Profil */}
                        <img
                            src={imageFileUrl || currentUser.profilePicture}
                            alt="foto"
                            className={`w-28 h-28 rounded-full object-cover border-8 border-[lightgray] ${imageFileUploadProgress && imageFileUploadProgress < 100 && 'opacity-60'
                                }`}
                        />
                    </div>

                    {imageFileUploadError && <Alert color='failure'>{imageFileUploadError}</Alert>}

                    {/* Username */}
                    <input
                        type="text"
                        id="username"
                        placeholder="Username"
                        defaultValue={currentUser.username}
                        className="w-full px-3 py-2 border rounded-md text-center"
                        onChange={handleChange}
                    />

                    <input
                        type="password"
                        id="password"
                        placeholder="Password"
                        className="w-full px-3 py-2 border rounded-md text-center"
                        onChange={handleChange}
                    />

                    <Button
                        className="flex items-center justify-center gap-2 w-full"
                        gradientDuoTone="purpleToBlue"
                        outline
                        type='submit'
                        disabled={loading || imageUploading}
                    >
                        {loading ? 'loading...' : 'update'}
                    </Button>
                </form>

                {/* Tombol Navigasi */}
                <div className="flex flex-col w-full gap-4">
                    <Link to='/'>
                    <Button className="flex items-center justify-center gap-2 w-full">
                        <MdPointOfSale className="text-xl mr-2" />
                        <p>Point Of Sales</p>
                    </Button>
                    </Link>
                    <Link to='/inventory'>
                    <Button className="flex items-center justify-center gap-2 w-full">
                        <MdInventory className="text-xl mr-2" />
                        <p>Inventory</p>
                    </Button>
                    </Link>
                    <Link to='/activity'>
                    <Button className="flex items-center justify-center gap-2 w-full">
                        <LuSquareActivity className="text-xl mr-2" />
                        <p>Activity</p>
                    </Button>
                    </Link>
                    <Link to='/report'>
                    <Button className="flex items-center justify-center gap-2 w-full">
                        <TbReportAnalytics className="text-xl mr-2" />
                        <p>Report</p>
                    </Button>
                    </Link>

                    <Button
                        className="flex items-center justify-center gap-2 w-full"
                        color="failure"
                        onClick={handleSignout}
                    >
                        Log Out
                    </Button>
                </div>
                {updateUserSuccess && (
                    <Alert color='success' className='mt-5'>
                        {updateUserSuccess}
                    </Alert>
                )}
                {error && (
                    <Alert color='failure' className='mt-5'>
                        {error}
                    </Alert>
                )}
            </div>
        </div>

    )
}
