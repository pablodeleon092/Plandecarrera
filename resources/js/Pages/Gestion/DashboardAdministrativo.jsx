import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function DashboardAdministrativo({
    user,
    instituto,
    datosIncompletos,
    comisionesActuales,
    docentesActivos,
    tareasPendientes,
    cambiosRecientes,
    kpis,
    currentYear,
    currentSemester
}) {
    return (
        <AuthenticatedLayout
            user={user}
            header={
                <div>
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Dashboard Administrativo
                    </h2>
                    <p className="text-sm text-gray-600 mt-1">
                        {instituto?.nombre} - {currentYear} - Cuatrimestre {currentSemester}
                    </p>
                </div>
            }
        >
            <Head title="Dashboard Administrativo" />

            <div className="py-8">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">

                    {/* KPIs Row */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        {/* KPI: Registros Incompletos */}
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6 border-l-4 border-red-500">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Registros Incompletos</p>
                                    <p className="text-3xl font-bold text-gray-900 mt-2">
                                        {kpis.registros_incompletos.valor}
                                    </p>
                                    <p className="text-sm text-gray-500 mt-1">
                                        {kpis.registros_incompletos.porcentaje}% del total ({kpis.registros_incompletos.total})
                                    </p>
                                </div>
                                <div className="text-red-500 text-4xl">⚠️</div>
                            </div>
                        </div>

                        {/* KPI: Comisiones */}
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6 border-l-4 border-blue-500">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Comisiones del Período</p>
                                    <p className="text-3xl font-bold text-gray-900 mt-2">
                                        {kpis.comisiones.creadas}
                                    </p>
                                    <p className="text-sm text-gray-500 mt-1">
                                        {kpis.comisiones.pendientes} pendientes de {kpis.comisiones.total_materias} materias
                                    </p>
                                </div>
                                <div className="text-blue-500 text-4xl">📚</div>
                            </div>
                        </div>

                        {/* KPI: Docentes Activos */}
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6 border-l-4 border-green-500">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Docentes Activos</p>
                                    <p className="text-3xl font-bold text-gray-900 mt-2">
                                        {kpis.docentes_activos.valor}
                                    </p>
                                    <p className="text-sm text-gray-500 mt-1">
                                        de {kpis.docentes_activos.total} totales
                                    </p>
                                </div>
                                <div className="text-green-500 text-4xl">👥</div>
                            </div>
                        </div>
                    </div>

                    {/* Main Content Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                        {/* Datos Incompletos Widget */}
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-6 border-b border-gray-200">
                                <h3 className="text-lg font-semibold text-gray-800 flex items-center justify-between">
                                    <span>📋 Datos Incompletos de Docentes</span>
                                    <span className="text-sm font-normal text-red-600">
                                        {datosIncompletos.total} docentes
                                    </span>
                                </h3>
                            </div>
                            <div className="p-6">
                                {datosIncompletos.total === 0 ? (
                                    <p className="text-gray-500 text-center py-4">
                                        ✅ Todos los docentes tienen datos completos
                                    </p>
                                ) : (
                                    <div className="space-y-3 max-h-96 overflow-y-auto">
                                        {datosIncompletos.docentes.map((docente) => (
                                            <div key={docente.id} className="border-l-4 border-red-400 bg-red-50 p-3 rounded">
                                                <div className="flex justify-between items-start">
                                                    <div className="flex-1">
                                                        <p className="font-medium text-gray-900">{docente.nombre_completo}</p>
                                                        <p className="text-sm text-gray-600">Legajo: {docente.legajo}</p>
                                                        <div className="mt-1 flex flex-wrap gap-2">
                                                            {docente.campos_faltantes.map((campo, idx) => (
                                                                <span key={idx} className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-red-200 text-red-800">
                                                                    Falta: {campo}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                    <Link
                                                        href={route('docentes.edit', docente.id)}
                                                        className="ml-3 text-sm text-indigo-600 hover:text-indigo-900 font-medium"
                                                    >
                                                        Editar
                                                    </Link>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Tareas Pendientes Widget */}
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-6 border-b border-gray-200">
                                <h3 className="text-lg font-semibold text-gray-800 flex items-center justify-between">
                                    <span>⏳ Tareas Pendientes</span>
                                    <span className="text-sm font-normal text-yellow-600">
                                        {tareasPendientes.total} tareas
                                    </span>
                                </h3>
                            </div>
                            <div className="p-6">
                                {tareasPendientes.total === 0 ? (
                                    <p className="text-gray-500 text-center py-4">
                                        ✅ No hay tareas pendientes
                                    </p>
                                ) : (
                                    <div className="space-y-3 max-h-96 overflow-y-auto">
                                        {tareasPendientes.tareas.map((tarea, idx) => (
                                            <div key={idx} className="border-l-4 border-yellow-400 bg-yellow-50 p-3 rounded">
                                                <div className="flex justify-between items-start">
                                                    <div className="flex-1">
                                                        <p className="font-medium text-gray-900">{tarea.nombre}</p>
                                                        {tarea.codigo && (
                                                            <p className="text-sm text-gray-600">Código: {tarea.codigo}</p>
                                                        )}
                                                        <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-yellow-200 text-yellow-800 mt-1">
                                                            {tarea.tipo}
                                                        </span>
                                                    </div>
                                                    {tarea.tipo === 'Sin comisión creada' && (
                                                        <Link
                                                            href={route('comisiones.create', { materia_id: tarea.id })}
                                                            className="ml-3 text-sm text-indigo-600 hover:text-indigo-900 font-medium"
                                                        >
                                                            Crear
                                                        </Link>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Comisiones Actuales Widget */}
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-6 border-b border-gray-200">
                                <h3 className="text-lg font-semibold text-gray-800 flex items-center justify-between">
                                    <span>📖 Comisiones del Cuatrimestre Actual</span>
                                    <span className="text-sm font-normal text-blue-600">
                                        {comisionesActuales.total} comisiones
                                    </span>
                                </h3>
                            </div>
                            <div className="p-6">
                                {comisionesActuales.total === 0 ? (
                                    <p className="text-gray-500 text-center py-4">
                                        No hay comisiones para el período actual
                                    </p>
                                ) : (
                                    <div className="space-y-3 max-h-96 overflow-y-auto">
                                        {comisionesActuales.comisiones.map((comision) => (
                                            <div key={comision.id} className="border border-gray-200 bg-gray-50 p-3 rounded hover:bg-gray-100 transition">
                                                <div className="flex justify-between items-start">
                                                    <div className="flex-1">
                                                        <p className="font-medium text-gray-900">{comision.materia}</p>
                                                        <p className="text-sm text-gray-600">
                                                            {comision.nombre} - {comision.turno} ({comision.modalidad})
                                                        </p>
                                                        <div className="mt-2 space-y-1">
                                                            {comision.docentes.length === 0 ? (
                                                                <span className="text-xs text-red-600">Sin docentes asignados</span>
                                                            ) : (
                                                                comision.docentes.slice(0, 3).map((doc, idx) => (
                                                                    <p key={idx} className="text-xs text-gray-700">
                                                                        • {doc.nombre} - <span className="text-gray-500">{doc.cargo}</span>
                                                                    </p>
                                                                ))
                                                            )}
                                                            {comision.docentes.length > 3 && (
                                                                <p className="text-xs text-gray-500">
                                                                    ... y {comision.docentes.length - 3} más
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <Link
                                                        href={route('comisiones.show', comision.id)}
                                                        className="ml-3 text-sm text-indigo-600 hover:text-indigo-900 font-medium"
                                                    >
                                                        Ver
                                                    </Link>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Docentes Activos Widget */}
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-6 border-b border-gray-200">
                                <h3 className="text-lg font-semibold text-gray-800 flex items-center justify-between">
                                    <span>👨‍🏫 Docentes Activos del Instituto</span>
                                    <span className="text-sm font-normal text-green-600">
                                        {docentesActivos.total} docentes
                                    </span>
                                </h3>
                            </div>
                            <div className="p-6">
                                {docentesActivos.total === 0 ? (
                                    <p className="text-gray-500 text-center py-4">
                                        No hay docentes activos
                                    </p>
                                ) : (
                                    <div className="space-y-3 max-h-96 overflow-y-auto">
                                        {docentesActivos.docentes.map((docente) => (
                                            <div key={docente.id} className="border border-gray-200 bg-gray-50 p-3 rounded hover:bg-gray-100 transition">
                                                <div className="flex justify-between items-start">
                                                    <div className="flex-1">
                                                        <p className="font-medium text-gray-900">{docente.nombre_completo}</p>
                                                        <div className="text-sm text-gray-600 mt-1 space-y-1">
                                                            {docente.email && (
                                                                <p>📧 {docente.email}</p>
                                                            )}
                                                            {docente.telefono && (
                                                                <p>📱 {docente.telefono}</p>
                                                            )}
                                                            <p>⏰ {docente.carga_horaria}hs - {docente.modalidad}</p>
                                                            {docente.total_materias > 0 && (
                                                                <p className="text-xs text-indigo-600">
                                                                    {docente.total_materias} materia{docente.total_materias !== 1 ? 's' : ''} asignada{docente.total_materias !== 1 ? 's' : ''}
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <Link
                                                        href={route('docentes.show', docente.id)}
                                                        className="ml-3 text-sm text-indigo-600 hover:text-indigo-900 font-medium"
                                                    >
                                                        Ver
                                                    </Link>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Cambios Recientes Widget - Full Width */}
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg lg:col-span-2">
                            <div className="p-6 border-b border-gray-200">
                                <h3 className="text-lg font-semibold text-gray-800 flex items-center justify-between">
                                    <span>🕒 Historial de Cambios Recientes</span>
                                    <span className="text-sm font-normal text-gray-600">
                                        Últimas {cambiosRecientes.total} modificaciones
                                    </span>
                                </h3>
                            </div>
                            <div className="p-6">
                                {cambiosRecientes.total === 0 ? (
                                    <p className="text-gray-500 text-center py-4">
                                        No hay cambios recientes
                                    </p>
                                ) : (
                                    <div className="space-y-2 max-h-96 overflow-y-auto">
                                        {cambiosRecientes.cambios.map((cambio) => (
                                            <div key={cambio.id} className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded transition">
                                                <div className="flex-shrink-0 w-2 h-2 bg-indigo-500 rounded-full mt-2"></div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm text-gray-900">
                                                        <span className="font-medium">{cambio.docente}</span>
                                                        {' '}asignado a{' '}
                                                        <span className="font-medium">{cambio.materia}</span>
                                                        {' '}({cambio.comision})
                                                    </p>
                                                    <p className="text-xs text-gray-500 mt-1">
                                                        {cambio.cargo} • {cambio.fecha_relativa}
                                                    </p>
                                                </div>
                                                <div className="flex-shrink-0 text-xs text-gray-400">
                                                    {cambio.fecha}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
