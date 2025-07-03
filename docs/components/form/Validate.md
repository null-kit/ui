# Validate Component

A Vue 3 component that displays validation error messages with smooth animations. Automatically shows validation errors from the global validation state using the `useValidate` composable.

**Note**: All form components use `FormValidate` under the hood for consistent validation display across the entire form system:

- `FormControl` - Basic form input control
- `FormSelect` - Dropdown selection component
- `FormCheck` - Checkbox component
- `FormCheckGroup` - Group of checkboxes
- `FormTreeSelect` - Tree-structured selection component
- `FormEditor` - Rich text editor

## Props

| Prop   | Type     | Required | Description                      |
| ------ | -------- | -------- | -------------------------------- |
| `name` | `string` | Yes      | Field name to display errors for |

## Features

### Error Display

- **Automatic Detection**: Automatically shows errors from global validation state
- **Conditional Rendering**: Only displays when field has validation errors
- **Field-Specific**: Shows errors for the specific field name provided

### Animation

- **Slide Effect**: Slides up from below with opacity fade

### Styling

- **Error Styling**: Red background with white text for clear error indication
- **Positioning**: Absolute positioning below the form field
- **Shadow**: Subtle shadow for depth and visibility
- **Non-Interactive**: Pointer events disabled to prevent interference

## Usage Examples

## Technical Details

### Component Structure

- **Template**: Single transition-wrapped div with conditional rendering
- **Script**: Uses `useValidate` composable and defines `name` prop
- **Styling**: Utility classes for consistent error styling

### Validation Integration

- **Global State**: Reads from `useValidate().validate` reactive state
- **Field Mapping**: Uses `name` prop to access specific field errors
- **Automatic Updates**: Reactively updates when validation state changes

### Positioning Strategy

- **Absolute Positioning**: Positioned relative to parent container
- **Top Full**: Places error below the form field
- **Negative Margin**: Slight overlap for visual connection
- **Left Alignment**: Aligned with field content

## Dependencies

- **useValidate**: For validation state management
