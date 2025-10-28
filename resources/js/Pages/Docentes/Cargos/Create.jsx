import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, Link } from '@inertiajs/react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';

export default function Create({ auth, docente, dedicaciones,flash}) {
    
    // 1. Inicialización del estado del formulario con los NUEVOS CAMPOS
    const { data, setData, post, processing, errors } = useForm({
        cargo: '',
        dedicacion_id: '',
        docente_id: docente.id,
    });

    const submit = (e) => {
        e.preventDefault();
        // Envía la petición POST a la ruta correcta, pasando el ID del docente.
        post(route('docentes.cargo.store', { docente: docente.id }));
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Agregar Cargo a {docente.nombre}</h2>}
        >
            <Head title="Docente" />

            {flash?.error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {flash?.error}
                </div>
            )}

            <div className="py-12">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <form onSubmit={submit} className="p-6 space-y-6">
                            {/* Cargo */}
                            <div className="mt-4">
                                <InputLabel htmlFor="cargo" value="Cargo" />

                                <select
                                    id="cargo"
                                    name="cargo"
                                    value={data.cargo}
                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                                    onChange={(e) => setData('cargo', e.target.value)}
                                    required
                                >
                                    <option value="">-- Selecciona un cargo --</option>
                                    <option value="Titular">Titular</option>
                                    <option value="Asociado">Asociado</option>
                                    <option value="Adjunto">Adjunto</option>
                                    <option value="Jefe de Trabajos Practicos">Jefe de Trabajos Practicos</option>
                                    <option value="Ayudante de Primera">Ayudante de Primera</option>
                                </select>

                                <InputError message={errors.cargo} className="mt-2" />
                            </div>

                            {/* Dedicaciones */}
                            <div className="mt-4">
                                <InputLabel htmlFor="dedicacion" value="Dedicacion" />

                                <select
                                    id="dedicacion"
                                    name="dedicacion_id"
                                    value={data.dedicacion_id}
                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                                    onChange={(e) => setData('dedicacion_id', e.target.value)}
                                    required
                                >
                                    <option value="">-- Selecciona una dedicación --</option>
                                    {dedicaciones.map((d) => (
                                        <option key={d.id} value={d.id}>
                                            {d.nombre}
                                        </option>
                                    ))}
                                </select>

                                <InputError message={errors.dedicaciones} className="mt-2" />
                            </div>
                            <div className="flex justify-end space-x-4">
                                <Link
                                    href={route('docentes.edit', { docente: docente.id })}
                                    className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                >
                                    Cancelar
                                </Link>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
                                >
                                    {processing ? 'Guardando...' : 'Agregar Cargo'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
