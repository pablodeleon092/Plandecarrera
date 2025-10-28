// resources/js/Pages/Docentes/Edit.jsx
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Edit({ auth, docente,flash }) {
    const { data, setData, put, processing, errors } = useForm({
        legajo: docente.legajo ?? '',
        nombre: docente.nombre ?? '',
        apellido: docente.apellido ?? '',
        modalidad_desempeño: docente.modalidad_desempeño ?? 'Investigador',
        carga_horaria: docente.carga_horaria ?? 0,
        es_activo: !!docente.es_activo,
        telefono: docente.telefono ?? '',
        email: docente.email ?? '',
    });

    const submit = (e) => {
        e.preventDefault();
        put(route('docentes.update', docente.id), { preserveScroll: true });
    };

    return (
        <AuthenticatedLayout
            user={auth?.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Editar Docente</h2>}
        >
            <Head title="Editar Docente" />
            {flash?.success && (
                    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                        {flash?.success}
                    </div>
            )}
            
            {flash?.error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {flash?.error}
                </div>
            )}
            <div className="py-12">
                <div className="max-w-3xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">
                            <form onSubmit={submit} className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Legajo</label>
                                    <input
                                        type="number"
                                        value={data.legajo}
                                        onChange={(e) => setData('legajo', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300"
                                    />
                                    {errors.legajo && <p className="text-red-600 text-sm mt-1">{errors.legajo}</p>}
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Nombre</label>
                                        <input
                                            type="text"
                                            value={data.nombre}
                                            onChange={(e) => setData('nombre', e.target.value)}
                                            className="mt-1 block w-full rounded-md border-gray-300"
                                        />
                                        {errors.nombre && <p className="text-red-600 text-sm mt-1">{errors.nombre}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Apellido</label>
                                        <input
                                            type="text"
                                            value={data.apellido}
                                            onChange={(e) => setData('apellido', e.target.value)}
                                            className="mt-1 block w-full rounded-md border-gray-300"
                                        />
                                        {errors.apellido && <p className="text-red-600 text-sm mt-1">{errors.apellido}</p>}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Modalidad de desempeño</label>
                                        <select
                                            value={data.modalidad_desempeño}
                                            onChange={(e) => setData('modalidad_desempeño', e.target.value)}
                                            className="mt-1 block w-full rounded-md border-gray-300"
                                        >
                                            <option value="Investigador">Investigador</option>
                                            <option value="Desarrollo">Desarrollo</option>
                                        </select>
                                        {errors.modalidad_desempeño && (
                                            <p className="text-red-600 text-sm mt-1">{errors.modalidad_desempeño}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Carga horaria</label>
                                        <input
                                            type="number"
                                            value={data.carga_horaria}
                                            onChange={(e) => setData('carga_horaria', e.target.value)}
                                            className="mt-1 block w-full rounded-md border-gray-300"
                                        />
                                        {errors.carga_horaria && (
                                            <p className="text-red-600 text-sm mt-1">{errors.carga_horaria}</p>
                                        )}
                                    </div>
                                </div>

                                <div className="flex items-center">
                                    <input
                                        id="es_activo"
                                        type="checkbox"
                                        checked={data.es_activo}
                                        onChange={(e) => setData('es_activo', e.target.checked)}
                                        className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
                                    />
                                    <label htmlFor="es_activo" className="ml-2 block text-sm text-gray-700">
                                        Activo
                                    </label>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Teléfono</label>
                                        <input
                                            type="text"
                                            value={data.telefono}
                                            onChange={(e) => setData('telefono', e.target.value)}
                                            className="mt-1 block w-full rounded-md border-gray-300"
                                        />
                                        {errors.telefono && <p className="text-red-600 text-sm mt-1">{errors.telefono}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Email</label>
                                        <input
                                            type="email"
                                            value={data.email}
                                            onChange={(e) => setData('email', e.target.value)}
                                            className="mt-1 block w-full rounded-md border-gray-300"
                                        />
                                        {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email}</p>}
                                    </div>
                                </div>


                                <div className="flex items-center justify-between space-x-3">
                                    <Link
                                        href={route('docentes.cargo.create', docente.id)}
                                        className="px-4 py-2 rounded-md border border-gray-300 text-gray-700"
                                    >
                                        Agregar Cargo
                                    </Link>
                                    <div className="flex space-x-3">
                                        <Link
                                            href={route('docentes.index')}
                                            className="px-4 py-2 rounded-md border border-gray-300 text-gray-700"
                                        >
                                            Cancelar
                                        </Link>
                                        <button
                                            type="submit"
                                            disabled={processing}
                                            className="px-4 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700"
                                        >
                                            Guardar cambios
                                        </button>                                        
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
