import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router, useForm } from '@inertiajs/react';
import DataTable from '@/Components/DataTable';
import ListHeader from '@/Components/ListHeader';


export default function Index({ auth, users }) {
    const userList = users?.data || [];
    const { delete: inertiaDelete } = useForm({});

    const columns = [
        { label: 'Usuario', key: 'name' },
        { label: 'Nombre Completo', render: (user) => `${user.nombre || ''} ${user.apellido || ''}`.trim() },
        { label: 'Email', key: 'email' },
        { label: 'Activo', render: (user) => user.is_activo ? 'Sí' : 'No' },
        { label: 'Cargo', key: 'cargo' },
    ];

    return (
        <AuthenticatedLayout
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Usuarios</h2>}
        >
            <Head title="Usuarios" />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <ListHeader
                    title="Listado de Docentes"
                    buttonLabel="Agregar Usuario"
                    buttonRoute={route('users.create')}
                />
                <div className="bg-white border border-gray-200 shadow-sm rounded-lg overflow-hidden p-4">
                    <DataTable
                        columns={columns}
                        data={userList}
                        emptyMessage="No hay usuarios para mostrar."
                        onEdit={(user) => router.visit(route('users.show', user.id))}
                        onDelete={(user) => {
                            if (confirm('¿Eliminar usuario?')) {
                                inertiaDelete(route('users.destroy', user.id));
                            }
                        }}
                    />
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
