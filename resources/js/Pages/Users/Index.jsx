import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Index ({ auth, users})
{
    const userList = users?.data || [];

    const { delete: inertiaDelete } = useForm({});

    return (
        <AuthenticatedLayout
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">
                Usuarios
            </h2>} 
        >
            <Head title="Usuarios" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                {/* Alerta de éxito */}

                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium text-gray-900">Listado de Docentes</h3>
                        <Link
                            href={route('users.create')}
                            className="bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition duration-150 ease-in-out"
                        >
                        Agregar Usuario
                        </Link>
                </div>
                <div className="bg-white border border-gray-200 shadow-sm rounded-lg overflow-hidden">
                    <div className="p-4">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usuario</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre Completo</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Activo</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cargo</th>
                            <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                        </tr>
                    </thead>

                    <tbody className="bg-white divide-y divide-gray-200">
                        {userList.length === 0 && (
                            <tr>
                                <td colSpan={6} className="px-6 py-4 text-sm text-gray-500">No hay usuarios para mostrar.</td>
                            </tr>
                        )}

                        {userList.map((user) => (
                            <tr key={user.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{`${user.nombre || ''} ${user.apellido || ''}`.trim()}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.is_activo ? 'Sí' : 'No'}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.cargo ?? '-'}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <Link href={route('users.show', user.id)} className="text-indigo-600 hover:text-indigo-900 mr-3">Actualizar</Link>
                                    <button
                                        onClick={() => {
                                            if (confirm('¿Eliminar usuario?')) {
                                                inertiaDelete(route('users.destroy', user.id));
                                            }
                                        }}
                                        className="text-red-600 hover:text-red-900"
                                    >Eliminar</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
            
        </AuthenticatedLayout>
    );

}