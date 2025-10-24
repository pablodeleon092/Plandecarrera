// resources/js/Pages/Docentes/Index.jsx

import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm} from '@inertiajs/react';
// Si tienes un componente de paginación, impórtalo:
// import Pagination from '@/Components/Pagination'; 

export default function Index({ auth, docentes, flash }) {

    // docs.data contiene el array de docentes.
    const docentesList = docentes.data;

    // Necesitamos useForm para la funcionalidad de BORRAR (DELETE)
    const { delete: inertiaDelete } = useForm({});

    // Función que maneja la eliminación de un docente
    const handleDelete = (id, nombre, apellido) => {
        if (confirm(`¿Estás seguro de eliminar a ${nombre} ${apellido}? Esta acción no se puede deshacer.`)) {
            inertiaDelete(route('docentes.destroy', id), {
                preserveScroll: true,
                onSuccess: () => { },
            });
        }
    };


    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Gestión de Docentes</h2>}
        >
            <Head title="Docentes" />


            {flash?.error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {flash?.error}
                </div>
            )}

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Mensaje Flash de Éxito */}
                {flash?.success && (
                    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                        {flash?.success}
                    </div>
                )}

                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">

                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-medium text-gray-900">Listado de Docentes</h3>

                                {/* Botón para ir a la vista de creación */}
                                <Link
                                    href={route('docentes.create')}
                                    className="bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition duration-150 ease-in-out"
                                >
                                    + Agregar Docente
                                </Link>
                            </div>

                            {/* Tabla de Docentes */}
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Legajo</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre Completo</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Carga Horaria</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Modalidad de Desempeño</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cargos</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {docentesList.map((docente) => (
                                            <tr key={docente.id}>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{docente.legajo}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{`${docente.apellido}, ${docente.nombre}`}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{docente.carga_horaria}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{docente.modalidad_desempeño}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {docente.cargos.length > 0
                                                        ? docente.cargos
                                                            .map(cargo => (
                                                                <Link 
                                                                    key={cargo.id}
                                                                    href={route('cargos.show', cargo.id)}
                                                                    className="text-indigo-600 hover:underline"
                                                                >
                                                                    {cargo.nombre}
                                                                </Link>
                                                            ))
                                                            .reduce((prev, curr) => [prev, ', ', curr])  // ✅ ahora sí no se rompe
                                                        : '—'}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex space-x-2">

                                                    {/* Botón EDITAR */}
                                                    <Link
                                                        href={route('docentes.edit', docente.id)}
                                                        className="text-indigo-600 hover:text-indigo-900"
                                                    >
                                                        Editar
                                                    </Link>

                                                    {/* Botón ELIMINAR (usando useForm para DELETE) */}
                                                    <button
                                                        onClick={() => handleDelete(docente.id, docente.nombre, docente.apellido)}
                                                        className="text-red-600 hover:text-red-900"
                                                    >
                                                        Eliminar
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Paginación de Inertia (Si tienes un componente Pagination) */}
                            {/* {docentes.links && <div className="mt-4"><Pagination links={docentes.links} /></div>} */}

                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}