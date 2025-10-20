// resources/js/Pages/Docentes/Create.jsx

import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, Link } from '@inertiajs/react';

export default function Create({ auth }) {
    
    // 1. Inicialización del estado del formulario
    const { data, setData, post, processing, errors } = useForm({
        dni: '',
        nombre: '',
        apellido: '',
        caracter: '',
        dedicacion: '',
        modalidad_desempeno: '',
        telefono: '',
        email: '',
    });

    // 2. Función para manejar el envío del formulario
    const submit = (e) => {
        e.preventDefault();
        // Envía la petición POST a la ruta 'docentes.store'
        post(route('docentes.store')); 
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Crear Nuevo Docente</h2>}
        >
            <Head title="Crear Docente" />

            <div className="py-12">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <form onSubmit={submit} className="p-6 space-y-6">
                            
                            {/* DNI */}
                            <div>
                                <label htmlFor="dni" className="block text-sm font-medium text-gray-700">DNI</label>
                                <input
                                    id="dni"
                                    type="text"
                                    value={data.dni}
                                    onChange={(e) => setData('dni', e.target.value)}
                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                                    required
                                />
                                {errors.dni && <div className="text-red-600 mt-1 text-sm">{errors.dni}</div>}
                            </div>
                            
                            {/* Nombre y Apellido */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                {/* Nombre */}
                                <div>
                                    <label htmlFor="nombre" className="block text-sm font-medium text-gray-700">Nombre</label>
                                    <input
                                        id="nombre"
                                        type="text"
                                        value={data.nombre}
                                        onChange={(e) => setData('nombre', e.target.value)}
                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                                        required
                                    />
                                    {errors.nombre && <div className="text-red-600 mt-1 text-sm">{errors.nombre}</div>}
                                </div>
                                {/* Apellido */}
                                <div>
                                    <label htmlFor="apellido" className="block text-sm font-medium text-gray-700">Apellido</label>
                                    <input
                                        id="apellido"
                                        type="text"
                                        value={data.apellido}
                                        onChange={(e) => setData('apellido', e.target.value)}
                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                                        required
                                    />
                                    {errors.apellido && <div className="text-red-600 mt-1 text-sm">{errors.apellido}</div>}
                                </div>
                            </div>
                            
                            {/* Caracter, Dedicación y Modalidad */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div>
                                    <label htmlFor="caracter" className="block text-sm font-medium text-gray-700">Carácter</label>
                                    <input
                                        id="caracter"
                                        type="text"
                                        value={data.caracter}
                                        onChange={(e) => setData('caracter', e.target.value)}
                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                                        required
                                    />
                                    {errors.caracter && <div className="text-red-600 mt-1 text-sm">{errors.caracter}</div>}
                                </div>
                                <div>
                                    <label htmlFor="dedicacion" className="block text-sm font-medium text-gray-700">Dedicación</label>
                                    <input
                                        id="dedicacion"
                                        type="text"
                                        value={data.dedicacion}
                                        onChange={(e) => setData('dedicacion', e.target.value)}
                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                                        required
                                    />
                                    {errors.dedicacion && <div className="text-red-600 mt-1 text-sm">{errors.dedicacion}</div>}
                                </div>
                                <div>
                                    <label htmlFor="modalidad_desempeno" className="block text-sm font-medium text-gray-700">Modalidad Desempeño</label>
                                    <input
                                        id="modalidad_desempeno"
                                        type="text"
                                        value={data.modalidad_desempeno}
                                        onChange={(e) => setData('modalidad_desempeno', e.target.value)}
                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                                        required
                                    />
                                    {errors.modalidad_desempeno && <div className="text-red-600 mt-1 text-sm">{errors.modalidad_desempeno}</div>}
                                </div>
                            </div>
                            
                            {/* Email y Teléfono */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email (Opcional)</label>
                                    <input
                                        id="email"
                                        type="email"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                                    />
                                    {errors.email && <div className="text-red-600 mt-1 text-sm">{errors.email}</div>}
                                </div>
                                <div>
                                    <label htmlFor="telefono" className="block text-sm font-medium text-gray-700">Teléfono (Opcional)</label>
                                    <input
                                        id="telefono"
                                        type="text"
                                        value={data.telefono}
                                        onChange={(e) => setData('telefono', e.target.value)}
                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                                    />
                                    {errors.telefono && <div className="text-red-600 mt-1 text-sm">{errors.telefono}</div>}
                                </div>
                            </div>

                            <div className="flex justify-end space-x-4">
                                <Link
                                    href={route('docentes.index')}
                                    className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                >
                                    Cancelar
                                </Link>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
                                >
                                    {processing ? 'Guardando...' : 'Guardar Docente'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}