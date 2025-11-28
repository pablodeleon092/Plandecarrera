export default function DocentesList({ docentes }) {
    return (
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre Docente</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cargo</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dedicación</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sede</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Modalidad Docente</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Horas frente al aula</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Materias</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {docentes.map((docente, index) => (
                        <tr key={index}>
                            <td className="px-6 py-4 whitespace-nowrap">{docente.nombre}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{docente.cargo}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{docente.dedicacion}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{docente.sede}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{docente.modalidad}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{docente.horas}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{docente.materias}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
