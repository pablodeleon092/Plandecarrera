import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router, useForm } from '@inertiajs/react';
import DataTable from '@/Components/DataTable';
import ListHeader from '@/Components/ListHeader';
import PaginatorButtons from '@/Components/PaginatorButtons';


export default function Index({ auth, carreras}) {
    const carrerasList = carreras?.data || [];
    const { delete: inertiaDelete } = useForm({});

    const columns = [
        { label: 'Carrera', key: 'nombre' },
        { label: 'Instituto', render: (carrera) => carrera.instituto?.siglas || '' },
        { label: 'Modalidad', key: 'modalidad' },
        { label: 'Sede', key: 'sede' },
    ];

    return (
        <AuthenticatedLayout
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Carreras</h2>}
        >
            <Head title="Carreras" />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <ListHeader
                    title="Listado de Carreras"
                    buttonLabel="Agregar Carrera"
                    buttonRoute={route('carreras.create')}
                />
                <div className="bg-white border border-gray-200 shadow-sm rounded-lg overflow-hidden p-4">
                    <DataTable
                        columns={columns}
                        data={carrerasList}
                        emptyMessage="No hay carreras para mostrar."
                        onShow={(carrera) => router.visit(route('carreras.show', carrera.id))}
                        onEdit={(carrera) => router.visit(route('carreras.edit', carrera.id))}
                        onDelete={(carrera) => {
                            if (confirm('¿Eliminar carrera?')) {
                                inertiaDelete(route('carreras.destroy', carrera.id));
                            }
                        }}
                    />

                    <PaginatorButtons meta={carreras?.meta} paginator={carreras} routeName={'carreras.index'} />

                </div>
            </div>
        </AuthenticatedLayout>
    );
}
