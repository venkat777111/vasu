async function fetchEmployees() {
  try {
    const response = await fetch('http://localhost:3000/employees');
    if (!response.ok) {
      throw new Error('Failed to fetch employees');
    }
    const employees = await response.json();
    console.log('Fetched employees:', employees);
    const tableBody = document.querySelector('#table tbody');
    tableBody.innerHTML = '';
    if (employees.length > 0) {
      employees.forEach(employee => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${employee.employeeId}</td>
          <td>${employee.name}</td>
          <td>${employee.age}</td>
          <td>${employee.email}</td>
          <td>${employee.gender}</td>
        `;
        tableBody.appendChild(row);
      });
      document.getElementById('table').style.display = 'table';
    } else {
      document.getElementById('table').style.display = 'none';
    }
  } catch (error) {
    console.error('Error:', error);
    alert('Error fetching employees');
  }
}


document.addEventListener('DOMContentLoaded', () => {
  const table = document.getElementById('table');
  if (table) {
    table.style.display = 'none';
  }

  const filterForm = document.getElementById('filterForm');
  if (filterForm) {
    filterForm.addEventListener('submit', async function(event) {
      event.preventDefault();
      const gender = document.getElementById('fgen').value;
      const age = document.getElementById('fage').value;
      const name = document.getElementById('fname').value;
      const employeeId = document.getElementById('fid').value;
      const queryString = new URLSearchParams({
        gender,
        age,
        name,
        employeeId
      }).toString();
      try {
        const response = await fetch(`http://localhost:3000/employee/filter?${queryString}`, {
          method: 'GET',
        });
        if (!response.ok) {
          throw new Error('Failed to fetch employees');
        }
        const employees = await response.json();
        console.log('Fetched employees by gender:', response);
        const tableBody = document.querySelector('#table tbody');
        tableBody.innerHTML = '';
        if (employees.length > 0) {
          employees.forEach(employee => {
            const row = document.createElement('tr');
            row.innerHTML = `
              <td>${employee.employeeId}</td>
              <td>${employee.name}</td>
              <td>${employee.age}</td>
              <td>${employee.email}</td>
              <td>${employee.gender}</td>
            `;
            tableBody.appendChild(row);
          });
          document.getElementById('table').style.display = 'table';
        } else {
          document.getElementById('table').style.display = 'none';
        }
      } catch (error) {
        console.error('Error:', error);
        alert('Error fetching employees by gender');
      }
    });
  }

  const employeeForm = document.getElementById('employeeForm');
  if (employeeForm) {
    employeeForm.addEventListener('submit', async function(event) {
      event.preventDefault();
      const employeeId = document.getElementById('employeeId').value;
      const name = document.getElementById('name').value;
      const age = document.getElementById('age').value;
      const email = document.getElementById('email').value;
      const gender = document.getElementById('gender').value;

      try {
        const response = await fetch('http://localhost:3000/employees', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ employeeId, name, age, email, gender }),
        });

        if (!response.ok) {
          throw new Error('Failed to add employee');
        }
        alert('Employee added successfully');
      //  fetchEmployees(); // Refresh the employee list
      } catch (error) {
        console.error('Error:', error);
        alert('Error adding employee');
      }
    });
  }

  const updateForm = document.getElementById('updateForm');
  if (updateForm) {
    updateForm.addEventListener('submit', async function(event) {
      event.preventDefault();
      const id = document.getElementById('uemployeeId').value;
      const name = document.getElementById('uname').value;
      const age = document.getElementById('uage').value;
      const email = document.getElementById('uemail').value;
      const gender = document.getElementById('ugender').value;
      const data = {};

      if (name) data.name = name;
      if (age) data.age = age;
      if (email) data.email = email;
      if (gender) data.gender = gender;

      try {
        const response = await fetch(`http://localhost:3000/employee/${id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });

        if (!response.ok) {
          throw new Error('Failed to update employee');
        }

        const updatedEmployee = await response.json();
        console.log('Updated employee:', updatedEmployee);

        alert('Employee updated successfully');
      } catch (error) {
        console.error('Error:', error);
        alert('Error updating employee');
      }
    });
  }

  const deleteForm = document.getElementById('deleteForm');
  if (deleteForm) {
    deleteForm.addEventListener('submit', async function(event) {
      event.preventDefault();
      const id = document.getElementById('demployeeId').value;

      try {
        const response = await fetch(`http://localhost:3000/employee/${id}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          throw new Error('Failed to delete employee');
        }

        alert('Employee deleted successfully');
      } catch (error) {
        console.error('Error:', error);
        alert('Error deleting employee');
      }
    });
  }

});