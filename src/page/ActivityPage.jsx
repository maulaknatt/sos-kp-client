import { useEffect, useState } from 'react';
import SearchActivity from '../components/SearchActivity';
import { Button } from 'flowbite-react';
import { Link } from 'react-router-dom';

export default function Activity() {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [tab, setTab] = useState('unfinished');

    //mengambil data pesanan
    useEffect(() => {
        const fetchReports = async () => {
            try {
                const res = await fetch('/api/report/getreport');
                if (!res.ok) {
                    throw new Error('Gagal mengambil data laporan');
                }
                const data = await res.json();
                setReports(data);
            } catch (err) {
                console.error('Error:', err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchReports();
    }, []);

    //mengupdate status data pesanan
    const handleDone = async (id) => {
        try {
            const res = await fetch(`/api/report/done/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ isDone: true }),
            });
            if (!res.ok) {
                throw new Error('Gagal menyelesaikan order');
            }
            setReports(prev => prev.map(r => (r._id === id ? { ...r, isDone: true } : r)));
        } catch (err) {
            console.log(err.message);
        }
    };

    //memfilter pesanan berdasarkan status
    const filteredReports = reports.filter(report => tab === 'unfinished' ? !report.isDone : report.isDone);

    //efek loading
    if (loading) return <p className="p-4">Loading...</p>;

    return (
        <div className="p-6 space-y-4">
            <div className='flex flex-row justify-between'>
                <h2 className="text-2xl font-bold">Activity</h2>
                <Link to='/menuAdmin'>
                    <p className='text-lg'>Back</p>
                </Link>
            </div>

            <div className='flex gap-4 mb-4'>
                <Button
                    onClick={() => setTab('unfinished')}
                    className={`px-4 py-2 rounded ${tab === 'unfinished' ? 'bg-green-500 text-white' : 'bg-gray-200'}`}>
                    Belum Selesai
                </Button>
                <Button
                    onClick={() => setTab('finished')}
                    className={`px-4 py-2 rounded ${tab === 'finished' ? 'bg-green-500 text-white' : 'bg-gray-200'}`}>
                    Selesai
                </Button>
            </div>

            <SearchActivity tab={tab} />

            {filteredReports.length === 0 ? (
                <p>Tidak ada laporan.</p>
            ) : (
                filteredReports.map((report) => (
                    <div key={report._id} className="border rounded-lg p-4 shadow bg-white">
                        <div className="mb-2 flex justify-between items-center">
                            <h3 className="font-semibold text-lg">Order ID: {report.order_id}</h3>
                            <span className={`font-bold ${report.status_payment ? 'text-green-500' : 'text-red-500'}`}>
                                {report.status_payment ? 'PAID' : 'UNPAID'}
                            </span>
                        </div>
                        <p className="text-sm">Nama: <span className="font-medium">{report.username}</span></p>
                        <p className="text-sm">Meja: <span className="font-medium">{report.meja}</span></p>

                        <ul className="mt-2 list-disc pl-5">
                            {report.items.map((item, idx) => (
                                <li key={idx}>
                                    {item.judul} x {item.quantity}
                                    <br />
                                    <p>Tipe/Jenis : {item.tipe || item.jenis || "-"}</p>
                                </li>
                            ))}
                        </ul>

                        <p className="mt-2 text-sm font-semibold">
                            Total Harga: <span className="text-gray-800">Rp {report.totalHarga.toLocaleString('id-ID')}</span>
                        </p>

                        {report.status_payment && (
                            <button
                                onClick={() => handleDone(report._id)}
                                disabled={tab === 'finished'}
                                className={`
                                    ${tab === 'unfinished' ? 'mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600' : 'text-green-500 mt-4 font-bold text-2xl'}`}
                            >
                                Done
                            </button>
                        )}
                    </div>
                ))
            )}
        </div>
    );
}
