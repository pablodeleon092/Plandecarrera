import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState, useMemo } from 'react';
import ListHeader from '@/Components/ListHeader';
import DataTable from '@/Components/DataTable';
import TableFilters from '@/Components/TableFilters';
import PaginatorButtons from '@/Components/PaginatorButtons';

export default function Index({ auth, carreras }) {
    const [filters, setFilters] = useState({
        search: '',
        modalidad: '',
        sede: ''
    });

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    // Get unique modalidades and sedes for filter options
    const modalidades = [...new Set(carreras.data.map(c => c.modalidad))].filter(Boolean);
    const sedes = [...new Set(carreras.data.map(c => c.sede))].filter(Boolean);

    const filterConfig = [
        {
            key: 'search',
            label: 'Buscar',
            type: 'text',
            value: filters.search,
            placeholder: 'Buscar por nombre o instituto...'
        },
        {
            key: 'modalidad',
            label: 'Modalidad',
            type: 'select',
            value: filters.modalidad,
            options: modalidades.map(m => ({ value: m, label: m }))
        },
        {
            key: 'sede',
            label: 'Sede',
            type: 'select',
            value: filters.sede,
            options: sedes.map(s => ({ value: s, label: s }))
        }
    ];

    const filteredData = useMemo(() => {
        return carreras.data.filter(carrera => {
            const matchSearch = !filters.search || 
                carrera.nombre.toLowerCase().includes(filters.search.toLowerCase()) ||
                (carrera.instituto?.siglas || '').toLowerCase().includes(filters.search.toLowerCase());
            const matchModalidad = !filters.modalidad || carrera.modalidad === filters.modalidad;
            const matchSede = !filters.sede || carrera.sede === filters.sede;
            
            return matchSearch && matchModalidad && matchSede;
        });
    }, [carreras.data, filters]);

    const columns = [
        {
            key: 'nombre',
            label: 'Carrera',
            className: 'text-sm font-medium text-gray-900',
            nowrap: false
        },
        {
            key: 'instituto',
            label: 'Instituto',
            render: (carrera) => (
                <span className="text-sm text-gray-900">
                    {carrera.instituto?.siglas || '-'}
                </span>
            )
        },
        {
            key: 'modalidad',
            label: 'Modalidad',
            render: (carrera) => (
                <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                    {carrera.modalidad || '-'}
                </span>
            )
        },
        {
            key: 'sede',
            label: 'Sede',
            render: (carrera) => (
                <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                    {carrera.sede || '-'}
                </span>
            )
        }
        ,
        {
            key: 'estado',
            label: 'Estado',
            render: (carrera) => (
                <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    carrera.estado === 'activa' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                }`}>
                    {carrera.estado === 'activa' ? 'Activa' : 'Inactiva'}
                </span>
            )
        }
    ];

    const handleDelete = (carrera) => {
        if (confirm('¿Estás seguro de eliminar esta carrera?')) {
            router.delete(route('carreras.destroy', carrera.id));
        }
    };

    const handleToggleStatus = (carrera) => {
        // Realiza la petición para cambiar el estado directamente, sin confirmación.
        router.patch(route('carreras.toggleStatus', carrera.id), {}, { preserveScroll: true });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="text-xl font-semibold leading-tight text-gray-800">Gestión de Carreras</h2>}
        >
            <Head title="Carreras" />
            
            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <ListHeader
                        title="Listado de Carreras"
                        buttonLabel="Agregar Carrera"
                        buttonRoute={route('carreras.create')}
                    />
                    <div className="bg-white rounded-lg shadow p-6 mb-6">
                        <TableFilters 
                            filters={filterConfig}
                            onChange={handleFilterChange}
                        />
                    </div>

                    <div className="bg-white rounded-lg shadow overflow-hidden">
                        <DataTable 
                            columns={columns}
                            data={filteredData}
                            onShow={(carrera) => router.visit(route('carreras.show', carrera.id))}
                            onEdit={(carrera) => router.visit(route('carreras.edit', carrera.id))}
                            onDelete={handleDelete}
                            onToggleStatus={handleToggleStatus}
                            hover={true}
                            emptyMessage="No se encontraron carreras"
                            emptyIcon={
                                <svg className="w-12 h-12 text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                </svg>
                            }
                        />
                    </div>

                    <PaginatorButtons meta={carreras?.meta} paginator={carreras} routeName={'carreras.index'} />

                    <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-white rounded-lg shadow p-4">
                            <p className="text-sm text-gray-600">Total Carreras</p>
                            <p className="text-2xl font-bold text-gray-900">{carreras.meta?.total || carreras.data.length}</p>
                        </div>
                        <div className="bg-white rounded-lg shadow p-4">
                            <p className="text-sm text-gray-600">Modalidades</p>
                            <p className="text-2xl font-bold text-blue-600">
                                {modalidades.length}
                            </p>
                        </div>
                        <div className="bg-white rounded-lg shadow p-4">
                            <p className="text-sm text-gray-600">Sedes</p>
                            <p className="text-2xl font-bold text-green-600">
                                {sedes.length}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
