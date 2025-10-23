import TextInput from '@/Components/TextInput';

export default function TableFilters({ filters = [], onChange, className = '' }) {
    return (
        <div className={`grid grid-cols-1 md:grid-cols-3 gap-4 ${className}`}>
            {filters.map((filter, index) => (
                <div key={index}>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        {filter.label}
                    </label>
                    {filter.type === 'select' ? (
                        <select
                            value={filter.value}
                            onChange={(e) => onChange(filter.key, e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">{filter.placeholder || 'Todos'}</option>
                            {filter.options.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    ) : (
                        <TextInput
                            type={filter.type || 'text'}
                            placeholder={filter.placeholder}
                            value={filter.value}
                            onChange={(e) => onChange(filter.key, e.target.value)}
                            className="w-full"
                        />
                    )}
                </div>
            ))}
        </div>
    );
}