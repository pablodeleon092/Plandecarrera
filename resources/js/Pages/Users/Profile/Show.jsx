import React from 'react';
import { Head, useForm, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Show() {
    const { props } = usePage();
    const { user } = props;

    const { data, setData, put, processing, errors } = useForm({
        name: user.name || '',
        email: user.email || '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route('users.update', user.id)); // Llama al método update
    };

    return (
        <AuthenticatedLayout
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">
                Usuarios
            </h2>} 
        >

            <Head title="Usuarios"/>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="max-w-md mx-auto mt-8">
                <h1 className="text-2xl font-bold mb-4">Editar usuario</h1>

                <form onSubmit={handleSubmit} className="bg-white border border-gray-200 shadow-sm rounded-lg overflow-hidden">
                    <div className="mb-4">
                        <label className="block font-semibold">Nombre</label>
                        <input
                            type="text"
                            value={data.name}
                            onChange={e => setData('name', e.target.value)}
                            className="w-full border rounded p-2"
                        />
                        {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
                    </div>

                    <div className="mb-4">
                        <label className="block font-semibold">Email</label>
                        <input
                            type="email"
                            value={data.email}
                            onChange={e => setData('email', e.target.value)}
                            className="w-full border rounded p-2"
                        />
                        {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
                    </div>

                    <button
                        type="submit"
                        disabled={processing}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                        {processing ? 'Guardando...' : 'Actualizar'}
                    </button>
                </form>
            </div>
        </div>
        </AuthenticatedLayout>
    );
}
