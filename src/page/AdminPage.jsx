import { Alert, Button, Label, Spinner, TextInput } from "flowbite-react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {signInStart, signInSuccess, signInFailure} from "../redux/user/userSlice";
import { useNavigate } from "react-router-dom";

export default function AdminPage() {

    const [formData, setFormData] = useState({});
    const {loading, error: errorMessage} = useSelector(state => state.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    //fungsi submit dan  verifikasi data user ke DB untuk login
    const handleSubmit = async (e) => {
        e.preventDefault();
        if(!formData.username || !formData.password) {
            return dispatch(signInFailure("Tolong diisi semua."));
        }
        try {
            dispatch(signInStart());
            const res = await fetch('/api/auth/signin', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(formData),
            });
            const data = await res.json(); 
            if(data.success === false){
                dispatch(signInFailure(data.message));
            }
            if(res.ok){
                dispatch(signInSuccess(data));
                
                await fetch('/api/store/status', {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({isOpen: true}),
                });
                navigate('/menuAdmin');
            }
        } catch (error) {
            dispatch(signInFailure(error.message));
        }
    };

    //menghadle perubahan field dan menyimpannya ke state
    const handleChange = (e) => {
        setFormData({...formData,[e.target.id]: e.target.value.trim() });
    };


    return (
        <div className="min-h-screen bg-gray-200 flex justify-center items-center">
            <div className="p-10 w-full max-w-md bg-white rounded-xl shadow">
                <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                    <h1 className="font-bold text-center">Khusus Karyawan</h1>
                    <h1 className="text-2xl pt-5 font-bold text-center">Login</h1>

                    <div>
                        <Label value="Username :" />
                        <TextInput type="text" placeholder="Username" id="username" onChange={handleChange} />
                    </div>

                    <div>
                        <Label value="Password :" />
                        <TextInput type="password" placeholder="******" id="password" onChange={handleChange} />
                    </div>

                    <Button color="failure" type="submit" disabled={loading}>
                        {
                            loading ? (
                                <>
                                <Spinner size="sm" />
                                <span className="pl-3">Loading...</span>
                                </>
                            ) : "Sign In"
                        }
                    </Button>
                </form>
                {
                    errorMessage && (
                        <Alert className="mt-5" color="failure">
                            {errorMessage}
                        </Alert>
                    )
                }
            </div>
        </div>

    )
}
