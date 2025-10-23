import { Link } from '@inertiajs/react';

export default function ListHeader({ title, buttonLabel, buttonRoute }) {
    return (
        <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900">{title}</h3>
            <Link
                href={buttonRoute}
                className="bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition"
            >
                {buttonLabel}
            </Link>
        </div>
    );
}
