export default function DocentesList({ docentes }) {
    // Force HMR update
    return (
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3">Nombre Docente</th>
                        <th className="px-6 py-3">Cargo</th>
                        <th className="px-6 py-3">Dedicación</th>
                        <th className="px-6 py-3">Materias</th>
                        <th className="px-6 py-3">Modalidad</th>
                        <th className="px-6 py-3">Horas</th>
                    </tr>
                </thead>

                <tbody className="bg-white divide-y divide-gray-200">
                    {docentes?.data?.map((doc) => (
                        <tr key={doc.id}>
                            <td className="px-6 py-4">{doc.nombre}</td>

                            <td className="px-6 py-4">
                                {doc.cargos.map(c => c.nombre).join(', ')}
                            </td>

                            <td className="px-6 py-4">
                                {doc.cargos.map(c => c.dedicacion).join(', ')}
                            </td>

                            <td className="px-6 py-4">
                                {doc.materias.join(', ')}
                            </td>

                            <td className="px-6 py-4">{doc.modalidad}</td>

                            <td className="px-6 py-4">{doc.horas}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
