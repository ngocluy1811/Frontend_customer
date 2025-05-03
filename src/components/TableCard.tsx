import React from 'react';
interface Field {
  name: string;
  type: string;
  isPrimary?: boolean;
}
interface TableCardProps {
  name: string;
  fields: Field[];
}
const TableCard: React.FC<TableCardProps> = ({
  name,
  fields
}) => {
  return <div className="w-64 bg-white rounded-md shadow-md overflow-hidden border border-gray-200">
      <div className="bg-blue-600 text-white p-2 font-medium text-sm">
        {name}
      </div>
      <div className="divide-y divide-gray-200">
        {fields.map((field, index) => <div key={index} className="px-3 py-2 flex justify-between items-center text-sm">
            <div className="flex items-center">
              {field.isPrimary && <span className="mr-1 text-yellow-500">🔑</span>}
              <span>{field.name}</span>
            </div>
            <span className="text-gray-500 text-xs">{field.type}</span>
          </div>)}
      </div>
    </div>;
};
export default TableCard;