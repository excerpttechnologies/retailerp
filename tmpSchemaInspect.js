const mongoose = require('mongoose');
const schema1 = new mongoose.Schema({
  columns: [
    {
      key: String,
      label: String,
      type: String,
      sortable: Boolean,
      exportable: Boolean,
    },
  ],
});
const ColumnSchema = new mongoose.Schema(
  {
    key: String,
    label: String,
    type: String,
    sortable: Boolean,
    exportable: Boolean,
  },
  { _id: false }
);
const schema2 = new mongoose.Schema({ columns: [ColumnSchema] });
const sample = [{ key: 'abc', label: 'abc', type: 'text', sortable: true, exportable: true }];
console.log('schema1 columns path instance', schema1.path('columns').instance);
console.log('schema1 columns caster', schema1.path('columns').caster?.instance);
console.log('schema1 columns schema', !!schema1.path('columns').schema);
console.log('schema1 columns options', schema1.path('columns').options);
console.log('schema2 columns path instance', schema2.path('columns').instance);
console.log('schema2 columns caster', schema2.path('columns').caster?.instance);
console.log('schema2 columns schema', !!schema2.path('columns').schema);
console.log('schema2 columns options', schema2.path('columns').options);
try {
  console.log('schema1 cast', schema1.path('columns').cast(sample));
} catch (err) {
  console.error('schema1 cast err', err.message);
}
try {
  console.log('schema2 cast', schema2.path('columns').cast(sample));
} catch (err) {
  console.error('schema2 cast err', err.message);
}
try {
  console.log('schema1 new doc', new mongoose.Document({ columns: sample }, { schema: schema1 }).toObject());
} catch (err) {
  console.error('schema1 new doc err', err.message);
}
try {
  console.log('schema2 new doc', new mongoose.Document({ columns: sample }, { schema: schema2 }).toObject());
} catch (err) {
  console.error('schema2 new doc err', err.message);
}
