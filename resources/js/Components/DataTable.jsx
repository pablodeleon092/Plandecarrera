import { Link } from '@inertiajs/react';
import ToggleStatusButton from './ToggleStatusButton'; // Asegúrate de que la importación esté

export default function DataTable({
    columns = [],
    data = [],
    onShow,
    onEdit,
    onDelete,
    onToggleStatus,
    emptyMessage = 'Sin registros.',
    emptyIcon,
    actions = true,
    hover = true,
    containerClassName = '',
    dense = false,
    statusKey = 'estado',
    disableScroll = false
}) {
    const EmptyIcon = () => (
        emptyIcon || (
            <svg className="w-12 h-12 text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
        )
    );

    const ActionButtons = ({ item }) => (
        <div className="flex items-center justify-end gap-3">
            {onShow && (
                typeof onShow === 'function' ? (
                    <button
                        onClick={() => onShow(item)}
                        className="text-blue-600 hover:text-blue-900 transition"
                        title="Ver detalle"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                    </button>
                ) : (
                    <Link
                        href={typeof onShow === 'string' ? onShow.replace(':id', item.id) : `${onShow}/${item.id}`}
                        className="text-blue-600 hover:text-blue-900 transition"
                        title="Ver detalle"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                    </Link>
                )
            )}
            {onEdit && (
                typeof onEdit === 'function' ? (
                    <button
                        onClick={() => onEdit(item)}
                        className="text-green-600 hover:text-green-900 transition"
                        title="Editar"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                    </button>
                ) : (
                    <Link
                        href={typeof onEdit === 'string' ? onEdit.replace(':id', item.id) : `${onEdit}/${item.id}/edit`}
                        className="text-green-600 hover:text-green-900 transition"
                        title="Editar"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                    </Link>
                )
            )}
            {onDelete && (
                <button
                    onClick={() => onDelete(item)}
                    className="text-red-600 hover:text-red-900 transition"
                    title="Eliminar"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                </button>
            )}
            {onToggleStatus && (
                <ToggleStatusButton
                    isActive={!!item[statusKey]}
                    onClick={() => onToggleStatus(item)}
                />
            )}
        </div>
    );

    const paddingClass = dense ? 'px-3 py-2' : 'px-6 py-4';
    const headerPaddingClass = dense ? 'px-3 py-2' : 'px-6 py-3';

    return (
        <div className={`bg-white rounded-lg shadow overflow-hidden ${containerClassName}`}>
            <div className={disableScroll ? '' : 'overflow-x-auto'}>
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            {columns.map((col, index) => (
                                <th
                                    key={index}
                                    className={`${headerPaddingClass} text-left text-xs font-medium text-gray-500 uppercase tracking-wider`}
                                >
                                    {col.label}
                                </th>
                            ))}
                            {actions && (onShow || onEdit || onDelete || onToggleStatus) && (
                                <th className={`${headerPaddingClass} text-right text-xs font-medium text-gray-500 uppercase tracking-wider`}>
                                    Acciones
                                </th>
                            )}
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {data.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={columns.length + (actions && (onShow || onEdit || onDelete || onToggleStatus) ? 1 : 0)}
                                    className="px-6 py-8 text-center text-gray-500"
                                >
                                    <div className="flex flex-col items-center">
                                        <EmptyIcon />
                                        <p className="text-lg">{emptyMessage}</p>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            data.map((item) => (
                                <tr key={item.id} className={hover ? 'hover:bg-gray-50 transition' : ''}>
                                    {columns.map((col, index) => (
                                        <td
                                            key={index}
                                            className={`${paddingClass} ${col.nowrap !== false ? 'whitespace-nowrap' : ''} ${col.className || 'text-sm text-gray-900'
                                                }`}
                                        >
                                            {col.render ? col.render(item) : item[col.key]}
                                        </td>
                                    ))}
                                    {actions && (onShow || onEdit || onDelete || onToggleStatus) && (
                                        <td className={`${paddingClass} whitespace-nowrap text-right text-sm font-medium`}>
                                            <ActionButtons item={item} />
                                        </td>
                                    )}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
