import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, Link } from '@inertiajs/react';

export default function Create({ auth, materias, flash }) {
    
    
    const { data, setData, post, processing, errors } = useForm({
        codigo: '', 
        nombre: '',
        turno: 'Mañana',
        modalidad: 'presencial', 
        sede: 'Ushuaia', 
        cuatrimestre: '1ro',
        anio: '',
        horas_teoricas: '',
        horas_practicas: '',  
        horas_totales: 0,
        id_materia: '',
    });



    const submit = (e) => {
        e.preventDefault();
        // Envía la petición POST. Inertia maneja la redirección o los errores 422.
        post(route('comisiones.store')); 
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Crear Nuevo Comision</h2>}
        >
            <Head title="Crear Comision" />
            
            {flash?.error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {flash?.error}
                </div>
            )}

            <div className="py-12">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <form onSubmit={submit} className="p-6 space-y-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="codigo" className="block text-sm font-medium text-gray-700">Codigo</label>
                                    <input
                                        id="codigo"
                                        type="text" 
                                        value={data.codigo}
                                        onChange={(e) => setData('codigo', e.target.value)}
                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                                        required
                                    />
                                    {errors.codigo && <div className="text-red-600 mt-1 text-sm">{errors.codigo}</div>}
                                </div>
                                <div>
                                    <label htmlFor="materia" className="block text-sm font-medium text-gray-700">Materia</label>
                                    <select
                                        id="id_materia"
                                        value={data.id_materia}
                                        onChange={(e) => setData('id_materia', e.target.value)}
                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                                        required
                                    >
                                        <option value="">Seleccionar materia</option>
                                        {materias.map((materia) => (
                                            <option key={materia.id} value={materia.id}>
                                                {materia.nombre} ({materia.codigo})
                                            </option>
                                        ))}
                                    </select>
                                    {errors.id_materia && <div className="text-red-600 mt-1 text-sm">{errors.id_materia}</div>}
                                </div>
                            </div>
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
                                    <label htmlFor="turno" className="block text-sm font-medium text-gray-700">Turno</label>
                                    <select
                                        id="turno"
                                        value={data.turno}
                                        onChange={(e) => setData('turno', e.target.value)}
                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                                        required
                                    >
                                        <option value="Mañana">Mañana</option>
                                        <option value="Tarde">Tarde</option>
                                    </select>
                                    {errors.turno && <div className="text-red-600 mt-1 text-sm">{errors.turno}</div>}
                                </div>
                            </div>
                            
                            {/* Modalidad Desempeño (ENUM) y Carga Horaria (Integer) */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="modalidad" className="block text-sm font-medium text-gray-700">Modalidad</label>
                                    <select
                                        id="modalidad"
                                        value={data.modalidad}
                                        onChange={(e) => setData('modalidad', e.target.value)}
                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                                        required
                                    >
                                        <option value="Presencial">Presencial</option>
                                        <option value="Virtual">Virtual</option>
                                        <option value="Mixta">Mixta</option>
                                    </select>
                                    {errors.modalidad && <div className="text-red-600 mt-1 text-sm">{errors.modalidad}</div>}
                                </div>
                                <div>
                                    <label htmlFor="sede" className="block text-sm font-medium text-gray-700">Sede</label>
                                    <select
                                        id="sede"
                                        value={data.sede}
                                        onChange={(e) => setData('sede', e.target.value)}
                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                                        required
                                    >
                                        <option value="Ushuaia">Ushuaia</option>
                                        <option value="Rio Grande">Rio Grande</option>
                                        <option value="Ushuaia/Rio Grande">Ushuaia/Rio Grande</option>
                                    </select>
                                    {errors.sede && <div className="text-red-600 mt-1 text-sm">{errors.sede}</div>}
                                </div>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="cuatrimestre" className="block text-sm font-medium text-gray-700">Cuatrimestre</label>
                                    <select
                                        id="cuatrimestre"
                                        value={data.cuatrimestre}
                                        onChange={(e) => setData('cuatrimestre', e.target.value)}
                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                                        required
                                    >
                                        <option value="1ro">1ro</option>
                                        <option value="2do">2do</option>
                                    </select>
                                    {errors.cuatrimestre && <div className="text-red-600 mt-1 text-sm">{errors.cuatrimestre}</div>}
                                </div>
                                <div>
                                    <label htmlFor="anio" className="block text-sm font-medium text-gray-700">Año</label>
                                    <select
                                        id="anio"
                                        value={data.anio}
                                        onChange={(e) => setData('anio', e.target.value)}
                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                                        required
                                    >
                                        <option value="">Seleccionar año</option>
                                        {[...Array(4)].map((_, i) => {
                                            const year = new Date().getFullYear() + i;
                                            return (
                                                <option key={year} value={year}>
                                                    {year}
                                                </option>
                                            );
                                        })}
                                    </select>
                                    {errors.anio && <div className="text-red-600 mt-1 text-sm">{errors.anio}</div>}
                                </div>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="horas_teoricas" className="block text-sm font-medium text-gray-700">Horas Teoria</label>
                                    <input
                                        id="horas_teoricas"
                                        type="number"
                                        value={data.horas_teoricas}
                                        onChange={(e) => setData('horas_teoricas', e.target.value)}
                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                                        required
                                    />
                                    {errors.horas_teoricas && <div className="text-red-600 mt-1 text-sm">{errors.horas_teoricas}</div>}
                                </div>
                                <div>
                                    <label htmlFor="horas_practicas" className="block text-sm font-medium text-gray-700">Horas Practica</label>
                                    <input
                                        id="horas_practicas"
                                        type="number"
                                        value={data.horas_practicas}
                                        onChange={(e) => setData('horas_practicas', e.target.value)}
                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                                        required
                                    />
                                    {errors.horas_practicas && <div className="text-red-600 mt-1 text-sm">{errors.horas_practicas}</div>}
                                </div>
                            </div>

                            <div className="flex justify-end space-x-4">
                                <Link
                                    href={route('comisiones.index')}
                                    className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                >
                                    Cancelar
                                </Link>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
                                >
                                    {processing ? 'Guardando...' : 'Guardar Comision'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}