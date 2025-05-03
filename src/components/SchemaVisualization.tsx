import React from 'react';
import TableCard from './TableCard';
import { tables } from '../data/schemaData';
const SchemaVisualization = () => {
  return <div className="w-full overflow-auto">
      <div className="min-w-[1200px] p-4 relative">
        <svg className="absolute top-0 left-0 w-full h-full pointer-events-none" style={{
        zIndex: 0
      }}>
          {tables.flatMap(table => (table.relationships || []).map((rel, idx) => <line key={`${table.name}-${rel.to}-${idx}`} x1={table.position.x + table.position.width / 2} y1={table.position.y + table.position.height / 2} x2={tables.find(t => t.name === rel.to)?.position.x + tables.find(t => t.name === rel.to)?.position.width / 2} y2={tables.find(t => t.name === rel.to)?.position.y + tables.find(t => t.name === rel.to)?.position.height / 2} stroke="#94a3b8" strokeWidth="1" strokeDasharray="4" />))}
        </svg>
        {tables.map(table => <div key={table.name} style={{
        position: 'absolute',
        left: `${table.position.x}px`,
        top: `${table.position.y}px`,
        zIndex: 1
      }}>
            <TableCard name={table.name} fields={table.fields} />
          </div>)}
      </div>
    </div>;
};
export default SchemaVisualization;