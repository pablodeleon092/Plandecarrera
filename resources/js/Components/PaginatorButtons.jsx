import React from 'react';
import { Link, router } from '@inertiajs/react';

export default function PaginatorButtons({ meta = null, paginator = null, onPageChange = null, routeName = null, routeParams = {}, window = 2 }) {
    // Support either a direct `meta` object (Laravel paginator meta)
    // or the full paginator object passed from the backend (`paginator`).
    let usedMeta = meta;

    if (!usedMeta && paginator) {
        // Common shapes: paginator.meta, or paginator.current_page/last_page at top level
        if (paginator.meta) {
            usedMeta = paginator.meta;
        } else {
            usedMeta = {
                current_page: paginator.current_page ?? paginator.page ?? 1,
                last_page: paginator.last_page ?? paginator.lastPage ?? (paginator.total && paginator.per_page ? Math.max(1, Math.ceil(paginator.total / paginator.per_page)) : 1),
            };
        }
    }

    if (!usedMeta) return null;

    const { current_page, last_page } = usedMeta;

    const goTo = (page) => {
        if (page < 1 || page > last_page) return;
        if (onPageChange) return onPageChange(page);
        if (routeName) return router.visit(route(routeName, { ...routeParams, page }));
        // fallback: use Inertia visit to current URL with query
        return router.visit(`${window.location.pathname}?page=${page}`);
    };

    const pages = [];
    const start = Math.max(1, current_page - window);
    const end = Math.min(last_page, current_page + window);

    for (let p = start; p <= end; p++) pages.push(p);

    return (
        <div className="mt-4 flex items-center justify-between">
            <div className="text-sm text-gray-600">
                {`Página ${current_page} de ${last_page}`}
            </div>
            <div className="inline-flex items-center space-x-5">
                <button
                    onClick={() => goTo(current_page - 1)}
                    disabled={current_page <= 1}
                    className="px-3 py-1 bg-gray-100 rounded disabled:opacity-50"
                >
                    Anterior
                </button>

                {pages.map((p) => (
                    <button 
                        key={p}
                        onClick={() => goTo(p)}
                        className={`px-3 py-1 rounded ${p === current_page ? 'bg-indigo-600 text-white' : 'bg-gray-100'}`}
                    >
                        {p}
                    </button>
                ))}

                <button
                    onClick={() => goTo(current_page + 1)}
                    disabled={current_page >= last_page}
                    className="px-3 py-1 bg-gray-100 rounded disabled:opacity-50"
                >
                    Siguiente
                </button>
            </div>
        </div>
    );
}
