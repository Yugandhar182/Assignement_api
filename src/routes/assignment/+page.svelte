<script>
    import { onMount , afterUpdate } from 'svelte';
    import { auth } from '$lib/firebase/firebase.js';
    import { goto } from '$app/navigation';
    import { Table, TableBody, TableBodyCell, TableBodyRow, TableHead, TableHeadCell } from 'flowbite-svelte';
    import { getDatabase, ref, onValue,set } from 'firebase/database'; // Import Firebase Realtime Database functions
  
   
    let email = '';
    let isBlue = true;
  
    onMount(() => {
      // Create an interval to toggle the color every 2 seconds
      const interval = setInterval(() => {
        isBlue = !isBlue;
      }, 1000);
  
      // Clean up the interval when the component is unmounted
      return () => clearInterval(interval);
    });
  

  
    onMount(() => {
      // Fetch the user data from Firebase Authentication
      auth.onAuthStateChanged((user) => {
        if (user) {
          const userData = {
         
            firstname: user.firstName,
            lastName: user.lastName,
          };
          users = [...users, userData];
        } else {
          console.log('User is signed out.');
        }
      });
  
      // Fetch data from Firebase Realtime Database
      const db = getDatabase();
      const usersRef = ref(db, 'users');
  
      onValue(usersRef, (snapshot) => {
        if (snapshot.exists()) {
          // Convert the snapshot value to an array of users
          const userData = snapshot.val();
          const userList = Object.keys(userData).map((key) => userData[key]);
          users = userList;
        } else {
          // Handle the case where there is no data
          console.log('No user data in the database.');
        }
      });
    }); let newUser = {
    firstName: '',
    lastName: '',
  };

  let isModalOpen = false;

  function handleAdd() {
    // Set isModalOpen to true to open the modal
    isModalOpen = true;
  }

  // Function to handle the form submission in the modal
  function handleSave(event) {
    event.preventDefault();

    // Perform any necessary validation here
    addUserToDatabase(newUser);
    // Assuming you want to add the new user to the Firebase Realtime Database
    // Create a reference to the database and set the user data
    const db = getDatabase();
    const newUserRef = ref(db, 'users/' + newUser.firstName); // You can use a unique identifier as the key

    set(newUserRef, newUser)
      .then(() => {
        console.log('User data added to the database.');
        
        // Add the new user to the local users array immediately
        users = [...users, newUser];

        // Clear the newUser object for the next entry
        newUser = {
          firstName: '',
          lastName: '',
        };

        // Close the modal after saving
        isModalOpen = false;
      })
      .catch((error) => {
        console.error('Error adding user data:', error);
      });
  }
  
    let users = [
    
        // ... add more users here
    ];
    onMount(() => {
        // Fetch data from Firebase Realtime Database
        const db = getDatabase();
        const usersRef = ref(db, 'users'); // Assuming 'users' is the path to your user data in the database

        onValue(usersRef, (snapshot) => {
            if (snapshot.exists()) {
                // Convert the snapshot value to an array of users
                const userData = snapshot.val();
                const userList = Object.values(userData); // Use Object.values to convert object to an array
                users = userList;
            } else {
                // Handle the case where there is no data
                console.log('No user data in the data.');
            }
        });
    });

  
  let dataGrid;
  
  onMount(() => {
    dataGrid = new DevExpress.ui.dxDataGrid("#dataGrid", {
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
        mode: "popup",
        form: {
          labelLocation: "top",
        },
        popup: {
          showTitle: true,
        },
        texts: {
          saveRowChanges: "Save",
          cancelRowChanges: "Cancel",
          deleteRow: "Delete",
          confirmDeleteMessage: "Are you sure you want to delete this record?",
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
      
    });
    });

    afterUpdate(() => {
        if (dataGrid) {
            dataGrid.option('dataSource', users);
        }
    });

    function addUserToDatabase(newUser) {
        const db = getDatabase();
        const newUserRef = push(ref(db, 'users')); // Use push to generate a new unique key

        set(newUserRef, newUser)
            .then(() => {
                console.log('User data added to the database.');

                // No need to manually update the local users array; it will be updated automatically when Firebase data changes.

                // Clear the newUser object for the next entry
                newUser = {
                    firstName: '',
                    lastName: '',
                };

                // Close the modal after saving
                isModalOpen = false;
            })
            .catch((error) => {
                console.error('Error adding user data:', error);
            });
    }

  
  </script>
  
  <main>
    <div id="dataGrid"></div>
  </main>
 
  
  
  <style>
   
  </style>