import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import ComisionInfo from './Partials/ComisionInfo';
import ComisionDocentes from './Partials/ComisionDocentes';

export default function ShowComision({ auth, comision, docentes, allDocentes}) {

    const [currentTab, setCurrentTab] = useState('informacion');
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">Comisión: {comision.nombre}</h2>}
        >
            <Head title={`Comisión: ${comision.nombre}`} />

            <div className="bg-gray-50 py-8">
                <div className="container mx-auto px-4 max-w-5xl">

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
                                onClick={() => setCurrentTab('docentes')}
                                className={`px-4 py-2 rounded-lg font-semibold transition ${
                                    currentTab === 'comisiones'
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                                }`}
                            >
                                docentes
                            </button>
                        </div>
                    </div>

                    {/* Contenido dinámico */}
                    <div className="p-8">
                        {currentTab === 'informacion' ? (
                            <ComisionInfo comision={comision} />
                        ) : (
                            <ComisionDocentes comision={comision} docentes={docentes} allDocentes={allDocentes} />
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
