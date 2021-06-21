# react-admin-google-autocomplete
Google Autocomplete input for [react-admin](https://marmelab.com/react-admin/) projects.

# Install
At the moment this action is not available but you can get the source from the repository.

# Usage
```jsx
import { Edit, SimpleForm, TextInput } from 'react-admin';
// import ReactAdminGoogleAutocompleteInput component
import ReactAdminGoogleAutocompleteInput from 'ReactAdminGoogleAutocompleteInput';

// use ReactAdminGoogleAutocompleteInput in Edit form
export const EntityEdit = props => (
  <Edit {...props}>
    <SimpleForm>
      <TextInput source="id" />
      <TextInput source="name" />
      <ReactAdminGoogleAutocompleteInput
        source="address"
        apiKey="<YOUR_GOOGLE_APP_KEY>"
      />
    </SimpleForm>
  </Edit>
);
```
