<script>
  import { onMount, afterUpdate } from 'svelte';
  import { auth } from '$lib/firebase/firebase.js';
  import { goto } from '$app/navigation';
  import { Table, TableBody, TableBodyCell, TableBodyRow, TableHead, TableHeadCell } from 'flowbite-svelte';
  import { getDatabase, ref, onValue, push } from 'firebase/database'; // Import Firebase Realtime Database functions
  
  let users = [];
  let dataGrid;

  // Initialize Firebase
  const db = getDatabase();
  const usersRef = ref(db, 'users');

  onMount(() => {
    onValue(usersRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        users = Object.values(data);
        if (!dataGrid) {
          createDataGrid();
        }
      }
    });
  });

  const createDataGrid = () => {
    dataGrid = new DevExpress.ui.dxDataGrid('#dataGrid', {
      dataSource: users,
      columns: [
        { dataField: 'firstName', caption: 'FirstName' },
        { dataField: 'lastName', caption: 'lastName' },
      ],
      showBorders: true,
      filterRow: {
        visible: true,
      },
      editing: {
        allowDeleting: true,
        allowAdding: true,
        allowUpdating: true,
        mode: 'popup',
        form: {
          labelLocation: 'top',
        },
        popup: {
          showTitle: true,
        },
        texts: {
          saveRowChanges: 'Save',
          cancelRowChanges: 'Cancel',
          deleteRow: 'Delete',
          confirmDeleteMessage: 'Are you sure you want to delete this record?',
        },
      },
      paging: {
        pageSize: 10,
      },
      pager: {
        showPageSizeSelector: true,
        allowedPageSizes: [10, 20],
        showInfo: true,
      },
      // Event handler for when a new row is added
      onRowInserted: (e) => {
        const newData = e.data;
        // Push the new data to Firebase
        push(usersRef, newData);
      },
    });
  };

  afterUpdate(() => {
    if (!dataGrid && users.length > 0) {
      createDataGrid();
    }
  });
</script>

<main>
  <div id="dataGrid"></div>
</main>

<style>
  /* Add your styles here if needed */
</style>
