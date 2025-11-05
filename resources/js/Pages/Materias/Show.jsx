import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import MateriaInfo from './Partials/MateriaInfo';
import MateriaComisiones from './Partials/MateriaComisiones';

export default function Show({ auth, materia, comisiones }) {
    const [currentTab, setCurrentTab] = useState('informacion');

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">Materia: {materia.nombre}</h2>}
        >
            <Head title={`Materia: ${materia.nombre}`} />

            <div className="bg-gray-50 py-8">
                <div className="container mx-auto px-4 max-w-5xl">
                    {/* Header y botones */}
                    {/* ... resto del código ... */}

                    {/* Tabs */}
                    <div className="px-8 pt-6">
                        <div className="flex gap-4 mb-6">
                            <button
                                onClick={() => setCurrentTab('informacion')}
                                className={`px-4 py-2 rounded-lg font-semibold transition ${
                                    currentTab === 'informacion'
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                                }`}
                            >
                                Información
                            </button>
                            <button
                                onClick={() => setCurrentTab('comisiones')}
                                className={`px-4 py-2 rounded-lg font-semibold transition ${
                                    currentTab === 'comisiones'
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                                }`}
                            >
                                Comisiones
                            </button>
                        </div>
                    </div>

                    {/* Contenido dinámico */}
                    <div className="p-8">
                        {currentTab === 'informacion' ? (
                            <MateriaInfo materia={materia} />
                        ) : (
                            <MateriaComisiones comisiones={comisiones} />
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
