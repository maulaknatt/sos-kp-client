import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { Alert, Button, Checkbox, FileInput, Label, Select, TextInput } from 'flowbite-react';
import { app } from "../firebase";
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

export default function AddMenu() {
    const [formData, setFormData] = useState({
        harga: ''
    });
    const [file, setFile] = useState(null);
    const [imageUploadProgress, setImageUploadProgress] = useState(null);
    const [imageUploadError, setImageUploadError] = useState(null);
    const [publishError, setPublishError] = useState(null);
    const navigate = useNavigate();
    const [isJenisChecked, setIsJenisChecked] = useState(false);
    const [isTipeChecked, setIsTipeChecked] = useState(false);

    //mengirim data menu ke DB
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch('/api/post/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            const data = await res.json();
            if (!res.ok) {
                setPublishError(data.message);
                return;
            }
            if (res.ok) {
                setPublishError(null);
                navigate('/inventory');
            }
        } catch (error) {
            setPublishError("Ada yang tidak benar");
            console.log(error);
        }
    };

    //fungsi upload image ke firebase
    const handleUploadImage = async () => {
        try {
            if (!file) {
                setImageUploadError('Tolong pilih sebuah gambar');
                return;
            }
            setImageUploadError(null);
            const storage = getStorage(app);
            const fileName = new Date().getTime() + '-' + file.name;
            const storageRef = ref(storage, fileName);
            const uploadTask = uploadBytesResumable(storageRef, file);
            uploadTask.on(
                'state_changed',
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    setImageUploadProgress(progress.toFixed(0));
                },
                (error) => {
                    setImageUploadError(error);
                    setImageUploadProgress(null);
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                        setImageUploadProgress(null);
                        setImageUploadError(null);
                        setFormData({ ...formData, image: downloadURL });
                    });
                }
            );
        } catch (error) {
            setImageUploadError('Image Upload Gagal');
            setImageUploadProgress(null);
            console.log(error);
        }
    };

    //memfilter menu yang ada harga jenis dan tipe
    useEffect(() => {
        if (isJenisChecked || isTipeChecked) {
            setFormData((prev) => ({ ...prev, harga: 0, promo: 0, }));
        }
    }, [isJenisChecked, isTipeChecked]);

    return (
        <div className="p-3 max-w-3xl mx-auto min-h-screen">
            <div className='flex flex-row justify-between mt-10 mb-10 pb-4 border-b-4'>
                    <h2 className="text-2xl font-bold">Add Menu</h2>
                    <Link to='/inventory'>
                        <p className='text-lg mr-5'>Back</p>
                    </Link>
                </div>
            <form className="flex flex-col
            gap-4" onSubmit={handleSubmit}>
                <div className="flex flex-col
                gap-4 sm:flex-row justify-between">
                    <Label htmlFor="nama" value="Nama Makanan :" />
                    <TextInput type='text' placeholder='Nama makanan'
                        required id='nama' className='flex-1'
                        onChange={(e) => setFormData({ ...formData, judul: e.target.value })} />

                    <Label htmlFor="kategori" value="Kategori :" />
                    <Select required onChange={(e) => setFormData({ ...formData, category: e.target.value })}>
                        <option value="uncategorized">Pilih Kategori</option>
                        <option value="Makanan">Makanan</option>
                        <option value="Minuman">Minuman</option>
                        <option value="Dessert">Dessert</option>
                    </Select>
                </div>
                <Label htmlFor="harga" value="Harga :" />
                <TextInput type='number' placeholder='Harga'
                    id='harga' className='flex-1'
                    disabled={isJenisChecked || isTipeChecked}
                    value={formData.harga}
                    onChange={(e) => setFormData({ ...formData, harga: e.target.value })} />

                <Label value="Jenis Minuman & Harga:" />
                <div className="flex items-center gap-2 mb-2">
                    <Checkbox
                        id="checkJenis"
                        checked={isJenisChecked}
                        onChange={(e) => setIsJenisChecked(e.target.checked)}
                    />
                    <Label htmlFor="checkJenis" className="text-sm">
                        Aktifkan harga minuman panas & dingin
                    </Label>
                </div>

                <div className="flex flex-col gap-2 sm:flex-row justify-between">
                    <div className="flex flex-col gap-1 flex-1">
                        <Label htmlFor="panas" value="Harga Panas (Hot)" />
                        <TextInput
                            type="number"
                            placeholder="Harga minuman panas"
                            id="panas"
                            disabled={!isJenisChecked}
                            onChange={(e) =>
                                setFormData((prev) => ({
                                    ...prev,
                                    jenis: { ...prev.jenis, panas: e.target.value },
                                }))
                            }
                        />
                    </div>
                    <div className="flex flex-col gap-1 flex-1">
                        <Label htmlFor="dingin" value="Harga Dingin (Cold)" />
                        <TextInput
                            type="number"
                            placeholder="Harga minuman dingin"
                            id="dingin"
                            disabled={!isJenisChecked}
                            onChange={(e) =>
                                setFormData((prev) => ({
                                    ...prev,
                                    jenis: { ...prev.jenis, dingin: e.target.value },
                                }))
                            }
                        />
                    </div>
                </div>

                <Label value="Tipe Kopi & Harga:" />
                <div className="flex items-center gap-2 mb-2">
                    <Checkbox
                        id="checkJenis"
                        checked={isTipeChecked}
                        onChange={(e) => setIsTipeChecked(e.target.checked)}
                    />
                    <Label htmlFor="checkJenis" className="text-sm">
                        Aktifkan harga Kopi House Blend & Singel Oringin
                    </Label>
                </div>

                <div className="flex flex-col gap-2 sm:flex-row justify-between">
                    <div className="flex flex-col gap-1 flex-1">
                        <Label htmlFor="houseBland" value="Harga House Blend" />
                        <TextInput
                            type="number"
                            placeholder="Harga House Blend"
                            id="houseBlend"
                            disabled={!isTipeChecked}
                            onChange={(e) =>
                                setFormData((prev) => ({
                                    ...prev,
                                    tipe: { ...prev.tipe, houseBlend: e.target.value },
                                }))
                            }
                        />
                    </div>
                    <div className="flex flex-col gap-1 flex-1">
                        <Label htmlFor="singelOrigin" value="Harga Singel Origin" />
                        <TextInput
                            type="number"
                            placeholder="Harga Singel Origin"
                            id="singelOrigin"
                            disabled={!isTipeChecked}
                            onChange={(e) =>
                                setFormData((prev) => ({
                                    ...prev,
                                    tipe: { ...prev.tipe, singelOrigin: e.target.value },
                                }))
                            }
                        />
                    </div>
                </div>

                <Label htmlFor="stock" value="Stock :" />
                <TextInput type='number' placeholder='Stock'
                    required id='stock' className='flex-1'
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })} />
                <Label htmlFor="promo" value="Promo/Diskon :" />
                <div className="flex flex-row sm:flex-row gap-4 items-center">
                    <TextInput
                        type="number"
                        max="100"
                        placeholder="Diskon (%)"
                        className="flex-1"
                        onChange={(e) => {
                            const value = e.target.value || 0;
                            setFormData((prev) => ({
                                ...prev,
                                promo: parseFloat(value),
                            }))
                        }}
                    />
                </div>
                <div className='flex gap-4 items-center 
                justify-between border-4 border-gray-500
                border-dotted p-3'>
                    <FileInput type='file'
                        accept='image/*'
                        onChange={(e) => setFile(e.target.files[0])} />
                    <Button type='button'
                        gradientDuoTone='purpleToBlue' size='sm'
                        outline
                        onClick={handleUploadImage}
                        disabled={imageUploadProgress}>
                        {imageUploadProgress ? (
                            <div className="w-16 h-16">
                                <CircularProgressbar value={imageUploadProgress} text={`${imageUploadProgress || 0}%`} />
                            </div>
                        ) : (
                            'Upload Image'
                        )}
                    </Button>
                </div>
                {imageUploadError && <Alert color='failure'>{imageUploadError}</Alert>}
                {formData.image && (
                    <img src={formData.image} alt="upload" className="w-full h-72 object-cover" />
                )}
                <Button type='submit'
                    gradientDuoTone='purpleToPink'>
                    Publish
                </Button>
                {
                    publishError && (<Alert color='failure' className="mt-5">{publishError}</Alert>)
                }
            </form>
        </div>
    )
}
