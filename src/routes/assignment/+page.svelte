<script>
  import { onMount, afterUpdate } from 'svelte';
  import { getDatabase, ref, onValue, set } from 'firebase/database';
  import { goto } from '$app/navigation';
  import { Navbar, NavBrand, NavLi, NavUl, NavHamburger,Button } from 'flowbite-svelte';
  import { Input, Label, Helper } from 'flowbite-svelte';
  import { auth } from '$lib/firebase/firebase.js';


  let localDataGrid;
  let isAuthenticated = false; // Initialize a loading state

//  if the user is authenticated when the component mounts
    onMount(async () => {
  // Check if the user is authenticated
    if (auth.currentUser) {
    isAuthenticated = true; // User is authenticated
    } else {
  // If the user is not authenticated, redirect them to the login page
    goto('/'); 
    }
    });


 
 

const localData = typeof localStorage !== 'undefined' ? JSON.parse(localStorage.getItem('userData')) || [] : [];

  const createLocalDataGrid = () => {
    localDataGrid = new DevExpress.ui.dxDataGrid('#localDataGrid', {
      dataSource: localData,
      columns: [
        { dataField: 'rollnumber', caption: 'Roll Number' },
        { dataField: 'fullname', caption: 'Full Name' },
        { dataField: 'assignment', caption: 'Assignment' },
        { dataField: 'description', caption: 'Description' },
        { dataField: 'status', caption: 'Status' },
        { dataField: 'remarks', caption: 'Remarks' },


       
        // Add columns for local storage data as needed
      ],   showBorders: true,
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
          allowAdding:'add'
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
        

        // Store the new data locally in localStorage
        const localData = JSON.parse(localStorage.getItem('userData')) || [];
        localData.push(newData);
        localStorage.setItem('userData', JSON.stringify(localData));
        console.log('New Data:', newData);
      }, 
      onRowRemoved: (e) => {
      const deletedData = e.data;

      // Retrieve the current local data from local storage
      const localData = JSON.parse(localStorage.getItem('userData')) || [];

      // Find the index of the deleted data in the localData array
      const indexToDelete = localData.findIndex(item => item.fullname === deletedData.fullname && item.rollnumber === deletedData.rollnumber);

      if (indexToDelete !== -1) {
        // Remove the deleted data from the localData array
        localData.splice(indexToDelete, 1);

        // Update the local storage with the modified data
        localStorage.setItem('userData', JSON.stringify(localData));
        console.log('Deleted Data:', deletedData);
      }
    },
    // Event handler for when a row is updated (edited)
onRowUpdated: (e) => {
  const updatedData = e.data;

  // Retrieve the current local data from local storage
  const localData = JSON.parse(localStorage.getItem('userData')) || [];

  // Find the index of the updated data in the localData array based on a unique identifier, if available.
  // In this example, I'm assuming each data item has a unique identifier called '__KEY__'.
  const indexToUpdate = localData.findIndex(item => item.__KEY__ === updatedData.__KEY__);

  if (indexToUpdate !== -1) {
    // Update the data in the localData array with the edited data
    localData[indexToUpdate] = updatedData;

    // Update the local storage with the modified data
    localStorage.setItem('userData', JSON.stringify(localData));
    console.log('Updated Data:', updatedData);
  } else {
    console.log('Data not found:', updatedData);
  }
},

 
    });
  };

  afterUpdate(() => {
    if (!localDataGrid && localData.length > 0) {
      createLocalDataGrid();
    }
  });
  onMount(() => {
  createLocalDataGrid();
});
async function handleLogout() {
  try {
    // Remove user data from localStorage
    localStorage.removeItem('user');

    // Redirect to the login page
    goto('/');
  } catch (error) {
    console.error("Error logging out:", error.message);
  }
}

</script>

<main>
 
  <Navbar style="background-color: rgb(51, 51, 232)">
    <NavUl >
     
      
  <Button  on:click={handleLogout} style="background-color:red;position: absolute; top: 10px; right: 10px;"  >Logout</Button>
 
 
</NavUl>
</Navbar>

<h1 style="color:green;font-size:28px;font-weight:bold" >Create  Assignments</h1>
<div class="container">
  <div  id="localDataGrid"></div>
</div>
 </main>



<style>
 .container{

  margin-top: 70px;
 
 }


</style>
