export default function DataTable({ columns = [], data = [], onShow, onEdit, onDelete, emptyMessage = 'Sin registros.' }) {
    return (
        <table className="min-w-full divide-y divide-gray-200">
            <thead>
                <tr>
                    {columns.map((col, index) => (
                        <th
                            key={index}
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                            {col.label}
                        </th>
                    ))}
                    {(onEdit || onDelete) && (
                        <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Acciones
                        </th>
                    )}
                </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
                {data.length === 0 && (
                    <tr>
                        <td colSpan={columns.length + (onShow || onEdit || onDelete ? 1 : 0)} className="px-6 py-4 text-sm text-gray-500">
                            {emptyMessage}
                        </td>
                    </tr>
                )}
                {data.map((item) => (
                    <tr key={item.id}>
                        {columns.map((col, index) => (
                            <td
                                key={index}
                                className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                            >
                                {col.render ? col.render(item) : item[col.key]}
                            </td>
                        ))}
                        {(onShow || onEdit || onDelete) && (
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                {onShow && (
                                    <button
                                        className="text-indigo-600 hover:text-indigo-900 mr-3"
                                        onClick={() => onShow(item)}
                                    >
                                        Ver
                                    </button>
                                )}
                                {onEdit && (
                                    <button
                                        className="text-indigo-600 hover:text-indigo-900 mr-3"
                                        onClick={() => onEdit(item)}
                                    >
                                        Editar
                                    </button>
                                )}                               
                                {onDelete && (
                                    <button
                                        className="text-red-600 hover:text-red-900"
                                        onClick={() => onDelete(item)}
                                    >
                                        Eliminar
                                    </button>
                                )}
                            </td>
                        )}
                    </tr>
                ))}
            </tbody>
        </table>
    );
}
