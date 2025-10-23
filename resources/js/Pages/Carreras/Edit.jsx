import React, { useState, useEffect } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';

import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

export default function Edit({ auth, plan, carrera, materiasEnPlan, materiasDisponibles,flash }) {
    const [enPlan, setEnPlan] = useState(materiasEnPlan || []);
    const [disponibles, setDisponibles] = useState(materiasDisponibles || []);

    const onDragEnd = (result) => {
        const { source, destination } = result;
        if (!destination) return;

        // Reorden dentro de la misma lista
        if (source.droppableId === destination.droppableId) {
            const list = source.droppableId === 'enPlan' ? Array.from(enPlan) : Array.from(disponibles);
            const [moved] = list.splice(source.index, 1);
            list.splice(destination.index, 0, moved);

            if (source.droppableId === 'enPlan') setEnPlan(list);
            else setDisponibles(list);
            return;
        }

        // Mover entre listas
        const sourceList = source.droppableId === 'enPlan' ? Array.from(enPlan) : Array.from(disponibles);
        const destList = destination.droppableId === 'enPlan' ? Array.from(enPlan) : Array.from(disponibles);
        const [moved] = sourceList.splice(source.index, 1);
        destList.splice(destination.index, 0, moved);

        if (source.droppableId === 'enPlan') {
            setEnPlan(sourceList);
            setDisponibles(destList);
        } else {
            setEnPlan(destList);
            setDisponibles(sourceList);
        }
    };

    // useForm for submitting via Inertia.put to CarreraController.update
    const { data, setData, put, processing } = useForm({
        materias: enPlan.map(m => m.id),
        plan: plan.id,
    });

    // Keep form data in sync with enPlan
    useEffect(() => {
        setData('materias', enPlan.map(m => m.id));
    }, [enPlan]);

    const guardarCambios = (e) => {
        if (e && e.preventDefault) e.preventDefault();

        if (!carrera || !carrera.id) {
            alert('No se encontró la carrera para guardar.');
            return;
        }

        // Send a PUT to the carreras.update route: /carreras/{id}
        put(`/carreras/${carrera.id}`);
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="text-xl font-semibold leading-tight text-gray-800">Editar Plan</h2>}
        >
            <Head title={`Editar Plan - ${carrera.nombre}`} />

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <h2 className="text-2xl font-semibold mb-4 mt-4">Editar Plan de {carrera.nombre}</h2>
                {flash?.success && (
                    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                        {flash?.success}
                    </div>
                )}
                <DragDropContext onDragEnd={onDragEnd}>
                    <table className="w-full table-auto border-collapse mb-4">
                        <thead>
                            <tr>
                                <th className="px-4 py-2 text-left">Materias en el plan</th>
                                <th className="px-4 py-2 text-left">Materias disponibles</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td className="align-top px-4 py-2">
                                    <Droppable droppableId="enPlan">
                                        {(provided) => (
                                            <div ref={provided.innerRef} {...provided.droppableProps} className="border p-4 min-h-[200px]">
                                                {enPlan.length === 0 && <p className="text-sm text-gray-500">No hay materias en el plan.</p>}
                                                {enPlan.map((materia, index) => (
                                                    <Draggable key={materia.id} draggableId={`enPlan-${materia.id}`} index={index}>
                                                        {(provided) => (
                                                            <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} className="p-2 mb-2 bg-gray-50 rounded" style={provided.draggableProps.style}>
                                                                {materia.nombre}
                                                            </div>
                                                        )}
                                                    </Draggable>
                                                ))}
                                                {provided.placeholder}
                                            </div>
                                        )}
                                    </Droppable>
                                </td>
                                <td className="align-top px-4 py-2">
                                    <Droppable droppableId="disponibles">
                                        {(provided) => (
                                            <div ref={provided.innerRef} {...provided.droppableProps} className="border p-4 min-h-[200px]">
                                                {disponibles.length === 0 && <p className="text-sm text-gray-500">No hay materias disponibles.</p>}
                                                {disponibles.map((materia, index) => (
                                                    <Draggable key={materia.id} draggableId={`disponibles-${materia.id}`} index={index}>
                                                        {(provided) => (
                                                            <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} className="p-2 mb-2 bg-gray-50 rounded" style={provided.draggableProps.style}>
                                                                {materia.nombre}
                                                            </div>
                                                        )}
                                                    </Draggable>
                                                ))}
                                                {provided.placeholder}
                                            </div>
                                        )}
                                    </Droppable>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </DragDropContext>

                <div className="flex justify-end">
                    <button
                        type="button"
                        onClick={guardarCambios}
                        className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-semibold transition shadow-lg"
                    >
                        Guardar cambios
                    </button>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
