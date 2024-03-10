// Function to search members
function searchMembers() {
    const input = document.getElementById('searchInput').value.toLowerCase();
    const memberItems = document.getElementsByClassName('member-item');

    // Loop through all member items
    Array.from(memberItems).forEach(item => {
        const memberName = item.querySelector('.member-details').textContent.toLowerCase();
        // If the member name contains the search input, display the member item, otherwise hide it
        if (memberName.includes(input)) {
            item.style.display = 'flex';
        } else {
            item.style.display = 'none';
        }
    });
}

// Fetch members and populate the list
async function fetchMembers() {
    try {
        const response = await fetch('/api/members');
        const members = await response.json();

        const membersList = document.getElementById('membersList');
        membersList.innerHTML = '';

        members.forEach(member => {
            const li = document.createElement('li');
            li.classList.add('member-item');
            li.innerHTML = `
                <img src="/uploads/${member.imageUrl}" alt="Member Image">
                <div class="member-details">
                    <p>${member.firstName} ${member.lastName}</p>
                </div>
                <div class="action-buttons">
                    <button class="view-button" onclick="showMemberDetails('${member.firstName}', '${member.lastName}', '${member.dateOfBirth}', '${member.imageUrl}', '${member.gender}', '${member.telephone}', '${member.email}', '${member.maritalStatus}', '${member.location}', '${member.occupation}')">View</button>
                    <button class="edit-button" onclick="openEditPopup('${member.id}', '${member.firstName}', '${member.lastName}', '${member.dateOfBirth}', '${member.imageUrl}', '${member.gender}', '${member.tel}', '${member.email}', '${member.maritalStatus}', '${member.location}', '${member.occupation}')">Edit</button>
                    <button class="delete-button" onclick="deleteMember('${member.id}')">Delete</button>
                </div>
            `;
            // Append the list item to the member list
            membersList.appendChild(li);
        });

        // Update total members count
        document.getElementById('totalMembers').textContent = members.length;
    } catch (error) {
        console.error('Error fetching members:', error);
    }
}

// Show member details in popup
function showMemberDetails(firstName, lastName, dob, imageUrl, gender, tel, email, maritalStatus, location, occupation) {
    const memberDetailsContent = document.getElementById('memberDetailsContent');
    memberDetailsContent.innerHTML = `
        <img src="/uploads/${imageUrl}" alt="Member Image">
        <p>First Name: ${firstName}</p>
        <p>Last Name: ${lastName}</p>
        <p>Date of Birth: ${new Date(dob).toLocaleDateString()}</p>
        <p>Gender: ${gender}</p>
        <p>Telephone Number: ${tel}</p>
        <p>Email: ${email}</p>
        <p>Marital Status: ${maritalStatus}</p>
        <p>Location: ${location}</p>
        <p>Occupation: ${occupation}</p>
    `;
    // Show the popup
    document.getElementById('memberDetailsPopup').style.display = 'block';
}

// Close member details popup
function closeMemberDetailsPopup() {
    document.getElementById('memberDetailsPopup').style.display = 'none';
}

// Open edit popup
function openEditPopup(id, firstName, lastName, dob, imageUrl, gender, tel, email, maritalStatus, location, occupation) {
    const editForm = `
        <h2>Edit Member</h2>
        <label for="editFirstName">First Name:</label>
        <input type="text" id="editFirstName" name="editFirstName" value="${firstName}" required><br><br>
        
        <label for="editLastName">Last Name:</label>
        <input type="text" id="editLastName" name="editLastName" value="${lastName}" required><br><br>
        
        <label for="editDob">Date of Birth:</label>
        <input type="date" id="editDob" name="editDob" value="${dob}" required><br><br>

        <label for="editGender">Gender:</label>
        <select id="editGender" name="editGender" required>
            <option value="male" ${gender === 'male' ? 'selected' : ''}>Male</option>
            <option value="female" ${gender === 'female' ? 'selected' : ''}>Female</option>
            <option value="other" ${gender === 'other' ? 'selected' : ''}>Other</option>
        </select><br><br>
        
        <label for="editTelephone">Telephone Number:</label>
        <input type="tel" id="editTelephone" name="editTelephone" value="${tel}" required><br><br>

        <label for="editEmail">Email:</label>
        <input type="email" id="editEmail" name="editEmail" value="${email}" required><br><br>

        <label for="editMaritalStatus">Marital Status:</label>
        <select id="editMaritalStatus" name="editMaritalStatus" required>
            <option value="married" ${maritalStatus === 'married' ? 'selected' : ''}>Married</option>
            <option value="divorced" ${maritalStatus === 'Have a beloved' ? 'selected' : ''}>Have a beloved</option>
            <option value="widowed" ${maritalStatus === 'Dont have a beloved' ? 'selected' : ''}>Dont have a beloved</option>
        </select><br><br>

        <label for="editLocation">Location:</label>
        <input type="text" id="editLocation" name="editLocation" value="${location}" required><br><br>

        <label for="editOccupation">Occupation:</label>
        <input type="text" id="editOccupation" name="editOccupation" value="${occupation}" required><br><br>

        <label for="editImage">Profile Picture:</label>
        <input type="file" id="editImage" name="editImage" accept="image/*"><br><br>
        
        <button onclick="saveMemberChanges('${id}')">Save Changes</button>
    `;

    document.getElementById('memberDetailsContent').innerHTML = editForm;
    document.getElementById('memberDetailsPopup').style.display = 'block';
}

// Save member changes
async function saveMemberChanges(id) {
    const editFirstName = document.getElementById('editFirstName').value;
    const editLastName = document.getElementById('editLastName').value;
    const editDob = document.getElementById('editDob').value;
    const editGender = document.getElementById('editGender').value;
    const editTelephone = document.getElementById('editTelephone').value;
    const editEmail = document.getElementById('editEmail').value;
    const editMaritalStatus = document.getElementById('editMaritalStatus').value;
    const editLocation = document.getElementById('editLocation').value;
    const editOccupation = document.getElementById('editOccupation').value;
    const editImage = document.getElementById('editImage').files[0];

    const formData = new FormData();
    formData.append('firstName', editFirstName);
    formData.append('lastName', editLastName);
    formData.append('dob', editDob);
    formData.append('gender', editGender);
    formData.append('telephone', editTelephone);
    formData.append('email', editEmail);
    formData.append('maritalStatus', editMaritalStatus);
    formData.append('location', editLocation);
    formData.append('occupation', editOccupation);
    if (editImage) {
        formData.append('image', editImage);
    }

    try {
        const response = await fetch(`/api/members/${id}`, {
            method: 'PUT',
            body: formData
        });

        if (response.ok) {
            alert('Member details updated successfully!');
            closeMemberDetailsPopup();
            fetchMembers(); // Refresh member list
        } else {
            alert('Failed to update member details');
        }
    } catch (error) {
        console.error('Error updating member details:', error);
        alert('An error occurred while processing your request');
    }
}

// Delete member
async function deleteMember(id) {
    try {
        const response = await fetch(`/api/members/${id}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            alert('Member deleted successfully!');
            fetchMembers(); // Refresh member list
        } else {
            alert('Failed to delete member');
        }
    } catch (error) {
        console.error('Error deleting member:', error);
        alert('An error occurred while processing your request');
    }
}

document.addEventListener('DOMContentLoaded', function() {
    // Event listener for file input change
    document.querySelector('.image-upload-container').addEventListener('click', function() {
        document.getElementById('image').click();
    });

    // Event listener for file input change
    document.getElementById('image').addEventListener('change', function() {
        const file = this.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                const imagePreviewContainer = document.querySelector('.image-upload-container');
                imagePreviewContainer.style.backgroundImage = `url(${e.target.result})`;
                imagePreviewContainer.style.backgroundSize = 'cover'; // Ensure image fits container
                document.getElementById('cameraIcon').style.display = 'none';
            };
            reader.readAsDataURL(file);
        }
    });

    // Add event listener to display the "Add New Member" form
    document.getElementById('addMemberButton').addEventListener('click', function() {
        document.getElementById('addMemberForm').style.display = 'block';
    });

    // Add member form submission
    document.getElementById('newMemberForm').addEventListener('submit', async function(event) {
        event.preventDefault(); // Prevent form submission

        const formData = new FormData(this);

        try {
            const response = await fetch('/api/members', {
                method: 'POST',
                body: formData
            });

            if (response.ok) {
                alert('Member added successfully!');
                document.getElementById('newMemberForm').reset();
                const imagePreviewContainer = document.querySelector('.image-upload-container');
                imagePreviewContainer.style.backgroundImage = 'none';
                document.getElementById('cameraIcon').style.display = 'flex';
                document.getElementById('addMemberForm').style.display = 'none';
                fetchMembers(); // Refresh member list
            } else {
                alert('Failed to add member');
            }
        } catch (error) {
            console.error('Error adding member:', error);
            alert('An error occurred while processing your request');
        }
    });
    
    // Fetch members when the page loads
    fetchMembers();
});
