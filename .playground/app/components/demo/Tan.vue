<template>
  <fieldset id="tan" class="min-w-0">
    <legend>Tan</legend>

    <AppTanTable :data :columns nested-key="children">
      <template #value="{ cell, row }">
        {{ cell }} - <b>{{ row.status.name }}</b>
      </template>
    </AppTanTable>
  </fieldset>
</template>

<script setup lang="ts">
const data = [
  {
    id: '1',
    value: 91,
    title: 'Implement Authentication',
    description: 'Set up OAuth2 with JWT tokens',
    status: { id: 's1', name: 'In Progress' },
    priority: { id: 'p1', name: 'High' },
    dueDate: '2023-09-15',
    children: [
      {
        id: '1.1',
        value: 91.1,
        title: 'qweqweqw',
        description: 'asdasdsad',
        status: { id: 's1', name: 'In Progress' },
        priority: { id: 'p1', name: 'High' },
        dueDate: '2023-09-15'
      },
      {
        id: '1.2',
        value: 91.2,
        title: 'dghgdfsf',
        description: 'dfgdfgdfg',
        status: { id: 's2', name: 'To Do' },
        priority: { id: 'p2', name: 'Medium' },
        dueDate: '2023-09-20'
      },
      {
        id: '1.3',
        value: 91.3,
        title: 'hgkjhldgfg',
        description: 'gfjfhgfhgfhgf',
        status: { id: 's1', name: 'In Progress' },
        priority: { id: 'p1', name: 'High' },
        dueDate: '2023-09-10'
      }
    ]
  },
  {
    id: '2',
    value: 92,
    title: 'Create Dashboard UI',
    description: 'Design and implement main dashboard',
    status: { id: 's2', name: 'To Do' },
    priority: { id: 'p2', name: 'Medium' },
    dueDate: '2023-09-20',
    children: [
      {
        id: '2.1',
        value: 92.1,
        title: 'Implement Authentication',
        description: 'Set up OAuth2 with JWT tokens',
        status: { id: 's1', name: 'In Progress' },
        priority: { id: 'p1', name: 'High' },
        dueDate: '2023-09-15'
      },
      {
        id: '2.2',
        value: 92.2,
        title: 'Create Dashboard UI',
        description: 'Design and implement main dashboard',
        status: { id: 's2', name: 'To Do' },
        priority: { id: 'p2', name: 'Medium' },
        dueDate: '2023-09-20'
      }
    ]
  },
  {
    id: '3',
    value: 93,
    title: 'API Documentation',
    description: 'Document all API endpoints using Swagger',
    status: { id: 's1', name: 'In Progress' },
    priority: { id: 'p1', name: 'High' },
    dueDate: '2023-09-10'
  },
  {
    id: '4',
    value: 94,
    title: 'Database Optimization',
    description: 'Improve query performance and add indexes',
    status: { id: 's3', name: 'Done' },
    priority: { id: 'p3', name: 'Low' },
    dueDate: '2023-08-30'
  },
  {
    id: '5',
    value: 95,
    title: 'User Testing',
    description: 'Conduct user testing sessions',
    status: { id: 's2', name: 'To Do' },
    priority: { id: 'p2', name: 'Medium' },
    dueDate: '2023-09-25'
  }
];

const columns = (column: ColumnHelper<(typeof data)[number]>): ColumnDef<(typeof data)[number]>[] => [
  {
    header: 'ID',
    accessorKey: 'id',
    size: 50,
    footer: ({ table }) => {
      return table.getCoreRowModel().flatRows.reduce((acc, row) => acc + Number(row.original.id), 0);
    }
  },
  {
    header: 'Value',
    accessorKey: 'value'
  },
  column.group({
    header: 'Main',
    columns: [
      {
        accessorKey: 'title',
        header: 'Title',
        enablePinning: false,
        size: 137
      },
      {
        accessorKey: 'priority',
        header: 'Priority',
        enableGrouping: true,
        accessorFn: ({ priority }) => priority.name
      }
    ]
  }),
  column.group({
    header: 'Extra',
    columns: [
      {
        accessorKey: 'description',
        header: 'Description'
      },
      {
        accessorKey: 'dueDate',
        header: 'Due Date',
        cell: (info) => formatDate(info.getValue())
      }
    ]
  })
];
</script>
