// resources/js/Pages/Docentes/Create.jsx

import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'; // Asumo que necesitas este layout
import { Head, useForm, Link } from '@inertiajs/react';

export default function Create({ auth }) {
    
    // 1. Inicialización del estado del formulario con los NUEVOS CAMPOS
    const { data, setData, post, processing, errors } = useForm({
        legajo: '', // Nuevo: integer
        nombre: '',
        apellido: '',
        modalidad_desempeño: 'Investigador', // Nuevo: ENUM con valor inicial
        carga_horaria: '', // Nuevo: integer
        es_activo: true, // Nuevo: boolean (valor inicial true)
        telefono: '',
        email: '',
    });

    const submit = (e) => {
        e.preventDefault();
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
                            
                            {/* Legajo (Nuevo) */}
                            <div>
                                <label htmlFor="legajo" className="block text-sm font-medium text-gray-700">Legajo</label>
                                <input
                                    id="legajo"
                                    type="number" // Tipo number para forzar enteros
                                    value={data.legajo}
                                    onChange={(e) => setData('legajo', e.target.value)}
                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                                    required
                                />
                                {errors.legajo && <div className="text-red-600 mt-1 text-sm">{errors.legajo}</div>}
                            </div>

                            {/* Nombre y Apellido */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
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
                            
                            {/* Modalidad Desempeño (ENUM) y Carga Horaria (Integer) */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="modalidad_desempeno" className="block text-sm font-medium text-gray-700">Modalidad Desempeño</label>
                                    <select
                                        id="modalidad_desempeno"
                                        value={data.modalidad_desempeño}
                                        onChange={(e) => setData('modalidad_desempeño', e.target.value)}
                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                                        required
                                    >
                                        <option value="Investigador">Investigador</option>
                                        <option value="Desarrollo">Desarrollo</option>
                                    </select>
                                    {errors.modalidad_desempeño && <div className="text-red-600 mt-1 text-sm">{errors.modalidad_desempeño}</div>}
                                </div>
                                <div>
                                    <label htmlFor="carga_horaria" className="block text-sm font-medium text-gray-700">Carga Horaria (Hrs)</label>
                                    <input
                                        id="carga_horaria"
                                        type="number" // Tipo number para horas
                                        value={data.carga_horaria}
                                        onChange={(e) => setData('carga_horaria', e.target.value)}
                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                                        required
                                    />
                                    {errors.carga_horaria && <div className="text-red-600 mt-1 text-sm">{errors.carga_horaria}</div>}
                                </div>
                            </div>

                            {/* Es Activo (Boolean) */}
                            <div>
                                <div className="flex items-center">
                                    <input
                                        id="es_activo"
                                        type="checkbox"
                                        checked={data.es_activo} // Usamos checked en lugar de value para checkboxes
                                        onChange={(e) => setData('es_activo', e.target.checked)} // Usamos e.target.checked
                                        className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
                                    />
                                    <label htmlFor="es_activo" className="ml-2 block text-sm font-medium text-gray-700">
                                        Docente Activo
                                    </label>
                                </div>
                                {errors.es_activo && <div className="text-red-600 mt-1 text-sm">{errors.es_activo}</div>}
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