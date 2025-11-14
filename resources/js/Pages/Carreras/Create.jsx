// resources/js/Pages/Carreras/Create.jsx

import React from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
// Asumo que tenés un Layout principal, si no, sacalo.
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'; 

export default function Create({ auth, institutos }) {
    
    // useForm de Inertia: maneja el estado, errores y envío
    const { data, setData, post, processing, errors } = useForm({
        nombre: '',
        codigo: '',
        duracion_anios: '',
        titulo_que_otorga: '',
        instituto_id: '',
    });

    const submit = (e) => {
        e.preventDefault();
        // Hacemos POST a la ruta que creamos en web.php
        post(route('carreras.store'));
    };

    return (
        // Asumo que tu Layout recibe 'auth' y 'header'
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Crear Nueva Carrera</h2>}
        >
            <Head title="Crear Carrera" />

            <div className="py-12">
                <div className="max-w-3xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">
                            
                            <form onSubmit={submit}>
                                <div>
                                    <label htmlFor="nombre" className="block font-medium text-sm text-gray-700">Nombre</label>
                                    <input
                                        id="nombre"
                                        type="text"
                                        value={data.nombre}
                                        onChange={(e) => setData('nombre', e.target.value)}
                                        className="w-full mt-1 block"
                                    />
                                    {errors.nombre && <div className="text-red-500 text-xs mt-1">{errors.nombre}</div>}
                                </div>

                                <div className="mt-4">
                                    <label htmlFor="codigo" className="block font-medium text-sm text-gray-700">Código</label>
                                    <input
                                        id="codigo"
                                        type="text"
                                        value={data.codigo}
                                        onChange={(e) => setData('codigo', e.target.value)}
                                        className="w-full mt-1 block"
                                    />
                                    {errors.codigo && <div className="text-red-500 text-xs mt-1">{errors.codigo}</div>}
                                </div>
                                
                                <div className="mt-4">
                                    <label htmlFor="duracion_anios" className="block font-medium text-sm text-gray-700">Duración (Años)</label>
                                    <input
                                        id="duracion_anios"
                                        type="number"
                                        value={data.duracion_anios}
                                        onChange={(e) => setData('duracion_anios', e.target.value)}
                                        className="w-full mt-1 block"
                                    />
                                    {errors.duracion_anios && <div className="text-red-500 text-xs mt-1">{errors.duracion_anios}</div>}
                                </div>

                                <div className="mt-4">
                                    <label htmlFor="titulo_que_otorga" className="block font-medium text-sm text-gray-700">Título que Otorga</label>
                                    <input
                                        id="titulo_que_otorga"
                                        type="text"
                                        value={data.titulo_que_otorga}
                                        onChange={(e) => setData('titulo_que_otorga', e.target.value)}
                                        className="w-full mt-1 block"
                                    />
                                    {errors.titulo_que_otorga && <div className="text-red-500 text-xs mt-1">{errors.titulo_que_otorga}</div>}
                                </div>

                                <div className="mt-4">
                                    <label htmlFor="instituto_id" className="block font-medium text-sm text-gray-700">Instituto</label>
                                    <select
                                        id="instituto_id"
                                        value={data.instituto_id}
                                        onChange={(e) => setData('instituto_id', e.target.value)}
                                        className="w-full mt-1 block"
                                    >
                                        <option value="">Seleccione un instituto</option>
                                        {institutos.map((instituto) => (
                                            <option key={instituto.id} value={instituto.id}>
                                                {instituto.siglas}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.instituto_id && <div className="text-red-500 text-xs mt-1">{errors.instituto_id}</div>}
                                </div>

                                <div className="flex items-center justify-end mt-6">
                                    <Link 
                                        href={route('carreras.index')}
                                        className="bg-gray-200 hover:bg-gray-300 text-black font-bold py-2 px-4 rounded mr-2"
                                    >
                                        Cancelar
                                    </Link>
                                    <button 
                                        type="submit" 
                                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                        disabled={processing} // Deshabilita el botón mientras se envía
                                    >
                                        {processing ? 'Guardando...' : 'Guardar Carrera'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}